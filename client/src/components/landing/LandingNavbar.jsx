import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import GoogleTranslate from "../GoogleTranslate";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Scan Products", href: "/scan-product" },
    { label: "FAQ", href: "/#faq" },
];

const LandingNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href) => {
        setMenuOpen(false);
        if (href.startsWith("/#")) {
            const id = href.slice(2);
            if (location.pathname === "/") {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                navigate("/");
                setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } else {
            navigate(href);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-gradient-to-r from-emerald-50/95 via-white/95 to-emerald-50/95 backdrop-blur-xl border-b border-emerald-100/50 shadow-lg shadow-emerald-500/10"
                    : "bg-gradient-to-r from-emerald-600/10 via-transparent to-emerald-600/10 backdrop-blur-sm"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Premium Logo */}
                <Link
                    to="/"
                    className="group flex items-center transition-all duration-300 hover:scale-105"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <img 
                        src="/logo.png" 
                        alt="AgriTrack Logo" 
                        className="w-16 h-16 object-contain"
                    />
                </Link>

                {/* Premium Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => handleNavClick(link.href)}
                            className={`relative px-4 py-2 font-inter-semibold text-sm transition-all duration-300 hover:text-emerald-700 group ${
                                scrolled ? "text-gray-700" : "text-white"
                            }`}
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </button>
                    ))}
                </div>

                {/* Premium Language & Actions */}
                <div className="flex items-center gap-4">
                    {/* Google Translate Integration */}
                    <GoogleTranslate landingPage={true} />

                    <div className="hidden lg:flex items-center gap-3">
                        <Link 
                            to="/login" 
                            className={`group relative px-6 py-3 rounded-2xl backdrop-blur-sm border font-inter-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                                scrolled 
                                    ? "bg-white/50 border-emerald-200/50 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300" 
                                    : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                            }`}
                        >
                            Log In
                            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                        </Link>
                        <Link 
                            to="/register" 
                            className="group relative px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-inter-semibold text-sm hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Get Started
                            <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`lg:hidden relative p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 shadow-sm hover:shadow-md ${
                            scrolled 
                                ? "bg-white/50 border-emerald-200/50 hover:bg-white hover:border-emerald-300" 
                                : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                        }`}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? (
                            <X className={`h-6 w-6 transition-colors duration-500 ${
                                scrolled ? "text-emerald-600" : "text-white"
                            }`} />
                        ) : (
                            <Menu className={`h-6 w-6 transition-colors duration-500 ${
                                scrolled ? "text-emerald-600" : "text-white"
                            }`} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="lg:hidden bg-gradient-to-b from-white/95 to-emerald-50/95 backdrop-blur-xl border-t border-emerald-100/50 shadow-xl">
                    <div className="px-6 py-8 space-y-6">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => handleNavClick(link.href)}
                                className="block w-full text-left text-lg font-inter-semibold text-gray-800 hover:text-emerald-700 transition-colors duration-300 py-3 border-b border-gray-100 hover:border-emerald-200"
                            >
                                {link.label}
                            </button>
                        ))}
                        <div className="border-t border-emerald-200 pt-6">
                            <div className="mb-6">
                                <GoogleTranslate landingPage={true} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <Link 
                                    to="/login" 
                                    onClick={() => setMenuOpen(false)} 
                                    className="w-full text-center py-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-emerald-200/50 text-emerald-700 font-inter-semibold text-lg hover:bg-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    Log In
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setMenuOpen(false)} 
                                    className="w-full text-center py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-inter-semibold text-lg hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNavbar;
