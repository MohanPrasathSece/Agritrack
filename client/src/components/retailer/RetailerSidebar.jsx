import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Route, Truck, CreditCard, User, Settings, Leaf, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import GoogleTranslate from "../GoogleTranslate";

const navItems = [
    { title: "Dashboard", url: "/retailer/dashboard", icon: LayoutDashboard },
    { title: "Marketplace", url: "/retailer/marketplace", icon: ShoppingCart },
    { title: "My Orders", url: "/retailer/orders", icon: Package },
    { title: "Traceability", url: "/retailer/traceability", icon: Route },
    { title: "Delivery Tracking", url: "/retailer/delivery", icon: Truck },
    { title: "Payments", url: "/retailer/payments", icon: CreditCard },
    { title: "Profile", url: "/retailer/profile", icon: User },
    { title: "Settings", url: "/retailer/settings", icon: Settings },
];

const SidebarContent = ({ navItems, location, mobileOpen, setMobileOpen, handleLogout, user }) => (
    <div className="flex h-full flex-col bg-white text-slate-600 border-r border-slate-100">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center px-4 py-8 border-b border-slate-100">
            <img src="/logo.png" alt="Logo" className="w-56 object-contain drop-shadow-sm" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
            {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                    <NavLink
                        key={item.url}
                        to={item.url}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${isActive
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                            } group`}
                        onClick={() => setMobileOpen(false)}
                    >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                        <span>{item.title}</span>
                    </NavLink>
                );
            })}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-50">
            <div className="px-4 mb-4 flex w-full justify-center">
                <GoogleTranslate landingPage={false} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl mb-4">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/20">
                    {user?.email?.[0].toUpperCase() || "R"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{user?.email?.split('@')[0] || "Retailer"}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{user?.email}</p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
            >
                <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                Logout Account
            </button>
        </div>
    </div>
);

export function RetailerSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const commonProps = { navItems, location, mobileOpen, setMobileOpen, handleLogout, user };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-slate-200 lg:block">
                <SidebarContent {...commonProps} />
            </aside>

            {/* Mobile Sidebar */}
            <div className="lg:hidden">
                <div className="fixed left-4 top-4 z-50 flex items-center gap-2">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="rounded-lg bg-white p-2 shadow-sm border border-slate-200"
                    >
                        <Menu className="h-6 w-6 text-slate-600" />
                    </button>
                    <GoogleTranslate landingPage={false} />
                </div>

                {mobileOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                        <aside className="relative w-64 h-full">
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute right-4 top-4 z-50 text-slate-400 hover:text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <SidebarContent {...commonProps} />
                        </aside>
                    </div>
                )}
            </div>
        </>
    );
}
