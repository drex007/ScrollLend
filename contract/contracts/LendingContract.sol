// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

//ScrolLend for Scroll Open Hackathon

// Contract Flow 

// 1. User deposit collateral

// 2. User borrow collateral that is in correlation with the health for a specified period of time

// 3. User can supply to Lending Pool Contract

// 4. If user health factor is below threshold, the system can liquidate the user or another user can liquidate the borrowers position 
// 5. Lenders interest rate is dependent on the compound utilization ratio of each borrowed assets  i.e (Total Token borrowed/Total token supplied) 
contract LendingBorrowingContract  is ReentrancyGuard{
    //Errors
    error LendingBorrowingContract__TokenNotAllowed();
    error LendingBorrowingContract__CollateralDepositFailed();
    error LendingBorrowingContract__AmountNotMoreThanZero();



    //modifiers 

    modifier  isTokenAllowed (address token) {
        if (s_priceFeeds[token] == address(0)){
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

    //Events
    event LendingBorrowingContract_DepositSuccessful(address indexed user, address indexed token, uint256 amount, uint256 timeStamp);


    //Variables
    mapping (address user =>mapping(address token => uint256 amount)) public collateralDeposited;
    mapping(address token => address priceFeed) public s_priceFeeds;
  



    //Functions

    function depositCollateral ( address  token,  uint256 amount) public isTokenAllowed(token) {

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        if(success){

            collateralDeposited[token][msg.sender] += amount;

            emit LendingBorrowingContract_DepositSuccessful(msg.sender, token, amount, block.timestamp);

        } else {
            revert LendingBorrowingContract__CollateralDepositFailed(); 

        }
    }

    function borrowAsset () public {

    }


    function liquidatePositon () public {

    }

    function _userHealthFactor() public {
        
    }

    function _getTokenUtilizationRation () public {}

    function _isUserPositionOpen () public {
    }






  
}
