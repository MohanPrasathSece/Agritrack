import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  User, 
  Calendar, 
  Award, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Leaf,
  Droplets,
  Sun,
  Truck,
  Clock,
  Shield,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatLocation } from '../utils/format';

const TracePage = () => {
  const { traceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchTraceData();
  }, [traceId]);

  const fetchTraceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get trace data from API
      const response = await fetch(`/api/v1/aggregator/trace/${traceId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductData(data.data);
        } else {
          setError(data.message || 'Product not found');
        }
      } else {
        // If API fails, try to parse QR data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const qrData = urlParams.get('data');
        
        if (qrData) {
          try {
            const parsedData = JSON.parse(decodeURIComponent(qrData));
            setProductData(parsedData);
          } catch (parseError) {
            setError('Invalid QR code data');
          }
        } else {
          setError('Product not found in traceability system');
        }
      }
    } catch (err) {
      console.error('Trace data fetch error:', err);
      setError('Failed to load traceability information');
    } finally {
      setLoading(false);
    }
  };

  const handleScanAnother = () => {
    setScanning(true);
    // Request camera access and scan QR code
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          // Initialize QR scanner (you'd need a QR scanning library)
          setScanning(true);
        })
        .catch(err => {
          console.error('Camera access denied:', err);
          setScanning(false);
        });
    }
  };

  const getQualityColor = (grade) => {
    const colors = {
      'Premium': 'text-green-600 bg-green-50 border-green-200',
      'A': 'text-emerald-600 bg-emerald-50 border-emerald-200',
      'B': 'text-blue-600 bg-blue-50 border-blue-200',
      'C': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'Rejected': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[grade] || colors['A'];
  };

  const getQualityIcon = (grade) => {
    if (grade === 'Premium' || grade === 'A') return <Award className="w-5 h-5" />;
    if (grade === 'B') return <CheckCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading traceability information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => fetchTraceData()}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgriTrack</h1>
                <p className="text-xs text-gray-500">Traceability System</p>
              </div>
            </div>
            <button
              onClick={handleScanAnother}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Scan Another</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Product Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {productData?.product?.name || 'Agricultural Product'}
                  </h2>
                  <p className="text-emerald-100">
                    {productData?.product?.variety && `Variety: ${productData.product.variety}`}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full border-2 ${getQualityColor(productData?.quality?.grade || 'A')}`}>
                  <div className="flex items-center space-x-2">
                    {getQualityIcon(productData?.quality?.grade || 'A')}
                    <span className="font-bold">
                      {productData?.quality?.grade || 'A'} Grade
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {productData?.quality?.score || 85}/100
                  </p>
                  <p className="text-sm text-gray-500">Quality Score</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {productData?.product?.quantity || 0} {productData?.product?.unit || 'kg'}
                  </p>
                  <p className="text-sm text-gray-500">Quantity</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(productData?.product?.harvestDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Harvest Date</p>
                </div>
              </div>
            </div>
          </div>

          {/* Farmer Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-900">Farmer Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Farmer Name</p>
                <p className="font-semibold text-gray-900">
                  {productData?.farmer?.name || 'Verified Farmer'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Farm Location</p>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="font-semibold text-gray-900">
                    {productData?.farmer?.location || 'Regional Farm'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Certification</p>
                <div className="flex items-center space-x-2">
                  {productData?.farmer?.certified ? (
                    <>
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">Certified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-yellow-600">Not Certified</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-green-600">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          {productData?.quality?.metrics && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Quality Metrics</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(productData.quality.metrics).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      {key.includes('moisture') && <Droplets className="w-6 h-6 text-emerald-600" />}
                      {key.includes('freshness') && <Sun className="w-6 h-6 text-emerald-600" />}
                      {key.includes('purity') && <Shield className="w-6 h-6 text-emerald-600" />}
                      {!key.includes('moisture') && !key.includes('freshness') && !key.includes('purity') && 
                        <Award className="w-6 h-6 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supply Chain Journey */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Truck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-900">Supply Chain Journey</h3>
            </div>
            
            <div className="space-y-4">
              {productData?.history?.map((stage, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(stage.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{stage.description}</p>
                    <p className="text-sm text-gray-500">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {formatLocation(stage.location)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">
                Verified by AgriTrack Platform
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This product is tracked from farm to table with complete transparency
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TracePage;
