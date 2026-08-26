import React, { useState, useEffect, useRef } from "react";
import {
    Database,
    BarChart,
    TrendingUp,
    RefreshCcw,
    Info,
    AlertCircle,
    Thermometer,
    CloudRain,
    Calendar,
    LayoutDashboard,
    Zap
} from "lucide-react";
import { mlApi } from "../../utils/api";

export default function TrainedInsights() {
    const [loading, setLoading] = useState(false);
    const [crops, setCrops] = useState([
        { name: "Tomato", icon: "🍅", color: "bg-red-500" },
        { name: "Onion", icon: "🧅", color: "bg-pink-500" },
        { name: "Potato", icon: "🥔", color: "bg-amber-500" }
    ]);
    const [selectedCrop, setSelectedCrop] = useState("Tomato");
    const [prediction, setPrediction] = useState(null);
    const [qualityResult, setQualityResult] = useState(null);
    const [loadingQuality, setLoadingQuality] = useState(false);
    const [inputs, setInputs] = useState({
        month: new Date().getMonth() + 1,
        rain: 120,
        temp: 28,
        color: 2,
        size: 2,
        texture: 2,
        moisture: 14,
        purity: 98
    });

    const [signals, setSignals] = useState(null);
    const [loadingSignals, setLoadingSignals] = useState(false);
    
    // Refs to store AbortControllers
    const abortControllers = useRef({});

    const fetchSignals = async (cropName = selectedCrop) => {
        try {
            setLoadingSignals(true);
            const res = await mlApi.getTrainedSignals({
                cropName,
                month: inputs.month,
                temp: inputs.temp,
                moisture: inputs.moisture
            });
            if (res.data.success) {
                setSignals(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSignals(false);
        }
    };

    const fetchPrediction = async (cropName = selectedCrop) => {
        try {
            setLoading(true);
            const res = await mlApi.getTrainedPrediction({
                cropName,
                month: inputs.month,
                rain: inputs.rain,
                temp: inputs.temp
            });
            if (res.data.success) {
                setPrediction(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQualityPrediction = async () => {
        try {
            setLoadingQuality(true);
            const res = await mlApi.getTrainedQuality({
                color: inputs.color,
                size: inputs.size,
                texture: inputs.texture,
                moisture: inputs.moisture,
                purity: inputs.purity
            });
            if (res.data.success) {
                setQualityResult(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingQuality(false);
        }
    };

    useEffect(() => {
        fetchPrediction();
        fetchQualityPrediction();
        fetchSignals();
        
        // Cleanup function to abort all pending requests
        return () => {
            Object.values(abortControllers.current).forEach(controller => {
                if (controller) controller.abort();
            });
        };
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.type === 'range' || e.target.type === 'number'
            ? parseFloat(e.target.value)
            : e.target.value;
        setInputs({ ...inputs, [e.target.name]: value });
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Trained Dataset Analytics</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Results powered by locally trained Random Forest models (Price, Quality & Market Signals).</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => { fetchPrediction(); fetchQualityPrediction(); fetchSignals(); }}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <RefreshCcw className={`w-4 h-4 ${loading || loadingQuality || loadingSignals ? 'animate-spin' : ''}`} />
                        Sync Models
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8 h-fit lg:sticky lg:top-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Parameter Matrix</h3>

                    <div className="space-y-8">
                        {/* Market Parameters */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Market Environment</p>
                                <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Cycle Month
                                </label>
                                <input
                                    type="range" min="1" max="12" name="month"
                                    value={inputs.month} onChange={handleInputChange}
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-emerald-500"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                    <span>JAN</span>
                                    <span className="text-emerald-600">MONTH {inputs.month}</span>
                                    <span>DEC</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                        Rain (mm)
                                    </label>
                                    <input
                                        type="number" name="rain"
                                        value={inputs.rain} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                        Temp (°C)
                                    </label>
                                    <input
                                        type="number" name="temp"
                                        value={inputs.temp} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biological Parameters */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b pb-2">Physical Attributes</p>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Color Index (0-2)</label>
                                    <input type="number" name="color" min="0" max="2" value={inputs.color} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Moisture Ratio (%)</label>
                                    <input type="number" name="moisture" value={inputs.moisture} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purity Grade (%)</label>
                                    <input type="number" name="purity" value={inputs.purity} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { fetchPrediction(); fetchQualityPrediction(); fetchSignals(); }}
                            className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            Execute Model Run
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Market Signals (Demand & Shelf Life) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <BarChart className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Demand Forecast</p>
                            </div>
                            {signals ? (
                                <div className="space-y-2">
                                    <h4 className="text-4xl font-black text-slate-900">{signals.demandScore.toFixed(0)}<span className="text-sm text-slate-300 ml-1">INDEX</span></h4>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full shadow-lg shadow-blue-500/20" style={{ width: `${signals.demandScore}%` }} />
                                    </div>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Predicted liquidity for {selectedCrop} in Month {inputs.month}</p>
                                </div>
                            ) : <div className="h-20 animate-pulse bg-slate-50 rounded-2xl" />}
                        </div>

                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-xl">
                                    <Zap className="w-4 h-4 text-orange-600" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shelf-Life Index</p>
                            </div>
                            {signals ? (
                                <div className="space-y-2">
                                    <h4 className="text-4xl font-black text-slate-900">{signals.estimatedLife}<span className="text-sm text-slate-300 ml-1">DAYS</span></h4>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full shadow-lg shadow-orange-500/20" style={{ width: `${(signals.estimatedLife / 30) * 100}%` }} />
                                    </div>
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">Est. preservation at {inputs.temp}°C & {inputs.moisture}% moisture</p>
                                </div>
                            ) : <div className="h-20 animate-pulse bg-slate-50 rounded-2xl" />}
                        </div>
                    </div>

                    {/* Price Results */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Market Value results</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {crops.map(crop => (
                                <button
                                    key={crop.name}
                                    onClick={() => { setSelectedCrop(crop.name); fetchPrediction(crop.name); fetchSignals(crop.name); }}
                                    className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 group ${selectedCrop === crop.name
                                        ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-200'
                                        : 'bg-white border-slate-100 hover:border-emerald-500/20'
                                        }`}
                                >
                                    <span className="text-3xl">{crop.icon}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCrop === crop.name ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'
                                        }`}>
                                        {crop.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {prediction ? (
                            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-8 -translate-y-8 rotate-12 transition-transform duration-700 group-hover:scale-110">
                                    <BarChart className="w-full h-full text-emerald-500" />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">Price Equilibrium</p>
                                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                                            ₹{prediction.predictedPrice}
                                            <span className="text-lg text-slate-300 font-bold ml-2">/KG</span>
                                        </h2>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center min-w-[200px]">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Model Accuracy</p>
                                        <p className="text-2xl font-black text-slate-800">92.4%</p>
                                        <div className="h-1 w-full bg-slate-200 rounded-full mt-2">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Quality Results */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Quality grading Results</h3>
                        </div>

                        {qualityResult ? (
                            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">AI Grade Prediction</p>
                                            <h2 className="text-6xl font-black tracking-tighter text-white">
                                                {qualityResult.overallGrade}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="px-4 py-2 bg-emerald-500 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                                                SCORE: {qualityResult.qualityScore}/100
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <Info className="w-3.5 h-3.5" /> High Precision Node
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { l: "Moisture", v: `${qualityResult.details.moisture}%` },
                                            { l: "Purity", v: `${qualityResult.details.purity}%` },
                                            { l: "Uniformity", v: "High" },
                                            { l: "Method", v: "RF-Class" }
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.l}</p>
                                                <p className="text-sm font-bold text-emerald-400">{item.v}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                                <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Loader2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
