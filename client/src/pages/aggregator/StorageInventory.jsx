import React, { useState } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Plus, Thermometer, Droplets, MapPin, Search, Filter, Warehouse, Package, ArrowUpRight, ChevronRight, X, ArrowLeft, Activity, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatLocation } from "../../utils/format";

const inventoryData = [
    { id: 1, crop: "Basmati Rice", quantity: "1,200 kg", grade: "Grade A", location: "Warehouse A", status: "available", icon: Warehouse },
    { id: 2, crop: "Durum Wheat", quantity: "800 kg", grade: "Grade B", location: "Warehouse A", status: "available", icon: Warehouse },
    { id: 3, crop: "Yellow Maize", quantity: "650 kg", grade: "Grade A", location: "Warehouse B", status: "available", icon: Warehouse },
    { id: 4, crop: "Soybean", quantity: "400 kg", grade: "Grade A", location: "Cold Storage", status: "available", icon: Warehouse },
    { id: 5, crop: "Long Staple Cotton", quantity: "1,200 kg", grade: "Grade B", location: "Warehouse B", status: "paused", icon: Warehouse },
];

export default function StorageInventory() {
    const navigate = useNavigate();
    const [logOpen, setLogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);

    const filteredInventory = inventoryData.filter(item =>
        item.crop.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogEntry = (e) => {
        e.preventDefault();
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setLogOpen(false);
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
                        <h1 className="text-2xl text-slate-900 tracking-tight font-bold">My Inventory</h1>
                        <p className="text-sm text-slate-500">View and manage all crops stored in your facilities.</p>
                    </div>
                </div>
                <button
                    onClick={() => setLogOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4 text-emerald-500" /> Add to Storage
                </button>
            </div>

            {/* Storage Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Thermometer, label: "Temperature", value: "24.2°C", trend: "Stable", color: "blue" },
                    { icon: Droplets, label: "Humidity", value: "45.8%", trend: "Balanced", color: "emerald" },
                    { icon: MapPin, label: "Storage Facilities", value: "3 Active", trend: "Active Locations", color: "indigo" },
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className={`p-5 rounded-[24px] bg-${item.color}-50 border border-${item.color}-100 group-hover:bg-slate-900 transition-all duration-300`}>
                                <item.icon className={`h-6 w-6 text-${item.color}-600 group-hover:text-white transition-colors`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">{item.value}</h3>
                                <p className={`text-[9px] font-bold text-${item.color}-600 uppercase tracking-widest mt-1`}>{item.trend}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search inventory by crop name..."
                        className="w-full rounded-[24px] border border-slate-100 bg-white py-5 pl-16 pr-8 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all shadow-sm"
                    />
                </div>
                <button className="px-8 flex items-center justify-center rounded-[24px] bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                    <Filter className="h-5 w-5 mr-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Filter Records</span>
                </button>
            </div>

            {/* Inventory Ledger Table */}
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden group">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Crop Name</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Total Quantity</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Quality</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="group/row hover:bg-slate-50/50 transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover/row:bg-slate-900 group-hover/row:border-slate-900 transition-all">
                                                <Package className="w-5 h-5 text-slate-400 group-hover/row:text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 transition-colors group-hover/row:text-emerald-600">{item.crop}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className="text-sm font-bold text-slate-600">{item.quantity}</span>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl border border-emerald-100 uppercase tracking-widest">
                                            {item.grade}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                            {formatLocation(item.location)}
                                        </div>
                                    </td>
                                    <td className="p-8"><StatusBadge status={item.status} /></td>
                                    <td className="p-8 text-right">
                                        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all active:scale-95">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Storage Entry Modal */}
            {logOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500 relative">
                        <div className="p-12 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl text-slate-900 font-bold tracking-tight">Add New Storage Record</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update your storage inventory</p>
                                </div>
                                <button
                                    onClick={() => setLogOpen(false)}
                                    className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleLogEntry} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Storage Facility Name</label>
                                        <input className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all" placeholder="e.g. NASHIK_WAREHOUSE_04" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Temperature (°C)</label>
                                            <input type="number" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all" placeholder="24" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Humidity (%)</label>
                                            <input type="number" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all" placeholder="45" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Crop Name</label>
                                        <div className="relative">
                                            <select className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-5 px-8 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all appearance-none cursor-pointer">
                                                <option>Premium Basmati Rice</option>
                                                <option>Durum Wheat Grain</option>
                                                <option>Organic Yellow Maize</option>
                                                <option>Soybean High Grade</option>
                                            </select>
                                            <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity (KG)</label>
                                        <input type="number" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all" placeholder="5000" required />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSyncing}
                                        className="flex-1 inline-flex items-center justify-center gap-4 rounded-[28px] bg-slate-900 px-10 py-6 text-[10px] font-bold text-white uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                                        {isSyncing ? "Saving..." : "Save Record"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLogOpen(false)}
                                        className="px-10 rounded-[28px] bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-all"
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
