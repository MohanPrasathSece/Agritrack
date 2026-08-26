import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { cropApi } from '../../utils/api';

export default function ConsumerMarketplace() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, [category]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const params = category ? { category: category.toLowerCase() } : {};
      const res = await cropApi.getMarketplace(params);
      if (res.data?.success) {
        setCrops(res.data.data?.crops || []);
      } else {
        setError('Failed to load marketplace.');
      }
    } catch (err) {
      console.error('Marketplace error:', err);
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = crops.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['', 'grains', 'vegetables', 'fruits', 'pulses', 'spices', 'cash_crops'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Marketplace</h1>
        <p className="text-sm text-slate-500 mt-1">Browse quality-verified produce from local farms.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crops, variety, or farmer..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
        >
          <option value="">All Categories</option>
          {categories.filter(Boolean).map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((crop) => (
            <Link
              key={crop.id}
              to={`/crop/${crop.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-emerald-200 transition-all"
            >
              <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden mb-4">
                {crop.images?.[0] ? (
                  <img
                    src={crop.images[0].startsWith('/') ? crop.images[0] : `/uploads/${crop.images[0]}`}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ShoppingCart className="h-12 w-12" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 truncate">{crop.name}</h3>
              <p className="text-sm text-slate-500 truncate">{crop.farmer?.name || 'Farmer'}</p>
              <p className="mt-2 text-emerald-600 font-bold">₹{parseFloat(crop.price_per_unit || 0).toLocaleString()}/kg</p>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">No crops found.</div>
      )}
    </div>
  );
}
