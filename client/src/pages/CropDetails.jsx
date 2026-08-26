import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { formatLocation } from '../utils/format';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  QrCode,
  User,
  BadgeCheck,
  Wheat,
  IndianRupee,
  Share2,
  Heart,
  Activity,
  ChevronRight,
  FileText,
  Phone,
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/v1';

const CropDetails = () => {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState({ imageUrl: '', code: '' });
  const [qrLoading, setQrLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crops')
          .select(`
            *,
            profiles:farmer_id (*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        setCrop({
          ...data,
          pricePerUnit: data.price_per_unit,
          farmer: {
            id: data.profiles?.id,
            name: data.profiles?.name,
            phone: data.profiles?.phone,
            email: data.profiles?.email,
            location: data.profiles?.address?.district || 'Unknown',
            avatar: data.profiles?.avatar_url
          },
          location: data.farm_location?.village || data.profiles?.address?.district || 'Unknown',
          harvestDate: data.harvest_date,
          organicCertified: data.is_organic,
          description: data.description || `Fresh ${data.name} harvested from our farms in ${data.profiles?.address?.district || 'Odisha'}. Quality guaranteed.`,
          images: data.images?.map(img => typeof img === 'string' ? img : img.url) || [],
          blockchainHash: data.blockchain_hash,
          qrCode: data.traceability_id
        });

        if (data.traceability_id) {
          setQr(prev => ({ ...prev, code: data.traceability_id }));
        }

      } catch (error) {
        console.error('Failed to fetch crop:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCrop();
  }, [id]);

  const handleGenerateQR = async () => {
    try {
      setQrLoading(true);
      const res = await fetch(`${API_BASE}/qr/generate/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to generate QR');
      setQr({ imageUrl: json.qr.imageUrl, code: json.qr.code });
    } catch (e) {
      console.error(e);
    } finally {
      setQrLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading crop details...</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Crop Not Found</h2>
          <p className="text-sm text-slate-500 mb-8">This listing may have been sold or removed.</p>
          <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-wider text-xs shadow-md">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 animate-in fade-in duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Photos & description */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 overflow-hidden">
              <div className="relative aspect-video bg-slate-50 rounded-xl overflow-hidden mb-4">
                <img
                  src={crop.images[activeImage] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000'}
                  className="w-full h-full object-cover"
                  alt={crop.name}
                />
                {crop.organicCertified && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg shadow-md border border-white/20">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Organic Certified</span>
                  </div>
                )}
              </div>

              {crop.images.length > 1 && (
                <div className="flex gap-3 px-2 pb-2 overflow-x-auto no-scrollbar">
                  {crop.images.map((image, index) => (
                    <button
                      key={index} onClick={() => setActiveImage(index)}
                      className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === index ? 'border-emerald-500 shadow-sm' : 'border-slate-50 opacity-60'}`}
                    >
                      <img src={image} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4 pt-6 space-y-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Harvest Metadata</h3>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight capitalize mb-4">{crop.name}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{crop.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "Harvest Date", val: new Date(crop.harvestDate).toLocaleDateString(), icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
                { title: "Location", val: crop.location, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
                { title: "Status", val: "Available", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4 border border-current/10`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.title}</h4>
                  <p className="text-sm font-bold text-slate-900 tracking-tight">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Checkout Side */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 font-bold">Verified Listing</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase leading-none">{crop.name}</h1>
                  <p className="text-sm font-semibold text-slate-400 tracking-tight uppercase mt-1">{crop.variety}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Price Per Unit</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-slate-900 flex items-center tracking-tighter leading-none">
                    <IndianRupee className="h-8 w-8 text-emerald-600" /> {crop.pricePerUnit}
                  </span>
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">/ {crop.unit}</span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Volume</span>
                  <span className="text-sm font-bold text-slate-800">{crop.quantity} {crop.unit}</span>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <div className="flex justify-between items-end pt-2">
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Est. Min Value</span>
                  <span className="text-2xl font-bold text-emerald-600 tracking-tight">₹{crop.pricePerUnit * 10}</span>
                </div>
              </div>

              <div className="grid gap-3">
                <Link to={`/checkout/${id}`}>
                  <button className="w-full h-14 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    Execute Purchase <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <button className="w-full h-12 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Contact Farmer
                </button>
              </div>
            </div>

            {/* Farmer Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Producer Node</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {crop.farmer.avatar ? <img src={crop.farmer.avatar} className="w-full h-full object-cover" alt="" /> : <User className="h-6 w-6 text-slate-300" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg tracking-tight uppercase flex items-center gap-2">
                    {crop.farmer.name} <BadgeCheck className="h-4 w-4 text-emerald-500" />
                  </h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{formatLocation(crop.farmer.location)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 p-3 bg-slate-50 rounded-lg">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" /> {crop.farmer.phone || "---"}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 p-3 bg-slate-50 rounded-lg">
                  <Mail className="h-3.5 w-3.5 text-emerald-500" /> {crop.farmer.email}
                </div>
              </div>
            </div>

            {/* Trust Ledger Card */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-lg space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-emerald-500 uppercase tracking-widest text-[10px]">Blockchain Protocol</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-bold tracking-widest text-emerald-400">
                  <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" /> LIVE
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 shadow-xl overflow-hidden">
                  {qr.imageUrl ? <img src={qr.imageUrl} alt="QR" className="w-full h-full object-contain" /> : <QrCode className="h-10 w-10 text-slate-200" onClick={handleGenerateQR} />}
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Traceability ID</p>
                  <p className="font-mono text-[10px] text-emerald-500 break-all bg-white/5 p-2 rounded-lg border border-white/5 underline">
                    {qr.code || crop.qrCode || 'Waiting...'}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 pt-4 border-t border-white/10">
                <Link to={`/trace/${id}`} className="w-full">
                  <button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" /> Audit Journey
                  </button>
                </Link>
                {crop.blockchainHash && (
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[9px] text-emerald-500/60 break-all">
                    BLOCK_TX: {crop.blockchainHash}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
