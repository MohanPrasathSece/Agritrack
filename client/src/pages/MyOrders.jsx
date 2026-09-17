import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    ChevronRight,
    Search,
    ShieldCheck,
    IndianRupee,
    MapPin,
    Calendar,
    Thermometer,
    Cpu
} from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/v1';

const MyOrders = () => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [successMsg, setSuccessMsg] = useState(location.state?.message || '');
    
    const abortController = useRef();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/orders/buyer/${user.email}`);
                if (response.data.success && Array.isArray(response.data.orders)) {
                    setOrders(response.data.orders);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        } else {
            setLoading(false);
        }

        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 5000);
            return () => clearTimeout(timer);
        }
        
        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, [user, isAuthenticated, successMsg]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'in_transit': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="h-3.5 w-3.5" />;
            case 'confirmed': return <ShieldCheck className="h-3.5 w-3.5" />;
            case 'in_transit': return <Truck className="h-3.5 w-3.5" />;
            case 'delivered': return <CheckCircle className="h-3.5 w-3.5" />;
            default: return <Package className="h-3.5 w-3.5" />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = order.crop?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.order_id?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-6 animate-in fade-in duration-300">
            <div className="container mx-auto px-4 max-w-6xl space-y-6">
                
                {/* Success Alert */}
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-emerald-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3 text-xs font-bold">
                                <CheckCircle className="h-5 w-5" />
                                <span>{successMsg}</span>
                            </div>
                            <button onClick={() => setSuccessMsg('')} className="p-1 hover:bg-white/20 rounded-lg">
                                <ChevronRight className="h-4 w-4 rotate-90" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Procurement Ledger
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            My <span className="text-emerald-600">Orders</span>
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                            Monitor live consignment milestones, auction receipts, and ESP32 transport status.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 px-5 py-3 rounded-2xl text-center text-white shadow-sm min-w-[100px]">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
                            <p className="text-xl font-black">{orders.length}</p>
                        </div>
                        <div className="bg-emerald-600 px-5 py-3 rounded-2xl text-center text-white shadow-sm min-w-[100px]">
                            <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">In Transit</p>
                            <p className="text-xl font-black">{orders.filter(o => o.status === 'in_transit').length}</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders by crop name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        {['all', 'pending', 'confirmed', 'in_transit', 'delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`h-9 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition ${
                                    filterStatus === status 
                                        ? 'bg-slate-900 text-white shadow-sm' 
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {status === 'all' ? 'All' : status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                        ))}
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredOrders.map((order) => (
                            <div 
                                key={order.id || order.order_id} 
                                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-slate-900">{order.crop?.name || 'Farm Lot Consignment'}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium">
                                            ID: <span className="font-mono text-slate-700 font-bold">{order.order_id}</span> · Quantity: {order.quantity} {order.unit || 'KG'}
                                        </p>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {new Date(order.created_at || Date.now()).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1 font-bold text-slate-700">
                                                Total: ₹{(order.total_amount || (order.price_per_unit * order.quantity) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <Link
                                        to={`/retailer/delivery?order=${order.order_id || order.id}`}
                                        className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Thermometer className="w-3.5 h-3.5" />
                                        IoT Telemetry
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center shadow-sm">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                            <Package className="h-7 w-7 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 mb-1">No Orders Found</h3>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">You have not placed any orders yet or no records match your filter.</p>
                        <Link
                            to="/consumer/marketplace"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyOrders;
