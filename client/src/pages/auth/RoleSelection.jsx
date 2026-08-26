import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sprout, Building, ShoppingBag, User, ArrowRight, Loader2 } from 'lucide-react';

const RoleSelection = () => {
    const { user, updateUserRole, loading: authLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const roles = [
        {
            id: 'farmer',
            title: 'Farmer',
            description: 'List your harvests, track crop quality, and connect with direct buyers.',
            icon: Sprout,
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            id: 'aggregator',
            title: 'Aggregator',
            description: 'Manage collections, verify products, and handle supply chain logistics.',
            icon: Building,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            id: 'retailer',
            title: 'Retailer',
            description: 'Source fresh produce, view full traceability, and manage inventory.',
            icon: ShoppingBag,
            color: 'bg-orange-50 text-orange-600',
        },
        {
            id: 'consumer',
            title: 'Consumer',
            description: 'Browse marketplace, place orders, and track blockchain records.',
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
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-xl shadow-emerald-500/10 mb-2">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Agritrack · Setup</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Initialize Node</h1>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">Select your functional role</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            disabled={loading}
                            className={`group p-6 rounded-xl border transition-all text-left flex flex-col h-full ${selectedRole === role.id
                                ? 'border-emerald-500 bg-white shadow-md'
                                : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                                } ${loading && selectedRole !== role.id ? 'opacity-50' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center mb-4 border border-current/10 shrink-0`}>
                                <role.icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 space-y-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{role.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {role.description}
                                </p>
                            </div>

                            <div className={`mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${selectedRole === role.id ? 'text-emerald-600' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                                }`}>
                                {loading && selectedRole === role.id ? (
                                    <div className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Assigning...</div>
                                ) : (
                                    <div className="flex items-center gap-2">Initialize <ArrowRight className="w-3 h-3" /></div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        © 2026 Agritrack · All rights reserved
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
