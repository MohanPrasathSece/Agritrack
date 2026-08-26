import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

const languages = [
  { code: "en", name: "English", label: "EN", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", label: "HI", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", label: "TA", flag: "🇮🇳" },
  { code: "te", name: "Telugu", label: "TE", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", label: "KN", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", label: "GU", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", label: "MR", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", label: "PA", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", label: "BN", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", label: "ML", flag: "🇮🇳" },
  { code: "or", name: "Odia", label: "OR", flag: "🇮🇳" },
  { code: "as", name: "Assamese", label: "AS", flag: "🇮🇳" },
  { code: "fr", name: "French", label: "FR", flag: "🇫🇷" },
  { code: "es", name: "Spanish", label: "ES", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", label: "PT", flag: "🇵🇹" },
];

const GoogleTranslate = ({ landingPage = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Check if lang is already set via cookies or URL
    const checkLang = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select && select.value) {
        setCurrentLang(prev => prev !== select.value ? select.value : prev);
      }
    };
    
    // Only set one interval polling across all components
    if (!window.__googleTranslateGlobalTimerId) {
        window.__googleTranslateGlobalTimerId = setInterval(checkLang, 1000);
    }

    // Close on click outside
    const handleClickOutside = (e) => {
      if (!e.target.closest(".translate-dropdown-container")) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // We do not clear the global timer here so it works across unmounts of duplicates
    };
  }, []);

  const handleLanguageChange = (code) => {
    try {
      // 1. Try setting the cookie directly (most robust)
      const domain = window.location.hostname === 'localhost' ? '' : '.' + window.location.hostname.split('.').slice(-2).join('.');
      document.cookie = `googtrans=/en/${code}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;${domain ? ' domain=' + domain + ';' : ''}`;
      document.cookie = `googtrans=/en/${code}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
      
      // 2. Try the hidden combo box if it exists
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event("change"));
        setCurrentLang(code);
      } else {
        // If not found, a simple reload will pick up the cookie
        window.location.reload();
      }
    } catch (err) {
      console.error("Language switch failed:", err);
      // Last resort fallback
      window.location.reload();
    } finally {
      setIsVisible(false);
    }
  };

  return (
    <div className="relative translate-dropdown-container flex items-center notranslate">
      <Button
        variant="outline"
        size="sm"
        className={`gap-2 px-3 py-2 text-slate-700 transition-all duration-300 border border-slate-200 rounded-xl font-semibold shadow-sm ${isVisible
          ? "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/20"
          : "bg-white hover:bg-slate-50"
          }`}
        onClick={() => setIsVisible(!isVisible)}
      >
        <div className="flex items-center gap-2">
          <Globe className={`w-4 h-4 ${isVisible ? 'text-emerald-600 scale-110' : 'text-slate-400'} transition-all`} />
          <span className="font-bold uppercase tracking-tight text-[11px] sm:text-xs">
            {languages.find((l) => l.code === currentLang)?.label || "EN"}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isVisible ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
        </div>
      </Button>

      {/* Custom Dropdown */}
      <div
        className={`absolute ${landingPage ? 'top-[calc(100%+0.5rem)]' : 'bottom-[calc(100%+0.5rem)]'} left-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 z-[200] ${landingPage ? 'origin-top-left' : 'origin-bottom-left'} ${isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 ${landingPage ? 'translate-y-2' : 'translate-y-2'} scale-95 pointer-events-none"
          }`}
      >
        <div className="p-3 bg-slate-50 border-b border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] px-1">
            Select Language
          </p>
        </div>
        <div className="py-1 max-h-[350px] overflow-y-auto custom-scrollbar">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 hover:bg-emerald-50/50 group ${currentLang === lang.code ? "text-emerald-700 font-bold bg-emerald-50" : "text-slate-600"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg transition-transform group-hover:scale-125">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
              {currentLang === lang.code ? (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]" />
              ) : (
                <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-slate-400 transition-colors uppercase">
                  {lang.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        /* Hide all of Google's native components and overlays */
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget { display: none !important; }
        .goog-te-menu-frame { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
        #goog-gt-tt { display: none !important; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;

