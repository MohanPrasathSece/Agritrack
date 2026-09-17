import React from "react";
import { Cpu, Gavel, TrendingUp, Star, ShieldCheck, Zap, BarChart3, Users, Truck, Thermometer, Radio } from "lucide-react";
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
        title: "AI Quality Grading", 
        description: "Gemini Vision assesses crop quality, ripeness percentage, and defects to assign accurate quality grades.",
        image: heroAgriculture,
        stats: "AI-Assisted"
    },
    { 
        icon: TrendingUp, 
        title: "AI Price Prediction", 
        description: "Calculates predicted market price ranges and recommends fair auction starting bids for farmers.",
        image: pathwayField,
        stats: "Market Trends"
    },
    { 
        icon: Radio, 
        title: "Bidder Availability Hub", 
        description: "Matches active (🟢 Available) buyers based on crop interest, required quantity, and delivery radius.",
        image: aggregagotr,
        stats: "Real-Time"
    },
    { 
        icon: Gavel, 
        title: "Live Produce Auctions", 
        description: "Dynamic real-time bidding room where verified buyers submit incremental bids with countdown timers.",
        image: heroFarmer,
        stats: "Transparent"
    },
    { 
        icon: ShieldCheck, 
        title: "4-Level Fallback System", 
        description: "Safety guarantee with auction extension, neighboring district matching, and direct retailer purchase routes.",
        image: heroFarm3,
        stats: "100% Protected"
    },
    { 
        icon: Thermometer, 
        title: "ESP32 + DHT22 Cold Chain", 
        description: "Live sensor monitoring of temperature and humidity during transit between buyer and retailer with breach alerts.",
        image: retailers,
        stats: "IoT Monitored"
    }
];

const FeaturesSection = () => {
    return (
        <section id="features" className="relative bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/50 py-20 md:py-28 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <Zap className="w-3.5 h-3.5" />
                        Key Innovations
                    </div>
                    <h2 className="text-3xl md:text-5xl font-playfair-bold text-slate-900 mb-4 leading-tight">
                        Intelligent Architecture for
                        <span className="block text-emerald-600">Agricultural Supply Chains</span>
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Combining AI image analysis, real-time bidder matchmaking, multi-tier fallback protection, and IoT transit telemetry.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                        >
                            <div className="h-44 overflow-hidden relative">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">
                                    {item.stats}
                                </div>
                            </div>

                            <div className="p-6 space-y-2">
                                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                    <item.icon className="w-5 h-5" />
                                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
