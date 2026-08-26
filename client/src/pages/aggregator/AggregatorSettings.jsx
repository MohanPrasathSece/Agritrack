import React, { useState } from "react";
import { Globe, Bell, Wallet, Shield, LogOut, Sun, Moon, X, CheckCircle2, Key, ChevronRight, Laptop, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleTranslate from "../../components/GoogleTranslate";

export default function AggregatorSettings() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState("dark");
    const [passwordOpen, setPasswordOpen] = useState(false);
    const { logout } = useAuth();

    const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl text-slate-900 tracking-tight font-bold">System Configuration</h1>
                <p className="text-sm text-slate-500">Configure your enterprise operational parameters and security protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-10">
                    {/* Appearance & Interface */}
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300">
                                {theme === "dark" ? <Sun className="h-5 w-5 text-emerald-500" /> : <Moon className="h-5 w-5 text-emerald-500" />}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Interface Aesthetics</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group/item hover:bg-white transition-all">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Enterprise High-Contrast</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Optimized for logistics terminals</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 ${theme === "dark" ? "bg-slate-900 shadow-lg shadow-slate-900/20" : "bg-slate-200"}`}
                                >
                                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition-transform duration-500 ${theme === "dark" ? "translate-x-[1.75rem]" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-[3] transition-all duration-1000 -z-0" />
                    </div>

                    {/* Localization */}
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm group">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300">
                                <Globe className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Core Localization</h3>
                        </div>
                        <div className="relative z-50">
                            <GoogleTranslate />
                        </div>
                    </div>

                    {/* Security Lattice */}
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm group">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                                <Shield className="h-5 w-5 text-red-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Access Protocol</h3>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={() => setPasswordOpen(true)}
                                className="w-full flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:border-emerald-500/20 transition-all group/btn"
                            >
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-700">Credential Rotation</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Secure hash update protocol</p>
                                </div>
                                <Key className="w-5 h-5 text-slate-300 group-hover/btn:text-emerald-500 transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-all group/btn">
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-700">Neural MFA</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Biometric/Token authentication</p>
                                </div>
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Telemetry Alerts */}
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm group">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300">
                                <Bell className="h-5 w-5 text-indigo-500" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Signal Telemetry</h3>
                        </div>
                        <div className="space-y-3">
                            {["Harvest Intake Synchronizations", "Optical Quality Deviations", "On-Chain Ledger Confirmations", "Economic Settlement Logs"].map((item, i) => (
                                <label key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-transparent cursor-pointer hover:bg-white hover:border-slate-100 transition-all group/label">
                                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{item}</span>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Network Assets */}
                    <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 relative overflow-hidden group">
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <Wallet className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">On-Chain Asset Index</h3>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="p-6 bg-white border border-slate-100 rounded-3xl flex flex-col gap-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Node Public Signature</p>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <code className="text-[11px] font-mono font-bold text-slate-500 truncate bg-slate-50 p-3 rounded-xl border border-slate-100 w-full text-center">0x7a3B29...F4e24D</code>
                                </div>
                            </div>
                            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-900/10">
                                Synchronize Ledger Node
                            </button>
                        </div>
                        <Sparkles className="absolute bottom-10 right-10 w-24 h-24 text-slate-200 opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                    </div>

                    {/* Exit Protocol */}
                    <div className="bg-red-50 rounded-[40px] p-8 border border-red-100 flex flex-col gap-6 items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-red-900 uppercase tracking-widest">Termination Zone</h4>
                            <p className="text-[11px] text-red-700/60 font-medium leading-relaxed max-w-[280px] mx-auto">
                                Securely terminate your current session and encrypt all local relay buffers.
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full bg-red-500 text-white py-5 rounded-3xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-red-600 shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <LogOut className="h-4 w-4" /> Terminate Connection
                        </button>
                    </div>
                </div>
            </div>

            {/* Credential Sync Modal */}
            {passwordOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500 relative">
                        <div className="p-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl text-slate-900 font-bold tracking-tight">Access Rotation</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure Handshake Revision</p>
                                </div>
                                <button
                                    onClick={() => setPasswordOpen(false)}
                                    className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form className="space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Universal Secret</label>
                                        <input type="password" placeholder="••••••••" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Revised Hash Pass-key</label>
                                        <input type="password" placeholder="••••••••" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800" required />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">Revise Protocol</button>
                                    <button onClick={() => setPasswordOpen(false)} className="px-10 rounded-[24px] bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Abort</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
