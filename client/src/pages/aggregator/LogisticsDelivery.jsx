import React, { useState } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Truck, Upload, MapPin, Clock, ChevronRight, X, ShieldCheck, Camera, ArrowLeft, Send, Package, User, Check, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const shipments = [
    {
        id: "SHP-301", retailer: "FreshMart Mumbai", crop: "Organic Basmati Rice", status: "dispatched",
        checkpoints: [
            { point: "Regional Hub, Nashik", time: "10:30 AM", done: true },
            { point: "Transit Corridor A-12", time: "2:15 PM", done: true },
            { point: "FreshMart Terminal, Mumbai", time: "ETA 06:00 PM", done: false },
        ],
        vehicle: "MH-15 AB 1234", driver: "Rajesh S."
    },
    {
        id: "SHP-302", retailer: "AgriStore Pune", crop: "Yellow Maize High-Volume", status: "dispatched",
        checkpoints: [
            { point: "Regional Hub, Nashik", time: "09:00 AM", done: true },
            { point: "AgriStore Distribution, Pune", time: "ETA 01:00 PM", done: false },
        ],
        vehicle: "MH-12 XY 9876", driver: "Vikram P."
    },
];

export default function LogisticsDelivery() {
    const navigate = useNavigate();
    const [uploadOpen, setUploadOpen] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleUpload = (e) => {
        e.preventDefault();
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setUploadOpen(null);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        }, 1500);
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
                        <h1 className="text-2xl text-slate-900 tracking-tight font-bold">Logistics Command Center</h1>
                        <p className="text-sm text-slate-500">Real-time telemetry and dispatch verification for regional supply chains.</p>
                    </div>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                    <Truck className="w-4 h-4 text-emerald-500" /> Dispatch New Fleet
                </button>
            </div>

            {/* Shipments Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {shipments.map((ship) => (
                    <div key={ship.id} className="group bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative overflow-hidden flex flex-col h-full">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 rounded-[32px] bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 transition-all duration-500">
                                        <Truck className="h-8 w-8 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">{ship.retailer}</h3>
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Active Transit</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Batch ID: {ship.id} • {ship.vehicle}</p>
                                    </div>
                                </div>
                                <StatusBadge status={ship.status} />
                            </div>

                            <div className="flex-grow space-y-8 ml-10 border-l-2 border-slate-50 pl-10">
                                {ship.checkpoints.map((cp, idx) => (
                                    <div key={idx} className="relative flex items-center gap-6 group/item">
                                        {/* Timeline Indicator */}
                                        <div className={`absolute -left-[51px] w-5 h-5 rounded-full border-4 shadow-sm transition-all duration-500 ${cp.done ? "bg-emerald-500 border-white ring-8 ring-emerald-50" : "bg-white border-slate-100"
                                            }`} />

                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2">
                                                <MapPin className={`h-3.5 w-3.5 ${cp.done ? "text-emerald-500" : "text-slate-300"}`} />
                                                <span className={`text-xs font-bold transition-colors ${cp.done ? "text-slate-900" : "text-slate-400"}`}>
                                                    {cp.point}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="w-3 h-3 text-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cp.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                        <User className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Dispatcher</p>
                                        <p className="text-sm font-bold text-slate-700 mt-1">{ship.driver}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setUploadOpen(ship.id)}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 rounded-[24px] bg-slate-900 px-8 py-4 text-[10px] font-bold text-white uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
                                >
                                    <Upload className="h-4 w-4 text-emerald-500" /> Upload POD
                                </button>
                            </div>
                        </div>

                        {/* Background Accents */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-slate-50 rounded-full group-hover:scale-[2] transition-all duration-1000 -z-0" />
                        <Package className="absolute bottom-8 right-8 w-12 h-12 text-slate-50 group-hover:text-emerald-50/30 transition-all duration-1000" />
                    </div>
                ))}
            </div>

            {/* Success Notification */}
            {showSuccess && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-10 py-5 rounded-[24px] shadow-2xl animate-in slide-in-from-bottom-10 flex items-center gap-4 border border-slate-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Fulfillment Proof Authenticated on Blockchain</span>
                </div>
            )}

            {/* Upload POD Modal */}
            {uploadOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500 relative">
                        <div className="p-12 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl text-slate-900 font-bold tracking-tight">Proof of Fulfillment</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cargo Release Verification: {uploadOpen}</p>
                                </div>
                                <button
                                    onClick={() => setUploadOpen(null)}
                                    className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Terminal Receiver Token</label>
                                        <input className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all" placeholder="Enter Operator Node Identifier" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cargo Visual Proof</label>
                                        <div className="group relative">
                                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" required />
                                            <div className="w-full rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50 p-12 text-center group-hover:bg-white group-hover:border-emerald-500/30 transition-all group-hover:shadow-xl group-hover:shadow-slate-100">
                                                <Camera className="h-12 w-12 text-slate-300 mx-auto mb-4 group-hover:text-emerald-500 transition-all duration-300 group-hover:scale-110" />
                                                <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Optical Receipt Documentation</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-2">Neural Scan Verification Required</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Relay Commentary</label>
                                        <textarea className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-5 px-8 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all min-h-[120px]" placeholder="Note any package variances or terminal anomalies..." />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 inline-flex items-center justify-center gap-4 rounded-[28px] bg-slate-900 px-10 py-6 text-[10px] font-bold text-white uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                                        {uploading ? "Syncing Proof..." : "Verify Delivery"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadOpen(null)}
                                        className="px-10 rounded-[28px] bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Abort
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
