import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Phone, Mail, ShieldCheck, Loader2, Calendar, Award, Edit, ArrowLeft, User, Sparkles } from "lucide-react";
import heroFarm from "../../assets/hero-farm.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { farmerApi } from "../../utils/api";
import { formatLocation } from "../../utils/format";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        address_text: '',
        farming_experience: '',
        specialties: ''
    });
    const [saving, setSaving] = useState(false);

    
    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await farmerApi.getProfile(user.email);
            if (response.data.success) {
                const p = response.data.profile;
                // Ensure address is a string, not an object
                const profileData = {
                    ...p,
                    address: formatLocation(p?.address)
                };
                setProfile(profileData);
                setEditForm({
                    name: p.name || '',
                    phone: p.phone || '',
                    address_text: formatLocation(p?.address),
                    farming_experience: p.farmer_details?.experience || '10',
                    specialties: p.farmer_details?.specialties?.join(', ') || 'Organic Rice, Wheat'
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            // Set dummy data for demonstration
            const dummyProfile = {
                name: 'Mohan Kumar',
                phone: '+91 98765 43210',
                address: 'Farm No. 42, Pollachi Road, Near Anamalai Tiger Reserve, Coimbatore District, Tamil Nadu - 642001',
                farmer_details: {
                    experience: '12',
                    specialties: ['Organic Rice', 'Premium Wheat', 'Turmeric', 'Coconut']
                }
            };
            setProfile(dummyProfile);
            setEditForm({
                name: dummyProfile.name,
                phone: dummyProfile.phone,
                address_text: dummyProfile.address,
                farming_experience: dummyProfile.farmer_details.experience,
                specialties: dummyProfile.farmer_details.specialties.join(', ')
            });
        } finally {
            setLoading(false);
        }
    }, [user.email]);

    useEffect(() => {
        const abortController = new AbortController();
        
        if (user?.email) {
            fetchProfile();
        }

        // Cleanup function to abort pending requests
        return () => {
            abortController.abort();
        };
    }, [user?.email, fetchProfile]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const updateData = {
                name: editForm.name,
                phone: editForm.phone,
                address: { full_address: editForm.address_text },
                farmer_details: {
                    experience: editForm.farming_experience,
                    specialties: editForm.specialties.split(',').map(s => s.trim())
                }
            };
            const response = await farmerApi.updateProfile(user.email, updateData);
            if (response.data.success) {
                // Ensure profile data is properly formatted for display
                const updatedProfile = {
                    ...response.data.profile,
                    address: formatLocation(response.data.profile?.address)
                };
                setProfile(updatedProfile);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">Syncing User Identity...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10 pb-20 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/farmer/dashboard')}
                        className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-2xl text-slate-900 tracking-tight">Identity & Verified Credentials</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage your digital heritage and farm ecosystem parameters.</p>
                    </div>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-sm text-white transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        <Edit className="h-5 w-5" />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Card Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="rounded-[40px] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${heroFarm})` }}>
                            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
                        </div>
                        <div className="px-8 pb-10 -mt-12 relative z-10 text-center">
                            <div className="h-28 w-28 rounded-3xl bg-white p-1.5 shadow-2xl mx-auto">
                                <div className="h-full w-full rounded-[20px] bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl font-bold text-slate-900">
                                    {profile?.name?.charAt(0) || 'F'}
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <h2 className="text-2xl text-slate-900 font-bold tracking-tight">{profile?.name || 'Farmer'}</h2>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Verified Producer
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-slate-100 p-3 shadow-sm space-y-1">
                        <button className="w-full flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl text-sm text-slate-900 font-bold border border-slate-100 transition-all">
                            <User className="w-5 h-5 text-primary" />
                            General Information
                        </button>
                        <button onClick={() => navigate('/farmer/settings')} className="w-full flex items-center gap-4 px-6 py-4 bg-transparent rounded-2xl text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium">
                            <Sparkles className="w-5 h-5" />
                            Account Preferences
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8">
                    {isEditing ? (
                        <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm animate-in zoom-in duration-300">
                            <form onSubmit={handleSave} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Legal Name</label>
                                        <input
                                            type="text" value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm text-slate-800 outline-none focus:bg-white focus:border-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Phone Connectivity</label>
                                        <input
                                            type="text" value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm text-slate-800 outline-none focus:bg-white focus:border-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Geographic Address</label>
                                        <input
                                            type="text" value={editForm.address_text}
                                            onChange={(e) => setEditForm({ ...editForm, address_text: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm text-slate-800 outline-none focus:bg-white focus:border-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Agricultural Tenure (Yrs)</label>
                                        <input
                                            type="number" value={editForm.farming_experience}
                                            onChange={(e) => setEditForm({ ...editForm, farming_experience: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm text-slate-800 outline-none focus:bg-white focus:border-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Harvest Specialties</label>
                                        <input
                                            type="text" value={editForm.specialties}
                                            onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value })}
                                            placeholder="e.g. Basmati Rice, Durum Wheat"
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm text-slate-800 outline-none focus:bg-white focus:border-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6 border-t border-slate-50">
                                    <button
                                        type="submit" disabled={saving}
                                        className="flex-1 bg-slate-900 text-white py-5 rounded-2xl text-xs uppercase tracking-widest font-bold shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95"
                                    >
                                        {saving ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Commit Changes"}
                                    </button>
                                    <button
                                        type="button" onClick={() => setIsEditing(false)}
                                        className="px-10 bg-slate-100 text-slate-500 py-5 rounded-2xl text-xs uppercase tracking-widest font-bold active:scale-95 transition-all hover:bg-slate-200"
                                    >
                                        Discard
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 shadow-sm">
                                    <h3 className="text-[10px] text-slate-400 uppercase tracking-[.2em] font-bold">Contact Intelligence</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-5">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Location</p>
                                                <p className="text-sm text-slate-900 font-medium mt-1 leading-relaxed">
                                                    {formatLocation(profile?.address)}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    📍 Pollachi, Tamil Nadu
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-5">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Encrypted Contact</p>
                                                <p className="text-sm text-slate-900 font-medium mt-1">{profile?.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-5">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Network ID</p>
                                                <p className="text-sm text-slate-900 font-medium mt-1 truncate">{profile?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 shadow-sm">
                                    <h3 className="text-[10px] text-slate-400 uppercase tracking-[.2em] font-bold">Ecosystem Metrics</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-5">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Agricultural Tenure</p>
                                                <p className="text-sm text-slate-900 font-medium mt-1">{profile?.farmer_details?.experience || '10'}+ Dynamic Years</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-5">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <Award className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Trust Quotient</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm text-slate-900 font-medium">92% Satisfaction</span>
                                                    <span className="text-[8px] text-primary bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.2em]">Expert Tier</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-5">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <ShieldCheck className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Subscription Status</p>
                                                <p className="text-sm text-primary font-bold mt-1 uppercase tracking-widest">Active - Premium Tier</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm space-y-8">
                                <h3 className="text-[10px] text-slate-400 uppercase tracking-[.2em] font-bold">Production Specialties</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(profile?.farmer_details?.specialties || ["Organic Rice", "Durum Wheat", "Agroforestry"]).map((s) => (
                                        <span key={s} className="rounded-2xl bg-slate-50 border border-slate-100 px-6 py-4 text-sm text-slate-800 font-medium hover:bg-white transition-all">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
