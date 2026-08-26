const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { grantBlockchainRole, ledgerContract, provider, wallet } = require('../config/blockchain');
const supabase = require('../config/supabase');
const router = express.Router();

// @route   POST /api/v1/blockchain/link-wallet
// @desc    Link wallet to profile and grant blockchain role
// @access  Private
router.post('/link-wallet', protect, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!walletAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }

    // 1. Update profile in Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_address: walletAddress })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 2. Grant role on blockchain if not already granted
    // For production, we would check if the role is already assigned. 
    // For now, we attempt to grant it. Note: This assumes the server wallet is Admin.
    const roleResult = await grantBlockchainRole(userRole, walletAddress);

    if (!roleResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Wallet linked to profile, but blockchain role grant failed.',
        error: roleResult.error
      });
    }

    res.json({
      success: true,
      message: `Wallet linked and ${userRole} role granted on blockchain`,
      txHash: roleResult.txHash
    });

  } catch (error) {
    console.error('Link wallet error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/v1/blockchain/status/:produceId
// @desc    Get produce status directly from blockchain
// @access  Public
router.get('/status/:produceId', async (req, res) => {
  try {
    const { produceId } = req.params;
    const produce = await ledgerContract.getProduce(produceId);

    if (produce.farmer === '0x0000000000000000000000000000000000000000') {
      return res.status(404).json({ success: false, message: 'Produce not found on blockchain' });
    }

    const statusNames = ['Harvested', 'InTransit', 'Delivered', 'Sold'];
    const gradeNames = ['A', 'B', 'C', 'D'];

    res.json({
      success: true,
      data: {
        id: produce.id.toString(),
        farmer: produce.farmer,
        cropType: produce.cropType,
        quantity: produce.quantity.toString(),
        grade: gradeNames[produce.grade],
        status: statusNames[produce.status],
        location: produce.location,
        updatedAt: new Date(produce.updatedAt.toNumber() * 1000).toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/v1/blockchain/journey/start
// @desc    Start a supply chain journey
// @access  Private (Farmer)
router.post('/journey/start', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const { produceId, location, temperature } = req.body;
    const { startSupplyChainJourney } = require('../config/blockchain');

    const result = await startSupplyChainJourney(produceId, location, temperature);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      message: 'Supply chain journey started',
      txHash: result.txHash
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/v1/blockchain/journey/update
// @desc    Update supply chain stage
// @access  Private (Authorized roles)
router.post('/journey/update', protect, async (req, res) => {
  try {
    const { produceId, stage, location, temperature, note } = req.body;
    const { updateSupplyChainStage } = require('../config/blockchain');

    // Stage mapping: 0:Harvested, 1:Collected, 2:InStorage, 3:InTransit, 4:AtRetailer, 5:Sold
    // Validation could be added here or rely on contract

    const result = await updateSupplyChainStage(produceId, stage, location, temperature, note);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      message: 'Supply chain stage updated',
      txHash: result.txHash
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/v1/blockchain/journey/:produceId
// @desc    Get journey details from blockchain
// @access  Public
router.get('/journey/:produceId', async (req, res) => {
  try {
    const { produceId } = req.params;
    const { supplyChainContract } = require('../config/blockchain');

    const journey = await supplyChainContract.getJourney(produceId);

    // Format the journey data
    const formattedJourney = {
      produceId: journey.produceId.toString(),
      currentStage: journey.currentStage,
      farmer: journey.farmer,
      aggregator: journey.aggregator,
      transporter: journey.transporter,
      retailer: journey.retailer,
      locations: journey.locations,
      notes: journey.notes,
      isActive: journey.isActive,
      timestamps: {
        harvest: journey.harvestTimestamp.toString(),
        collection: journey.collectionTimestamp.toString(),
        storage: journey.storageTimestamp.toString(),
        transit: journey.transitTimestamp.toString(),
        retailer: journey.retailerTimestamp.toString(),
        sale: journey.saleTimestamp.toString()
      }
    };

    res.json({
      success: true,
      data: formattedJourney
    });
  } catch (error) {
    console.error('Fetch journey error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/v1/blockchain/demo-status
// @desc    Get blockchain demo status (works without MetaMask)
// @access  Public
router.get('/demo-status', async (req, res) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = (parseFloat(balance) / 1e18).toFixed(4);
    const network = await provider.getNetwork();
    const currentId = await ledgerContract.getCurrentProduceId();

    res.json({
      success: true,
      data: {
        connected: true,
        network: network.name,
        chainId: network.chainId.toString(),
        blockNumber,
        walletAddress: wallet.address,
        balanceEth,
        currentProduceId: currentId.toString(),
        demoMode: true,
        message: 'Blockchain operates in demo mode. All transactions are processed server-side.'
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        connected: false,
        demoMode: true,
        message: 'Blockchain node offline. Demo mode available when node is running.',
        error: error.message
      }
    });
  }
});

// @route   GET /api/v1/blockchain/demo/produce/:produceId
// @desc    Get produce details from blockchain (demo)
// @access  Public
router.get('/demo/produce/:produceId', async (req, res) => {
  try {
    const produceId = parseInt(req.params.produceId, 10);
    const produce = await ledgerContract.getProduce(produceId);

    if (produce.farmer === '0x0000000000000000000000000000000000000000') {
      return res.status(404).json({ success: false, message: 'Produce not found' });
    }

    const statusNames = ['Harvested', 'InTransit', 'Delivered', 'Sold'];
    const gradeNames = ['A', 'B', 'C', 'D'];

    res.json({
      success: true,
      data: {
        id: produce.id.toString(),
        farmer: produce.farmer,
        cropType: produce.cropType,
        quantity: produce.quantity.toString(),
        grade: gradeNames[produce.grade],
        status: statusNames[produce.status],
        location: produce.location,
        harvestDate: new Date(produce.harvestDate.toNumber() * 1000).toISOString(),
        updatedAt: new Date(produce.updatedAt.toNumber() * 1000).toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/v1/blockchain/escrow/release
// @desc    Release funds from escrow
// @access  Private (Admin/Aggregator)
router.post('/escrow/release', protect, authorize('aggregator', 'admin'), async (req, res) => {
  try {
    const { produceId, receiverAddress } = req.body;
    const { releaseEscrow } = require('../config/blockchain');

    const result = await releaseEscrow(produceId, receiverAddress);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      message: 'Escrow funds released successfully',
      txHash: result.txHash,
      blockNumber: result.blockNumber
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

