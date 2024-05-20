// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Assessment {
    address public owner;
    uint public tokenPrice; // Price of each token in wei
    uint public totalSupply;
    uint public sellPrice; // Fixed selling price in wei per token
    mapping(address => uint) public balances;

    constructor() {
        owner = msg.sender;
        tokenPrice = 0.01 ether; // Cost of each token in wei
        totalSupply = 1000; // Initial total supply
        sellPrice = 0.015 ether; // Fixed selling price in wei per token
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function purchaseToken(uint _numberOfTokens) external payable {
        require(_numberOfTokens > 0, "Number of tokens must be greater than zero");

        uint totalCost = _numberOfTokens * tokenPrice;
        require(msg.value >= totalCost, "Insufficient funds sent");

        require(totalSupply >= _numberOfTokens, "Not enough tokens available");

        balances[msg.sender] += _numberOfTokens;
        totalSupply -= _numberOfTokens;
    }

    function sellToken(uint _numberOfTokens) external {
        require(balances[msg.sender] >= _numberOfTokens, "Insufficient tokens balance");

        uint totalRefund = _numberOfTokens * sellPrice; // Calculate the total refund amount based on the selling price
        require(address(this).balance >= totalRefund, "Contract balance is insufficient");

        balances[msg.sender] -= _numberOfTokens;
        totalSupply += _numberOfTokens;

        payable(msg.sender).transfer(totalRefund); // Transfer the total refund amount back to the seller
    }

    function checkTokenPrice() external view returns (uint) {
        return tokenPrice;
    }

    function checkTokenBalance(address _buyer) external view returns (uint) {
        return balances[_buyer];
    }
}
