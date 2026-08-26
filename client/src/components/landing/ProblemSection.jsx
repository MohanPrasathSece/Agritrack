import { AlertTriangle, DollarSign, ShieldOff, Clock, TrendingDown, Users, Package } from "lucide-react";
import { motion } from "framer-motion";
import heroAgriculture from "../../assets/hero-agriculture.jpg";
import home1 from "../../assets/home1.jpg";

const problems = [
    {
        icon: TrendingDown,
        title: "Middlemen Exploitation",
        description: "Farmers lose up to 40% of income to intermediaries who control pricing and information.",
        impact: "40% Income Loss",
        color: "red"
    },
    {
        icon: ShieldOff,
        title: "No Quality Verification",
        description: "Consumers have no way to verify product quality, origin, or safety claims.",
        impact: "Zero Trust",
        color: "orange"
    },
    {
        icon: Clock,
        title: "Payment Delays",
        description: "Small farmers wait weeks or months for payments, disrupting cash flow and livelihood.",
        impact: "60-90 Days",
        color: "amber"
    },
    {
        icon: Users,
        title: "Information Asymmetry",
        description: "Lack of transparent pricing and grading systems disadvantages honest producers.",
        impact: "Unfair Market",
        color: "purple"
    }
];

const ProblemSection = () => {
    return (
        <section id="problem" className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 md:py-32 overflow-hidden">
            {/* Split background */}
            <div className="absolute inset-0">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-slate-900 to-slate-800"></div>
                <div className="absolute inset-y-0 right-0 w-1/2 bg-white"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            The Challenge
                        </motion.div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Agriculture's
                            <span className="block text-red-600">Broken Supply Chain</span>
                        </h2>
                        
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Traditional systems create systemic barriers that exploit farmers and leave consumers uninformed. 
                            The current agricultural supply chain is fragmented, opaque, and inefficient.
                        </p>

                        {/* Stats */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-6"
                        >
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                                <div className="text-3xl font-bold text-red-600">40%</div>
                                <div className="text-sm text-slate-600">Income Lost to Middlemen</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                                <div className="text-3xl font-bold text-orange-600">60%</div>
                                <div className="text-sm text-slate-600">Farmers Lack Market Access</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right side - Visual */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Main image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={home1} 
                                alt="Agricultural challenges"
                                className="w-full h-96 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Overlay stats */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-6 h-6 text-red-600" />
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">Supply Chain Losses</div>
                                                <div className="text-xs text-slate-600">30-50% of total value</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-red-600">₹2.5L</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating problem cards */}
                        <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Critical Issue
                        </div>
                    </motion.div>
                </div>

                {/* Bottom problem cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
                >
                    {problems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-lg bg-${item.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                                </div>
                                
                                {/* Content */}
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">{item.description}</p>
                                
                                {/* Impact badge */}
                                <div className={`inline-block px-3 py-1 bg-${item.color}-50 text-${item.color}-700 rounded-full text-xs font-semibold`}>
                                    {item.impact}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProblemSection;
