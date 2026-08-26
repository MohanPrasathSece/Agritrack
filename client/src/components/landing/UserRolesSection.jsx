import { Sprout, Building, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const roles = [
    {
        icon: Sprout,
        title: "For Producers & Farmers",
        subtitle: "Direct Market Access",
        description: "List your harvests, access automated quality verification, and receive fair, guaranteed payments directly — bypass traditional intermediaries.",
        benefits: [
            "List harvests for rapid quality verification",
            "Get fair, transparent pricing based on market data",
            "Build a verified profile that attracts top buyers",
            "Receive guaranteed, secure digital payments",
            "Access localized demand insights and forecasts",
        ],
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000",
        color: "bg-primary",
    },
    {
        icon: Building,
        title: "For Aggregators & Enterprises",
        subtitle: "Verified Sourcing Control",
        description: "Access objective quality data, automate your procurement pipeline, and maintain full digital provenance for every batch you process.",
        benefits: [
            "Objective, automated quality reports for every load",
            "Optimize logistics and inventory management",
            "Eliminate record-keeping errors with digital logs",
            "Integrated compliance and audit reporting",
            "End-to-end operational visibility",
        ],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000",
        color: "bg-emerald-600",
    },
    {
        icon: ShoppingBag,
        title: "For Retailers & Markets",
        subtitle: "Quality You Can Trace",
        description: "Deliver total transparency to your customers. Scan any batch to view its verified journey from field to storefront.",
        benefits: [
            "Scan for complete product journey and origin",
            "Objective and verified quality metrics",
            "Strengthen brand trust with proof of origin",
            "Ensure food safety and handling standards",
            "Verify sustainable and ethical practices",
        ],
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000",
        color: "bg-emerald-500",
    },
];

const UserRolesSection = () => {
    return (
        <section id="roles" className="bg-white py-24 md:py-32">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Stakeholder Network</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Built for Every Role in the Ecosystem
                    </h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        A unified environment designed to bring transparency and efficiency to every stage of the supply chain.
                    </p>
                </div>

                <div className="space-y-24 md:space-y-40">
                    {roles.map((role, idx) => (
                        <div key={role.title}>
                            <div className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}>
                                {/* Image Column */}
                                <div className="w-full md:w-1/2 relative group">
                                    <div className="absolute inset-0 md:-inset-4 bg-slate-50 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700 -z-10" />
                                    <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200">
                                        <img
                                            src={role.image}
                                            alt={role.title}
                                            className="w-full h-[350px] md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
                                        <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hidden md:block">
                                            <role.icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="w-full md:w-1/2">
                                    <div className="max-w-xl">
                                        <span className="text-[12px] font-black uppercase text-primary tracking-[0.2em] mb-3 block">{role.subtitle}</span>

                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 tracking-tight">
                                            {role.title}
                                        </h3>

                                        <p className="text-slate-500 font-medium text-[16px] leading-relaxed mb-8">
                                            {role.description}
                                        </p>

                                        <div className="space-y-3 mb-10">
                                            {role.benefits.slice(0, 3).map((benefit) => (
                                                <div
                                                    key={benefit}
                                                    className="flex items-center gap-2.5"
                                                >
                                                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    </div>
                                                    <span className="text-[16px] font-semibold text-slate-600 leading-none">{benefit}</span>
                                                </div>
                                            ))}

                                        </div>

                                        <Link
                                            to="/register"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-[13px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 group"
                                        >
                                            Get Started
                                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserRolesSection;
