import React, { useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Box, Store, ShoppingBag, CheckCircle2 } from "lucide-react";

// Fallback images if the ones in assets are missing or to ensure visual consistency
const roles = [
    {
        id: "farmer",
        title: "Farmer",
        icon: Sprout,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "List your crops, get fair prices, and build a digital reputation on the blockchain.",
        features: [
            "Direct marketplace access",
            "Immutable harvest records",
            "Fair price transparency",
            "Electronic payment security"
        ],
        cta: "Start Selling",
        link: "/register?role=farmer"
    },
    {
        id: "aggregator",
        title: "Aggregator",
        icon: Box,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Collect high-quality produce, verify with AI, and manage traceable batches efficiently.",
        features: [
            "AI-powered quality check",
            "Batch management tools",
            "Supply chain logistics",
            "QR code generation"
        ],
        cta: "Join as Aggregator",
        link: "/register?role=aggregator"
    },
    {
        id: "retailer",
        title: "Retailer",
        icon: Store,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        description: "Source verified produce directly from farmers and aggregators with full transparency.",
        features: [
            "Verified source tracking",
            "Bulk purchase discounts",
            "Inventory management",
            "Quality assurance"
        ],
        cta: "Marketplace Access",
        link: "/register?role=retailer"
    }
];

const RoleSections = () => {
    const [activeRole, setActiveRole] = useState("farmer");

    return (
        <section id="roles" className="bg-white py-16 lg:py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 text-2xl font-semibold lg:text-3xl"
                    >
                        Tailored for Every <span className="text-primary">Stakeholder</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-base"
                    >
                        Our platform provides specialized tools for everyone in the agricultural value chain.
                    </motion.p>
                </div>

                {/* Role Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setActiveRole(role.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeRole === role.id
                                ? `${role.bgColor} ${role.color} ring-1 ring-primary/20 shadow-md`
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            <role.icon className={`h-5 w-5 ${activeRole === role.id ? role.color : "text-slate-400"}`} />
                            {role.title}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {roles.map((role) => role.id === activeRole && (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`grid lg:grid-cols-2 gap-10 p-6 lg:p-12 rounded-[2.5rem] border ${role.borderColor} ${role.bgColor} relative overflow-hidden`}
                            >
                                {/* Giant Background Icon */}
                                <role.icon className={`absolute -bottom-20 -right-20 h-96 w-96 ${role.color} opacity-[0.03] -rotate-12 pointer-events-none`} />

                                <div className="relative z-10 flex flex-col justify-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ${role.color}`}
                                    >
                                        <role.icon className="h-7 w-7" />
                                    </motion.div>

                                    <h3 className="text-2xl font-semibold mb-4 text-slate-900 leading-tight">
                                        Empowering the <br />
                                        <span className={role.color}>{role.title}</span> Community
                                    </h3>

                                    <p className="text-base text-slate-600 mb-8 leading-relaxed max-w-md font-medium">
                                        {role.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <Link to={role.link}>
                                            <Button size="lg" className={`h-12 px-8 text-base font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg`}>
                                                {role.cta}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col justify-center">
                                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 lg:p-10 border border-white/60 shadow-inner">
                                        <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-8 text-center">Core Functionality</h4>
                                        <div className="grid gap-6">
                                            {role.features.map((feature, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                                    key={feature}
                                                    className="flex items-center gap-4 group"
                                                >
                                                    <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white ${role.color}`}>
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                    <span className="text-base font-semibold text-slate-700">{feature}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default RoleSections;
