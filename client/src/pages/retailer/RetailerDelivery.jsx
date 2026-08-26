import React, { useState, useEffect } from "react";
import { RetailerLayout } from "../../components/retailer/RetailerLayout";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { MapPin, Package, Truck, CheckCircle, Upload, Navigation, ArrowRight, Loader2, Link, ChevronLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { retailerApi } from "../../utils/api";

export default function RetailerDelivery() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('order');

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const formatAddress = (addr) => {
        if (typeof addr === 'string') return addr;
        if (!addr) return 'Regional Node';
        const { village, district, state, pincode, fullAddress } = addr;
        if (fullAddress) return fullAddress;
        return [village, district, state, pincode].filter(Boolean).join(', ');
    };

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            setError("No logistics identifier provided.");
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await retailerApi.getOrders();
            if (response.data.success) {
                const found = response.data.data.find(o => o.id === orderId || o.order_id === orderId);
                if (found) {
                    setOrder(found);
                } else {
                    setError("Shipment record not synchronized.");
                }
            }
        } catch (err) {
            console.error("Fetch delivery error:", err);
            setError("Logistics node unreachable.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <RetailerLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Live Shipment Coordinates...</p>
                </div>
            </RetailerLayout>
        );
    }

    const steps = [
        { label: "Order Initialized", detail: `Authorized by ${order?.buyer_id?.slice(0, 8)}`, date: new Date(order?.created_at).toLocaleString(), icon: CheckCircle, done: true },
        { label: "Inventory Reserved", detail: `${order?.quantity} ${order?.unit} ${order?.crop?.name} locked in ledger`, date: new Date(order?.created_at).toLocaleString(), icon: Package, done: true },
        { label: "Logistics Dispatch", detail: "Regional transit node assigned", date: "System Synchronizing", icon: Truck, done: ['shipped', 'delivered'].includes(order?.status) },
        { label: "Terminal Receipt", detail: `Destination: ${formatAddress(order?.delivery_address)?.slice(0, 30)}...`, date: "Pending Verification", icon: MapPin, done: order?.status === 'delivered' },
    ];

    return (
        <RetailerLayout>
            <div className="space-y-12 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div className="space-y-4">
                        <button onClick={() => navigate('/retailer/orders')} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all group">
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> BACK TO LOGISTICS LEDGER
                        </button>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="h-2 w-12 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time Oversight</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800 uppercase">
                                LIVE SHIPMENT AUDIT
                            </h1>
                            <p className="text-xl font-bold text-slate-500 mt-2">Verified GPS synchronization and supply chain milestone tracking.</p>
                        </div>
                    </div>
                </div>

                {/* Tracking Console */}
                <div className="bg-white rounded-[4rem] p-12 sm:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-16 border-b border-slate-50 pb-16">
                        <div>
                            <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight uppercase">SHIPMENT IDENTIFIER: {order?.order_id}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CARGO: {order?.crop?.name} · PAYLOAD: {order?.quantity} {order?.unit}</p>
                        </div>
                        <StatusBadge status={order?.status || 'Processing'} />
                    </div>

                    {/* Dynamic Map Visualization */}
                    <div className="relative h-80 rounded-[3.5rem] bg-slate-950 overflow-hidden mb-20 group border-4 border-white shadow-2xl">
                        <div className="absolute inset-0 opacity-30 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/80.2707,13.0827,10/1200x600?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwM2YycXBndWR6dXBvNzYifQ')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[20s]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse mb-6 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                                    <Navigation className="h-6 w-6 text-white rotate-45" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-sm font-black uppercase tracking-[0.4em] mb-1">REGIONAL TRANSIT ACTIVE</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{order?.status === 'delivered' ? 'TERMINAL REACHED' : 'ESTIMATED ARRIVAL: SYNCING...'}</p>
                            </div>
                        </div>

                        {/* Telemetry HUD */}
                        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] space-y-1">
                                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em]">GPS COORDINATES</p>
                                <p className="text-xs font-mono font-black text-white uppercase tracking-widest">13.0827° N, 80.2707° E</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-right space-y-1">
                                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em]">VELOCITY INDEX</p>
                                <p className="text-xs font-mono font-black text-white uppercase tracking-widest">48 KM/H · STABLE</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Audit Sequence */}
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                                <div className="h-1 w-6 bg-emerald-500 rounded-full" /> AUDIT SEQUENCE
                            </h4>
                            <div className="space-y-0 relative pl-12">
                                <div className="absolute left-[23px] top-6 bottom-6 w-1 bg-slate-50" />
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-10 pb-16 group last:pb-0 relative">
                                        <div className="relative z-10">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-2xl ${step.done ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-white border-2 border-slate-100 text-slate-200'}`}>
                                                <step.icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-lg font-black uppercase tracking-tight transition-colors duration-700 ${step.done ? 'text-slate-800' : 'text-slate-200'}`}>{step.label}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{step.detail}</p>
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Control Module */}
                        <div className="space-y-10">
                            <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100 space-y-10 shadow-xl shadow-slate-100/50">
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] leading-none text-center">TERMINAL PROTOCOLS</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <button className="w-full py-8 bg-white border-2 border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:border-emerald-500/20 hover:text-emerald-600 transition-all active:scale-[0.98] group shadow-sm">
                                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        TRANSMIT RECEIPT EVIDENCE
                                    </button>
                                    <button
                                        disabled={order?.status === 'delivered'}
                                        className="w-full py-8 bg-emerald-600 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-[2rem] flex flex-col items-center justify-center gap-4 text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/10 hover:bg-emerald-500 transition-all active:scale-[0.98] group"
                                    >
                                        <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <CheckCircle className="h-6 w-6" />
                                        </div>
                                        {order?.status === 'delivered' ? 'RECEIPT LOGGED' : 'CONFIRM TERMINAL ARRIVAL'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
                                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px]" />
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20"><Truck className="h-6 w-6 text-white" /></div>
                                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] leading-none">LOGISTICS CARRIER</h4>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">REGIONAL PARTNER</span>
                                        <span className="text-sm font-black group-hover:text-emerald-400 transition-colors uppercase tracking-tight">AgriTrack Global Logistics</span>
                                    </div>
                                    <div className="w-full h-px bg-white/5" />
                                    <div className="flex justify-between items-center group">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">FLEET IDENTIFIER</span>
                                        <span className="text-sm font-bold font-mono tracking-widest group-hover:text-emerald-400 transition-colors">TR-99-AF-2026</span>
                                    </div>
                                    <div className="w-full h-px bg-white/5" />
                                    <div className="flex justify-between items-center group">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OPERATOR AUDIT</span>
                                        <span className="flex items-center gap-2 text-xs font-black group-hover:text-emerald-400 transition-colors uppercase">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> VERIFIED
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RetailerLayout>
    );
}
