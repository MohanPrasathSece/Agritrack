import React, { useState, useEffect } from "react";
import { Users, Store, DollarSign, Loader2, AlertCircle, ShoppingCart, TrendingUp, Package, Eye, ArrowRight, BarChart3, Truck, CheckCircle, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { aggregatorApi } from "../../utils/api";

export default function AggregatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await aggregatorApi.getDashboard();
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to load dashboard data.");
      }
    } catch (err) {
      console.error("Aggregator dashboard fetch error:", err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-slate-200 shadow-sm max-w-md mx-auto mt-20">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection Error</h3>
        <p className="text-sm text-slate-600 mb-6">{error || "Unable to load dashboard"}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = data.stats || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Aggregator Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage agricultural supply chain efficiently</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/aggregator/collections')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Crops
            </button>
            <button
              onClick={() => navigate('/aggregator/retailer-marketplace')}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Sell to Retailers
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs text-emerald-600 font-medium">+12%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.availableCrops || 0}</p>
            <p className="text-sm text-slate-600">Available Crops</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">+8%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.myListings || 0}</p>
            <p className="text-sm text-slate-600">My Listings</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs text-indigo-600 font-medium">Active</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.activeOrders || 0}</p>
            <p className="text-sm text-slate-600">Active Orders</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-amber-600 font-medium">+15%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">₹{(stats.revenue || 0).toLocaleString()}</p>
            <p className="text-sm text-slate-600">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buy from Farmers */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Buy from Farmers</h3>
              <p className="text-sm text-slate-500">Source fresh produce directly</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Browse available crops from local farmers, check quality details, and make purchases directly.
          </p>
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Quality Verified
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-blue-500" />
              Fast Pickup
            </span>
          </div>
          <button
            onClick={() => navigate('/aggregator/collections')}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Browse Farmer Crops
          </button>
        </div>

        {/* Sell to Retailers */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <Store className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Sell to Retailers</h3>
              <p className="text-sm text-slate-500">Manage retail marketplace</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            List your collected crops for retail buyers, manage pricing, and track orders efficiently.
          </p>
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              Premium Quality
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Market Analytics
            </span>
          </div>
          <button
            onClick={() => navigate('/aggregator/retailer-marketplace')}
            className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Manage Retail Listings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {data.recentActivity && data.recentActivity.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {data.recentActivity.slice(0, 4).map((activity, index) => (
              <div key={activity.id || index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center">
                    {activity.type === 'purchase' ? (
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    ) : activity.type === 'sale' ? (
                      <Store className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Package className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                    <p className="text-xs text-slate-500">{activity.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">{activity.time}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {activity.status === 'completed' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                    {activity.status === 'pending' && <Clock className="w-3 h-3 text-amber-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Overview */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Performance Overview</h3>
          <span className="text-xs text-slate-500">Last 30 days</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-700">{stats.totalTransactions || 0}</p>
            <p className="text-sm text-emerald-600">Total Transactions</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{stats.avgOrderValue || 0}</p>
            <p className="text-sm text-blue-600">Avg Order Value</p>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-700">{stats.satisfactionRate || 98}%</p>
            <p className="text-sm text-indigo-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
