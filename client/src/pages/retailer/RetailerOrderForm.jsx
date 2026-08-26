import React, { useState, useEffect } from "react";
import { RetailerLayout } from "../../components/retailer/RetailerLayout";
import { Shield, Leaf, Truck, MapPin, CreditCard, ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { cropApi, retailerApi } from "../../utils/api";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { useAuth } from "../../contexts/AuthContext";
import { useWeb3 } from "../../contexts/Web3Context";

export default function RetailerOrderForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isConnected, connectWallet, processEscrowPayment } = useWeb3();
    const cropId = searchParams.get('crop');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [crop, setCrop] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState(() => {
        if (!user?.address) return "";
        if (typeof user.address === 'string') return user.address;
        // Handle address object safely
        if (typeof user.address === 'object' && user.address !== null) {
            const { street, village, district, city, state, pincode, fullAddress } = user.address;
            if (fullAddress) return fullAddress;
            return [street, village, district, city, state, pincode].filter(Boolean).join(', ');
        }
        return "";
    });
    const [paymentMethod, setPaymentMethod] = useState("escrow");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [blockchainStatus, setBlockchainStatus] = useState("");

    useEffect(() => {
        if (cropId) {
            fetchCropDetails();
        } else {
            setError("No product identifier provided.");
            setLoading(false);
        }
    }, [cropId]);

    const fetchCropDetails = async () => {
        try {
            setLoading(true);
            const response = await cropApi.getDetails(cropId);
            if (response.data.success) {
                setCrop(response.data.data);
                // Set default quantity to min(100, available)
                setQuantity(Math.min(100, response.data.data.quantity));
            } else {
                setError("Product synchronization failure.");
            }
        } catch (err) {
            console.error("Fetch crop error:", err);
            setError("Security context violation or network failure.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (e) => {
        const val = parseInt(e.target.value);
        if (val < 1) setQuantity(1);
        else if (val > crop?.quantity) setQuantity(crop.quantity);
        else setQuantity(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError(null);
            setBlockchainStatus("");

            const inventoryCost = quantity * (crop?.price_per_unit || 0);
            const logisticsGap = 250;
            const platformFee = Math.round(inventoryCost * 0.02);
            const totalSettlementINR = inventoryCost + logisticsGap + platformFee;

            let blockchainTx = null;

            // 1. Handle Blockchain Escrow if selected
            if (paymentMethod === 'escrow') {
                if (!isConnected) {
                    setBlockchainStatus("Connecting to Wallet...");
                    await connectWallet();
                }

                // Verify the crop is on blockchain
                const bcProduceId = crop.traceability_id;
                if (!bcProduceId || isNaN(bcProduceId)) {
                    throw new Error("This product is not registered on the blockchain. Please use a standard bank protocol.");
                }

                setBlockchainStatus("Confirming Escrow Transaction...");
                // Simulated ETH conversion: ₹1000 = 0.001 ETH
                const amountInEth = (totalSettlementINR / 1000000).toFixed(4); // Very small for testing
                const finalEth = Math.max(parseFloat(amountInEth), 0.001); // Minimum 0.001 ETH

                const receipt = await processEscrowPayment(bcProduceId, finalEth);
                blockchainTx = {
                    hash: receipt.transactionHash,
                    block: receipt.blockNumber,
                    amountEth: finalEth
                };
                setBlockchainStatus("Payment Locked in Escrow!");
            }

            // 2. Place order in backend
            const orderData = {
                cropId,
                quantity,
                deliveryAddress,
                paymentMethod,
                notes,
                blockchainTx // Pass the TX details
            };

            const response = await retailerApi.placeOrder(orderData);
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/retailer/orders'), 3000);
            } else {
                setError(response.data.message || "Procurement protocol failed.");
            }
        } catch (err) {
            console.error("Order submission error:", err);
            setError(err.message || "Internal system error during settlement.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <RetailerLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Product Ledger...</p>
                </div>
            </RetailerLayout>
        );
    }

    if (success) {
        return (
            <RetailerLayout>
                <div className="max-w-[600px] mx-auto py-20 text-center space-y-10 animate-in zoom-in duration-500">
                    <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">TRANSACTION SECURED</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Your procurement protocol has been initialized and recorded on the ledger.</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-emerald-100 flex items-center justify-center gap-4">
                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Redirecting to Logistics Terminal...</span>
                    </div>
                </div>
            </RetailerLayout>
        );
    }

    const inventoryCost = quantity * (crop?.price_per_unit || 0);
    const logisticsGap = 250;
    const platformFee = Math.round(inventoryCost * 0.02);
    const totalSettlement = inventoryCost + logisticsGap + platformFee;

    return (
        <RetailerLayout>
            <div className="space-y-12 max-w-[900px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <Link to="/retailer/marketplace" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-all group">
                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> BACK TO DISCOVERY NODE
                    </Link>
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="h-2 w-12 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Procurement Finalization</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight text-slate-800">
                            Secure Settlement
                        </h1>
                        <p className="text-xl font-bold text-slate-500 mt-2">Initialize supply chain protocol and verify financial transparency.</p>
                    </div>
                </div>

                {error && (
                    <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] flex items-center gap-6 animate-in shake duration-500">
                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-red-900 uppercase tracking-widest">Protocol Violation</h4>
                            <p className="text-red-700/80 font-bold text-sm tracking-tight">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] p-12 sm:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-12">
                    {/* Crop Summary */}
                    <div className="flex flex-col sm:flex-row items-center gap-10 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200/60 group hover:border-emerald-500/20 transition-all shadow-sm">
                        <div className="h-24 w-24 bg-white rounded-[1.5rem] overflow-hidden flex items-center justify-center text-5xl shadow-xl border border-white group-hover:scale-105 transition-transform duration-500">
                            {crop?.images?.[0] ? (
                                <img src={crop.images?.[0]?.url || crop.images?.[0]} alt={crop.name} className="w-full h-full object-cover" />
                            ) : "🌾"}
                        </div>
                        <div className="text-center sm:text-left space-y-2">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight capitalize">{crop?.name}</h3>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <StatusBadge status={crop?.variety || "Premium"} />
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin: {crop?.farm_location?.district || "Regional"}</span>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Grade A+</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Procurement Quantity ({crop?.unit})</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-full py-6 px-10 bg-slate-50 rounded-[1.8rem] border-2 border-slate-100 font-black text-slate-800 focus:outline-none focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all text-xl"
                                    max={crop?.quantity}
                                    min={1}
                                />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Available: {crop?.quantity}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Wholesale Valuation</label>
                            <div className="py-6 px-10 bg-slate-100/30 rounded-[1.8rem] border-2 border-slate-100 font-black text-slate-400 text-xl tracking-tight">₹{crop?.price_per_unit} / {crop?.unit}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3 ml-2">
                            <MapPin className="h-4 w-4 text-emerald-500" /> Terminal Logistics Destination
                        </label>
                        <textarea
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            rows={3}
                            placeholder="ENTER PRECISE DELIVERY COORDINATES AND FACILITY DETAILS..."
                            className="w-full p-10 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 font-bold text-slate-700 focus:outline-none focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all resize-none shadow-sm uppercase text-sm tracking-tight"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3 ml-2">
                            <CreditCard className="h-4 w-4 text-emerald-500" /> Settlement Architecture
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'escrow', label: 'IMMUTABLE ESCROW', desc: 'Secure blockchain settlement (Recommended)', icon: Shield },
                                { id: 'bank', label: 'DIRECT TRANSFER', desc: 'Standard regional bank protocol', icon: CreditCard }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(item.id)}
                                    className={`p-8 rounded-[2rem] border-2 transition-all text-left flex items-start gap-4 ${paymentMethod === item.id ? 'bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-500/10' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                >
                                    <div className={`mt-1 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === item.id ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === item.id ? 'text-emerald-700' : 'text-slate-800'}`}>{item.label}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fiscal Manifest */}
                    <div className="p-12 sm:p-16 bg-slate-900 rounded-[3rem] text-white shadow-2xl shadow-emerald-900/20 space-y-10 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]" />
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                            <div className="h-1 w-6 bg-emerald-500 rounded-full" /> FISCAL SETTLEMENT MANIFEST
                        </h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory Asset ({quantity} {crop?.unit} × ₹{crop?.price_per_unit})</span>
                                <span className="text-lg font-black text-white tracking-tight">₹{inventoryCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logistics Dispatch Node</span>
                                <span className="text-lg font-black text-white tracking-tight">₹{logisticsGap.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Protocol Assurance (2%)</span>
                                <span className="text-lg font-black text-white tracking-tight">₹{platformFee.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/10 my-8" />
                            <div className="flex justify-between items-center px-6">
                                <div className="space-y-1">
                                    <span className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">NET SETTLEMENT</span>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Values synchronized with regional indices</p>
                                </div>
                                <span className="text-5xl font-black text-white tracking-tighter">₹{totalSettlement.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-emerald-500/5 border-2 border-emerald-500/20 flex flex-col sm:flex-row items-center gap-8 group">
                        <div className="h-20 w-20 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <div className="space-y-2 text-center sm:text-left text-sm">
                            <p className="font-black text-slate-800 uppercase tracking-widest leading-none mb-2">Immutable Assurance Activated</p>
                            <p className="text-slate-500 font-bold leading-relaxed">
                                This transaction is governed by smart-contract logic. Funds are locked in a regional escrow node and only disbursed upon cryptographically verified proof-of-delivery from your terminal.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-4 group"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                                INITIALIZING PROTOCOL...
                            </>
                        ) : (
                            <>
                                <Leaf className="h-6 w-6 group-hover:rotate-12 transition-transform duration-500" />
                                VALIDATE & EXECUTE PROCUREMENT
                            </>
                        )}
                    </button>
                    <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">- Authorized Digital Signature Required -</p>
                </form>
            </div>
        </RetailerLayout>
    );
}
