import React, { useState, useEffect } from "react";
import { Users, Store, DollarSign, Loader2, AlertCircle, ShoppingCart, TrendingUp, Package, Eye, ArrowRight } from "lucide-react";
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
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg p-6 text-center border border-slate-200 shadow-sm max-w-md mx-auto mt-20">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection Error</h3>
        <p className="text-sm text-slate-600 mb-4">{error || "Unable to load dashboard"}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Aggregator Dashboard</h1>
          <p className="text-sm text-slate-500">Buy from farmers, sell to retailers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/aggregator/collections')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy from Farmers
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Available Crops",
            val: stats.availableCrops || 0,
            icon: ShoppingCart,
            color: "bg-emerald-50 text-emerald-600 border-emerald-200",
            desc: "Available to buy from farmers"
          },
          {
            title: "My Listings",
            val: stats.myListings || 0,
            icon: Store,
            color: "bg-slate-50 text-slate-600 border-slate-200",
            desc: "Listed for retailers"
          },
          {
            title: "Active Orders",
            val: stats.activeOrders || 0,
            icon: Users,
            color: "bg-blue-50 text-blue-600 border-blue-200",
            desc: "Current transactions"
          },
          {
            title: "Total Revenue",
            val: `₹${(stats.revenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: "bg-indigo-50 text-indigo-600 border-indigo-200",
            desc: "Total earnings"
          }
        ].map((card, i) => (
          <div key={i} className={`bg-white rounded-lg p-4 border ${card.color} shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color.split(' ')[0]}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-slate-900">{card.val}</p>
              <p className="text-sm font-medium text-slate-700">{card.title}</p>
              <p className="text-xs text-slate-500">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buy from Farmers */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Buy from Farmers</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Browse and purchase crops directly from local farmers. View available listings, quality details, and pricing.
          </p>
          <button
            onClick={() => navigate('/aggregator/collections')}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Browse Farmer Crops
          </button>
        </div>

        {/* Sell to Retailers */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Store className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Sell to Retailers</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            List your purchased crops for sale to retailers. Manage pricing, inventory, and orders from retail buyers.
          </p>
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
            {data.recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                <p className="text-sm text-slate-700">{activity.text}</p>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
