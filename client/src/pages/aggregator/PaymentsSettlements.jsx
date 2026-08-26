import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { aggregatorApi, blockchainApi } from "../../utils/api";
import { ArrowDownLeft, ArrowUpRight, DollarSign, Lock, ExternalLink, ShieldCheck, Wallet, ChevronRight, Loader2, CheckCircle, ArrowLeft, TrendingUp, Sparkles, Activity, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentsSettlements() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [settling, setSettling] = useState(false);
    const [data, setData] = useState(null);
    const [txHash, setTxHash] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await aggregatorApi.getAnalytics();
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch financial data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchSettlement = async () => {
        try {
            setSettling(true);
            setTxHash(null);
            const demoProduceId = 1;
            const demoReceiver = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
            const response = await blockchainApi.releaseEscrow(demoProduceId, demoReceiver);
            if (response.data.success) {
                setTxHash(response.data.txHash);
                setTimeout(() => setTxHash(null), 10000);
            }
        } catch (err) {
            console.error("Settlement failed:", err);
            alert("Settlement execution failed: Contract Error");
        } finally {
            setSettling(false);
        }
    };

    const transactions = [
        { id: "TXN-5001", type: "incoming", party: "FreshMart Mumbai", amount: data?.analytics?.totalSpent ? (data.analytics.totalSpent * 1.2).toFixed(0) : "8,400", status: "completed", hash: "0x3a7f...c912", date: "2 Hours ago" },
        { id: "TXN-5002", type: "outgoing", party: "Regional Producer", amount: (data?.analytics?.totalSpent || 5200).toLocaleString(), status: "completed", hash: "0x8b2e...d441", date: "4 Hours ago" },
        { id: "TXN-5005", type: "escrow", party: "AgriStore Retail", amount: "6,600", status: "pending", hash: "0x4c1b...a893", date: "2 Days ago" },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-xs text-slate-400 uppercase tracking-[0.2em] animate-pulse">Accessing Decentralized Ledger...</p>
            </div>
        );
    }

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
                        <h1 className="text-2xl text-slate-900 tracking-tight font-bold">Financial Treasury</h1>
                        <p className="text-sm text-slate-500">Audit-ready documentation of regional economic flows and blockchain settlements.</p>
                    </div>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                    <Activity className="w-4 h-4" /> Export Audit Report
                </button>
            </div>

            {/* Financial Cluster */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Aggregate Revenue", value: `₹${(data?.analytics?.totalSpent * 1.2 || 57600).toLocaleString()}`, icon: ArrowDownLeft, color: "emerald", trend: "+12.4% Neural Growth" },
                    { label: "Producer Disbursements", value: `₹${(data?.analytics?.totalSpent || 38400).toLocaleString()}`, icon: ArrowUpRight, color: "slate", trend: "100% On-Chain Sync" },
                    { label: "Locked Escrow", value: "₹6,600", icon: Lock, color: "indigo", trend: "Quality Restricted" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300`}>
                                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 group-hover:text-white transition-colors`} />
                                </div>
                                <div className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                                    Live Stream
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{stat.value}</h3>
                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest pt-1">{stat.trend}</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-[3.5] transition-all duration-1000 -z-0" />
                    </div>
                ))}
            </div>

            {/* Transaction Ledger Table */}
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden relative group">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Protocol Activity Logs</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Node Live</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Handshake ID</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Class</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Partner</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value Transfer</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synchronization</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Block Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="group/row hover:bg-slate-50/50 transition-colors">
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-900">{tx.id}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-medium">{tx.date}</p>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest ${tx.type === "incoming" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                            tx.type === "outgoing" ? "bg-slate-900 border-slate-900 text-white" :
                                                "bg-indigo-50 border-indigo-100 text-indigo-600"
                                            }`}>
                                            {tx.type === "incoming" ? <ArrowDownLeft className="h-3 w-3" /> : tx.type === "outgoing" ? <ArrowUpRight className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                            {tx.type}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <p className="text-sm font-bold text-slate-700">{tx.party}</p>
                                    </td>
                                    <td className="p-8">
                                        <p className={`text-lg font-bold tracking-tighter ${tx.type === 'incoming' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {tx.type === 'incoming' ? '+' : '-'}₹{tx.amount}
                                        </p>
                                    </td>
                                    <td className="p-8">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="inline-flex items-center gap-3 bg-slate-50 group-hover/row:bg-white px-4 py-2 rounded-xl border border-slate-100 transition-all cursor-pointer">
                                            <code className="text-[10px] font-bold text-slate-400 font-mono">{tx.hash}</code>
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/row:text-emerald-500" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Treasury Interaction Zone */}
            <div className="bg-slate-50 rounded-[48px] p-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden border border-slate-100 group">
                <div className="relative z-10 space-y-6 max-w-xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Audit Protocols Finalized</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">Decentralized Settlement Engine</h2>
                        <p className="text-sm text-slate-500 max-w-lg leading-relaxed font-medium">
                            The system is currently configured to execute batch settlements to producer smart contracts upon immutable quality verification.
                        </p>
                    </div>
                    {txHash && (
                        <div className="flex items-center justify-center lg:justify-start gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-left-4 duration-500">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Transaction Confirmed</p>
                                <code className="text-[10px] text-emerald-600 font-mono truncate block">{txHash}</code>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
                    <div className="bg-white rounded-[32px] p-8 border border-slate-200 text-center min-w-[200px] shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Cycle Balance</p>
                        <p className="text-3xl font-bold text-slate-900 tracking-tighter">₹{(data?.analytics?.totalSpent * 0.2 || 12400).toLocaleString()}</p>
                    </div>
                    <button
                        onClick={handleBatchSettlement}
                        disabled={settling}
                        className="bg-slate-900 text-white px-10 py-8 rounded-[32px] text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-slate-900/20 flex items-center gap-4 disabled:opacity-50 hover:bg-slate-800"
                    >
                        {settling ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Wallet className="w-5 h-5 text-emerald-500" />
                        )}
                        {settling ? "Executing Protocol..." : "Invoke Batch Settlement"}
                    </button>
                </div>

                <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px] group-hover:bg-emerald-200/40 transition-colors duration-1000" />
            </div>
        </div>
    );
}
