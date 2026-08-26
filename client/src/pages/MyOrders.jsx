import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    ExternalLink,
    ChevronRight,
    Search,
    Filter,
    ArrowRight,
    ShoppingBag,
    MapPin,
    Calendar,
    IndianRupee,
    ShieldCheck,
    Star,
    Zap,
    Globe,
    Activity,
    Boxes,
    FileText,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
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
    
    // Ref to store AbortController
    const abortController = useRef();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/orders/buyer/${user.email}`);
                if (response.data.success) {
                    setOrders(response.data.orders);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        }

        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 5000);
            return () => clearTimeout(timer);
        }
        
        // Cleanup function to abort pending requests
        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, [user, isAuthenticated, successMsg]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'in_transit': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
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
        <div className="min-h-screen bg-[#fafafa] pb-24 pt-32 animate-in fade-in duration-700">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Success Alert */}
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-2xl shadow-emerald-500/20 mb-12 flex items-center justify-between border border-emerald-400/30"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <span className="font-black text-sm uppercase tracking-widest">{successMsg}</span>
                            </div>
                            <button onClick={() => setSuccessMsg('')} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all">
                                <ChevronRight className="h-5 w-5 rotate-90" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Section */}
                <div className="bg-white rounded-[4rem] p-12 lg:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12 text-center lg:text-left">
                        <div className="space-y-8 max-w-2xl">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">Procurement Status Verified</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                                    My <span className="text-emerald-500">Orders</span>.
                                </h1>
                                <p className="text-xl font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    Overseeing decentralized logistics and cross-regional harvest acquisition streams.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 justify-center lg:justify-end">
                            <div className="bg-slate-900 px-8 py-6 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-white/5 group hover:-translate-y-1 transition-all">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Assets</p>
                                <p className="text-4xl font-black text-white tracking-tighter italic">{orders.length}</p>
                            </div>
                            <div className="bg-emerald-500 px-8 py-6 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 border border-emerald-400/30 group hover:-translate-y-1 transition-all">
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">In Transit</p>
                                <p className="text-4xl font-black text-white tracking-tighter italic">{orders.filter(o => o.status === 'in_transit').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-[3rem] p-6 shadow-xl border border-slate-100 mb-12 flex flex-col lg:flex-row gap-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Scan by harvest name or protocol ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-16 pl-16 pr-8 bg-slate-50 border-transparent rounded-[2rem] focus:bg-white focus:ring-[6px] focus:ring-emerald-500/10 transition-all text-slate-900 font-black text-sm uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {['all', 'pending', 'confirmed', 'in_transit', 'delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`h-16 px-8 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all active:scale-95 ${filterStatus === status ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                {status === 'all' ? 'All Streams' : status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="grid gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden animate-pulse" />
                        ))}
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="grid gap-12">
                        {filteredOrders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[4rem] p-10 lg:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-emerald-500/20 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                                <div className="flex flex-col xl:flex-row justify-between gap-12">
                                    {/* Left: Product Info */}
                                    <div className="flex flex-col sm:flex-row gap-10">
                                        <div className="h-32 w-32 md:h-48 md:w-48 rounded-[3rem] bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100 shadow-inner relative group-hover:shadow-emerald-500/10 transition-all duration-500">
                                            <img
                                                src={order.crop?.images?.[0]?.url || order.crop?.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                alt=""
                                            />
                                            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm flex items-center gap-2 ${getStatusColor(order.status)} animate-in fade-in zoom-in duration-500`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">TX: #{order.order_id?.slice(0, 12)}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter mb-2 italic group-hover:text-emerald-500 transition-colors">{order.crop?.name}</h3>
                                                <p className="text-xl font-bold text-slate-400 tracking-tight uppercase leading-none">{order.quantity} {order.unit} @ <span className="text-slate-900">₹{order.price_per_unit}</span></p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                    <MapPin className="h-4 w-4 text-emerald-500/50" />
                                                    {order.delivery_address?.district || 'Sector Verified'}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                    <Calendar className="h-4 w-4 text-emerald-500/50" />
                                                    {new Date(order.order_date || order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Pricing & Actions */}
                                    <div className="flex flex-col md:flex-row xl:flex-col justify-between items-start md:items-center xl:items-end gap-10 pt-10 xl:pt-0 xl:border-l border-slate-100 xl:pl-12">
                                        <div className="text-left md:text-right space-y-2">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] leading-none mb-2">Assets Valuation</p>
                                            <div className="text-5xl font-black text-slate-900 flex items-center md:justify-end tracking-tighter leading-none italic">
                                                <IndianRupee className="h-8 w-8 text-emerald-500" strokeWidth={3} />
                                                {order.total_amount?.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-2 md:justify-end">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic leading-none">Status: {order.payment_status?.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-col sm:flex-row md:w-auto items-center gap-4">
                                            <Link to={`/trace/${order.crop_id}`} className="w-full sm:w-auto">
                                                <button className="w-full sm:w-auto px-8 py-5 rounded-[1.8rem] bg-white border-2 border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] hover:border-emerald-500/50 transition-all flex items-center justify-center gap-3 group/trace shadow-xl shadow-slate-100 active:scale-95">
                                                    <Activity className="h-4 w-4 group-hover/trace:rotate-12 transition-transform" /> Audit Journey
                                                </button>
                                            </Link>
                                            <button className="w-full sm:w-auto px-8 py-5 rounded-[1.8rem] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                                                Ledger Details <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tracking Progress */}
                                {order.status !== 'cancelled' && (
                                    <div className="mt-12 pt-12 border-t border-slate-50 overflow-hidden">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center lg:text-left">Synchronized Distribution State</p>
                                        <div className="relative flex justify-between px-4">
                                            {/* Progress Tracks */}
                                            <div className="absolute top-[18px] left-0 w-full h-1 bg-slate-50 -z-0" />
                                            <div
                                                className="absolute top-[18px] left-0 h-1 bg-emerald-500 -z-0 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                style={{
                                                    width: order.status === 'pending' ? '5%' :
                                                        order.status === 'confirmed' ? '33.33%' :
                                                            order.status === 'in_transit' ? '66.66%' : '100%'
                                                }}
                                            />

                                            {['pending', 'confirmed', 'in_transit', 'delivered'].map((s, i) => {
                                                const isActive = order.status === s;
                                                const isPassed = ['pending', 'confirmed', 'in_transit', 'delivered'].slice(0, ['pending', 'confirmed', 'in_transit', 'delivered'].indexOf(order.status) + 1).includes(s);

                                                return (
                                                    <div key={s} className="relative z-10 flex flex-col items-center group/node">
                                                        <div className={`h-10 w-10 rounded-2xl border-4 flex items-center justify-center transition-all duration-700 ${isPassed ? 'bg-emerald-500 border-[#fff] text-white shadow-2xl shadow-emerald-500/40 rotate-45' : 'bg-white border-slate-50 text-slate-200'}`}>
                                                            <div className="-rotate-45">
                                                                {isPassed ? <CheckCircle className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-100" />}
                                                            </div>
                                                        </div>
                                                        <span className={`text-[9px] mt-6 font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-emerald-500' : isPassed ? 'text-slate-800' : 'text-slate-300'}`}>
                                                            {s.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[4rem] p-24 text-center shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-emerald-500/5" />
                        <div className="relative z-10 max-w-lg mx-auto space-y-12">
                            <div className="w-32 h-32 bg-slate-900 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                                <ShoppingBag className="h-12 w-12 text-emerald-500" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Registry Empty</h2>
                                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] leading-relaxed">NO ACTIVE PURCHASE PROTOCOLS IDENTIFIED WITHIN THE REGIONAL LEDGER. EXPLORE THE NEXUS TO ACQUIRE NEW ASSETS.</p>
                            </div>
                            <Link to="/marketplace" className="inline-block">
                                <button className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-4 active:scale-95 group/btn">
                                    Access Marketplace <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
