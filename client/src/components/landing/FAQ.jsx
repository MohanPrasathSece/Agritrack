import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "How does Agritrack ensure fair pricing?",
        answer: "By removing traditional middlemen and providing a transparent blockchain ledger, farmers can set their own prices based on real-time market data, and transactions are verified by all parties. This ensures more value remains with the producer."
    },
    {
        question: "Is my data secure on the blockchain?",
        answer: "Yes, we use enterprise-grade blockchain technology to create an immutable record of all transactions. Only authorized parties with specific roles can access relevant trade data, ensuring privacy while maintaining transparency."
    },
    {
        question: "How do I verify a product's origin?",
        answer: "Simply use our 'Verify Product' tool or any QR scanner to scan the code on the product packaging. You'll see the complete journey—from the exact harvest time to the aggregator collection and final retail arrival."
    },
    {
        question: "Who can join the Agritrack platform?",
        answer: "Our platform is open to individual farmers, agricultural cooperatives, aggregators, and retail chains. Dashboards are specialized for each role to manage their specific part of the supply chain, while traceability tools remain open for public verification."
    },
    {
        question: "What technology powers the traceability?",
        answer: "We use a combination of Ethereum-compatible blockchain for immutable records, Supabase for real-time data management, and AI-powered quality checks during the aggregation phase."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faq" className="bg-slate-50 py-16 lg:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md text-primary mb-5"
                    >
                        <HelpCircle className="h-5 w-5" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-3 text-2xl font-semibold lg:text-3xl"
                    >
                        Got <span className="text-primary">Questions?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-base"
                    >
                        Everything you need to know about the Agritrack platform.
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group rounded-2xl border transition-all duration-300 ${openIndex === index
                                ? "bg-white border-primary/20 shadow-lg shadow-primary/5"
                                : "bg-white/50 border-slate-200 hover:border-slate-300 shadow-sm"
                                }`}
                        >
                            <button
                                className="w-full flex items-center justify-between p-5 lg:p-6 text-left transition-colors"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className={`text-[17px] font-semibold transition-colors ${openIndex === index ? "text-primary" : "text-slate-900 group-hover:text-primary"}`}>
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                        }`}
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-5 pb-6 lg:px-6 lg:pb-8">
                                            <div className="h-px bg-slate-100 mb-5" />
                                            <p className="text-slate-600 leading-relaxed text-[16px]">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-blue-500/5 rounded-full blur-3xl" />
        </section>
    );
};

export default FAQ;
