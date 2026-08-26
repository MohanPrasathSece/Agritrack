import React from "react";
import { motion } from "framer-motion";
import aboutImage from "../../assets/about-agriculture.jpg";

const AboutSection = () => {
    return (
        <section id="about" className="bg-white py-16 lg:py-24 overflow-hidden relative">
            <div className="container mx-auto px-4">
                <div className="grid items-center gap-20 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-[0.15em] mb-6">
                            Our Mission
                        </div>
                        <h2 className="mb-6 text-3xl font-semibold lg:text-4xl text-slate-900 tracking-tight leading-snug">
                            Bridging the Gap in <br />
                            <span className="text-primary italic">Indian Agriculture</span>
                        </h2>

                        <div className="space-y-8">
                            <p className="leading-relaxed text-slate-500 text-lg font-medium max-w-xl">
                                India's agricultural supply chain has long been opaque.
                                We're building the first decentralized infrastructure to eliminate middlemen
                                and return power to the producers.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-transparent">
                                    <h4 className="font-semibold text-slate-900 text-lg mb-2 tracking-tight">Fair Pricing</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Direct connection models release up to 40% more value back to the farm gate.</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-transparent">
                                    <h4 className="font-semibold text-slate-900 text-lg mb-2 tracking-tight">Total Trust</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Ethereum-backed visibility ensures that every data point is immutable and globally verified.</p>
                                </div>
                            </div>

                            <div className="pt-6 flex items-center gap-3 text-primary font-semibold text-[13px] uppercase tracking-wider cursor-pointer hover:gap-5 transition-all">
                                Read the Whitepaper <span>→</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative"
                    >
                        <div className="relative z-10 p-3 bg-slate-100 rounded-[2.5rem]">
                            <img
                                src={aboutImage}
                                alt="Modern Agriculture"
                                className="w-full rounded-[2rem] shadow-xl transition-transform duration-700 hover:scale-105"
                            />

                            {/* Pro stats card */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] z-20 border border-slate-50 min-w-[240px]"
                            >
                                <div className="space-y-1.5">
                                    <p className="text-4xl font-semibold text-primary tracking-tighter">40%+</p>
                                    <p className="text-xs font-semibold text-slate-900 uppercase tracking-widest leading-none">Net Income Growth</p>
                                    <p className="text-[10px] font-semibold text-slate-400">Average increase recorded for onboarded farmers in Q4 2025.</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-12 -left-12 h-64 w-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
