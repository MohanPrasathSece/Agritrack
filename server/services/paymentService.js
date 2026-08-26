const supabase = require('../config/supabase');
const { updateProduceStatus, transferPayment } = require('../config/blockchain');

/**
 * Payment Service for AgriTrack Platform
 * Handles payments between farmers, aggregators, and retailers
 */

class PaymentService {
  constructor() {
    this.platformFee = 0.05; // 5% platform fee
    this.escrowHoldTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  /**
   * Process payment from retailer to aggregator/farmer
   * @param {string} orderId - Order ID
   * @param {string} buyerId - Buyer (retailer) ID
   * @param {string} sellerId - Seller (aggregator/farmer) ID
   * @param {number} amount - Payment amount
   * @param {string} paymentMethod - Payment method (escrow, direct, etc.)
   */
  async processPayment(orderId, buyerId, sellerId, amount, paymentMethod = 'escrow') {
    try {
      console.log(`💳 Processing payment for order ${orderId}: ₹${amount}`);

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([{
          order_id: orderId,
          payer_id: buyerId,
          payee_id: sellerId,
          amount: parseFloat(amount),
          platform_fee: parseFloat(amount) * this.platformFee,
          net_amount: parseFloat(amount) * (1 - this.platformFee),
          payment_method: paymentMethod,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update order payment status
      await supabase
        .from('orders')
        .update({
          payment_status: 'processing',
          payment_id: payment.id,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      // Process based on payment method
      if (paymentMethod === 'escrow') {
        return await this.processEscrowPayment(payment);
      } else if (paymentMethod === 'direct') {
        return await this.processDirectPayment(payment);
      } else {
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }

    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  /**
   * Process escrow payment (hold until delivery confirmation)
   * @param {object} payment - Payment record
   */
  async processEscrowPayment(payment) {
    try {
      console.log(`🔒 Processing escrow payment for order ${payment.order_id}`);

      // Update payment to escrow status
      const { data: updatedPayment, error } = await supabase
        .from('payments')
        .update({
          status: 'escrowed',
          escrow_release_at: new Date(Date.now() + this.escrowHoldTime).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id)
        .select()
        .single();

      if (error) throw error;

      // Record on blockchain if available
      try {
        const blockchainResult = await transferPayment(
          payment.payer_id,
          payment.payee_id,
          payment.amount,
          payment.order_id
        );
        
        if (blockchainResult.success) {
          await supabase
            .from('payments')
            .update({
              blockchain_tx_hash: blockchainResult.txHash,
              blockchain_status: 'confirmed'
            })
            .eq('id', payment.id);
        }
      } catch (blockchainError) {
        console.warn('Blockchain payment recording failed:', blockchainError.message);
      }

      // Send notifications
      const { notifyPaymentProcessed } = require('../utils/notifications');
      await notifyPaymentProcessed(payment.payer_id, payment.amount, payment.order_id);

      return {
        success: true,
        payment: updatedPayment,
        message: 'Payment secured in escrow, will be released upon delivery confirmation'
      };

    } catch (error) {
      console.error('Escrow payment processing error:', error);
      throw error;
    }
  }

  /**
   * Process direct payment (immediate transfer)
   * @param {object} payment - Payment record
   */
  async processDirectPayment(payment) {
    try {
      console.log(`⚡ Processing direct payment for order ${payment.order_id}`);

      // Update payment to completed status
      const { data: updatedPayment, error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id)
        .select()
        .single();

      if (error) throw error;

      // Update seller's wallet balance
      await this.updateWalletBalance(payment.payee_id, payment.net_amount, 'credit');

      // Update platform fee collection
      await this.updatePlatformFees(payment.platform_fee, payment.order_id);

      // Send notifications
      const { notifyPaymentReceived } = require('../utils/notifications');
      await notifyPaymentReceived(payment.payee_id, payment.net_amount, payment.order_id);

      return {
        success: true,
        payment: updatedPayment,
        message: 'Payment processed successfully'
      };

    } catch (error) {
      console.error('Direct payment processing error:', error);
      throw error;
    }
  }

  /**
   * Release escrow payment after delivery confirmation
   * @param {string} orderId - Order ID
   */
  async releaseEscrowPayment(orderId) {
    try {
      console.log(`🔓 Releasing escrow payment for order ${orderId}`);

      // Get payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .eq('status', 'escrowed')
        .single();

      if (paymentError || !payment) {
        throw new Error('Escrow payment not found or already released');
      }

      // Update payment to completed
      const { data: updatedPayment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          released_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update seller's wallet balance
      await this.updateWalletBalance(payment.payee_id, payment.net_amount, 'credit');

      // Update platform fee collection
      await this.updatePlatformFees(payment.platform_fee, payment.order_id);

      // Send notifications
      const { notifyPaymentReceived } = require('../utils/notifications');
      await notifyPaymentReceived(payment.payee_id, payment.net_amount, payment.order_id);

      console.log(`✅ Escrow payment released for order ${orderId}`);
      return {
        success: true,
        payment: updatedPayment,
        message: 'Escrow payment released successfully'
      };

    } catch (error) {
      console.error('Escrow release error:', error);
      throw error;
    }
  }

  /**
   * Process refund
   * @param {string} orderId - Order ID
   * @param {string} reason - Refund reason
   */
  async processRefund(orderId, reason = 'Order cancelled') {
    try {
      console.log(`💸 Processing refund for order ${orderId}: ${reason}`);

      // Get payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .in('status', ['pending', 'processing', 'escrowed'])
        .single();

      if (paymentError || !payment) {
        throw new Error('Payment not found or not eligible for refund');
      }

      // Update payment to refunded
      const { data: updatedPayment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'refunded',
          refunded_at: new Date().toISOString(),
          refund_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refund buyer's wallet (if payment was completed)
      if (payment.status === 'completed') {
        await this.updateWalletBalance(payment.payer_id, payment.amount, 'credit');
      }

      console.log(`✅ Refund processed for order ${orderId}`);
      return {
        success: true,
        payment: updatedPayment,
        message: 'Refund processed successfully'
      };

    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  }

  /**
   * Update user wallet balance
   * @param {string} userId - User ID
   * @param {number} amount - Amount to add/subtract
   * @param {string} type - 'credit' or 'debit'
   */
  async updateWalletBalance(userId, amount, type = 'credit') {
    try {
      const actualAmount = type === 'credit' ? Math.abs(amount) : -Math.abs(amount);

      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      let newBalance;
      if (walletError || !wallet) {
        // Create new wallet
        newBalance = type === 'credit' ? actualAmount : 0;
        await supabase
          .from('wallets')
          .insert([{
            user_id: userId,
            balance: newBalance,
            updated_at: new Date().toISOString()
          }]);
      } else {
        // Update existing wallet
        newBalance = parseFloat(wallet.balance) + actualAmount;
        await supabase
          .from('wallets')
          .update({
            balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      }

      console.log(`💰 Wallet updated for user ${userId}: ${type === 'credit' ? '+' : '-'}₹${Math.abs(actualAmount)} (New balance: ₹${newBalance})`);
      return newBalance;

    } catch (error) {
      console.error('Wallet balance update error:', error);
      throw error;
    }
  }

  /**
   * Update platform fee collection
   * @param {number} feeAmount - Fee amount
   * @param {string} orderId - Order ID
   */
  async updatePlatformFees(feeAmount, orderId) {
    try {
      await supabase
        .from('platform_fees')
        .insert([{
          order_id: orderId,
          amount: feeAmount,
          collected_at: new Date().toISOString()
        }]);

      console.log(`💵 Platform fee collected: ₹${feeAmount} for order ${orderId}`);
      return true;

    } catch (error) {
      console.error('Platform fee collection error:', error);
      return false;
    }
  }

  /**
   * Get payment history for a user
   * @param {string} userId - User ID
   * @param {object} options - Query options
   */
  async getPaymentHistory(userId, options = {}) {
    try {
      const { limit = 20, offset = 0, status = null, type = null } = options;

      let query = supabase
        .from('payments')
        .select(`
          *,
          order:orders(order_id, total_amount, status),
          payer:profiles!payments_payer_id_fkey(name, email),
          payee:profiles!payments_payee_id_fkey(name, email)
        `)
        .or(`payer_id.eq.${userId},payee_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Categorize payments for the user
      const payments = (data || []).map(payment => ({
        ...payment,
        userRole: payment.payer_id === userId ? 'payer' : 'payee',
        amount: payment.payer_id === userId ? -payment.amount : payment.net_amount,
        displayAmount: payment.payer_id === userId ? 
          `-₹${payment.amount}` : 
          `+₹${payment.net_amount}`
      }));

      return payments;

    } catch (error) {
      console.error('Get payment history error:', error);
      return [];
    }
  }

  /**
   * Get wallet balance for a user
   * @param {string} userId - User ID
   */
  async getWalletBalance(userId) {
    try {
      const { data: wallet, error } = await supabase
        .from('wallets')
        .select('balance, updated_at')
        .eq('user_id', userId)
        .single();

      if (error || !wallet) {
        return {
          balance: 0,
          updated_at: new Date().toISOString()
        };
      }

      return wallet;

    } catch (error) {
      console.error('Get wallet balance error:', error);
      return {
        balance: 0,
        updated_at: new Date().toISOString()
      };
    }
  }

  /**
   * Get payment statistics for a user
   * @param {string} userId - User ID
   */
  async getPaymentStats(userId) {
    try {
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .or(`payer_id.eq.${userId},payee_id.eq.${userId}`);

      if (!payments || payments.length === 0) {
        return {
          totalSpent: 0,
          totalReceived: 0,
          totalFees: 0,
          transactionCount: 0
        };
      }

      const stats = payments.reduce((acc, payment) => {
        if (payment.payer_id === userId) {
          acc.totalSpent += payment.amount;
        } else {
          acc.totalReceived += payment.net_amount;
        }
        acc.totalFees += payment.platform_fee || 0;
        acc.transactionCount += 1;
        return acc;
      }, {
        totalSpent: 0,
        totalReceived: 0,
        totalFees: 0,
        transactionCount: 0
      });

      return stats;

    } catch (error) {
      console.error('Get payment stats error:', error);
      return {
        totalSpent: 0,
        totalReceived: 0,
        totalFees: 0,
        transactionCount: 0
      };
    }
  }

  /**
   * Auto-release escrow payments that are past their hold time
   */
  async autoReleaseEscrowPayments() {
    try {
      const now = new Date().toISOString();

      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'escrowed')
        .lte('escrow_release_at', now);

      if (error) throw error;

      for (const payment of payments) {
        try {
          await this.releaseEscrowPayment(payment.order_id);
          console.log(`⏰ Auto-released escrow for order ${payment.order_id}`);
        } catch (releaseError) {
          console.error(`Failed to auto-release escrow for order ${payment.order_id}:`, releaseError);
        }
      }

      return payments.length;

    } catch (error) {
      console.error('Auto-release escrow error:', error);
      return 0;
    }
  }
}

module.exports = new PaymentService();
