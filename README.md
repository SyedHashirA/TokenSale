# Array Valid or Unique Dapp

This repository contains a Solidity smart contract named Assessment along with a simple React DApp that interacts with the deployed contract using the Hardhat network. The contract provides functionality to check if an array is valid or contains unique elements.

## Description

* The constructor initializes the result variable, and the getResult function allows fetching the current result.
* The valid_array function checks if the provided array is valid (non-empty) and updates the result variable accordingly.
* The unique_elements function determines if the elements in the provided array are unique and updates the result variable accordingly.
* The DApp is a simple React application that connects to the Ethereum blockchain through MetaMask. It allows users to check if an array is valid or contains unique elements using the Assessment smart contract.

## Getting Started

### Executing the program

You can clone the repository by running-
```
git clone https://github.com/praneelpp/SCM-Starter.git
```
```
cd ethereum-assessment-dapp
```

Then , you can do the below steps to run it successfully:

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

### Connecting to Metamask
* Network Name- Hardhat network
* RPC URL-(will be provided when you run - npx hardhat node)
* Chain id-31337
* Symbol-ETH

## Authors

Praneel Patel GM

[praneelpatel88@gmail.com]

## License

This project is licensed under the [MIT] License - see the LICENSE.md file for details
