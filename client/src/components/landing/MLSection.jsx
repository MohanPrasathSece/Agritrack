import cropImage from "../../assets/crop-quality.jpg";
import { CheckCircle } from "lucide-react";

const capabilities = [
    "High-accuracy imaging for quality grading",
    "Real-time identification of crop characteristics",
    "Fair, objective categorization for every batch",
    "Continuous system optimization through data",
];

const MLSection = () => {
    return (
        <section className="bg-emerald-900 py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div>
                        <p className="text-xs font-inter-bold uppercase tracking-[0.3em] text-emerald-400 mb-4 block">Quality Standards</p>
                        <h2 className="text-4xl md:text-5xl font-playfair-bold text-white mb-6 tracking-tight">
                            Automated Quality Verification
                        </h2>
                        <p className="text-emerald-100/70 text-base mb-8 leading-relaxed font-inter-normal">
                            Our intelligent imaging analysis examines crop characteristics to provide objective, consistent quality grades — removing subjectivity and ensuring fair market value for every producer.
                        </p>
                        <ul className="space-y-2">

                            {capabilities.map((item) => (
                                <li key={item} className="flex items-center gap-4 group">
                                    <div className="p-1.5 bg-emerald-800 rounded-lg group-hover:bg-emerald-400 transition-colors">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-emerald-50/90 text-sm font-inter-semibold">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-emerald-400/20 rounded-[2.5rem] blur-2xl group-hover:bg-emerald-400/30 transition-all duration-700" />
                        <div className="relative rounded-[2rem] overflow-hidden border-8 border-white/5 shadow-2xl">
                            <img src={cropImage} alt="Automated crop quality analysis" className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MLSection;
