const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

/**
 * @desc    Get comprehensive dashboard data for a farmer
 * @route   GET /api/v1/farmer/dashboard/:email
 * @access  Public (Simplified auth for now)
 */
router.get('/dashboard/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log(`[FarmerDashboard] Fetching data for: ${email}`);

        // 1. Find farmer profile
        const { data: farmer, error: farmerError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (farmerError || !farmer) {
            console.error(`[FarmerDashboard] Profile NOT FOUND for: ${email}`, farmerError);
            return res.status(404).json({
                success: false,
                message: 'Farmer profile not found'
            });
        }

        console.log(`[FarmerDashboard] Found farmer profile: ${farmer.id}`);

        const farmerId = farmer.id;

        // 2. Get Crops Stats
        const { data: crops, error: cropsError } = await supabase
            .from('crops')
            .select('status, quantity, price_per_unit')
            .eq('farmer_id', farmerId)
            .neq('status', 'deleted');


        if (cropsError) {
            console.error(`[FarmerDashboard] Crops query ERROR:`, cropsError);
            throw cropsError;
        }

        console.log(`[FarmerDashboard] Found ${crops?.length || 0} crops`);

        const totalCrops = crops?.length || 0;
        const listedCrops = crops?.filter(c => c.status === 'listed').length || 0;
        const soldCrops = crops?.filter(c => c.status === 'sold').length || 0;
        const collectedCrops = crops?.filter(c => c.status === 'collected').length || 0;

        // 3. Get Orders Stats
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('seller_id', farmerId);

        if (ordersError) {
            console.error(`[FarmerDashboard] Orders query ERROR:`, ordersError);
            throw ordersError;
        }

        console.log(`[FarmerDashboard] Found ${orders?.length || 0} orders`);

        const activeOrders = orders?.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length || 0;
        const completedSales = orders?.filter(o => o.status === 'delivered').length || 0;

        // Calculate total revenue and monthly earnings
        let totalRevenue = 0;
        const monthlyEarningsMap = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize monthly map with last 7 months
        const last7Months = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = months[d.getMonth()];
            last7Months.push(monthName);
            monthlyEarningsMap[monthName] = 0;
        }

        orders?.forEach(order => {
            if (order.status === 'delivered' || order.payment_status === 'completed') {
                const amount = parseFloat(order.total_amount || 0);
                totalRevenue += isNaN(amount) ? 0 : amount;

                const dateStr = order.order_date || order.created_at;
                if (dateStr) {
                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime())) {
                        const monthName = months[date.getMonth()];
                        if (monthlyEarningsMap[monthName] !== undefined) {
                            monthlyEarningsMap[monthName] += isNaN(amount) ? 0 : amount;
                        }
                    }
                }
            }
        });

        const chartData = last7Months.map(month => ({
            name: month,
            sales: Math.round(monthlyEarningsMap[month] || 0)
        }));

        console.log(`[FarmerDashboard] Revenue calculated: ${totalRevenue}`);

        // 4. Get Recent Activity
        // We combine recent crops and recent orders for activity
        const { data: recentCrops } = await supabase
            .from('crops')
            .select('name, status, created_at')
            .eq('farmer_id', farmerId)

            .order('created_at', { ascending: false })
            .limit(5);

        const { data: recentOrders } = await supabase
            .from('orders')
            .select('order_id, status, created_at, total_amount')
            .eq('seller_id', farmerId)
            .order('created_at', { ascending: false })
            .limit(5);

        const activity = [];

        recentCrops?.forEach(c => {
            activity.push({
                id: `crop-${c.created_at}`,
                text: `Crop '${c.name}' listed`,
                time: getTimeAgo(new Date(c.created_at)),
                type: 'listed',
                timestamp: new Date(c.created_at)
            });
        });

        recentOrders?.forEach(o => {
            let text = '';
            let type = '';
            if (o.status === 'pending') {
                text = `New order ${o.order_id} received`;
                type = 'order';
            } else if (o.status === 'delivered') {
                text = `Order ${o.order_id} delivered`;
                type = 'sold';
            } else {
                text = `Order ${o.order_id} status updated to ${o.status}`;
                type = 'update';
            }

            activity.push({
                id: `order-${o.order_id}`,
                text,
                time: getTimeAgo(new Date(o.created_at)),
                type,
                timestamp: new Date(o.created_at)
            });
        });

        // Sort activity by timestamp
        const sortedActivity = activity
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5);

        // Get some inventory data
        const inventory = (crops || []).slice(0, 3).map(c => {
            const qty = parseFloat(c.quantity || 0);
            const total = qty + 100;
            const percentage = total > 0 ? Math.min(100, Math.round((qty / total) * 100)) : 0;
            return {
                name: c.name || 'Commodity',
                percentage
            };
        });
        res.json({
            success: true,
            data: {
                farmer: {
                    name: farmer.name,
                    email: farmer.email,
                    wallet_balance: totalRevenue * 0.9,
                    revenue: totalRevenue
                },
                stats: {
                    totalCrops,
                    activeOrders,
                    completedSales,
                    listedCrops,
                    soldCrops,
                    collectedCrops,
                    totalRevenue,
                    availableStock: listedCrops,
                    chartData,
                    inventory
                },
                cropStatusOverview: [
                    { label: "Listed", count: listedCrops, color: "bg-blue-500" },
                    { label: "Collected", count: collectedCrops, color: "bg-orange-500" },
                    { label: "Sold", count: soldCrops, color: "bg-green-600" },
                ],
                recentActivity: sortedActivity
            }
        });

    } catch (error) {
        console.error('Farmer Dashboard Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data: ' + error.message
        });
    }
});

/**
 * @desc    Get all crops for a farmer
 * @route   GET /api/v1/farmer/crops/:email
 */
router.get('/crops/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching crops for email:', email);

        const { data: farmer, error: farmerError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (farmerError) {
            console.error('Farmer lookup error:', farmerError);
            return res.status(404).json({ success: false, message: 'Farmer not found', error: farmerError.message });
        }

        if (!farmer) {
            console.log('Farmer not found for email:', email);
            return res.status(404).json({ success: false, message: 'Farmer not found' });
        }

        console.log('Found farmer ID:', farmer.id);

        const { data: crops, error } = await supabase
            .from('crops')
            .select('*')
            .eq('farmer_id', farmer.id)
            .neq('status', 'deleted')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Crops query error:', error);
            throw error;
        }

        console.log('Found crops:', crops?.length || 0);
        res.json({ success: true, crops: crops || [] });
    } catch (error) {
        console.error('Get farmer crops full error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @desc    Get all orders for a farmer with full details
 * @route   GET /api/v1/farmer/orders/:email
 */
router.get('/orders/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { data: farmer } = await supabase.from('profiles').select('id').eq('email', email).single();

        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                crop:crops(id, name, variety, unit),
                buyer:profiles!orders_buyer_id_fkey(id, name, email, phone)
            `)
            .eq('seller_id', farmer.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Format for frontend
        const formattedOrders = orders.map(order => ({
            id: order.order_id,
            buyer: order.buyer?.name || 'Unknown Buyer',
            crop: order.crop?.name || 'Unknown Crop',
            variety: order.crop?.variety,
            qty: `${order.quantity} ${order.unit}`,
            quality: order.quality_requirements?.grade || 'A',
            status: order.status,
            date: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            buyer_details: order.buyer,
            crop_id: order.crop?.id,
            total_amount: order.total_amount
        }));

        res.json({ success: true, orders: formattedOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @desc    Update order status by farmer
 * @route   PUT /api/v1/farmer/orders/:orderId/status
 */
router.put('/orders/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, message, location } = req.body;

        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .single();

        if (fetchError || !order) return res.status(404).json({ success: false, message: 'Order not found' });

        const updatedTracking = [
            ...(order.tracking_updates || []),
            {
                status,
                message: message || `Order updated to ${status} by farmer`,
                timestamp: new Date().toISOString(),
                location: location || 'Farm'
            }
        ];

        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
                status,
                tracking_updates: updatedTracking,
                updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({ success: true, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @desc    Get farmer profile
 * @route   GET /api/v1/farmer/profile/:email
 */
router.get('/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error) throw error;

        res.json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @desc    Update farmer profile
 * @route   PUT /api/v1/farmer/profile/:email
 */
router.put('/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = req.body;

        const { data: profile, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('email', email)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @desc    Get quality reports for a farmer
 * @route   GET /api/v1/farmer/reports/:email
 */
router.get('/reports/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { data: farmer } = await supabase.from('profiles').select('id').eq('email', email).single();

        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        // 1. Get reports from crops (AI analysis)
        const { data: crops } = await supabase
            .from('crops')
            .select('id, name, variety, ai_analysis, images, harvest_date')
            .eq('farmer_id', farmer.id)

            .not('ai_analysis', 'is', null);

        // 2. Get reports from collections (Quality assessment)
        const { data: collections } = await supabase
            .from('collections')
            .select('id, collection_id, source_crop_id, quality_assessment, collection_date, crops(name)')
            .eq('farmer_id', farmer.id)
            .not('quality_assessment', 'is', null);

        const reports = [];

        crops?.forEach(c => {
            reports.push({
                id: c.id,
                type: 'ai_analysis',
                crop: c.name,
                variety: c.variety,
                grade: c.ai_analysis?.grade || 'N/A',
                score: c.ai_analysis?.score || 0,
                date: new Date(c.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                image: c.images?.[0] || null,
                details: c.ai_analysis
            });
        });

        collections?.forEach(col => {
            reports.push({
                id: col.id,
                type: 'collection_assessment',
                crop: col.crops?.name || 'Collected Crop',
                grade: col.quality_assessment?.grade || 'N/A',
                score: col.quality_assessment?.score || 0,
                date: new Date(col.collection_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                details: col.quality_assessment
            });
        });

        // Calculate summary
        const allScores = reports.map(r => r.score).filter(s => s > 0);
        const avgScore = allScores.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : 0;

        res.json({
            success: true,
            reports: reports.sort((a, b) => new Date(b.date) - new Date(a.date)),
            summary: {
                avgScore,
                totalAnalyzed: reports.length,
                avgGrade: avgScore >= 90 ? 'A+' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B+' : 'B'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @desc    Get all payments for a farmer
 * @route   GET /api/v1/farmer/payments/:email
 */
router.get('/payments/:email', async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        // 1. Get profile first
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email);

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            return res.status(500).json({ success: false, message: 'Database error fetching profile' });
        }

        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Farmer not found' });
        }

        const farmerId = profiles[0].id;

        // 2. Fetch completed orders (simulating payments for now)
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('seller_id', farmerId)
            .eq('payment_status', 'completed');

        if (ordersError) {
            console.error('Orders fetch error:', ordersError);
            // Don't fail the whole request, just return empty if it's a specific table issue
            return res.json({ success: true, payments: [], stats: { wallet_balance: 0, pending_payments: 0, total_earned: 0 } });
        }

        // 3. Resolve crop names
        const cropIds = [...new Set((orders || []).map(o => o.crop_id).filter(Boolean))];
        const cropsMap = {};
        if (cropIds.length > 0) {
            const { data: crops } = await supabase.from('crops').select('id, name').in('id', cropIds);
            crops?.forEach(c => cropsMap[c.id] = c.name);
        }

        const payments = (orders || []).map(order => {
            let orderDate = "Pending";
            try {
                const d = order.updated_at || order.created_at;
                if (d) {
                    orderDate = new Date(d).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    });
                }
            } catch (e) {
                console.error("Date parse error:", e);
            }

            return {
                id: order.id || order.order_id || 'TX-' + Math.random().toString(36).substr(2, 9),
                crop: cropsMap[order.crop_id] || 'Fresh Produce',
                amount: parseFloat(order.total_amount) || 0,
                hash: order.blockchain_hash || '—',
                status: order.status === 'delivered' ? 'released' : 'pending',
                date: orderDate
            };
        });

        const totalEarned = (orders || []).reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

        res.json({
            success: true,
            payments,
            stats: {
                wallet_balance: totalEarned * 0.95,
                pending_payments: 0,
                total_earned: totalEarned
            }
        });
    } catch (error) {
        console.error('Payments CRITICAL error:', error);
        res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
    }
});

// Helper function for time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

module.exports = router;
