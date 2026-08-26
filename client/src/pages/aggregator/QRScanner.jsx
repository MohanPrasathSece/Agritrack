import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Scan, AlertCircle, CheckCircle, MapPin, User, Package } from 'lucide-react';
import axios from 'axios';

const QRScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [manualQR, setManualQR] = useState('');

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsScanning(true);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const processQRCode = async (qrCodeData) => {
    try {
      setLoading(true);
      setError('');

      // Get current location if available
      let location = {};
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: true
            });
          });
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (geoError) {
          console.log('Location access denied or unavailable');
        }
      }

      const response = await axios.post('/api/v1/aggregator/scan-qr', {
        qrCode: qrCodeData,
        scannedLocation: location
      });

      if (response.data.success) {
        setScannedData(response.data.data);
        stopCamera();
      } else {
        setError(response.data.message || 'Invalid QR code');
      }
    } catch (error) {
      console.error('QR processing error:', error);
      setError(error.response?.data?.message || 'Failed to process QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleManualQR = async () => {
    if (!manualQR.trim()) {
      setError('Please enter a QR code or traceability ID');
      return;
    }
    await processQRCode(manualQR.trim());
  };

  const proceedToCollection = () => {
    if (scannedData) {
      navigate('/aggregator/collect-crop', { 
        state: { cropData: scannedData } 
      });
    }
  };

  // Simulate QR code detection (replace with actual QR detection library)
  const simulateQRDetection = () => {
    const mockQRData = JSON.stringify({
      cropId: "507f1f77bcf86cd799439011",
      traceabilityId: "CC-ABC123-XYZ",
      farmer: "Rajesh Kumar",
      cropName: "Basmati Rice",
      variety: "Pusa Basmati 1121",
      harvestDate: "2024-01-15",
      quantity: 500,
      unit: "kg"
    });
    processQRCode(mockQRData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📱 QR Code Scanner
          </h1>
          <p className="text-lg text-gray-600">
            Scan farmer's QR code to collect and verify crop details
          </p>
        </div>

        {!scannedData ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Camera Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                {!isScanning ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Camera className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Ready to Scan
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Position the QR code within the camera frame
                    </p>
                    <button
                      onClick={startCamera}
                      className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full h-80 object-cover rounded-lg"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-64 h-64 border-4 border-green-500 rounded-lg animate-pulse">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Scan className="w-8 h-8 text-green-500 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                      <button
                        onClick={simulateQRDetection}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Simulate Scan
                      </button>
                      <button
                        onClick={stopCamera}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Stop Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Entry Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manual Entry
              </h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Enter QR code or traceability ID"
                  value={manualQR}
                  onChange={(e) => setManualQR(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleManualQR}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Scan'}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-700">Processing QR code...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Scanned Data Display */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-green-50 border-b border-green-200">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-green-900">
                    QR Code Scanned Successfully!
                  </h2>
                  <p className="text-green-700">
                    Crop details retrieved and verified
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Crop Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-6 h-6 mr-2 text-green-600" />
                    Crop Details
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Crop Name</label>
                          <p className="text-lg font-semibold text-gray-900">{scannedData.crop.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Variety</label>
                          <p className="text-lg font-semibold text-gray-900">{scannedData.crop.variety}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Category</label>
                          <p className="text-lg font-semibold text-gray-900">{scannedData.crop.category}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Quality Grade</label>
                          <p className="text-lg font-semibold text-green-600">{scannedData.crop.quality?.grade || 'A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Available Quantity</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {scannedData.crop.quantity} {scannedData.crop.unit}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Price per Unit</label>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{scannedData.crop.pricePerUnit}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Harvest Date</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(scannedData.crop.harvestDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Organic Certified</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {scannedData.crop.isOrganic ? '✅ Yes' : '❌ No'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Traceability ID</label>
                      <p className="text-lg font-mono bg-gray-100 p-2 rounded">
                        {scannedData.crop.traceabilityId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Farmer Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-6 h-6 mr-2 text-blue-600" />
                    Farmer Details
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Name</label>
                          <p className="text-lg font-semibold text-gray-900">{scannedData.farmer.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Phone</label>
                          <p className="text-lg font-semibold text-gray-900">{scannedData.farmer.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Farm Location</label>
                          <div className="flex items-start">
                            <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-1" />
                            <div>
                              <p className="text-gray-900">
                                {scannedData.crop.farmLocation?.village}, {scannedData.crop.farmLocation?.district}
                              </p>
                              <p className="text-gray-600">
                                {scannedData.crop.farmLocation?.state} - {scannedData.crop.farmLocation?.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {scannedData.crop.certifications && scannedData.crop.certifications.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Certifications</label>
                        <div className="mt-2 space-y-2">
                          {scannedData.crop.certifications.map((cert, index) => (
                            <div key={index} className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                              <p className="text-sm font-medium text-green-800">{cert.name}</p>
                              <p className="text-xs text-green-600">Issued by: {cert.issuedBy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setScannedData(null);
                    setError('');
                    setManualQR('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={proceedToCollection}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Proceed to Collection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
