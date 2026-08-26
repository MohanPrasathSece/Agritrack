import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { MapPin, QrCode, Eye, X, Wheat, Search, Filter, Loader2, Package, Calendar, User, ShieldCheck, ShoppingCart, Image as ImageIcon, AlertCircle, Store, Phone, HeadphonesIcon } from "lucide-react";
import { formatLocation } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import { aggregatorApi } from "../../utils/api";
import { t } from "../../utils/translation";
import ContactSupport from "../../components/ContactSupport";
import QRCode from "qrcode";
// Import crop images
import brinjalImg from "../../components/farmer/crops/brinjal.jpg";
import carrotImg from "../../components/farmer/crops/carrot.jpg";
import greenChillyImg from "../../components/farmer/crops/green chilly.jpg";
import potatoImg from "../../components/farmer/crops/potato.jpg";
import redChillyImg from "../../components/farmer/crops/red chilly.jpg";
import riceImg from "../../components/farmer/crops/rice.jpg";
import wheatImg from "../../components/farmer/crops/wheat.jpg";

export default function AggregatorCollections() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("available");
    const [crops, setCrops] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [error, setError] = useState(null);
    const [showContactSupport, setShowContactSupport] = useState(false);
    const [aggregatorInventory, setAggregatorInventory] = useState([]);

    // Farmer crops data (same as farmer dashboard)
    const FARMER_CROPS = [
        { 
            id: '1', 
            name: 'Premium Basmati Rice', 
            price_per_unit: 85, 
            quantity: 1500, 
            unit: 'KG', 
            status: 'Listed', 
            image: { url: riceImg },
            farmer: 'Ramesh Kumar',
            location: 'Punjab',
            rating: 4.8,
            quality: 'A+',
            orders: 12,
            category: 'Grains',
            organic: true,
            certified: true,
            trending: false
        },
        { 
            id: '2', 
            name: 'Organic Wheat', 
            price_per_unit: 42, 
            quantity: 2000, 
            unit: 'KG', 
            status: 'Listed', 
            image: { url: wheatImg },
            farmer: 'Sunita Devi',
            location: 'Haryana',
            rating: 4.6,
            quality: 'A',
            orders: 8,
            category: 'Grains',
            organic: true,
            certified: false,
            trending: false
        },
        { 
            id: '3', 
            name: 'Fresh Brinjal', 
            price_per_unit: 25, 
            quantity: 400, 
            unit: 'KG', 
            status: 'Listed', 
            image: { url: brinjalImg },
            farmer: 'Mohan Singh',
            location: 'Uttar Pradesh',
            rating: 4.5,
            quality: 'A',
            orders: 15,
            category: 'Vegetables',
            organic: false,
            certified: false,
            trending: true
        },
        { 
            id: '4', 
            name: 'Sweet Carrots', 
            price_per_unit: 35, 
            quantity: 800, 
            unit: 'KG', 
            status: 'Listed', 
            image: { url: carrotImg },
            farmer: 'Priya Sharma',
            location: 'Rajasthan',
            rating: 4.7,
            quality: 'A+',
            orders: 20,
            category: 'Vegetables',
            organic: true,
            certified: true,
            trending: false
        },
        { 
            id: '5', 
            name: 'Green Chilly', 
            price_per_unit: 120, 
            quantity: 300, 
            unit: 'KG', 
            status: 'Listed', 
            image: { url: greenChillyImg },
            farmer: 'Amit Patel',
            location: 'Gujarat',
            rating: 4.9,
            quality: 'A+',
            orders: 25,
            category: 'Vegetables',
            organic: false,
            certified: true,
            trending: true
        },
        { 
            id: '6', 
            name: 'Quality Potatoes', 
            price_per_unit: 20, 
            quantity: 2500, 
            unit: 'KG', 
            status: 'Listed', 
            image: { url: potatoImg },
            farmer: 'Lakshmi Narayan',
            location: 'West Bengal',
            rating: 4.4,
            quality: 'B+',
            orders: 18,
            category: 'Vegetables',
            organic: false,
            certified: false,
            trending: false
        },
        { 
            id: '7', 
            name: 'Red Chilly (Guntur)', 
            price_per_unit: 140, 
            quantity: 500, 
            unit: 'KG', 
            status: 'Sold', 
            image: { url: redChillyImg },
            farmer: 'Vijay Kumar',
            location: 'Andhra Pradesh',
            rating: 4.8,
            quality: 'A+',
            orders: 30,
            category: 'Vegetables',
            organic: true,
            certified: true,
            trending: true
        }
    ];

    // Load inventory from localStorage
    useEffect(() => {
        const savedInventory = localStorage.getItem('aggregatorInventory');
        if (savedInventory) {
            setAggregatorInventory(JSON.parse(savedInventory));
        }
    }, []);

    // Save inventory to localStorage
    const saveInventory = (inventory) => {
        setAggregatorInventory(inventory);
        localStorage.setItem('aggregatorInventory', JSON.stringify(inventory));
    };

    const handleBuyCrop = (crop) => {
        // Add crop to aggregator inventory
        const existingIndex = aggregatorInventory.findIndex(item => item.id === crop.id);
        let updatedInventory;
        
        if (existingIndex >= 0) {
            // Update existing item
            updatedInventory = [...aggregatorInventory];
            updatedInventory[existingIndex] = {
                ...updatedInventory[existingIndex],
                quantity: updatedInventory[existingIndex].quantity + crop.quantity,
                purchasePrice: crop.price_per_unit,
                sellingPrice: crop.price_per_unit * 1.2 // 20% markup
            };
        } else {
            // Add new item
            updatedInventory = [...aggregatorInventory, {
                ...crop,
                purchasePrice: crop.price_per_unit,
                sellingPrice: crop.price_per_unit * 1.2, // 20% markup
                purchasedQuantity: crop.quantity,
                availableQuantity: crop.quantity
            }];
        }
        
        saveInventory(updatedInventory);
        
        // Mark crop as purchased
        setCrops(prevCrops => prevCrops.filter(c => c.id !== crop.id));
        
        alert(`Successfully purchased ${crop.name} - ${crop.quantity} ${crop.unit}!`);
    };

    useEffect(() => {
        fetchAvailableCrops();
        fetchMyCollections();
    }, []);

    const fetchAvailableCrops = async () => {
        try {
            setLoading(true);
            // Use farmer crops data
            setTimeout(() => {
                setCrops(FARMER_CROPS.filter(crop => crop.status === 'Listed'));
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error("Available crops fetch error:", err);
            setError(t('somethingWentWrong'));
            setLoading(false);
        }
    };

    const fetchMyCollections = async () => {
        try {
            // Try API first, fallback to dummy data
            try {
                const response = await aggregatorApi.getMyCollections();
                if (response.data.success) {
                    setCollections(response.data.data.collections || []);
                } else {
                    throw new Error('API failed');
                }
            } catch (apiError) {
                console.log('API failed, fallback to empty array:', apiError);
                setCollections([]);
            }
        } catch (err) {
            console.error("Collections fetch error:", err);
        }
    };

    const generateQRCode = async (collectionId) => {
        try {
            const qrData = JSON.stringify({
                collectionId,
                timestamp: new Date().toISOString(),
                aggregator: "Agritrack"
            });
            const url = await QRCode.toDataURL(qrData);
            setQrCodeUrl(url);
            setShowQR(true);
        } catch (err) {
            console.error("QR generation error:", err);
        }
    };

    const filteredCrops = crops.filter(crop =>
        crop.name.toLowerCase().includes(search.toLowerCase()) ||
        crop.farmer?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredCollections = collections.filter(col =>
        (col.source_crop?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        col.farmer?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading collections...</p>
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
                    onClick={fetchAvailableCrops}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">{t('aggregator')} {t('collections')}</h1>
                    <p className="text-sm text-slate-500">{t('buyFromFarmers')} {t('and')} {t('manageInventory')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowContactSupport(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        {t('contactSupport')}
                    </button>
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('search') + ' ' + t('crops') + ' ' + t('or') + ' ' + t('farmers') + '...'}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                <button
                    onClick={() => setActiveTab("available")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <Package className="w-4 h-4" />
                    Available Crops ({crops.length})
                </button>
                <button
                    onClick={() => setActiveTab("collected")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "collected"
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    My Collections ({aggregatorInventory.length})
                </button>
            </div>

            {activeTab === "available" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCrops.length > 0 ? filteredCrops.map((crop) => (
                        <div key={crop.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-emerald-100/50 transition-all">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <Wheat className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <StatusBadge status={crop.status} />
                                </div>

                                {/* Product Image */}
                                <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-4">
                                    <img 
                                        src={crop.image.url} 
                                        alt={crop.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400";
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-slate-900">{crop.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{crop.quality}</span>
                                        <span>{crop.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-600">₹{crop.price_per_unit}</p>
                                            <p className="text-xs text-slate-500">per {crop.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-medium text-slate-900">{crop.quantity}</p>
                                            <p className="text-xs text-slate-500">{crop.unit} available</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Farmer Info */}
                                <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                                    <User className="w-4 h-4" />
                                    <span>{crop.farmer}</span>
                                    <MapPin className="w-4 h-4 ml-auto" />
                                    <span>{formatLocation(crop.location)}</span>
                                </div>

                                {/* Buy Button */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleBuyCrop(crop)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-12">
                            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Crops Available</h3>
                            <p className="text-sm text-slate-500">Check back later for new crop listings from farmers</p>
                        </div>
                    )}
                </div>
            )}

            {/* My Collections Tab - Show Aggregator Inventory */}
            {activeTab === "collected" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aggregatorInventory.length > 0 ? aggregatorInventory.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                                        <Package className="h-6 w-6 text-slate-600" />
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg">
                                        In Stock
                                    </span>
                                </div>

                                {/* Product Image */}
                                <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-4">
                                    <img 
                                        src={item.image.url} 
                                        alt={item.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400";
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{item.quality}</span>
                                        <span>{item.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-600">₹{item.sellingPrice}</p>
                                            <p className="text-xs text-slate-500">per {item.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-medium text-slate-900">{item.availableQuantity || item.quantity}</p>
                                            <p className="text-xs text-slate-500">{item.unit} in stock</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Purchase Info */}
                                <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                                    <span>Purchased: ₹{item.purchasePrice}/{item.unit}</span>
                                    <span className="ml-auto">From: {item.farmer}</span>
                                </div>

                                {/* Sell Button */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/aggregator/retailer-marketplace', { state: { inventoryItem: item } })}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        <Store className="w-4 h-4" />
                                        Sell to Retailers
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-12">
                            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Inventory Yet</h3>
                            <p className="text-sm text-slate-500">Start buying crops from farmers to build your inventory</p>
                        </div>
                    )}
                </div>
            )}

            {/* Contact Support Modal */}
            {showContactSupport && (
                <ContactSupport 
                    isOpen={showContactSupport} 
                    onClose={() => setShowContactSupport(false)} 
                />
            )}
        </div>
    );
}
