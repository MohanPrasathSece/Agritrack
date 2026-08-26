import React, { useState } from 'react';
import { Menu, X, Bell, Settings, User, LogOut, Home, Package, Users, Store, TrendingUp, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleTranslate from './GoogleTranslate';
import ContactSupport from './ContactSupport';
import { t } from '../utils/translation';

export default function MainNavigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNavItems = () => {
    if (!user) return [];

    const items = [];
    
    // Common items
    items.push({
      label: t('home'),
      icon: Home,
      href: '/dashboard'
    });

    // Role-specific items
    switch (user.role) {
      case 'farmer':
        items.push(
          { label: t('myCrops'), icon: Package, href: '/farmer/crops' },
          { label: t('orders'), icon: Users, href: '/farmer/orders' },
          { label: t('payments'), icon: TrendingUp, href: '/farmer/payments' }
        );
        break;
      case 'aggregator':
        items.push(
          { label: t('collections'), icon: Package, href: '/aggregator/collections' },
          { label: t('marketplace'), icon: Store, href: '/aggregator/retailer-marketplace' }
        );
        break;
      case 'retailer':
        items.push(
          { label: t('marketplace'), icon: Store, href: '/retailer/marketplace' },
          { label: t('orders'), icon: Package, href: '/retailer/orders' }
        );
        break;
      default:
        break;
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Nav */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Agritrack" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3C/svg%3E";
                  }}
                />
                <span className="ml-2 text-xl font-bold text-slate-900">Agritrack</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right side - Tools and Profile */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="hidden md:block">
                <GoogleTranslate landingPage={false} />
              </div>

              {/* Contact Support */}
              <button
                onClick={() => setShowContactSupport(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                {t('support')}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm font-medium">{user?.name || t('unknown')}</span>
                  <X className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-45' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <a
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {t('profile')}
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        {t('settings')}
                      </a>
                      <div className="border-t border-slate-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </a>
              ))}
              
              {/* Mobile-only items */}
              <div className="border-t border-slate-100 mt-3 pt-3">
                <div className="px-3 py-2">
                  <GoogleTranslate landingPage={false} />
                </div>
                <button
                  onClick={() => setShowContactSupport(true)}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors w-full"
                >
                  <Phone className="w-5 h-5" />
                  {t('support')}
                </button>
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  {t('profile')}
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Contact Support Modal */}
      <ContactSupport 
        isOpen={showContactSupport} 
        onClose={() => setShowContactSupport(false)} 
      />
    </>
  );
}
