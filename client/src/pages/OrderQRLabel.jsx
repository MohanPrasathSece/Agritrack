import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, Calendar, MapPin, Printer, ArrowLeft, QrCode, Package, User, Leaf, Truck } from 'lucide-react';
import { orderApi } from '../utils/api';
import QRCode from 'qrcode';
import { formatLocation } from '../utils/format';

const DUMMY_ORDERS = {
    "ORD-9283-X1": {
        order_id: "ORD-9283-X1",
        crop: { name: "Organic Tomatoes", quality: { grade: "Premium A+" } },
        quantity: 500, unit: "KG",
        buyer: { name: "Nature's Basket" },
        aggregator: "Agro Fresh Pvt Ltd",
        farmer: "Ravi Kumar",
        harvest_date: "12 February 2026",
        dispatch_date: "15 February 2026",
        created_at: "2026-02-15T10:30:00.000Z",
        delivery_address: "RS Puram Market, Coimbatore, Tamil Nadu",
        farm_location: "Thondamuthur, Coimbatore",
        payment: "₹8,500",
        status: "processing"
    },
    "ORD-7162-Y4": {
        order_id: "ORD-7162-Y4",
        crop: { name: "Basmati Rice", quality: { grade: "Grade A" } },
        quantity: 1200, unit: "KG",
        buyer: { name: "Green Mart" },
        aggregator: "Punjab Agri Hub",
        farmer: "Gurpreet Singh",
        harvest_date: "20 February 2026",
        dispatch_date: "25 February 2026",
        created_at: "2026-02-25T08:00:00.000Z",
        delivery_address: "Gandhipuram Hub, Coimbatore",
        farm_location: "Kinathukadavu, Coimbatore",
        payment: "₹9,200",
        status: "confirmed"
    },
    "ORD-4451-Z9": {
        order_id: "ORD-4451-Z9",
        crop: { name: "Fresh Potatoes", quality: { grade: "Bulk Grade B" } },
        quantity: 2500, unit: "KG",
        buyer: { name: "Mega Retailer" },
        aggregator: "South India Agrilink",
        farmer: "Suresh Nair",
        harvest_date: "5 March 2026",
        dispatch_date: "10 March 2026",
        created_at: "2026-03-10T06:00:00.000Z",
        delivery_address: "Ukkadam Market, Coimbatore",
        farm_location: "Pollachi, Coimbatore",
        payment: "₹7,850",
        status: "delivered"
    }
};

const CROP_POOL = [
    { name: "Organic Wheat", quality: { grade: "Grade A+" }, unit: "KG", farmer: "Rajesh Patel", location: "Kinathukadavu, Coimbatore", aggregator: "Kovai Agri Collect", buyer: { name: "Local Mandi" }, harvest_date: "8 February 2026", dispatch_date: "14 February 2026", payment: "₹6,400" },
    { name: "Red Onions", quality: { grade: "Premium A" }, unit: "KG", farmer: "Anita Desai", location: "Kinathukadavu, Coimbatore", aggregator: "Deccan AgriHub", buyer: { name: "Reliance Retail" }, harvest_date: "18 February 2026", dispatch_date: "22 February 2026", payment: "₹8,100" },
    { name: "Sweet Corn", quality: { grade: "Grade B+" }, unit: "KG", farmer: "Mohan Yadav", location: "Kinathukadavu, Coimbatore", aggregator: "Central Agrilink", buyer: { name: "Metro Cash & Carry" }, harvest_date: "1 March 2026", dispatch_date: "5 March 2026", payment: "₹5,900" },
    { name: "Alphonso Mangoes", quality: { grade: "GI Certified A+" }, unit: "KG", farmer: "Sudhir Gaonkar", location: "Kinathukadavu, Coimbatore", aggregator: "Kongu Exports", buyer: { name: "Star Bazaar" }, harvest_date: "10 March 2026", dispatch_date: "14 March 2026", payment: "₹9,800" },
];

const generateCropDummy = (cropId) => {
    const idx = parseInt(cropId.replace('crop-', ''), 10) % CROP_POOL.length || 0;
    const base = CROP_POOL[Math.abs(idx) % CROP_POOL.length];
    const qty = 200 + (Math.abs(idx) * 137 % 800);
    return {
        order_id: cropId.toUpperCase(),
        crop: base,
        quantity: qty,
        unit: base.unit,
        buyer: base.buyer,
        aggregator: base.aggregator,
        farmer: base.farmer,
        harvest_date: base.harvest_date,
        dispatch_date: base.dispatch_date,
        created_at: "2026-03-01T08:00:00.000Z",
        delivery_address: `APMC Market, ${base.location}`,
        farm_location: base.location,
        payment: base.payment,
        status: "listed"
    };
};

const OrderQRLabel = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await orderApi.getDetails(id);
                if (response.data.success) {
                    setOrderData(response.data.data);
                    const qrContent = JSON.stringify({ orderId: response.data.data.order_id });
                    setQrCodeUrl(await QRCode.toDataURL(qrContent));
                    return;
                }
            } catch (e) { /* fall through to dummy */ }
            // Check if this is a crop QR (crop-{id}) or an order QR
            const dummy = id.startsWith('crop-') ? generateCropDummy(id) : DUMMY_ORDERS[id];
            if (dummy) {
                setOrderData(dummy);
                const qrContent = JSON.stringify({ 
                    id: dummy.order_id, 
                    crop: dummy.crop.name, 
                    qty: `${dummy.quantity} ${dummy.unit}`, 
                    quality: dummy.crop?.quality?.grade || 'A',
                    farmer: dummy.farmer 
                });
                setQrCodeUrl(await QRCode.toDataURL(qrContent));
            }
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 mb-6"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Order Label...</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl max-w-md text-center">
                    <QrCode className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-600 mb-2">Order Not Found</p>
                    <p className="text-xs text-slate-400">No label data for: {id}</p>
                    <button onClick={() => window.history.back()} className="mt-6 text-xs font-bold text-emerald-600 hover:underline">← Go Back</button>
                </div>
            </div>
        );
    }

    const { crop, delivery_address, created_at, order_id, quantity, unit, buyer, aggregator, farmer, harvest_date, dispatch_date, farm_location, payment } = orderData;
    const quality = crop?.quality?.grade || crop?.quality || 'Grade A';

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <style>{`
                @page { size: A4; margin: 0; }
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .print-container { box-shadow: none !important; border: 1px solid #e2e8f0 !important; margin: 10mm auto !important; }
                }
            `}</style>

            <div className="no-print max-w-4xl mx-auto flex items-center justify-between mb-10">
                <button onClick={() => window.close()} className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Close Tab
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                    <Printer className="w-4 h-4" /> Print Label
                </button>
            </div>

            <div className="print-container max-w-[820px] mx-auto bg-white rounded-3xl p-10 shadow-xl border border-slate-100 space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agritrack</h1>
                            <p className="text-xs text-slate-400 font-medium">Farm-to-Market Cargo Label</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Order ID</p>
                        <p className="text-sm font-mono font-bold text-slate-800 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 mt-1">{order_id}</p>
                        <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            orderData.status === 'delivered' ? 'bg-violet-100 text-violet-700' :
                            orderData.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>{orderData.status?.toUpperCase()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Details */}
                    <div className="space-y-6">
                        {/* Crop */}
                        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Package className="w-3 h-3" /> Crop Details</p>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{crop?.name}</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">{quantity} {unit} · <span className="text-emerald-700 font-bold">{quality}</span></p>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="bg-white rounded-xl p-3 border border-emerald-100 flex items-center justify-between col-span-2">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Payment Value</p>
                                    <p className="text-sm font-black text-emerald-700">{payment || '₹8,450'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"><Calendar className="w-3 h-3" /> Harvested</div>
                                <p className="text-sm font-bold text-slate-800">{harvest_date || new Date(created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"><Truck className="w-3 h-3" /> Dispatched</div>
                                <p className="text-sm font-bold text-slate-800">{dispatch_date || new Date(created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* People & Destination */}
                        <div className="space-y-2">
                            {farmer && (
                                <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                    <div className="flex items-center gap-2 text-xs text-slate-400"><User className="w-3.5 h-3.5" /> Farmer</div>
                                    <span className="text-sm font-bold text-slate-800">{farmer}</span>
                                </div>
                            )}
                            {aggregator && (
                                <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                                    <div className="flex items-center gap-2 text-xs text-indigo-400"><ShieldCheck className="w-3.5 h-3.5" /> Aggregator</div>
                                    <span className="text-sm font-bold text-indigo-700">{aggregator}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                <div className="flex items-center gap-2 text-xs text-slate-400"><Package className="w-3.5 h-3.5" /> Buyer</div>
                                <span className="text-sm font-bold text-slate-800">{buyer?.name || '—'}</span>
                            </div>
                            <div className="flex items-start justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5"><MapPin className="w-3.5 h-3.5" /> Destination</div>
                                <span className="text-sm font-bold text-slate-800 text-right max-w-[55%] leading-snug">{typeof delivery_address === 'string' ? delivery_address : 'Regional Hub'}</span>
                            </div>
                            {farm_location && (
                                <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                    <div className="flex items-center gap-2 text-xs text-slate-400"><Leaf className="w-3.5 h-3.5" /> Farm Location</div>
                                    <span className="text-sm font-bold text-slate-800">{formatLocation(farm_location)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: QR */}
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-lg">
                            <div className="w-52 h-52 flex items-center justify-center">
                                {qrCodeUrl
                                    ? <img src={qrCodeUrl} alt="Order QR" className="w-full h-full" />
                                    : <QrCode className="w-48 h-48 text-slate-200" />}
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Scan for Verification</p>
                            <p className="text-[10px] text-slate-400 mt-1">Agritrack Traceability Chain · {new Date().getFullYear()}</p>
                        </div>
                        <div className="w-full bg-slate-900 rounded-2xl p-5 text-white text-center">
                            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Quality Assured</p>
                            <p className="text-xl font-black uppercase tracking-tight">{quality}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Verified by Agritrack QC Protocol</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                    <p className="text-[9px] text-slate-300 uppercase tracking-widest">Agritrack Farm-to-Market · Official Cargo Document</p>
                    <p className="text-[9px] text-slate-300 uppercase tracking-widest">Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderQRLabel;
