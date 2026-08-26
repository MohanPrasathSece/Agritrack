import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, Package, Users, ArrowUp, ArrowDown, Activity, Calendar, ShieldCheck, Zap, MoreVertical, Search, Filter, Loader2, Sparkles } from "lucide-react";

const AggregatorAnalytics = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { label: "Total Revenue", value: "₹18,450", change: "+12.5%", trend: "up", icon: DollarSign, color: "emerald" },
        { label: "Active Orders", value: "12", change: "+3", trend: "up", icon: Activity, color: "blue" },
        { label: "Partner Network", value: "84 farmers", change: "+5", trend: "up", icon: Users, color: "indigo" },
        { label: "Inventory Volume", value: "2.4 Metric Tons", change: "-2%", trend: "down", icon: Package, color: "amber" }
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aggregating Market Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Enterprise Analytics 📊</h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium tracking-wide">Real-time performance tracking for Coimbatore Node.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-600">Export CSV</button>
                    <button className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Generate Report</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div className={`p-3 md:p-4 bg-${stat.color}-50 rounded-2xl text-${stat.color}-600`}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] md:text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Charts Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12">
                        <div className="space-y-1">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900">Revenue Flow</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 6 Months (₹)</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                                <Sparkles className="w-3 h-3 text-emerald-500" /> AI Forecast Included
                            </div>
                        </div>
                    </div>
                    
                    {/* Simplified Chart bars */}
                    <div className="flex items-end justify-between h-[200px] md:h-[300px] px-2 md:px-8 gap-2 md:gap-4 overflow-x-auto">
                        {[120, 180, 150, 240, 210, 280].map((h, i) => (
                            <div key={i} className="flex-1 min-w-[30px] space-y-4 text-center group">
                                <div className="w-full bg-slate-50 rounded-lg md:rounded-xl p-0.5 h-full flex flex-col justify-end">
                                    <div 
                                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm md:rounded-lg transition-all duration-1000 shadow-lg shadow-emerald-500/10 group-hover:scale-y-105" 
                                        style={{ height: `${h}px` }}
                                    ></div>
                                </div>
                                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">M{i + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-xl font-bold tracking-tight">Market Dominance</h3>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Your node currently handles 42% of the regional organic vegetable logistics.</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: "Vegetables", share: 42, color: "emerald-500" },
                                { title: "Grains", share: 28, color: "blue-500" },
                                { title: "Dairy", share: 15, color: "amber-500" }
                            ].map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest px-1">
                                        <span className="text-slate-400">{cat.title}</span>
                                        <span className="text-white">{cat.share}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-${cat.color} transition-all duration-1000`} 
                                            style={{ width: `${cat.share}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                                "The Coimbatore corridor is showing high potential for organic chilly exports in late 2026."
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">— AI Insight</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AggregatorAnalytics;
