import { Cpu, QrCode, CreditCard, Star, ShieldCheck, Zap, BarChart3, Users, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import scenicRice from "../../assets/hero-carousal/scenic-view-rice-field.jpg";
import heroFarm from "../../assets/hero-carousal/hero-farm.jpg";
import pathwayField from "../../assets/hero-carousal/pathway-though-green-field.jpg";
import heroAgriculture from "../../assets/hero-carousal/hero-agriculture.jpg";
import heroFarmer from "../../assets/hero-carousal/hero-farmer.jpg";
import aggregagotr from "../../assets/hero-carousal/aggragotr.jpg";
import retailers from "../../assets/hero-carousal/retailers.jpg";
import heroFarm3 from "../../assets/hero-carousal/hero-farm3.jpg";

const features = [
    { 
        icon: Cpu, 
        title: "AI Quality Analysis", 
        description: "Advanced machine learning analyzes crop quality in real-time with computer vision.",
        image: heroAgriculture,
        stats: "98.5% Accuracy"
    },
    { 
        icon: ShieldCheck, 
        title: "Blockchain Traceability", 
        description: "Immutable records track every step from farm to table with smart contracts.",
        image: pathwayField,
        stats: "100% Transparent"
    },
    { 
        icon: QrCode, 
        title: "Instant Verification", 
        description: "Scan QR codes to verify origin, quality, and complete journey of any product.",
        image: heroFarmer,
        stats: "Real-time"
    },
    { 
        icon: CreditCard, 
        title: "Smart Payments", 
        description: "Automated escrow ensures fair compensation with instant settlement on delivery.",
        image: aggregagotr,
        stats: "Zero Delay"
    },
    { 
        icon: Star, 
        title: "Reputation System", 
        description: "Build trust through verified quality scores and consistent performance ratings.",
        image: retailers,
        stats: "5-Star Rated"
    },
    { 
        icon: Users, 
        title: "Direct Marketplace", 
        description: "Connect farmers directly with buyers, eliminating middlemen for better prices.",
        image: heroFarm3,
        stats: "Fair Pricing"
    }
];

const FeaturesSection = () => {
    return (
        <section id="features" className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-20 md:py-32 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2322c55e\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
            }}></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6"
                    >
                        <Zap className="w-4 h-4" />
                        Platform Features
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-playfair-bold text-slate-900 mb-6 leading-tight">
                        Everything You Need for
                        <span className="block text-green-600">Modern Agriculture</span>
                    </h2>
                    <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        A comprehensive ecosystem that combines AI, blockchain, and smart contracts to revolutionize agricultural supply chains.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            {/* Card with image background */}
                            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                {/* Image background */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                </div>
                                
                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    {/* Icon and stats */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-green-400/30">
                                            <item.icon className="w-6 h-6 text-green-400" />
                                        </div>
                                        <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-3 py-1 rounded-full">
                                            {item.stats}
                                        </span>
                                    </div>
                                    
                                    {/* Title and description */}
                                    <h3 className="text-xl font-playfair-bold mb-2">{item.title}</h3>
                                    <p className="text-base text-white/80 leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                                
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Link 
                        to="/register"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all duration-300 shadow-xl shadow-emerald-600/20 hover:shadow-2xl hover:shadow-emerald-600/30 active:scale-95 group"
                    >
                        <BarChart3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Explore All Features
                        <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
