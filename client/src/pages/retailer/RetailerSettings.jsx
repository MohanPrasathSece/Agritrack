import React, { useState } from 'react';
import { Globe, Bell, Shield, Sun, Moon, Key, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GoogleTranslate from '../../components/GoogleTranslate';

export default function RetailerSettings() {
  const [theme, setTheme] = useState('dark');
  const { user } = useAuth();
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              {theme === 'dark' ? <Sun className="h-5 w-5 text-emerald-500" /> : <Moon className="h-5 w-5 text-emerald-500" />}
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Appearance</h3>
          </div>
          <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-700">Theme</p>
              <p className="text-xs text-slate-400 mt-0.5">Dark / Light mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'}`}
            >
              <span
                className={`absolute inline-block h-6 w-6 rounded-full bg-white shadow transform transition-all top-1 ${theme === 'dark' ? 'left-7' : 'left-1'}`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative z-50">
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Globe className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Language</h3>
          </div>
          <GoogleTranslate />
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Bell className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Notifications</h3>
          </div>
          <div className="space-y-3">
            {['Order updates', 'Price alerts', 'Marketplace activity'].map((label, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <div className="h-6 w-11 rounded-full bg-emerald-500 relative">
                  <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Security</h3>
          </div>
          <button className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700">Change Password</p>
              <p className="text-xs text-slate-400 mt-0.5">Update your credentials</p>
            </div>
            <Key className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
