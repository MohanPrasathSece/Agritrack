import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { CheckCircle, Leaf, Warehouse, Truck, QrCode, ExternalLink, ShieldCheck, Loader2, AlertTriangle, MapPin, ChevronLeft, FileText } from "lucide-react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { retailerApi } from "../../utils/api";
import addresses from "../../blockchain_data/contract-addresses.json";
import { formatLocation } from "../../utils/format";

export default function RetailerTraceability() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const cropId = searchParams.get('crop');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cropId) {
            fetchTraceData();
        } else {
            setError("No product identifier provided for provenance audit.");
            setLoading(false);
        }
    }, [cropId]);

    const fetchTraceData = async () => {
        try {
            setLoading(true);
            const response = await retailerApi.traceProduct(cropId);
            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError("Product provenance synchronization failed.");
            }
        } catch (err) {
            console.error("Trace fetch error:", err);
            setError("Security context expired or regional node failure.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-pulse">
                    <div className="relative">
                        <Loader2 className="w-20 h-20 text-emerald-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-emerald-500/40" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Verifying Digital Provenance Ledger...</p>
                </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[600px] mx-auto py-20 text-center space-y-8 border-2 border-dashed border-red-100 rounded-[3rem] bg-red-50/30">
                    <div className="w-20 h-20 bg-red-100 rounded-[1.5rem] flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Audit Failure</h2>
                        <p className="text-sm font-bold text-red-600 uppercase tracking-widest leading-relaxed px-10">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/retailer/marketplace')}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                    >
                        Return to Discovery Node
                    </button>
                </div>
        );
    }

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div className="space-y-4">
                        <Link to="/retailer/marketplace" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all group">
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> TERMINAL DISCOVERY
                        </Link>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="h-2 w-12 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Provenance Audit</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800">
                                Product Traceability
                            </h1>
                            <p className="text-xl font-bold text-slate-500 mt-2">Verified digital supply chain records for regional procurement.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-10 py-5 rounded-[1.8rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 hover:border-emerald-500/20 transition-all active:scale-95 flex items-center gap-3 group">
                            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" /> Provenance Certificate
                        </button>
                    </div>
                </div>

                {/* Audit Terminal */}
                <div className="bg-white rounded-[4rem] p-12 sm:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />

                    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-16 mb-20 border-b border-slate-50 pb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-xl border border-white">
                                    🌾
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black text-slate-800 tracking-tight capitalize">{data?.product?.name}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> Ledger Verified
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            <QrCode className="h-4 w-4" /> {data?.product?.traceId || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 bg-slate-900 rounded-[2.5rem] p-10 text-white relative shadow-2xl shadow-emerald-900/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
                            <div className="relative z-10 flex items-center gap-8">
                                <div className="text-right space-y-2">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] leading-none mb-4">PURCHASE QUALITY</p>
                                    <p className="text-3xl font-black tracking-tighter">{data?.chain?.[1]?.details?.split(': ')?.[1] || 'Grade A'}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified on Blockchain</p>
                                </div>
                                <div className="w-px h-16 bg-white/10" />
                                <div className="flex flex-col items-center gap-2">
                                    <StatusBadge status="PREMIUM" />
                                    {data?.order?.payment_status === 'escrowed' && (
                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">ESCROW ACTIVE</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                        {/* Timeline Sequence */}
                        <div className="lg:col-span-2 space-y-12">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                                <div className="h-1 w-6 bg-emerald-500 rounded-full" /> SUPPLY CHAIN SEQUENCE
                            </h4>
                            <div className="relative pl-12 space-y-16">
                                <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-slate-50 border-x border-white/50" />

                                {data?.chain?.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className={`absolute left-[-39px] top-4 h-6 w-6 rounded-full border-4 border-white shadow-2xl z-10 transition-all duration-700 bg-emerald-600 scale-125`} />
                                        <div className="absolute left-[-31.5px] top-6 w-2 h-2 rounded-full bg-white z-20" />

                                        <div className={`flex flex-col sm:flex-row gap-8 p-10 rounded-[3rem] transition-all duration-700 border bg-white shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 group border-slate-100`}>
                                            <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl transition-all duration-700 bg-emerald-600 text-white group-hover:scale-110`}>
                                                {step.stage.toLowerCase().includes('farm') ? <Leaf className="h-7 w-7" /> : step.stage.toLowerCase().includes('collection') ? <Warehouse className="h-7 w-7" /> : <Truck className="h-7 w-7" />}
                                            </div>
                                            <div className="space-y-4 flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-lg font-black text-slate-800 tracking-tight uppercase">{step.stage}</p>
                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                            AUTHORIZED LOG: {new Date(step.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={`https://sepolia.etherscan.io/tx/${step.txHash || '0x'}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Verify Tx</span>
                                                    </a>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Primary Actor</p>
                                                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{step.actor}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Geographic Node</p>
                                                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
                                                            <MapPin className="w-3 h-3 text-emerald-500/50" /> {typeof step.location === 'object' ? (step.location?.fullAddress || step.location?.village + ', ' + step.location?.district + ', ' + step.location?.state) : (step.location || 'Unknown Location')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{step.details}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audit Sidebar */}
                        <div className="space-y-10">
                            <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20 border border-white/5">
                                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px]" />
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-10 leading-none">ESCROW SETTLEMENT</h4>
                                <div className="space-y-8">
                                    {[
                                        { label: "Payment Protocol", value: data?.order?.payment_method?.toUpperCase() || "STANDARD", color: "text-blue-400" },
                                        { label: "Escrow Status", value: data?.order?.payment_status?.toUpperCase() || "N/A", color: "text-emerald-400" },
                                        { label: "On-Chain ID", value: data?.product?.traceId || "NOT_STORED", color: "text-white" }
                                    ].map((metric, i) => (
                                        <div key={i} className="group">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 leading-none">{metric.label}</p>
                                            <p className={`text-xl font-black tracking-tight ${metric.color} group-hover:translate-x-1 transition-transform`}>{metric.value}</p>
                                            {i !== 2 && <div className="w-full h-px bg-white/5 mt-8" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-12 bg-emerald-50 rounded-[3.5rem] border-2 border-emerald-100 text-center relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/50 rounded-full blur-3xl opacity-50" />
                                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10 border-2 border-emerald-100 transition-transform hover:rotate-6 duration-500">
                                    <QrCode className="h-10 w-10 text-emerald-600" />
                                </div>
                                <div className="space-y-4 mb-10">
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight">PUBLIC PROVENANCE</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Transmit this cryptographically signed code to consumers for final provenance verification.</p>
                                </div>
                                <button className="w-full py-6 bg-slate-900 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all active:scale-[0.98]">
                                    GENERATE DYNAMIC LABEL
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-12 border-t-2 border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-white shadow-xl text-emerald-600 group cursor-pointer">
                                <ShieldCheck className="h-7 w-7 transition-transform group-hover:scale-110" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Cryptographic Integrity</p>
                                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Protocol Stored on Decentralized Ledger</p>
                            </div>
                        </div>
                        <a
                            href={`https://sepolia.etherscan.io/address/${addresses.PRODUCE_LEDGER_ADDRESS}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-emerald-600 transition-all group"
                        >
                            EXTERNAL CHAIN EXPLORER <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
    );
}

