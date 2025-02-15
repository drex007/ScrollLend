# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```


## Add collateral tokens as contract owner

NB: Ensure to use only tokens that has 8 decimals priceFeed
 - The args for adding collateral tokens are  => (address token, address priceFeed)
 - We are using wrapped sepolia testnet faucet as an example

    - token_contract : 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
    - priceFeedaddress : 0x694AA1769357215DE4FAC081bf1f309aDC325306



Deploy each contract on your desired networks
Fund each contract with blockchain Link 

Collateral Deposit = 0
Borrowed Assets = 1
Liquidity Deposit = 2
Loan repayment = 3
Liquidity Withdrawal = 4
Collateral Withdrawal  = 5
Liquidation = 6




## Token Contracts and PriceFeeds
We will be adding two tokens to this contract, ETH and USDC on base blokchain 



- Base Sepolia wrapped eth contract = 0x4200000000000000000000000000000000000006
- Base contract pricefeed ETH/USD = 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1


- Base Sepolai USDC contract = 0x036CbD53842c5426634e7929541eC2318f3dCF7e
- Base contract pricefeed USDC/USD = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165 


## CCIP ChainSelcectors And Link Contract Address
 Base Network =>
 
 Arbitrium Network => 3478487238524512106
 Arbitrium Network Link CA => 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E


 80000000000000
 120000000000000