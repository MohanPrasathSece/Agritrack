import { Brain, ShieldCheck, ArrowRight, Zap, CheckCircle, Smartphone, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import heroFarm3 from "../../assets/hero-farm3.jpg";
import gallery1 from "../../assets/gallery-1.jpg";

const solutions = [
    {
        icon: Brain,
        title: "AI-Powered Quality Analysis",
        description: "Advanced computer vision analyzes crop quality in real-time, providing objective grading and market recommendations.",
        benefit: "98.5% Accuracy",
        color: "green"
    },
    {
        icon: ShieldCheck,
        title: "Blockchain Security",
        description: "Immutable smart contracts ensure transparent transactions and tamper-proof quality records.",
        benefit: "100% Trust",
        color: "blue"
    },
    {
        icon: Smartphone,
        title: "Mobile-First Design",
        description: "Intuitive mobile apps for farmers, aggregators, and retailers with offline capabilities.",
        benefit: "Easy Access",
        color: "purple"
    },
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
        description: "Comprehensive dashboards provide insights into market trends, quality metrics, and supply chain performance.",
        benefit: "Data-Driven",
        color: "orange"
    }
];

const SolutionSection = () => {
    return (
        <section id="solution" className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 md:py-32 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
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
                        Our Solution
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                        Technology That
                        <span className="block text-green-600">Transforms Agriculture</span>
                    </h2>
                    
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We combine cutting-edge AI, blockchain, and mobile technology to create a transparent, 
                        efficient, and fair agricultural ecosystem for all stakeholders.
                    </p>
                </motion.div>

                {/* Main content grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    {/* Left side - Solutions grid */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {solutions.map((solution, index) => (
                            <motion.div
                                key={solution.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
                                    {/* Icon and benefit */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-lg bg-${solution.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <solution.icon className={`w-6 h-6 text-${solution.color}-600`} />
                                        </div>
                                        <span className={`text-xs font-semibold bg-${solution.color}-50 text-${solution.color}-700 px-3 py-1 rounded-full`}>
                                            {solution.benefit}
                                        </span>
                                    </div>
                                    
                                    {/* Content */}
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{solution.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{solution.description}</p>
                                </div>
                            </motion.div>
                        ))}
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
                                src={heroFarm3} 
                                alt="Technology solution"
                                className="w-full h-96 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent" />
                            
                            {/* Floating elements */}
                            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Smart Contracts</div>
                                        <div className="text-xs text-slate-600">Automated & Secure</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <Brain className="w-6 h-6 text-green-600" />
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">AI Analysis</div>
                                        <div className="text-xs text-slate-600">Real-time Processing</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300">
                        <span>Experience the Future of Agriculture</span>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SolutionSection;
