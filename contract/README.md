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


## Get Started

 - Deploy contract on your choice network (e.g Scroll)

## Token Contracts and PriceFeeds

We will be adding two or three tokens to this contracts, wBTC and sUSDT  to the contract.

As a contract owner add the allowed tokens to the contract using the "addTokenAndPriceFeed"


- Scroll Sepolia sUSDT Contract = 0xC27Bb2572977Af7e35FfFe2F55c9b83C2e8084c4
- Scroll contract pricefeed USDT/USD = 0xb84a700192A78103B2dA2530D99718A2a954cE86 

 - Scroll sepolia wrapped BTC contract = 0x281D5a078fEcc2D113b5FD1ADA814C75F9397bAa ;
 - Scroll sepolia pricefeed Wrapped BTC => 0x87dce67002e66C17BC0d723Fe20D736b80CAaFda ;

 - Scroll sepolia wrapped ETH contract = 0x08Fe95f3E49C2d5231Eef694C2087a7a550D7593 ;
 - Scroll sepolia pricefeed wrapped ETH =>  0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41 ;



### You can mint these test tokens  using the respective contracts
- NB: Ensure to give the contract approval to spend your token

sUSDT : https://sepolia.scrollscan.com/token/0xC27Bb2572977Af7e35FfFe2F55c9b83C2e8084c4 (max of 2500 ether)

wBTC :  https://sepolia.scrollscan.com/token/0x281d5a078fecc2d113b5fd1ada814c75f9397baa   (max of 2 ether)

wETH : https://sepolia.scrollscan.com/token/0x08fe95f3e49c2d5231eef694c2087a7a550d7593    (max of 20 ether)


### Deployed contract

https://sepolia.scrollscan.com/address/0xb97a27cea38ca15b913c742384a748afe01044a2#code