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