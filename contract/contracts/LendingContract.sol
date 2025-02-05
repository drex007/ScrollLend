// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


// Uncomment this line to use console.log
// import "hardhat/console.sol";

//ScrolLend for Scroll Open Hackathon

// Contract Flow 

// 1. User deposit collateral

// 2. User borrow collateral that is in correlation with the health for a specified period of time

// 3. User can supply to Lending Pool Contract

// 4. If user health factor is below threshold, the system can liquidate the user or another user can liquidate the borrowers position 

// 5. Lenders interest rate is dependent on the compound utilization ratio of each borrowed assets  i.e (Total Token borrowed/Total token supplied) 



contract LendingBorrowingContract  is ReentrancyGuard, Ownable {
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




    //modifiers 

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



    constructor()Ownable(msg.sender) {
        
    }

    //Structs

    struct LoanStruct {
        uint256 amount;
        uint256 borrowTimestamp;
        uint256 repaymentTimestamp;
    }

    struct AddLiquidityStruct {
        uint256 amount;
        uint256 withdrawalTime;
    }


    //Events
    event LendingBorrowingContract_DepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LiquidityDepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_AssetBorrowedSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LiquidityWithdrawn(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LoanRepayed(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);


    //Variables
    address public lendingContract;
    uint256 HEALTH_FACTOR = 1_000_000_000_000_000_000; 
    uint256 WEI_PRECISION = 1_000_000_000_000_000_000;
    uint256 PRICE_FEED_PRECISION = 10_000_000_000;
    uint256 BROKEN_HEALTH_FACTOR_THRESHOLD = 75_00_000_000_000_000_000; //75% of the healthfactor
    address []  public collateralTokens;
    uint256 LIQUIDATION_PERCENTAGE = 90;
    uint256 LIQUIDATION_PRECISION = 100;


    mapping (address user =>mapping(address token => uint256 amount)) public collateralDeposited;
    mapping (address user =>mapping(address token => LoanStruct loan)) public assetsBorrowed;

    mapping(address token => address priceFeed) public priceFeeds;
    mapping(address user => bool isActive) public debtManagementUsers;
    mapping(address user => mapping(address  token => AddLiquidityStruct liquidity)) public liquidityPool;
    mapping(address token => uint256 amount) public tvl;


    //Owner functions 
    function addTokenAndPriceFeed (address token, address priceFeed) public onlyOwner {
        priceFeeds[token] = priceFeed;
        collateralTokens.push(token);
    }

    function addLendingContractAddress (address contract_address) public onlyOwner {
    lendingContract = contract_address;
    }

    //Functions
    function depositCollateral ( address  token,  uint256 amount) public isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        if(success){

            collateralDeposited[msg.sender][token] += amount;

            emit LendingBorrowingContract_DepositSuccessful(msg.sender, token, amount, block.timestamp);

        } else {
            revert LendingBorrowingContract__CollateralDepositFailed(); 

        }
    }


    //Subscribe to automatic debt rebalancing
    function debtManagementSubscribe () public {
        debtManagementUsers[msg.sender] = true;
    }

    //UnSubscribe to automatic debt rebalancing
    function debtManagementUnSubscribe () public {
        debtManagementUsers[msg.sender] = false;
    }

    function borrowAsset (address token, uint256 amount, uint256 repaymentTimeStamp) public checkRepaymentDateIsGreatherThanBorrowDate(repaymentTimeStamp, block.timestamp) isTokenAllowed(token) isGreaterThanZero(amount) checkForCollateralTokensLength nonReentrant{
        //Check if Healfactor is broken
        _checkForBrokenHealthFactor(msg.sender);

        uint256 amountToBorrow =  _getAssetValueInUSD(token, amount);
        uint256 amountAllowedToBorrow = _allowedBorrowingAmount(msg.sender);
        

        //Ensure the amount to borrow is less than the amount allowedToBorrow
        if(amountToBorrow > amountAllowedToBorrow){
            revert LendingBorrowingContract__AmountNotAllowed();

        }

        bool success = IERC20(token).transferFrom(address(this), msg.sender,  amount);
        if(!success){
            revert LendingBorrowingContract__BorrowingFailed();

        }

        assetsBorrowed[msg.sender][token].amount += amount;
        assetsBorrowed[msg.sender][token].borrowTimestamp += block.timestamp;
        assetsBorrowed[msg.sender][token].repaymentTimestamp += repaymentTimeStamp;
        tvl[token] -=amount;

        emit LendingBorrowingContract_AssetBorrowedSuccessful(msg.sender, token,  amount, repaymentTimeStamp);


    }


    function addLiquidity (address token, uint256 amount, uint256 withdrawalTime) public  isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {

        require(withdrawalTime > block.timestamp, "Withdrawal time must be greater than current timestamp");

        bool success =  IERC20(token).transferFrom(msg.sender, address(this), amount);
        if(!success){
        
            revert LendingBorrowingContract__LiquidityDepositFailed(); 
        } 

        liquidityPool[token][msg.sender].amount += amount;
        liquidityPool[token][msg.sender].withdrawalTime = withdrawalTime;
        tvl[token] +=amount;

        emit LendingBorrowingContract_LiquidityDepositSuccessful(msg.sender, token, amount, block.timestamp);
        

    }

    function _userHealthFactor(address user) public view  returns (uint256){

        //Get user collateral value in usd
        uint256  _usercollateralAssets = _userTotalCollateralAssetInUsd(user);

        //Get user assets borrowed
        uint256  _userBorrowedAssets = _userTotalBorrowedAssetInUsd(user);

        if(_userBorrowedAssets == 0){
            _userBorrowedAssets = 1;
        }

        uint256 _heathFactor = (_usercollateralAssets * BROKEN_HEALTH_FACTOR_THRESHOLD) / _userBorrowedAssets;

        return _heathFactor;
    
        
    }

    function _getTokenUtilizationRatio () public {}

    function _isUserPositionOpen (address user, address token) public {

    }

    function repayLoan (address token) public {
        uint256 _amount =  assetsBorrowed[msg.sender][token].amount;
        require(_amount > 0, "Amount should be greater than 0");
        bool success =  IERC20(token).transferFrom(msg.sender, address(this), _amount);
        if(!success){
          revert LendingBorrowingContract__LoanRepaymentFailed();
        }

        assetsBorrowed[msg.sender][token].amount = 0;
        assetsBorrowed[msg.sender][token].repaymentTimestamp = 0;
        tvl[token] += _amount;
        emit LendingBorrowingContract_LoanRepayed(msg.sender, token,_amount, block.timestamp );
        

    }

    function _getAssetValueInUSD(address token, uint256 amount) internal view returns(uint256){
        AggregatorV3Interface tokenPrice = AggregatorV3Interface(priceFeeds[token]);
        (,int256 price, , ,) = tokenPrice.latestRoundData();
        return ((uint256 (price )* PRICE_FEED_PRECISION) * amount ) / WEI_PRECISION;

    }



    function _withdrawFromLiquidityPool(address token) public nonReentrant {
        uint256 _amount = liquidityPool[msg.sender][token].amount;
        require(block.timestamp > liquidityPool[msg.sender][token].withdrawalTime, "Your withdrawal time hasnt expired");
        bool success =  IERC20(token).transferFrom(address(this), msg.sender, _amount);
        if(success){
            liquidityPool[token][msg.sender].amount = 0;

            liquidityPool[token][msg.sender].withdrawalTime = 0;
            
            tvl[token] -= _amount;
            emit LendingBorrowingContract_LiquidityWithdrawn(msg.sender, token, _amount, block.timestamp );
        }



    }

    function liquidatePosition(address userToLiquidate, address token)  public nonReentrant{

        // the person liquidation a user position is entitiled to liquidation_bonus 
        uint256 _amount = assetsBorrowed[userToLiquidate][token].amount;

        //Get borrowed asset USD value
        uint256 _amountValue = _getAssetValueInUSD(token, _amount);

        bool success =  IERC20(token).transferFrom(address(this), msg.sender, _amount);
        if(success){
            assetsBorrowed[userToLiquidate][token].amount -= _amount;
            // Trigger 110%  USD worth of liqudated user borrowed asset to be sent to user liqudating position
        }

    }


    function _transferLiquidatedCollateralToLiquidator () internal view{
        // send liquidated collateral to liqudator
        // return liqudated user borrowed assets to 0
    }



    function totalValueLocked () public view returns(uint256) {
        uint256 totalCollateralValueInUsd = 0;
        for(uint256  i = 0; i < collateralTokens.length; i++){
            address token = collateralTokens[i];
            uint256 amount = tvl[token];
            totalCollateralValueInUsd += _getAssetValueInUSD(token, amount);

        }
        return totalCollateralValueInUsd;
    }


    function _userTotalBorrowedAssetInUsd(address user) public view returns(uint256) {
        uint256 _userBorrowedAssets = 0;
      
        // Get USD value of users borrowed Assets 
        for(uint256  i = 0; i < collateralTokens.length; i++){
        uint256 amount = assetsBorrowed[user][collateralTokens[i]].amount;
        uint256 totalCollateralValueInUsd = _getAssetValueInUSD(collateralTokens[i], amount);
        _userBorrowedAssets += totalCollateralValueInUsd;

        }
        return _userBorrowedAssets;
        
    }




      // Get USD value of users Collateral Assets 
    function _userTotalCollateralAssetInUsd(address user) public view returns(uint256) {
        uint256 _usercollateralAssets  = 0;

        for(uint256  i = 0; i < collateralTokens.length; i++){
            uint256 amount = collateralDeposited[user][collateralTokens[i]];
            uint256 totalCollateralValueInUsd = _getAssetValueInUSD(collateralTokens[i], amount);
            _usercollateralAssets  += totalCollateralValueInUsd;

            }

        return _usercollateralAssets;
        
    }

    function _checkForBrokenHealthFactor(address user) internal view {
        uint256 healthFactor = _userHealthFactor(user);
        if(healthFactor  < HEALTH_FACTOR){
            revert LendingBorrowingContract__HealthFactorIsBroken(healthFactor);
        }

    }


    //Check for the amount a user is allowed to borrrow based on
    //1. Health Factor
    //2 . Amount Borrowed and collateral deposited
    function _allowedBorrowingAmount(address user) public view  returns (uint256){
        uint256 collateralAssetValue =  _userTotalCollateralAssetInUsd(user);
        uint256 borrowedAssetValue = _userTotalBorrowedAssetInUsd(user);

        uint256 effectiveCollateralValue = collateralAssetValue * BROKEN_HEALTH_FACTOR_THRESHOLD;

        uint256 allowedBorrowing  = effectiveCollateralValue - borrowedAssetValue ;
        return allowedBorrowing;


    }



  
}
