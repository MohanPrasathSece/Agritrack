import React from 'react';
import { Leaf, Mail, Phone, MapPin, Globe, Shield, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-t border-emerald-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 transition-all duration-300 group-hover:shadow-emerald-500/20">
                                    <Leaf className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                    <Sprout className="w-1 h-1 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    AgriTrack
                                </span>
                                <span className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                                    Smart Agricultural Supply Chain
                                </span>
                            </div>
                        </Link>
                        
                        <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                            Connecting farmers to markets with complete transparency and trust through blockchain technology.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-emerald-600" />
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/trace" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                    Trace Product
                                </Link>
                            </li>
                            <li>
                                <Link to="/marketplace" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <a href="#how-it-works" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                    Features
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-emerald-600" />
                            Get in Touch
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="w-4 h-4 text-emerald-500" />
                                <span>support@agritrack.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-emerald-500" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span>Mumbai, India</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-600" />
                            Stay Updated
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Get the latest agricultural insights and platform updates.
                        </p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-white border border-emerald-200 rounded-lg py-3 px-4 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-green-600 text-white h-8 w-8 rounded-lg flex items-center justify-center hover:from-emerald-700 hover:to-green-700 transition-all duration-200 hover:scale-105">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-emerald-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-gray-600">
                                    Secured by Blockchain
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Leaf className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-gray-600">
                                    100% Organic Certified
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>© {currentYear} AgriTrack</span>
                            <span>•</span>
                            <Link to="/privacy" className="hover:text-emerald-600 transition-colors">
                                Privacy Policy
                            </Link>
                            <span>•</span>
                            <Link to="/terms" className="hover:text-emerald-600 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
