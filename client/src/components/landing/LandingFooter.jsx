import { Link } from "react-router-dom";
import { Github, Mail, Linkedin, Twitter, Instagram, Facebook, Leaf, Shield, Truck, Cpu, Gavel } from "lucide-react";

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
                                    <img src="/logo.png" alt="AgriLink Logo" className="w-full h-full object-cover scale-150" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase">AgriLink</span>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-8 max-w-md text-sm">
                                Empowering farmers through Gemini Vision AI crop quality assessment, intelligent fair-price prediction, live bidder matchmaking with 4-tier fallback protection, and ESP32+DHT22 cold-chain transit telemetry.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <Cpu className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white text-sm mb-0.5">AI Quality & Price Prediction</h5>
                                        <p className="text-slate-400 text-xs">Accurate image-based grading and market trend analytics</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Gavel className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white text-sm mb-0.5">Dynamic Auction & Fallbacks</h5>
                                        <p className="text-slate-400 text-xs">Real-time bidding and guaranteed multi-district sale channels</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Truck className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white text-sm mb-0.5">ESP32 Cold-Chain Monitoring</h5>
                                        <p className="text-slate-400 text-xs">Real-time temperature & humidity alerts from buyer to retailer</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">Platform</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#features" className="text-slate-400 hover:text-white transition">AI Quality Grading</a></li>
                                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition">Auction Workflow</a></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition">Bidder Portal</Link></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition">Retailer Terminal</Link></li>
                            </ul>
                        </div>

                        {/* User Roles */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">Ecosystem</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition">Farmer Dashboard</Link></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition">Active Bidders Hub</Link></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition">Retailer Logistics</Link></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition">Mandi Collection Centers</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">Support & Contact</h4>
                            <div className="space-y-3 text-sm text-slate-400">
                                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> support@agrilink.in</p>
                                <p>Kinathukadavu Mandi Node, Coimbatore, TN - 642109</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
                        <p>© {currentYear} AgriLink. Intelligent Farm-to-Market Auction and IoT Transportation System.</p>
                        <p className="mt-2 sm:mt-0 font-mono">Final Year Project · AgriTech</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
