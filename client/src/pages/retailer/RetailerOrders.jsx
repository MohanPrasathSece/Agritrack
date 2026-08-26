import React, { useState, useEffect } from "react";

import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Eye, Package, MapPin, CheckCircle2, Truck, Loader2, RefreshCw, X, FileText, ChevronRight, ShieldCheck, ExternalLink, AlertTriangle, QrCode } from "lucide-react";
import { retailerApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

export default function RetailerOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);
    const [qrSrc, setQrSrc] = useState(null);
    const formatAddress = (addr) => {
        if (typeof addr === 'string') return addr;
        if (!addr) return 'Regional Logistics Node';
        const { village, district, state, pincode, fullAddress } = addr;
        if (fullAddress) return fullAddress;
        return [village, district, state, pincode].filter(Boolean).join(', ');
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await retailerApi.getOrders();
            if (response.data.success) {
                setOrders(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedOrder(response.data.data[0]);
                }
            } else {
                setError("Failed to synchronize logistics history.");
            }
        } catch (err) {
            console.error("Orders fetch error:", err);
            setError("Security context violation at logistics node.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedOrder) {
            const date = new Date(selectedOrder.created_at).toLocaleDateString();
            const cropName = selectedOrder.crop?.name || 'Unknown Crop';
            const qualityStr = selectedOrder.crop?.quality?.overallGrade || selectedOrder.crop?.quality?.grade || 'N/A';
            const addressStr = formatAddress(selectedOrder.delivery_address);

            const details = `Product: ${cropName}\nAddress: ${addressStr}\nDate: ${date}\nQuality: Grade ${qualityStr}`;

            QRCode.toDataURL(details, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } })
                .then(url => setQrSrc(url))
                .catch(err => console.error(err));
        } else {
            setQrSrc(null);
        }
    }, [selectedOrder]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Procurement Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-12 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Logistics History</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800">
                        Procurement Ledger
                    </h1>
                    <p className="text-xl font-bold text-slate-500 max-w-2xl">A cryptographically verified history of all regional procurement protocols.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 hover:border-emerald-500/20 shadow-xl shadow-slate-200/50 transition-all flex items-center justify-center gap-3 group"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" /> RESET SYNCHRONIZATION
                </button>
            </div>

            {/* Main Content Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Order List Table */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Manifest</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payload Details</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:table-cell">Valuation</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Status</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className={`group hover:bg-emerald-50/30 transition-all cursor-pointer ${selectedOrder?.id === order.id ? 'bg-emerald-50/50' : ''}`}
                                        >
                                            <td className="px-10 py-8">
                                                <div className="space-y-1">
                                                    <span className="text-sm font-black text-slate-900 tracking-tight">{order.order_id}</span>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-2xl border transition-all ${selectedOrder?.id === order.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-white group-hover:border-emerald-200'}`}>
                                                        <Package className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 tracking-tight capitalize">{order.crop?.name || "Inventory Item"}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.quantity} {order.unit}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 hidden sm:table-cell">
                                                <span className="text-sm font-black text-emerald-600 tracking-tight">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col items-start gap-2">
                                                    <StatusBadge status={order.status} />
                                                    {order.payment_status === 'escrowed' && (
                                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[8px] font-black rounded-lg uppercase tracking-widest border border-emerald-500/20">
                                                            ⛓️ ESCROWED
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <button className="h-12 w-12 rounded-2xl bg-white border border-slate-100 text-slate-300 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-all shadow-sm flex items-center justify-center active:scale-95">
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-40 text-center">
                                            <div className="space-y-6">
                                                <div className="h-20 w-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex items-center justify-center mx-auto">
                                                    <FileText className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800">NO PROCUREMENT LOGS</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2"> Regional logistics history is currently empty</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Details Panel */}
                <div className="lg:col-span-4 space-y-10">
                    {selectedOrder ? (
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-10 space-y-10 animate-in slide-in-from-right-8 duration-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Protocol Detail</h3>
                                <div className="flex flex-col gap-3">
                                    <button onClick={() => navigate(`/retailer/traceability?crop=${selectedOrder.crop_id}`)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center gap-2">
                                        <Eye className="w-4 h-4" /> Comprehensive Trace
                                    </button>
                                    <button onClick={() => navigate(`/order-qr/${selectedOrder.id}`)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center gap-2">
                                        <QrCode className="w-4 h-4" /> Digital Order Label
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px]" />
                                <div className="relative z-10 flex justify-between items-start gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2 leading-none">ORDER IDENTIFIER</p>
                                            <p className="text-2xl font-black tracking-tight">{selectedOrder.order_id}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Payload Mass</p>
                                                <p className="text-sm font-bold">{selectedOrder.quantity} {selectedOrder.unit}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Net Settlement</p>
                                                <p className="text-sm font-bold text-emerald-400">₹{parseFloat(selectedOrder.total_amount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {qrSrc && (
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-700/50">
                                                <img src={qrSrc} alt="Order QR Details" className="w-24 h-24 object-contain rounded-lg" />
                                            </div>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center mt-1">Scan for Details</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Logistics Tracker */}
                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-4 border-b border-slate-50">Logistics Sequence</h4>
                                <div className="relative pl-12 space-y-10">
                                    <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100" />

                                    {[
                                        { phase: "Order Confirmed", time: new Date(selectedOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), active: true, icon: CheckCircle2 },
                                        { phase: "Inventory Validation", time: "Verified on Ledger", active: ['processing', 'shipped', 'delivered'].includes(selectedOrder.status), icon: Package },
                                        { phase: "Logistics Dispatch", time: "Regional Transit", active: ['shipped', 'delivered'].includes(selectedOrder.status), icon: Truck },
                                        { phase: "Terminal Receipt", time: "Pending Final Trace", active: selectedOrder.status === 'delivered', icon: CheckCircle2 },
                                    ].map((step, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className={`absolute -left-[3.25rem] w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 z-10 ${step.active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black tracking-tight transition-colors ${step.active ? 'text-slate-800' : 'text-slate-300'}`}>{step.phase}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{step.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-emerald-500" /> Delivery Target Node
                                </label>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                                    {formatAddress(selectedOrder.delivery_address)}
                                </div>
                            </div>

                            {selectedOrder.notes?.includes('Tx Hash:') && (
                                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Digital Settlement Verified</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-500 break-all truncate">
                                        {selectedOrder.notes.split('Tx Hash: ')[1]?.split('\n')[0]}
                                    </p>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${selectedOrder.notes.split('Tx Hash: ')[1]?.split('\n')[0]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                                    >
                                        View on Explorer <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button className="flex-1 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3">
                                    <FileText className="w-4 h-4" /> Invoice
                                </button>
                                <button
                                    onClick={() => alert("Protocol Issue Logged in Cloud Nodes.")}
                                    className="px-6 py-5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-100 transition-all active:scale-95 border border-red-100 flex items-center gap-2"
                                >
                                    <AlertTriangle className="h-4 w-4" /> Dispute
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center py-40 bg-slate-50 rounded-[3.5rem] border border-dashed border-slate-200">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">SELECT DATA POINT FOR ANALYSIS</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
