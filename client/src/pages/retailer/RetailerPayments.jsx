import React, { useState, useEffect } from "react";
import { RetailerLayout } from "../../components/retailer/RetailerLayout";
import { StatCard } from "../../components/farmer/StatCard";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Download, DollarSign, Clock, CheckCircle, Wallet, ArrowUpRight, Loader2, RefreshCw, Smartphone, CreditCard } from "lucide-react";
import { retailerApi } from "../../utils/api";

export default function RetailerPayments() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, dashRes] = await Promise.all([
                retailerApi.getOrders(),
                retailerApi.getDashboard()
            ]);

            if (ordersRes.data.success) setOrders(ordersRes.data.data);
            if (dashRes.data.success) setStats(dashRes.data.data.stats);
        } catch (err) {
            console.error("Payment sync error:", err);
            setError("Financial node synchronization failure.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <RetailerLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Financial Ledger...</p>
                </div>
            </RetailerLayout>
        );
    }

    return (
        <RetailerLayout>
            <div className="space-y-12 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="h-2 w-12 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Fiscal Operations</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800">
                            Settlements & Escrow
                        </h1>
                        <p className="text-xl font-bold text-slate-500 max-w-2xl">Verified financial protocols and cryptographically secured escrow management.</p>
                    </div>
                    <div className="flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="h-14 w-14 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600 shadow-sm">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Liquidity Buffer</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tighter">₹4,52,000.00</p>
                        </div>
                    </div>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <StatCard title="Total Settlement" value={stats?.totalSpent || "₹0"} icon={DollarSign} trend="Synchronized with ledger" trendUp />
                    <StatCard title="Active Escrow" value={`₹${orders.filter(o => o.status !== 'delivered').reduce((sum, o) => sum + parseFloat(o.total_amount), 0).toLocaleString()}`} icon={Clock} trend="Awaiting receipt verification" />
                    <StatCard title="Direct Protocols" value={orders.length} icon={CheckCircle} trend="Verified transactions" trendUp />
                </div>

                {/* Payment History Table */}
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="px-12 py-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Financial Transaction Log</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <RefreshCw className="w-3 h-3 text-emerald-500" /> REAL-TIME SYNCHRONIZATION ACTIVE
                            </p>
                        </div>
                        <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 group">
                            EXPROT AUDIT LOG <Download className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Auth Signature</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Protocol</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Settlement</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Architecture</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ledger Status</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.length > 0 ? (
                                    orders.map((p) => (
                                        <tr key={p.id} className="group hover:bg-emerald-50/20 transition-all cursor-pointer">
                                            <td className="px-10 py-8">
                                                <div className="space-y-1">
                                                    <span className="text-xs font-black text-slate-900 tracking-tight">REF-{p.order_id?.slice(-8)}</span>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{p.order_id}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-sm font-black text-slate-900 tracking-tight">₹{parseFloat(p.total_amount).toLocaleString()}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    {p.payment_method === 'escrow' ? <Smartphone className="w-3 h-3 text-emerald-500" /> : <CreditCard className="w-3 h-3 text-blue-500" />}
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.payment_method || 'Escrow Protocol'}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <StatusBadge status={p.status === 'delivered' ? 'settled' : 'in escrow'} />
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <button className="h-12 w-12 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm flex items-center justify-center mx-auto active:scale-95 group-hover:shadow-lg">
                                                    <Download className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-40 text-center">
                                            <div className="space-y-6 animate-in zoom-in duration-500">
                                                <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex items-center justify-center mx-auto transition-transform hover:scale-110">
                                                    <CreditCard className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">NO TRANSACTION DATA</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3"> Financial regional indices are currently null</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Network Assurance HUD */}
                <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-900/40 border border-white/5">
                    <div className="absolute top-0 right-0 -mr-32 -mt-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex items-center gap-10">
                            <div className="h-24 w-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-12">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-2xl font-black tracking-tight">Ledger Synchronized</h4>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Your financial terminal is linked to the decentralized assurance network.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-10 px-10 py-6 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">NETWORK HEALTH</p>
                                <p className="text-xl font-black tracking-tight">STABLE SYNC</p>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="text-right">
                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">BLOCK HEIGHT</p>
                                <p className="text-xl font-black tracking-tight font-mono">#98,241,102</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RetailerLayout>
    );
}
