import { TrendingUp, Heart, Users } from "lucide-react";

const impacts = [
    { icon: TrendingUp, title: "Fair Pricing", description: "Data-driven grading eliminates subjective pricing, ensuring farmers receive what they deserve." },
    { icon: Heart, title: "Farmer Empowerment", description: "Direct market access, trust scores, and timely payments uplift farming communities." },
    { icon: Users, title: "Consumer Trust", description: "Full traceability lets consumers make informed, ethical purchasing decisions." },
];

const ImpactSection = () => {
    return (
        <section className="bg-white py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-inter-bold uppercase tracking-wider text-emerald-600 mb-3">Impact</p>
                    <h2 className="text-3xl md:text-4xl font-playfair-bold text-slate-900 mb-4">
                        Why Crop Chain Matters
                    </h2>
                    <p className="text-slate-600 text-lg font-inter-normal">
                        Creating lasting change in how agricultural commerce operates.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {impacts.map((item, i) => (
                        <div key={item.title} className="text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                                <item.icon className="h-7 w-7 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-playfair-semibold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-600 text-base font-inter-normal leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactSection;
