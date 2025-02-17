// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

//ScrolLend for Scroll Open Hackathon

// Contract Flow 

// 1. User deposit collateral

// 2. User borrow collateral that is in correlation with the health for a specified period of time

// 3. User can supply to Lending Pool Contract

// 4. If user health factor is below threshold, the system can liquidate the user or another user can liquidate the borrowers position 

// 5. Lenders interest rate is dependent on the compound utilization ratio of each borrowed assets  i.e (Total Token borrowed/Total token supplied) 



contract LendingBorrowingContract  is ReentrancyGuard, CCIPReceiver, OwnerIsCreator  {


    using SafeERC20 for IERC20;

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
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.
    error LendingBorrowingContract__LiquidationFailed();
    error LendingBorrowingContract__ChainAlreadyExist();
    error LendingBorrowingContract__SourceContractNotAllowed();




 


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

 


    constructor(address _router, address _link)
     CCIPReceiver(_router)
     
     {
        s_router = IRouterClient(_router);
        s_linkToken = LinkTokenInterface(_link);
    }


    struct LoanStruct {
        uint256 amount;
        uint256 borrowTimestamp;
        uint256 repaymentTimestamp;
    }

    struct AddLiquidityStruct {
        uint256 amount;
        uint256 withdrawalTime;
    }


    struct textData {
        address user;
        address token;
        uint256 amount;
        uint56 action;
        address collateral;
        address user2;
        uint256 collateralAmount;

    }

    //CCIP EVENTS


    // Event emitted when a message is sent to another chain.
    event MessageSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver
    );

    

    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        textData text
    );

    //Events
    event LendingBorrowingContract_DepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LiquidityDepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_AssetBorrowedSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LiquidityWithdrawn(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_LoanRepayed(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract_CollateralWithdrawn(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
    event LendingBorrowingContract__PortfolioReBalanced();

    //CCIP VARIABLES

    bytes32 private s_lastReceivedMessageId; // Store the last received messageId.

    address  lastReceivedUser;
    address lastReceivedToken;
    uint256 lastReceivedAmount;
    uint56 lastReceivedAction;
    mapping(address chain => uint64 chainSelector) allowedChainSelectors;
    
   

    
    IRouterClient private s_router;

    LinkTokenInterface private s_linkToken;


    //Variables
    address public lendingContract;
    uint256 HEALTH_FACTOR = 1_000_000_000_000_000_000; 
    uint256 WEI_PRECISION = 1_000_000_000_000_000_000;
    uint256 PRICE_FEED_PRECISION = 10_000_000_000;
    uint256 HEALTH_FACTOR_THRESHOLD = 75_00_000_000_000_000_000; //75% of the healthfactor
    address []  public collateralTokens;
    uint56 LIQUIDATION_PERCENTAGE = 5;
    uint56 LIQUIDATION_PRECISION = 100;
    uint56 DEPOSIT_CHARGE = 2 ; // 1% for deposit
    uint56 MAX_DEPOSIT_CHARGE = 5;

    uint256 TokenUtilizationThreshold = 80_000_000_000_000_000_000; // 80%

   mapping(uint64 => bool) public isSourceChain;
 


    mapping (address user =>mapping(address token => uint256 amount)) public collateralDeposited;
    mapping (address user =>mapping(address token => LoanStruct loan)) public assetsBorrowed;

    mapping(address token => address priceFeed) public priceFeeds;
    mapping(address user => bool isActive) public debtManagementUsers;
    mapping(address user => mapping(address  token => AddLiquidityStruct liquidity)) public liquidityPool;
    mapping(address token => uint256 amount) public tvl;

    mapping(address token => uint256 amount) public treasury;

    mapping(address token => uint256 amount) totalLiquidity; // amount of liquidity in the protocol 
    mapping(address token => uint256 amount) totalBorrowedLiquidity; // amount of liquidity in the protocol 
    




    //Owner functions 
    function addTokenAndPriceFeed (address token, address priceFeed) public onlyOwner {
        priceFeeds[token] = priceFeed;
        collateralTokens.push(token);
    }

    function addLendingContractAddress (address contract_address) public onlyOwner {
    lendingContract = contract_address;
    }

    function addSourceContract( uint64 _sourceChain) public onlyOwner {
        require(isSourceChain[_sourceChain] == false, "Source Chain already exist");
        isSourceChain[_sourceChain] = true;

    }

    function removeSourceContract( uint64 _sourceChain) public onlyOwner {
        require(isSourceChain[_sourceChain] == true, "Source Chain not found");
        isSourceChain[_sourceChain] = false;

    }

    function recoverTokens(address tokenAddress, address recipient, uint256 amount) external onlyOwner {
    IERC20(tokenAddress).transfer(recipient, amount);
}


    //Functions
    function depositCollateral ( address  token,  uint256 amount, uint64  destinationChainSelector, address destinationContract) public isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {
        
        

        collateralDeposited[msg.sender][token] += amount;
  

        // Prepare ccip data
        textData memory  structData;
        structData.user = msg.sender;
        structData.token = token;
        structData.amount = amount;
        structData.action  = 0; 
        tvl[token] += amount;
       

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        if(!success){

        revert LendingBorrowingContract__CollateralDepositFailed(); 

        }
        //Broadcast to other blockchain to update deposit status for this user
        sendMessage(destinationChainSelector, destinationContract, structData);

        emit LendingBorrowingContract_DepositSuccessful(msg.sender, token, amount, block.timestamp);
    }


    //Subscribe to automatic debt rebalancing
    function debtManagementSubscribe () public {
        debtManagementUsers[msg.sender] = true;
    }

    //UnSubscribe to automatic debt rebalancing
    function debtManagementUnSubscribe () public {
        debtManagementUsers[msg.sender] = false;
    }

    function borrowAsset (address token, uint256 amount, uint256 repaymentTimeStamp, uint64 destinationChainSelector, address destinationContract ) public checkRepaymentDateIsGreatherThanBorrowDate(repaymentTimeStamp, block.timestamp) isTokenAllowed(token) isGreaterThanZero(amount) checkForCollateralTokensLength nonReentrant{
       
       require(amount < totalLiquidity[token], "Insufficient Contract Balance");

        _checkForBrokenHealthFactor(msg.sender);

        uint256 CHARGE = 0;
        
        uint256 tur  = getTokenUtilizationRatio(token);

        if(tur >= TokenUtilizationThreshold){
            CHARGE = MAX_DEPOSIT_CHARGE;

        } else {

            CHARGE = DEPOSIT_CHARGE;
        }
        
        //Command action === 2
        
        //Check if Healfactor is broken

        uint256 amountToBorrow =  getAssetValueInUSD(token, amount);
        uint256 amountAllowedToBorrow = allowedBorrowingAmount(msg.sender);
        

        //Ensure the amount to borrow is less than the amount allowedToBorrow
        if(amountToBorrow > amountAllowedToBorrow){
            revert LendingBorrowingContract__AmountNotAllowed();

        }

        //CEI

        uint256 _fee = (amount * CHARGE) / LIQUIDATION_PERCENTAGE;

        uint256 _netBorrowed = amount - fee;
        
        

        // Deposit fee to treasury
        treasury[token] += _fee;

        assetsBorrowed[msg.sender][token].amount += amount;
        assetsBorrowed[msg.sender][token].borrowTimestamp += block.timestamp;
        assetsBorrowed[msg.sender][token].repaymentTimestamp += repaymentTimeStamp;

        totalLiquidity[token] -= amount;

        totalBorrowedLiquidity[token] +=amount;

        bool success = IERC20(token).transfer(msg.sender,  _netBorrowed);

        if(!success){
            revert LendingBorrowingContract__BorrowingFailed();

        }

        //Prepare structData
        textData memory structData; 
        structData.action = 2;
        structData.amount = amount;
        structData.token = token;
        structData.user = msg.sender;


        sendMessage(destinationChainSelector, destinationContract, structData);

        // Broadcast to other blokchain to update borrowing status for the user
       

        emit LendingBorrowingContract_AssetBorrowedSuccessful(msg.sender, token,  amount, repaymentTimeStamp);


    }


    function addLiquidity (address token, uint256 amount, uint256 withdrawalTime, uint64 destinationChainSelector, address destinationContract) public  isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {
        
        // Command action  === 1

        require(withdrawalTime > block.timestamp, "Withdrawal time must be greater than current timestamp");

        liquidityPool[msg.sender][token].amount += amount;
        liquidityPool[msg.sender][token].withdrawalTime = withdrawalTime;

        totalLiquidity[token] += amount;

        bool success =  IERC20(token).transferFrom(msg.sender, address(this), amount);

        if(!success){
    
            revert LendingBorrowingContract__LiquidityDepositFailed(); 
        } 



        //Prepare ccip data
        textData memory structData; 
        structData.action = 1;
        structData.amount = amount;
        structData.token = token;
        structData.user = msg.sender;

        sendMessage(destinationChainSelector, destinationContract, structData);

        // Broadcast to other blokchain to update the liquidity status of the user 

        emit LendingBorrowingContract_LiquidityDepositSuccessful(msg.sender, token, amount, block.timestamp);
        

    }

    function userHealthFactor(address user) public view  returns (uint256){

        //Get user collateral value in usd
        uint256  _usercollateralAssets = userTotalCollateralAssetInUsd(user);

        //Get user assets borrowed
        uint256  _userBorrowedAssets = userTotalBorrowedAssetInUsd(user);

        if(_userBorrowedAssets == 0){
            _userBorrowedAssets = 1;
        }

        uint256 _heathFactor = (_usercollateralAssets * HEALTH_FACTOR_THRESHOLD) / _userBorrowedAssets;

        return _heathFactor;
    
        
    }


    // Helps determine charge for borrowing 
    function getTokenUtilizationRatio (address token) public returns (uint256) {

        uint256  amountSupplied = totalLiquidity[token];
        uint256 amountBorrowed = totalBorrowedLiquidity[token];
        uint256 tur = (amountBorrowed  * 100 * WEI_PRECISION ) / amountSupplied ;

        return tur;

    }

    // function _isUserPositionOpen (address user, address token) public {

    // }

    function repayLoan (address token, uint256 _amount , uint64 destinationChainSelector, address destinationContract) public  nonReentrant{
        //loan repayment command == 3

        uint256 _amountOwed =  assetsBorrowed[msg.sender][token].amount;

        uint256 _amountToPay = _amount + (_amount * 1) /100; // Charge 1% of amount to be repayed
       
        require(_amount > 0, "Amount should be greater than 0");

        //CEI
        assetsBorrowed[msg.sender][token].amount -= _amount ;
        totalLiquidity[token] += _amount;

        totalBorrowedLiquidity[token] -=amount; 

        //Check if user is repqying alll amount owned and set repayment time  to 0

        if(_amount  >= _amountOwed){
            assetsBorrowed[msg.sender][token].repaymentTimestamp = 0;

        }

        //Prepare ccip data
        textData memory structData; 
        structData.action = 3;
        structData.amount = _amount;
        structData.token = token;
        structData.user = msg.sender;

        bool success =  IERC20(token).transferFrom(msg.sender, address(this), _amountToPay);

        if(!success){

          revert LendingBorrowingContract__LoanRepaymentFailed();
        }


        // Broadcast to other bllockchain to update repayment status 
        sendMessage(destinationChainSelector, destinationContract, structData);

        emit LendingBorrowingContract_LoanRepayed(msg.sender, token,_amount, block.timestamp );
        

    }

    function getAssetValueInUSD(address token, uint256 amount) internal view returns(uint256){
        AggregatorV3Interface tokenPrice = AggregatorV3Interface(priceFeeds[token]);
        (,int256 price, , ,) = tokenPrice.latestRoundData();
        return ((uint256 (price )* PRICE_FEED_PRECISION) * amount ) / WEI_PRECISION;

    }

function withdrawCollateralDeposited(address token, uint64 destinationChainSelector, address destinationContract) public isTokenAllowed(token)  nonReentrant{
    require(amount < tvl[token], "Insufficient Contract Balance");

    _checkForBrokenHealthFactor(msg.sender);
    uint256 _borrowedAmount = 0;
    
   for(uint256  i = 0; i < collateralTokens.length; i++) {
        _borrowedAmount += assetsBorrowed[msg.sender][collateralTokens[i]].amount; 
    }

    if (_borrowedAmount > 0) {
        revert LendingBorrowingContract__BorrowedAmountIsNotZero();
    }

    uint256 _amount = collateralDeposited[msg.sender][token];

    collateralDeposited[msg.sender][token] = 0 ;
    tvl[token] -=_amount;

    //prepare data to broadcast to other blockhains 

    textData memory structData; 
    structData.action = 5;
    structData.amount = 0;
    structData.token = token;
    structData.user = msg.sender;

    bool success =  IERC20(token).transfer(msg.sender, _amount);


    if(!success){
        revert LendingBorrowingContract__CollateralWithdrawalFailed();
    }


    sendMessage(destinationChainSelector, destinationContract, structData);

    emit LendingBorrowingContract_CollateralWithdrawn(msg.sender, token, _amount, block.timestamp );


}



    function withdrawFromLiquidityPool(address token, uint64 destinationChainSelector, address destinationContract) public nonReentrant isTokenAllowed(token) {
        require(amount < totalLiquidity[token], "Insufficient Contract Balance");
        //1. get user anont for the token
        //2. check if it time for withdrawal
        //3. set collateral and amount withfrawal to 0
        // 4. remove amount to be withrawn from total liquidty 

       
        //Liquidity withdrawl === 4
        uint256 _amount = liquidityPool[msg.sender][token].amount;

        require(block.timestamp > liquidityPool[msg.sender][token].withdrawalTime  && _amount > 0, "Your withdrawal time hasnt expired or must be greater than zero");

        liquidityPool[msg.sender][token].amount = 0;
        liquidityPool[msg.sender][token].withdrawalTime = 0;
        
        //
        uint256 _netWithdrawal = _amount + ((_amount * 1)/100); // + additonal one percent

        totalLiquidity[token] -= _netWithdrawal;

        //prepare data
        textData memory structData; 
        structData.action = 4;
        structData.amount = _netWithdrawal;
        structData.token = token;
        structData.user = msg.sender;

        bool success =  IERC20(token).transfer(msg.sender, _netWithdrawal);

        if(!success){
        revert LendingBorrowingContract__LiquidityPoolWithdrawalFailed();

        }
        

        // Broadcast to update other blockain of the liquidity status 
        sendMessage(destinationChainSelector, destinationContract, structData);

        
        emit LendingBorrowingContract_LiquidityWithdrawn(msg.sender, token, _amount, block.timestamp );



    }

    function liquidatePosition(address userToLiquidate, address _borrowedAsset, address _collateralAsset,  uint256 _amount,  uint64 destinationChainSelector, address destinationContract)  public nonReentrant{

      
        require(userToLiquidate != msg.sender, "Sorry, You cannot liquidate yourself");


        // the person liquidation a user position is entitiled to liquidation_bonus 

        // Amount To Transfer to liquidator  = usdAmtToPay  * (1/usdAmtOfOneBorrowedAsset) *  (1 + % of bonus)

        //Get borrowed asset USD value
        uint256 _valueOfOneCollateralAsset = getAssetValueInUSD(_collateralAsset, WEI_PRECISION); //value of one collateral asset in WEI

        uint256 _repaymentAmountValue = getAssetValueInUSD(_borrowedAsset, _amount); // amount liquidator wish to repay
        
        uint256 _liquidatorCompensation = _repaymentAmountValue * (1/_valueOfOneCollateralAsset) * ((LIQUIDATION_PRECISION + LIQUIDATION_PERCENTAGE) /LIQUIDATION_PRECISION
         ) * WEI_PRECISION;
 
        // Minus the amount repayed by liquidator from userToLiq borrowed asset 

        assetsBorrowed[userToLiquidate][_borrowedAsset].amount -= _amount;

        // Minus liquidator compensation + usd equivalence of what was repayed from userToLiq
        collateralDeposited[userToLiquidate][_collateralAsset] -=_liquidatorCompensation;

        // Add  liquidator compensation + usd equivalence of what was repayed from userToLiq to Liquidator compensation
        collateralDeposited[msg.sender][_collateralAsset] +=_liquidatorCompensation;

        // Add to liquidity
        totalLiquidity[_borrowedAsset] += _amount;
        totalBorrowedLiquidity[_borrowedAsset] -=amount;

        // Trigger 105%  USD worth of liqudated user borrowed asset to be sent to user liqudating position

        //prepare ccip data and broadcast to other blockchain 
        //1 1. 

        textData memory structData;


        structData.amount = _amount;
        structData.action = 6;
        structData.user =  msg.sender;
        structData.token = _borrowedAsset;
        structData.user2 = userToLiquidate;
        structData.collateral =_collateralAsset;
        structData.collateralAmount =_liquidatorCompensation;

        // Transfer the repayment balance from user
        bool success =  IERC20(_borrowedAsset).transferFrom(msg.sender, address(this), _amount);

        if(!success){
            revert LendingBorrowingContract__LiquidationFailed();
        }


        //broadcast to other network 
        sendMessage(destinationChainSelector, destinationContract, structData);

        

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

    function _checkForBrokenHealthFactor(address user) internal view {
        uint256 healthFactor = userHealthFactor(user);
        if(healthFactor  < HEALTH_FACTOR){
            revert LendingBorrowingContract__HealthFactorIsBroken(healthFactor);
        }

    }



    //Check for the amount a user is allowed to borrrow based on
    //1. Health Factor
    //2 . Amount Borrowed and collateral deposited
    function allowedBorrowingAmount(address user) public view  returns (uint256){
        uint256 collateralAssetValue =  userTotalCollateralAssetInUsd(user);
        uint256 borrowedAssetValue = userTotalBorrowedAssetInUsd(user);

        uint256 effectiveCollateralValue = (collateralAssetValue * HEALTH_FACTOR_THRESHOLD) /WEI_PRECISION;

        // Prevent underflow: if borrowed amount exceeds effective collateral, return 0
        if (borrowedAssetValue >= effectiveCollateralValue) {
            return 0;
        }

        return effectiveCollateralValue - borrowedAssetValue;


    }



    function rebalancePortfolio(address swapFrom, address swapTo,  uint256 amount, uint64 destinationChainSelector, address destinationContract ) public isGreaterThanZero(amount)  returns(uint256) {
           
           //action should be
            uint256 amountOnToken = collateralDeposited[msg.sender][swapFrom];
            require(amountOnToken >= amount, "Insufficient collateral");
            uint256 valueOfTokenFrom = getAssetValueInUSD(swapFrom,  WEI_PRECISION); //et value of 1 token From;
            uint256 valueOfTokenTo = getAssetValueInUSD(swapTo, WEI_PRECISION); //Get value of 1 token To

            uint256 rebalanced = (amount * valueOfTokenFrom) / valueOfTokenTo ;

           
            collateralDeposited[msg.sender][swapFrom] -= amount;
            collateralDeposited[msg.sender][swapTo] += rebalanced; 

            //send Data
            textData memory structData;

            structData.user = msg.sender;
            structData.token = swapFrom;
            structData.collateral = swapTo;
            structData.action = 7;
            structData.collateralAmount = rebalanced;
            structData.amount = amount;

            sendMessage(destinationChainSelector, destinationContract, structData );
            emit LendingBorrowingContract__PortfolioReBalanced();
            return rebalanced;




        }

    //CCCIP FUNCTION

    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        textData memory text
    ) internal  returns (bytes32 messageId) {

        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver), 
            data: abi.encode(text),
            tokenAmounts: new Client.EVMTokenAmount[](0), 
            extraArgs: Client._argsToBytes(

                Client.EVMExtraArgsV2({
                    gasLimit: 300_000, 
                    allowOutOfOrderExecution: true
                })
            ),
            feeToken: address(s_linkToken)
        });


        uint256 fees = s_router.getFee(
            destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
            
        s_linkToken.approve(address(s_router), fees);

        messageId = s_router.ccipSend(destinationChainSelector, evm2AnyMessage);

        emit MessageSent(
            messageId,
            destinationChainSelector,
            receiver
        );

        return messageId;
    }


    function _ccipReceive(
            Client.Any2EVMMessage memory any2EvmMessage
        ) internal override {
            s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
            uint64 chain = any2EvmMessage.sourceChainSelector;

            require(isSourceChain[chain] == true, "Source chain not recognised");
    

            textData memory decodedText = abi.decode(any2EvmMessage.data, (textData)); // abi-decoding of the sent text
            lastReceivedAction = decodedText.action;
            lastReceivedAmount = decodedText.amount;
            lastReceivedUser = decodedText.user;
            lastReceivedToken = decodedText.token;
           
           

            // Action of 0 ==== CollateralDeposit 
            if(decodedText.action == 0) {
                collateralDeposited[decodedText.user][decodedText.token] += decodedText.amount;
                tvl[decodedText.token] += decodedText.amount;
                
            }
            // Add Liquidity == 1

             if(decodedText.action == 1) {
                liquidityPool[decodedText.user][decodedText.token].amount += decodedText.amount;
                totalLiquidity[decodedText.token] += decodedText.amount;
            }
            // Borrow Assets == 2
            if(decodedText.action == 2) {
                assetsBorrowed[decodedText.user][decodedText.token].amount += decodedText.amount;
                totalLiquidity[decodedText.token] -= decodedText.amount;
                totalBorrowedLiquidity[decodedText.token] += decodedText.amount;
            }
            // Repay loan === 3
            if(decodedText.action == 3) {
                assetsBorrowed[decodedText.user][decodedText.token].amount -= decodedText.amount;
                totalLiquidity[decodedText.token] += decodedText.amount;
                totalBorrowedLiquidity[decodedText.token] -= decodedText.amount;
            }

            // Liquidity Withdrawal === 4
            if(decodedText.action == 4) {
                liquidityPool[decodedText.user][decodedText.token].amount = 0;
                totalLiquidity[decodedText.token] -= decodedText.amount;

            }
            
              // Collateral withdrawal === 5
            if(decodedText.action == 5) {
                collateralDeposited[decodedText.user][decodedText.token] = 0;
            }
            
            if(decodedText.action == 6) {
                //Subtract amount paid from borrowed assets
                assetsBorrowed[decodedText.user2][decodedText.token].amount -= decodedText.amount;

                // removed liquidator bonus and amt from debtor collateral
                collateralDeposited[decodedText.user2][decodedText.collateral] -= decodedText.collateralAmount;
                    // Add liquidator bonus and amt to liquidator collateral
                collateralDeposited[decodedText.user][decodedText.collateral] += decodedText.collateralAmount;

                totalLiquidity[decodedText.token] += decodedText.amount;
                totalBorrowedLiquidity[decodedText.token] -= decodedText.amount;
                tvl[decodedText.token] -= decodedText.amount;
               
            }

            // Rebalance portfolio
            if( decodedText.action == 7) {

            collateralDeposited[decodedText.user][decodedText.token] -= decodedText.amount;

            collateralDeposited[decodedText.user][decodedText.collateral] += decodedText.collateralAmount; 
            tvl[decodedText.token] -= decodedText.amount;
            tvl[decodedText.collateral] +=decodedText.collateralAmount; 


            }
            
            
            
            


            emit MessageReceived(
                any2EvmMessage.messageId,
                any2EvmMessage.sourceChainSelector, 
                abi.decode(any2EvmMessage.sender, (address)), 
                abi.decode(any2EvmMessage.data, (textData))
            );
        }

        function getLastReceivedMessageDetails()
            external
            view
            returns (bytes32 messageId, uint56 _lastReceivedAction)
        {
            return (s_lastReceivedMessageId, lastReceivedAction);
        }


 
    

  
}
