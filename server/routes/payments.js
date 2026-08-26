const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const paymentService = require('../services/paymentService');
const supabase = require('../config/supabase');

/**
 * @route   POST /api/v1/payments/process
 * @desc    Process payment for an order
 * @access  Private
 */
router.post('/process', protect, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('amount').isNumeric().withMessage('Amount must be numeric'),
  body('paymentMethod').isIn(['escrow', 'direct']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, amount, paymentMethod } = req.body;
    const userId = req.user.id;

    // Verify order exists and user is involved
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyer_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the buyer can process payment'
      });
    }

    if (order.payment_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Process payment
    const result = await paymentService.processPayment(
      orderId,
      order.buyer_id,
      order.seller_id,
      amount,
      paymentMethod
    );

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: result
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed: ' + error.message
    });
  }
});

/**
 * @route   POST /api/v1/payments/release-escrow
 * @desc    Release escrow payment (for sellers or system)
 * @access  Private
 */
router.post('/release-escrow', protect, [
  body('orderId').notEmpty().withMessage('Order ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.body;
    const userId = req.user.id;

    // Verify order and user permissions
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only seller or admin can release escrow
    if (order.seller_id !== userId && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the seller can release escrow'
      });
    }

    // Order must be delivered before releasing escrow
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered before releasing escrow'
      });
    }

    // Release escrow
    const result = await paymentService.releaseEscrowPayment(orderId);

    res.json({
      success: true,
      message: 'Escrow released successfully',
      data: result
    });

  } catch (error) {
    console.error('Escrow release error:', error);
    res.status(500).json({
      success: false,
      message: 'Escrow release failed: ' + error.message
    });
  }
});

/**
 * @route   GET /api/v1/payments/history
 * @desc    Get payment history for authenticated user
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const { limit = 20, offset = 0, status, type } = req.query;
    const userId = req.user.id;

    const payments = await paymentService.getPaymentHistory(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      status,
      type
    });

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history: ' + error.message
    });
  }
});

/**
 * @route   GET /api/v1/payments/wallet
 * @desc    Get wallet balance for authenticated user
 * @access  Private
 */
router.get('/wallet', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await paymentService.getWalletBalance(userId);

    res.json({
      success: true,
      data: wallet
    });

  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance: ' + error.message
    });
  }
});

/**
 * @route   GET /api/v1/payments/my-transactions
 * @desc    Get user transactions (legacy endpoint - enhanced)
 * @access  Private
 */
router.get('/my-transactions', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get enhanced payment history
    const payments = await paymentService.getPaymentHistory(userId, { limit: 50 });

    // Get orders for additional context
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, crop:crops(*), buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*)')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Combine payment and order data
    const transactions = payments.map(payment => {
      const order = orders.find(o => o.order_id === payment.order_id);
      return {
        _id: payment.id,
        paymentId: payment.id,
        crop: order?.crop,
        buyer: order?.buyer,
        seller: order?.seller,
        quantity: order?.quantity,
        pricePerUnit: order?.price_per_unit,
        totalAmount: payment.amount,
        netAmount: payment.net_amount,
        status: payment.status,
        paymentStatus: payment.status,
        paymentMethod: payment.payment_method,
        platformFee: payment.platform_fee,
        userRole: payment.userRole,
        displayAmount: payment.displayAmount,
        createdAt: payment.created_at,
        completedAt: payment.completed_at,
        order: order
      };
    });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions: ' + error.message
    });
  }
});

/**
 * @route   GET /api/v1/payments/stats
 * @desc    Get payment statistics for authenticated user
 * @access  Private
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await paymentService.getPaymentStats(userId);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment stats: ' + error.message
    });
  }
});

module.exports = router;
