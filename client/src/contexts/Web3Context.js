import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ProduceLedgerABI from '../blockchain_data/ProduceLedger.json';
import paymentABI from '../blockchain_data/PaymentManager.json';
import ContractAddresses from '../blockchain_data/contract-addresses.json';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Web3 connection
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create provider and signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(address);
      setChainId(network.chainId);
      setIsConnected(true);

      // Store connection state
      localStorage.setItem('walletConnected', 'true');

    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  // Check if wallet was previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected && window.ethereum) {
      connectWallet();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
      });

      return () => {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      };
    }
  }, []);

  const getProduceLedger = () => {
    if (!signer) return null;
    return new ethers.Contract(
      ContractAddresses.PRODUCE_LEDGER_ADDRESS,
      ProduceLedgerABI,
      signer
    );
  };

  const getPaymentManager = () => {
    if (!signer) return null;
    return new ethers.Contract(
      ContractAddresses.PAYMENT_MANAGER_ADDRESS,
      paymentABI,
      signer
    );
  };

  // Link wallet to profile and grant role via backend
  const linkWallet = async (walletAddress) => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/blockchain/link-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Fallback if token is in localstorage
        },
        body: JSON.stringify({ walletAddress: walletAddress || account })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (err) {
      console.error("Link wallet failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerFarmerRole = linkWallet;

  // Process Escrow Payment
  const processEscrowPayment = async (produceId, amountInEth) => {
    const contract = getPaymentManager();
    if (!contract) throw new Error("Wallet not connected");

    try {
      setLoading(true);
      const tx = await contract.processPayment(produceId, {
        value: ethers.utils.parseEther(amountInEth.toString())
      });
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error("Payment failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    provider,
    signer,
    account,
    chainId,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    getProduceLedger,
    getPaymentManager,
    registerFarmerRole,
    linkWallet,
    processEscrowPayment
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
