import React, { useState, useRef, useCallback } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import {
    ShieldCheck, AlertTriangle, CheckCircle2, ChevronRight, MessageSquare,
    Info, X, ArrowLeft, Activity, Search, Scan, Beaker, Sparkles, Loader2,
    MapPin, Brain, TrendingUp, Upload, ImagePlus, Cpu, BarChart3,
    CheckCircle, Microscope, Droplets, FlaskConical, Leaf, ZapOff, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mlApi } from "../../utils/api";
import { formatLocation } from "../../utils/format";

const batchesData = [
    { id: "BTC-0524", crop: "Premium Basmati Rice", farmer: "Ramesh Kumar", aiGrade: "Grade A", status: "pending", location: "Warehouse A-12" },
    { id: "BTC-0523", crop: "Durum Wheat", farmer: "Sunita Devi", aiGrade: "Grade B", status: "verified", location: "Warehouse B-04" },
    { id: "BTC-0522", crop: "Organic Maize", farmer: "Ajay Singh", aiGrade: "Grade A", status: "disputed", location: "Processing Unit 2" },
    { id: "BTC-0521", crop: "Soybean", farmer: "Priya Patel", aiGrade: "Grade C", status: "pending", location: "Intake Station 1" },
];

const GRADE_COLORS = {
    Premium: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" },
    A: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", bar: "bg-blue-500" },
    B: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", bar: "bg-amber-500" },
    C: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", bar: "bg-red-400" },
};

function MetricBar({ label, value, max = 100, unit = "%" }) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const color = pct >= 80 ? "bg-emerald-500" : pct >= 55 ? "bg-amber-500" : "bg-red-400";
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                <span className="text-xs font-bold text-slate-700">{value}{unit}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function MLImageAnalyzer() {
    const [dragOver, setDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cropType, setCropType] = useState("general");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setSelectedFile(file);
        setResult(null);
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const fd = new FormData();
            fd.append("image", selectedFile);
            fd.append("cropType", cropType);
            const res = await mlApi.analyzeImageQuality(fd);
            if (res.data.success) {
                setResult(res.data);
            } else {
                setError(res.data.message || "Analysis failed");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.hint || err.message;
            setError(msg || "Network error. Make sure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const grade = result?.overallGrade;
    const gc = GRADE_COLORS[grade] || GRADE_COLORS["B"];

    return (
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-10 pt-10 pb-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Quality Analyzer</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Automated Image Analysis
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">AI Scanner Active</span>
                </div>
            </div>

            <div className="p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* ── Left: Upload Panel ── */}
                    <div className="space-y-6">
                        {/* Crop type selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Crop Type</label>
                            <select
                                value={cropType}
                                onChange={e => setCropType(e.target.value)}
                                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                            >
                                {["general", "Tomato", "Onion", "Potato", "Rice", "Wheat", "Maize", "Soybean", "Cotton"].map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        {/* Drop zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`relative group cursor-pointer rounded-[32px] border-2 border-dashed transition-all duration-300 overflow-hidden
                                ${dragOver ? "border-emerald-400 bg-emerald-50/60 scale-[1.01]" : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/30"}`}
                            style={{ minHeight: "220px" }}
                        >
                            {previewUrl ? (
                                <div className="relative w-full h-full" style={{ minHeight: "220px" }}>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Ready to Analyze</p>
                                            <p className="text-sm font-bold text-white truncate max-w-[200px]">{selectedFile?.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); reset(); }}
                                        className="absolute top-4 right-4 w-8 h-8 bg-slate-900/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
                                    <div className="w-16 h-16 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center group-hover:border-emerald-200 transition-all">
                                        <ImagePlus className="w-7 h-7 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500">Drop a crop image here</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">or click to browse · JPG, PNG, WEBP</p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp"
                                className="hidden"
                                onChange={e => handleFile(e.target.files?.[0])}
                            />
                        </div>

                        {/* Analyze button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedFile || loading}
                            className="w-full rounded-[24px] bg-slate-900 text-white py-5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3
                                hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/10
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Image...</>
                                : <><Scan className="w-4 h-4 text-emerald-400" /> Analyze Crop Image</>
                            }
                        </button>

                        {/* Feature legend */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Eye, label: "Color Analysis" },
                                { icon: Microscope, label: "Texture (LBP)" },
                                { icon: ZapOff, label: "Defect Detection" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center gap-2 border border-slate-100">
                                    <Icon className="w-4 h-4 text-slate-400" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center leading-tight">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Results Panel ── */}
                    <div className="space-y-6">
                        {/* Error */}
                        {error && (
                            <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-red-700">Analysis Failed</p>
                                    <p className="text-xs text-red-500 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-28 bg-slate-100 rounded-3xl" />
                                <div className="h-8 bg-slate-100 rounded-2xl w-3/4" />
                                <div className="h-8 bg-slate-100 rounded-2xl" />
                                <div className="h-8 bg-slate-100 rounded-2xl w-5/6" />
                                <div className="h-20 bg-slate-100 rounded-3xl" />
                            </div>
                        )}

                        {/* Results */}
                        {result && !loading && (
                            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
                                {/* Grade badge */}
                                <div className={`p-6 rounded-3xl border ${gc.bg} ${gc.border} flex items-center justify-between`}>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Grade</p>
                                        <p className={`text-4xl font-black tracking-tight mt-1 ${gc.text}`}>{result.overallGrade}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            via {result.method}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Score</p>
                                        <p className={`text-5xl font-black tracking-tight ${gc.text}`}>{result.qualityScore}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/100</p>
                                    </div>
                                </div>

                                {/* Visual inspection */}
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Inspection</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: "Color", value: result.visualInspection?.color },
                                            { label: "Texture", value: result.visualInspection?.texture },
                                            { label: "Size", value: result.visualInspection?.size },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                                                <p className="text-xs font-bold text-slate-700 mt-1">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Raw feature metrics */}
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Extracted Features</p>
                                    <MetricBar label="Brightness" value={result.rawFeatures?.brightness ?? 0} />
                                    <MetricBar label="Saturation" value={result.rawFeatures?.saturation ?? 0} />
                                    <MetricBar label="Texture Uniformity" value={result.rawFeatures?.textureUniformity ?? 0} />
                                    <MetricBar label="Shape Regularity" value={result.visualInspection?.uniformity ?? 0} />
                                    <MetricBar label="Purity Level" value={result.purityLevel ?? 80} />
                                </div>

                                {/* Defects */}
                                {result.defectDetection?.length > 0 ? (
                                    <div className="p-5 bg-red-50 rounded-2xl border border-red-100 space-y-3">
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Defects Detected</p>
                                        {result.defectDetection.map((d, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-red-100">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                                    <span className="text-xs font-bold text-slate-700">{d.defectType}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${d.severity === "High" ? "bg-red-100 text-red-600" :
                                                        d.severity === "Medium" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                                                        }`}>{d.severity}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{d.affectedPercentage}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold text-emerald-700">No significant defects detected</span>
                                    </div>
                                )}

                                {/* Moisture & Purity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Moisture</span>
                                        </div>
                                        <p className="text-xl font-black text-blue-700 tracking-tight">{result.moistureContent}%</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Purity</span>
                                        </div>
                                        <p className="text-xl font-black text-slate-700 tracking-tight">{result.purityLevel}%</p>
                                    </div>
                                </div>

                                {/* Market recommendation */}
                                <div className="p-5 bg-slate-900 rounded-2xl space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Recommendation</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Suggested Price</p>
                                            <p className="text-2xl font-black text-white">₹{result.marketRecommendation?.suggestedPrice}/kg</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Demand</p>
                                            <p className={`text-lg font-black ${result.marketRecommendation?.marketDemand === "High" ? "text-emerald-400" :
                                                result.marketRecommendation?.marketDemand === "Medium" ? "text-amber-400" : "text-red-400"
                                                }`}>{result.marketRecommendation?.marketDemand}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {result.marketRecommendation?.bestMarkets?.map((m) => (
                                            <span key={m} className="px-3 py-1 bg-slate-800 rounded-full text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Compliance */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Organic Compliance", value: result.organicCompliance, icon: Leaf },
                                        { label: "Pesticide-Free", value: !result.pesticidesDetected, icon: ShieldCheck },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${value ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                                            }`}>
                                            <Icon className={`w-4 h-4 ${value ? "text-emerald-500" : "text-red-400"}`} />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                                                <p className={`text-xs font-bold ${value ? "text-emerald-700" : "text-red-600"}`}>
                                                    {value ? "Compliant" : "Non-Compliant"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty placeholder */}
                        {!result && !loading && !error && (
                            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-4 py-16">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
                                    <BarChart3 className="w-9 h-9 text-slate-200" />
                                </div>
                                <p className="text-sm font-bold text-slate-400">Upload a crop image to get started</p>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest max-w-xs">
                                    Our AI automatically detects quality, defects, and purity from your photo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function QualityVerification() {
    const navigate = useNavigate();
    const [disputeOpen, setDisputeOpen] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [marketAnalysis, setMarketAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [activeTab, setActiveTab] = useState("batches"); // "batches" | "ml-scanner"

    const fetchMarketAnalysis = async (crop) => {
        try {
            setLoadingAnalysis(true);
            const res = await mlApi.predictPrice({ cropName: crop, location: "Regional Hub", quality: "A" });
            if (res.data.success) setMarketAnalysis(res.data.prediction);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAnalysis(false);
        }
    };

    const handleAccept = () => {
        setIsProcessing(true);
        setTimeout(() => { setIsProcessing(false); setShowToast(true); setTimeout(() => setShowToast(false), 4000); }, 1200);
    };

    const handleDispute = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => { setIsProcessing(false); setDisputeOpen(null); setRemarks(""); }, 1500);
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/aggregator/dashboard')}
                        className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-2xl text-slate-900 tracking-tight font-bold">Quality Check</h1>
                        <p className="text-sm text-slate-500">View and verify the quality of submitted crop batches.</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Accuracy</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[97%]" />
                            </div>
                            <p className="text-lg font-bold text-emerald-600 tracking-tighter">97.2%</p>
                        </div>
                    </div>
                    <div className="text-right border-l border-slate-100 pl-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Checks</p>
                        <p className="text-lg font-bold text-slate-900 tracking-tighter mt-1">14 Batches</p>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                {[
                    { key: "batches", label: "Pending Checks", icon: Scan },
                    { key: "ml-scanner", label: "AI Quality Scanner", icon: Cpu },
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                            ${activeTab === key
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <Icon className={`w-3.5 h-3.5 ${activeTab === key ? "text-emerald-500" : ""}`} />
                        {label}
                    </button>
                ))}
            </div>

            {/* ── ML Image Scanner Tab ── */}
            {activeTab === "ml-scanner" && (
                <div className="space-y-6">
                    {/* Info banner */}
                    <div className="flex items-start gap-4 p-5 bg-slate-900 rounded-3xl">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Brain className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">How it works</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Upload any crop image. The system automatically inspects color, texture,
                                and defects to <span className="text-emerald-400 font-bold">estimate crop quality</span> and purity score.
                                <span className="text-slate-300 font-bold"> Get results instantly on your device.</span>
                            </p>
                        </div>
                    </div>
                    <MLImageAnalyzer />
                </div>
            )}

            {/* ── Batch Queue Tab ── */}
            {activeTab === "batches" && (
                <>
                    {/* Search bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="relative flex-1 group col-span-1 md:col-span-3">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by Batch ID, Producer Signature, or Commodity..."
                                className="w-full rounded-[24px] border border-transparent bg-slate-50 py-5 pl-16 pr-8 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setActiveTab("ml-scanner")}
                            className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[24px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                        >
                            <Cpu className="w-4 h-4 text-emerald-500" /> AI Scanner
                        </button>
                    </div>

                    {/* Batch List */}
                    <div className="space-y-8">
                        {batchesData.map((batch) => (
                            <div key={batch.id} className="group bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative overflow-hidden">
                                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center gap-10">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <StatusBadge status={batch.status} />
                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                                <AlertTriangle className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{batch.id}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                                                <Activity className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Quality Score: 94/100</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight capitalize">{batch.crop}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-2"><Beaker className="w-3.5 h-3.5" /> Producer: {batch.farmer}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Storage: {formatLocation(batch.location)}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 inline-flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Suggested Quality:</span>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">{batch.aiGrade}</span>
                                        </div>

                                        <button
                                            onClick={() => fetchMarketAnalysis(batch.crop)}
                                            className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors"
                                        >
                                            <Brain className="w-3 h-3" /> Get Recommended Price
                                        </button>

                                        {loadingAnalysis && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Loader2 className="w-3 h-3 animate-spin" /> Fetching forecast...
                                            </div>
                                        )}

                                        {marketAnalysis?.predictedPrice && (
                                            <div className="mt-4 p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between animate-in zoom-in duration-300">
                                                <div className="flex items-center gap-3">
                                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                    <div>
                                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Suggested Price</p>
                                                        <p className="text-sm font-bold text-white">₹{marketAnalysis.predictedPrice}/kg</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Net Demand</p>
                                                    <p className="text-sm font-bold text-emerald-400">{marketAnalysis.demandScore}%</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Verification Assets */}
                                    <div className="flex gap-4">
                                        {["Farmer Photo", "Scanner Image"].map((label, idx) => (
                                            <div key={idx} className="group/img relative">
                                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 relative overflow-hidden group-hover/img:bg-white group-hover/img:border-emerald-500/20 transition-all duration-500">
                                                    <div className="text-center space-y-2 relative z-10">
                                                        <Info className="w-5 h-5 text-slate-200 mx-auto group-hover/img:text-emerald-500 transition-colors" />
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Verification Actions */}
                                    <div className="flex flex-row xl:flex-col gap-4 xl:min-w-[240px]">
                                        {batch.status === "pending" ? (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(batch.id)}
                                                    className="flex-1 xl:w-full inline-flex items-center justify-center gap-3 rounded-[24px] bg-slate-900 px-8 py-5 text-[10px] font-bold text-white uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
                                                >
                                                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verify Quality
                                                </button>
                                                <button
                                                    onClick={() => setDisputeOpen(batch.id)}
                                                    className="flex-1 xl:w-full inline-flex items-center justify-center gap-3 rounded-[24px] bg-white border border-slate-100 px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95"
                                                >
                                                    <AlertTriangle className="h-4 w-4" /> Raise Dispute
                                                </button>
                                            </>
                                        ) : batch.status === "verified" ? (
                                            <div className="flex-1 xl:w-full flex xl:flex-col items-center gap-3 text-emerald-600 bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100">
                                                <ShieldCheck className="h-6 w-6" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-center">Quality Verified</span>
                                            </div>
                                        ) : (
                                            <div className="flex-1 xl:w-full flex xl:flex-col items-center gap-3 text-slate-400 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                                                <MessageSquare className="h-6 w-6" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-center">Dispute in Progress</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Background accents */}
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-slate-50 rounded-full group-hover:scale-[3] transition-all duration-1000 -z-0" />
                                <Sparkles className="absolute bottom-10 left-10 w-12 h-12 text-slate-50 group-hover:text-emerald-50/50 transition-all duration-1000" />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-10 py-5 rounded-[24px] shadow-2xl animate-in slide-in-from-bottom-10 flex items-center gap-4 border border-slate-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Quality Verified and Saved</span>
                </div>
            )}

            {/* Dispute Modal */}
            {disputeOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500 relative">
                        <div className="p-12 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl text-slate-900 font-bold tracking-tight">Raise Dispute</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Batch ID: {disputeOpen}</p>
                                </div>
                                <button onClick={() => setDisputeOpen(null)} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleDispute} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Suggested Quality Grade</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {['Grade A', 'Grade B', 'Grade C', 'Rejected'].map(grade => (
                                                <button key={grade} type="button"
                                                    className="py-4 rounded-2xl bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-widest">
                                                    {grade}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason for Dispute</label>
                                        <textarea
                                            value={remarks}
                                            onChange={e => setRemarks(e.target.value)}
                                            className="w-full rounded-[28px] border border-slate-100 bg-slate-50 py-6 px-8 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-red-500/20 focus:outline-none transition-all min-h-[160px]"
                                            placeholder="Describe any quality issues like color mismatch, moisture level, or defects..."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" disabled={isProcessing}
                                        className="flex-1 inline-flex items-center justify-center gap-4 rounded-[32px] bg-red-500 px-10 py-6 text-[10px] font-bold text-white uppercase tracking-widest shadow-2xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50">
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertTriangle className="w-5 h-5" />}
                                        {isProcessing ? "Submitting..." : "Submit Dispute"}
                                    </button>
                                    <button type="button" onClick={() => setDisputeOpen(null)}
                                        className="px-10 rounded-[32px] bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
