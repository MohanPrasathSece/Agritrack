import React, { useState, useEffect } from "react";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { 
  MapPin, Search, Filter, Loader2, Package, Calendar, User, 
  ShieldCheck, ShoppingCart, Sparkles, Gavel, Clock, Radio, 
  ArrowRight, AlertCircle, CheckCircle2, TrendingUp, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aggregatorApi } from "../../utils/api";
import brinjalImg from "../../components/farmer/crops/brinjal.jpg";
import carrotImg from "../../components/farmer/crops/carrot.jpg";
import greenChillyImg from "../../components/farmer/crops/green chilly.jpg";
import potatoImg from "../../components/farmer/crops/potato.jpg";
import redChillyImg from "../../components/farmer/crops/red chilly.jpg";
import riceImg from "../../components/farmer/crops/rice.jpg";
import wheatImg from "../../components/farmer/crops/wheat.jpg";

export default function AggregatorCollections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("auctions"); // "auctions" | "fallback_direct" | "my_bids"
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAuctionCrop, setSelectedAuctionCrop] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);

  const [auctions, setAuctions] = useState([
    {
      id: 'auc-1',
      name: 'Fresh Hybrid Tomatoes',
      farmer: 'Murugan Palanisamy',
      location: 'Kinathukadavu, Coimbatore',
      quantity: 500,
      unit: 'KG',
      starting_price: 30,
      current_bid: 34,
      highest_bidder: 'Kavitha Agro Traders',
      quality_grade: 'A',
      ripeness: 86,
      ends_in: '18m 42s',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
      category: 'Vegetables'
    },
    {
      id: 'auc-2',
      name: 'Premium Basmati Rice',
      farmer: 'Ramesh Kumar',
      location: 'Pollachi, Coimbatore',
      quantity: 1500,
      unit: 'KG',
      starting_price: 80,
      current_bid: 88,
      highest_bidder: 'Kongu Fresh Organics',
      quality_grade: 'Premium',
      ripeness: 94,
      ends_in: '42m 10s',
      image: riceImg,
      category: 'Grains'
    },
    {
      id: 'auc-3',
      name: 'Organic Farm Carrots',
      farmer: 'Priya Sharma',
      location: 'Mettupalayam, Coimbatore',
      quantity: 800,
      unit: 'KG',
      starting_price: 32,
      current_bid: 36,
      highest_bidder: 'Salem Commodities',
      quality_grade: 'A',
      ripeness: 88,
      ends_in: '1h 12m',
      image: carrotImg,
      category: 'Vegetables'
    },
    {
      id: 'auc-4',
      name: 'Green Chilly (G4 Variety)',
      farmer: 'Senthil Vel',
      location: 'Dharapuram, Tiruppur',
      quantity: 350,
      unit: 'KG',
      starting_price: 55,
      current_bid: 62,
      highest_bidder: 'Kavitha Agro Traders',
      quality_grade: 'A',
      ripeness: 90,
      ends_in: '35m 20s',
      image: greenChillyImg,
      category: 'Spices'
    }
  ]);

  const [fallbackProduce] = useState([
    {
      id: 'fall-1',
      name: 'Farm Potato (Kufri Jyoti)',
      farmer: 'K. Balan',
      location: 'Udumalpet, Tiruppur',
      quantity: 2000,
      unit: 'KG',
      guaranteed_price: 22,
      quality_grade: 'A',
      image: potatoImg,
      channel: 'Level 2: Nearby District Match',
      note: 'Expanded radius dispatch available.'
    },
    {
      id: 'fall-2',
      name: 'Red Chilly (Guntur Sannam)',
      farmer: 'M. Natarajan',
      location: 'Kangeyam, Erode',
      quantity: 600,
      unit: 'KG',
      guaranteed_price: 135,
      quality_grade: 'Premium',
      image: redChillyImg,
      channel: 'Level 3: Retailer Direct Route',
      note: 'Direct collection slot open.'
    }
  ]);

  useEffect(() => {
    // Load local demo crops if any
    try {
      const demo = JSON.parse(localStorage.getItem('demo_crops') || '[]');
      if (demo.length > 0) {
        const demoAuctions = demo.map((d, i) => ({
          id: d.id || `demo-${i}`,
          name: d.name,
          farmer: 'Local Producer (You)',
          location: d.location || 'Coimbatore',
          quantity: d.quantity,
          unit: d.unit,
          starting_price: Number(d.price_per_unit || 30),
          current_bid: Number(d.price_per_unit || 30) + 4,
          highest_bidder: 'Kavitha Agro Traders',
          quality_grade: d.quality_grade || 'A',
          ripeness: d.ripeness || 85,
          ends_in: '24m 10s',
          image: d.image?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
          category: d.category || 'Produce'
        }));
        setAuctions(prev => [...demoAuctions, ...prev.filter(p => !p.id.startsWith('demo'))]);
      }
    } catch(e) {}
    setLoading(false);
  }, []);

  const openBidModal = (crop) => {
    setSelectedAuctionCrop(crop);
    setBidAmount(crop.current_bid + 2);
    setBidSuccess(false);
  };

  const submitBid = (e) => {
    e.preventDefault();
    if (!bidAmount || bidAmount <= selectedAuctionCrop.current_bid) {
      alert(`Bid must be greater than current highest bid of ₹${selectedAuctionCrop.current_bid}`);
      return;
    }

    setAuctions(prev => prev.map(a => {
      if (a.id === selectedAuctionCrop.id) {
        return {
          ...a,
          current_bid: Number(bidAmount),
          highest_bidder: 'My Bidder Node (You)'
        };
      }
      return a;
    }));

    setBidSuccess(true);
    setTimeout(() => {
      setSelectedAuctionCrop(null);
      setBidSuccess(false);
    }, 1200);
  };

  const filteredAuctions = auctions.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Live Bidder Feasibility Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Farm Produce Auctions</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Participate in real-time bidding for AI-graded farm lots and inspect fallback direct inventory.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("auctions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "auctions"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Live Auctions ({auctions.length})
          </button>
          <button
            onClick={() => setActiveTab("fallback_direct")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "fallback_direct"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Fallback & Direct Hub ({fallbackProduce.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter active farm auctions by crop name, farmer, or district..."
          className="w-full rounded-xl bg-slate-50/70 py-2 pl-10 pr-4 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none transition"
        />
      </div>

      {/* Content Area */}
      {activeTab === "auctions" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAuctions.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Grade Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
                      Grade {item.quality_grade}
                    </span>
                  </div>

                  {/* Timer Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3 h-3 text-emerald-400 animate-spin" />
                    {item.ends_in}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{item.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Farmer: {item.farmer}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                    </p>
                  </div>

                  {/* Current Bidding State */}
                  <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Highest Bid
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-emerald-900">₹{item.current_bid}</span>
                        <span className="text-[10px] font-bold text-emerald-700">/{item.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Lot Size</span>
                      <span className="text-xs font-bold text-slate-800">{item.quantity} {item.unit}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Floor: ₹{item.starting_price}/{item.unit}</span>
                    <span className="text-emerald-700 font-bold truncate max-w-[140px]">
                      Leader: {item.highest_bidder}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => openBidModal(item)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  Place Higher Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Fallback & Direct Retailer Hub */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallbackProduce.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
              <div className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover border border-slate-100" />
                <div className="space-y-1">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {item.channel}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                  <p className="text-[11px] text-slate-500">Farmer: {item.farmer} ({item.location})</p>
                  <p className="text-xs font-black text-emerald-600">Fixed Rate: ₹{item.guaranteed_price}/{item.unit || 'KG'}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                {item.note}
              </p>

              <button
                onClick={() => alert(`Direct collection order initiated for ${item.name} at guaranteed fair rate of ₹${item.guaranteed_price}/KG.`)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm"
              >
                Instant Direct Procurement
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Place Bid Modal */}
      {selectedAuctionCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Gavel className="w-5 h-5 text-emerald-600" />
                Submit Auction Bid
              </div>
              <button 
                onClick={() => setSelectedAuctionCrop(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bidSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Bid Placed Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Your bid of ₹{bidAmount}/{selectedAuctionCrop.unit} is now leading the auction.
                </p>
              </div>
            ) : (
              <form onSubmit={submitBid} className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <p className="font-bold text-slate-900">{selectedAuctionCrop.name}</p>
                  <p className="text-slate-500">Lot: {selectedAuctionCrop.quantity} {selectedAuctionCrop.unit} · Grade {selectedAuctionCrop.quality_grade}</p>
                  <div className="pt-2 flex justify-between font-bold">
                    <span className="text-slate-400">Current Highest:</span>
                    <span className="text-emerald-700">₹{selectedAuctionCrop.current_bid}/{selectedAuctionCrop.unit}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Your Bid Amount (₹ / {selectedAuctionCrop.unit}) *
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    min={selectedAuctionCrop.current_bid + 1}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base font-black text-emerald-700 focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 5].map(inc => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setBidAmount(selectedAuctionCrop.current_bid + inc)}
                        className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold rounded-lg border border-slate-200 transition"
                      >
                        +₹{inc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition"
                  >
                    Confirm & Transmit Bid (₹{bidAmount * selectedAuctionCrop.quantity} Total)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
