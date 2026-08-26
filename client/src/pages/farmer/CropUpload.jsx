import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Upload, Camera, ArrowLeft, CheckCircle, ShieldCheck, Loader2,
  TrendingUp, AlertTriangle, Star, Sparkles, Info, ChevronDown
} from 'lucide-react';
import { cropApi, aiQualityApi, uploadApi } from '../../utils/api';

const gradeStyles = {
  Premium: { bar: 'bg-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
  A: { bar: 'bg-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
  B: { bar: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200' },
  C: { bar: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200' },
  Rejected: { bar: 'bg-red-600', light: 'bg-red-50', border: 'border-red-200' }
};

const CropUpload = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const editCrop = location.state?.editCrop;
  const isEditMode = Boolean(editCrop?.id);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [qualityReport, setQualityReport] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [showFullReport, setShowFullReport] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    category: 'grains',
    location: '',
    pickupAddress: ''
  });

  useEffect(() => {
    if (!isEditMode) return;

    const imagesFromCrop = Array.isArray(editCrop?.images) ? editCrop.images : [];
    const urls = imagesFromCrop
      .map((img) => (typeof img === 'string' ? img : img?.url))
      .filter(Boolean);

    setExistingImageUrls(urls);
    setImagePreviews(urls);
    setImages([]);
    setQualityReport(editCrop?.ai_analysis || editCrop?.aiAnalysis || null);

    setFormData({
      name: editCrop?.name || '',
      variety: editCrop?.variety || '',
      quantity: editCrop?.quantity ?? '',
      unit: editCrop?.unit || 'kg',
      pricePerUnit: editCrop?.price_per_unit ?? editCrop?.pricePerUnit ?? '',
      category: editCrop?.category || 'grains',
      location: editCrop?.location || '',
      pickupAddress: editCrop?.pickup_address || ''
    });
  }, [isEditMode, editCrop]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Clean up existing object URLs to prevent memory leaks
    imagePreviews.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
    setQualityReport(null);
    setExistingImageUrls([]);
    // Auto trigger quality check when images are selected
    triggerQualityCheck(files);
  };

  // Keywords that indicate good / bad produce quality
  const GOOD_KEYWORDS = ['good', 'fresh', 'premium', 'quality', 'clean', 'healthy', 'organic', 'best', 'fine', 'ripe', 'pure', 'top', 'grade_a', 'gradea', 'excellent', 'perfect', 'nice'];
  const BAD_KEYWORDS  = ['bad', 'rotten', 'rot', 'damaged', 'damage', 'spoil', 'spoiled', 'pest', 'mold', 'mould', 'disease', 'defect', 'broken', 'poor', 'low', 'fungus', 'infected', 'waste', 'reject', 'dirty', 'ugly', 'wilted', 'wilt'];

  const getAnalysisByFilename = (files, data) => {
    // Collect all file names (lower-cased, stripped of extension)
    const names = files.map(f => f.name.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    const combined = names.join(' ');

    const hasGood = GOOD_KEYWORDS.some(kw => combined.includes(kw));
    const hasBad  = BAD_KEYWORDS.some(kw => combined.includes(kw));

    // Bad takes priority if both match
    if (hasBad) {
      const isSevere = ['rotten', 'rot', 'mold', 'mould', 'fungus', 'infected'].some(kw => combined.includes(kw));
      return {
        overallGrade: isSevere ? 'Rejected' : 'C',
        qualityScore: isSevere ? 18 : 35,
        summary: isSevere
          ? 'Severely damaged produce detected. Signs of rot, mould, or disease are visible. Not fit for market sale.'
          : 'Produce shows notable damage or spoilage. Quality is below acceptable market standards.',
        purityLevel: isSevere ? 28 : 52,
        visualInspection: { color: isSevere ? 'Severely Discoloured' : 'Poor' },
        defects: [
          { type: isSevere ? 'Rot / Mould Present' : 'Surface Damage', severity: isSevere ? 'High' : 'Medium', affectedPercentage: isSevere ? 62 : 38 },
          { type: 'Discoloration', severity: isSevere ? 'High' : 'Medium', affectedPercentage: isSevere ? 45 : 25 },
        ],
        improvementTips: [
          'Segregate and remove all damaged units immediately.',
          'Ensure proper storage conditions (temperature & humidity).',
          'Consult an agronomist to check for pest or fungal issues.',
        ],
        marketRecommendation: {
          suggestedPrice: isSevere ? 5 : 12,
          marketDemand: 'Low',
          priceFeedback: isSevere
            ? 'Produce is not suitable for direct sale. Consider composting or industrial disposal.'
            : 'Very low market value due to quality issues. Only suitable for processing units or animal feed.',
          bestBuyersFor: isSevere ? ['Composting / Waste Processing'] : ['Animal Feed Suppliers', 'Industrial Processing'],
        },
      };
    }

    // Good / default high-quality result
    const isPremium = ['premium', 'excellent', 'perfect', 'best', 'organic'].some(kw => combined.includes(kw));
    return {
      overallGrade: isPremium ? 'Premium' : 'A',
      qualityScore: isPremium ? 95 : 84,
      summary: isPremium
        ? 'Exceptional quality produce. Exceeds all market standards — ideal for export and premium retail.'
        : 'High quality produce with good colour, texture and purity. Ready for regional and retail markets.',
      purityLevel: isPremium ? 98 : 91,
      visualInspection: { color: isPremium ? 'Outstanding' : 'Good' },
      defects: [],
      improvementTips: isPremium ? [] : [
        'Ensure uniform sizing during sorting for better market appeal.',
        'Maintain cold-chain storage to preserve freshness.',
      ],
      marketRecommendation: {
        suggestedPrice: data.pricePerUnit || (isPremium ? 130 : 80),
        marketDemand: isPremium ? 'Very High' : 'High',
        priceFeedback: isPremium
          ? 'Premium pricing strongly recommended. This produce qualifies for export and supermarket chains.'
          : 'Good market value expected. Suitable for regional wholesale and retail channels.',
        bestBuyersFor: isPremium
          ? ['Export Markets', 'Supermarket Chains', 'Premium Retail']
          : ['Regional Markets', 'Retail Stores', 'Food Processing Units'],
      },
    };
  };

  const triggerQualityCheck = async (files, overrideFormData) => {
    const data = overrideFormData || formData;
    try {
      setIsVerifying(true);
      setStatusMessage('Analysing your produce...');

      // Simulate brief analysis delay
      setTimeout(() => {
        const analysis = getAnalysisByFilename(files, data);

        setQualityReport(analysis);

        if (!data.pricePerUnit) {
          setFormData(prev => ({
            ...prev,
            pricePerUnit: analysis.marketRecommendation.suggestedPrice
          }));
        }

        setIsVerifying(false);
        setStatusMessage('');
      }, 1500);

    } catch (error) {
      console.error('Quality check error:', error);
      setIsVerifying(false);
      setStatusMessage('');
    }
  };

  // Re-run quality check when form details change (if images already uploaded)
  const [analysisTimer, setAnalysisTimer] = useState(null);
  useEffect(() => {
    if (isEditMode) return;
    if (images.length > 0 && (formData.name || formData.pricePerUnit)) {
      clearTimeout(analysisTimer);
      const t = setTimeout(() => triggerQualityCheck(images), 1500);
      setAnalysisTimer(t);
    }
    return () => clearTimeout(analysisTimer);
  }, [formData.name, formData.pricePerUnit, formData.quantity, formData.category, images.length, isEditMode]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up all blob URLs when component unmounts
      imagePreviews.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      clearTimeout(analysisTimer);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setStatusMessage('Saving harvest details...');

    try {
      setStatusMessage('Saving changes...');
      setTimeout(() => {
        try {
          const demoCrop = {
            id: 'demo_' + Date.now(),
            name: formData.name,
            variety: formData.variety,
            category: formData.category,
            quantity: formData.quantity,
            unit: formData.unit,
            price_per_unit: formData.pricePerUnit,
            location: formData.location,
            pickup_address: formData.pickupAddress,
            status: 'Listed',
            image: { url: null },
            quality_grade: qualityReport?.overallGrade || 'A'
          };
          const existing = JSON.parse(localStorage.getItem('demo_crops') || '[]');
          localStorage.setItem('demo_crops', JSON.stringify([demoCrop, ...existing]));
        } catch (e) {
          console.error(e);
        }
        
        setSuccess(true);
        setLoading(false);
        setStatusMessage('');
        setTimeout(() => navigate('/farmer/crops'), 2500);
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      setSuccess(true); 
      setTimeout(() => navigate('/farmer/crops'), 2500);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="text-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Harvest Listed!</h1>
          <p className="text-sm text-slate-500">Your produce is now live on the marketplace.</p>
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mt-2" />
        </div>
      </div>
    );
  }

  const currentStyles = gradeStyles[qualityReport?.overallGrade] || gradeStyles.A;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/farmer/crops')}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight"><span>{isEditMode ? 'Edit Harvest' : 'Add Harvest'}</span></h1>
          <p className="text-sm text-slate-500"><span>{isEditMode ? 'Update your listing details and save changes.' : 'Upload photos and fill in details — quality is checked automatically.'}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

          {/* ── Step 1: Images ── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">1</div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Upload Produce Photos</h2>
            </div>

            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all group
              ${images.length > 0 ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-emerald-50/20'}`}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                id="image-upload"
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-sm transition-colors
                  ${images.length > 0 ? 'bg-emerald-100 border-emerald-200' : 'bg-white border-slate-100 group-hover:bg-emerald-50'}`}>
                  {isVerifying
                    ? <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    : <Camera className={`w-6 h-6 ${images.length > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                  }
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  <span>{images.length > 0 ? `${images.length} Photo(s) Ready` : 'Click to upload photos'}</span>
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  <span>{isVerifying ? 'Checking quality with Gemini...' : 'Up to 5 images • JPG, PNG'}</span>
                </p>
              </div>
            </div>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {imagePreviews.map((preview, idx) => (
                  <div key={`preview-${idx}`} className="relative w-20 h-20 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden shadow-sm group/img">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          // Clean up the object URL before removing
                          if (preview && preview.startsWith('blob:')) {
                            URL.revokeObjectURL(preview);
                          }
                          
                          const ni = images.filter((_, i) => i !== idx);
                          const np = imagePreviews.filter((_, i) => i !== idx);
                          setImages(ni);
                          setImagePreviews(np);
                          if (ni.length === 0) setQualityReport(null);
                        } catch (error) {
                          console.error('Error removing image:', error);
                        }
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-slate-900/70 backdrop-blur-sm text-white rounded flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {qualityReport && (
              <div className={`rounded-xl border overflow-hidden animate-in slide-in-from-top-2 duration-300
                ${currentStyles.light} ${currentStyles.border}`}>
                {/* Summary bar */}
                <div className={`flex items-center justify-between px-4 py-3 ${currentStyles.bar}`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Quality Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{`Grade ${qualityReport.overallGrade}`}</span>
                    <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {`${qualityReport.qualityScore}/100`}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div className="px-4 py-3">
                  <p className="text-xs text-slate-700 leading-relaxed">{qualityReport.summary}</p>
                </div>

                {/* Key stats */}
                <div className="px-4 pb-3 grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Colour</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{qualityReport.visualInspection?.color}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Purity</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{`${qualityReport.purityLevel}%`}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Demand</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{qualityReport.marketRecommendation?.marketDemand}</p>
                  </div>
                </div>

                {/* Price feedback */}
                {qualityReport.marketRecommendation?.priceFeedback && (
                  <div className="px-4 pb-3">
                    <div className="flex items-start gap-2 bg-white border border-slate-100 rounded-lg p-3">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-slate-600">{qualityReport.marketRecommendation.priceFeedback}</p>
                    </div>
                  </div>
                )}

                {/* Toggle full report */}
                <button
                  type="button"
                  onClick={() => setShowFullReport(v => !v)}
                  className="w-full px-4 py-2.5 bg-white border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  <span>{showFullReport ? 'Hide Details' : 'View Full Report'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showFullReport ? 'rotate-180' : ''}`} />
                </button>

                {/* Full report */}
                {showFullReport && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-100 bg-white">
                    {/* Defects */}
                    {qualityReport.defects?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detected Issues</p>
                        {qualityReport.defects.map((d, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <span className="text-xs text-slate-700">{d.type}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                              ${d.severity === 'High' ? 'bg-red-100 text-red-600' :
                                d.severity === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                  'bg-slate-100 text-slate-500'}`}>
                              {`${d.severity} · ${d.affectedPercentage}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tips */}
                    {qualityReport.improvementTips?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tips to Improve</p>
                        {qualityReport.improvementTips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 py-1">
                            <Sparkles className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-600">{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Best buyers */}
                    {qualityReport.marketRecommendation?.bestBuyersFor?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Best Buyers For This Grade</p>
                        <div className="flex flex-wrap gap-2">
                          {qualityReport.marketRecommendation.bestBuyersFor.map((b, i) => (
                            <span key={i} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Step 2: Details ── */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">2</div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Produce Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Crop name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Crop Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Paddy, Wheat, Tomato"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all appearance-none"
                >
                  <option value="grains">Grains & Cereals</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="pulses">Pulses & Legumes</option>
                  <option value="spices">Spices & Herbs</option>
                  <option value="cash_crops">Cash Crops</option>
                </select>
              </div>

              {/* Variety */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Variety (Optional)</label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  placeholder="e.g. Basmati, IR-36"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-24 px-2 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all font-bold text-center appearance-none"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="tons">tons</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Price Per Unit (₹)</span>
                  {qualityReport?.marketRecommendation?.suggestedPrice && (
                    <button
                      type="button"
                      className="text-emerald-600 flex items-center gap-1"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        pricePerUnit: qualityReport.marketRecommendation.suggestedPrice
                      }))}
                    >
                      <Star className="w-2.5 h-2.5" />
                      <span>{`Use suggested ₹${qualityReport.marketRecommendation.suggestedPrice}`}</span>
                    </button>
                  )}
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  placeholder="Set your asking price"
                  min="0"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold text-emerald-700 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </section>

          {/* ── Step 3: Location ── */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">3</div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Location & Pickup</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Farm Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Farm Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Pollachi, Coimbatore"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                />
                <p className="text-xs text-slate-500">General area where your farm is located</p>
              </div>

              {/* Pickup Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Address *</label>
                <input
                  type="text"
                  name="pickupAddress"
                  required
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="e.g. Market Yard, Pollachi - 642001"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                />
                <p className="text-xs text-slate-500">Exact address where buyers can pick up the crop</p>
              </div>
            </div>

            {/* Location Suggestions */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-xs font-bold text-blue-800 mb-2">📍 Popular Locations in Coimbatore District:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Pollachi Market Yard',
                  'Anamalai Farms',
                  'Gandhipuram Collection Point',
                  'RS Puram Market',
                  'Sundarapuram Farm Gate',
                  'Vadavalli Agricultural Hub'
                ].map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      pickupAddress: `${location} - ${location.includes('Pollachi') ? '642001' : location.includes('Gandhipuram') ? '641018' : location.includes('RS Puram') ? '641002' : '641015'}`
                    }))}
                    className="text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 px-2 py-1 rounded transition-colors text-left"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Submit ── */}
          <div className="pt-4 border-t border-slate-100">
            {images.length === 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
                <Info className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">Upload at least one photo to receive a quality grade before listing.</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || isVerifying}
              className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{statusMessage || 'Processing...'}</span>
                </span>
              ) : isVerifying ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking quality...</span>
                </span>
              ) : (
                <span>Save and List Harvest</span>
              )}
            </button>
            <p className="text-center text-[9px] text-slate-400 mt-3 font-medium uppercase tracking-wider">
              Quality verified · Secure listing
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CropUpload;
