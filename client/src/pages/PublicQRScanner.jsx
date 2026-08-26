import React, { useState, useRef, useEffect } from "react";
import { QrCode, Camera, CheckCircle2, Loader2, X, Package, User, MapPin, ShieldCheck, Zap, AlertCircle, ArrowLeft, Activity, Fingerprint, Sparkles, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";

export default function PublicQRScanner() {
    const navigate = useNavigate();
    const [scannedData, setScannedData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsScanning(true);
            setError(null);
        } catch (err) {
            console.error("Camera error:", err);
            setError("Camera access denied. Please upload an image or enter code manually.");
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploadingImage(true);
        setError(null);
        
        // Mocking image scanning process
        setTimeout(() => {
            const dummyData = {
                farmer: {
                    name: "Mohan Prasath",
                    address: "Pollachi, Coimbatore, Tamil Nadu"
                },
                crop: {
                    name: "Organic Tomato",
                    variety: "Vikas Hybrid",
                    quantity: 500,
                    unit: "KG",
                    traceabilityId: "CROP-TN-2026-9921",
                    harvestedDate: "2026-01-15",
                    quality: "A++ (Premium)",
                    shippedDate: "2026-01-20",
                    sellDate: "2026-03-10",
                    location: "Coimbatore, Tamil Nadu"
                }
            };
            setScannedData(dummyData);
            setUploadingImage(false);
        }, 2000);
    };

    const handleScanMock = () => {
        setLoading(true);
        setTimeout(() => {
            const dummyData = {
                farmer: {
                    name: "Mohan Prasath",
                    address: "Pollachi, Coimbatore, Tamil Nadu"
                },
                crop: {
                    name: "Organic Tomato",
                    variety: "Vikas Hybrid",
                    quantity: 500,
                    unit: "KG",
                    traceabilityId: "CROP-TN-2026-9921",
                    harvestedDate: "2026-01-15",
                    quality: "A++ (Premium)",
                    shippedDate: "2026-01-20",
                    sellDate: "2026-03-10",
                    location: "Coimbatore, Tamil Nadu"
                }
            };
            setScannedData(dummyData);
            setLoading(false);
            setIsScanning(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full relative">
            <LandingNavbar />
            
            <div className="pt-28 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/')}
                            className="p-5 bg-white border border-slate-100 rounded-[28px] hover:bg-slate-50 transition-all shadow-sm group"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                        </button>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Scan Products 🏷️</h1>
                            <p className="text-xs md:text-sm text-slate-500 font-medium font-inter-medium">Verify crop authenticity and traceability instantly.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Security Protocol</p>
                            <p className="text-sm font-black text-slate-900 mt-1 uppercase">Blockchain Verified</p>
                        </div>
                    </div>
                </div>

                {!scannedData ? (
                    <div className="max-w-xl mx-auto space-y-8">
                        <div className="bg-white rounded-[32px] md:rounded-[56px] p-6 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-full aspect-square max-w-[360px] mx-auto rounded-[48px] border-4 border-dashed border-slate-50 bg-slate-50 flex items-center justify-center mb-12 overflow-hidden relative group/frame">
                                    {isScanning ? (
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-cover scale-110"
                                        />
                                    ) : (
                                        <div className="text-center p-6 md:p-12 space-y-6">
                                            <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto shadow-sm border border-slate-100 group-hover/frame:scale-110 transition-transform duration-700 group-hover/frame:rotate-6">
                                                <QrCode className="h-10 w-10 md:h-14 md:w-14 text-slate-200" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] leading-tight max-w-[180px] mx-auto">Scan QR or Upload Image</p>
                                        </div>
                                    )}

                                    {isScanning && <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-scan-line z-20" />}
                                </div>

                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                />

                                {uploadingImage && (
                                    <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 rounded-[24px] flex items-center gap-4 text-emerald-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                        <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
                                        <span>AI Analyzing Product Authenticity...</span>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {!isScanning ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                onClick={startCamera}
                                                className="bg-slate-900 hover:bg-slate-800 text-white py-5 md:py-6 rounded-[24px] md:rounded-[32px] text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-2"
                                            >
                                                <Camera className="h-5 w-5 text-emerald-400" /> Open Camera
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-600 py-5 md:py-6 rounded-[24px] md:rounded-[32px] text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <ImageIcon className="h-5 w-5 text-emerald-500" /> Upload Image
                                            </button>
                                            <button
                                                onClick={handleScanMock}
                                                className="sm:col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white py-5 md:py-6 rounded-[24px] md:rounded-[32px] text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
                                            >
                                                Traceability Scan
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (stream) stream.getTracks().forEach(t => t.stop());
                                                setIsScanning(false);
                                            }}
                                            className="w-full bg-slate-100 text-slate-500 py-6 rounded-[32px] text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in zoom-in duration-700">
                        <div className="bg-emerald-600 rounded-[32px] md:rounded-[48px] p-6 md:p-12 text-white flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-2xl shadow-emerald-600/30 relative overflow-hidden group">
                            <Sparkles className="absolute top-10 right-10 w-20 h-20 text-white/10" />
                            <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-[24px] md:rounded-[32px] flex items-center justify-center shadow-2xl order-2 md:order-1">
                                <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-600" />
                            </div>
                            <div className="text-center md:text-left order-1 md:order-2 space-y-2">
                                <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase">Authenticity Verified ✅</h2>
                                <p className="text-[9px] md:text-[10px] text-white/80 font-bold uppercase tracking-[0.3em]">Direct link to Coimbatore Regional Node secured.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-slate-100 shadow-sm space-y-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Origin Details
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Producer</p>
                                        <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">{scannedData.farmer.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            <p className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-tight">{typeof scannedData.farmer.address === 'object' ? (scannedData.farmer.address?.fullAddress || scannedData.farmer.address?.village + ', ' + scannedData.farmer.address?.district + ', ' + scannedData.farmer.address?.state) : (scannedData.farmer.address || 'Unknown Location')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-slate-100 shadow-sm space-y-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Traceability Metrics
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Crop Name</p>
                                        <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">{scannedData.crop.name} <span className="text-emerald-500 font-bold text-base">({scannedData.crop.variety})</span></p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Harvested</p>
                                            <p className="text-sm font-black text-slate-900">{scannedData.crop.harvestedDate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quality</p>
                                            <p className="text-sm font-black text-emerald-600">{scannedData.crop.quality}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Shipped</p>
                                            <p className="text-sm font-black text-slate-900">{scannedData.crop.shippedDate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sell Date</p>
                                            <p className="text-sm font-black text-blue-600 uppercase">{scannedData.crop.sellDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => setScannedData(null)}
                                className="px-12 py-5 bg-slate-900 text-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
                            >
                                Scan Another Product
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                @keyframes scan-line {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan-line {
                    animation: scan-line 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
