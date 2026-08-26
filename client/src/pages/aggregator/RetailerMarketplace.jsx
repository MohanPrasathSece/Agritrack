import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Plus, Pencil, Pause, Play, Store, TrendingUp, DollarSign, X, CheckCircle2, ArrowLeft, Activity, Sparkles, Box, ShieldCheck, ChevronRight, Loader2, Package, Image as ImageIcon, AlertCircle, Phone, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aggregatorApi } from "../../utils/api";
import { t } from "../../utils/translation";
import ContactSupport from "../../components/ContactSupport";
// Import crop images
import brinjalImg from "../../components/farmer/crops/brinjal.jpg";
import carrotImg from "../../components/farmer/crops/carrot.jpg";
import greenChillyImg from "../../components/farmer/crops/green chilly.jpg";
import potatoImg from "../../components/farmer/crops/potato.jpg";
import redChillyImg from "../../components/farmer/crops/red chilly.jpg";
import riceImg from "../../components/farmer/crops/rice.jpg";
import wheatImg from "../../components/farmer/crops/wheat.jpg";

export default function RetailerMarketplace() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newOpen, setNewOpen] = useState(false);
    const [priceOpen, setPriceOpen] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const [showContactSupport, setShowContactSupport] = useState(false);

    // Aggregator inventory products with images
    const INVENTORY_PRODUCTS = [
        {
            id: '1',
            name: 'Premium Basmati Rice',
            quantity: 500,
            unit: 'KG',
            price: 105,
            status: 'available',
            image: riceImg,
            category: 'Grains',
            quality: 'Premium',
            source: 'Ramesh Kumar (Punjab)',
            listedDate: '2026-03-20'
        },
        {
            id: '2',
            name: 'Organic Wheat',
            quantity: 300,
            unit: 'KG',
            price: 52,
            status: 'available',
            image: wheatImg,
            category: 'Grains',
            quality: 'A+',
            source: 'Sunita Devi (Haryana)',
            listedDate: '2026-03-19'
        },
        {
            id: '3',
            name: 'Fresh Brinjal',
            quantity: 150,
            unit: 'KG',
            price: 35,
            status: 'available',
            image: brinjalImg,
            category: 'Vegetables',
            quality: 'A',
            source: 'Mohan Singh (UP)',
            listedDate: '2026-03-18'
        }
    ];

    const DUMMY_INVENTORY = [
        { id: 'dummy_1', name: 'Premium Basmati Rice', availableQuantity: 200, unit: 'KG', purchasePrice: 85, category: 'Grains', quality: 'Premium', farmer: 'Ramesh Kumar', image: riceImg },
        { id: 'dummy_2', name: 'Organic Wheat', availableQuantity: 100, unit: 'KG', purchasePrice: 42, category: 'Grains', quality: 'A+', farmer: 'Sunita Devi', image: wheatImg },
        { id: 'dummy_3', name: 'Fresh Brinjal', availableQuantity: 150, unit: 'KG', purchasePrice: 25, category: 'Vegetables', quality: 'A', farmer: 'Mohan Singh', image: brinjalImg },
        { id: 'dummy_4', name: 'Sweet Carrots', availableQuantity: 300, unit: 'KG', purchasePrice: 35, category: 'Vegetables', quality: 'A+', farmer: 'Priya Sharma', image: carrotImg },
    ];

    const location = React.useRef(window.history.state?.usr); // Alternative to useLocation for simplicity here
    const [collectionToList, setCollectionToList] = useState(null);
    const [formData, setFormData] = useState({
        price: "",
        notes: ""
    });

    useEffect(() => {
        fetchListings();
        // Check for passed state from collections page
        const state = window.history.state?.usr;
        const item = state?.inventoryItem || state?.collectionData;
        if (item) {
            setCollectionToList(item);
            setFormData({
                price: item.purchasePrice ? (item.purchasePrice * 1.2).toFixed(2) : item.sellingPrice || "",
                notes: `Aggregator verified premium ${item.name || item.cropName}`
            });
            setNewOpen(true);
        }
    }, []);

    const fetchListings = async () => {
        try {
            setLoading(true);
            // Use inventory products instead of API
            setTimeout(() => {
                setListings(INVENTORY_PRODUCTS);
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error("Listings fetch error:", err);
            setError(t('somethingWentWrong'));
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
        
        if (!collectionToList) {
            alert("Please select a product");
            return;
        }

        setIsPublishing(true);
        try {
            // Simulate API call for dummy data
            setTimeout(() => {
                const newListing = {
                    id: Math.random().toString(),
                    name: collectionToList.name || collectionToList.cropName,
                    quantity: collectionToList.availableQuantity || collectionToList.purchasedQuantity || 100,
                    unit: collectionToList.unit || 'KG',
                    price: parseFloat(formData.price),
                    status: 'available',
                    image: collectionToList.image?.url || collectionToList.image || riceImg,
                    category: collectionToList.category || 'Commodity',
                    quality: collectionToList.quality || 'A+',
                    source: collectionToList.farmer || 'Local Farm',
                    listedDate: new Date().toISOString().split('T')[0]
                };
                setListings(prev => [newListing, ...prev]);
                setNewOpen(false);
                setCollectionToList(null);
                setFormData({ price: "", notes: "" });
                setIsPublishing(false);
                window.history.replaceState({}, document.title);
            }, 800);
        } catch (err) {
            console.error("Publish error:", err);
            alert("Error listing collection. Please try again.");
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
                    { label: "Revenue", value: "₹19.4k", trend: "This month", icon: DollarSign, color: "slate" },
                ].map((item, i) => (
                    <div key={i} className={`bg-white rounded-lg p-4 border border-slate-50 shadow-sm hover:shadow-emerald-50 transition-all`}>
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
                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="p-4 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <Package className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>

                                {/* Product Image */}
                                <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-4">
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400";
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                                        <p className="text-sm text-slate-500">{item.category} • {item.quality}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-600">₹{item.price}</p>
                                            <p className="text-xs text-slate-500">per {item.unit}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-lg font-medium text-slate-900">{item.quantity} {item.unit}</p>
                                            <p className="text-xs text-slate-500">In stock</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                        <span>Source: {item.source}</span>
                                        <span>Listed: {item.listedDate}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPriceOpen(item.id)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                                        >
                                            <Pencil className="w-3 h-3" />
                                            Price
                                        </button>
                                        <button
                                            onClick={() => togglePause(item.id)}
                                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                item.status === 'paused' 
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                            }`}
                                        >
                                            {item.status === 'paused' ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                                            {item.status === 'paused' ? 'Resume' : 'Pause'}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => navigate('/aggregator/retailer-orders')}
                                        className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors border border-slate-200 border-dashed"
                                    >
                                        <ClipboardList className="w-4 h-4 text-emerald-600" />
                                        See Orders
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Products Listed</h3>
                    <p className="text-sm text-slate-500 mb-6">Start by adding your first product to the marketplace</p>
                    <button
                        onClick={() => setNewOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Product
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
                                {collectionToList ? (
                                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Selected Product</p>
                                            <p className="text-sm font-bold text-slate-900">{collectionToList.name || collectionToList.cropName}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Bought @</p>
                                                <p className="text-sm font-bold text-slate-700">₹{collectionToList.purchasePrice}/{collectionToList.unit || 'KG'}</p>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setCollectionToList(null)}
                                                className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                                            >
                                                <X className="w-3 h-3 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 mb-4">
                                        <label className="block text-sm font-medium text-slate-700">Select product from inventory</label>
                                        <select 
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            onChange={(e) => {
                                                const selected = DUMMY_INVENTORY.find(item => item.id === e.target.value);
                                                if (selected) {
                                                    setCollectionToList(selected);
                                                    setFormData({
                                                        ...formData,
                                                        price: (selected.purchasePrice * 1.2).toFixed(2),
                                                        notes: `Aggregator verified premium ${selected.name}`
                                                    });
                                                }
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>-- Select available product --</option>
                                            {DUMMY_INVENTORY.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name} - {item.availableQuantity}{item.unit} available (Bought at ₹{item.purchasePrice})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Selling Price (₹ per {collectionToList?.unit || 'kg'})</label>
                                    <input 
                                        type="number" 
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                        placeholder="42" 
                                        required 
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium italic">Suggested markup: 15-20% over purchase price</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Description / Market Notes</label>
                                    <textarea 
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]" 
                                        placeholder="e.g. Export quality, ready for retail..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isPublishing || !collectionToList}
                                        className="flex-1 bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                                        {isPublishing ? "Creating..." : "Publish Listing"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewOpen(false);
                                            setCollectionToList(null);
                                            window.history.replaceState({}, document.title);
                                        }}
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
