// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";


// Uncomment this line to use console.log
// import "hardhat/console.sol";

//ScrolLend for Scroll Open Hackathon

// Contract Flow 

// 1. User deposit collateral

// 2. User borrow collateral that is in correlation with the health for a specified period of time

// 3. User can supply to Lending Pool Contract

// 4. If user health factor is below threshold, the system can liquidate the user or another user can liquidate the borrowers position 

// 5. Lenders interest rate is dependent on the compound utilization ratio of each borrowed assets  i.e (Total Token borrowed/Total token supplied) 



contract LendingBorrowingContract  is ReentrancyGuard , OwnerIsCreator {

    //Errors
    error LendingBorrowingContract__TokenNotAllowed();
    error LendingBorrowingContract__CollateralDepositFailed();
    error LendingBorrowingContract__AmountNotMoreThanZero();
    error LendingBorrowingContract__LiquidityDepositFailed();
    error LendingBorrowingContract__HealthFactorIsBroken(uint256 healthFactor);
    error LendingBorrowingContract__CollateralTokenLengthIsZero();
    error LendingBorrowingContract__RepaymentDateLessThanBorrowersDate();
    error LendingBorrowingContract__AmountNotAllowed();
    
    error LendingBorrowingContract__LoanRepaymentFailed();
    error LendingBorrowingContract__BorrowingFailed();

    error LendingBorrowingContract__LiquidityPoolWithdrawalFailed();
    error LendingBorrowingContract__CollateralWithdrawalFailed();
    error LendingBorrowingContract__BorrowedAmountIsNotZero();
    error LendingBorrowingContract__YouCantLiquidateMoreThanHalfOfPosition();
    error LendingBorrowingContract__LiquidationFailed();
 
 

    modifier  isTokenAllowed (address token) {
        if (priceFeeds[token] == address(0)){
            revert LendingBorrowingContract__TokenNotAllowed();
        }
        _;
    }

    modifier  isGreaterThanZero (uint256 amount) {
        if (amount <= 0){
            revert LendingBorrowingContract__AmountNotMoreThanZero();
        }
        _;
    }

    modifier  checkForCollateralTokensLength () {
        if (collateralTokens.length <= 0){
            revert LendingBorrowingContract__CollateralTokenLengthIsZero();
        }
        _;
    }

     modifier  checkRepaymentDateIsGreatherThanBorrowDate (uint repaymentDate, uint borrowDate) {

        if (repaymentDate < borrowDate){
            revert LendingBorrowingContract__RepaymentDateLessThanBorrowersDate();
        }
        _;
    }



    struct LoanStruct {
        uint256 amount;
        uint256 borrowTimestamp;
        uint256 repaymentTimestamp;
    }

    struct AddLiquidityStruct {
        uint256 amount;
        uint256 withdrawalTime;
        uint256 addedAt;
    }


 
    //Events
    event LendingBorrowingContract_LiquidityDepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LiquidityWithdrawn(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LoanRepayed(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_CollateralWithdrawn(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract__PortfolioReBalanced(address indexed);
    event LendingBorrowingContract__DepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract__BorrowSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);

    //CCIP VARIABLES

// Store the last received messageId.
    // uint56  lastReceivedAction;
 


    //Variables
    uint256 HEALTH_FACTOR = 1_000_000_000_000_000_000; 
    uint256 WEI_PRECISION = 1_000_000_000_000_000_000;
    uint256 PRICE_FEED_PRECISION = 10_000_000_000;
    uint256 HEALTH_FACTOR_THRESHOLD = 750_000_000_000_000_000; //75% of the healthfactor
    address []  public collateralTokens;
    uint56 LIQUIDATION_PERCENTAGE = 5;
    uint56 LIQUIDATION_PRECISION = 100;
    uint56 DEPOSIT_CHARGE = 4; // 1% for deposit
    uint256 rewardRate = 10;  // 
 


    mapping (address user =>mapping(address token => uint256 amount)) public collateralDeposited;
    mapping (address user =>mapping(address token => LoanStruct loan)) public assetsBorrowed;

    mapping(address token => address priceFeed) public priceFeeds;
    mapping(address user => bool isActive) public debtManagementUsers;
    mapping(address user => mapping(address  token => AddLiquidityStruct liquidity)) public liquidityPool;
    mapping(address token => uint256 amount) public tvl;

    mapping(address token => uint256 amount) public treasury;

    mapping(address token => uint256 amount) public totalLiquidity;



    //Owner functions 
    function addTokenAndPriceFeed (address token, address priceFeed) public onlyOwner {
        priceFeeds[token] = priceFeed;
        collateralTokens.push(token);
    }


    //Functions
    function depositCollateral ( address  token,  uint256 amount) public isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {
         
        collateralDeposited[msg.sender][token] += amount;
        tvl[token] +=amount;

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        if(!success){

        revert LendingBorrowingContract__CollateralDepositFailed(); 

        }
        emit LendingBorrowingContract__DepositSuccessful(msg.sender, token, amount, block.timestamp);
  
    }

    function borrowAsset (address token, uint256 amount, uint256 repaymentTimeStamp ) public checkRepaymentDateIsGreatherThanBorrowDate(repaymentTimeStamp, block.timestamp) isTokenAllowed(token) isGreaterThanZero(amount) checkForCollateralTokensLength nonReentrant{

        require(amount < totalLiquidity[token], "Insufficient contract balance");
        uint256 amountToBorrow = getAssetValueInUSD(token, amount);
        uint256 allowedAmount = allowedBorrowingAmount(msg.sender);

        require(amountToBorrow < allowedAmount, "You can borrow this amount");

        checkForBrokenHealthFactor(msg.sender);

        //CEI
        uint256 borrowingCharge = (DEPOSIT_CHARGE * amount) / 100 ; //Charge a few % for borrowing 
        uint256 totalAmount = amount - borrowingCharge;

        assetsBorrowed[msg.sender][token].amount += amount;
        assetsBorrowed[msg.sender][token].borrowTimestamp += block.timestamp;
        assetsBorrowed[msg.sender][token].repaymentTimestamp += repaymentTimeStamp;

        totalLiquidity[token] -= amount;
        treasury[token] += borrowingCharge;


        bool success = IERC20(token).transfer(msg.sender, totalAmount);

        if(!success){
            revert LendingBorrowingContract__BorrowingFailed();

        }

          emit LendingBorrowingContract__BorrowSuccessful(msg.sender, token, amount, block.timestamp);


    }


    function addLiquidity (address token, uint256 amount, uint256 withdrawalTime) public  isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {
   
        require(withdrawalTime > block.timestamp,"Extend withdrawal time");

        liquidityPool[msg.sender][token].amount += amount;
        liquidityPool[msg.sender][token].withdrawalTime = withdrawalTime;
        liquidityPool[msg.sender][token].addedAt = block.timestamp;


        totalLiquidity[token] += amount;

        bool success =  IERC20(token).transferFrom(msg.sender, address(this), amount);

        if(!success){
    
            revert LendingBorrowingContract__LiquidityDepositFailed(); 
        } 
        emit LendingBorrowingContract_LiquidityDepositSuccessful(msg.sender, token, amount, block.timestamp);
        

    }

    function userHealthFactor(address user) public view  returns (uint256){
        //Get user collateral value in usd
        uint256  _usercollateralAssets = userTotalCollateralAssetInUsd(user);

        //Get user assets borrowed
        uint256  _userBorrowedAssets = userTotalBorrowedAssetInUsd(user);

        if(_userBorrowedAssets == 0){
            _userBorrowedAssets = WEI_PRECISION;
        }

        uint256 _heathFactor = (_usercollateralAssets * HEALTH_FACTOR_THRESHOLD) / _userBorrowedAssets ;

        return _heathFactor; // divide by WEI to get actual value
    
        
    }

    function repayLoan (address token, uint256 _amount) public  nonReentrant{
        //loan repayment command == 3

        uint256 _amountOwed =  assetsBorrowed[msg.sender][token].amount;

        // uint256 _amountToPay = _amount + ((_amount * 1) /100 ); // Charge 1% of amount to be repayed
       
        require(_amount > 0, "Amount should be greater than 0");

        //CEI
        assetsBorrowed[msg.sender][token].amount -= _amount ;
        totalLiquidity[token] += _amount;

        //Check if user is repqying alll amount owned and set repayment time  to 0

        if(_amount  >= _amountOwed){
            assetsBorrowed[msg.sender][token].repaymentTimestamp = 0;

        }


        bool success =  IERC20(token).transferFrom(msg.sender, address(this), _amount);

        if(!success){

          revert LendingBorrowingContract__LoanRepaymentFailed();
        }


        // Broadcast to other bllockchain to update repayment status 
    

        emit LendingBorrowingContract_LoanRepayed(msg.sender, token,_amount, block.timestamp );
        

    }

    function getAssetValueInUSD(address token, uint256 amount) public   view returns(uint256){
        AggregatorV3Interface tokenPrice = AggregatorV3Interface(priceFeeds[token]);
        (,int256 price, , ,) = tokenPrice.latestRoundData();
        return ((uint256 (price )* PRICE_FEED_PRECISION) * amount ) / WEI_PRECISION;

    }

function withdrawCollateralDeposited(address token) public isTokenAllowed(token)  nonReentrant{
    checkForBrokenHealthFactor(msg.sender);

    uint256 _amount = collateralDeposited[msg.sender][token];
    
    uint256 borrowedAmount = 0;
    
   for(uint256  i = 0; i < collateralTokens.length; i++) {
        borrowedAmount += assetsBorrowed[msg.sender][collateralTokens[i]].amount; 
    }

    require(_amount < tvl[token] &&  borrowedAmount == 0, "Insuffient contract or unsettled borrowing");
  

    collateralDeposited[msg.sender][token] = 0 ;
    tvl[token] -=_amount;



    bool success =  IERC20(token).transfer(msg.sender, _amount);


    if(!success){
        revert LendingBorrowingContract__CollateralWithdrawalFailed();
    }




    emit LendingBorrowingContract_CollateralWithdrawn(msg.sender, token, _amount, block.timestamp );
}

    function withdrawFromLiquidityPool(address token) public nonReentrant isTokenAllowed(token) {
        //1. get user anont for the token
        //2. check if it time for withdrawal
        //3. set collateral and amount withfrawal to 0
        // 4. remove amount to be withrawn from total liquidty 
       
        //Liquidity withdrawl === 4
        uint256 _amount = liquidityPool[msg.sender][token].amount;

        require(block.timestamp > liquidityPool[msg.sender][token].withdrawalTime  && _amount > 0, "Your withdrawal time hasnt expired or  amount must be greater than zero");

        liquidityPool[msg.sender][token].amount = 0;
        liquidityPool[msg.sender][token].withdrawalTime = 0;
        
        //
        uint256 rewards = calculateBasicLPRewards(token);
        uint256 _netWithdrawal = _amount + rewards; // + 1.5% additonal one percent

        totalLiquidity[token] -= _netWithdrawal;


        bool success =  IERC20(token).transfer(msg.sender, _netWithdrawal);



        if(!success){
        revert LendingBorrowingContract__LiquidityPoolWithdrawalFailed();

        }
                
        emit LendingBorrowingContract_LiquidityWithdrawn(msg.sender, token, _netWithdrawal, block.timestamp );



    }

    function liquidatePosition(address userToLiquidate, address _borrowedAsset, address _collateralAsset,  uint256 _amount)  public nonReentrant{

      
        require(userToLiquidate != msg.sender, "You cannot liquidate yourself");
        checkForBrokenHealthFactor(userToLiquidate);



        // the person liquidation a user position is entitiled to liquidation_bonus 

        // Amount To Transfer to liquidator  = usdAmtToPay  * (1/usdAmtOfOneBorrowedAsset) *  (1 + % of bonus)

        //Get borrowed asset USD value
        uint256 _valueOfOneCollateralAsset = getAssetValueInUSD(_collateralAsset, WEI_PRECISION); //value of one collateral asset in WEI

        uint256 _repaymentAmountValue = getAssetValueInUSD(_borrowedAsset, _amount); // amount liquidator wish to repay
        
        uint256 _liquidatorCompensation = (_repaymentAmountValue  * (LIQUIDATION_PRECISION + LIQUIDATION_PERCENTAGE) * WEI_PRECISION ) / (LIQUIDATION_PRECISION * _valueOfOneCollateralAsset);
 
        // Minus the amount repayed by liquidator from userToLiq borrowed asset 

        assetsBorrowed[userToLiquidate][_borrowedAsset].amount -= _amount;

        // Minus liquidator compensation + usd equivalence of what was repayed from userToLiq
        collateralDeposited[userToLiquidate][_collateralAsset] -=_liquidatorCompensation;

        // Add  liquidator compensation + usd equivalence of what was repayed from userToLiq to Liquidator compensation
        collateralDeposited[msg.sender][_collateralAsset] +=_liquidatorCompensation;

        // Add to liquidity
        totalLiquidity[_borrowedAsset] += _amount;

        // Trigger 105%  USD worth of liqudated user borrowed asset to be sent to user liqudating position

       

        // Transfer the repayment balance from user
        bool success =  IERC20(_borrowedAsset).transferFrom(msg.sender, address(this), _amount);

        if(!success){
            revert LendingBorrowingContract__LiquidationFailed();
        }
        

    }


    function totalValueLocked () public view returns(uint256) {
        uint256 totalCollateralValueInUsd = 0;
        for(uint256  i = 0; i < collateralTokens.length; i++){
            address token = collateralTokens[i];
            uint256 amount = tvl[token];
            totalCollateralValueInUsd += getAssetValueInUSD(token, amount);

        }
        return totalCollateralValueInUsd;
    }


    function userTotalBorrowedAssetInUsd(address user) public view returns(uint256) {
        uint256 _userBorrowedAssets = 0;
      
        // Get USD value of users borrowed Assets 
        for(uint256  i = 0; i < collateralTokens.length; i++){
        uint256 amount = assetsBorrowed[user][collateralTokens[i]].amount;
        uint256 totalCollateralValueInUsd = getAssetValueInUSD(collateralTokens[i], amount);
        _userBorrowedAssets += totalCollateralValueInUsd;

        }
        return _userBorrowedAssets;
        
    }

      // Get USD value of users Collateral Assets 
    function userTotalCollateralAssetInUsd(address user) public view returns(uint256) {
        uint256 _usercollateralAssets  = 0;

        for(uint256  i = 0; i < collateralTokens.length; i++){
            uint256 amount = collateralDeposited[user][collateralTokens[i]];
            uint256 totalCollateralValueInUsd = getAssetValueInUSD(collateralTokens[i], amount);
            _usercollateralAssets  += totalCollateralValueInUsd;

            }

        return _usercollateralAssets;
        
    }

    function checkForBrokenHealthFactor(address user) public view {
        uint256 healthFactor = userHealthFactor(user);
   
        if(healthFactor  < HEALTH_FACTOR_THRESHOLD){
            revert LendingBorrowingContract__HealthFactorIsBroken(healthFactor); // divide by 100 WEI
        }

    }


    //Check for the amount a user is allowed to borrrow based on
    //1. Health Factor
    //2 . Amount Borrowed and collateral deposited
    function allowedBorrowingAmount(address user) public view  returns (uint256){
        uint256 collateralAssetValue =  userTotalCollateralAssetInUsd(user);
        uint256 borrowedAssetValue = userTotalBorrowedAssetInUsd(user);

        uint256 effectiveCollateralValue = (collateralAssetValue * HEALTH_FACTOR_THRESHOLD) / WEI_PRECISION; 

        // Prevent underflow: if borrowed amount exceeds effective collateral, return 0
        if (borrowedAssetValue >= effectiveCollateralValue) {
            return 0;
        }

        return effectiveCollateralValue - borrowedAssetValue;
    }

    function rebalancePortfolio(address swapFrom, address swapTo,  uint256 amount) public isGreaterThanZero(amount)  returns(uint256) {    
           //action should be
            uint256 amountOnToken = collateralDeposited[msg.sender][swapFrom];
            require(amountOnToken >= amount, "Insufficient collateral");
            uint256 valueOfTokenFrom = getAssetValueInUSD(swapFrom,  WEI_PRECISION); //Get value of 1 token From;
            uint256 valueOfTokenTo = getAssetValueInUSD(swapTo, WEI_PRECISION); //Get value of 1 token To

            uint256 rebalanced = (amount * valueOfTokenFrom) / valueOfTokenTo ;

           
            collateralDeposited[msg.sender][swapFrom] -= amount;
            collateralDeposited[msg.sender][swapTo] += rebalanced; 

            emit LendingBorrowingContract__PortfolioReBalanced(msg.sender);
            return rebalanced;

        }

  function calculateBasicLPRewards(address token) public view returns (uint256) {
    uint256 totalPoolLiquidity = totalLiquidity[token];
    uint256 liquidityProvided = liquidityPool[msg.sender][token].amount;
    
    // Ensure the LP has not withdrawn; use current block time
    uint256 period = ((block.timestamp - liquidityPool[msg.sender][token].addedAt) * WEI_PRECISION) / 86400;
    
    require(totalPoolLiquidity > 0, "No liquidity in the pool");
    
    // Adjust pool share to avoid integer rounding issues
    uint256 poolShare = (liquidityProvided * WEI_PRECISION) / totalPoolLiquidity;
    
    // Reward calculation with precision
    uint256 rewards = (rewardRate * period * poolShare) / (1000 * WEI_PRECISION); // 0.1% per day. Reward = 10
    
    return rewards; 
}





    


}
