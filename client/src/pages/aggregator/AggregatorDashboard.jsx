import React, { useState, useEffect } from "react";
import { 
  Package, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Store, 
  ArrowUp, 
  ArrowDown, 
  Star,
  MapPin,
  Phone,
  BarChart3,
  Zap,
  Eye,
  MoreVertical,
  Search,
  AlertTriangle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { aggregatorApi } from "../../utils/api";
import { t } from "../../utils/translation";
import { formatLocation } from "../../utils/format";
import ContactSupport from "../../components/ContactSupport";
import GoogleTranslate from "../../components/GoogleTranslate";
// Import the same crop images as farmer
import brinjalImg from "../../components/farmer/crops/brinjal.jpg";
import carrotImg from "../../components/farmer/crops/carrot.jpg";
import greenChillyImg from "../../components/farmer/crops/green chilly.jpg";
import potatoImg from "../../components/farmer/crops/potato.jpg";
import redChillyImg from "../../components/farmer/crops/red chilly.jpg";
import riceImg from "../../components/farmer/crops/rice.jpg";
import wheatImg from "../../components/farmer/crops/wheat.jpg";

export default function AggregatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Same crop data as farmer - available for aggregator to buy
  const FARMER_CROPS = [
    { 
      id: '1', 
      name: 'Premium Basmati Rice', 
      price_per_unit: 85, 
      quantity: 1500, 
      unit: 'KG', 
      status: 'Listed', 
      image: { url: riceImg },
      farmer: 'Ramesh Kumar',
      location: 'Punjab',
      rating: 4.8,
      quality: 'A+',
      orders: 12,
      category: 'Grains',
      organic: true,
      certified: true,
      trending: false
    },
    { 
      id: '2', 
      name: 'Organic Wheat', 
      price_per_unit: 42, 
      quantity: 2000, 
      unit: 'KG', 
      status: 'Listed', 
      image: { url: wheatImg },
      farmer: 'Sunita Devi',
      location: 'Haryana',
      rating: 4.6,
      quality: 'A',
      orders: 8,
      category: 'Grains',
      organic: true,
      certified: false,
      trending: false
    },
    { 
      id: '3', 
      name: 'Fresh Brinjal', 
      price_per_unit: 25, 
      quantity: 400, 
      unit: 'KG', 
      status: 'Listed', 
      image: { url: brinjalImg },
      farmer: 'Mohan Singh',
      location: 'Uttar Pradesh',
      rating: 4.5,
      quality: 'A',
      orders: 15,
      category: 'Vegetables',
      organic: false,
      certified: false,
      trending: true
    },
    { 
      id: '4', 
      name: 'Sweet Carrots', 
      price_per_unit: 35, 
      quantity: 800, 
      unit: 'KG', 
      status: 'Listed', 
      image: { url: carrotImg },
      farmer: 'Priya Sharma',
      location: 'Rajasthan',
      rating: 4.7,
      quality: 'A+',
      orders: 20,
      category: 'Vegetables',
      organic: true,
      certified: true,
      trending: false
    },
    { 
      id: '5', 
      name: 'Green Chilly', 
      price_per_unit: 120, 
      quantity: 300, 
      unit: 'KG', 
      status: 'Listed', 
      image: { url: greenChillyImg },
      farmer: 'Amit Patel',
      location: 'Gujarat',
      rating: 4.9,
      quality: 'A+',
      orders: 25,
      category: 'Vegetables',
      organic: false,
      certified: true,
      trending: true
    },
    { 
      id: '6', 
      name: 'Quality Potatoes', 
      price_per_unit: 20, 
      quantity: 2500, 
      unit: 'KG', 
      status: 'Listed', 
      image: { url: potatoImg },
      farmer: 'Lakshmi Narayan',
      location: 'West Bengal',
      rating: 4.4,
      quality: 'B+',
      orders: 18,
      category: 'Vegetables',
      organic: false,
      certified: false,
      trending: false
    },
    { 
      id: '7', 
      name: 'Red Chilly (Guntur)', 
      price_per_unit: 140, 
      quantity: 500, 
      unit: 'KG', 
      status: 'Sold', 
      image: { url: redChillyImg },
      farmer: 'Vijay Kumar',
      location: 'Andhra Pradesh',
      rating: 4.8,
      quality: 'A+',
      orders: 30,
      category: 'Vegetables',
      organic: true,
      certified: true,
      trending: true
    }
  ];

  const filteredCrops = FARMER_CROPS.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const statsCards = [
    {
      title: "Total Revenue",
      value: "₹18,450",
      change: "+12.2%",
      trend: "up",
      icon: DollarSign,
      color: "emerald",
      bgGradient: "from-emerald-400 to-emerald-600"
    },
    {
      title: "Active Orders",
      value: "12",
      change: "+4.3%",
      trend: "up",
      icon: ShoppingCart,
      color: "emerald",
      bgGradient: "from-emerald-400 to-emerald-600"
    },
    {
      title: "Handled Crops",
      value: "45",
      change: "+5.7%",
      trend: "up",
      icon: Package,
      color: "emerald",
      bgGradient: "from-emerald-400 to-emerald-600"
    },
    {
      title: "Farmers Connected",
      value: "8",
      change: "+2.9%",
      trend: "up",
      icon: Users,
      color: "emerald",
      bgGradient: "from-emerald-400 to-emerald-600"
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('error')}</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Agritrack</h1>
                  <p className="text-xs text-slate-500">Aggregator Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowContactSupport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all hover:shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Support
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.name || 'Mohan Prasath'}</p>
                  <p className="text-xs text-slate-500">Coimbatore Node • Premium</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${stat.bgGradient}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Enterprise Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => navigate('/aggregator/collections')}
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all group"
            >
              <Package className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700">Browse Crops</span>
            </button>
            <button
              onClick={() => navigate('/aggregator/retailer-marketplace')}
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all group"
            >
              <Store className="w-8 h-8 text-slate-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700">My Listings</span>
            </button>
            <button
              onClick={() => navigate('/aggregator/analytics')}
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all group"
            >
              <BarChart3 className="w-8 h-8 text-slate-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700">Analytics</span>
            </button>
            <button
              onClick={() => navigate('/aggregator/predictions')}
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all group shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-white uppercase tracking-widest">Predictions</span>
            </button>
            <button
              onClick={() => setShowContactSupport(true)}
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all group"
            >
              <Phone className="w-8 h-8 text-slate-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700">Support</span>
            </button>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Featured Products</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="Grains">Grains</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={crop.image.url}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    {crop.organic && (
                      <span className="px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded-lg">
                        Organic
                      </span>
                    )}
                    {crop.certified && (
                      <span className="px-2 py-1 bg-slate-600 text-white text-xs font-medium rounded-lg">
                        Certified
                      </span>
                    )}
                    {crop.trending && (
                      <span className="px-2 py-1 bg-slate-600 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{crop.name}</h3>
                      <p className="text-sm text-slate-500">{crop.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">₹{crop.price_per_unit}</p>
                      <p className="text-xs text-slate-500">per {crop.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{formatLocation(crop.location)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-slate-400 fill-current" />
                      <span>{crop.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>{crop.quantity} {crop.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{crop.farmer[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{crop.farmer}</p>
                        <p className="text-xs text-slate-500">Farmer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">Grade {crop.quality}</p>
                      <p className="text-xs text-slate-500">{crop.orders} orders</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/aggregator/collections')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Contact Support Modal */}
      <ContactSupport 
        isOpen={showContactSupport} 
        onClose={() => setShowContactSupport(false)} 
      />
    </div>
  );
}
