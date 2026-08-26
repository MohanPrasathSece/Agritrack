const QRCode = require('qrcode');

/**
 * Generate a comprehensive QR code for produce orders with full details
 * @param {object} produceData - Complete produce information
 * @param {string} produceData.traceabilityId - Unique traceability ID
 * @param {string} produceData.name - Product name
 * @param {string} produceData.farmerName - Farmer name
 * @param {string} produceData.qualityGrade - Quality grade
 * @param {number} produceData.qualityScore - Quality score
 * @param {string} produceData.harvestDate - Harvest date
 * @param {string} produceData.location - Farm location
 * @param {string} produceData.batchId - Batch ID (for aggregators)
 * @param {object} produceData.qualityMetrics - Quality metrics
 * @returns {Promise<object>} - QR code data and metadata
 */
const generateProduceQR = async (produceData) => {
    try {
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const traceUrl = `${baseUrl}/trace/${produceData.traceabilityId}`;

        // Create comprehensive QR data with all produce details
        const qrData = {
            type: 'agritrack-produce',
            version: '1.0',
            traceabilityId: produceData.traceabilityId,
            scanUrl: traceUrl,
            product: {
                name: produceData.name,
                variety: produceData.variety || 'Standard',
                category: produceData.category || 'Agriculture',
                batchId: produceData.batchId,
                harvestDate: produceData.harvestDate,
                quantity: produceData.quantity,
                unit: produceData.unit
            },
            farmer: {
                name: produceData.farmerName,
                location: produceData.location,
                certified: produceData.certified || false
            },
            quality: {
                grade: produceData.qualityGrade,
                score: produceData.qualityScore,
                metrics: produceData.qualityMetrics || {},
                inspectedAt: new Date().toISOString()
            },
            supplyChain: {
                stage: produceData.stage || 'harvest',
                status: produceData.status || 'fresh',
                lastUpdated: new Date().toISOString()
            },
            branding: {
                platform: 'AgriTrack',
                logo: `${baseUrl}/logo.png`,
                verified: produceData.verified || true
            }
        };

        // Generate QR code with the comprehensive data
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'H',
            margin: 2,
            color: {
                dark: '#059669', // emerald-600 (agricultural theme)
                light: '#ffffff'
            },
            width: 300
        });

        // Also generate a simple URL QR for fallback
        const urlQRCodeDataUrl = await QRCode.toDataURL(traceUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            color: {
                dark: '#0f172a', // slate-900
                light: '#ffffff'
            },
            width: 300
        });

        console.log(`🔗 Generated comprehensive QR for ${produceData.name} (${produceData.traceabilityId})`);

        return {
            qrCodeDataUrl,
            urlQRCodeDataUrl,
            qrData,
            scanUrl: traceUrl,
            metadata: {
                generatedAt: new Date().toISOString(),
                dataPoints: Object.keys(qrData).length,
                hasQualityData: !!qrData.quality,
                hasFarmerData: !!qrData.farmer,
                hasSupplyChainData: !!qrData.supplyChain
            }
        };
    } catch (err) {
        console.error('QR Generation Error:', err);
        throw err;
    }
};

/**
 * Generate a QR code that points to the public traceability page (legacy function)
 * @param {string} traceabilityId - The unique ID of the crop or batch
 * @returns {Promise<string>} - Base64 data URL of the QR code
 */
const generateTraceabilityQR = async (traceabilityId) => {
    try {
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const traceUrl = `${baseUrl}/trace/${traceabilityId}`;

        console.log(`🔗 Generating simple QR for URL: ${traceUrl}`);

        return await QRCode.toDataURL(traceUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            color: {
                dark: '#059669', // emerald-600
                light: '#ffffff'
            },
            width: 300
        });
    } catch (err) {
        console.error('QR Generation Error:', err);
        throw err;
    }
};

/**
 * Generate QR code for farmer profile
 * @param {object} farmerData - Farmer profile data
 * @returns {Promise<object>} - QR code data and metadata
 */
const generateFarmerQR = async (farmerData) => {
    try {
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const profileUrl = `${baseUrl}/farmer/${farmerData.id}`;

        const qrData = {
            type: 'agritrack-farmer',
            version: '1.0',
            farmerId: farmerData.id,
            profileUrl,
            farmer: {
                name: farmerData.name,
                phone: farmerData.phone,
                location: farmerData.address,
                farmSize: farmerData.farm_size,
                experience: farmerData.experience_years,
                certifications: farmerData.certifications || []
            },
            branding: {
                platform: 'AgriTrack',
                logo: `${baseUrl}/logo.png`,
                verified: farmerData.verified || false
            }
        };

        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'H',
            margin: 2,
            color: {
                dark: '#059669', // emerald-600
                light: '#ffffff'
            },
            width: 300
        });

        console.log(`👨‍🌾 Generated farmer QR for ${farmerData.name}`);

        return {
            qrCodeDataUrl,
            qrData,
            profileUrl,
            metadata: {
                generatedAt: new Date().toISOString(),
                farmerName: farmerData.name
            }
        };
    } catch (err) {
        console.error('Farmer QR Generation Error:', err);
        throw err;
    }
};

/**
 * Generate QR code for aggregator batch
 * @param {object} batchData - Aggregator batch data
 * @returns {Promise<object>} - QR code data and metadata
 */
const generateAggregatorQR = async (batchData) => {
    try {
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const batchUrl = `${baseUrl}/batch/${batchData.batchId}`;

        const qrData = {
            type: 'agritrack-batch',
            version: '1.0',
            batchId: batchData.batchId,
            scanUrl: batchUrl,
            batch: {
                name: batchData.name,
                quantity: batchData.quantity,
                unit: batchData.unit,
                collectionDate: batchData.collectionDate,
                qualityGrade: batchData.qualityGrade,
                qualityScore: batchData.qualityScore
            },
            aggregator: {
                name: batchData.aggregatorName,
                license: batchData.licenseNumber,
                location: batchData.location
            },
            quality: {
                assessment: batchData.qualityAssessment,
                metrics: batchData.qualityMetrics,
                certified: batchData.certified || true
            },
            branding: {
                platform: 'AgriTrack',
                logo: `${baseUrl}/logo.png`,
                verified: true
            }
        };

        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'H',
            margin: 2,
            color: {
                dark: '#059669', // emerald-600
                light: '#ffffff'
            },
            width: 300
        });

        console.log(`🏢 Generated aggregator QR for batch ${batchData.batchId}`);

        return {
            qrCodeDataUrl,
            qrData,
            batchUrl,
            metadata: {
                generatedAt: new Date().toISOString(),
                batchName: batchData.name
            }
        };
    } catch (err) {
        console.error('Aggregator QR Generation Error:', err);
        throw err;
    }
};

module.exports = { 
    generateProduceQR,
    generateTraceabilityQR,
    generateFarmerQR,
    generateAggregatorQR
};
