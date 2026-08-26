import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    CreditCard,
    Truck,
    MapPin,
    CheckCircle2,
    AlertCircle,
    IndianRupee,
    Package,
    ShieldCheck,
    ShoppingBag,
    Zap,
    Globe,
    Activity,
    Boxes,
    FileText,
    ChevronRight,
    Lock,
    Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/v1';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        quantity: 10,
        fullAddress: '',
        village: '',
        district: '',
        state: '',
        pincode: '',
        notes: '',
        paymentMethod: 'cash'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout/' + id);
            return;
        }

        const fetchCrop = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('crops')
                    .select('*, profiles:farmer_id(*)')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setCrop(data);

                // Pre-fill address if available in user profile
                if (user?.address) {
                    setFormData(prev => ({
                        ...prev,
                        fullAddress: user.address.fullAddress || '',
                        village: user.address.village || '',
                        district: user.address.district || '',
                        state: user.address.state || '',
                        pincode: user.address.pincode || ''
                    }));
                }
            } catch (err) {
                console.error('Error fetching crop:', err);
                setError('Failed to load crop details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCrop();
    }, [id, isAuthenticated, navigate, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotal = () => {
        if (!crop) return 0;
        return (formData.quantity * crop.price_per_unit).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            setError('');

            const orderData = {
                cropId: crop.id,
                cropName: crop.name,
                farmerEmail: crop.profiles.email,
                buyerEmail: user.email,
                quantity: formData.quantity,
                unit: crop.unit,
                pricePerUnit: crop.price_per_unit,
                deliveryAddress: {
                    fullAddress: formData.fullAddress,
                    village: formData.village,
                    district: formData.district,
                    state: formData.state,
                    pincode: formData.pincode
                },
                notes: formData.notes,
                paymentStatus: 'pending'
            };

            const response = await axios.post(`${API_BASE}/orders`, orderData);

            if (response.data.success) {
                // Success! Redirect to my orders
                navigate('/my-orders', { state: { success: true, message: 'Order placed successfully!' } });
            } else {
                throw new Error(response.data.message || 'Failed to place order');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred while placing your order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-8">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full animate-pulse" />
                    <div className="animate-spin rounded-full h-16 w-16 border-[6px] border-emerald-500 border-t-transparent relative z-10 shadow-2xl shadow-emerald-500/20"></div>
                </div>
                <div className="space-y-2 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Establishing Secure Stream</p>
                    <p className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-none">Initializing Acquisition Terminal...</p>
                </div>
            </div>
        );
    }

    if (!crop) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-8">
                <div className="bg-white rounded-[4rem] p-16 lg:p-24 text-center shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group max-w-2xl w-full">
                    <div className="absolute inset-0 bg-red-500/5" />
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-500/30">
                            <AlertCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase leading-none">Asset Not Available</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 max-w-md mx-auto">{error || 'THE REQUESTED ACQUISITION PROTOCOL COULD NOT BE INITIALIZED.'}</p>
                        <Link to="/marketplace"
                            className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 active:scale-95 flex items-center justify-center gap-3 mx-auto max-w-xs"
                        >
                            Return to Nexus <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 font-normal animate-in fade-in duration-700">
            <div className="container mx-auto px-6 max-w-7xl pt-32">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-8 mb-16">
                    <Link
                        to={`/crop/${id}`}
                        className="group flex items-center gap-4 px-6 py-3 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-full text-slate-900 transition-all hover:border-emerald-500/50 active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cancel Transaction</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <Lock className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">AES-256 Encrypted Protocol</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Form Area */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-12">

                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Step 1: Quantity */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[4rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-14 w-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-emerald-500 shadow-2xl group-hover:rotate-6 transition-all duration-500">
                                        <Boxes className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">Step 01</h3>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Asset Configuration</h2>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Order Quantity ({crop.unit})</label>
                                        <div className="relative group/input">
                                            <input
                                                type="number"
                                                name="quantity"
                                                min="1"
                                                max={crop.quantity}
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                className="w-full h-20 bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 font-black text-2xl text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all group-hover/input:border-emerald-500/30"
                                                required
                                            />
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-black uppercase text-xs tracking-widest">
                                                {crop.unit}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 inline-flex">
                                            <Info className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Registry Max: {crop.quantity} {crop.unit}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group/valuation">
                                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/valuation:opacity-100 transition-opacity" />
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-none mb-4 relative z-10">Protocol Valuation</p>
                                        <div className="text-5xl font-black text-white flex items-center tracking-tighter italic relative z-10">
                                            <IndianRupee className="h-8 w-8 text-emerald-500" strokeWidth={3} />
                                            {calculateTotal()}
                                        </div>
                                        <p className="text-[9px] text-emerald-500/60 font-black uppercase tracking-widest mt-4 relative z-10">Real-time Spot Rate Applied</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Step 2: Delivery Address */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[4rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-14 w-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-blue-500 shadow-2xl group-hover:rotate-6 transition-all duration-500">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">Step 02</h3>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Distribution Logistics</h2>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Full Access Protocol (Address)</label>
                                        <input
                                            type="text"
                                            name="fullAddress"
                                            placeholder="Unit ID, Street, Regional Sector"
                                            value={formData.fullAddress}
                                            onChange={handleInputChange}
                                            className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Node Village</label>
                                            <input
                                                type="text"
                                                name="village"
                                                value={formData.village}
                                                onChange={handleInputChange}
                                                className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">District Node</label>
                                            <input
                                                type="text"
                                                name="district"
                                                value={formData.district}
                                                onChange={handleInputChange}
                                                className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">State Protocol</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Postal Hash (Pincode)</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                maxLength="6"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Step 3: Payment Method */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-[4rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-14 w-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-orange-500 shadow-2xl group-hover:rotate-6 transition-all duration-500">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">Step 03</h3>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Settlement Layer</h2>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                                        className={`cursor-pointer rounded-[2rem] p-8 border-4 transition-all flex flex-col gap-6 relative overflow-hidden ${formData.paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cash' ? 'border-emerald-500' : 'border-slate-200'}`}>
                                            {formData.paymentMethod === 'cash' && <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />}
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className={`text-xl font-black uppercase tracking-tight ${formData.paymentMethod === 'cash' ? 'text-slate-900' : 'text-slate-400'}`}>Settlement on Sync</h4>
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 italic">COD: DIRECT EXCHANGE UPON NODE DELIVERY</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`rounded-[2rem] p-8 border-4 border-slate-50 bg-slate-50/50 flex flex-col gap-6 relative overflow-hidden opacity-50 grayscale`}
                                    >
                                        <div className="h-8 w-8 rounded-full border-2 border-slate-200 flex items-center justify-center">
                                            <Lock className="h-4 w-4 text-slate-300" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight">Smart Escrow</h4>
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 italic">BLOCKCHAIN PROTOCOL: UNDER DEVELOPMENT</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500 text-white rounded-[2rem] p-8 flex items-center gap-6 shadow-2xl shadow-red-500/20 border border-red-400/30">
                                    <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-24 bg-slate-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.6em] shadow-2xl shadow-slate-900/40 transition-all hover:-translate-y-1 active:scale-[0.98] group relative overflow-hidden disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <div className="relative z-10 flex items-center justify-center gap-6 text-center w-full px-4">
                                    {submitting ? (
                                        <>
                                            <div className="h-6 w-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                            Synchronizing Protocol...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-6 w-6 text-emerald-500 group-hover:scale-125 transition-transform" />
                                            Execute Acquisition (₹{calculateTotal()})
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white rounded-[4rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Asset Passport</h4>

                                <div className="flex flex-col gap-10 mb-10">
                                    <div className="h-32 w-full rounded-[2.5rem] bg-slate-50 overflow-hidden border border-slate-100 shadow-inner group-hover:shadow-emerald-500/10 transition-all duration-500">
                                        <img src={crop.images?.[0]?.url || crop.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">{crop.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{crop.variety}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-slate-50">
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Unit Spot Rate</span>
                                        <span className="text-slate-900 tracking-tighter">₹{crop.price_per_unit} / {crop.unit}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Allocated Volume</span>
                                        <span className="text-slate-900 tracking-tighter">{formData.quantity} {crop.unit}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Logistics Fee</span>
                                        <span className="text-emerald-500 tracking-widest">SUBSIDIZED</span>
                                    </div>
                                    <div className="h-px bg-slate-50 w-full" />
                                    <div className="flex justify-between items-end pt-4">
                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">Total Protocol Cost</span>
                                        <div className="text-4xl font-black text-emerald-500 tracking-tighter flex items-center leading-none">
                                            <IndianRupee className="h-6 w-6" strokeWidth={3} />
                                            {calculateTotal()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 grid gap-4">
                                    {[
                                        { label: "Quality Assured", icon: ShieldCheck },
                                        { label: "Identity Verified", icon: Activity },
                                        { label: "Traceable Journey", icon: Boxes }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:border-emerald-500/10 transition-colors">
                                            <item.icon className="h-4 w-4 text-emerald-500" />
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group/support">
                                <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />
                                <h4 className="font-black text-emerald-500 uppercase tracking-[0.4em] text-[10px] mb-4">Command Center</h4>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">NODE OPERATORS ARE STANDING BY TO ASSIST WITH ACQUISITION PROTOCOLS.</p>
                                <button className="text-[10px] font-black text-white px-8 py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest w-full">Initialize Support Stream →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
