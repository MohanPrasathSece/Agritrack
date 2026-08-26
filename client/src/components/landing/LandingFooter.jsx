import { Link } from "react-router-dom";
import { Github, Mail, Linkedin, Twitter, Instagram, Facebook, Leaf, Shield, Truck } from "lucide-react";

const LandingFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%2322c55e\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z\"/%3E%3C/g%3E%3C/svg%3E')",
                backgroundSize: "40px 40px"
            }}></div>

            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
                                    <img src="/logo.png" alt="Agritrack Logo" className="w-full h-full object-cover scale-150" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase">Agritrack</span>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-8 max-w-md">
                                Transforming agriculture with intelligent quality verification, complete traceability, and secure digital payments.
                                Building trust from farm to table through blockchain technology and AI-powered insights.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Leaf className="h-4 w-4 text-green-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white mb-1">Sustainable Agriculture</h5>
                                        <p className="text-slate-400 text-sm">Supporting eco-friendly farming practices and reducing waste</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Shield className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white mb-1">Blockchain Security</h5>
                                        <p className="text-slate-400 text-sm">Immutable records and transparent transactions</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Truck className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white mb-1">Smart Logistics</h5>
                                        <p className="text-slate-400 text-sm">Optimized supply chain management and delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-white mb-6 text-lg">Platform</h4>
                            <ul className="space-y-3">
                                <li><Link to="/" className="text-slate-300 hover:text-green-400 transition-colors duration-200">Home</Link></li>
                                <li><a href="/#features" className="text-slate-300 hover:text-green-400 transition-colors duration-200">Features</a></li>
                                <li><a href="/#how-it-works" className="text-slate-300 hover:text-green-400 transition-colors duration-200">How It Works</a></li>
                                <li><a href="/#gallery" className="text-slate-300 hover:text-green-400 transition-colors duration-200">Gallery</a></li>
                                <li><a href="/#faq" className="text-slate-300 hover:text-green-400 transition-colors duration-200">FAQ</a></li>
                                <li><a href="mailto:hello@agritrack.io" className="text-slate-300 hover:text-green-600 transition-colors duration-200">Contact</a></li>
                            </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                            <h4 className="font-semibold text-white mb-6 text-lg">Solutions</h4>
                            <ul className="space-y-3">
                                <li><Link to="/register" className="text-slate-300 hover:text-green-400 transition-colors duration-200">For Farmers</Link></li>
                                <li><Link to="/register" className="text-slate-300 hover:text-green-400 transition-colors duration-200">For Aggregators</Link></li>
                                <li><Link to="/register" className="text-slate-300 hover:text-green-400 transition-colors duration-200">For Retailers</Link></li>
                                <li><Link to="/register" className="text-slate-300 hover:text-green-400 transition-colors duration-200">For Consumers</Link></li>
                                <li><Link to="/qr" className="text-slate-300 hover:text-green-400 transition-colors duration-200">QR Scanner</Link></li>
                                <li><Link to="/trace" className="text-slate-300 hover:text-green-400 transition-colors duration-200">Trace Product</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-semibold text-white mb-6 text-lg">Company</h4>
                            <ul className="space-y-3">
                                <li><Link to="/login" className="text-slate-300 hover:text-green-400 transition-colors duration-200">Login</Link></li>
                                <li><Link to="/register" className="text-slate-300 hover:text-green-400 transition-colors duration-200">Register</Link></li>
                                <li><a href="/#faq" className="text-slate-300 hover:text-green-400 transition-colors duration-200">Support</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="border-t border-white/10 pt-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-6">
                                <span className="text-slate-400 text-sm font-medium">Follow us:</span>
                                <div className="flex gap-3">
                                    <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500/20 hover:text-green-400 transition-all duration-300">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500/20 hover:text-green-400 transition-all duration-300">
                                        <Facebook className="h-5 w-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500/20 hover:text-green-400 transition-all duration-300">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500/20 hover:text-green-400 transition-all duration-300">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500/20 hover:text-green-400 transition-all duration-300">
                                        <Github className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>

                            <div className="text-center md:text-right">
                                <p className="text-slate-400 text-sm">
                                    © {currentYear} Agritrack. All rights reserved.
                                </p>
                                <p className="text-green-400 text-sm mt-1">
                                    Building a smarter agricultural future together.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
