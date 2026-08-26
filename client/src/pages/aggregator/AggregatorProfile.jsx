import React, { useState, useEffect } from "react";
import { Camera, MapPin, Phone, Mail, Warehouse, ShieldCheck, Edit3, Save, X, Loader2, AlertCircle, Building, QrCode, Pencil, Check, ExternalLink, TrendingUp, Users, Package, Store, Star, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { aggregatorApi } from "../../utils/api";
import { formatLocation } from "../../utils/format";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/v1';

export default function AggregatorProfile() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        enterpriseName: '',
        license: '',
        fullAddress: ''
    });

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || 'Mohan Prasath',
                phone: user.phone || '9025421149',
                enterpriseName: user.aggregator_details?.enterpriseName || 'Mohan Agri Logistics - Coimbatore',
                license: user.aggregator_details?.license || 'AGR-CBE-2026-X',
                fullAddress: user.address?.fullAddress || 'Warehouse Complex, Pollachi Main Road, Near Anamalai Hills, Coimbatore District, Tamil Nadu - 642001'
            });
        }
    }, [user]);

    // Removed formatAddress as formatLocation will be used
    // const formatAddress = (addr) => {
    //     if (typeof addr === 'string') return addr;
    //     if (!addr) return 'Regional Logistics Node';
    //     const { village, district, state, pincode, fullAddress } = addr;
    //     if (fullAddress) return fullAddress;
    //     return [village, district, state, pincode].filter(Boolean).join(', ');
    // };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await aggregatorApi.put(`/ users / profile`, { // Changed axios.put to aggregatorApi.put
                email: user.email,
                name: editForm.name,
                phone: editForm.phone,
                address: {
                    ...(typeof user.address === 'object' ? user.address : {}),
                    fullAddress: editForm.fullAddress
                },
                aggregator_details: {
                    ...user.aggregator_details,
                    enterpriseName: editForm.enterpriseName,
                    license: editForm.license
                }
            });

            if (response.data.success) {
                setEditOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Profile update error:", error);
            alert("Failed to update enterprise profile");
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadReport = () => {
        setLoading(true);
        // Simulate PDF generation/download
        setTimeout(() => {
            const reportContent = `
                AGRITRACK TRUST REPORT
                ----------------------
                Enterprise: ${editForm.enterpriseName}
                License: ${editForm.license}
                Location: Coimbatore, Tamil Nadu
                Trust Rating: 9.8 / 10
                Performance: Excellent
                Verified Crops: 1,245
                Farmer Network: 84 active
                Store Partners: 12
                
                Generated on: ${new Date().toLocaleString()}
            `.trim();
            
            const blob = new Blob([reportContent], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Agritrack_Trust_Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setLoading(false);
            alert("Trust Report downloaded successfully!");
        }, 1500);
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
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
                        <h1 className="text-xl md:text-2xl text-slate-900 tracking-tight font-bold">Business Profile</h1>
                        <p className="text-xs md:text-sm text-slate-500">Manage your business details and view performance records.</p>
                    </div>
                </div>
                <button
                    onClick={() => setEditOpen(true)}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-[10px] font-bold text-white uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
                >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Identity Area */}
                <div className="lg:col-span-8 space-y-8 md:space-y-10">
                    {/* Primary Identity Card */}
                    <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
                            <div className="shrink-0">
                                <div className="h-32 w-32 rounded-[40px] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                                    <Store className="h-12 w-12 text-slate-900 relative z-10" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">{user?.aggregator_details?.enterpriseName || "Mohan Agri Logistics - Coimbatore"}</h2>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                                            <ShieldCheck className="w-3 h-3" /> Verified Business
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                                        Active aggregator providing support and transport for local farms and connecting them to retail stores.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                    {[
                                        { icon: QrCode, label: "Business License", value: user?.aggregator_details?.license || "AGR-CBE-2026-X" },
                                        { icon: MapPin, label: "Business Location", value: typeof user?.address === 'object' ? (user?.address?.fullAddress || user?.address?.full_address || "Warehouse Complex, Pollachi Main Road, Near Anamalai Hills, Coimbatore District, Tamil Nadu - 642001") : (user?.address || "Warehouse Complex, Pollachi Main Road, Near Anamalai Hills, Coimbatore District, Tamil Nadu - 642001") },
                                        { icon: Phone, label: "Phone Number", value: user?.phone || "9025421149" },
                                        { icon: Mail, label: "Email Address", value: user?.email || "mohan@cropconnect.com" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-emerald-500 transition-colors">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                                                {/* Adjusted styling and conditional rendering for formatLocation */}
                                                {item.label === "Business Location" ? (
                                                    <p className="text-sm font-bold text-slate-700 truncate">{item.value}</p>
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-700 truncate">{item.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Decorative Background Pattern */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-slate-50 rounded-full group-hover:bg-emerald-50/50 transition-all duration-1000 -z-0" />
                        <Sparkles className="absolute bottom-8 right-8 w-12 h-12 text-slate-100 group-hover:text-emerald-100 transition-colors duration-1000" />
                    </div>

                    {/* Stats/Action Banner */}
                    <div className="bg-slate-900 rounded-[48px] p-12 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="space-y-4 max-w-md">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Performance Summary</span>
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">Trust Rating: 9.8 / 10</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    You have successfully processed over 1,200 crops from farmers with excellent speed and reliability.
                                </p>
                            </div>
                            <button 
                                onClick={handleDownloadReport}
                                disabled={loading}
                                className="whitespace-nowrap px-10 py-5 bg-white text-slate-900 rounded-[24px] text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-white/10 hover:bg-emerald-50 hover:text-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? 'Preparing...' : 'Download Report'}
                            </button>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-[40px]" />
                    </div>
                </div>

                {/* Sidebar Stats Area */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-10">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Business Overview</h3>
                            <div className="h-1 w-12 bg-emerald-500 rounded-full" />
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: "Farmer Network", value: "84 active", icon: Users, color: "emerald" },
                                { label: "Total Transport", value: "2.4 Metric Tons", icon: Package, color: "blue" },
                                { label: "Store Partners", value: "12 stores", icon: Store, color: "indigo" },
                                { label: "Service Rating", value: "4.7 / 5.0", icon: Star, color: "amber" },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-5 group cursor-default">
                                    <div className={`p - 4 rounded - [20px] bg - ${stat.color} -50 border border - ${stat.color} -100 group - hover: scale - 110 transition - transform duration - 300`}>
                                        <stat.icon className={`h - 5 w - 5 text - ${stat.color} -600`} />
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.label}</p>
                                        <p className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-[40px] p-8 border border-emerald-100 relative overflow-hidden group">
                        <div className="relative z-10 space-y-6 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:rotate-12 transition-transform">
                                <ExternalLink className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-widest">Help & Support</h4>
                                <p className="text-[11px] text-emerald-700/70 font-medium leading-relaxed">
                                    Contact our team for any questions regarding your account or software.
                                </p>
                            </div>
                            <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {editOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500 relative">
                        <div className="p-12 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl text-slate-900 font-bold tracking-tight">Business Details</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update your information</p>
                                </div>
                                <button
                                    onClick={() => setEditOpen(false)}
                                    className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all"
                                            value={editForm.enterpriseName}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, enterpriseName: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">License Number</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all uppercase"
                                            value={editForm.license}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, license: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <input
                                                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Person</label>
                                            <input
                                                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all"
                                            value={editForm.fullAddress}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, fullAddress: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 inline-flex items-center justify-center gap-3 rounded-[24px] bg-slate-900 px-8 py-5 text-[10px] font-bold text-white uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditOpen(false)}
                                        className="px-10 rounded-[24px] bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                    >
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
