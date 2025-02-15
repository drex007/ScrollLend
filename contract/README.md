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


### CCIP actions and what each action command represents

1. Collateral Deposit = 0
2. Liquidity Deposit = 1
3. Borrowed Assets = 2
4. Loan repayment = 3
5. Liquidity Withdrawal = 4
6. Collateral Withdrawal  = 5
7. Liquidation = 6


## Get Started

   ## Deploy contract and verify 
 - Deploy contract on your choice networks , ensure you visit chainlink ccip directory to get network router and link address

 ## Fund contracts with Links
 - Fund each of your contract with atleast 1 LINK token to help with inter network communication as gas fee is paid in LINKs


## Token Contracts and PriceFeeds
We will be adding two or three tokens to this contracts, ETH and USDT on base blockchain 
As a contract owner add the allowed tokens to each contract using the "addTokenAndPriceFeed"
Ensure you add all the three for each network, 

- Scroll Sepolia sUSDT Contract = 0xC27Bb2572977Af7e35FfFe2F55c9b83C2e8084c4;
- Scroll contract pricefeed USDT/USD = 0xb84a700192A78103B2dA2530D99718A2a954cE86 


- Base Sepolia wrapped eth contract = 0x4200000000000000000000000000000000000006
- Base contract pricefeed ETH/USD = 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1


- Base Sepolia sUSDT contract = 0xA99d28a9FA491F5359C0b3Ba58f3B3A962DF0354
- Base contract pricefeed USDT/USD = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165 


### TESTS EXAMPLES


## Where are these contracts deployed
This contract is deployed on two networks Scroll and Base, this is help with inter network communication

- Scroll Sepolia Network = 0x47A31b822714E5899e9b9e354864FC5CbDbd6aB3
- Base Sepolia Network = 0x09537Ae79EE5E446aaA562318Bf99ff64a429322



## CCIP ChainSelcectors, Router And Link Contract Address

 Base Network ChainSelcector => 10344971235874465080

 Base Network Router => 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93

 Base Network Link CA => 0xE4aB69C077896252FAFBD49EFD26B5D171A32410



 
 Scroll Network ChainSelector => 13204309965629103672

 Scroll Network Router  => 0x9a55E8Cab6564eb7bbd7124238932963B8Af71DC

 Scroll Network Link CA => 0x548C6944cba02B9D1C0570102c89de64D258d3Ac


