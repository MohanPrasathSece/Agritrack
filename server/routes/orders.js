const express = require('express');
const supabase = require('../config/supabase');
const crypto = require('crypto');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get orders for a farmer (seller)
// @route   GET /api/v1/orders/farmer/:email
// @access  Public (simplified auth)
router.get('/farmer/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find farmer by email
    const { data: farmer, error: farmerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (farmerError || !farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get all orders for this farmer
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, crop:crops(*), buyer:profiles!orders_buyer_id_fkey(*)')
      .eq('seller_id', farmer.id)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders: ' + error.message
    });
  }
});

// @desc    Get orders for a buyer
// @route   GET /api/v1/orders/buyer/:email
// @access  Public (simplified auth)
router.get('/buyer/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find buyer by email
    const { data: buyer, error: buyerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (buyerError || !buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found'
      });
    }

    // Get all orders for this buyer
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, crop:crops(*), farmer:profiles!orders_seller_id_fkey(*)')
      .eq('buyer_id', buyer.id)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get buyer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders: ' + error.message
    });
  }
});

// @desc    Create a new order
// @route   POST /api/v1/orders
// @access  Public (simplified auth)
router.post('/', async (req, res) => {
  try {
    const {
      cropId,
      cropName,
      farmerEmail,
      buyerEmail,
      quantity,
      unit,
      pricePerUnit,
      deliveryAddress,
      notes,
      qualityRequirements,
      expectedDeliveryDate
    } = req.body;

    // Find farmer and buyer
    const { data: farmer } = await supabase.from('profiles').select('*').eq('email', farmerEmail).single();
    const { data: buyer } = await supabase.from('profiles').select('*').eq('email', buyerEmail).single();

    if (!farmer || !buyer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer or buyer not found'
      });
    }

    // Calculate total amount
    const totalAmount = quantity * pricePerUnit;
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create new order
    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        crop_id: cropId,
        seller_id: farmer.id,
        buyer_id: buyer.id,
        quantity: parseFloat(quantity),
        unit,
        price_per_unit: parseFloat(pricePerUnit),
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        status: 'pending',
        payment_status: 'pending',
        notes,
        quality_requirements: qualityRequirements,
        expected_delivery_date: expectedDeliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tracking_updates: [{
          status: 'pending',
          message: 'Order placed successfully',
          timestamp: new Date().toISOString(),
          location: deliveryAddress?.district || ''
        }]
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order: ' + error.message
    });
  }
});

// @desc    Place a new order for a crop listing (Aggregator specific)
// @route   POST /api/v1/orders/aggregator/place-order
// @access  Private (Aggregator only)
router.post('/aggregator/place-order', protect, authorize('aggregator'), async (req, res) => {
  try {
    const { cropId, quantity, unit, totalAmount, deliveryAddress, notes } = req.body;

    // 1. Get crop and farmer details
    const { data: crop, error: cropError } = await supabase
      .from('crops')
      .select('*, farmer:profiles(*)')
      .eq('id', cropId)
      .single();

    if (cropError || !crop) {
      return res.status(404).json({ success: false, message: 'Crop listing not found' });
    }

    if (crop.status !== 'listed') {
      return res.status(400).json({ success: false, message: 'Crop is no longer available' });
    }

    // 2. Create the order in pending status
    const orderId = `ORD-AGG-${Date.now()}`;
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        crop_id: cropId,
        seller_id: crop.farmer_id,
        buyer_id: req.user.id,
        quantity: parseFloat(quantity),
        unit,
        price_per_unit: parseFloat(totalAmount) / parseFloat(quantity),
        total_amount: parseFloat(totalAmount),
        status: 'pending',
        payment_status: 'pending',
        delivery_address: deliveryAddress || {},
        notes: notes || '',
        tracking_updates: [{
          status: 'pending',
          message: 'Order placed by aggregator, waiting for farmer confirmation',
          timestamp: new Date().toISOString(),
          location: deliveryAddress?.district || ''
        }]
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Notify the farmer
    try {
      const { createNotification } = require('../utils/notifications');
      await createNotification(
        crop.farmer_id,
        'New Order Received! 🛒',
        `An aggregator has placed an order for ${quantity}${unit} of your ${crop.name}. Please confirm now.`,
        'info',
        '/farmer/orders'
      );
    } catch (notifyErr) {
      console.error('Order notification failed:', notifyErr);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:orderId/status
// @access  Public (simplified auth)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, message, location, userEmail } = req.body;

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

    const { data: user } = await supabase.from('profiles').select('id').eq('email', userEmail).single();
    if (!user || (user.id !== order.seller_id && user.id !== order.buyer_id)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this order'
      });
    }

    const updatedTracking = [
      ...(order.tracking_updates || []),
      {
        status,
        message: message || `Order status updated to ${status}`,
        timestamp: new Date().toISOString(),
        location: location || ''
      }
    ];

    const updateData = {
      status,
      tracking_updates: updatedTracking
    };

    if (status === 'delivered') {
      updateData.actual_delivery_date = new Date().toISOString();
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    // --- AUTOMATIC AGGREGATOR INVENTORY TRANSFER ---
    if (status === 'confirmed') {
      try {
        // Find if buyer is an aggregator
        const { data: buyerProfile } = await supabase.from('profiles').select('role, id').eq('id', order.buyer_id).single();
        
        if (buyerProfile?.role === 'aggregator') {
          console.log('📦 Transferring confirmed order to aggregator inventory...');
          
          const batchId = `AGG-AUTO-${Date.now()}`;
          const { data: crop } = await supabase.from('crops').select('*').eq('id', order.crop_id).single();
          
          // Create collection record
          await supabase.from('collections').insert([{
            aggregator_id: buyerProfile.id,
            farmer_id: order.seller_id,
            source_crop_id: order.crop_id,
            collection_id: batchId,
            collected_quantity: order.quantity,
            collected_unit: order.unit,
            purchase_price: order.total_amount,
            status: 'collected',
            traceability_chain: [{
              stage: 'collection',
              actor: buyerProfile.id,
              timestamp: new Date().toISOString(),
              action: 'Order confirmed and inventory transferred automatically',
              notes: order.notes
            }]
          }]);

          // Update crop status
          await supabase.from('crops').update({ status: 'sold' }).eq('id', order.crop_id);

          // Notify aggregator
          try {
            const { createNotification } = require('../utils/notifications');
            await createNotification(
              order.buyer_id,
              'Order Confirmed! ✅',
              `Farmer has confirmed your order for ${order.quantity}${order.unit} of ${crop?.name || 'crop'}. It is now in your inventory.`,
              'success',
              '/aggregator/dashboard'
            );
          } catch (notifyErr) {
            console.error('Aggregator confirmation notification failed:', notifyErr);
          }
        }
      } catch (transferError) {
        console.error('Failed to transfer inventory during confirmation:', transferError);
      }
    }
    // ----------------------------------------------

    // --- BLOCKCHAIN INTEGRATION: RELEASE ESCROW ---
    if (status === 'delivered' && updatedOrder.payment_status === 'escrowed') {
      try {
        const { releaseEscrow } = require('../config/blockchain');

        const { data: crop } = await supabase.from('crops').select('blockchain_produce_id, traceability_id').eq('id', updatedOrder.crop_id).single();
        const produceId = crop?.blockchain_produce_id ?? crop?.traceability_id;
        const { data: farmer } = await supabase.from('profiles').select('wallet_address').eq('id', updatedOrder.seller_id).single();

        if (produceId != null && farmer?.wallet_address && typeof produceId === 'number') {
          console.log(`⛓️  Initializing blockchain escrow release for produce ${produceId}`);
          const releaseResult = await releaseEscrow(produceId, farmer.wallet_address);

            if (releaseResult.success) {
              await supabase.from('orders').update({
                payment_status: 'paid',
                notes: `${updatedOrder.notes}\n[✅ BLOCKCHAIN ESCROW RELEASED]\nTx: ${releaseResult.txHash}`
              }).eq('id', updatedOrder.id);

              // Notify Farmer
              try {
                const { createNotification } = require('../utils/notifications');
                await createNotification(
                  updatedOrder.seller_id,
                  'Payment Received! 💰',
                  `Escrow funds for Order ${updatedOrder.order_id} have been released to your wallet.`,
                  'success',
                  '/farmer/payments'
                );
              } catch (notifyErr) {
                console.error('Escrow release notification failed:', notifyErr);
              }

              console.log('✅ Blockchain escrow released successfully');
            }
        } else if (!farmer?.wallet_address) {
          console.log('⛓️  Escrow skip: farmer has no wallet address (demo mode)');
        }
      } catch (bcError) {
        console.error('Blockchain escrow release trigger failed:', bcError);
      }
    }
    // ----------------------------------------------

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status: ' + error.message
    });
  }
});

// @desc    Get single order details
// @route   GET /api/v1/orders/:orderId
// @access  Public (simplified auth)
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, crop:crops(*), farmer:profiles!orders_seller_id_fkey(*), buyer:profiles!orders_buyer_id_fkey(*)')
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details: ' + error.message
    });
  }
});

// @desc    Add rating and feedback
// @route   PUT /api/v1/orders/:orderId/rating
// @access  Public (simplified auth)
router.put('/:orderId/rating', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userEmail, rating, feedback, ratingType } = req.body;

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

    const { data: user } = await supabase.from('profiles').select('id').eq('email', userEmail).single();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is farmer or buyer and update appropriate rating
    const updateData = {};
    if (user.id === order.seller_id && ratingType === 'buyer') {
      updateData.buyer_rating = { rating, feedback };
    } else if (user.id === order.buyer_id && ratingType === 'farmer') {
      updateData.farmer_rating = { rating, feedback };
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to rate this order'
      });
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Rating added successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating: ' + error.message
    });
  }
});

// @desc    Get order statistics for farmer
// @route   GET /api/v1/orders/farmer/:email/stats
// @access  Public (simplified auth)
router.get('/farmer/:email/stats', async (req, res) => {
  try {
    const { email } = req.params;

    const { data: farmer, error: farmerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (farmerError || !farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', farmer.id);

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', farmer.id)
      .eq('status', 'pending');

    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', farmer.id)
      .eq('status', 'delivered');

    const { data: deliveredOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('seller_id', farmer.id)
      .eq('status', 'delivered');

    const totalRevenue = deliveredOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*, buyer:profiles!orders_buyer_id_fkey(name)')
      .eq('seller_id', farmer.id)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get farmer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics: ' + error.message
    });
  }
});

module.exports = router;
