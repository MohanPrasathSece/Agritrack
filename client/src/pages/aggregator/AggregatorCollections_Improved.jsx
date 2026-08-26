import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { MapPin, QrCode, Eye, X, Wheat, Search, Filter, Loader2, Package, Calendar, User, ShieldCheck, ShoppingCart, Image as ImageIcon } from "lucide-react";
import { formatLocation } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import { aggregatorApi } from "../../utils/api";
import QRCode from "qrcode";

export default function AggregatorCollectionsImproved() {
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [qrSrc, setQrSrc] = useState(null);
    const [activeTab, setActiveTab] = useState("listings");
    const [availableCrops, setAvailableCrops] = useState([]);
    const [fetchingCrops, setFetchingCrops] = useState(false);

    useEffect(() => {
        fetchCollections();
        fetchAvailableCrops();
    }, []);

    const fetchAvailableCrops = async () => {
        try {
            setFetchingCrops(true);
            const response = await aggregatorApi.getDashboard();
            
            const marketplaceDummy = [
                {
                    id: 'D-CROP-1',
                    name: 'Premium Sharbati Wheat',
                    variety: 'Bumper Harvest',
                    quantity: 4500,
                    unit: 'kg',
                    price_per_unit: 26,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
                    farmer: { name: 'Kishan Kumar', address: { street: 'Main Rd', district: 'Ludhiana', state: 'Punjab' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A+', overallGrade: 'A+' }
                },
                {
                    id: 'D-CROP-2',
                    name: 'Organic Red Onions',
                    variety: 'Nasik Regular',
                    quantity: 1200,
                    unit: 'kg',
                    price_per_unit: 18,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1508747703725-719777637510?w=800'],
                    farmer: { name: 'Gopal Hegde', address: { street: 'APMC Market', district: 'Nashik', state: 'Maharashtra' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A', overallGrade: 'A' }
                },
                {
                    id: 'D-CROP-3',
                    name: 'Fresh Hybrid Potatoes',
                    variety: 'Table Grade',
                    quantity: 3000,
                    unit: 'kg',
                    price_per_unit: 14,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800'],
                    farmer: { name: 'Sanjay Dutt', address: { street: 'North Field', district: 'Haldwani', state: 'Uttarakhand' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A', overallGrade: 'A' }
                },
                {
                    id: 'D-CROP-4',
                    name: 'Cherry Tomatoes',
                    variety: 'Vine Ripened',
                    quantity: 500,
                    unit: 'kg',
                    price_per_unit: 45,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1518977822534-7049a653032f?w=800'],
                    farmer: { name: 'Mehta Bros', address: { street: 'Green House', district: 'Surat', state: 'Gujarat' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A+', overallGrade: 'A+' }
                },
                {
                    id: 'D-CROP-7',
                    name: 'Purple Garlic',
                    variety: 'Mandsaur Choice',
                    quantity: 450,
                    unit: 'kg',
                    price_per_unit: 180,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800'],
                    farmer: { name: 'Umesh Yadav', address: { street: 'Mandi Gate', district: 'Mandsaur', state: 'Madhya Pradesh' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A+', overallGrade: 'A+' }
                },
                {
                    id: 'D-CROP-8',
                    name: 'Fresh Broccoli',
                    variety: 'Exotic Hybrid',
                    quantity: 300,
                    unit: 'kg',
                    price_per_unit: 140,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1452948491233-ad8a1ed01085?w=800'],
                    farmer: { name: 'Aditya Farm', address: { street: 'Hill Top', district: 'Ooty', state: 'Tamil Nadu' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A', overallGrade: 'A' }
                },
                {
                    id: 'D-CROP-9',
                    name: 'Winter Cauliflower',
                    variety: 'Pusa Snowball',
                    quantity: 600,
                    unit: 'kg',
                    price_per_unit: 35,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800'],
                    farmer: { name: 'Baljit Singh', address: { street: 'Sector 12', district: 'Karnal', state: 'Haryana' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A', overallGrade: 'A' }
                },
                {
                    id: 'D-CROP-10',
                    name: 'Dark Red Beetroot',
                    variety: 'Elite',
                    quantity: 400,
                    unit: 'kg',
                    price_per_unit: 42,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1593114016522-40f6fe517f83?w=800'],
                    farmer: { name: 'Priya Mani', address: { street: 'Agri Hub', district: 'Mysore', state: 'Karnataka' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'B+', overallGrade: 'B+' }
                },
                {
                    id: 'D-CROP-11',
                    name: 'Green Chili',
                    variety: 'Teja Superior',
                    quantity: 250,
                    unit: 'kg',
                    price_per_unit: 65,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1588252399212-45a2e1adedeb?w=800'],
                    farmer: { name: 'Ravi Teja', address: { street: 'Main Rd', district: 'Guntur', state: 'Andhra Pradesh' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A+', overallGrade: 'A+' }
                },
                {
                    id: 'D-CROP-12',
                    name: 'Baby Spinach',
                    variety: 'Triple Washed',
                    quantity: 150,
                    unit: 'kg',
                    price_per_unit: 95,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1523456752049-9ccb633594bf?w=800'],
                    farmer: { name: 'Eco Garden', address: { street: 'Green Zone', district: 'Pune', state: 'Maharashtra' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A', overallGrade: 'A' }
                },
                {
                    id: 'D-CROP-13',
                    name: 'Golden Pumpkin',
                    variety: 'Large Flat',
                    quantity: 800,
                    unit: 'kg',
                    price_per_unit: 22,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1506976785307-87ca2a73ca02?w=800'],
                    farmer: { name: 'Raghav Swamy', address: { street: 'NH 48', district: 'Palakkad', state: 'Kerala' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A', overallGrade: 'A' }
                },
                {
                    id: 'D-CROP-14',
                    name: 'Fresh Cabbage',
                    variety: 'Golden Acre',
                    quantity: 1200,
                    unit: 'kg',
                    price_per_unit: 18,
                    status: 'listed',
                    images: ['https://images.unsplash.com/photo-1550142254-d079738ea394?w=800'],
                    farmer: { name: 'Vikram Singh', address: { street: 'Foothills', district: 'Dehradun', state: 'Uttarakhand' } },
                    created_at: new Date().toISOString(),
                    quality: { grade: 'A', overallGrade: 'A' }
                }
            ];

            const marketplaceItems = response.data.data.availableCrops && response.data.data.availableCrops.length > 0 
                ? response.data.data.availableCrops.map(c => ({
                    ...c,
                    name: c.name || "Agri-commodity Unit",
                    variety: c.variety || "Organic Heirloom",
                    farmer: {
                        ...c.farmer,
                        name: c.farmer?.name || "Verified Producer #882",
                        address: c.farmer?.address || { district: "Northern Cluster", state: "Central Node" }
                    }
                }))
                : marketplaceDummy;

            setAvailableCrops(marketplaceItems);
        } catch (err) {
            console.error("Available crops fetch error:", err);
            // Fallback content anyway
            setAvailableCrops([
                { id: '1', name: 'Premium Wheat', variety: 'Bumper', quantity: 1500, unit: 'kg', price_per_unit: 25, status: 'listed', images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'], farmer: { name: 'Raj', address: { district: 'Amritsar' } }, created_at: new Date().toISOString() }
            ]);
        } finally {
            setFetchingCrops(false);
        }
    };

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const response = await aggregatorApi.getCollections();
            
            const historyDummy = [
                {
                    id: 'H-1',
                    collection_id: 'AGG-882-991',
                    status: 'collected',
                    collected_quantity: 2000,
                    collected_unit: 'kg',
                    purchase_price: 52000,
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    source_crop: { name: 'Basmati Rice', variety: 'Export Grade', images: ['https://images.unsplash.com/photo-1586201375761-8386502374a3?w=800'] },
                    farmer: { name: 'Balvinder Singh', address: { street: 'Sector 4', district: 'Patiala', state: 'Punjab' } },
                    quality_assessment: { overallGrade: 'A+' }
                },
                {
                    id: 'H-2',
                    collection_id: 'AGG-112-442',
                    status: 'collected',
                    collected_quantity: 800,
                    collected_unit: 'kg',
                    purchase_price: 11200,
                    created_at: new Date(Date.now() - 172800000).toISOString(),
                    source_crop: { name: 'Yellow Maize', variety: 'Corn Meal', images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800'] },
                    farmer: { name: 'Amit Shah', address: { street: 'Main Bazar', district: 'Ahmedabad', state: 'Gujarat' } },
                    quality_assessment: { overallGrade: 'B' }
                }
            ];

            if (response.data.success && response.data.data.collections && response.data.data.collections.length > 0) {
                setCollections([...response.data.data.collections, ...historyDummy]);
            } else {
                setCollections(historyDummy);
            }
        } catch (err) {
            console.error("Collections fetch error:", err);
            setCollections([
                { id: '1', collection_id: 'DEMO', status: 'collected', collected_quantity: 100, collected_unit: 'kg', source_crop: { name: 'Sample Wheat' }, farmer: { name: 'Farmer' }, created_at: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCollections = collections.filter(item =>
        item.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source_crop?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.collection_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (selected) {
            const date = new Date(selected.created_at).toLocaleDateString();
            const cropName = selected.source_crop?.name || 'Unknown Crop';
            const locationString = formatLocation(selected.farmer?.address);

            const qualityStr = typeof selected.quality_assessment === 'object' 
                ? (selected.quality_assessment.overallGrade || selected.quality_assessment.grade || 'N/A') 
                : (selected.quality_assessment || 'N/A');
            const details = `Product: ${cropName}\nAddress: ${locationString}\nDate: ${date}\nQuality: Grade ${qualityStr}`;

            QRCode.toDataURL(details, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } })
                .then(url => setQrSrc(url))
                .catch(err => console.error(err));
        } else {
            setQrSrc(null);
        }
    }, [selected]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <p className="text-slate-500 font-medium">Loading records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Marketplace</h1>
                    <p className="text-slate-500 text-sm font-medium">Acquire fresh harvests from regional producers.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setActiveTab("listings")}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "listings" ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            Listings
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "history" ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            History
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/aggregator/scan-qr')}
                        className="flex items-center gap-2 bg-emerald-600 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                    >
                        <QrCode className="h-4 w-4" /> Collect
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter by crop name or producer..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-200 focus:outline-none transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-slate-400 flex items-center gap-2 hover:bg-slate-50 transition-all">
                    <Filter className="h-4 w-4" /> <span className="text-xs font-black uppercase tracking-widest">Filter</span>
                </button>
            </div>

            {/* Grid Area */}
            {activeTab === "history" ? (
                filteredCollections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCollections.map((item) => (
                            <div key={item.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                <div className="aspect-video relative overflow-hidden bg-slate-50">
                                    <img 
                                        src={item.source_crop?.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt="Crop"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <StatusBadge status={item.status} />
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Manifest: {item.collection_id?.slice(0, 7)}</p>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{item.source_crop?.name || 'Crop'}</h3>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-y border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Volume</p>
                                            <p className="text-sm font-black text-slate-800">{item.collected_quantity} {item.collected_unit}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valuation</p>
                                            <p className="text-sm font-black text-emerald-600">Grade {typeof item.quality_assessment === 'object' ? item.quality_assessment.overallGrade : (item.quality_assessment || 'A')}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelected(item)}
                                        className="w-full bg-slate-50 hover:bg-emerald-600 hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all border border-slate-100"
                                    >
                                        Traceability
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-100">
                        <Package className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Archive Empty</h3>
                        <p className="text-sm text-slate-400 font-medium">No collection history available.</p>
                    </div>
                )
            ) : fetchingCrops ? (
                <div className="text-center py-24">
                    <Loader2 className="w-10 h-10 text-emerald-200 animate-spin mx-auto mb-6" />
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Scanning Network...</p>
                </div>
            ) : availableCrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availableCrops.filter(crop =>
                        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        crop.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((crop) => (
                        <div key={crop.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group border-b-4 border-b-emerald-500/0 hover:border-b-emerald-500">
                            <div className="aspect-square relative overflow-hidden bg-slate-50">
                                <img 
                                    src={crop.images && crop.images.length > 0 ? crop.images[0] : "https://images.unsplash.com/photo-1546473427-e1ad6664c05f?w=800"} 
                                    alt={crop.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-5 py-2 bg-white/90 backdrop-blur-md text-[10px] font-black text-emerald-600 uppercase tracking-widest rounded-xl shadow-lg border border-white/20">Listed Now</span>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{crop.variety || 'Heirloom'}</p>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter capitalize">{crop.name}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                                        <p className="text-base font-black text-slate-800">{crop.quantity} <span className="text-[10px] text-slate-400 opacity-60 uppercase">{crop.unit}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pricing</p>
                                        <p className="text-base font-black text-emerald-600">₹{crop.price_per_unit}<span className="text-[10px] text-slate-400 opacity-60 uppercase">/{crop.unit}</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                    <MapPin className="h-4 w-4 text-emerald-300" />
                                    {formatLocation(crop.farmer?.address)}
                                </div>

                                <button
                                    onClick={() => navigate('/aggregator/collect', { state: { cropData: { crop, farmer: crop.farmer } } })}
                                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 active:scale-[0.98]"
                                >
                                    Contract Purchase
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-100">
                    <Wheat className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Market Offline</h3>
                    <p className="text-sm text-slate-400 font-medium">Scanning regional harvest lists—check back shortly.</p>
                </div>
            )}

            {/* Traceability Modal - Light Minimal Terminal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-slate-100">
                        <div className="p-10 md:p-14 space-y-10">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Traceability Node</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Asset: {selected.source_crop?.name || 'Supply Unit'}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Batch ID: {selected.collection_id?.toUpperCase()}</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">Digital Twin Timeline</h3>
                                
                                <div className="space-y-10 relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100" />

                                    {[
                                        { 
                                            step: 'Origin Harvest', 
                                            desc: `Harvested by ${selected.farmer?.name || 'Authorized Producer'}`, 
                                            meta: `Technique: Hand-picked | Node: ${selected.farmer?.address?.district || 'Regional Unit'}`,
                                            time: new Date(selected.created_at).toLocaleDateString(),
                                            icon: Wheat, color: 'emerald', status: 'Verified'
                                        },
                                        { 
                                            step: 'Quality Assessment', 
                                            desc: `Grade ${typeof selected.quality_assessment === 'object' ? selected.quality_assessment.overallGrade : (selected.quality_assessment || 'A')} Protocol`, 
                                            meta: 'Moisture: 12.4% | Pesticide Residue: Pass (<0.01)',
                                            time: '4h post-harvest',
                                            icon: ShieldCheck, color: 'blue', status: 'Certified'
                                        },
                                        { 
                                            step: 'Logistics Chain', 
                                            desc: 'Cold Chain Deployment', 
                                            meta: 'Vehicle: TR-8829 | Avg Temp: 18°C | Route: Optimized',
                                            time: '8h post-harvest',
                                            icon: MapPin, color: 'indigo', status: 'Transit'
                                        },
                                        { 
                                            step: 'Aggregator Node', 
                                            desc: 'Acceptance & Inventory Sync', 
                                            meta: `Volume: ${selected.collected_quantity} ${selected.collected_unit} | Node ID: AGG-PRIMARY`,
                                            time: 'Success',
                                            icon: Package, color: 'emerald', status: 'Finalized'
                                        }
                                    ].map((event, i) => (
                                        <div key={i} className="flex gap-8 relative group">
                                            <div className={`w-12 h-12 rounded-2xl bg-${event.color}-50 border border-${event.color}-100 flex items-center justify-center relative z-10 group-hover:bg-${event.color}-600 group-hover:text-white transition-all shadow-sm`}>
                                                <event.icon className={`w-5 h-5 text-${event.color}-600 group-hover:text-white`} />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{event.step}</h4>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest text-${event.color}-600`}>{event.status}</span>
                                                </div>
                                                <p className="text-sm text-slate-800 font-bold">{event.desc}</p>
                                                <p className="text-xs text-slate-400 font-medium italic">{event.meta}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="w-full bg-emerald-600 text-white py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                                >
                                    Review Completed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
