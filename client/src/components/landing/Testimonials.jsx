import React from "react";
import { Star, Quote, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Wheat Farmer, Punjab",
        content: "Agritrack has completely changed how I sell my harvest. I get fair prices directly without any middlemen skimming off my hard-earned money. The digital reputation is helping me get easier credit too.",
        rating: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
    },
    {
        name: "Anita Singh",
        role: "Organic Retailer, Delhi",
        content: "The QR traceability is a game-changer for my customers. They can see exactly which farm their vegetables come from. It's built immense trust and customer loyalty for my brand.",
        rating: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita"
    },
    {
        name: "Vijay Sharma",
        role: "Regional Aggregator",
        content: "Managing logistics and quality grading becomes so much easier with the blockchain ledger. Everything is transparent and the automated payments save so much overhead.",
        rating: 4,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay"
    }
];

const Testimonials = () => {
    return (
        <section className="bg-white py-16 lg:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5"
                    >
                        <MessageSquare className="h-5 w-5" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 text-2xl font-semibold lg:text-3xl"
                    >
                        Voice of the <span className="text-primary">Ecosystem</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-base"
                    >
                        Join thousands of satisfied farmers and partners who have transformed their agricultural business with Agritrack.
                    </motion.p>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            whileHover={{ y: -6 }}
                            className="bg-slate-50 p-6 lg:p-8 rounded-[1.5rem] relative transition-all border border-slate-100 group shadow-lg shadow-slate-200/40"
                        >
                            <Quote className="absolute top-8 right-8 h-10 w-10 text-primary/5 group-hover:text-primary/10 transition-all group-hover:scale-125" />

                            <div className="flex items-center gap-1.5 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-slate-700 mb-8 text-base leading-relaxed relative z-10 font-medium">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-200/60">
                                <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-base">{t.name}</h4>
                                    <p className="text-[11px] text-primary font-semibold uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Decorative background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none -z-0">
                <svg width="100%" height="100%">
                    <pattern id="test-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#test-grid)" />
                </svg>
            </div>
        </section>
    );
};

export default Testimonials;
