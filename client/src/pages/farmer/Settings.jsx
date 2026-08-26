import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Leaf,
    Globe,
    Lock,
    Database,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GoogleTranslate from '../../components/GoogleTranslate';

const Settings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        priceAlerts: true,
        marketReports: false,
        systemAlerts: true
    });
    const [privacy, setPrivacy] = useState({
        showLocation: true,
        showContact: false,
        publicProfile: true
    });
    const [farmAddress, setFarmAddress] = useState('12, Green Farms, Kinathukadavu, Coimbatore, Tamil Nadu');
    const [farmRegion, setFarmRegion] = useState('Coimbatore Hub');

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'farm', label: 'Farm Config', icon: Leaf },
        { id: 'blockchain', label: 'Blockchain', icon: Database }
    ];

    return (
        <div className="w-full space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => navigate('/farmer/dashboard')}
                    className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
                <div>
                    <h1 className="text-2xl text-slate-900 tracking-tight">Settings & Configuration</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your preferences and platform experience.</p>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/15"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 min-h-[500px]">

                {activeTab === 'account' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <h3 className="text-lg text-slate-900 tracking-tight">Account Preferences</h3>
                            <p className="text-sm text-slate-500">Configure your language, currency, and privacy settings.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2 relative z-50">
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium ml-1 block mb-2">Display Language</label>
                                <div className="p-1 px-[0.1px] inline-block">
                                    <GoogleTranslate />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium ml-1">Currency</label>
                                <select className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:border-emerald-300 outline-none transition-all cursor-pointer">
                                    <option>Indian Rupee (₹)</option>
                                    <option>US Dollar ($)</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 space-y-5">
                            <h4 className="text-xs text-slate-800 uppercase tracking-wider font-medium">Privacy Settings</h4>
                            <div className="space-y-3">
                                {Object.entries(privacy).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                                        <span className="text-sm text-slate-700 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <button
                                            onClick={() => setPrivacy(prev => ({ ...prev, [key]: !value }))}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${value ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-slate-200'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${value ? 'translate-x-[1.4rem]' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <h3 className="text-lg text-slate-900 tracking-tight">Notification Preferences</h3>
                            <p className="text-sm text-slate-500">Control which alerts and updates you receive.</p>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(notifications).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-all ${value ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300 border border-slate-100'}`}>
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-800 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Push notifications & email alerts</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${value ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-slate-200'}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${value ? 'translate-x-[1.4rem]' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <h3 className="text-lg text-slate-900 tracking-tight">Security Settings</h3>
                            <p className="text-sm text-slate-500">Manage your password and authentication methods.</p>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                            <div className="flex items-center gap-3 text-emerald-600">
                                <Lock className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Change Password</span>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-slate-500 uppercase tracking-wider font-medium ml-1">Current Password</label>
                                    <input type="password" placeholder="••••••••••••" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-emerald-300 transition-all font-mono" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-slate-500 uppercase tracking-wider font-medium ml-1">New Password</label>
                                        <input type="password" placeholder="••••••••••••" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-emerald-300 transition-all font-mono" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-slate-500 uppercase tracking-wider font-medium ml-1">Confirm Password</label>
                                        <input type="password" placeholder="••••••••••••" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-emerald-300 transition-all font-mono" />
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/15 active:scale-[0.98]">
                                Update Password
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                                    <p className="text-xs opacity-70">Add an extra layer of security</p>
                                </div>
                            </div>
                            <button className="px-5 py-2.5 bg-white text-emerald-600 rounded-lg text-xs font-medium uppercase tracking-wider border border-emerald-100 shadow-sm active:scale-95 transition-all">
                                Enable
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'farm' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <h3 className="text-lg text-slate-900 tracking-tight">Farm Configuration</h3>
                            <p className="text-sm text-slate-500">Set default parameters for your listings and hub.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium ml-1">Farm Address</label>
                                <input
                                    type="text"
                                    value={farmAddress}
                                    onChange={(e) => setFarmAddress(e.target.value)}
                                    placeholder="Enter your complete farm address..."
                                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:border-emerald-300 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium ml-1">Default Region Hub</label>
                                <select
                                    value={farmRegion}
                                    onChange={(e) => setFarmRegion(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:border-emerald-300 outline-none transition-all cursor-pointer"
                                >
                                    <option>Coimbatore Hub</option>
                                    <option>Pollachi Mandi</option>
                                    <option>Mettupalayam Market</option>
                                    <option>Tiruppur Export</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                        <Globe className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-800">Display Market Trends Globally</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Share your yields with global buyers</p>
                                    </div>
                                </div>
                                <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20">
                                    <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-[1.4rem] shadow-sm" />
                                </button>
                            </div>

                            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/15 active:scale-[0.98]">
                                Save Farm Settings
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'blockchain' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <h3 className="text-lg text-slate-900 tracking-tight">Blockchain Settings</h3>
                            <p className="text-sm text-slate-500">Configure transparency levels and on-chain recording.</p>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                            <div className="flex items-center gap-3 text-emerald-600">
                                <Database className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Ledger Preferences</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:border-emerald-200">
                                    <div>
                                        <p className="text-sm text-slate-800">Auto Record Harvests</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Automatically log every upload to the blockchain</p>
                                    </div>
                                    <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-slate-200">
                                        <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-1 shadow-sm" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:border-emerald-200">
                                    <div>
                                        <p className="text-sm text-slate-800">Public Trust Seal</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Increases buyer trust and visibility</p>
                                    </div>
                                    <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20">
                                        <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-[1.4rem] shadow-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
