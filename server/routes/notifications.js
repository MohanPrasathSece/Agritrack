const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { protect } = require('../middleware/auth');

// Get notifications for current user
router.get('/', protect, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        // PGRST205 = table not found in schema cache (table not yet created)
        if (error && error.code === 'PGRST205') {
            return res.json({ success: true, notifications: [] });
        }
        if (error) throw error;

        res.json({ success: true, notifications: data || [] });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error && error.code === 'PGRST205') {
            return res.json({ success: true });
        }
        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Mark all as read
router.put('/read-all', protect, async (req, res) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', req.user.id);

        if (error && error.code === 'PGRST205') {
            return res.json({ success: true });
        }
        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating notifications:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
