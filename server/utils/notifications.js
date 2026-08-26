const supabase = require('../config/supabase');

/**
 * Create a new notification for a user
 * @param {string} userId - ID of the user to receive notification
 * @param {string} title - Title of notification
 * @param {string} message - Message body
 * @param {string} type - info|success|warning|error
 * @param {string} link - Optional link to related page
 */
const createNotification = async (userId, title, message, type = 'info', link = null) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .insert([{
                user_id: userId,
                title,
                message,
                type,
                link,
                is_read: false
            }]);

        if (error) {
            // PGRST205 = table not found - silently skip if table doesn't exist yet
            if (error.code === 'PGRST205') {
                return { success: false, skipped: true };
            }
            console.error('Error creating notification:', error);
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to create notification:', error);
        return { success: false, error };
    }
};

/**
 * Create bulk notifications for multiple users
 * @param {array} userIds - Array of user IDs
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - info|success|warning|error
 * @param {string} link - Optional link to related page
 */
const createBulkNotifications = async (userIds, title, message, type = 'info', link = null) => {
    try {
        const notifications = userIds.map(userId => ({
            user_id: userId,
            title,
            message,
            type,
            link,
            is_read: false
        }));

        const { error } = await supabase
            .from('notifications')
            .insert(notifications);

        if (error) {
            if (error.code === 'PGRST205') {
                return { success: false, skipped: true };
            }
            console.error('Error creating bulk notifications:', error);
            return { success: false, error };
        }

        console.log(`✅ Bulk notifications created for ${userIds.length} users: ${title}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to create bulk notifications:', error);
        return { success: false, error };
    }
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {object} options - Query options (limit, unreadOnly, etc.)
 */
const getUserNotifications = async (userId, options = {}) => {
    try {
        const { limit = 20, unreadOnly = false, type = null } = options;

        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (unreadOnly) {
            query = query.eq('is_read', false);
        }

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) {
            if (error.code === 'PGRST205') {
                return [];
            }
            console.error('Get notifications error:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Get notifications failed:', error);
        return [];
    }
};

/**
 * Mark notifications as read
 * @param {string} userId - User ID
 * @param {array} notificationIds - Array of notification IDs (optional, marks all as read if not provided)
 */
const markNotificationsRead = async (userId, notificationIds = null) => {
    try {
        let query = supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId);

        if (notificationIds && notificationIds.length > 0) {
            query = query.in('id', notificationIds);
        }

        const { error } = await query;

        if (error) {
            if (error.code === 'PGRST205') {
                return false;
            }
            console.error('Mark notifications read error:', error);
            return false;
        }

        console.log(`✅ Marked notifications as read for user ${userId}`);
        return true;
    } catch (error) {
        console.error('Mark notifications read failed:', error);
        return false;
    }
};

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 */
const getUnreadCount = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) {
            if (error.code === 'PGRST205') {
                return 0;
            }
            console.error('Get unread count error:', error);
            return 0;
        }

        return data?.length || 0;
    } catch (error) {
        console.error('Get unread count failed:', error);
        return 0;
    }
};

// Agriculture-specific notification helpers

// Farmer notifications
const notifyFarmerCropListed = async (farmerId, cropName, cropId) => {
  return await createNotification(
    farmerId,
    '🌾 Crop Listed Successfully!',
    `Your ${cropName} has been listed and is now visible to aggregators.`,
    'success',
    `/farmer/crops/${cropId}`
  );
};

const notifyFarmerCropCollected = async (farmerId, cropName, aggregatorName, batchId) => {
  return await createNotification(
    farmerId,
    '🚚 Crop Collected by Aggregator',
    `Your ${cropName} has been collected by ${aggregatorName}. Batch ID: ${batchId}`,
    'info',
    `/farmer/crops`
  );
};

const notifyFarmerOrderReceived = async (farmerId, cropName, quantity, orderId) => {
  return await createNotification(
    farmerId,
    '📦 New Order Received!',
    `You have a new order for ${quantity} of ${cropName}. Order ID: ${orderId}`,
    'success',
    `/farmer/orders/${orderId}`
  );
};

// Aggregator notifications
const notifyAggregatorNewCropAvailable = async (aggregatorId, cropName, farmerName, quality) => {
  return await createNotification(
    aggregatorId,
    '🌱 New Quality Crop Available',
    `${farmerName} has listed ${cropName} (${quality} grade) for collection.`,
    'info',
    `/aggregator/marketplace`
  );
};

const notifyAggregatorOrderReceived = async (aggregatorId, retailerName, cropName, quantity, orderId) => {
  return await createNotification(
    aggregatorId,
    '🛒 New Retail Order',
    `${retailerName} ordered ${quantity} of ${cropName}. Order ID: ${orderId}`,
    'success',
    `/aggregator/orders/${orderId}`
  );
};

// Retailer notifications
const notifyRetailerNewAggregatorBatch = async (retailerId, cropName, qualityGrade, aggregatorName) => {
  return await createNotification(
    retailerId,
    '🏆 Premium Aggregator Batch Available',
    `${aggregatorName} has listed ${qualityGrade} grade ${cropName} for purchase.`,
    'success',
    `/retailer/marketplace`
  );
};

const notifyRetailerOrderConfirmed = async (retailerId, cropName, orderId, estimatedDelivery) => {
  return await createNotification(
    retailerId,
    '✅ Order Confirmed',
    `Your order for ${cropName} has been confirmed. Estimated delivery: ${estimatedDelivery}`,
    'success',
    `/retailer/orders/${orderId}`
  );
};

const notifyRetailerOrderShipped = async (retailerId, cropName, trackingNumber, orderId) => {
  return await createNotification(
    retailerId,
    '🚚 Order Shipped!',
    `Your ${cropName} order has been shipped. Tracking: ${trackingNumber}`,
    'info',
    `/retailer/orders/${orderId}`
  );
};

// Quality check notifications
const notifyQualityCheckComplete = async (userId, cropName, grade, score) => {
  return await createNotification(
    userId,
    '🔍 Quality Check Complete',
    `Your ${cropName} has been graded: ${grade} (${score}/100). Ready for market!`,
    'success',
    `/farmer/crops`
  );
};

// Payment notifications
const notifyPaymentReceived = async (userId, amount, orderId) => {
  return await createNotification(
    userId,
    '💰 Payment Received',
    `Payment of ₹${amount} has been received for order ${orderId}.`,
    'success',
    `/farmer/payments`
  );
};

const notifyPaymentProcessed = async (userId, amount, orderId) => {
  return await createNotification(
    userId,
    '💳 Payment Processed',
    `Payment of ₹${amount} has been processed for order ${orderId}.`,
    'info',
    `/retailer/orders/${orderId}`
  );
};

module.exports = {
  createNotification,
  createBulkNotifications,
  getUserNotifications,
  markNotificationsRead,
  getUnreadCount,
  // Agriculture-specific helpers
  notifyFarmerCropListed,
  notifyFarmerCropCollected,
  notifyFarmerOrderReceived,
  notifyAggregatorNewCropAvailable,
  notifyAggregatorOrderReceived,
  notifyRetailerNewAggregatorBatch,
  notifyRetailerOrderConfirmed,
  notifyRetailerOrderShipped,
  notifyQualityCheckComplete,
  notifyPaymentReceived,
  notifyPaymentProcessed
};
