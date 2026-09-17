import React, { useState, useEffect, useCallback } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Plus, Search, Loader2, Package, ShieldCheck, Pencil, Trash2, Gavel, Radio, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FarmerLiveAuctionModal from "../../components/farmer/FarmerLiveAuctionModal";
import brinjalImg from "../../components/farmer/crops/brinjal.jpg";
import carrotImg from "../../components/farmer/crops/carrot.jpg";
import greenChillyImg from "../../components/farmer/crops/green chilly.jpg";
import potatoImg from "../../components/farmer/crops/potato.jpg";
import redChillyImg from "../../components/farmer/crops/red chilly.jpg";
import riceImg from "../../components/farmer/crops/rice.jpg";
import wheatImg from "../../components/farmer/crops/wheat.jpg";

const statusFilters = ["All", "Listed", "Sold"];

const DUMMY_CROPS = [
  { _id: '1', id: '1', name: 'Premium Basmati Rice', price_per_unit: 85, quantity: 1500, unit: 'KG', status: 'Listed', quality_grade: 'A+', auction_status: 'Active', image: { url: riceImg }, location: 'Kinathukadavu, Coimbatore', pickup_address: 'Kinathukadavu Market Yard, Coimbatore - 642109' },
  { _id: '2', id: '2', name: 'Organic Wheat', price_per_unit: 42, quantity: 2000, unit: 'KG', status: 'Listed', quality_grade: 'A', auction_status: 'Active', image: { url: wheatImg }, location: 'Kinathukadavu, Coimbatore', pickup_address: 'Kinathukadavu Farm Gate, Coimbatore - 642109' },
  { _id: '3', id: '3', name: 'Fresh Brinjal', price_per_unit: 25, quantity: 400, unit: 'KG', status: 'Listed', quality_grade: 'A', auction_status: 'Active', image: { url: brinjalImg }, location: 'Kinathukadavu, Coimbatore', pickup_address: 'Kinathukadavu Local Mandi, Coimbatore - 642109' },
  { _id: '4', id: '4', name: 'Farm Carrots', price_per_unit: 34, quantity: 600, unit: 'KG', status: 'Sold', quality_grade: 'B+', auction_status: 'Concluded', image: { url: carrotImg }, location: 'Kinathukadavu, Coimbatore', pickup_address: 'Kinathukadavu Collection Center, Coimbatore - 642109' },
  { _id: '5', id: '5', name: 'Green Chilly', price_per_unit: 60, quantity: 150, unit: 'KG', status: 'Listed', quality_grade: 'A', auction_status: 'Active', image: { url: greenChillyImg }, location: 'Kinathukadavu, Coimbatore', pickup_address: 'Kinathukadavu North Mandi, Coimbatore - 642109' },
  { _id: '6', id: '6', name: 'Potato (Kufri)', price_per_unit: 20, quantity: 3000, unit: 'KG', status: 'Listed', quality_grade: 'A', auction_status: 'Active', image: { url: potatoImg }, location: 'Kinathukadavu, Coimbatore', pickup_address: 'Kinathukadavu South Yard, Coimbatore - 642109' },
  { _id: '7', id: '7', name: 'Red Chilly (Guntur)', price_per_unit: 140, quantity: 500, unit: 'KG', status: 'Sold', quality_grade: 'Premium', auction_status: 'Concluded', image: { url: redChillyImg }, location: 'Kinathukadavu, Coimbatore', pickup_address: 'Kinathukadavu Farm, Coimbatore - 642109' }
];

export default function MyCropsFarmer() {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: '', price_per_unit: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [activeAuctionCrop, setActiveAuctionCrop] = useState(null);

  const fetchCrops = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      let demoCrops = [];
      try {
        demoCrops = JSON.parse(localStorage.getItem('demo_crops') || '[]');
      } catch(e) {}
      setCrops([...demoCrops, ...DUMMY_CROPS]);
      setLoading(false);
    }, 400);
  }, [user]);

  useEffect(() => {
    if (user?.email) fetchCrops();
  }, [user, fetchCrops]);

  const startInlineEdit = (crop) => {
    setEditingId(crop.id);
    setEditForm({ quantity: crop.quantity, price_per_unit: crop.price_per_unit || crop.pricePerUnit });
  };

  const saveInlineEdit = (cropId) => {
    setCrops(prevCrops => prevCrops.map(c => {
      if (c.id === cropId) {
        return { ...c, quantity: editForm.quantity, price_per_unit: editForm.price_per_unit };
      }
      return c;
    }));
    setEditingId(null);
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditForm({ quantity: '', price_per_unit: '' });
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || crop.status.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (crop) => {
    const ok = window.confirm(`Delete "${crop?.name}"? This will remove the listing.`);
    if (!ok) return;

    try {
      setDeletingId(crop.id);
      setCrops(crops.filter(c => c.id !== crop.id));
    } catch (error) {
      console.error('Error deleting crop:', error);
      alert('Failed to delete crop. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaleConfirmed = (details) => {
    setCrops(prev => prev.map(c => {
      if (c.id === details.cropId) {
        return { ...c, status: 'Sold', auction_status: 'Sold', price_per_unit: details.winningPrice };
      }
      return c;
    }));
  };

  const getImageUrl = (imageValue) => {
    if (!imageValue) return null;
    const url = imageValue?.url || imageValue;
    if (typeof url === 'string' && url.includes('localhost:5000/uploads/')) {
      return url.replace(/^https?:\/\/localhost:5000/, '');
    }
    if (typeof url === 'string' && url.includes('localhost:5001/uploads/')) {
      return url.replace(/^https?:\/\/localhost:5001/, '');
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Loading My Crops...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Farm Produce & Live Auctions</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Monitor AI crop quality grades, live bidding rooms, and transport status.
          </p>
        </div>
        <Link
          to="/farmer/upload"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-emerald-700 shadow-md active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Create New Auction
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crops by name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                activeFilter === filter
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Area */}
      {filteredCrops.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCrops.map((crop) => (
            <div key={crop.id} className="group rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm hover:shadow-xl hover:border-emerald-500/40 flex flex-col justify-between">
              
              <div>
                <div className="h-36 sm:h-44 overflow-hidden relative bg-slate-100">
                  <img
                    src={crop.image?.url || getImageUrl(crop.images?.[0]) || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'}
                    alt={crop.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <StatusBadge status={crop.status} />
                    {crop.status !== 'Sold' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                        AUCTION
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span className="text-[10px] text-slate-800 uppercase font-black tracking-wider">
                      Grade {crop.quality_grade || 'A'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 capitalize truncate tracking-tight">{crop.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{crop.variety || 'Local Hybrid'} · {crop.category || 'Produce'}</p>
                    <div className="flex items-center gap-1 mt-1 text-slate-500">
                      <span className="text-[10px]">📍</span>
                      <p className="text-[10px] font-medium truncate">{crop.location || 'Kinathukadavu, Coimbatore'}</p>
                    </div>
                  </div>

                  {editingId === crop.id ? (
                    <div className="flex bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 space-x-2">
                      <div className="flex-1 flex flex-col items-center border-r border-emerald-200">
                        <p className="text-[9px] text-emerald-700 uppercase font-bold tracking-wider mb-1">Quantity</p>
                        <input 
                          type="number" 
                          value={editForm.quantity} 
                          onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                          className="w-16 text-xs text-center font-bold text-slate-800 bg-white border border-emerald-200 rounded-lg py-1 outline-none" 
                        />
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-[9px] text-emerald-700 uppercase font-bold tracking-wider mb-1">Floor Rate (₹)</p>
                        <input 
                          type="number" 
                          value={editForm.price_per_unit} 
                          onChange={(e) => setEditForm({...editForm, price_per_unit: e.target.value})}
                          className="w-16 text-xs text-center font-bold text-emerald-700 bg-white border border-emerald-200 rounded-lg py-1 outline-none" 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex bg-slate-50 rounded-2xl p-2.5 border border-slate-100 space-x-2">
                      <div className="flex-1 text-center border-r border-slate-200/60">
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Lot Quantity</p>
                        <p className="text-xs text-slate-800 font-bold">{crop.quantity} {crop.unit}</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Start Price</p>
                        <p className="text-xs text-emerald-600 font-extrabold">₹{crop.price_per_unit || crop.pricePerUnit}/{crop.unit}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50/50 rounded-xl p-2 border border-emerald-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-800">4-Tier Fallback:</span>
                    <span className="text-emerald-700 font-medium">Auto-Protect Active</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                
                {crop.status !== 'Sold' && (
                  <button
                    onClick={() => setActiveAuctionCrop(crop)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Gavel className="w-3.5 h-3.5 text-emerald-400" />
                    Enter Live Auction
                  </button>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[10px]">
                  {editingId === crop.id ? (
                    <div className="flex items-center gap-2 w-full justify-center">
                      <button 
                        onClick={() => saveInlineEdit(crop.id)}
                        className="font-bold uppercase tracking-wider bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelInlineEdit}
                        className="font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-3 py-1 rounded-lg hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <button 
                        onClick={() => startInlineEdit(crop)}
                        className="flex items-center gap-1 font-bold text-slate-500 hover:text-emerald-600 transition"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button 
                        type="button"
                        disabled={deletingId === crop.id}
                        onClick={() => handleDelete(crop)}
                        className="flex items-center gap-1 font-bold text-red-500 hover:text-red-700 transition disabled:opacity-50"
                      >
                        {deletingId === crop.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Package className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Produce Listed Yet</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">Upload harvest photos for AI grading and start live bidding auctions.</p>
          <Link
            to="/farmer/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-emerald-700 shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create First Auction
          </Link>
        </div>
      )}

      {/* Live Auction Modal */}
      {activeAuctionCrop && (
        <FarmerLiveAuctionModal
          crop={activeAuctionCrop}
          onClose={() => setActiveAuctionCrop(null)}
          onSaleConfirmed={handleSaleConfirmed}
        />
      )}

    </div>
  );
}
