import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './farmer/FarmerDashboard';
import { ShoppingBag, User as UserIcon, ArrowRight, Leaf, Globe } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading) return; // Wait for auth to finish resolving
    if (user?.role === 'aggregator') {
      navigate('/aggregator/dashboard', { replace: true });
    } else if (user?.role === 'retailer') {
      navigate('/retailer/dashboard', { replace: true });
    } else if (user?.role === 'farmer') {
      navigate('/farmer/dashboard', { replace: true });
    } else if (user?.role === 'consumer' || user?.role === 'admin') {
      navigate('/consumer/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show spinner while profile is loading or while navigating to role dashboard
  if (loading || user?.role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          {user?.role ? 'Redirecting to your dashboard...' : 'Loading your profile...'}
        </p>
      </div>
    );
  }

  return <DefaultDashboard user={user} />;
};

const DefaultDashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Simple Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Hello, <span className="text-emerald-600">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 font-medium">
              Welcome back to Agritrack. Access your tools for agricultural commerce and absolute traceability.
            </p>
            <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="px-3 py-1 bg-slate-100 rounded-md">Role: {user?.role || 'User'}</span>
              <span className="px-3 py-1 bg-slate-100 rounded-md">Status: Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="container mx-auto px-6 max-w-7xl mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Marketplace",
              desc: "Explore fresh, quality-verified produce directly from local farms.",
              icon: ShoppingBag,
              path: "/consumer/marketplace",
              color: "text-blue-600",
              btn: "Open Market"
            },
            {
              title: "My Activity",
              desc: "Track your orders, transaction history, and delivery status.",
              icon: Leaf,
              path: "/consumer/orders",
              color: "text-emerald-600",
              btn: "View Orders"
            },
            {
              title: "My Profile",
              desc: "Manage your account settings and preferences.",
              icon: UserIcon,
              path: "/consumer/profile",
              color: "text-slate-600",
              btn: "Manage Profile"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className={`w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-6 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm mb-8 flex-grow">
                  {item.desc}
                </p>

                <button
                  onClick={() => navigate(item.path)}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  {item.btn} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
