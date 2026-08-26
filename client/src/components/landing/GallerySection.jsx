import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gallery1 from "../../assets/gallery-1.jpg";
import gallery2 from "../../assets/gallery-2.jpg";
import gallery3 from "../../assets/gallery-3.jpg";
import gallery4 from "../../assets/gallery-4.jpg";

const images = [
    { src: gallery1, caption: "Smart Farming with AI & IoT" },
    { src: gallery2, caption: "Real-Time Crop Data Analytics" },
    { src: gallery3, caption: "Quality Inspection & Grading" },
    { src: gallery4, caption: "Supply Chain Traceability" },
];

const GallerySection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="gallery" className="section-light-green py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Gallery</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                        See Crop Chain in Action
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        From farm fields to quality labs — a glimpse into our platform.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="aspect-video rounded-3xl overflow-hidden bg-card border border-border relative shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={current}
                                src={images[current].src}
                                alt={images[current].caption}
                                className="w-full h-full object-cover absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            />
                        </AnimatePresence>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                            <p className="text-white font-semibold text-xl">{images[current].caption}</p>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-4 h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-8" : "bg-green-200"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
