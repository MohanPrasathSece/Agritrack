import React, { useState, useEffect, useCallback } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Search, ShoppingCart, Eye, Wheat, MapPin, Filter, ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { retailerApi } from "../../utils/api";
import { formatLocation } from "../../utils/format";

export default function RetailerMarketplace() {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Types");

    const fetchCrops = useCallback(async () => {
        try {
            setLoading(true);
            const params = selectedCategory !== "All Types" ? { category: selectedCategory.toLowerCase() } : {};
            const response = await retailerApi.getMarketplace(params);
            if (response.data.success) {
                setCrops(response.data.data.crops || []);
            }
        } catch (err) {
            console.error("Marketplace fetch error:", err);
            // Set dummy data for demonstration
            const dummyCrops = [
                {
                    id: '1',
                    name: 'Premium Basmati Rice',
                    variety: '1121 Basmati',
                    quantity: 1500,
                    unit: 'KG',
                    price_per_unit: 85,
                    status: 'Listed',
                    farmer: { name: 'Mohan Kumar' },
                    farm_location: {
                        full_address: 'Farm No. 42, Pollachi Road, Coimbatore District',
                        city: 'Pollachi',
                        state: 'Tamil Nadu'
                    },
                    pickup_address: 'Market Yard, Pollachi - 642001'
                },
                {
                    id: '2',
                    name: 'Organic Wheat',
                    variety: 'Durum Wheat',
                    quantity: 2000,
                    unit: 'KG',
                    price_per_unit: 42,
                    status: 'Listed',
                    farmer: { name: 'Rajesh Kumar' },
                    farm_location: {
                        full_address: 'Anamalai Farms, Pollachi',
                        city: 'Pollachi',
                        state: 'Tamil Nadu'
                    },
                    pickup_address: 'Anamalai Road, Pollachi - 642001'
                },
                {
                    id: '3',
                    name: 'Fresh Brinjal',
                    variety: 'Long Purple',
                    quantity: 400,
                    unit: 'KG',
                    price_per_unit: 25,
                    status: 'Listed',
                    farmer: { name: 'Senthil Kumar' },
                    farm_location: {
                        full_address: 'Gandhipuram Farm, Coimbatore',
                        city: 'Coimbatore',
                        state: 'Tamil Nadu'
                    },
                    pickup_address: 'Gandhipuram Market, Coimbatore - 641018'
                }
            ];
            setCrops(dummyCrops);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchCrops();
    }, [fetchCrops]);

    const filteredCrops = crops.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Marketplace</h1>
                    <p className="text-sm text-slate-500 mt-1">Browse and procure verified crops from the regional network.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Queue</p>
                        <p className="text-sm font-bold text-slate-900">Empty</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search crops, variety, or farmer..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-3">
                    <div className="relative min-w-[160px]">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full h-full px-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 outline-none appearance-none cursor-pointer hover:border-emerald-500/20 transition-all shadow-sm"
                        >
                            <option>All Types</option>
                            <option>Grains</option>
                            <option>Vegetables</option>
                            <option>Pulses</option>
                            <option>Fruits</option>
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                    </div>
                    <button
                        onClick={fetchCrops}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 transition-all hover:bg-slate-50 shadow-sm"
                    >
                        <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Finding available inventory...</p>
                </div>
            ) : (
                <>
                    {filteredCrops.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCrops.map((crop) => (
                                <div key={crop.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={crop.images?.[0]?.url || crop.images?.[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800"}
                                            alt={crop.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <StatusBadge status={crop.is_organic ? "Organic" : "Standard"} />
                                            <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                                {crop.quality?.grade || 'GRADE A+'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800 tracking-tight capitalize">{crop.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-emerald-500" /> {formatLocation(crop.farm_location)}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Quantity</p>
                                                <p className="text-sm font-semibold text-slate-800">{crop.quantity} {crop.unit}</p>
                                            </div>
                                            <div className="border-l border-slate-200 pl-4">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</p>
                                                <p className="text-sm font-bold text-emerald-600">₹{crop.price_per_unit}</p>
                                            </div>
                                        </div>

                                        {/* Pickup Address */}
                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                            <p className="text-[9px] text-blue-600 uppercase font-bold tracking-wider mb-1">Pickup Location</p>
                                            <p className="text-[9px] text-blue-800 font-medium leading-tight">{crop.pickup_address || 'Market Yard, Pollachi - 642001'}</p>
                                        </div>

                                        <div className="flex flex-col gap-2 pt-2 mt-auto">
                                            <button
                                                onClick={() => navigate(`/retailer/order?crop=${crop.id}`)}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white uppercase tracking-wider transition-all hover:bg-emerald-600 shadow-sm active:scale-95"
                                            >
                                                Buy Now <ArrowRight className="h-4 w-4" />
                                            </button>
                                            <Link
                                                to={`/retailer/traceability?crop=${crop.id}`}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider transition-all hover:bg-slate-50 hover:text-slate-800 active:scale-95"
                                            >
                                                <Eye className="h-4 w-4" /> Traceability
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center space-y-6 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mx-auto border border-dashed border-slate-200">
                                <Wheat className="w-8 h-8 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-800">No Inventory Found</h3>
                                <p className="text-sm text-slate-400">Try adjusting your filters or search keywords.</p>
                            </div>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory("All Types"); }}
                                className="px-8 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
