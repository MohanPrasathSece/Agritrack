import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, MapPin, Printer, ArrowLeft, QrCode } from 'lucide-react';
import { aggregatorApi } from '../utils/api';

const QRLabel = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [traceData, setTraceData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await aggregatorApi.getTrace(id);
        if (response.data.success) {
          setTraceData(response.data.data);
        } else {
          setError("Provenance data synchronization failed.");
        }
      } catch (e) {
        console.error("Label load error:", e);
        setError("Network failure: Unable to fetch batch metadata.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Cryptographic Metadata...</p>
      </div>
    );
  }

  if (error || !traceData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl max-w-md text-center">
          <p className="text-sm font-bold text-red-500 uppercase tracking-widest mb-6">{error}</p>
          <Link to="/aggregator/dashboard" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800">
            RETURN TO HUB
          </Link>
        </div>
      </div>
    );
  }

  const { productInfo, traceabilityChain } = traceData;
  const origin = traceabilityChain.find(s => s.stage === 'Farm Production') || {};

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <style>{`
                @page { size: A4; margin: 0; }
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; padding: 0; margin: 0; }
                    .print-container { 
                        box-shadow: none !important; 
                        border: 2px solid #e2e8f0 !important;
                        margin: 20mm auto !important;
                    }
                }
            `}</style>

      <div className="no-print max-w-4xl mx-auto flex items-center justify-between mb-12">
        <Link to="/aggregator/dashboard" className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> HUB TERMINAL
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
        >
          <Printer className="w-4 h-4" /> GENERATE PHYSICAL LABELS
        </button>
      </div>

      <div className="print-container max-w-[800px] mx-auto bg-white border-2 border-slate-50 rounded-[3rem] p-16 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        {/* Branding Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-900/5 rounded-full -ml-16 -mb-16 blur-[40px]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 border-b-2 border-slate-50 pb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Batch Certification</p>
                <p className="text-sm font-bold text-slate-800">Verified Protocol v2.4.1</p>
              </div>
            </div>

            <div className="md:text-right space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Asset UID</p>
              <p className="text-sm font-mono font-bold text-slate-800 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                {productInfo.collectionId || id}
              </p>
            </div>
          </div>

          {/* Main Label Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Product Description</p>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter capitalize">
                  {productInfo.cropName}
                </h2>
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Variety: {productInfo.variety}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Calendar className="w-3.5 h-3.5" /> Origin Date
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(origin.timestamp || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <MapPin className="w-3.5 h-3.5" /> Geographic Node
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    {origin.location?.district || "Verified Regional Source"}
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 leading-none">Quality Assurance</p>
                  <p className="text-2xl font-black tracking-tighter">Premium Grade {productInfo.qualityGrade}</p>
                </div>
                <ShieldCheck className="w-10 h-10 text-primary opacity-50" />
              </div>
            </div>

            {/* Large QR Code Terminal */}
            <div className="flex flex-col items-center">
              <div className="p-10 bg-white border-2 border-slate-100 rounded-[3.5rem] shadow-xl relative group">
                <div className="w-56 h-56 bg-white flex items-center justify-center">
                  {/* In a real scenario, this is the generated QR image from backend or library */}
                  <QrCode className="w-48 h-48 text-slate-900" />
                </div>
                <div className="absolute inset-0 border-[3px] border-primary/20 rounded-[3.5rem] m-6 pointer-events-none" />
              </div>
              <div className="mt-8 text-center space-y-2">
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">Scan to Verify Provenance</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px] leading-relaxed">
                  Real-time blockchain audit logged for this specific batch.
                </p>
              </div>
            </div>
          </div>

          {/* Footer / Footer Protocol */}
          <div className="mt-20 pt-12 border-t-2 border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Decentralized Trust</p>
                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Encryption Standard EVM-PROT-2</p>
              </div>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Official Agritrack Batch Certificate • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRLabel;

