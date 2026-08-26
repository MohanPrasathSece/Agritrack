import { useState } from "react";
import { Mail, MapPin, Phone, ShieldCheck, Zap, Globe, MessageSquare, ArrowRight, Loader2, Send } from "lucide-react";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <LandingNavbar />

            {/* Hero Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/5 to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-emerald-500/5 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
            </div>

            <section className="pt-48 pb-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-24">
                        <div className="space-y-8 max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mx-auto lg:mx-0">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Global Support Protocol Active
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                                Terminal <span className="text-emerald-500">Node,</span> <br />
                                Connect.
                            </h1>
                            <p className="text-xl font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                Initiate contact with the Agritrack core development team or regional logistic hubs for high-integrity assistance.
                            </p>
                        </div>

                        <div className="hidden lg:flex items-center gap-6 bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Response Latency</p>
                                <p className="text-xl font-black text-slate-800 tracking-tighter">Avg. 14 min</p>
                            </div>
                            <div className="h-12 w-px bg-slate-100" />
                            <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-900/20">
                                <Zap className="w-7 h-7 text-emerald-400 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
                        {/* Sidebar Information */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="space-y-6">
                                {[
                                    { icon: Mail, label: 'Digital Channel', val: 'hello@agritrack.io', color: 'bg-blue-500' },
                                    { icon: Phone, label: 'Voice Frequency', val: '+91 98765 43210', color: 'bg-emerald-500' },
                                    { icon: MapPin, label: 'Regional Sector', val: 'Remote First, India', color: 'bg-indigo-500' }
                                ].map((item, idx) => (
                                    <div key={idx} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 flex items-center gap-8">
                                        <div className={`w-16 h-16 rounded-[1.5rem] ${item.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">{item.label}</p>
                                            <p className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-widest">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-900 rounded-[3.5rem] p-10 relative overflow-hidden text-center lg:text-left shadow-2xl shadow-emerald-900/40 border border-white/5">
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent" />
                                <div className="relative z-10 space-y-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 backdrop-blur-md">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Network Integrity</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                                        All communications are encrypted and logged with cryptographic timestamps for decentralized audit compliance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Terminal */}
                        <div className="lg:col-span-3">
                            {submitted ? (
                                <div className="bg-white rounded-[4rem] p-16 lg:p-24 text-center shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="relative z-10">
                                        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/30 scale-110 animate-bounce">
                                            <ShieldCheck className="w-12 h-12 text-white" />
                                        </div>
                                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">Node Synced!</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Transmission successfully written to ledger</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                                        >
                                            Initiate New Link
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[4rem] p-10 lg:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[80px]" />

                                    <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-500 border border-slate-100">
                                                <MessageSquare className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Message Transmission Node</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Entity Identity</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    placeholder="ENTER NAME..."
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all uppercase tracking-tight"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Communication Node</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    placeholder="YOU@EXAMPLE.COM"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all uppercase tracking-tight"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Payload Content</label>
                                            <textarea
                                                required
                                                rows={6}
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                placeholder="HOW CAN THE CORE HUB ASSIST?"
                                                className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] py-8 px-10 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all uppercase tracking-tight resize-none leading-relaxed"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-6 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                                            ) : (
                                                <>
                                                    TRANSMIT PAYLOAD <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-center justify-center gap-4 opacity-40">
                                            <div className="h-px bg-slate-300 flex-grow" />
                                            <Globe className="w-4 h-4 text-slate-400" />
                                            <div className="h-px bg-slate-300 flex-grow" />
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default Contact;
