const express = require('express');
const supabase = require('../config/supabase');
const { body, validationResult } = require('express-validator');
const { autoAnalyzeQuality } = require('../utils/ml_helper');
const { registerProduce } = require('../config/blockchain');
const path = require('path');

const router = express.Router();

// Helper to determine category from crop name
function getCategoryFromName(name) {
  const lowerName = name.toLowerCase();

  if (['rice', 'paddy', 'wheat', 'maize', 'corn', 'barley', 'oats'].includes(lowerName)) {
    return 'grains';
  } else if (['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'spinach', 'vegetable'].includes(lowerName)) {
    return 'vegetables';
  } else if (['apple', 'banana', 'orange', 'mango', 'grapes', 'fruit'].includes(lowerName)) {
    return 'fruits';
  } else if (['groundnut', 'peanut', 'lentil', 'chickpea', 'bean', 'pulse'].includes(lowerName)) {
    return 'pulses';
  } else if (['turmeric', 'chili', 'pepper', 'coriander', 'cumin', 'spice'].includes(lowerName)) {
    return 'spices';
  } else if (['sugarcane', 'cotton', 'tobacco'].includes(lowerName)) {
    return 'cash_crops';
  }

  return 'grains'; // Default category
}

// @route   GET /api/v1/crops/marketplace
// @desc    Get marketplace crops with filters
// @access  Public
router.get('/marketplace', async (req, res) => {
  try {
    const {
      category, location, minPrice, maxPrice, isOrganic, search,
      page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc'
    } = req.query;

    let query = supabase
      .from('crops')
      .select('*, farmer:profiles(*)', { count: 'exact' })
      .eq('status', 'listed')


    if (category) query = query.eq('category', category);
    if (isOrganic === 'true') query = query.eq('is_organic', true);

    if (minPrice) query = query.gte('price_per_unit', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price_per_unit', parseFloat(maxPrice));

    if (search) {
      query = query.or(`name.ilike.%${search}%,variety.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (location) {
      // Postgres JSONB query for location
      query = query.or(`farm_location->>district.ilike.%${location}%,farm_location->>state.ilike.%${location}%`);
    }

    const { data: crops, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: {
        crops,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(count / limit),
          total: count
        }
      }
    });

  } catch (error) {
    console.error('Get marketplace crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// @route   GET /api/v1/crops/:id
// @desc    Get single crop details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { data: crop, error } = await supabase
      .from('crops')
      .select('*, farmer:profiles(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Increment views (simplified - just update)
    await supabase
      .from('crops')
      .update({ views: (crop.views || 0) + 1 })
      .eq('id', req.params.id);

    res.json({
      success: true,
      data: { crop }
    });

  } catch (error) {
    console.error('Get crop details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// @desc    Create new crop (simplified auth)
// @route   POST /api/v1/crops/upload
// @access  Public (simplified auth)
router.post('/upload', async (req, res) => {
  try {
    const { name, quantity, unit, pricePerUnit, farmerEmail, variety, category, images, ai_analysis } = req.body;

    // Basic validation
    if (!name || !quantity || !farmerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Name, quantity, and farmer email are required'
      });
    }

    // Find farmer by email in profiles
    const { data: farmer, error: farmerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', farmerEmail)
      .single();

    if (farmerError || !farmer || farmer.role !== 'farmer') {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Automatic Quality Check logic
    let finalAiAnalysis = ai_analysis;
    if (!finalAiAnalysis && images && images.length > 0) {
      try {
        console.log('Automating quality analysis for upload...');
        // Take the first image. fileUrl is usually like "/uploads/foo.png"
        const firstImageRelativePath = images[0].startsWith('/uploads/')
          ? images[0].replace('/uploads/', '')
          : images[0];

        const absolutePath = path.join(__dirname, '../uploads', firstImageRelativePath);
        finalAiAnalysis = await autoAnalyzeQuality(absolutePath, name);
      } catch (err) {
        console.error('Auto quality analysis failed:', err);
      }
    }

    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const traceabilityId = `CC-${timestamp}-${random}`;

    // Blockchain registration (demo mode - server-side, no MetaMask)
    let blockchainProduceId = null;
    try {
      const gradeMap = { Premium: 0, A: 0, B: 1, C: 2, D: 3, Rejected: 2 };
      const grade = gradeMap[finalAiAnalysis?.overallGrade] ?? 0;
      const qty = Math.floor(parseFloat(quantity) || 1);
      const priceWei = Math.floor((parseFloat(pricePerUnit) || 0) * 1e15);
      const bcResult = await registerProduce(
        name,
        qty,
        grade,
        priceWei,
        'Farm Location',
        images?.[0] || '',
        false
      );
      if (bcResult.success) blockchainProduceId = bcResult.produceId;
    } catch (bcErr) {
      console.warn('Blockchain registration skipped:', bcErr.message);
    }

    const cropPayload = {
      name,
      variety: variety || name,
      category: category || getCategoryFromName(name),
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      price_per_unit: parseFloat(pricePerUnit) || 0,
      farmer_id: farmer.id,
      harvest_date: new Date().toISOString(),
      status: 'listed',
      farm_location: farmer.address || {},
      images: images || [],
      ai_analysis: finalAiAnalysis,
      traceability_id: traceabilityId
    };
    if (blockchainProduceId != null) cropPayload.blockchain_produce_id = blockchainProduceId;

    const { data: crop, error: insertError } = await supabase
      .from('crops')
      .insert([cropPayload])
      .select('*, farmer:profiles(*)')
      .single();

    if (insertError) throw insertError;

    // Send notification to farmer
    try {
      const { createNotification } = require('../utils/notifications');
      await createNotification(
        farmer.id,
        'Crop Listed Successfully 🌾',
        `Your ${name} harvest has been listed on the marketplace. Trace ID: ${traceabilityId}`,
        'success',
        `/crop/${crop.id}`
      );
    } catch (notifyError) {
      console.error('Failed to send notification:', notifyError);
    }

    res.status(201).json({
      success: true,
      message: 'Crop uploaded successfully',
      crop
    });

  } catch (error) {
    console.error('Upload crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload crop: ' + error.message
    });
  }
});

// @desc    Get crops by farmer email
// @route   GET /api/v1/crops/farmer/:email
// @access  Public (simplified auth)
router.get('/farmer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

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

    // Build query
    let query = supabase
      .from('crops')
      .select('*, farmer:profiles(*)', { count: 'exact' })
      .eq('farmer_id', farmer.id)


    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Get crops with pagination
    const { data: crops, count, error } = await query
      .order('created_at', { ascending: false })
      .range((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit) - 1);

    if (error) throw error;

    // Calculate stats
    const totalRevenue = crops
      .filter(crop => crop.status === 'sold')
      .reduce((sum, crop) => sum + (parseFloat(crop.quantity) * parseFloat(crop.price_per_unit)), 0);

    res.json({
      success: true,
      data: {
        crops,
        stats: {
          totalCrops: count,
          totalRevenue,
          activeCrops: crops.filter(crop => crop.status === 'listed').length
        },
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(count / parseInt(limit)),
          total: count
        }
      }
    });

  } catch (error) {
    console.error('Get farmer crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get farmer crops: ' + error.message
    });
  }
});

// @desc    Update crop details (status, blockchain hash, AI analysis)
// @route   PUT /api/v1/crops/:id
// @access  Public (simplified auth)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: crop, error } = await supabase
      .from('crops')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Crop updated successfully',
      crop
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crop: ' + error.message
    });
  }
});

// @desc    Delete crop (soft delete)
// @route   DELETE /api/v1/crops/:id
// @access  Public (simplified auth)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete crop with ID:', id);

    // First check if crop exists
    const { data: existingCrop, error: fetchError } = await supabase
      .from('crops')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Crop fetch error during delete:', fetchError);
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
        error: fetchError.message
      });
    }

    if (!existingCrop) {
      console.log('Crop not found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    console.log('Found crop to delete:', existingCrop.name);

    const { data: crop, error } = await supabase
      .from('crops')
      .update({
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Crop deactivate error during delete:', error);
      throw error;
    }

    console.log('Successfully deleted crop:', crop.name);
    res.json({
      success: true,
      message: 'Crop deleted successfully',
      crop
    });
  } catch (error) {
    console.error('Delete crop full error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crop: ' + error.message
    });
  }
});

module.exports = router;
