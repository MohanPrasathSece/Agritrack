/**
 * ml_helper.js
 * ============
 * Unified ML helper — analyses crop images using ONLY local ML models.
 * No external AI / Gemini API calls are made here.
 *
 * Pipeline:
 *   Image → predict_image_quality.py (feature extraction + RandomForest)
 *         → predict_quality.py       (manual-feature fallback)
 *         → predict_signals.py       (demand + shelf-life)
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Run a python script and return parsed JSON output.
 * @param {string} script  Filename relative to server root (e.g. 'predict.py')
 * @param {string[]} args  CLI arguments
 * @param {number} [timeoutMs=20000]
 */
function runPython(script, args, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, `../${script}`);
        // Quote each arg so spaces in paths survive
        const safeArgs = args.map(a => (typeof a === 'string' ? `"${a}"` : a));
        const cmd = `python "${scriptPath}" ${safeArgs.join(' ')}`;

        exec(cmd, { timeout: timeoutMs }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[ml_helper] Python error (${script}):`, error.message);
                if (stderr) console.error(`[ml_helper] stderr:`, stderr.slice(0, 300));
                return reject(error);
            }

            // stdout may contain warnings before JSON – find first '{'
            const raw = (stdout || '').trim();
            const jsonStart = raw.indexOf('{');
            if (jsonStart === -1) {
                return reject(new Error(`No JSON in output from ${script}: ${raw.slice(0, 200)}`));
            }

            try {
                resolve(JSON.parse(raw.substring(jsonStart)));
            } catch (parseErr) {
                reject(new Error(`JSON parse error from ${script}: ${raw.slice(0, 200)}`));
            }
        });
    });
}

// ─── Core: Image-Based ML Analysis ───────────────────────────────────────────

/**
 * Analyse a crop image using only the local RandomForest image-quality model.
 * Extracts colour, texture, defect and shape features directly from pixels.
 *
 * @param {string} imagePath  Absolute path to the image file
 * @param {string} cropName   e.g. 'Tomato'
 * @returns {Promise<Object>}
 */
async function analyzeImageWithLocalML(imagePath, cropName = 'general') {
    if (!fsSync.existsSync(imagePath)) {
        throw new Error(`Image not found: ${imagePath}`);
    }

    const result = await runPython('predict_image_quality.py', [imagePath, cropName]);

    if (!result.success) {
        throw new Error(result.error || 'Local ML image analysis failed');
    }

    return result;
}

// ─── Secondary: Signal Prediction ────────────────────────────────────────────

/**
 * Predict demand and shelf-life for a given crop using the local RF models.
 * Falls back gracefully if crop encoder doesn't know the crop name.
 *
 * @param {string} cropName
 * @param {number} [moisture=15]
 * @returns {Promise<Object|null>}
 */
async function getMarketSignals(cropName, moisture = 15) {
    // Only TOP (Tomato, Onion, Potato) are in the encoder
    const supportedCrops = ['Tomato', 'Onion', 'Potato'];
    const normalised = supportedCrops.find(c =>
        (cropName || '').toLowerCase().includes(c.toLowerCase())
    ) || 'Tomato';

    const currentMonth = new Date().getMonth() + 1;
    const currentTemp = 28;

    try {
        const signals = await runPython('predict_signals.py', [normalised, currentMonth, currentTemp, moisture]);
        return signals.success ? signals : null;
    } catch {
        return null;
    }
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Full auto-analysis: image → local ML quality + market signals.
 * This is the primary function used by the aggregator collection flow.
 *
 * @param {string} imagePath  Absolute path to the uploaded image
 * @param {string} cropName   Crop type string
 * @returns {Promise<Object>}
 */
async function autoAnalyzeQuality(imagePath, cropName = 'general crop') {
    console.log(`[ml_helper] Analysing "${cropName}" image via local ML: ${imagePath}`);

    // ── 1. Check if image-quality model files exist ───────────────────────────
    const modelDir = path.join(__dirname, '../ml_data');
    const requiredModels = [
        'img_quality_grade_model.pkl',
        'img_quality_score_model.pkl',
        'img_quality_scaler.pkl',
        'img_quality_features.pkl',
    ];
    const modelsMissing = requiredModels.some(m => !fsSync.existsSync(path.join(modelDir, m)));

    if (modelsMissing) {
        console.warn('[ml_helper] Image quality models not trained. Returning mock.');
        return generateMockAnalysis();
    }

    try {
        // ── 2. Run image quality prediction ──────────────────────────────────
        const quality = await analyzeImageWithLocalML(imagePath, cropName);

        // ── 3. Run market signals (demand + shelf-life) ───────────────────────
        const moistureEst = quality.moistureContent || 15;
        const signals = await getMarketSignals(cropName, moistureEst);

        // ── 4. Merge and return ───────────────────────────────────────────────
        return {
            ...quality,
            marketSignals: signals ? {
                demandScore: signals.demandScore,
                estimatedShelfLife: signals.estimatedLife,
            } : null,
            method: 'LocalML-ImageAnalysis',
        };

    } catch (err) {
        console.error('[ml_helper] Analysis pipeline error:', err.message);
        return generateMockAnalysis();
    }
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function generateMockAnalysis() {
    return {
        success: true,
        overallGrade: 'A',
        qualityScore: 85.5,
        visualInspection: {
            color: 'Good',
            texture: 'Uniform',
            size: 'Uniform',
        },
        moistureContent: 14.2,
        purityLevel: 96.8,
        defectDetection: [],
        organicCompliance: true,
        pesticidesDetected: false,
        marketRecommendation: {
            suggestedPrice: 55,
            marketDemand: 'High',
            bestMarkets: ['Regional Market', 'Retail Stores'],
        },
        rawFeatures: {
            brightness: 72,
            saturation: 65,
            textureUniformity: 80,
            defectRatio: 2.1,
            shapeScore: 78,
        },
        method: 'Mock (System Fallback)',
    };
}

module.exports = { autoAnalyzeQuality, analyzeImageWithLocalML, getMarketSignals };
