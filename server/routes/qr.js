const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const supabase = require('../config/supabase');

const router = express.Router();

// @desc    Generate QR code for crop and persist image + metadata
// @route   GET /api/v1/qr/generate/:cropId
// @access  Public (idempotent)
router.get('/generate/:cropId', async (req, res) => {
  try {
    const { cropId } = req.params;

    // Fetch crop
    const { data: crop, error: cropError } = await supabase
      .from('crops')
      .select('*, farmer:profiles(*)')
      .eq('id', cropId)
      .single();

    if (cropError || !crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads', 'qr');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Use existing traceability_id or generate one if missing
    const traceId = crop.traceability_id || `CC-${Date.now()}`;

    // Save traceId if it was missing
    if (!crop.traceability_id) {
      await supabase.from('crops').update({ traceability_id: traceId }).eq('id', cropId);
    }

    // Build QR payload
    const payload = {
      traceabilityId: traceId,
      cropId: crop.id,
      type: 'crop',
      url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/trace/${traceId}`
    };

    const fileName = `crop-${traceId}.png`;
    const filePath = path.join(uploadsDir, fileName);

    // Generate and write QR PNG
    await QRCode.toFile(filePath, JSON.stringify(payload), {
      width: 512,
      margin: 2
    });

    const qrImageUrl = `/uploads/qr/${fileName}`;

    // Update crop document with QR metadata
    const { error: updateError } = await supabase
      .from('crops')
      .update({
        qr_code: {
          code: traceId,
          imageUrl: qrImageUrl,
          generatedAt: new Date()
        }
      })
      .eq('id', cropId);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'QR code generated',
      qr: {
        imageUrl: qrImageUrl,
        code: traceId,
        payload
      }
    });

  } catch (error) {
    console.error('QR Generate Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
});

// @desc    Verify QR code payload or code value quickly
// @route   GET /api/v1/qr/verify/:code
// @access  Public
router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Try to find by traceability_id or id
    const { data: crop, error } = await supabase
      .from('crops')
      .select('*, farmer:profiles(*)')
      .or(`traceability_id.eq.${code},id.eq.${code}`)
      .single();

    if (error || !crop) {
      return res.status(404).json({ success: false, message: 'QR not found' });
    }

    res.json({
      success: true,
      data: {
        crop: {
          id: crop.id,
          traceabilityId: crop.traceability_id,
          name: crop.name,
          variety: crop.variety,
          farmer: crop.farmer,
          status: crop.status,
          qrCode: crop.qr_code
        }
      }
    });

  } catch (error) {
    console.error('QR Verify Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify QR',
      error: error.message
    });
  }
});

// @desc    Get complete traceability chain for a traceabilityId
// @route   GET /api/v1/qr/trace/:traceabilityId
// @access  Public
router.get('/trace/:traceabilityId', async (req, res) => {
  try {
    const { traceabilityId } = req.params;

    // Find crop by traceabilityId
    const { data: crop, error: cropError } = await supabase
      .from('crops')
      .select('*, farmer:profiles(*)')
      .or(`traceability_id.eq.${traceabilityId},id.eq.${traceabilityId}`)
      .single();

    if (cropError || !crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    // Find collections linked to this crop
    const { data: collections, error: colError } = await supabase
      .from('collections')
      .select('*, aggregator:profiles(*)') // Add buyer info if available in schema
      .eq('source_crop_id', crop.id);

    if (colError) throw colError;

    // Build traceability chain
    const chain = [];

    // Stage 1: Farm Production
    chain.push({
      stage: 'Farm Production',
      actor: crop.farmer?.name || 'Unknown Farmer',
      location: crop.farm_location,
      timestamp: crop.harvest_date || crop.created_at,
      details: {
        cropName: crop.name,
        variety: crop.variety,
        category: crop.category,
        quality: crop.quality,
        isOrganic: crop.is_organic
      }
    });

    // Subsequent stages from collections
    const sortedCollections = (collections || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    for (const col of sortedCollections) {
      chain.push({
        stage: 'Collection & Quality Check',
        actor: col.aggregator?.name || 'Aggregator',
        location: col.collection_location,
        timestamp: col.created_at, // Accessing created_at as collection timestamp
        details: {
          qualityGrade: col.quality_assessment?.overallGrade,
          qualityScore: col.quality_assessment?.qualityScore,
          collectedQuantity: col.collected_quantity,
          aiAnalysis: col.quality_assessment?.aiAnalysis
        }
      });

      // Add additional stages from traceability_chain column if exists (JSONB)
      if (Array.isArray(col.traceability_chain)) {
        for (const entry of col.traceability_chain) {
          chain.push({
            stage: entry.stage,
            actor: entry.actor, // ID might need resolution if just ID
            timestamp: entry.timestamp,
            details: { note: entry.action || entry.notes }
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        product: {
          cropId: crop.id,
          traceabilityId: crop.traceability_id,
          name: crop.name,
          variety: crop.variety,
          category: crop.category,
          status: crop.status,
          qrCode: crop.qr_code
        },
        chain
      }
    });

  } catch (error) {
    console.error('QR Trace Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch traceability chain',
      error: error.message
    });
  }
});

module.exports = router;
