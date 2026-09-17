import React, { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingCart, Store, ClipboardList, User, LogOut, Menu, X, Sparkles, BarChart3, Radio, Gavel } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GoogleTranslate from "../GoogleTranslate";

const navItems = [
    { title: "Dashboard", url: "/aggregator/dashboard", icon: LayoutDashboard },
    { title: "Live Farm Auctions", url: "/aggregator/collections", icon: Gavel },
    { title: "Sell to Retailers", url: "/aggregator/retailer-marketplace", icon: Store },
    { title: "Orders & Transit", url: "/aggregator/retailer-orders", icon: ClipboardList },
    { title: "AI Price Forecast", url: "/aggregator/predictions", icon: Sparkles },
    { title: "Supply Analytics", url: "/aggregator/analytics", icon: BarChart3 },
    { title: "Profile & Settings", url: "/aggregator/profile", icon: User },
];

const AvailabilityToggle = ({ currentStatus, onStatusChange }) => {
    return (
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" /> Bidder Status
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentStatus === 'available' ? 'bg-emerald-100 text-emerald-700' :
                    currentStatus === 'busy' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                }`}>
                    {currentStatus === 'available' ? '🟢 Available' : currentStatus === 'busy' ? '🟡 Busy' : '⚫ Offline'}
                </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
                <button
                    type="button"
                    onClick={() => onStatusChange('available')}
                    className={`py-1 rounded-lg text-[9px] font-bold uppercase transition ${
                        currentStatus === 'available' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    Active
                </button>
                <button
                    type="button"
                    onClick={() => onStatusChange('busy')}
                    className={`py-1 rounded-lg text-[9px] font-bold uppercase transition ${
                        currentStatus === 'busy' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    Busy
                </button>
                <button
                    type="button"
                    onClick={() => onStatusChange('offline')}
                    className={`py-1 rounded-lg text-[9px] font-bold uppercase transition ${
                        currentStatus === 'offline' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    Off
                </button>
            </div>
        </div>
    );
};

const SidebarContent = ({ navItems, location, mobileOpen, setMobileOpen, handleLogout, user, buyerStatus, setBuyerStatus }) => (
    <div className="flex h-full flex-col bg-white text-slate-600 border-r border-slate-100">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center px-4 py-7 border-b border-slate-100">
            <img src="/logo.png" alt="Logo" className="w-28 object-contain drop-shadow-sm" />
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 mt-2">Buyer & Bidder Node</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
            
            {/* Bidder Availability Status */}
            <AvailabilityToggle currentStatus={buyerStatus} onStatusChange={setBuyerStatus} />

            {navItems.map((item) => (
                <NavLink
                    key={item.url}
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                        flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300
                        ${isActive
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                        }
                    `}
                >
                    <item.icon className={`h-4 w-4 ${location.pathname === item.url ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                    {item.title}
                </NavLink>
            ))}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-50">
            <div className="px-4 mb-4 flex w-full justify-center">
                <GoogleTranslate landingPage={false} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl mb-4">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/20">
                    {(user?.aggregator_details?.enterpriseName || user?.name || 'K')?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight">
                        {user?.aggregator_details?.enterpriseName || user?.name || 'Kavitha Agro Traders'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate tracking-tight">{user?.email || 'Coimbatore Mandi'}</p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
            >
                <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                Logout Node
            </button>
        </div>
    </div>
);

export default function AggregatorSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [buyerStatus, setBuyerStatus] = useState(() => localStorage.getItem('buyer_status') || 'available');
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleStatusChange = (newStatus) => {
        setBuyerStatus(newStatus);
        localStorage.setItem('buyer_status', newStatus);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const commonProps = { 
        navItems, 
        location, 
        mobileOpen, 
        setMobileOpen, 
        handleLogout, 
        user, 
        buyerStatus, 
        setBuyerStatus: handleStatusChange 
    };

    return (
        <>
            {/* Mobile Header Overlay */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 lg:hidden flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white overflow-hidden border border-slate-100 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
                    </div>
                    <span className="font-bold text-slate-900 uppercase tracking-tight text-xs">AgriLink Buyer</span>
                </div>
                <div className="flex items-center gap-2">
                    <GoogleTranslate landingPage={false} />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 bg-slate-50 rounded-lg border border-slate-200"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent {...commonProps} />
            </aside>

            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 z-50">
                <SidebarContent {...commonProps} />
            </aside>
        </>
    );
}
