import React, { useState, useEffect } from "react";
import { Menu, X, Wheat, ShieldCheck, Languages, Globe, ChevronDown, Leaf, Sprout } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [translateOpen, setTranslateOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Available languages with their codes and names
    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
        { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
        { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
        { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
        { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
        { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Initialize Google Translate
    useEffect(() => {
        const initGoogleTranslate = () => {
            if (typeof google !== 'undefined' && google.translate) {
                // Initialize desktop translate element
                new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: languages.map(lang => lang.code).join(','),
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');

                // Initialize mobile translate element
                new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: languages.map(lang => lang.code).join(','),
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element_mobile');
            }
        };

        // Load Google Translate script
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.head.appendChild(script);
        }

        // Set up global callback
        window.googleTranslateElementInit = initGoogleTranslate;

        return () => {
            // Cleanup if needed
        };
    }, []);

    const navLinks = [
        { label: "Traceability", href: "#how-it-works", isExternal: false },
        { label: "Stakeholders", href: "#roles", isExternal: false },
        { label: "Features", href: "#features", isExternal: false },
        { label: "FAQ", href: "#faq", isExternal: false },
    ];

    const handleLanguageChange = (languageCode) => {
        setSelectedLanguage(languageCode);
        setTranslateOpen(false);
        
        // Change Google Translate language
        if (typeof google !== 'undefined' && google.translate) {
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
                selectElement.value = languageCode;
                selectElement.dispatchEvent(new Event('change'));
            }
        }
    };

    const handleNavClick = (href, isExternal) => {
        setMobileOpen(false);
        if (isExternal || href.startsWith('/')) {
            navigate(href);
            return;
        }

        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const el = document.querySelector(href);
                el?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            const el = document.querySelector(href);
            el?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
        <header
            className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-white/90 backdrop-blur-xl border-b border-emerald-100/50 py-3 shadow-lg shadow-emerald-500/5"
                : "bg-transparent py-4 md:py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo - Modern Design */}
                <Link
                    to="/"
                    className="flex items-center gap-4 group transition-all duration-300 hover:scale-105"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <div className="flex items-center">
                        <img src="/logo.png" alt="Logo" className="w-40 md:w-48 object-contain drop-shadow-sm mix-blend-multiply" />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-12 lg:flex">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <motion.button
                                key={link.label}
                                onClick={() => handleNavClick(link.href, link.isExternal)}
                                className="relative text-[15px] font-medium text-gray-700 transition-all duration-300 hover:text-emerald-600 hover:scale-105 py-2 px-4 rounded-lg hover:bg-emerald-50/50"
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                {link.label}
                                <span className="absolute -bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300 group-hover:w-full" />
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 ml-6 pl-8 border-l border-emerald-100">
                        {/* Enhanced Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setTranslateOpen(!translateOpen)}
                                className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl transition-all duration-300 hover:scale-105 border border-emerald-200/50"
                                title="Select Language"
                            >
                                <Globe className="h-5 w-5 text-emerald-600" />
                                <ChevronDown className={`h-4 w-4 text-emerald-600 transition-transform duration-300 ${translateOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {translateOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 min-w-[320px] z-50"
                                    >
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-emerald-600" />
                                                Select Language
                                            </h4>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto">
                                            {languages.map((language) => (
                                                <motion.button
                                                    key={language.code}
                                                    onClick={() => handleLanguageChange(language.code)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                                                        selectedLanguage === language.code 
                                                            ? 'bg-emerald-100 border-2 border-emerald-300' 
                                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                                    }`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <span className="text-xl">{language.flag}</span>
                                                    <div className="text-left">
                                                        <p className="font-medium text-gray-900 text-sm">{language.name}</p>
                                                        <p className="text-xs text-gray-500">{language.code.toUpperCase()}</p>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>

                                        <div className="border-t pt-3">
                                            <div id="google_translate_element" className="min-h-[40px]"></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {isAuthenticated ? (
                            <>
                                <Link to="/my-orders">
                                    <Button variant="ghost" className="font-normal text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg px-4">
                                        Orders
                                    </Button>
                                </Link>
                                <Button
                                    onClick={logout}
                                    className="rounded-xl px-6 h-10 font-normal shadow-lg shadow-green-500/10 hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-red-500 to-orange-500 border-none"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="font-normal text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg px-4">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="rounded-xl px-6 h-10 font-normal shadow-lg shadow-green-500/10 hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-green-600 to-emerald-500 border-none">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden p-2 hover:bg-green-50 rounded-xl transition-colors"
                >
                    {mobileOpen ? (
                        <X className="h-6 w-6 text-slate-700" />
                    ) : (
                        <Menu className="h-6 w-6 text-slate-700" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-emerald-100"
                    >
                        <div className="container mx-auto px-4 py-8">
                            {/* Enhanced Mobile Translate */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-emerald-600" />
                                        <span className="text-sm font-semibold text-gray-900">Language</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-emerald-600">
                                            {languages.find(l => l.code === selectedLanguage)?.flag || '🌐'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {selectedLanguage?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 mb-4 max-h-48 overflow-y-auto">
                                    {languages.slice(0, 9).map((language) => (
                                        <button
                                            key={language.code}
                                            onClick={() => handleLanguageChange(language.code)}
                                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                                                selectedLanguage === language.code 
                                                    ? 'bg-emerald-100 border-2 border-emerald-300' 
                                                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-lg">{language.flag}</span>
                                            <span className="text-xs text-gray-700 text-center">{language.code.toUpperCase()}</span>
                                        </button>
                                    ))}
                                </div>
                                
                                <div id="google_translate_element_mobile" className="min-h-[40px]"></div>
                            </div>

                            <div className="flex flex-col space-y-1 mb-8">
                                {navLinks.map((link, idx) => (
                                    <motion.button
                                        key={link.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => handleNavClick(link.href, link.isExternal)}
                                        className="w-full text-2xl font-normal text-slate-800 hover:text-green-600 transition-colors py-3 text-left border-b border-green-50"
                                    >
                                        {link.label}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-auto py-10 space-y-4">
                                <Link to="/trace" onClick={() => setMobileOpen(false)}>
                                    <Button size="lg" variant="outline" className="w-full rounded-xl font-normal h-14 text-lg border-2 border-green-200 hover:bg-green-50">
                                        <ShieldCheck className="mr-2 h-5 w-5 text-green-600" />
                                        Verify Product
                                    </Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)}>
                                    <Button size="lg" className="w-full rounded-xl font-normal h-14 text-lg shadow-xl shadow-green-500/10 bg-gradient-to-r from-green-600 to-emerald-500">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <p className="text-center text-slate-400 text-sm font-normal">
                                    Already using Agritrack? <Link to="/login" className="text-green-600 font-normal">Login</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Initialize mobile translate element */}
            <script dangerouslySetInnerHTML={{
                __html: `
                    if (typeof google !== 'undefined' && google.translate) {
                        new google.translate.TranslateElement({
                            pageLanguage: 'en',
                            includedLanguages: '${languages.map(lang => lang.code).join(',')}',
                            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                        }, 'google_translate_element_mobile');
                    }
                `
            }} />
        </header>
        
        <style>{`
            /* Hide all of Google's native components and overlays */
            .goog-te-spinner-pos, .goog-te-spinner-animation, .goog-te-spinner { display: none !important; }
            .goog-te-banner-frame { display: none !important; }
            body { top: 0 !important; }
            .goog-te-gadget { display: none !important; color: transparent !important; }
            .goog-te-gadget .goog-te-combo { color: #000 !important; }
            .goog-te-menu-frame { display: none !important; }
            .goog-tooltip { display: none !important; }
            .goog-tooltip:hover { display: none !important; }
            .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
            .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
            #goog-gt-tt { display: none !important; }
            iframe.skiptranslate { display: none !important; visibility: hidden !important; }
        `}</style>
        </>
    );
};

export default Header;
