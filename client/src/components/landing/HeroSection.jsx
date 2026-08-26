import React, { useState, useEffect } from "react";
import farmerImage from "../../assets/hero-carousal/hero-farmer.jpg";
import aggregatorImage from "../../assets/hero-carousal/aggragotr.jpg";
import retailerImage from "../../assets/hero-carousal/retailers.jpg";
import heroAgriculture from "../../assets/hero-carousal/hero-agriculture.jpg";
import heroFarm from "../../assets/hero-carousal/hero-farm.jpg";
import heroFarm3 from "../../assets/hero-carousal/hero-farm3.jpg";
import pathwayField from "../../assets/hero-carousal/pathway-though-green-field.jpg";
import scenicRice from "../../assets/hero-carousal/scenic-view-rice-field.jpg";

const heroSlides = [
    {
        image: scenicRice,
        badge: "Premium Quality",
        title: "Farm to Table",
        highlight: "Transparency",
        description: "Track every step of your agricultural journey with blockchain-powered traceability and AI-driven quality assessment.",
    },
    {
        image: pathwayField,
        badge: "Smart Agriculture",
        title: "Digital Supply Chain",
        highlight: "Revolution",
        description: "Connect farmers, aggregators, and retailers in a seamless ecosystem powered by smart contracts and quality verification.",
    },
    {
        image: heroFarm3,
        badge: "AI-Powered",
        title: "Quality Assurance",
        highlight: "Excellence",
        description: "Advanced machine learning algorithms analyze crop quality in real-time, ensuring only the best reaches the market.",
    },
    {
        image: heroAgriculture,
        badge: "Direct Trading",
        title: "Fair Market",
        highlight: "Access",
        description: "Eliminate middlemen and connect directly with verified buyers for better prices and faster payments.",
    },
    {
        image: heroFarm,
        badge: "Blockchain Secured",
        title: "Immutable Records",
        highlight: "Trust",
        description: "Every transaction and quality assessment is recorded on the blockchain, creating unbreakable trust in the supply chain.",
    },
    {
        image: farmerImage,
        badge: "Farmer Solution",
        title: "Direct Marketplace for",
        highlight: "Producers",
        description: "List your harvests, track quality with AI, and connect with verified buyers in the regional network.",
    },
    {
        image: aggregatorImage,
        badge: "Aggregator Hub",
        title: "Streamline Your",
        highlight: "Collections",
        description: "Manage pickups efficiently, ensure quality control, and maintain complete traceability across your nodes.",
    },
    {
        image: retailerImage,
        badge: "Retailer Nexus",
        title: "Source Quality",
        highlight: "Verified Assets",
        description: "Access verified produce, track delivery in real-time, and offer your customers complete blockchain traceability.",
    }
];

const HeroSection = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentSlide = heroSlides[currentSlideIndex];

    return (
        <section id="hero" className="relative flex items-center justify-center bg-black overflow-hidden min-h-screen" style={{ height: 'calc(100vh - 72px)' }}>
            {/* Fullscreen Slideshow Background */}
            <div className="absolute inset-0">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img
                            src={slide.image}
                            alt=""
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Dark gradient overlay — stronger at bottom and left */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 mt-[-32px]">
                <div className="max-w-2xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-[10px] uppercase tracking-widest font-inter-semibold">
                        {currentSlide.badge}
                    </div>
                    <h1
                        className="text-5xl md:text-7xl font-playfair-bold text-white leading-tight tracking-tight transition-all duration-700"
                    >
                        {currentSlide.title}<br />
                        <span className="text-green-400">{currentSlide.highlight}</span>
                    </h1>
                    <p className="text-base text-white/70 max-w-lg leading-relaxed font-inter-medium">
                        {currentSlide.description}
                    </p>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-6 z-20 flex gap-2">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlideIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlideIndex ? 'w-8 bg-green-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
