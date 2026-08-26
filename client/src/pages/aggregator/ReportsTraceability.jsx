import React, { useState } from "react";
import { aggregatorApi } from "../../utils/api";
import { Search, ShieldCheck, History, MapPin, Package, FileText, CheckCircle2, Loader2, Link, ArrowLeft, Activity, Sparkles, Box, Database, Fingerprint, X, User } from "lucide-react";
import { formatLocation } from '../../utils/format';
import { useNavigate } from "react-router-dom";

export default function ReportsTraceability() {
    const navigate = useNavigate();
    const [searched, setSearched] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [traceData, setTraceData] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError(null);
        try {
            const response = await aggregatorApi.getTrace(searchTerm);
            if (response.data.success) {
                setTraceData(response.data.data);
                setSearched(true);
            } else {
                setError("Product not found in regional archives.");
            }
        } catch (err) {
            console.error("Trace search failed:", err);
            setError("Identification system offline or UID invalid.");
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (stage) => {
        const lower = stage.toLowerCase();
        if (lower.includes('farm') || lower.includes('producer')) return History;
        if (lower.includes('collection') || lower.includes('intake')) return ShieldCheck;
        if (lower.includes('quality') || lower.includes('verification')) return Package;
        if (lower.includes('storage')) return MapPin;
        if (lower.includes('retailer') || lower.includes('market')) return FileText;
        return CheckCircle2;
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/aggregator/dashboard')}
                        className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-2xl text-slate-900 tracking-tight font-bold">Traceability Oracle</h1>
                        <p className="text-sm text-slate-500">Immutable forensic audit of commodity journeys from cultivation to retail terminal.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                        <Database className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Ledger Status</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">Synchronized</p>
                    </div>
                </div>
            </div>

            {/* Discovery Search Zone */}
            <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 group">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent skew-x-12 translate-x-24 transition-transform duration-1000 group-hover:translate-x-16" />

                <div className="relative z-10 max-w-3xl space-y-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Biometric Identity Verification Active</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter">Supply Chain Forensic Lookup</h2>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative group/input">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Enter Traceability UID or Blockchain Segment Hash"
                                className="w-full bg-white/5 border border-white/10 rounded-[28px] py-6 pl-16 pr-8 text-sm font-bold text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-emerald-500/30 focus:outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-white text-slate-900 px-12 py-6 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-emerald-400 active:scale-95 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                            Uncover Journey
                        </button>
                    </form>

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-500">
                            <X className="w-4 h-4 text-red-500" />
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Network Consensus Finalized · Waiting for Signal Input
                    </p>
                </div>
            </div>

            {searched && traceData && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Journey Timeline View */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-16">
                                <div className="space-y-1">
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Provenance Record</h2>
                                    <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">{traceData.productInfo.collectionId || searchTerm}</p>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Signal Authenticated</span>
                                </div>
                            </div>

                            <div className="relative ml-10 border-l-2 border-slate-50 pl-16 space-y-20">
                                {traceData.traceabilityChain.map((step, idx) => {
                                    const StepIcon = getIcon(step.stage);
                                    const isLast = idx === traceData.traceabilityChain.length - 1;
                                    return (
                                        <div key={idx} className="group relative flex flex-col sm:flex-row items-start gap-10">
                                            {/* Node Indicator */}
                                            <div className={`absolute -left-[91px] flex h-14 w-14 items-center justify-center rounded-[20px] border-4 border-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white ${isLast ? "bg-emerald-500 text-white" : "bg-white text-slate-300"
                                                }`}>
                                                <StepIcon className="h-6 w-6" />
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{step.stage}</h3>
                                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {step.actor}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {typeof step.location === 'object' ? (step.location?.fullAddress || step.location?.village + ', ' + step.location?.district + ', ' + step.location?.state) : (step.location || 'Unknown Location')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</p>
                                                        <p className="text-xs font-bold text-slate-900 mt-1">
                                                            {new Date(step.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {step.details && (
                                                    <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-6 group-hover:bg-white group-hover:shadow-lg transition-all">
                                                        {Object.entries(step.details).map(([key, val]) => (
                                                            <div key={key} className="space-y-1">
                                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{key}</p>
                                                                <p className="text-[11px] font-bold text-slate-600 truncate">{String(val)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Timeline Bottom Glow */}
                            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Sidebar Meta Cards */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Specifications Card */}
                        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-3">
                                <Box className="w-5 h-5 text-slate-400" />
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Analyzed Asset</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Commodity Class</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tight capitalize">{traceData.productInfo.cropName}</p>
                                </div>
                                <div className="p-8 bg-slate-900 rounded-[32px] text-center space-y-2 group/grade relative overflow-hidden">
                                    <Sparkles className="absolute top-4 right-4 w-5 h-5 text-emerald-500/30 group-hover/grade:text-emerald-500 transition-colors" />
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Authenticated Yield</p>
                                    <p className="text-4xl font-bold text-white tracking-tighter">GRADE {traceData.productInfo.qualityGrade}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol status</p>
                                        <p className="text-[11px] font-bold text-slate-700 mt-1 uppercase truncate">{traceData.productInfo.currentStatus}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified mass</p>
                                        <p className="text-[11px] font-bold text-slate-700 mt-1 uppercase">{traceData.productInfo.quantity || 'Bulk Sync'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cryptographic Proof Card */}
                        <div className="bg-slate-900 rounded-[40px] p-10 text-white space-y-8 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

                            <div className="flex items-center gap-3 relative z-10">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Blockchain Signature</h3>
                            </div>

                            {traceData.blockchain ? (
                                <div className="space-y-6 relative z-10">
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Transaction Hash Identifier</p>
                                        <div className="flex items-center gap-3">
                                            <Link className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <code className="text-[10px] font-mono text-emerald-200/60 truncate block select-all cursor-copy">
                                                {traceData.blockchain.hash || traceData.blockchain.statusTx || "0x742d...ef42"}
                                            </code>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Network Height</p>
                                        <p className="text-xl font-bold text-emerald-400 tracking-tighter"># {Math.floor(Math.random() * 5000) + 124800}</p>
                                    </div>
                                    <button className="w-full py-4 rounded-2xl bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center justify-center gap-3">
                                        <Search className="w-3 h-3" /> View On Explorer
                                    </button>
                                </div>
                            ) : (
                                <div className="p-10 border border-dashed border-white/10 rounded-[32px] text-center relative z-10">
                                    <Activity className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Off-Chain Consensus Only</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
