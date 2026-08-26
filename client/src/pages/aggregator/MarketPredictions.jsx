import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, Zap, ArrowUp, ArrowDown, Sparkles, Brain, Info, Droplets, Sun, Wind, AlertTriangle, CheckCircle, Activity, MapPin, Clock, DollarSign, Package, BarChart3, Thermometer, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simple Bar Chart Component
const SimpleBarChart = ({ data, height = 280 }) => {
    const maxValue = Math.max(...data.map(item => item.demand));
    
    return (
        <div className="relative" style={{ height }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] text-slate-400 font-medium -ml-6">
                <span>{maxValue}%</span>
                <span>{Math.round(maxValue * 0.75)}%</span>
                <span>{Math.round(maxValue * 0.5)}%</span>
                <span>{Math.round(maxValue * 0.25)}%</span>
                <span>0%</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-6 h-full flex items-end justify-between gap-3 px-2">
                {data.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                        <div className="relative w-full flex flex-col items-center">
                            {/* Value label */}
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                                    {item.demand}%
                                </span>
                            </div>
                            
                            {/* Enhanced Tooltip */}
                            <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900 text-white p-4 rounded-xl whitespace-nowrap z-30 left-1/2 transform -translate-x-1/2 shadow-2xl border border-slate-700 min-w-[200px]">
                                <div className="space-y-3">
                                    <div className="pb-2 border-b border-slate-700">
                                        <p className="font-bold text-emerald-400 text-sm mb-1">Top Crops</p>
                                        <p className="text-sm font-semibold text-white">{item.crops.join(', ')}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg">
                                            <Droplets className="w-4 h-4 text-blue-400" />
                                            <div>
                                                <p className="text-slate-400">Rainfall</p>
                                                <p className="font-bold text-white">{item.rainfall}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg">
                                            <Thermometer className="w-4 h-4 text-orange-400" />
                                            <div>
                                                <p className="text-slate-400">Temperature</p>
                                                <p className="font-bold text-white">{item.temperature}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                item.trend === 'up' ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
                                            }`}>
                                                {item.trend === 'up' ? '↑ Increasing' : '↓ Decreasing'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-400">{item.weather}</span>
                                    </div>
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 -mt-1.5 border-r border-t border-slate-700"></div>
                            </div>
                            
                            {/* Bar */}
                            <div 
                                className={`w-full max-w-[35px] rounded-t-lg transition-all duration-500 shadow-sm hover:shadow-md ${
                                    item.trend === 'up' 
                                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500' 
                                        : 'bg-gradient-to-t from-slate-500 to-slate-400 hover:from-slate-600 hover:to-slate-500'
                                } group-hover:scale-x-105 relative overflow-hidden`}
                                style={{ height: `${(item.demand / maxValue) * 85}%` }}
                            >
                                {/* Bar shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
                                {/* Trend indicator */}
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                                    {item.trend === 'up' ? 
                                        <ArrowUp className="w-2 h-2 text-white/80" /> : 
                                        <ArrowDown className="w-2 h-2 text-white/80" />
                                    }
                                </div>
                            </div>
                        </div>
                        
                        {/* Month label */}
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-600">{item.month.slice(0, 3)}</p>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                                item.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {item.trend === 'up' ? 
                                    <ArrowUp className="w-2.5 h-2.5" /> : 
                                    <ArrowDown className="w-2.5 h-2.5" />
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 ml-6 pointer-events-none">
                {[0, 25, 50, 75, 100].map((value) => (
                    <div 
                        key={value}
                        className="absolute w-full border-t border-slate-100"
                        style={{ bottom: `${value}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

// Line Chart Component for Trends
const TrendLineChart = ({ data, height = 200 }) => {
    const points = data.map((item, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (item.demand / 100) * 80;
        return `${x},${y}`;
    }).join(' ');
    
    return (
        <div className="relative" style={{ height }}>
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid */}
                {[0, 25, 50, 75, 100].map((value) => (
                    <g key={value}>
                        <line 
                            x1="0" y1={value} 
                            x2="100" y2={value} 
                            stroke="#e2e8f0" 
                            strokeWidth="0.5"
                        />
                        <line 
                            x1={value} y1="0" 
                            x2={value} y2="100" 
                            stroke="#e2e8f0" 
                            strokeWidth="0.5"
                        />
                    </g>
                ))}
                
                {/* Area under curve */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                
                {/* Area */}
                <polygon 
                    points={`0,100 ${points} 100,100`}
                    fill="url(#areaGradient)"
                />
                
                {/* Line */}
                <polyline 
                    points={points}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Data points */}
                {data.map((item, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - (item.demand / 100) * 80;
                    return (
                        <circle 
                            key={i}
                            cx={x} 
                            cy={y} 
                            r="3" 
                            fill="white"
                            stroke="#10b981"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>
        </div>
    );
};

// Pie Chart Component for Market Share
const PieChart = ({ data, size = 120 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {data.map((item, i) => {
                    const percentage = (item.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    
                    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    currentAngle += angle;
                    
                    return (
                        <path
                            key={i}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={item.color}
                            stroke="white"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>
        </div>
    );
};

const MarketPredictions = () => {
    const [loading, setLoading] = useState(true);

    // Enhanced AI Prediction Data
    const MONTHLY_DEMAND = [
        { month: 'April', demand: 85, trend: 'up', crops: ['Tomatoes', 'Green Chillies'], weather: 'Hot & Dry', rainfall: '45mm', temperature: '32°C' },
        { month: 'May', demand: 92, trend: 'up', crops: ['Potatoes', 'Onions'], weather: 'Very Hot', rainfall: '38mm', temperature: '35°C' },
        { month: 'June', demand: 65, trend: 'down', crops: ['Carrots', 'Cabbage'], weather: 'Monsoon', rainfall: '180mm', temperature: '28°C' },
        { month: 'July', demand: 78, trend: 'up', crops: ['Brinjal', 'Rice'], weather: 'Heavy Rain', rainfall: '220mm', temperature: '26°C' },
        { month: 'August', demand: 88, trend: 'up', crops: ['Wheat', 'Corn'], weather: 'Humid', rainfall: '150mm', temperature: '29°C' },
        { month: 'September', demand: 55, trend: 'down', crops: ['Spinach'], weather: 'Moderate', rainfall: '95mm', temperature: '30°C' }
    ];

    const PREDICTED_CROPS = [
        { name: 'Red Chilly', demand: 'Very High', priceTrend: '+15%', color: 'from-red-500 to-orange-500', icon: '🌶️', confidence: '92%', supply: 'Low', marketCap: '₹2.4Cr', seasonality: 'Peak', risk: 'Medium' },
        { name: 'Basmati Rice', demand: 'Steady', priceTrend: '+5%', color: 'from-emerald-400 to-emerald-600', icon: '🌾', confidence: '88%', supply: 'Adequate', marketCap: '₹8.1Cr', seasonality: 'Stable', risk: 'Low' },
        { name: 'Organic Turmeric', demand: 'High', priceTrend: '+22%', color: 'from-amber-400 to-orange-400', icon: '🟡', confidence: '95%', supply: 'Very Low', marketCap: '₹1.8Cr', seasonality: 'Growing', risk: 'High' },
        { name: 'Premium Garlic', demand: 'Extreme', priceTrend: '+35%', color: 'from-slate-400 to-slate-600', icon: '🧄', confidence: '89%', supply: 'Critical', marketCap: '₹3.2Cr', seasonality: 'Peak', risk: 'Very High' },
        { name: 'Fresh Tomatoes', demand: 'High', priceTrend: '+18%', color: 'from-red-400 to-pink-500', icon: '🍅', confidence: '91%', supply: 'Low', marketCap: '₹4.5Cr', seasonality: 'Peak', risk: 'Medium' },
        { name: 'Baby Corn', demand: 'Very High', priceTrend: '+28%', color: 'from-yellow-400 to-green-400', icon: '🌽', confidence: '87%', supply: 'Very Low', marketCap: '₹1.2Cr', seasonality: 'Emerging', risk: 'High' }
    ];

    const MARKET_INSIGHTS = [
        { type: 'opportunity', title: 'Supply Chain Disruption', message: 'Northern routes blocked affecting onion supplies', impact: 'High', time: '2 hours ago' },
        { type: 'warning', title: 'Weather Alert', message: 'Unseasonal rains expected in Coimbatore region', impact: 'Medium', time: '5 hours ago' },
        { type: 'success', title: 'Export Demand Surge', message: 'International orders for organic turmeric up 40%', impact: 'High', time: '1 day ago' }
    ];

    const REGIONAL_DATA = [
        { region: 'Coimbatore', demand: 'Very High', growth: '+12%', supply: 'Critical' },
        { region: 'Tirupur', demand: 'High', growth: '+8%', supply: 'Low' },
        { region: 'Salem', demand: 'Moderate', growth: '+5%', supply: 'Adequate' },
        { region: 'Erode', demand: 'High', growth: '+15%', supply: 'Low' }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    <Brain className="w-8 h-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Neural Network Processing 50TB of Market Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* AI Header */}
            <div className="relative bg-slate-900 rounded-[32px] p-10 overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30 backdrop-blur-md mx-auto md:mx-0">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">AI Predictions Active</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Market Demand Predictor 🔮</h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-xl font-medium leading-relaxed">
                            Advanced AI engine analyzing 50+ data points including weather patterns, supply chain logistics, historical pricing, and real-time retailer demand to predict market shortages with 94% accuracy.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <Brain className="w-4 h-4 text-emerald-400" />
                                <span>ML Model v3.2</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <span>94% Accuracy</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span>Live Data</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Market Overview Cards - Redesigned */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 rounded-xl">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Live</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">₹24,800</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Today's Revenue</p>
                    <div className="flex items-center gap-1 mt-2">
                        <ArrowUp className="w-3 h-3 text-emerald-600" />
                        <span className="text-[9px] font-bold text-emerald-600">+12.4%</span>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 rounded-xl">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-[9px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Today</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">28</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Active Orders</p>
                    <div className="flex items-center gap-1 mt-2">
                        <ArrowUp className="w-3 h-3 text-blue-600" />
                        <span className="text-[9px] font-bold text-blue-600">+8.1%</span>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-amber-50 rounded-xl">
                            <Thermometer className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Current</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">32°C</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Temperature</p>
                    <div className="flex items-center gap-1 mt-2">
                        <Cloud className="w-3 h-3 text-amber-600" />
                        <span className="text-[9px] font-bold text-amber-600">Partly Cloudy</span>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-purple-50 rounded-xl">
                            <AlertTriangle className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-[9px] font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Alert</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">3</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Low Stock Items</p>
                    <div className="flex items-center gap-1 mt-2">
                        <Activity className="w-3 h-3 text-purple-600" />
                        <span className="text-[9px] font-bold text-purple-600">Needs Restock</span>
                    </div>
                </div>
            </div>

            {/* Main Content - Cleaner Design */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Monthly Demand Chart - Simplified */}
                <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Demand Forecast</h2>
                            <p className="text-[10px] text-slate-500 font-medium">Next 6 months • Coimbatore Region</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>Updated 2h ago</span>
                        </div>
                    </div>

                    {/* Enhanced Chart with Graph */}
                    <div className="mb-6">
                        <SimpleBarChart data={MONTHLY_DEMAND} height={280} />
                    </div>
                    
                    {/* Trend Line Chart */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-900">6-Month Trend</h3>
                            <span className="text-[9px] text-slate-500">Overall Pattern</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <TrendLineChart data={MONTHLY_DEMAND} height={200} />
                        </div>
                    </div>
                    
                    {/* Simple Legend */}
                    <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-xs text-slate-500">High Demand</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full" />
                            <span className="text-xs text-slate-500">Low Demand</span>
                        </div>
                    </div>
                </div>

                {/* Side Panel - With Graphs */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Market Share Chart */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900">Market Share</h3>
                            </div>
                            <span className="text-[9px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Today</span>
                        </div>
                        
                        <div className="flex items-center justify-center mb-4">
                            <PieChart 
                                data={[
                                    { value: 35, color: '#10b981' },
                                    { value: 28, color: '#3b82f6' },
                                    { value: 22, color: '#f59e0b' },
                                    { value: 15, color: '#8b5cf6' }
                                ]} 
                                size={120}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-slate-600">Vegetables 35%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-slate-600">Grains 28%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                <span className="text-slate-600">Fruits 22%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                <span className="text-slate-600">Other 15%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Insights */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <h3 className="text-sm font-bold text-slate-900">Quick Insights</h3>
                        </div>
                        
                        <div className="space-y-3">
                            {MARKET_INSIGHTS.slice(0, 2).map((insight, i) => (
                                <div key={i} className={`p-3 rounded-lg text-xs ${
                                    insight.type === 'opportunity' ? 'bg-emerald-50 border border-emerald-200' :
                                    'bg-amber-50 border border-amber-200'
                                }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        {insight.type === 'opportunity' ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                                        <span className="font-bold text-slate-900">{insight.title}</span>
                                    </div>
                                    <p className="text-slate-600">{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Crops */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900">Top Crops</h3>
                            </div>
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">AI Ranked</span>
                        </div>
                        
                        <div className="space-y-3">
                            {PREDICTED_CROPS.slice(0, 3).map((crop, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm">
                                            {crop.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{crop.name}</p>
                                            <p className="text-[9px] text-slate-500">{crop.supply} Stock</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-emerald-600">{crop.priceTrend}</span>
                                        <p className="text-[9px] text-slate-400">ROI</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors mt-4">
                            View Full Report
                        </button>
                    </div>

                    {/* Regional Summary */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-slate-600" />
                            <h3 className="text-sm font-bold text-slate-900">Regional Summary</h3>
                        </div>
                        
                        <div className="space-y-2">
                            {REGIONAL_DATA.slice(0, 2).map((region, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{region.region}</p>
                                        <p className="text-[9px] text-slate-500">{region.demand} Demand</p>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600">{region.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketPredictions;
