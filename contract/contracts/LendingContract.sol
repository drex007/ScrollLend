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


    constructor()Ownable(msg.sender) {
        
    }

    //Events
    event LendingBorrowingContract_DepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);


    //Variables

    uint256 WEI_PRECISION = 1_000_000_000_000_000_000;
    uint256 PRICE_FEED_PRECISION = 1_00_000_000;
    address []  public collateralTokens;

    mapping (address user =>mapping(address token => uint256 amount)) public collateralDeposited;
    mapping(address token => address priceFeed) public priceFeeds;
    mapping(address user => bool isActive) public debtManagementUsers;
    mapping(address user => mapping(address  token => uint256 amount)) public liquidityPool;

  

    //Owner functions 
    function addTokenAndPriceFeed (address token, address priceFeed) public onlyOwner {
        priceFeeds[token] = priceFeed;
        collateralTokens.push(token);
    }

    //Functions

    function depositCollateral ( address  token,  uint256 amount) public isTokenAllowed(token) isGreaterThanZero(amount) {

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


    function borrowAsset (address token) public {

    }


    function liquidatePositon (address token) public {

    }

    function _userHealthFactor() public {
        
    }

    function _getTokenUtilizationRation () public {}

    function _isUserPositionOpen () public {

    }

    function _getAssetValueInUSD(address token)public view returns(uint256){
        AggregatorV3Interface tokenPrice = AggregatorV3Interface(priceFeeds[token]);
        (,int256 price, , ,) = tokenPrice.latestRoundData();
        return uint256 (price )* PRICE_FEED_PRECISION;

    }



    function _compoundUtilizationRatio(address token) public view {

    }

    function _withdrawFromPool(address token, uint amount) public {

    }


    function _totalValueLocked () public {

    }





  
}
