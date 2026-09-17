import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GoogleTranslate from '../GoogleTranslate';

const navItems = [
  { title: 'Dashboard', url: '/consumer/dashboard', icon: LayoutDashboard },
  { title: 'Marketplace', url: '/consumer/marketplace', icon: ShoppingBag },
  { title: 'My Orders', url: '/consumer/orders', icon: Package },
  { title: 'Profile', url: '/consumer/profile', icon: User },
];

export function ConsumerSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white text-slate-600 border-r border-slate-200">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center px-4 py-5 border-b border-slate-100">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto max-w-[130px] object-contain" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="px-2 mb-3 flex w-full justify-center">
          <GoogleTranslate landingPage={false} />
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Consumer'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout Account
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 lg:hidden flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-7 w-auto object-contain" />
          <span className="font-bold text-slate-900 text-xs uppercase">AgriLink</span>
        </div>
        <div className="flex items-center gap-2">
          <GoogleTranslate landingPage={false} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 bg-slate-50 rounded-lg border border-slate-200"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 border-r border-slate-200">
        <SidebarContent />
      </aside>
    </>
  );
}
