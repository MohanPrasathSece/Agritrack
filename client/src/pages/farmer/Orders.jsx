import React, { useState, useEffect, useCallback } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { QrCode, Eye, ChevronRight, Loader2, Search, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { farmerApi } from "../../utils/api";

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderStatuses, setOrderStatuses] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);

    const dummyOrders = [
        {
            id: "ORD-9283-X1",
            buyer: { name: "Nature's Basket" },
            aggregator: "Agro Fresh Pvt Ltd",
            crop: { name: "Organic Tomatoes", quality: { grade: "Premium A+" } },
            quantity: 500,
            unit: "KG",
            status: "processing",
            created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: "ORD-7162-Y4",
            buyer: { name: "Green Mart" },
            aggregator: "Punjab Agri Hub",
            crop: { name: "Basmati Rice", quality: { grade: "Grade A" } },
            quantity: 1200,
            unit: "KG",
            status: "confirmed",
            created_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: "ORD-4451-Z9",
            buyer: { name: "Mega Retailer" },
            aggregator: "South India Agrilink",
            crop: { name: "Fresh Potatoes", quality: { grade: "Bulk B" } },
            quantity: 2500,
            unit: "KG",
            status: "delivered",
            created_at: new Date(Date.now() - 604800000).toISOString()
        }
    ];

    const STATUS_STEPS = ["confirmed", "shipped", "delivered"];
    const STATUS_LABELS = { confirmed: "Confirm", shipped: "Ship", delivered: "Deliver" };

    const getOrderStatus = (order) => orderStatuses[order.id] || order.status;

    const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

    const handleInlineStatus = (orderId, newStatus, currentStatus) => {
        const currentIdx = getStepIndex(currentStatus);
        const newIdx = getStepIndex(newStatus);
        // Can only move forward, not backward
        if (newIdx > currentIdx) {
            setOrderStatuses(prev => ({ ...prev, [orderId]: newStatus }));
        }
    };


    const fetchOrders = useCallback(async () => {
        if (!user?.email) return;
        try {
            setLoading(true);
            const response = await farmerApi.getOrders(user.email);
            if (response.data.success) {
                setOrders([...dummyOrders, ...response.data.orders]);
            } else {
                setOrders(dummyOrders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders(dummyOrders);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setUpdating(true);
            const response = await farmerApi.updateOrderStatus(orderId, { status: newStatus });
            if (response.data.success) {
                fetchOrders();
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update order status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl text-slate-900 tracking-tight">My Orders</h1>
                    <p className="text-sm text-slate-500">Track and manage your crop orders.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search by ID or Buyer..."
                        className="pl-11 pr-5 py-3.5 rounded-xl border border-slate-100 bg-white text-sm text-slate-700 min-w-[280px] shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-300 outline-none transition-all"
                    />
                </div>
            </div>

            {orders.length > 0 ? (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/30">
                                    <th className="px-6 py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Buyer</th>
                                    <th className="px-6 py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Aggregator</th>
                                    <th className="px-6 py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Crop</th>
                                    <th className="px-6 py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Qty</th>
                                    <th className="px-6 py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="transition-all hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-800 font-semibold">{order.buyer?.name || 'Consumer'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{order.aggregator || '—'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600">{order.crop?.name || 'Crop'}</p>
                                            <p className="text-xs text-emerald-600 font-medium mt-0.5">{order.crop?.quality?.grade || order.crop?.quality || 'A'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{order.quantity} {order.unit}</td>
                                        <td className="px-6 py-4 text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1.5 items-center">
                                                {STATUS_STEPS.map(s => {
                                                    const currentStatus = getOrderStatus(order);
                                                    const sIdx = getStepIndex(s);
                                                    const currentIdx = getStepIndex(currentStatus);
                                                    const isPast = sIdx < currentIdx;
                                                    const isCurrent = sIdx === currentIdx;
                                                    const isNext = sIdx === currentIdx + 1;
                                                    return (
                                                        <button
                                                            key={s}
                                                            disabled={isPast || isCurrent}
                                                            onClick={() => handleInlineStatus(order.id, s, currentStatus)}
                                                            title={isPast ? 'Already done' : isCurrent ? 'Current status' : `Mark as ${STATUS_LABELS[s]}`}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                                isPast ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                                                                : isCurrent
                                                                    ? s === 'confirmed' ? 'bg-emerald-500 text-white border-emerald-500'
                                                                    : s === 'shipped' ? 'bg-blue-500 text-white border-blue-500'
                                                                    : 'bg-violet-500 text-white border-violet-500'
                                                                : isNext ? 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700'
                                                                : 'bg-white text-slate-200 border-slate-100 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {STATUS_LABELS[s]}
                                                        </button>
                                                    );
                                                })}
                                                <a
                                                    href={`/order-qr/${order.order_id || order.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-1 p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all"
                                                    title="View QR Label"
                                                >
                                                    <QrCode className="h-4 w-4 text-slate-400 hover:text-blue-600" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-mono">{order.id}</span>
                                    <StatusBadge status={getOrderStatus(order)} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider">Buyer</span>
                                        <span className="text-sm text-slate-800 font-medium">{order.buyer?.name || 'Consumer'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider">Aggregator</span>
                                        <span className="text-xs font-semibold text-indigo-600">{order.aggregator || '—'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-0.5">Crop</span>
                                            <span className="text-sm text-slate-800 font-medium">{order.crop?.name}</span>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-0.5">Qty</span>
                                            <span className="text-sm text-slate-800 font-medium">{order.quantity} {order.unit}</span>
                                        </div>
                                    </div>
                                </div>
                                     <div className="pt-3 border-t border-slate-100">
                                         <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Update Status</p>
                                         <div className="flex gap-2">
                                             {STATUS_STEPS.map(s => {
                                                 const currentStatus = getOrderStatus(order);
                                                 const sIdx = getStepIndex(s);
                                                 const currentIdx = getStepIndex(currentStatus);
                                                 const isPast = sIdx < currentIdx;
                                                 const isCurrent = sIdx === currentIdx;
                                                 const isNext = sIdx === currentIdx + 1;
                                                 return (
                                                     <button
                                                         key={s}
                                                         disabled={isPast || isCurrent}
                                                         onClick={() => handleInlineStatus(order.id, s, currentStatus)}
                                                         className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                                                             isPast ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                                             : isCurrent
                                                                 ? s === 'confirmed' ? 'bg-emerald-500 text-white'
                                                                 : s === 'shipped' ? 'bg-blue-500 text-white'
                                                                 : 'bg-violet-500 text-white'
                                                             : isNext ? 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700'
                                                             : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                                         }`}
                                                     >
                                                         {STATUS_LABELS[s]}
                                                     </button>
                                                 );
                                             })}
                                         </div>
                                     </div>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</span>
                                    <a href={`/order-qr/${order.order_id || order.id}`} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-xs text-slate-500 rounded-lg border border-slate-200 hover:bg-slate-100">
                                        <QrCode className="h-3.5 w-3.5" /> QR Label
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <QrCode className="h-8 w-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl text-slate-900 mb-2 tracking-tight">No Orders Yet</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">Orders will appear here when buyers purchase your crops.</p>
                </div>
            )}

            {/* Status Update Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl text-slate-800 tracking-tight">Update Order Status</h2>
                                    <p className="text-sm text-slate-400 mt-0.5">{selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <X className="h-4 w-4 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-700">Quality Assessment</p>
                                <p className="text-sm text-slate-600">
                                    {selectedOrder.quality && typeof selectedOrder.quality === 'object'
                                        ? (selectedOrder.quality.overallGrade || selectedOrder.quality.grade || 'Quality verified and approved')
                                        : (selectedOrder.quality || 'Quality verified and approved')}
                                </p>
                            </div>

                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Current Status</span>
                                    <StatusBadge status={selectedOrder.status} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Crop</span>
                                    <span className="text-sm text-slate-800">{selectedOrder.crop} ({selectedOrder.qty})</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs text-slate-800 uppercase tracking-wider ml-1">Change Status To</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            disabled={updating || selectedOrder.status === status}
                                            onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                                            className={`py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all border ${selectedOrder.status === status
                                                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                                : "bg-white border-slate-100 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 shadow-sm"
                                                } disabled:opacity-50 active:scale-95`}
                                        >
                                            {updating && selectedOrder.status !== status ? '...' : status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
