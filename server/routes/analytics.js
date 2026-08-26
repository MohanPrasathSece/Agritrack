const express = require('express');
const supabase = require('../config/supabase');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/v1/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    let analytics = {};

    if (req.user.role === 'farmer') {
      // Farmer analytics
      // 1. Total Crops
      const { count: totalCrops, error: totalError } = await supabase
        .from('crops')
        .select('*', { count: 'exact', head: true })
        .eq('farmer_id', req.user.id);

      if (totalError) throw totalError;

      // 2. Sold Crops
      const { count: soldCrops, error: soldError } = await supabase
        .from('crops')
        .select('*', { count: 'exact', head: true })
        .eq('farmer_id', req.user.id)
        .eq('status', 'sold');

      if (soldError) throw soldError;

      // 3. Active Crops (listed or harvested)
      const { count: activeCrops, error: activeError } = await supabase
        .from('crops')
        .select('*', { count: 'exact', head: true })
        .eq('farmer_id', req.user.id)
        .in('status', ['harvested', 'listed']);

      if (activeError) throw activeError;

      analytics = {
        totalCrops: totalCrops || 0,
        soldCrops: soldCrops || 0,
        activeCrops: activeCrops || 0,
        successRate: totalCrops > 0 ? ((soldCrops / totalCrops) * 100).toFixed(1) : 0
      };

    } else if (req.user.role === 'admin') {
      // Admin analytics
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: totalCrops } = await supabase
        .from('crops')
        .select('*', { count: 'exact', head: true });

      // Assuming we use 'orders' as transactions for now, or 'transactions' table if you prefer
      // Let's use orders for general activity volume
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      analytics = {
        totalUsers: totalUsers || 0,
        totalCrops: totalCrops || 0,
        totalTransactions: totalOrders || 0,
        activeUsers: activeUsers || 0
      };
    } else {
      // Fallback for other roles or general
      analytics = { message: "Role specific analytics not implemented yet" };
    }

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

module.exports = router;
