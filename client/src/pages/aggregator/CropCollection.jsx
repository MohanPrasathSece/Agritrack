import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  Package,
  MapPin,
  Loader2,
  ArrowLeft,
  Shield,
  Activity,
  Calendar,
  Wheat,
  FileText
} from 'lucide-react';
import { aggregatorApi } from '../../utils/api';
import { formatLocation } from '../../utils/format';

const CropCollection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cropData = location.state?.cropData;

  const [formData, setFormData] = useState({
    locationAddress: cropData?.farmer?.address?.street || cropData?.farmer?.address || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!cropData) {
      navigate('/aggregator/dashboard');
    }
  }, [cropData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.locationAddress) {
      setError("Location address is required.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        cropId: cropData.crop.id,
        quantity: parseFloat(cropData?.crop?.quantity) || 100,
        unit: cropData?.crop?.unit || 'kg',
        totalAmount: parseFloat(cropData?.crop?.expectedPrice) || 0,
        deliveryAddress: {
          farmAddress: formData.locationAddress,
          district: cropData?.crop?.farmLocation?.district || '',
          state: cropData?.crop?.farmLocation?.state || '',
        },
        notes: 'Order placed via marketplace',
      };

      const response = await aggregatorApi.placeOrder(payload);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/aggregator/dashboard');
        }, 3000);
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-emerald-50 rounded-[48px] flex items-center justify-center shadow-2xl shadow-emerald-500/10 border border-emerald-100 relative">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-[48px] animate-ping" />
          <CheckCircle className="w-16 h-16 text-emerald-500 relative z-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">Collection Successful</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Crop has been added to your inventory</p>
        </div>
        <div className="flex items-center gap-4 px-10 py-5 bg-slate-900 rounded-[32px] text-white shadow-2xl shadow-slate-900/20">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Redirecting to Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-5 bg-white border border-slate-100 rounded-[28px] hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Buy Crop</h1>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
              <Package className="w-4 h-4 text-emerald-500" />
              Complete your purchase securely
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</p>
            <p className="text-sm font-bold text-slate-900 mt-1">Ready to Buy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          {/* Quality Report Card */}
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-[0.1em] mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
              <FileText className="w-6 h-6 text-blue-500" />
              Quality Report
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 mt-6">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" /> Date of Listed
                </p>
                <p className="text-xl font-black text-slate-800 tracking-tight mt-1">
                  {new Date(cropData?.crop?.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" /> Quality Grade
                </p>
                <p className="px-5 py-2 mt-2 bg-emerald-50 text-emerald-600 text-[13px] font-black rounded-xl uppercase tracking-widest inline-block border border-emerald-100">
                  {cropData?.crop?.quality && typeof cropData.crop.quality === 'object' 
                    ? (cropData.crop.quality.grade || cropData.crop.quality.overallGrade || 'A') 
                    : (cropData?.crop?.quality || 'Organic Premium')}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-amber-500" /> Crop Details
                </p>
                <p className="text-xl font-bold text-slate-800 capitalize leading-relaxed mt-1">
                  {cropData?.crop?.name} <span className="text-base text-slate-500">({cropData?.crop?.variety || 'Standard Produce'})</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" /> Location of Produce
                </p>
                <p className="text-[15px] font-bold text-slate-600 leading-relaxed mt-1">
                  {formatLocation(cropData?.farmer?.address)}
                </p>
              </div>
            </div>
          </div>

          {/* Simple Form */}
          <form id="buy-form" onSubmit={handleSubmit} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-[0.1em] mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
              <MapPin className="w-6 h-6 text-emerald-500" />
              Delivery Action
            </h2>
            <div className="space-y-4 mt-6">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Location Address</label>
              <textarea
                required
                value={formData.locationAddress}
                onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                placeholder="Enter complete collection location address..."
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 px-6 text-[15px] font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500/20 focus:ring-8 focus:ring-emerald-500/5 transition-all min-h-[140px] resize-none"
              />
            </div>
            {error && (
              <div className="mt-6 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-[11px] font-bold uppercase tracking-widest leading-tight">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30 sticky top-12">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
            <div className="relative z-10 space-y-10">
              <div>
                <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-2">Order Summary</h3>
                <h4 className="text-3xl font-black tracking-tighter capitalize">{cropData?.crop?.name}</h4>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-[15px] font-bold">
                  <span className="text-slate-400">Total Price</span>
                  <span className="text-white text-2xl tracking-tighter text-emerald-400">₹{parseFloat(cropData?.crop?.expectedPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold pt-4 border-t border-white/5">
                  <span className="text-slate-400">Farmer</span>
                  <span className="text-white">{cropData?.farmer?.name || 'Verified Farmer'}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-white">{cropData?.crop?.quantity} {cropData?.crop?.unit}</span>
                </div>
              </div>

              <button
                type="submit"
                form="buy-form"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-6 rounded-3xl text-[13px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCollection;
