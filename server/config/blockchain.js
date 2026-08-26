const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');

// Load Contract ABIs and Addresses
const ledgerABI = require('../blockchain/ProduceLedger.json');
const paymentABI = require('../blockchain/PaymentManager.json');
const supplyChainABI = require('../blockchain/SupplyChainTracker.json');
const escrowABI = require('../blockchain/OrderEscrow.json');
const addresses = require('../blockchain/contract-addresses.json');

const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

// Aggregator/Admin Wallet for automated actions
const privateKey = process.env.AGGREGATOR_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Common Hardhat Account #0
const wallet = new ethers.Wallet(privateKey, provider);

const ledgerContract = new ethers.Contract(addresses.PRODUCE_LEDGER_ADDRESS, ledgerABI, wallet);
const paymentContract = new ethers.Contract(addresses.PAYMENT_MANAGER_ADDRESS, paymentABI, wallet);
const supplyChainContract = new ethers.Contract(addresses.SUPPLY_CHAIN_TRACKER_ADDRESS, supplyChainABI, wallet);
const escrowContract = new ethers.Contract(addresses.ORDER_ESCROW_ADDRESS, escrowABI, wallet);

/**
 * Update produce status on blockchain
 * @param {string|number} produceId 
 * @param {number} status (0: Harvested, 1: InTransit, 2: Delivered, 3: Sold)
 */
const updateProduceStatus = async (produceId, status) => {
    try {
        console.log(`⛓️  Blockchain: Updating status to ${status} for ID: ${produceId}`);
        const tx = await ledgerContract.updateProduceStatus(produceId, status);
        const receipt = await tx.wait();
        return { success: true, txHash: receipt.transactionHash, blockNumber: receipt.blockNumber };
    } catch (error) {
        console.error('Blockchain status update error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update quality grade on blockchain
 * @param {string|number} produceId 
 * @param {number} grade (0: A, 1: B, 2: C, 3: D)
 */
const updateQualityGrade = async (produceId, grade) => {
    try {
        console.log(`⛓️  Blockchain: Updating grade to ${grade} for ID: ${produceId}`);
        const tx = await ledgerContract.updateQualityGrade(produceId, grade);
        const receipt = await tx.wait();
        return { success: true, txHash: receipt.transactionHash, blockNumber: receipt.blockNumber };
    } catch (error) {
        console.error('Blockchain grade update error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Grant role on blockchain
 * @param {string} role (farmer, aggregator, retailer)
 * @param {string} address 
 */
const grantBlockchainRole = async (role, address) => {
    try {
        console.log(`⛓️  Blockchain: Granting ${role} role to ${address}`);
        let tx;
        switch (role.toLowerCase()) {
            case 'farmer':
                tx = await ledgerContract.grantFarmerRole(address);
                await supplyChainContract.grantFarmerRole(address).then(t => t.wait());
                break;
            case 'aggregator':
                tx = await ledgerContract.grantAggregatorRole(address);
                await supplyChainContract.grantAggregatorRole(address).then(t => t.wait());
                break;
            case 'retailer':
                tx = await ledgerContract.grantRetailerRole(address);
                await supplyChainContract.grantRetailerRole(address).then(t => t.wait());
                break;
            default:
                throw new Error('Invalid role');
        }
        const receipt = await tx.wait();
        return { success: true, txHash: receipt.transactionHash };
    } catch (error) {
        console.error('Blockchain role grant error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Release escrowed funds on blockchain
 * @param {string|number} produceId 
 * @param {string} receiverAddress 
 */
const releaseEscrow = async (produceId, receiverAddress) => {
    try {
        console.log(`⛓️  Blockchain: Releasing escrow for ID: ${produceId} to ${receiverAddress}`);
        const tx = await paymentContract.releaseFunds(produceId, receiverAddress);
        const receipt = await tx.wait();
        return { success: true, txHash: receipt.transactionHash, blockNumber: receipt.blockNumber };
    } catch (error) {
        console.error('Blockchain escrow release error:', error);
        return { success: false, error: error.message };
    }
};

// Supply Chain Functions

const startSupplyChainJourney = async (produceId, location, temperature) => {
    try {
        console.log(`⛓️  Blockchain: Starting journey for ID: ${produceId}`);
        // We might need to impersonate the farmer or ensure the caller has role?
        // Since this backend uses a single wallet, we must ensure THIS wallet has FARMER_ROLE or is Admin?
        // Admin can't start journey? Only Farmer.
        // If the backend wallet is ADMIN, it needs to grant itself FARMER_ROLE?
        // Or we use the Farmer's private key (not possible usually).
        // Solution: Admin grants itself all roles, or we just allow Admin in contract?
        // Contract says: onlyRole(FARMER_ROLE).
        // For demo, we grant our backend wallet FARMER_ROLE.
        const tx = await supplyChainContract.startJourney(produceId, location, temperature);
        const receipt = await tx.wait();
        return { success: true, txHash: receipt.transactionHash };
    } catch (error) {
        console.error('Blockchain journey start error:', error);
        return { success: false, error: error.message };
    }
};

const updateSupplyChainStage = async (produceId, stage, location, temperature, note) => {
    try {
        console.log(`⛓️  Blockchain: Updating journey stage to ${stage} for ID: ${produceId}`);
        const tx = await supplyChainContract.updateStage(produceId, stage, location, temperature, note);
        const receipt = await tx.wait();
        return { success: true, txHash: receipt.transactionHash };
    } catch (error) {
        console.error('Blockchain journey update error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Register produce on blockchain (demo mode - server-side, no MetaMask)
 * Backend wallet acts on behalf of farmer for full transaction flow
 */
const registerProduce = async (cropType, quantity, grade, expectedPrice, location, imageHash, isOrganic) => {
    const doRegister = async () => {
        const certs = [];
        const tx = await ledgerContract.registerProduce(
            cropType,
            Math.floor(quantity),
            grade,
            Math.floor(expectedPrice),
            location || 'Farm Location',
            imageHash || '',
            isOrganic || false,
            certs
        );
        const receipt = await tx.wait();
        const event = receipt.events?.find(e => e.event === 'ProduceRegistered');
        let produceId = event?.args?.produceId ? parseInt(event.args.produceId.toString(), 10) : null;
        if (!produceId) {
            produceId = (await ledgerContract.getCurrentProduceId()).toNumber();
        }
        return { success: true, produceId, txHash: receipt.transactionHash };
    };

    try {
        const result = await doRegister();
        console.log(`⛓️  Blockchain: Registered produce ID ${result.produceId}`);
        return result;
    } catch (error) {
        if (error.message?.includes('AccessControl') || error.message?.includes('Unauthorized')) {
            try {
                await grantBlockchainRole('farmer', wallet.address);
                const result = await doRegister();
                console.log(`⛓️  Blockchain: Registered produce ID ${result.produceId}`);
                return result;
            } catch (retryErr) {
                console.error('Blockchain register produce retry error:', retryErr);
                return { success: false, error: retryErr.message };
            }
        }
        console.error('Blockchain register produce error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    provider,
    wallet,
    ledgerContract,
    paymentContract,
    supplyChainContract,
    escrowContract,
    updateProduceStatus,
    updateQualityGrade,
    grantBlockchainRole,
    releaseEscrow,
    registerProduce,
    startSupplyChainJourney,
    updateSupplyChainStage
};
