import { Camera, BrainCircuit, ShieldCheck, QrCode, ClipboardCheck } from "lucide-react";

const steps = [
    {
        icon: Camera,
        title: "Capture",
        description: "Upload crop photos"
    },
    {
        icon: BrainCircuit,
        title: "Analyze", 
        description: "AI grades quality"
    },
    {
        icon: ShieldCheck,
        title: "Secure",
        description: "Blockchain protected"
    },
    {
        icon: QrCode,
        title: "Track",
        description: "QR traceability"
    },
    {
        icon: ClipboardCheck,
        title: "Verify",
        description: "Automated checks"
    }
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="bg-slate-50 py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Simple Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-playfair-bold text-slate-900 mb-6">
                        From Farm to Fork
                    </h2>
                    <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8"></div>
                    <p className="text-slate-600 font-inter-normal text-base max-w-2xl mx-auto">
                        A seamless journey ensuring trust at every step
                    </p>
                </div>

                {/* Timeline Design */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-200"></div>
                        
                        {steps.map((step, i) => (
                            <div key={step.title} className="relative flex items-center mb-12 last:mb-0">
                                {/* Circle */}
                                <div className="absolute left-8 w-16 h-16 -translate-x-1/2 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10">
                                    <step.icon className="w-6 h-6 text-emerald-600" />
                                </div>
                                
                                {/* Content */}
                                <div className="ml-24">
                                    <div className="text-xs font-inter-medium text-emerald-600 mb-1">
                                        STEP {i + 1}
                                    </div>
                                    <h3 className="text-2xl font-playfair-bold text-slate-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 font-inter-normal text-base">
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
