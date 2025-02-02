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


    constructor()Ownable(msg.sender) {
        
    }

    //Events
    event LendingBorrowingContract_DepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);
     event LendingBorrowingContract_LiquidityDepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);


    //Variables
    uint256 HEALTH_FACTOR = 1_000_000_000_000_000_000; 
    uint256 WEI_PRECISION = 1_000_000_000_000_000_000;
    uint256 PRICE_FEED_PRECISION = 10_000_000_000;
    uint256 BROKEN_HEALTH_FACTOR_THRESHOLD = 75_00_000_000_000_000_000; //75% of the healthfactor
    address []  public collateralTokens;

    mapping (address user =>mapping(address token => uint256 amount)) public collateralDeposited;
    mapping (address user =>mapping(address token => uint256 amount)) public assetsBorrowed;

    mapping(address token => address priceFeed) public priceFeeds;
    mapping(address user => bool isActive) public debtManagementUsers;
    mapping(address user => mapping(address  token => uint256 amount)) public liquidityPool;
    mapping(address token => uint256 amount) public tvl;


    //Owner functions 
    function addTokenAndPriceFeed (address token, address priceFeed) public onlyOwner {
        priceFeeds[token] = priceFeed;
        collateralTokens.push(token);
    }

    //Functions

    function depositCollateral ( address  token,  uint256 amount) public isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        if(success){

            collateralDeposited[token][msg.sender] += amount;

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

    function borrowAsset (address token) public checkForCollateralTokensLength{

    }


    function liquidatePositon (address token, uint256 amount) public  isTokenAllowed(token) isGreaterThanZero(amount) nonReentrant {
        bool success =  IERC20(token).transferFrom(msg.sender, address(this), amount);
        if(success){

        liquidityPool[token][msg.sender] += amount;
        tvl[token] +=amount;

        emit LendingBorrowingContract_LiquidityDepositSuccessful(msg.sender, token, amount, block.timestamp);

        } else {
            revert LendingBorrowingContract__LiquidityDepositFailed(); 

        }

    }

    function _userHealthFactor(address user) public view  returns (uint256){
        uint256  _usercollateralAssets = _userTotalCollateralAssetInUsd(user);
        uint256  _userBorrowedAssets = _userTotalBorrowedAssetInUsd(user);

        uint256 _heathFactor = (_usercollateralAssets * BROKEN_HEALTH_FACTOR_THRESHOLD) / _userBorrowedAssets;

        return _heathFactor;
    
        
    }

    function _getTokenUtilizationRatio () public {}

    function _isUserPositionOpen () public {

    }

    function _getAssetValueInUSD(address token, uint256 amount) internal view returns(uint256){
        AggregatorV3Interface tokenPrice = AggregatorV3Interface(priceFeeds[token]);
        (,int256 price, , ,) = tokenPrice.latestRoundData();
        return ((uint256 (price )* PRICE_FEED_PRECISION) * amount ) / WEI_PRECISION;

    }



    function _withdrawFromLiquidityPool(address token, uint amount) public nonReentrant {

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


    function _userTotalBorrowedAssetInUsd(address user) internal view returns(uint256) {
        uint256 _userBorrowedAssets = 0;
      
        // Get USD value of users borrowed Assets 
        for(uint256  i = 0; i < collateralTokens.length; i++){
        uint256 amount = assetsBorrowed[user][collateralTokens[i]];
        uint256 totalCollateralValueInUsd = _getAssetValueInUSD(collateralTokens[i], amount);
        _userBorrowedAssets += totalCollateralValueInUsd;

        }
        return _userBorrowedAssets;
        
    }




      // Get USD value of users Collateral Assets 
    function _userTotalCollateralAssetInUsd(address user) internal view returns(uint256) {
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




  
}
