import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  QrCode,
  Camera,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
  Upload,
  Brain,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiQualityApi } from '../utils/api';

const QRScanner = () => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const aiFileInputRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);

  const [supported, setSupported] = useState(false);
  const [error, setError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [scanStatus, setScanStatus] = useState(''); // 'scanning' | 'manual_needed' | ''

  // AI State
  const [activeTab, setActiveTab] = useState('trace');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiImagePreview, setAiImagePreview] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('General');

  const navigate = useNavigate();

  useEffect(() => {
    const isSupported = 'BarcodeDetector' in window && typeof window.BarcodeDetector === 'function';
    setSupported(isSupported);
    window.scrollTo(0, 0);
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDetectedCode = (raw) => {
    let code = raw;
    if (raw.includes('/trace/')) {
      const parts = raw.split('/trace/');
      code = parts[parts.length - 1];
    }
    if (code) {
      stopCamera();
      navigate(`/trace/${encodeURIComponent(code)}`);
    }
  };

  const startScanning = async () => {
    try {
      setIsInitializing(true);
      setError('');
      setScanStatus('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);

        if (supported) {
          setScanStatus('scanning');
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const scanLoop = async () => {
            if (!videoRef.current || !videoRef.current.srcObject || videoRef.current.paused) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                handleDetectedCode(barcodes[0].rawValue);
                return;
              }
            } catch (err) { /* ignore per-frame errors */ }
            animFrameRef.current = requestAnimationFrame(scanLoop);
          };
          animFrameRef.current = requestAnimationFrame(scanLoop);
        } else {
          // BarcodeDetector not supported — camera still shows, but user must manually enter
          setScanStatus('manual_needed');
        }
      }
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else {
        setError(err.message || 'Could not access camera.');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setScanStatus('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!supported) {
      setError('QR code detection is not supported in your browser. Please use Chrome or Edge, or enter the tracking ID manually.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const barcodes = await detector.detect(bitmap);
      if (barcodes.length > 0) handleDetectedCode(barcodes[0].rawValue);
      else setError('No valid QR code found in the image.');
    } catch (err) { setError('Failed to process image. Please try a clearer photo.'); }
  };

  const handleAiAnalysis = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAiImagePreview(URL.createObjectURL(file));
    setAiLoading(true);
    setAiResult(null);
    setError('');
    try {
      const formData = new FormData();
      formData.append('images', file);
      formData.append('cropType', selectedCrop);
      const response = await aiQualityApi.analyze(formData);
      if (response.data.success) setAiResult(response.data.analysis);
      else setError('AI Analysis failed.');
    } catch (err) { setError('AI service unavailable.'); }
    finally { setAiLoading(false); }
  };

  const handleManualNavigate = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      stopCamera();
      navigate(`/trace/${encodeURIComponent(manualCode.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side: Brand Visual */}
      <div className="hidden lg:flex w-1/3 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=2070"
            className="w-full h-full object-cover"
            alt="Agricultural Landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-transparent to-emerald-950/30" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-16">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 transition-all">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-white font-bold uppercase tracking-widest text-[11px]">Transparency Tool</span>
          </Link>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h1 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">
                Product <br />
                <span className="text-emerald-500">History.</span>
              </h1>
              <p className="text-slate-400 text-base font-medium max-w-xs leading-relaxed">
                Scan any Agritrack QR code to view its full journey and quality reports.
              </p>
            </motion.div>
          </div>

          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            © 2026 Agritrack
          </div>
        </div>
      </div>

      {/* Right Side: Functionality */}
      <div className="flex-1 min-h-screen relative flex items-center justify-center bg-white p-6 md:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-xl space-y-12">

          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-5xl font-bold text-slate-900 tracking-tight uppercase leading-none">Scan Tool</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify product source and specs</p>
              </div>
              <Link to="/" className="lg:hidden text-emerald-500">
                <ShieldCheck className="w-10 h-10" />
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm">
              <button
                onClick={() => setActiveTab('trace')}
                className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'trace' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Track History
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                AI Grading
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'trace' ? (
              <motion.div key="trace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                {/* Scanner View */}
                <div className="aspect-square rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden relative flex flex-col items-center justify-center p-10">
                  {isCameraActive ? (
                    <div className="w-full h-full relative">
                      <video ref={videoRef} className="w-full h-full object-cover rounded-[2rem]" muted playsInline />

                      {/* Scanning overlay */}
                      {scanStatus === 'scanning' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <div className="w-48 h-48 border-2 border-emerald-400 rounded-2xl relative">
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400 animate-ping opacity-70" />
                          </div>
                          <p className="mt-4 text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            Point at QR Code
                          </p>
                        </div>
                      )}

                      {/* Browser doesn't support BarcodeDetector — show notice */}
                      {scanStatus === 'manual_needed' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none">
                          <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-5 py-3 max-w-xs text-center">
                            <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-1">Auto-scan unavailable</p>
                            <p className="text-white/60 text-[9px] leading-relaxed">Your browser doesn't support QR detection. Use Chrome or Edge for auto-scan, or enter the tracking ID below manually.</p>
                          </div>
                        </div>
                      )}

                      <button onClick={stopCamera} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">
                        <X className="w-5 h-5 text-slate-900" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-8 w-full max-w-xs">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto">
                        {isInitializing ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : <Camera className="w-8 h-8 text-emerald-500" />}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">QR Scanner</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {supported ? 'Enable camera to auto-scan' : 'Enter tracking ID below'}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={startScanning}
                          disabled={isInitializing}
                          className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          {isInitializing ? 'Starting...' : 'Open Camera'}
                        </button>
                        {supported && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 border border-slate-100 bg-white text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                          >
                            Upload QR Image
                          </button>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Entry */}
                <div className="space-y-6 pt-10 border-t border-slate-50">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4">Manual Entry</label>
                    <form onSubmit={handleManualNavigate} className="space-y-3">
                      <div className="relative">
                        <QrCode className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          placeholder="Paste or type tracking ID here"
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                          className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!manualCode.trim()}
                        className="w-full py-5 bg-white border border-slate-100 text-slate-800 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:text-emerald-600 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        Track Product <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4">Select Crop</label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 appearance-none"
                    >
                      <option>General</option>
                      <option>Rice (Paddy)</option>
                      <option>Wheat</option>
                      <option>Maize</option>
                    </select>
                  </div>

                  <div
                    onClick={() => aiFileInputRef.current?.click()}
                    className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${aiImagePreview ? 'border-emerald-500 py-0' : 'border-slate-100 bg-slate-50 py-6'}`}
                  >
                    <input type="file" ref={aiFileInputRef} onChange={handleAiAnalysis} className="hidden" accept="image/*" />
                    {aiImagePreview ? (
                      <img src={aiImagePreview} className="w-full h-full object-cover rounded-xl" alt="preview" />
                    ) : (
                      <div className="text-center space-y-3">
                        <Upload className="w-6 h-6 text-slate-300 mx-auto" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Upload Photo</p>
                      </div>
                    )}
                  </div>
                </div>

                {aiLoading ? (
                  <div className="p-10 bg-slate-900 rounded-3xl text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Analyzing Quality Standards...</p>
                  </div>
                ) : aiResult ? (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl space-y-10">
                      <div className="space-y-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Analysis Result</p>
                        <h3 className="text-7xl font-bold text-slate-900 tracking-tighter uppercase leading-none">
                          Grade <span className="text-emerald-500 italic">{aiResult.overallGrade}</span>
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quality Score</p>
                          <p className="text-2xl font-bold text-slate-900 tracking-tight">{aiResult.qualityScore}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expected Price</p>
                          <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{aiResult.marketRecommendation?.suggestedPrice}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-48 rounded-3xl border-2 border-dashed border-slate-50 flex flex-col items-center justify-center text-center p-10 opacity-30">
                    <Brain className="w-10 h-10 text-slate-200 mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waiting for input</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-tight flex-1">{error}</p>
              <button onClick={() => setError('')} className="opacity-50 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="pt-10 flex items-center justify-between border-t border-slate-50">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Agritrack Transparency v4.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
