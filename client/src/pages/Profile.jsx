import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { locationService } from '../utils/locationService';
import { formatLocation } from '../utils/format';
import {
  User,
  MapPin,
  Navigation,
  Loader2,
  Save,
  Edit3, // Keep Edit3 as it's used
  X,
  ShieldCheck,
  Smartphone,
  Mail,
  Zap,
  ChevronRight,
  Globe,
  Lock,
  Boxes,
  Phone, // Added Phone
  Edit2, // Added Edit2, though Edit3 is still used
  AlertCircle // Added AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      village: '',
      district: '',
      state: '',
      pincode: '',
      fullAddress: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    farmerDetails: {
      farmSize: '',
      primaryCrops: [],
      organicCertified: false
    }
  });

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: {
          village: data.address?.village || '',
          district: data.address?.district || '',
          state: data.address?.state || '',
          pincode: data.address?.pincode || '',
          fullAddress: data.address?.fullAddress || '',
          coordinates: {
            latitude: data.address?.coordinates?.latitude || '',
            longitude: data.address?.coordinates?.longitude || ''
          }
        },
        farmerDetails: data.farmer_details || formData.farmerDetails
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const detectLocation = async () => {
    setLocationLoading(true);
    setError('');

    try {
      const location = await locationService.getLocationWithAddress();

      setFormData(prev => ({
        ...prev,
        address: {
          village: location.village,
          district: location.district,
          state: location.state,
          pincode: location.pincode,
          fullAddress: location.fullAddress,
          coordinates: location.coordinates
        }
      }));

      setSuccess('Location detected successfully!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      setError(error.message || 'Failed to detect location');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          farmer_details: formData.farmerDetails
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 pt-16 font-normal">
      <div className="container mx-auto px-6 max-w-5xl animate-in fade-in duration-700">

        {/* Profile Header */}
        <div className="bg-white rounded-[4rem] p-12 lg:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-40" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-[30px] rounded-full group-hover:bg-emerald-500/40 transition-all duration-700" />
                <div className="relative w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl overflow-hidden border-4 border-white">
                  <User className="w-12 h-12" />
                  <div className="absolute bottom-0 inset-x-0 h-1/3 bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Lock className="w-3 h-3" />
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Authorized Identity Node</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                  {formData.name || 'Digital Entity'}
                </h1>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Globe className="h-3 w-3 text-emerald-500" />
                    UID: 0x{user?.id?.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Zap className="h-3 w-3 text-blue-500" />
                    ROLE: {user?.role?.toUpperCase() || 'NODE'}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center gap-3 px-8 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 ${editing
                ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                }`}
            >
              {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{editing ? 'Cancel Session' : 'Initiate Audit'}</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-4 mb-12">
          {success && (
            <div className="p-6 bg-emerald-500 text-white rounded-[2rem] border border-emerald-400 shadow-xl shadow-emerald-500/20 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-widest">{success}</span>
            </div>
          )}
          {error && (
            <div className="p-6 bg-red-500 text-white rounded-[2rem] border border-red-400 shadow-xl shadow-red-500/20 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
              <X className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-widest">{error}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">

            {/* Basic Information */}
            <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Primary Identity Metadata</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    Neural Display Name
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${editing ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="ENTER IDENTITY..."
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-50 transition-all uppercase tracking-tight"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    Communications Frequency
                  </label>
                  <div className="relative group">
                    <Smartphone className={`absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${editing ? 'text-blue-500' : 'text-slate-300'}`} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="ENTER CONTACT..."
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 disabled:opacity-50 transition-all uppercase tracking-tight"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    Verified Digital Inbox
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black text-slate-400 opacity-60 cursor-not-allowed uppercase tracking-tight"
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Immutable network identifier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Matrix */}
            <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Geographic Node Mapping</h2>
                </div>
                {editing && (
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={locationLoading}
                    className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-blue-500/20"
                  >
                    {locationLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Navigation className="w-3.5 h-3.5" />
                    )}
                    <span>{locationLoading ? 'Locating...' : 'Neural Scan'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: 'Village Node', name: 'address.village', val: String(formData.address?.village || '') },
                  { label: 'District Hub', name: 'address.district', val: String(formData.address?.district || '') },
                  { label: 'Regional Sector', name: 'address.state', val: String(formData.address?.state || '') },
                  { label: 'Postal Signature', name: 'address.pincode', val: String(formData.address?.pincode || '') }
                ].map((input) => (
                  <div key={input.label} className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      {input.label}
                    </label>
                    <input
                      type="text"
                      name={input.name}
                      value={input.val}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-6 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-50 transition-all uppercase tracking-tight"
                    />
                  </div>
                ))}

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    Full Matrix Address
                  </label>
                  <textarea
                    name="address.fullAddress"
                    value={typeof formData.address?.fullAddress === 'object' ? JSON.stringify(formData.address?.fullAddress) : String(formData.address?.fullAddress || '')}
                    onChange={handleChange}
                    disabled={!editing}
                    rows={3}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] py-6 px-8 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-50 transition-all uppercase tracking-tight resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Action Terminal */}
            <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-14 border border-white/5 shadow-2xl shadow-emerald-900/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent" />

              <div className="relative z-10 space-y-10 text-center lg:text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">Security Protocol v2</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Audit Session</h3>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em] leading-none mb-1">Regional Operation Node</span>
                  <p className="text-xl font-bold text-slate-400 uppercase tracking-tight">{formatLocation(formData.address)}</p>
                  <p className="text-sm font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                    Synchronize your local node modifications with the decentralized identity ledger.
                  </p>
                </div>

                <div className="space-y-4">
                  {editing ? (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 bg-emerald-500 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      <span>{loading ? 'SYNCING...' : 'COMMIT CHANGES'}</span>
                    </button>
                  ) : (
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Identity Status</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-emerald-400">VERIFIED</span>
                        <ShieldCheck className="w-10 h-10 text-emerald-500/30" />
                      </div>
                      <div className="h-px bg-white/5 w-full" />
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center">Last Synced: {new Date().toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Farm Details Widget (Conditional) */}
            {user?.role === 'farmer' && (
              <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-5 transition-transform duration-1000 group-hover:scale-125 rounded-full -mr-16 -mt-16`} />

                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                      <Boxes className="w-5 h-5" />
                    </div>
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Production Capacity</h2>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 leading-none">
                        Aggregated Acreage
                      </label>
                      <input
                        type="number"
                        name="farmerDetails.farmSize"
                        value={formData.farmerDetails.farmSize}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="0.00"
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 text-2xl font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-50 transition-all uppercase tracking-tight"
                      />
                    </div>

                    <div className={`p-8 rounded-[2rem] border transition-all duration-500 flex items-center justify-between ${formData.farmerDetails.organicCertified
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20 animate-pulse'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}>
                      <div className="space-y-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${formData.farmerDetails.organicCertified ? 'text-white/80' : 'text-slate-400'}`}>Organic Protocol</p>
                        <p className={`text-xl font-black ${formData.farmerDetails.organicCertified ? 'text-white' : 'text-slate-800'}`}>
                          {formData.farmerDetails.organicCertified ? 'ACTIVE' : 'INACTIVE'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="farmerDetails.organicCertified"
                        checked={formData.farmerDetails.organicCertified}
                        onChange={handleChange}
                        disabled={!editing}
                        className="h-6 w-6 rounded-lg text-emerald-600 focus:ring-emerald-500 border-white/20 transition-all cursor-pointer disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
