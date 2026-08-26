const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

// @desc    Update user location
// @route   PUT /api/v1/users/location
// @access  Public (simplified auth)
router.put('/location', async (req, res) => {
  try {
    const { email, address } = req.body;

    if (!email || !address) {
      return res.status(400).json({
        success: false,
        message: 'Email and address are required'
      });
    }

    const { data: user, error: updateError } = await supabase
      .from('profiles')
      .update({ address })
      .eq('email', email)
      .select()
      .single();

    if (updateError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      user
    });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location: ' + error.message
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Public (simplified auth)
router.put('/profile', async (req, res) => {
  try {
    const { email, ...updateData } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const { data: user, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('email', email)
      .select()
      .single();

    if (updateError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile: ' + error.message
    });
  }
});

// @desc    Get user profile by email
// @route   GET /api/v1/users/profile/:email
// @access  Public (simplified auth)
router.get('/profile/:email', async (req, res) => {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', req.params.email)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile: ' + error.message
    });
  }
});

module.exports = router;
