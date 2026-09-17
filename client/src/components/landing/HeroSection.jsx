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
        badge: "AI Quality Assessment",
        title: "Intelligent Farm to Market",
        highlight: "Auction Platform",
        description: "Upload crop photos for Gemini Vision AI quality grading and instant fair-price estimation to empower farmers in dynamic auctions.",
    },
    {
        image: pathwayField,
        badge: "Real-Time Bidding",
        title: "Smart Bidder Availability &",
        highlight: "Live Auctions",
        description: "Match farmer listings with active, verified buyers in real time based on crop demand, quantity feasibility, and location.",
    },
    {
        image: heroFarm3,
        badge: "Fallback Sale Protection",
        title: "4-Level Guaranteed",
        highlight: "Produce Sale",
        description: "Multi-tier safety fallback: auction extension, neighboring district buyer matching, and instant direct retailer purchasing.",
    },
    {
        image: heroAgriculture,
        badge: "IoT Cold-Chain Telemetry",
        title: "ESP32 + DHT22 Smart",
        highlight: "Transit Monitoring",
        description: "Track temperature and humidity in real-time from buyer to retailer to ensure fresh produce delivery without spoilage.",
    },
    {
        image: farmerImage,
        badge: "Farmer First",
        title: "Fair Pricing & Transparent",
        highlight: "Auctions",
        description: "AI-assisted price recommendations eliminate guesswork and help farmers maximize harvest revenue.",
    },
    {
        image: aggregatorImage,
        badge: "Buyer Feasibility Hub",
        title: "Live Bidding & Multi-District",
        highlight: "Procurement",
        description: "Toggle active availability, join high-speed live auctions, and manage fresh produce consignments seamlessly.",
    },
    {
        image: retailerImage,
        badge: "Retailer Quality Terminal",
        title: "Fresh Verified Produce with",
        highlight: "Condition Logs",
        description: "Source directly from local farmers and verify cold-chain environmental compliance before accepting delivery.",
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
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
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
                        className="text-4xl md:text-6xl font-playfair-bold text-white leading-tight tracking-tight transition-all duration-700"
                    >
                        {currentSlide.title}<br />
                        <span className="text-emerald-400">{currentSlide.highlight}</span>
                    </h1>
                    <p className="text-base text-white/80 max-w-lg leading-relaxed font-inter-medium">
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
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlideIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
