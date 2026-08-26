import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Plus, Pencil, Pause, Play, Store, TrendingUp, DollarSign, X, CheckCircle2, ArrowLeft, Activity, Sparkles, Box, ShieldCheck, ChevronRight, Loader2, Package, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aggregatorApi } from "../../utils/api";

export default function RetailerMarketplaceImproved() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newOpen, setNewOpen] = useState(false);
    const [priceOpen, setPriceOpen] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const response = await aggregatorApi.getRetailerListings();
            if (response.data.success) {
                setListings(response.data.data.listings || []);
            } else {
                setError("Failed to load listings");
            }
        } catch (err) {
            console.error("Listings fetch error:", err);
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const togglePause = (id) => {
        setListings(prev => prev.map(l =>
            l.id === id ? { ...l, status: l.status === "paused" ? "available" : "paused" } : l
        ));
    };

    const handleUpdatePrice = () => {
        if (priceOpen && newPrice) {
            setListings(prev => prev.map(l =>
                l.id === priceOpen ? { ...l, price: newPrice } : l
            ));
        }
        setPriceOpen(null);
        setNewPrice("");
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        setIsPublishing(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setNewOpen(false);
        } catch (err) {
            console.error("Publish error:", err);
        } finally {
            setIsPublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading marketplace...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-6 text-center border border-slate-200 shadow-sm max-w-md mx-auto mt-20">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
                <p className="text-sm text-slate-600 mb-4">{error}</p>
                <button
                    onClick={fetchListings}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/aggregator/dashboard')}
                        className="p-2 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Retailer Marketplace</h1>
                        <p className="text-sm text-slate-500">Sell to retailers and manage your inventory</p>
                    </div>
                </div>
                <button
                    onClick={() => setNewOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                    <Plus className="w-4 h-4 text-emerald-500" /> Add Listing
                </button>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Market Sentiment", value: "Bullish", trend: "+12.4%", icon: TrendingUp, color: "emerald" },
                    { label: "Retailers", value: "42", trend: "8 pending", icon: Store, color: "blue" },
                    { label: "Inventory", value: "1,245 kg", trend: "In stock", icon: Box, color: "indigo" },
                    { label: "Revenue", value: "₹45.2L", trend: "This month", icon: DollarSign, color: "slate" },
                ].map((item, i) => (
                    <div key={i} className={`bg-white rounded-lg p-4 border border-${item.color}-50 shadow-sm hover:shadow-md transition-all`}>
                        <div className={`p-2 rounded-lg bg-${item.color}-50 border border-${item.color}-100 w-fit`}>
                            <item.icon className={`h-4 w-4 text-${item.color}-600`} />
                        </div>
                        <div className="space-y-1 mt-3">
                            <p className="text-xs font-medium text-slate-500">{item.label}</p>
                            <h3 className="text-lg font-bold text-slate-900">{item.value}</h3>
                            <p className={`text-xs font-medium text-${item.color}-600`}>{item.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Marketplace Grid */}
            {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                            <div className="p-4 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                                        <Package className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>

                                {/* Product Image */}
                                <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-4">
                                    {item.images && item.images.length > 0 ? (
                                        <img 
                                            src={item.images[0]} 
                                            alt={item.cropName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-slate-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 capitalize">{item.cropName}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{item.grade}</span>
                                        <span className="text-xs text-slate-500">In Stock: {item.quantity}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto pt-4">
                                    <span className="text-lg font-semibold text-slate-300">₹</span>
                                    <span className="text-2xl font-bold text-slate-900">{item.price}</span>
                                    <span className="text-xs text-slate-400 self-end">/ {item.unit || 'kg'}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => setPriceOpen(item.id)}
                                        className="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 text-xs font-medium text-white rounded-lg hover:bg-slate-800 transition-colors"
                                    >
                                        <Pencil className="h-4 w-4 text-emerald-500" /> Update Price
                                    </button>
                                    <button
                                        onClick={() => togglePause(item.id)}
                                        className={`flex items-center justify-center rounded-lg transition-colors border border-slate-100 ${
                                            item.status === "paused"
                                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                : "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                        }`}
                                    >
                                        {item.status === "paused" ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-200">
                    <Store className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Listings Yet</h3>
                    <p className="text-slate-500">Start by adding crops from your collections</p>
                    <button
                        onClick={() => setNewOpen(true)}
                        className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Add Your First Listing
                    </button>
                </div>
            )}

            {/* New Listing Modal */}
            {newOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-md overflow-y-auto">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Add New Listing</h2>
                                <button
                                    onClick={() => setNewOpen(false)}
                                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100"
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handlePublish} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Crop Type</label>
                                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option>Basmati Rice</option>
                                        <option>Durum Wheat</option>
                                        <option>Yellow Maize</option>
                                        <option>Soybean</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Grade</label>
                                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                            <option>Grade A</option>
                                            <option>Grade B</option>
                                            <option>Grade C</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Quantity (kg)</label>
                                        <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="500" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Price (₹ per kg)</label>
                                    <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="42" required />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isPublishing}
                                        className="flex-1 bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4 text-emerald-500" />}
                                        {isPublishing ? "Creating..." : "Publish Listing"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewOpen(false)}
                                        className="px-6 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Price Update Modal */}
            {priceOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-sm overflow-y-auto">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-lg font-semibold">Update Price</h2>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">New Price (₹ per unit)</label>
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-lg font-semibold text-emerald-600 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="42"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleUpdatePrice} className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                                    Update
                                </button>
                                <button onClick={() => setPriceOpen(null)} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
