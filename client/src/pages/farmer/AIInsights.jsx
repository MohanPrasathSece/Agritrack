import React, { useState, useEffect, useRef } from "react";
import {
    TrendingUp,
    Sprout,
    Droplets,
    Sun,
    Wind,
    ShieldCheck,
    ArrowRight,
    Loader2,
    AlertTriangle,
    Zap,
    Sparkles,
    LayoutDashboard,
    Search
} from "lucide-react";
import { mlApi } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function Insights() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [advisory, setAdvisory] = useState(null);
    const [marketTrend, setMarketTrend] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState("Rice");

    useEffect(() => {
        const fetchInitialInsights = async () => {
            try {
                setLoading(true);
                // 1. Fetch Crop Advisory
                const res = await mlApi.getAdvisory({
                    location: user?.address?.district || "Local Region",
                    soilInfo: { moisture: "40%" },
                    season: "Current Season"
                });
                if (res.data.success) {
                    setAdvisory(res.data.advisory);
                }

                // 2. Fetch Market Forecast
                await refreshMarketStats(selectedCrop);
            } catch (err) {
                console.error("Insights fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialInsights();
    }, [user, selectedCrop]);

    const refreshMarketStats = async (crop) => {
        try {
            setPredicting(true);
            setSelectedCrop(crop);

            // Fetch pricing and demand data
            const [pricingRes, signalsRes] = await Promise.all([
                mlApi.predictPrice({ cropName: crop, location: "Local", quality: "A" }),
                mlApi.getTrainedSignals({ cropName: crop, month: new Date().getMonth() + 1, temp: 28, moisture: 14 })
            ]);

            if (pricingRes.data.success) {
                setMarketTrend({
                    ...pricingRes.data.prediction,
                    demandScore: signalsRes.data.success ? signalsRes.data.demandScore : 75,
                    shelfLife: signalsRes.data.success ? signalsRes.data.estimatedLife : 14,
                    cropName: crop
                });
            }
        } catch (err) {
            console.error("Stats refresh error:", err);
        } finally {
            setPredicting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Preparing Insights...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Main Banner */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-xl shadow-slate-900/10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> Regional Market Advisor
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                            Smart Farming & <span className="text-emerald-500">Price Forecasts</span>
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Real-time data for better harvest planning, pricing strategy, and seasonal crop recommendations.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center min-w-[120px]">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-bold">Reliability</p>
                            <p className="text-2xl font-bold text-white">High</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center min-w-[120px]">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-bold">Coverage</p>
                            <p className="text-2xl font-bold text-white">Local</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Market Forecast */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Market Outlook</h2>
                            </div>
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
                                {["Rice", "Wheat", "Turmeric"].map(crop => (
                                    <button
                                        key={crop}
                                        onClick={() => refreshMarketStats(crop)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCrop === crop ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-500'
                                            }`}
                                    >
                                        {crop}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {predicting ? (
                            <div className="h-64 flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Updating Market Data...</p>
                            </div>
                        ) : marketTrend && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Rate</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tighter">₹{marketTrend.predictedPrice}<span className="text-xs text-slate-400 ml-1 font-medium">/kg</span></p>
                                        <div className="mt-3 flex items-center gap-1.5 text-emerald-600 font-bold uppercase text-[9px] tracking-widest">
                                            <TrendingUp className="w-3 h-3" /> {marketTrend.marketTrend} Trend
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer Demand</p>
                                        <p className="text-2xl font-bold text-slate-900">{marketTrend.demandScore}%</p>
                                        <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${marketTrend.demandScore}%` }} />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Freshness</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tighter">{marketTrend.shelfLife} Days</p>
                                        <div className="mt-3 flex items-center gap-1.5 text-slate-500 uppercase text-[9px] font-bold tracking-widest">
                                            <ShieldCheck className="w-3 h-3" /> Good Stability
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Key Observations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {marketTrend.insights.map((insight, i) => (
                                            <div key={i} className="flex gap-3 p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl">
                                                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                                                    <Zap className="w-3.5 h-3.5" />
                                                </div>
                                                <p className="text-xs text-slate-600 leading-relaxed font-semibold">{insight}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Advisor Section */}
                    <div className="bg-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform duration-1000 group-hover:scale-110">
                            <Sprout className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold tracking-tight">Crop Advisory Dashboard</h2>
                                <p className="text-emerald-100/70 text-[11px] font-medium uppercase tracking-wider">Localized suggestions for your farm</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {advisory?.recommendedCrops.map((crop, i) => (
                                    <div key={i} className="bg-white/10 border border-white/20 p-5 rounded-2xl hover:bg-white/15 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-base font-bold text-emerald-300">{crop.name}</h4>
                                            <span className="px-2 py-0.5 bg-emerald-500/30 rounded text-[8px] font-bold uppercase tracking-widest text-white border border-white/10">Recommended</span>
                                        </div>
                                        <p className="text-[11px] text-emerald-50/80 mb-4 font-medium leading-relaxed">{crop.reason}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                            <span className="text-[9px] text-emerald-300/50 font-bold uppercase tracking-widest">Expected Harvest</span>
                                            <span className="text-xs font-bold text-white tracking-tight">{crop.expectedYield}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Regional Vectors Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Farm Diagnostics</h3>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Regional Indicators</h4>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: "Moisture Levels", val: 82, color: "bg-blue-500", icon: Droplets },
                                { label: "Plant Health", val: 65, color: "bg-emerald-500", icon: Sprout },
                                { label: "Weather Risk", val: 12, color: "bg-amber-500", icon: Wind },
                                { label: "Soil Nutrition", val: 91, color: "bg-indigo-500", icon: Sun },
                            ].map((v, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <v.icon className="w-3.5 h-3.5" />
                                            <span>{v.label}</span>
                                        </div>
                                        <span className="text-slate-900">{v.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                        <div className={`h-full ${v.color} rounded-full`} style={{ width: `${v.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-[10px] text-amber-900 leading-normal font-bold uppercase tracking-tight">
                                Low moisture detected in neighboring districts. Consider optimizing water usage.
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-3xl p-7 text-white space-y-4 shadow-xl shadow-indigo-600/10 border border-indigo-500">
                        <h3 className="text-base font-bold tracking-tight">Optimization Tips</h3>
                        <p className="text-[11px] text-indigo-50/70 leading-relaxed font-medium">Use high-quality seeds for 15% better productivity. Check market rates daily for best price released in your area.</p>
                        <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-md mt-2">
                            View More Tips <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
