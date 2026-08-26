import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, User, Link2, ArrowRight, Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const cards = [
  { title: 'Marketplace', desc: 'Browse quality-verified produce from local farms.', icon: ShoppingBag, path: '/consumer/marketplace', color: 'text-blue-600' },
  { title: 'My Orders', desc: 'Track orders and delivery status.', icon: Package, path: '/consumer/orders', color: 'text-emerald-600' },
  { title: 'Blockchain', desc: 'View transaction flow and supply chain records.', icon: Link2, path: '/consumer/blockchain', color: 'text-slate-600' },
  { title: 'Profile', desc: 'Manage your account and preferences.', icon: User, path: '/consumer/profile', color: 'text-slate-600' },
];

export default function ConsumerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Hello, <span className="text-emerald-600">{user?.name?.split(' ')[0] || 'User'}</span>
        </h1>
        <p className="text-slate-500 mt-2">Access marketplace, orders, and blockchain records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left group"
          >
            <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium group-hover:gap-3 transition-all">
              Open <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
