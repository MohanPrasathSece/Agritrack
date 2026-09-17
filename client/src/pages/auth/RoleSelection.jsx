import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sprout, Building, ShoppingBag, User, ArrowRight, Loader2, Gavel, Cpu } from 'lucide-react';

const RoleSelection = () => {
    const { user, updateUserRole, loading: authLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const roles = [
        {
            id: 'farmer',
            title: 'Farmer',
            description: 'Upload harvest images for AI quality grading, price prediction, and launch live auctions with 4-tier fallback protection.',
            icon: Sprout,
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            id: 'aggregator',
            title: 'Buyer / Bidder',
            description: 'Toggle real-time availability (🟢 Available / 🟡 Busy), join live farm auctions, and dispatch produce to retail networks.',
            icon: Gavel,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            id: 'retailer',
            title: 'Retailer',
            description: 'Monitor ESP32 + DHT22 temperature & humidity telemetry during transit, inspect condition logs, and confirm deliveries.',
            icon: ShoppingBag,
            color: 'bg-amber-50 text-amber-600',
        },
        {
            id: 'consumer',
            title: 'Consumer',
            description: 'Browse fresh verified farm produce, view origin milestones, and discover locally harvested goods.',
            icon: User,
            color: 'bg-slate-50 text-slate-600',
        },
    ];

    const handleRoleSelect = async (roleId) => {
        setSelectedRole(roleId);
        setLoading(true);
        try {
            const result = await updateUserRole(roleId);
            if (result.success) {
                localStorage.removeItem('agritrack_onboarding');
                navigate('/dashboard');
            } else {
                alert(`Error: ${result.error || 'Failed to update role'}`);
                setLoading(false);
            }
        } catch (error) {
            alert('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    if (authLoading) return null;

    if (!isAuthenticated || !user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-3xl space-y-8">
                <div className="text-center space-y-3">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/10 mb-2">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        <span className="text-[10px] font-black uppercase tracking-widest">AgriLink Ecosystem Node</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Select Your Platform Role</h1>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Configure your dashboard workflow</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            disabled={loading}
                            className={`group p-6 rounded-2xl border transition-all text-left flex flex-col justify-between h-full ${selectedRole === role.id
                                ? 'border-emerald-500 bg-white shadow-lg ring-2 ring-emerald-500/20'
                                : 'border-slate-200 bg-white hover:border-emerald-300 shadow-sm'
                                } ${loading && selectedRole !== role.id ? 'opacity-50' : ''}`}
                        >
                            <div>
                                <div className={`w-11 h-11 rounded-xl ${role.color} flex items-center justify-center mb-4 border border-current/10 shrink-0`}>
                                    <role.icon className="w-5 h-5" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{role.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        {role.description}
                                    </p>
                                </div>
                            </div>

                            <div className={`mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${selectedRole === role.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'
                                }`}>
                                {loading && selectedRole === role.id ? (
                                    <div className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Initializing...</div>
                                ) : (
                                    <div className="flex items-center gap-1.5">Enter Node <ArrowRight className="w-3 h-3" /></div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 AgriLink · AI Farm-to-Market Auction & IoT Transportation System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
