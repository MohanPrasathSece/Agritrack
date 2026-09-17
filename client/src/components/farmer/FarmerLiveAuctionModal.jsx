import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Truck,
  Building2,
  Store,
  ChevronRight,
  Radio
} from 'lucide-react';

export default function FarmerLiveAuctionModal({ crop, onClose, onSaleConfirmed }) {
  const startingBid = Number(crop?.price_per_unit || crop?.pricePerUnit || 30);
  const [currentHighestBid, setCurrentHighestBid] = useState(startingBid);
  const [highestBidder, setHighestBidder] = useState({
    name: 'Kavitha Agro Traders',
    location: 'Coimbatore',
    bid: startingBid,
    time: 'Auction Opened'
  });

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [auctionActive, setAuctionActive] = useState(true);
  const [saleConfirmed, setSaleConfirmed] = useState(false);
  const [selectedFallback, setSelectedFallback] = useState(null);
  const [fallbackApplied, setFallbackApplied] = useState(false);

  // Simulated live bids list
  const [bidHistory, setBidHistory] = useState([
    { id: 1, bidder: 'System Initializer', location: 'System', amount: startingBid, time: 'Just now', type: 'open' }
  ]);

  // Initial available bidders matching this crop
  const [matchedBidders] = useState([
    { id: 'b1', name: 'Kavitha Agro Traders', location: 'Coimbatore', status: 'available', distance: '12 km', capacity: '1200 kg' },
    { id: 'b2', name: 'Kongu Fresh Organics', location: 'Tiruppur', status: 'available', distance: '28 km', capacity: '2000 kg' },
    { id: 'b3', name: 'Salem Agri Commodities', location: 'Erode', status: 'available', distance: '45 km', capacity: '800 kg' },
    { id: 'b4', name: 'Annamalai Direct Mart', location: 'Pollachi', status: 'busy', distance: '8 km', capacity: '500 kg' },
  ]);

  // Fallback tiers
  const fallbackTiers = [
    {
      level: 1,
      title: 'Level 1: Extend & Reschedule Auction',
      description: 'Add +15 minutes to allow more active bidders to enter the live room.',
      actionLabel: 'Extend +15 Mins',
      action: () => {
        setTimeLeft(prev => prev + 900);
        setAuctionActive(true);
        setFallbackApplied(true);
        setSelectedFallback(1);
      }
    },
    {
      level: 2,
      title: 'Level 2: Nearby District Matching',
      description: 'Broaden radius from Coimbatore to Tiruppur, Erode, and Salem to invite 6 additional buyers.',
      actionLabel: 'Expand Radius (+50km)',
      action: () => {
        const newBidAmount = currentHighestBid + 2;
        setCurrentHighestBid(newBidAmount);
        setHighestBidder({
          name: 'Kongu Fresh Organics (Expanded Match)',
          location: 'Tiruppur',
          bid: newBidAmount,
          time: 'Just now'
        });
        setBidHistory(prev => [
          { id: Date.now(), bidder: 'Kongu Fresh Organics (Tiruppur)', location: 'Tiruppur', amount: newBidAmount, time: 'Just now', type: 'match' },
          ...prev
        ]);
        setFallbackApplied(true);
        setSelectedFallback(2);
      }
    },
    {
      level: 3,
      title: 'Level 3: Retailer Direct Purchase',
      description: 'List produce for instant direct purchase by verified retail supermarket chains at guaranteed AI fair price.',
      actionLabel: 'Route to Direct Retailers',
      action: () => {
        const fairPrice = startingBid;
        setCurrentHighestBid(fairPrice);
        setHighestBidder({
          name: 'FreshMart Supermarkets Network',
          location: 'Regional Central Node',
          bid: fairPrice,
          time: 'Instant Buy'
        });
        setBidHistory(prev => [
          { id: Date.now(), bidder: 'FreshMart Direct Retail Network', location: 'Central Mandi', amount: fairPrice, time: 'Just now', type: 'direct' },
          ...prev
        ]);
        setFallbackApplied(true);
        setSelectedFallback(3);
      }
    },
    {
      level: 4,
      title: 'Level 4: Co-op Mandi / Collection Center',
      description: 'Direct consignment to local Government Regulated Mandi & Collection Center.',
      actionLabel: 'Request Collection Center Hub',
      action: () => {
        setSelectedFallback(4);
        setFallbackApplied(true);
      }
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!auctionActive || timeLeft <= 0) {
      if (timeLeft <= 0) setAuctionActive(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setAuctionActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionActive, timeLeft]);

  // Automated bid simulation during active countdown
  useEffect(() => {
    if (!auctionActive) return;

    const bidders = [
      { name: 'Kavitha Agro Traders', location: 'Coimbatore' },
      { name: 'Kongu Fresh Organics', location: 'Tiruppur' },
      { name: 'Salem Agri Commodities', location: 'Erode' },
      { name: 'GreenValley Wholesalers', location: 'Coimbatore' }
    ];

    const timeouts = [
      setTimeout(() => {
        const step = Math.floor(Math.random() * 2) + 1;
        const newBid = currentHighestBid + step;
        const b = bidders[0];
        setCurrentHighestBid(newBid);
        setHighestBidder({ ...b, bid: newBid, time: 'Just now' });
        setBidHistory(prev => [{ id: Date.now(), bidder: b.name, location: b.location, amount: newBid, time: 'Just now' }, ...prev]);
      }, 3000),

      setTimeout(() => {
        const step = Math.floor(Math.random() * 3) + 2;
        const newBid = currentHighestBid + step + 1;
        const b = bidders[1];
        setCurrentHighestBid(newBid);
        setHighestBidder({ ...b, bid: newBid, time: 'Just now' });
        setBidHistory(prev => [{ id: Date.now(), bidder: b.name, location: b.location, amount: newBid, time: 'Just now' }, ...prev]);
      }, 7000),

      setTimeout(() => {
        const step = 2;
        const newBid = currentHighestBid + 5;
        const b = bidders[2];
        setCurrentHighestBid(newBid);
        setHighestBidder({ ...b, bid: newBid, time: 'Just now' });
        setBidHistory(prev => [{ id: Date.now(), bidder: b.name, location: b.location, amount: newBid, time: 'Just now' }, ...prev]);
      }, 12000)
    ];

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [auctionActive]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleConfirmSale = () => {
    setSaleConfirmed(true);
    if (onSaleConfirmed) {
      onSaleConfirmed({
        cropId: crop?.id,
        winner: highestBidder.name,
        winningPrice: currentHighestBid,
        totalAmount: currentHighestBid * (crop?.quantity || 500)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Live Produce Auction</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  auctionActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {auctionActive ? '🟢 ACTIVE BIDDING' : 'AUCTION CONCLUDED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {crop?.name || 'Produce Listing'} · Quantity: {crop?.quantity || 500} {crop?.unit || 'KG'} · Grade: {crop?.quality_grade || 'A'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Metric Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Current Price */}
            <div className="bg-emerald-50 border border-emerald-200/70 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Current Highest Bid</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-emerald-800">₹{currentHighestBid}</span>
                <span className="text-xs font-bold text-emerald-600">/ {crop?.unit || 'KG'}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Total Deal: ₹{(currentHighestBid * (crop?.quantity || 500)).toLocaleString()}
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Auction Countdown
              </span>
              <div className="text-3xl font-black font-mono text-slate-800 tracking-wider">
                {formatTime(timeLeft)}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Starting Price: ₹{startingBid}/kg</span>
            </div>

            {/* Leading Bidder */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Leading Bidder</span>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">{highestBidder.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> {highestBidder.location}
              </p>
            </div>
          </div>

          {/* Sale Confirmation State */}
          {saleConfirmed ? (
            <div className="bg-emerald-500 text-white rounded-2xl p-6 text-center space-y-3 shadow-lg shadow-emerald-500/20">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black">Auction Sale Confirmed!</h3>
              <p className="text-sm text-emerald-100 max-w-md mx-auto">
                Sold to <strong>{highestBidder.name}</strong> at <strong>₹{currentHighestBid}/{crop?.unit || 'kg'}</strong>. 
                IoT ESP32 transport container initialized for cold-chain monitoring.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-50 transition shadow-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Column: Live Bids Stream (3 Cols) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Live Bidding Activity
                  </h4>
                  <span className="text-xs text-slate-400">{bidHistory.length} bids placed</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {bidHistory.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        idx === 0 
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-sm' 
                          : 'bg-slate-50/50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          #{bidHistory.length - idx}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{item.bidder}</p>
                          <p className="text-[10px] text-slate-400">{item.location} · {item.time}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-600">₹{item.amount}</span>
                        <span className="text-[10px] text-slate-400 block">/{crop?.unit || 'kg'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Finalize Action */}
                <div className="pt-2">
                  <button
                    onClick={handleConfirmSale}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Highest Bid & Confirm Sale (₹{currentHighestBid}/kg)
                  </button>
                </div>
              </div>

              {/* Right Column: Registered Matching Bidders & Fallback Plan (2 Cols) */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Eligible Bidders */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" /> Active Matched Buyers
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      3 Available
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {matchedBidders.map(b => (
                      <div key={b.id} className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-800 truncate">{b.name}</p>
                          <p className="text-[10px] text-slate-400">{b.location} · {b.distance}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          b.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {b.status === 'available' ? '🟢 Active' : '🟡 Busy'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4-Tier Fallback Mechanism */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Fallback Sale Guarantee
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800/80 leading-tight">
                    If bidding is slow or no bidders active, engage a fallback tier:
                  </p>

                  <div className="space-y-2 pt-1">
                    {fallbackTiers.slice(0, 3).map(tier => (
                      <div key={tier.level} className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate">{tier.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{tier.description}</p>
                        </div>
                        <button
                          onClick={tier.action}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold whitespace-nowrap transition"
                        >
                          {tier.actionLabel}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
