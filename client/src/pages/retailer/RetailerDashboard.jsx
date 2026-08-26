import React, { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle, DollarSign, TrendingUp, Package, Loader2, ArrowRight, Zap, Activity, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../../contexts/AuthContext";
import { retailerApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function RetailerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setTimeout(() => {
            setData({
                stats: {
                    activeOrders: 8,
                    completedOrders: 32,
                    totalSpent: 9400,
                },
                chartData: [
                    { month: 'Jan', amount: 1200 },
                    { month: 'Feb', amount: 1800 },
                    { month: 'Mar', amount: 2500 },
                    { month: 'Apr', amount: 1900 },
                    { month: 'May', amount: 1100 },
                    { month: 'Jun', amount: 900 },
                ],
                orderStatusOverview: [
                    { label: 'Pending', count: 3 },
                    { label: 'In Transit', count: 5 },
                    { label: 'Delivered', count: 32 }
                ],
                recentActivity: [
                    { type: 'order', action: 'Order #ORD-7729-TOM Received', time: '2 hours ago' },
                    { type: 'payment', action: 'Payment of ₹850 processed', time: '5 hours ago' },
                    { type: 'order', action: 'New Order placed for Organic Tomatoes', time: '1 day ago' }
                ]
            });
            setLoading(false);
        }, 500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <p className="text-sm text-slate-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto mt-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Connection Failed</h2>
                <p className="text-sm text-slate-500 mb-8">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Retailer Dashboard</h1>
                    <p className="text-sm text-slate-500">Welcome back, {user?.name || "User"}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/retailer/marketplace')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" /> Marketplace
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Active Orders", val: data?.stats?.activeOrders || 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "Completed Orders", val: data?.stats?.completedOrders || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { title: "Total Procurement", val: `₹${(data?.stats?.totalSpent || 0).toLocaleString()}`, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { title: "Order Velocity", val: "High", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" }
                ].map((card, i) => (
                    <div key={i} className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 ${card.bg} rounded-md ${card.color}`}>
                                <card.icon className="w-4 h-4" />
                            </div>
                            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</h3>
                        </div>
                        <p className="text-xl font-bold text-slate-900">{card.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Charts */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-800 mb-6">Procurement Volume</h2>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.chartData || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                                    <Bar dataKey="amount" fill="#10b981" radius={[2, 2, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-800 mb-6">Order Status Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {data?.orderStatusOverview?.map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <span className="text-base font-bold text-slate-900">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.label.toLowerCase().includes('pending') ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${Math.min(100, (item.count / 10) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-semibold text-slate-800">Recent Activity</h2>
                            <Activity className="w-4 h-4 text-slate-400" />
                        </div>

                        <div className="space-y-4">
                            {(data?.recentActivity || []).length > 0 ? (
                                data.recentActivity.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                                            <Zap className={`h-3.5 w-3.5 ${item.type === 'order' ? 'text-emerald-500' : 'text-blue-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-800 font-medium truncate">{item.action}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic text-center py-10">No recent activity.</p>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/retailer/orders')}
                            className="w-full mt-6 py-2.5 bg-slate-50 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center gap-2"
                        >
                            View All Orders <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
