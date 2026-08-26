import React, { useState, useRef, useEffect } from "react";
import { QrCode, Camera, CheckCircle2, Loader2, X, Package, User, MapPin, ShieldCheck, Zap, AlertCircle, ArrowLeft, Activity, Fingerprint, Sparkles, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aggregatorApi } from "../../utils/api";
import { formatLocation } from "../../utils/format";

export default function AggregatorQRScanner() {
    const navigate = useNavigate();
    const [scannedData, setScannedData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [manualCode, setManualCode] = useState("");
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
            setError("Camera access denied. Please enter the code manually.");
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
                    address: {
                        village: "Pollachi",
                        district: "Coimbatore",
                        state: "Tamil Nadu",
                        pincode: "642001",
                        fullAddress: "45, Green Field Farm, Pollachi, Tamil Nadu"
                    }
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

    const handleScan = async (code) => {
        setLoading(true);
        setError(null);
        try {
            // First, check if the code is a JSON string (from our dummy frontend generation)
            try {
                const parsed = JSON.parse(code || manualCode);
                if (parsed && (parsed.id || parsed.orderId)) {
                    // It's a valid JSON QR from our system
                    const mockData = {
                        farmer: {
                            name: parsed.farmer || "Kinathukadavu Producer",
                            address: {
                                village: "Kinathukadavu",
                                district: "Coimbatore",
                                state: "Tamil Nadu",
                                pincode: "642109",
                                fullAddress: "Kinathukadavu North, Coimbatore, Tamil Nadu"
                            }
                        },
                        crop: {
                            name: parsed.crop || "Premium Harvest",
                            variety: "Heirloom Organic",
                            quantity: parseInt(parsed.qty) || 500,
                            unit: parsed.qty?.split(' ')[1] || "KG",
                            traceabilityId: parsed.id || parsed.orderId || "TR-MATCHED-882",
                            harvestedDate: new Date().toISOString().split('T')[0],
                            quality: parsed.quality || "A++ (Premium)",
                            shippedDate: "2026-02-10",
                            sellDate: "2026-03-15",
                            location: "Kinathukadavu, Coimbatore"
                        }
                    };
                    setScannedData(mockData);
                    setIsScanning(false);
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                        setStream(null);
                    }
                    setLoading(false);
                    return;
                }
            } catch (e) {
                // Not a JSON string, proceed with API call
            }

            let location = { latitude: 0, longitude: 0 };
            try {
                const pos = await new Promise((res, rej) => {
                    navigator.geolocation.getCurrentPosition(res, rej);
                });
                location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
            } catch (e) {
                console.log("Location denied");
            }

            const response = await aggregatorApi.scanQR({
                qrCode: code || manualCode,
                scannedLocation: location
            });

            if (response.data.success) {
                setScannedData(response.data.data);
                setIsScanning(false);
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
            } else {
                setError(response.data.message || "Invalid QR Code");
            }
        } catch (err) {
            console.error("Scan error:", err);
            setError(err.response?.data?.message || "Failed to scan QR code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = () => {
        navigate('/aggregator/collect', { state: { cropData: scannedData } });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/aggregator/dashboard')}
                        className="p-5 bg-white border border-slate-100 rounded-[28px] hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">QR Scanner</h1>
                        <p className="text-sm text-slate-500">Scan farmer's QR code to collect their crops.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Scanner Status</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">Optimum</p>
                    </div>
                </div>
            </div>

            {!scannedData ? (
                <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white rounded-[56px] p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                        {/* Interactive Scan Window */}
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
                                    <div className="text-center p-12 space-y-6">
                                        <div className="w-28 h-28 bg-white rounded-[32px] flex items-center justify-center mx-auto shadow-sm border border-slate-100 group-hover/frame:scale-110 transition-transform duration-700 group-hover/frame:rotate-6">
                                            <QrCode className="h-14 w-14 text-slate-200" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] leading-tight max-w-[180px] mx-auto">Scan QR or enter traceability ID below</p>
                                    </div>
                                )}

                                {/* Scanning animation line */}
                                {isScanning && <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-scan-line z-20" />}

                                {/* Overlay corners */}
                                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-emerald-500/30 rounded-tl-2xl z-20" />
                                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-emerald-500/30 rounded-tr-2xl z-20" />
                                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-emerald-500/30 rounded-bl-2xl z-20" />
                                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-emerald-500/30 rounded-br-2xl z-20" />
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
                                    <span>AI Analyzing Product Image...</span>
                                </div>
                            )}

                            {error && (
                                <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[24px] flex items-center gap-4 text-red-600 text-[10px] font-bold uppercase tracking-widest animate-in shake duration-500">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                {!isScanning ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={startCamera}
                                                className="bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-[32px] text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-2"
                                            >
                                                <Camera className="h-5 w-5 text-emerald-500" /> Open Camera
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-600 py-5 rounded-[32px] text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <ImageIcon className="h-5 w-5 text-emerald-500" /> Upload Image
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-50"></div></div>
                                            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-6 text-slate-300">Alternate Entry</span></div>
                                        </div>

                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="ENTER FAST CODE"
                                                value={manualCode}
                                                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                                className="flex-1 bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500/20 focus:ring-8 focus:ring-emerald-500/5 transition-all uppercase placeholder:text-slate-300"
                                            />
                                            <button
                                                onClick={() => handleScan(manualCode)}
                                                disabled={loading || !manualCode}
                                                className="bg-emerald-500 text-white px-8 rounded-[24px] text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] animate-pulse">Scanning QR code...</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (stream) stream.getTracks().forEach(t => t.stop());
                                                setIsScanning(false);
                                            }}
                                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-6 rounded-[32px] text-[10px] font-bold uppercase tracking-[0.3em] transition-all active:scale-95"
                                        >
                                            <X className="h-4 w-4 inline mr-3" /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background Accents */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-slate-50 rounded-full group-hover:bg-blue-50/50 transition-colors duration-1000" />
                    </div>
                    <div className="flex items-center gap-4 px-10 py-5 bg-slate-900 rounded-[32px] text-white">
                        <Fingerprint className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-tight">Camera ready • Waiting for scan</span>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-700">
                    {/* Identification Banner */}
                    <div className="bg-emerald-500 rounded-[48px] p-12 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-emerald-500/30 relative overflow-hidden group">
                        <Sparkles className="absolute top-10 right-10 w-20 h-20 text-white/10 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="h-24 w-24 bg-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-emerald-600/20 order-2 md:order-1">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <div className="text-center md:text-left order-1 md:order-2 space-y-2">
                            <h2 className="text-4xl font-bold tracking-tighter">Crop Found</h2>
                            <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.3em]">Crop details successfully retrieved from the system</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Producer Meta */}
                        <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                                <User className="w-32 h-32" />
                            </div>
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                Farmer Details
                            </h2>
                            <div className="space-y-8">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Farmer Name</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{scannedData.farmer.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Farm Location</p>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <p className="text-sm font-bold text-slate-600 truncate">{formatLocation(scannedData.farmer.address)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-12">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Farmer Status</p>
                                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Verified</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                                        <p className="text-sm font-bold text-yellow-500">99.4/100</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cargo Meta */}
                        <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                                <Package className="w-32 h-32" />
                            </div>
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                Crop Details
                            </h2>
                            <div className="space-y-8">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Crop Name</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tight capitalize">{scannedData.crop.name} <span className="text-emerald-500 font-bold ml-1 text-base">({scannedData.crop.variety})</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Quantity</p>
                                    <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">{scannedData.crop.quantity} {scannedData.crop.unit}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tracking ID</p>
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <code className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{scannedData.crop.traceabilityId}</code>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Harvested Date</p>
                                        <p className="text-sm font-bold text-slate-900">{scannedData.crop.harvestedDate || "2026-01-10"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quality Score</p>
                                        <p className="text-sm font-bold text-emerald-600">{scannedData.crop.quality || "A+"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Shipped Date</p>
                                        <p className="text-sm font-bold text-slate-900">{scannedData.crop.shippedDate || "2026-02-05"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Sell Date</p>
                                        <p className="text-sm font-bold text-blue-600">{scannedData.crop.sellDate || "2026-03-25"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Protocol Commitment */}
                    <div className="bg-slate-900 rounded-[48px] p-12 flex flex-col sm:flex-row items-center justify-between gap-10 shadow-2xl shadow-slate-900/40">
                        <div className="flex items-center gap-8">
                            <div className="p-5 bg-white/5 border border-white/10 rounded-[28px]">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">System Status: Active</p>
                                <p className="text-sm text-white/50 font-bold uppercase tracking-widest">Ready to collect and process this crop.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button
                                onClick={handleFinalize}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-4 rounded-[28px] bg-white px-12 py-6 text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-emerald-400 active:scale-95"
                            >
                                <Zap className="w-5 h-5" /> Collect Crop
                            </button>
                            <button
                                onClick={() => setScannedData(null)}
                                className="px-10 rounded-[28px] bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
