const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// @route   GET /api/v1/pricing/real-time/:crop
// @desc    Get real-time price prediction for a specific crop
// @access  Public
router.get('/real-time/:crop', async (req, res) => {
    try {
        const { crop } = req.params;
        const { location = 'Tamil Nadu' } = req.query;

        // Validate crop
        const validCrops = ['Tomato', 'Onion', 'Potato'];
        if (!validCrops.includes(crop)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid crop. Must be one of: ' + validCrops.join(', ')
            });
        }

        // Call Python script for real-time prediction
        const prediction = await getRealTimePricePrediction(crop, location);
        
        res.json({
            success: true,
            data: prediction
        });

    } catch (error) {
        console.error('Real-time pricing error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get real-time price prediction'
        });
    }
});

// @route   POST /api/v1/pricing/train-model
// @desc    Train pricing model with real-time data
// @access  Private (admin only)
router.post('/train-model', async (req, res) => {
    try {
        console.log('Starting real-time model training...');
        
        // Run Python training script
        const result = await runPythonScript('real_time_pricing.py');
        
        res.json({
            success: true,
            message: 'Real-time pricing model trained successfully',
            output: result
        });

    } catch (error) {
        console.error('Model training error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to train pricing model'
        });
    }
});

// @route   GET /api/v1/pricing/market-data
// @desc    Get current market data for all crops
// @access  Public
router.get('/market-data', async (req, res) => {
    try {
        const { location = 'Tamil Nadu' } = req.query;
        
        // Get market data for all crops
        const crops = ['Tomato', 'Onion', 'Potato'];
        const marketData = {};
        
        for (const crop of crops) {
            marketData[crop] = await getRealTimePricePrediction(crop, location);
        }
        
        res.json({
            success: true,
            data: marketData,
            location,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Market data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch market data'
        });
    }
});

// @route   GET /api/v1/pricing/historical/:crop
// @desc    Get historical price trends for a crop
// @access  Public
router.get('/historical/:crop', async (req, res) => {
    try {
        const { crop } = req.params;
        const { days = 30 } = req.query;

        // This would connect to your database to get historical data
        // For now, return simulated historical data
        const historicalData = generateHistoricalData(crop, parseInt(days));
        
        res.json({
            success: true,
            data: historicalData
        });

    } catch (error) {
        console.error('Historical data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch historical data'
        });
    }
});

// Helper functions
async function getRealTimePricePrediction(crop, location) {
    return new Promise((resolve, reject) => {
        const pythonScript = spawn('python', [
            path.join(__dirname, '../real_time_pricing.py'),
            '--predict',
            '--crop', crop,
            '--location', location
        ]);

        let output = '';
        let errorOutput = '';

        pythonScript.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonScript.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonScript.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script error:', errorOutput);
                resolve(getFallbackPrediction(crop, location));
                return;
            }

            try {
                const result = JSON.parse(output);
                resolve(result);
            } catch (parseError) {
                // Fallback to basic prediction if JSON parsing fails
                resolve(getFallbackPrediction(crop, location));
            }
        });

        // Timeout after 30 seconds
        setTimeout(() => {
            pythonScript.kill();
            resolve(getFallbackPrediction(crop, location));
        }, 30000);
    });
}

function getFallbackPrediction(crop, location) {
    const basePrices = { 'Tomato': 25, 'Onion': 35, 'Potato': 18 };
    const month = new Date().month;
    
    let price = basePrices[crop];
    
    // Apply seasonal factors
    if (crop === 'Tomato' && month >= 6 && month <= 9) {
        price *= 1.5;
    } else if (crop === 'Onion' && month >= 10 && month <= 12) {
        price *= 2.0;
    }
    
    return {
        crop,
        predicted_price: Math.round(price * (0.9 + Math.random() * 0.2)),
        confidence: 'medium',
        source: 'fallback',
        timestamp: new Date().toISOString()
    };
}

function generateHistoricalData(crop, days) {
    const data = [];
    const basePrices = { 'Tomato': 25, 'Onion': 35, 'Potato': 18 };
    const basePrice = basePrices[crop];
    
    for (let i = days; i > 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate price variation
        const seasonalFactor = getSeasonalFactor(crop, date.getMonth());
        const randomFactor = 0.9 + Math.random() * 0.2;
        const price = basePrice * seasonalFactor * randomFactor;
        
        data.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(price * 100) / 100,
            volume: Math.floor(Math.random() * 1000) + 500
        });
    }
    
    return data;
}

function getSeasonalFactor(crop, month) {
    if (crop === 'Tomato' && month >= 6 && month <= 9) return 1.5;
    if (crop === 'Onion' && month >= 10 && month <= 12) return 2.0;
    return 1.0;
}

async function runPythonScript(scriptName) {
    return new Promise((resolve, reject) => {
        const pythonScript = spawn('python', [
            path.join(__dirname, '../' + scriptName)
        ]);

        let output = '';
        let errorOutput = '';

        pythonScript.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonScript.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonScript.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Script failed: ${errorOutput}`));
                return;
            }
            resolve(output);
        });

        // Timeout after 2 minutes
        setTimeout(() => {
            pythonScript.kill();
            reject(new Error('Script timeout'));
        }, 120000);
    });
}

module.exports = router;
