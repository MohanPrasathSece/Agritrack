import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { ClipboardList, Truck, Package, CheckCircle2, Search, Filter, MoreVertical, MapPin, ArrowLeft, Activity, DollarSign, ChevronRight, Clock, Loader2, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import QRCode from "qrcode";

const steps = ["pending", "processing", "shipped", "delivered"];

export default function RetailerOrders() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [qrSrc, setQrSrc] = useState({});

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user?.email) return;
        try {
            setLoading(true);
            const response = await orderApi.getFarmerOrders(user.email);
            
            let fetchedOrders = [];
            if (response.data && response.data.success) {
                fetchedOrders = response.data.orders || [];
            }
            
            // Dummy orders for Tamil Nadu retailers (post-2026 dates)
            const dummyOrders = [
                {
                    id: "dummy_tn_1",
                    order_id: "ORD-TN-8012",
                    buyer: { name: "Chennai Fresh Mart" },
                    crop: { name: "Premium Ponni Rice", quality: { grade: "A+" } },
                    quantity: 40,
                    unit: "kg",
                    total_amount: 3200,
                    delivery_address: { district: "Chennai", state: "Tamil Nadu" },
                    status: "processing",
                    created_at: new Date("2026-04-15").toISOString()
                },
                {
                    id: "dummy_tn_2",
                    order_id: "ORD-TN-8013",
                    buyer: { name: "Madurai Organics" },
                    crop: { name: "Red Chillies", quality: { grade: "Premium" } },
                    quantity: 25,
                    unit: "kg",
                    total_amount: 2500,
                    delivery_address: { district: "Madurai", state: "Tamil Nadu" },
                    status: "shipped",
                    created_at: new Date("2026-05-10").toISOString()
                },
                {
                    id: "dummy_tn_3",
                    order_id: "ORD-TN-8014",
                    buyer: { name: "Coimbatore Agro Traders" },
                    crop: { name: "Salem Turmeric", quality: { grade: "Export" } },
                    quantity: 15,
                    unit: "kg",
                    total_amount: 4200,
                    delivery_address: { district: "Coimbatore", state: "Tamil Nadu" },
                    status: "delivered",
                    created_at: new Date("2026-06-02").toISOString()
                },
                {
                    id: "dummy_tn_4",
                    order_id: "ORD-TN-8015",
                    buyer: { name: "Trichy Supermarket Hub" },
                    crop: { name: "Groundnut", quality: { grade: "Standard" } },
                    quantity: 80,
                    unit: "kg",
                    total_amount: 5200,
                    delivery_address: { district: "Tiruchirappalli", state: "Tamil Nadu" },
                    status: "pending",
                    created_at: new Date("2026-03-28").toISOString()
                }
            ];

            const allOrders = [...fetchedOrders, ...dummyOrders];
            setOrders(allOrders);
            setLoading(false);
            
            // Only generate QR codes for first 2 to save resources initially
            const qrs = {};
            const toGenerate = allOrders.slice(0, 2);
            for (const order of toGenerate) {
                const date = new Date(order.created_at).toLocaleDateString();
                const cropName = order.crop?.name || 'Unknown Crop';
                const qualityStr = order.crop?.quality?.overallGrade || order.crop?.quality?.grade || 'N/A';
                let addressStr = formatAddress(order.delivery_address);
                const details = `Product: ${cropName}\nAddress: ${addressStr}\nDate: ${date}\nQuality: Grade ${qualityStr}`;
                try {
                    qrs[order.id] = await QRCode.toDataURL(details, { width: 120, margin: 1 });
                } catch (e) {
                    console.error("QR Generation error", e);
                }
            }
            setQrSrc(qrs);
        } catch (err) {
            console.error("Orders fetch error:", err);
            setLoading(false);
        }
    };

    // Helper to generate QR on demand if not present
    const ensureQR = async (order) => {
        if (qrSrc[order.id]) return;
        const date = new Date(order.created_at).toLocaleDateString();
        const cropName = order.crop?.name || 'Unknown Crop';
        let addressStr = formatAddress(order.delivery_address);
        const details = `Product: ${cropName}\nAddress: ${addressStr}\nDate: ${date}`;
        try {
            const url = await QRCode.toDataURL(details, { width: 120, margin: 1 });
            setQrSrc(prev => ({ ...prev, [order.id]: url }));
        } catch (e) {}
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        // Optimistic local UI update
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        // Attempt API call (will gracefully skip dummy IDs in backend or simply catch error if backend rejects it)
        try {
            if (!orderId.toString().startsWith("dummy")) {
                await orderApi.updateStatus(orderId, { status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update status on server:", error);
        }
    };

    const formatAddress = (addr) => {
        if (typeof addr === 'string') return addr;
        if (!addr) return 'Regional Node Hub';
        if (addr.district) return `${addr.district}, ${addr.state || ''}`;
        return 'Regional Node Hub';
    };

    const filteredOrders = orders.filter(order =>
        order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Loading Logistics History...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
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
                        <h1 className="text-2xl text-slate-900 tracking-tight font-semibold">Inbound Consignments</h1>
                        <p className="text-sm text-slate-500">Track and manage downstream distribution fulfillment and retail lifecycle sync.</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Pipeline Flux</p>
                        <p className="text-xl font-semibold text-slate-900 tracking-tighter mt-1.5 flex items-center justify-end gap-1.5">
                            <span className="text-sm text-emerald-500 font-bold">₹</span> {totalValue.toLocaleString()}
                        </p>
                    </div>
                    <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group">
                        <Activity className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                    </button>
                </div>
            </div>

            {/* Search & Intelligence Zone */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Consignment ID or Retailer Entity Node..."
                        className="w-full rounded-[24px] border border-slate-100 bg-white py-5 pl-16 pr-8 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all shadow-sm"
                    />
                </div>
                <button className="px-8 flex items-center justify-center rounded-[24px] bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                    <Filter className="h-5 w-5 mr-3" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Logic Filter</span>
                </button>
            </div>

            {/* Consignments List */}
            <div className="grid grid-cols-1 gap-8">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                    const currentStep = steps.indexOf(order.status) >= 0 ? steps.indexOf(order.status) : 0;
                    if (!qrSrc[order.id]) ensureQR(order); // Lazy load
                    return (
                        <div key={order.id} className="group bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-visible flex flex-col">
                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
                                    <div className="flex items-start gap-8">
                                        {qrSrc[order.id] ? (
                                            <div className="h-24 w-24 bg-white rounded-[1.5rem] flex items-center justify-center shadow-lg border border-slate-200">
                                                <img src={qrSrc[order.id]} alt="QR" className="w-20 h-20 object-contain rounded-xl" />
                                            </div>
                                        ) : (
                                            <div className="h-20 w-20 bg-slate-50 rounded-[32px] flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 transition-all duration-500">
                                                <ClipboardList className="h-8 w-8 text-slate-400 group-hover:text-white transition-colors" />
                                            </div>
                                        )}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">{order.buyer?.name || "Unknown Retailer"}</h3>
                                                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{order.order_id}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                                    <Package className="w-3.5 h-3.5" /> {order.crop?.name}
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                                    <Activity className="w-3.5 h-3.5" /> Mass: {order.quantity} {order.unit}
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 uppercase tracking-widest">
                                                    <DollarSign className="w-3.5 h-3.5" /> Value: ₹{parseFloat(order.total_amount).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {formatAddress(order.delivery_address)} • <Clock className="w-3 h-3 ml-1" /> {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 self-start lg:self-center">
                                        <StatusBadge status={order.status} />
                                        <div className="relative group/menu">
                                            <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors active:scale-95">
                                                <MoreVertical className="w-6 h-6" />
                                            </button>
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50">
                                                <div className="p-2 space-y-1">
                                                    <p className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Forward Logistics</p>
                                                    {steps.map((stepStatus) => (
                                                        <button
                                                            key={stepStatus}
                                                            onClick={() => handleStatusUpdate(order.id, stepStatus)}
                                                            disabled={order.status === stepStatus}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                                                order.status === stepStatus
                                                                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                                                    : 'hover:bg-emerald-50 text-slate-700 hover:text-emerald-600'
                                                            }`}
                                                        >
                                                            Move to {stepStatus}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Visualizer */}
                                <div className="px-10">
                                    <div className="relative pt-6 pb-2">
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-50 -translate-y-[12px] rounded-full">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="relative flex justify-between items-center w-full">
                                            {steps.map((step, idx) => {
                                                const isCompleted = idx <= currentStep;
                                                const isCurrent = idx === currentStep;
                                                return (
                                                    <div key={step} className="flex flex-col items-center gap-6 flex-1 first:items-start last:items-end">
                                                        <div className={`relative z-20 h-6 w-6 rounded-full border-4 transition-all duration-700 flex items-center justify-center ${isCompleted
                                                            ? "bg-emerald-500 border-white ring-8 ring-emerald-50 shadow-xl"
                                                            : "bg-white border-slate-50"
                                                            } ${isCurrent ? "scale-125" : ""}`}>
                                                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                        </div>
                                                        <span className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${isCompleted ? "text-slate-900" : "text-slate-300"
                                                            } ${isCurrent ? "text-emerald-600" : ""}`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Background Decoration */}
                            <div className="absolute inset-0 overflow-hidden rounded-[48px] pointer-events-none">
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-slate-50 rounded-full group-hover:scale-[3] transition-all duration-1000 -z-0" />
                                <Truck className="absolute bottom-10 left-10 w-16 h-16 text-slate-50/50 group-hover:text-emerald-50/20 transition-all duration-1000 -rotate-12" />
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 space-y-4">
                        <Truck className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-xl font-semibold text-slate-800">No Orders Found</h3>
                        <p className="text-sm text-slate-500">Retailers have not placed any orders for your inventory yet.</p>
                    </div>
                )}
            </div>

            {/* Global Dispatch Controls */}
            <div className="bg-slate-900 rounded-[56px] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/30 group">
                <div className="relative z-10 flex flex-col items-center gap-10">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest">Network Synchronizer Active</span>
                        </div>
                        <h2 className="text-4xl font-semibold tracking-tighter">Regional Logistics Control</h2>
                        <p className="text-white/50 font-medium text-sm leading-relaxed">
                            Optimize mass distribution through regional retail nodes and manage immutable delivery signatures for finalized settlements.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <button className="bg-white text-slate-900 px-12 py-6 rounded-[32px] text-[10px] font-medium uppercase tracking-[0.2em] transition-all hover:bg-emerald-400 active:scale-95 shadow-2xl flex items-center justify-center gap-4">
                            <Activity className="w-5 h-5" /> Launch Dispatcher Hub
                        </button>
                        <button className="bg-white/5 border border-white/10 text-white px-12 py-6 rounded-[32px] text-[10px] font-medium uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center gap-3">
                            <MapPin className="w-5 h-5 text-emerald-500" /> Visualize Node Fleet
                        </button>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            </div>
        </div>
    );
}
