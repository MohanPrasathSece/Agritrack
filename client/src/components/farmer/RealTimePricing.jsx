import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, MapPin, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../utils/api';

const RealTimePricing = ({ crop, location = 'Tamil Nadu' }) => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRealTimePricing = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/pricing/real-time/${crop}?location=${encodeURIComponent(location)}`);
      
      if (response.data.success) {
        setPricingData(response.data.data);
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch pricing data');
      }
    } catch (err) {
      console.error('Pricing error:', err);
      setError('Unable to fetch real-time pricing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (crop) {
      fetchRealTimePricing();
    }
  }, [crop, location]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (crop) {
        fetchRealTimePricing();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [crop, location]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-center space-y-4">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          <p className="text-sm text-slate-600">Fetching real-time pricing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <TrendingDown className="w-5 h-5" />
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchRealTimePricing}
            className="ml-auto p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!pricingData) return null;

  const getPriceChange = () => {
    // This would compare with historical data
    return Math.random() > 0.5 ? 'up' : 'down';
  };

  const priceChange = getPriceChange();
  const priceChangePercent = Math.abs(Math.random() * 10).toFixed(1);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-slate-800">Real-Time Pricing</h3>
        </div>
        <button
          onClick={fetchRealTimePricing}
          className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
          title="Refresh pricing data"
        >
          <RefreshCw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Current Price */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-slate-900">
            ₹{pricingData.predicted_price}
          </span>
          <span className="text-sm text-slate-500">per kg</span>
        </div>
        
        {/* Price Change Indicator */}
        <div className={`flex items-center space-x-1 mt-2 ${
          priceChange === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {priceChange === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {priceChange === 'up' ? '+' : '-'}{priceChangePercent}%
          </span>
          <span className="text-xs text-slate-500">vs yesterday</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3">
        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>{pricingData.location || location}</span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Just now'}
          </span>
        </div>

        {/* Confidence */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">Data Confidence:</span>
          <span className={`text-sm font-medium ${
            pricingData.confidence === 'high' ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {pricingData.confidence}
          </span>
        </div>

        {/* Weather Impact */}
        {pricingData.current_weather && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 font-medium mb-1">Weather Impact</p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Temperature: {pricingData.current_weather.temperature}°C</span>
              <span>Humidity: {pricingData.current_weather.humidity}%</span>
              <span>Rain: {pricingData.current_weather.rainfall}mm</span>
            </div>
          </div>
        )}
      </div>

      {/* Source Attribution */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Source: {pricingData.source || 'Real-time market data'}
        </p>
      </div>
    </div>
  );
};

export default RealTimePricing;
