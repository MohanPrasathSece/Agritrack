import React from "react";
import { Camera, BrainCircuit, Gavel, Radio, CheckCircle2, ShieldCheck, Thermometer } from "lucide-react";

const steps = [
    {
        icon: Camera,
        title: "1. Upload & AI Quality Assessment",
        description: "Farmer uploads crop photos. Gemini Vision AI inspects color, ripeness, defects, and outputs an AI Quality Grade (A/B/C/Premium)."
    },
    {
        icon: BrainCircuit,
        title: "2. AI Market Price Prediction", 
        description: "The system analyzes crop grade, historical market trends, and seasonal demand to recommend a fair auction starting price."
    },
    {
        icon: Gavel,
        title: "3. Smart Auction & Bidder Matching",
        description: "Eligible active buyers (🟢 Available) receive notifications based on crop interest, required quantity, and delivery radius for live bidding."
    },
    {
        icon: Thermometer,
        title: "4. ESP32 + DHT22 IoT Transport",
        description: "During transportation between buyer and retailer, IoT sensors monitor live temperature & humidity with automated threshold alerts."
    },
    {
        icon: CheckCircle2,
        title: "5. Retailer Terminal Receipt",
        description: "Retailer reviews IoT condition logs and confirms delivery receipt, successfully completing the farm-to-market lifecycle."
    }
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="bg-slate-50 py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Simple Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        End-to-End Workflow
                    </div>
                    <h2 className="text-3xl md:text-5xl font-playfair-bold text-slate-900 mb-4">
                        Intelligent Farm-to-Market Journey
                    </h2>
                    <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                    <p className="text-slate-600 font-inter-normal text-sm md:text-base max-w-2xl mx-auto">
                        Connecting farmers, verified bidders, and retailers through AI grading, real-time auctions, and IoT cold-chain telemetry.
                    </p>
                </div>

                {/* Timeline Design */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-200"></div>
                        
                        {steps.map((step, i) => (
                            <div key={step.title} className="relative flex items-start mb-12 last:mb-0">
                                {/* Circle */}
                                <div className="absolute left-8 w-16 h-16 -translate-x-1/2 bg-white border-2 border-emerald-500 rounded-2xl shadow-md flex items-center justify-center z-10">
                                    <step.icon className="w-6 h-6 text-emerald-600" />
                                </div>
                                
                                {/* Content */}
                                <div className="ml-24 pt-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                                        PHASE {i + 1}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
