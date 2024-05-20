// index.js

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [tokenSale, setTokenSale] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [tokenPrice, setTokenPrice] = useState(undefined);
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [totalBuyCost, setTotalBuyCost] = useState(0);
  const [sellPrice] = useState(0.015); // Fixed selling price of 0.015 ethers per token

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your actual contract address
  const tokenSaleABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
      console.log("MetaMask detected.");
    }
  };

  const connectAccount = async () => {
    if (!window.ethereum) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        console.log("Account connected:", accounts[0]);
        setAccount(accounts[0]);
        getTokenSaleContract();
      } else {
        console.log("No account found");
        alert('No account found. Please make sure to select an account in MetaMask.');
      }
    } catch (error) {
      console.error('Error connecting account:', error);
      alert('Error connecting account. Please try again or check your MetaMask extension.');
    }
  };

  const getTokenSaleContract = async () => {
    if (!ethWallet) {
      console.error("Wallet not initialized.");
      return;
    }

    try {
      const signer = ethWallet.getSigner();
      const contract = new ethers.Contract(contractAddress, tokenSaleABI, signer);
      console.log("Contract initialized:", contract);
      setTokenSale(contract);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const getTokenPrice = async () => {
    if (!tokenSale) {
      console.error("Contract not initialized.");
      return;
    }

    try {
      const price = await tokenSale.checkTokenPrice();
      console.log("Token price retrieved:", ethers.utils.formatEther(price));
      setTokenPrice(ethers.utils.formatEther(price));
    } catch (error) {
      console.error('Error retrieving token price:', error);
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (tokenSale) {
      getTokenPrice();
    }
  }, [tokenSale]);

  const purchaseTokens = async () => {
    if (!ethWallet || !tokenSale || !account || !tokenPrice || buyAmount <= 0) {
      console.error("Wallet, contract, account, token price, or buy amount not initialized.");
      return;
    }

    try {
      const totalValue = ethers.utils.parseEther((tokenPrice * buyAmount).toString());
      const gasPrice = await ethWallet.getGasPrice();
      const tx = await tokenSale.purchaseToken(buyAmount, { value: totalValue, gasPrice: gasPrice });
      await tx.wait();
      console.log(`${buyAmount} tokens purchased successfully!`);
      getBalance();
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      alert('Failed to purchase tokens. Please check the console for more details.');
    }
  };

  const sellTokens = async () => {
    if (!ethWallet || !tokenSale || !account || sellAmount <= 0) {
      console.error("Wallet, contract, account, or sell amount not initialized.");
      return;
    }
  
    try {
      const gasPrice = await ethWallet.getGasPrice();
      const tx = await tokenSale.sellToken(sellAmount, { value: 0, gasPrice: gasPrice });
      await tx.wait();
      console.log(`${sellAmount} tokens sold successfully!`);
      getBalance();
    } catch (error) {
      console.error('Error selling tokens:', error);
      alert('Failed to sell tokens. Please check the console for more details.');
    }
  };
  
  
  
  
  const getBalance = async () => {
    if (tokenSale && account) {
      const balance = await tokenSale.checkTokenBalance(account);
      setBalance(balance.toString());
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p className={styles.infoText}>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return <button className={styles.connectBtn} onClick={connectAccount}>Connect MetaMask</button>;
    }

    return (
      <div className={styles.userInfo}>
        <p className={styles.userInfoText}>Your Account: {account}</p>
        <p className={styles.userInfoText}>Token Price: {tokenPrice} ETH</p>
        <p className={styles.userInfoText}>Your Token Balance: {balance}</p>
        <div className={styles.inputContainer}>
          <input type="number" min="0" value={buyAmount} onChange={(e) => setBuyAmount(parseInt(e.target.value))} />
          <button className={styles.actionBtn} onClick={purchaseTokens}>Buy Tokens</button>
          <p>Total Cost: {totalBuyCost} ETH</p>
        </div>
        <div className={styles.inputContainer}>
          <input type="number" min="0" value={sellAmount} onChange={(e) => setSellAmount(parseInt(e.target.value))} />
          <button className={styles.actionBtn} onClick={sellTokens}>Sell Tokens</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (tokenSale && buyAmount > 0) {
      setTotalBuyCost((parseFloat(tokenPrice) * buyAmount).toFixed(2));
    }
  }, [buyAmount, tokenPrice]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Token Sale</h1>
      {initUser()}
    </div>
  );
}
