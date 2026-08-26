import React, { useState, useEffect } from "react";
import { RetailerLayout } from "../../components/retailer/RetailerLayout";
import { Camera, MapPin, Phone, Mail, ShoppingBag, ShieldCheck, Edit3, Save, X, Loader2, AlertCircle, Globe } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useWeb3 } from "../../contexts/Web3Context";
import { retailerApi } from "../../utils/api";
import { formatLocation } from "../../utils/format";

export default function RetailerProfile() {
    const { user, login } = useAuth();
    const { isConnected, account, connectWallet, linkWallet, loading: web3Loading } = useWeb3();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [linking, setLinking] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await retailerApi.getDashboard();
                if (response.data.success) {
                    setStats(response.data.data.stats);
                }
            } catch (err) {
                console.error("Profile stats error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLinkWallet = async () => {
        try {
            setLinking(true);
            if (!isConnected) {
                await connectWallet();
            }
            const result = await linkWallet();
            if (result.success) {
                // Update local user state or refresh
                window.location.reload();
            }
        } catch (err) {
            console.error("Link wallet error:", err);
            alert("Protocol Error: " + err.message);
        } finally {
            setLinking(false);
        }
    };

    if (loading) {
        return (
            <RetailerLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Terminal Identity...</p>
                </div>
            </RetailerLayout>
        );
    }

    return (
        <RetailerLayout>
            <div className="space-y-12 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="h-2 w-12 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Terminal Identity Node</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800">
                            Enterprise Profile
                        </h1>
                        <p className="text-xl font-bold text-slate-500 max-w-2xl leading-relaxed">Cryptographically verified merchant credentials and performance indices.</p>
                    </div>
                    <div className="flex gap-4">
                        {!user?.wallet_address ? (
                            <button
                                onClick={handleLinkWallet}
                                disabled={linking || web3Loading}
                                className="flex items-center justify-center gap-4 px-10 py-5 bg-emerald-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all active:scale-95 group disabled:bg-slate-300"
                            >
                                <ShieldCheck className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                                {linking ? "SYNCING..." : "LINK WEB3 IDENTITY"}
                            </button>
                        ) : (
                            <div className="px-10 py-5 bg-slate-100 border-2 border-slate-200 rounded-[2rem] flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">LEDGER WALLET CONNECTED</span>
                                <span className="text-[10px] font-black text-emerald-600 tracking-tight">{user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}</span>
                            </div>
                        )}
                        <button className="flex items-center justify-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all active:scale-95 group">
                            <Edit3 className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                            Modify
                        </button>
                    </div>
                </div>

                {/* Profile Architecture */}
                <div className="bg-white rounded-[4rem] p-12 sm:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-bl-[8rem] -mr-8 -mt-8 blur-3xl" />

                    <div className="flex flex-col md:flex-row items-center gap-12 mb-20 relative z-10">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-[2.5rem] bg-emerald-600 shadow-2xl shadow-emerald-500/30 flex items-center justify-center border-8 border-white group-hover:scale-105 group-hover:rotate-6 transition-all duration-700 overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <Camera className="h-14 w-14 text-white" />}
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-emerald-50 transition-transform group-hover:scale-110">
                                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <h2 className="text-4xl font-black text-slate-800 tracking-tight capitalize">{user?.name || "RETAILER ENTITY"}</h2>
                                <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 text-[9px] font-black uppercase tracking-[0.25em]">
                                    VERIFIED PROTOCOL MERCHANT
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"><AlertCircle className="h-4 w-4 text-emerald-500" /> Joined Regional Node: JAN 2026</span>
                                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"><Globe className="h-4 w-4 text-emerald-500" /> GLOBAL ID: #{user?.id?.slice(0, 8).toUpperCase()}</span>
                                {user?.wallet_address && (
                                    <span className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-emerald-600">
                                        <ShieldCheck className="h-4 w-4" /> LEDGER SYNCED
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                        {[
                            { label: "LEGAL REGISTRATION NAME", value: user?.name?.toUpperCase() || "RETAILER CORP", icon: AlertCircle },
                            { label: "MERCHANT CLASSIFICATION", value: "SUPERMARKET / DISTRIBUTION", icon: Camera },
                            { label: "PRIMARY LOGISTICS NODE", value: formatLocation(user?.address), icon: MapPin },
                            { label: "SECURE CONTACT TERMINAL", value: user?.phone || "+91 (555) 001-9872", icon: Phone },
                            { label: "AUTHORIZED LEDGER EMAIL", value: user?.email, icon: Mail, full: true }
                        ].map((field, i) => (
                            <div key={i} className={`space - y - 4 ${field.full ? 'md:col-span-2' : ''} `}>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                    <field.icon className="h-4 w-4 text-emerald-500" /> {field.label}
                                </label>
                                <div className="p-6 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-50 font-black text-slate-700 uppercase tracking-tight text-sm shadow-sm transition-all hover:bg-white hover:border-emerald-500/20 group">
                                    <span className="group-hover:text-emerald-600 transition-colors">{field.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-16 border-t-2 border-slate-50 relative">
                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-16 w-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 rotate-12">
                                <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Supply Chain Performance</h3>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-1">REAL-TIME PERFORMANCE BIOMETRICS</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {[
                                { label: "TOTAL PROCUREMENT", value: stats?.completedOrders || "148", icon: ShoppingBag, color: "text-emerald-500" },
                                { label: "CUMULATIVE SETTLEMENT", value: stats?.totalSpent ? `₹${stats.totalSpent.toLocaleString()} ` : "₹1.1Cr", icon: ShieldCheck, color: "text-blue-500" },
                                { label: "ACTIVE NODES", value: "24", icon: MapPin, color: "text-orange-500" },
                            ].map((stat, i) => (
                                <div key={i} className="p-10 rounded-[3rem] bg-slate-50 border-2 border-slate-50 group hover:bg-white hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-slate-200 transition-all text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-opacity opacity-0 group-hover:opacity-100" />
                                    <p className={`text - 4xl font - black mb - 3 tracking - tighter ${stat.color} group - hover: scale - 110 transition - transform duration - 700`}>{stat.value}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white flex flex-col sm:flex-row items-center justify-between gap-10 border border-white/5 relative shadow-2xl shadow-slate-900/40">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="h-16 w-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-xl border border-white/10">
                            <ShieldCheck className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl font-black tracking-tight uppercase">{user?.wallet_address ? "Ledger Verified Terminal" : "Unverified Identity Node"}</h4>
                            <p className="text-sm font-bold text-slate-400 truncate">{formatLocation(user?.address)}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                {user?.wallet_address
                                    ? `Terminal ID ${user.wallet_address} is cryptographically linked to the AgriTrack ledger.`
                                    : "Connect your Web3 wallet to authorize smart-contract settlements and immutable audits."}
                            </p>
                        </div>
                    </div>
                    {user?.wallet_address ? (
                        <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shrink-0 relative z-10">
                            AUDIT PUBLIC REGISTRY
                        </button>
                    ) : (
                        <button
                            onClick={handleLinkWallet}
                            className="px-10 py-5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 hover:bg-white hover:text-emerald-600 transition-all active:scale-95 shrink-0 relative z-10"
                        >
                            CONNECT NOW
                        </button>
                    )}
                </div>
            </div>
        </RetailerLayout>
    );
}
