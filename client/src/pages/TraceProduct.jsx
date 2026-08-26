import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatLocation } from '../utils/format';
import {
  ShieldCheck,
  MapPin,
  History,
  Package,
  Truck,
  Boxes,
  Loader2,
  Lock,
  Globe,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { aggregatorApi } from '../utils/api';
import LandingFooter from '../components/landing/LandingFooter';

const TraceProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [traceData, setTraceData] = useState(null);

  useEffect(() => {
    const fetchTrace = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await aggregatorApi.getTrace(id);
        if (response.data.success) {
          setTraceData(response.data.data);
        } else {
          setError("Record not found. Please check the tracking ID.");
        }
      } catch (e) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrace();
    window.scrollTo(0, 0);
  }, [id]);

  const getIcon = (stage) => {
    const lower = stage.toLowerCase();
    if (lower.includes('farm') || lower.includes('producer')) return History;
    if (lower.includes('collection') || lower.includes('intake')) return ShieldCheck;
    if (lower.includes('quality') || lower.includes('verification')) return Package;
    if (lower.includes('storage')) return MapPin;
    if (lower.includes('retailer') || lower.includes('market')) return Boxes;
    return Truck;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-6" />
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Accessing Records</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tracking Product Journey...</h2>
        </div>
      </div>
    );
  }

  if (error || !traceData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center space-y-12">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto border border-red-100">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight capitalize">History Not Found</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              {error || "The tracking ID entered does not exist in our systems."}
            </p>
          </div>
          <Link to="/trace" className="block w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:translate-y-0">
            Back to Scanner
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Trace Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/trace" className="p-3 hover:bg-slate-50 rounded-xl transition-all group">
            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
          </Link>
          <div className="text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Product Identity</p>
            <h1 className="text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">{traceData.product.name}</h1>
          </div>
          <div className="w-11" />
        </div>
      </div>

      <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Product Info Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-emerald-500/10">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Rating</p>
                  <h3 className="text-5xl font-bold text-slate-900 tracking-tighter italic">Grade {traceData.product.quality_grade || 'A'}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                    <span className="text-xs font-bold text-slate-900">{traceData.product.quantity} KG</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origin</span>
                    <span className="text-xs font-bold text-slate-900">{traceData.product.origin}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blockchain ID</span>
                    <span className="text-[10px] font-bold text-emerald-600 truncate max-w-[80px]">{id.slice(0, 10)}...</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Transparency Data</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                This product has been verified through a decentralized ledger system, ensuring that the origin and handling data are immutable and authentic.
              </p>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Verified Journey</span>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Timeline</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Farm to Market Track</p>
              </div>
            </div>

            <div className="space-y-0 relative">
              <div className="absolute left-[27px] top-4 bottom-4 w-px bg-slate-200" />

              {traceData.history.map((step, index) => {
                const Icon = getIcon(step.stage);
                return (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="relative pl-20 pb-12 last:pb-0 group"
                  >
                    <div className="absolute left-0 top-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center z-10 group-hover:bg-slate-900 group-hover:text-white transition-all cursor-default">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{step.stage}</h4>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                          {new Date(step.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                        <div className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                          <MapPin className="w-3 h-3" />
                          {typeof step.location === 'object' ? (step.location?.fullAddress || step.location?.village + ', ' + step.location?.district + ', ' + step.location?.state) : (step.location || 'Unknown Location')}
                        </div>
                        <div className="flex items-center gap-1.5 opacity-50">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Info
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default TraceProduct;
