import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Download, FileText, Star, Sparkles, ChevronRight, X,
  ShieldCheck, Package, Calendar, Award, Activity, Printer,
  TrendingUp, Leaf
} from "lucide-react";

// ── Realistic Dummy Data ──────────────────────────────────────────────────────
const FARMER_NAME = "Mohan Prasath";
const FARM_LOCATION = "Kinathukadavu, Coimbatore - 642109";

const REPORTS = [
  {
    id: "RPT-2026-001",
    crop: "Premium Basmati Rice",
    variety: "1121 Basmati",
    category: "Grains",
    grade: "A+",
    score: 94,
    type: "ai_analysis",
    date: "28 Mar 2026",
    harvestDate: "24 Mar 2026",
    quantity: "1,500 KG",
    status: "Passed",
    image: "https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400",
    details: {
      moisture: "12.4%",
      purity: "99.1%",
      grain_length: "7.5 mm",
      aroma: "Exceptional",
      appearance: "Outstanding",
      defects: "0.5%",
      protein: "8.2%",
      milling_recovery: "68%",
    },
    marketValue: "Export Premium — ₹85/KG (+20% above market)",
    shelfLife: "24 months",
    storage: "Climate-controlled, below 25°C, RH < 65%",
    recommendations: [
      "Export-grade quality — suitable for international markets.",
      "Maintain airtight cold storage to preserve aroma.",
      "Optimal harvesting window was correctly observed.",
    ],
    ai_summary:
      "Exceptional quality batch with superior grain uniformity and strong Basmati aroma. Pesticide residue levels are well below FSSAI limits. Recommended for premium export contracts.",
    inspectorId: "AGR-QC-441",
  },
  {
    id: "RPT-2026-002",
    crop: "Organic Wheat",
    variety: "Sharbati HD-2967",
    category: "Grains",
    grade: "A",
    score: 89,
    type: "ai_analysis",
    date: "20 Mar 2026",
    harvestDate: "17 Mar 2026",
    quantity: "2,000 KG",
    status: "Passed",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    details: {
      moisture: "13.2%",
      protein: "12.8%",
      gluten: "30.1%",
      hardness: "87 HU",
      appearance: "Good",
      defects: "1.4%",
      falling_number: "320 sec",
      test_weight: "79 kg/hl",
    },
    marketValue: "Standard Premium — ₹42/KG (+8% above market)",
    shelfLife: "18 months",
    storage: "Airtight bags, cool & dry, below 20°C",
    recommendations: [
      "Ideal for atta flour milling — high protein content.",
      "Consider reducing moisture by 0.5% before long-term storage.",
      "Monitor for weevil infestation every 2 weeks.",
    ],
    ai_summary:
      "High protein organic wheat suitable for premium atta production. Gluten quality is excellent. Minor moisture optimization recommended before warehousing.",
    inspectorId: "AGR-QC-317",
  },
  {
    id: "RPT-2026-003",
    crop: "Fresh Brinjal",
    variety: "Pusa Purple Long",
    category: "Vegetables",
    grade: "A",
    score: 87,
    type: "manual_check",
    date: "15 Mar 2026",
    harvestDate: "14 Mar 2026",
    quantity: "400 KG",
    status: "Passed",
    image: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=400",
    details: {
      firmness: "8.4 N",
      color_uniformity: "95%",
      surface_defects: "2.1%",
      size_consistency: "Good",
      pesticide_residue: "Not Detected",
      brix_value: "4.2",
      weight_per_fruit: "180–220 g",
      shelf_readiness: "Excellent",
    },
    marketValue: "Local Fresh Market — ₹25/KG (Market Rate)",
    shelfLife: "5–7 days (ambient), 14 days (cold)",
    storage: "4–10°C, 90–95% RH, away from ethylene sources",
    recommendations: [
      "Harvest to market within 24–48 hrs for best freshness.",
      "Cold chain packaging will extend shelf life significantly.",
      "No pesticide residue — safe for organic certification.",
    ],
    ai_summary:
      "Fresh, firm brinjal with excellent colour and size uniformity. Pesticide-free batch ready for direct retail distribution. Cold-chain logistics strongly recommended.",
    inspectorId: "AGR-QC-522",
  },
  {
    id: "RPT-2026-004",
    crop: "Green Chilly",
    variety: "Jwala FC-1",
    category: "Spices",
    grade: "A+",
    score: 92,
    type: "ai_analysis",
    date: "10 Mar 2026",
    harvestDate: "9 Mar 2026",
    quantity: "150 KG",
    status: "Passed",
    image: "https://images.unsplash.com/photo-1588252399212-45a2e1adedeb?w=400",
    details: {
      capsaicin_level: "45,000 SHU",
      moisture: "85%",
      color: "Bright Green",
      surface_defects: "0.8%",
      pesticide_residue: "< 0.01 ppm (Safe)",
      uniformity: "98%",
      aroma: "Pungent & Fresh",
      firmness: "Good",
    },
    marketValue: "Spice Premium — ₹60/KG (+15% above market)",
    shelfLife: "8–10 days (ambient), 20 days (cold)",
    storage: "2–5°C, 90% RH, perforated packaging",
    recommendations: [
      "High capsaicin content qualifies for premium spice market.",
      "Immediate cold-chain dispatch recommended.",
      "Batch qualifies for residue-free certification.",
    ],
    ai_summary:
      "Premium spice-grade green chilly with high capsaicin uniformity. Near-zero defect rate and excellent colour. This batch meets export requirements for Gulf markets.",
    inspectorId: "AGR-QC-289",
  },
  {
    id: "RPT-2026-005",
    crop: "Potato (Kufri)",
    variety: "Kufri Jyoti",
    category: "Vegetables",
    grade: "B+",
    score: 81,
    type: "manual_check",
    date: "5 Mar 2026",
    harvestDate: "3 Mar 2026",
    quantity: "3,000 KG",
    status: "Conditional",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
    details: {
      dry_matter: "19.5%",
      specific_gravity: "1.078",
      greening: "3.2% (Minor)",
      sprout_percentage: "0%",
      defects: "4.5%",
      size_uniformity: "Moderate",
      moisture: "78%",
      starch_content: "14.2%",
    },
    marketValue: "Standard Market — ₹20/KG (Market Rate)",
    shelfLife: "3–4 months (cold storage), 2 weeks (ambient)",
    storage: "4°C, 85–90% RH, dark environment",
    recommendations: [
      "Grade into A & B categories before sale.",
      "Cold storage recommended to prevent further quality loss.",
      "Reduce irrigation 2 weeks before next harvest for better specific gravity.",
    ],
    ai_summary:
      "Good quality potato batch with minor greening (~3%) from light exposure during transport. Grading before retail or direct cold storage will preserve quality.",
    inspectorId: "AGR-QC-108",
  },
  {
    id: "RPT-2026-006",
    crop: "Farm Carrots",
    variety: "Nantes Half-Long",
    category: "Vegetables",
    grade: "A",
    score: 88,
    type: "ai_analysis",
    date: "25 Feb 2026",
    harvestDate: "23 Feb 2026",
    quantity: "600 KG",
    status: "Passed",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
    details: {
      color: "Deep Orange",
      sugar_content: "8.2 Brix",
      firmness: "9.1 N",
      surface_defects: "1.8%",
      length_uniformity: "92%",
      pesticide_residue: "Not Detected",
      moisture: "88%",
      carotene: "High",
    },
    marketValue: "Fresh Premium — ₹34/KG (+5% above market)",
    shelfLife: "21 days (cold), 5 days (ambient)",
    storage: "0–4°C, 95–98% RH, perforated bags",
    recommendations: [
      "Deep carotene content qualifies for health-food premium positioning.",
      "Batch is pesticide-free — eligible for organic labelling.",
      "Cold-chain supermarket distribution recommended.",
    ],
    ai_summary:
      "High-quality carrot batch with excellent colour uniformity and sugar content. Pesticide-free certification applicable. Ready for direct supermarket supply chains.",
    inspectorId: "AGR-QC-374",
  },
];

const SUMMARY = {
  avgGrade: "A",
  avgScore: 88.5,
  totalAnalyzed: 6,
  passedReports: 5,
  qualityTrend: "Improving",
  lastAnalysis: "28 Mar 2026",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function gradeColor(score) {
  if (score >= 90) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-500", badge: "bg-emerald-600" };
  if (score >= 80) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500", badge: "bg-amber-500" };
  return { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", bar: "bg-orange-500", badge: "bg-orange-500" };
}

function statusBadge(status) {
  if (status === "Passed") return "bg-emerald-100 text-emerald-700";
  if (status === "Conditional") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

// ── PDF Generator (opens a new window — avoids all React DOM conflicts) ───────
function generatePDF(reports, single = false) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) { alert("Please allow popups for PDF export."); return; }

  const pages = (Array.isArray(reports) ? reports : [reports])
    .map((r) => `
      <div style="page-break-after:always;padding:30px 40px;font-family:Inter,sans-serif;max-width:800px;margin:0 auto;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;">
          <div>
            <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0;">AgriTrack</h1>
            <p style="font-size:11px;color:#64748b;margin:4px 0 0;">Crop Quality Assurance Report</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:10px;color:#94a3b8;margin:0;">Report ID</p>
            <p style="font-size:13px;font-weight:bold;color:#0f172a;margin:2px 0 0;font-family:monospace;">${r.id}</p>
            <span style="display:inline-block;margin-top:4px;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:bold;background:${r.score >= 90 ? "#dcfce7" : "#fef9c3"};color:${r.score >= 90 ? "#166534" : "#854d0e"};">${r.status}</span>
          </div>
        </div>
        <!-- Farm Info -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px;">
          ${[["Farmer", FARMER_NAME], ["Farm Location", FARM_LOCATION], ["Inspector ID", r.inspectorId]].map(([l, v]) => `
            <div style="background:#f8fafc;border-radius:8px;padding:10px 14px;border:1px solid #e2e8f0;">
              <p style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">${l}</p>
              <p style="font-size:12px;font-weight:bold;color:#0f172a;margin:0;">${v}</p>
            </div>`).join("")}
        </div>
        <!-- Crop Overview -->
        <div style="background:${r.score >= 90 ? "#f0fdf4" : "#fffbeb"};border:1px solid ${r.score >= 90 ? "#bbf7d0" : "#fde68a"};border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h2 style="font-size:20px;font-weight:900;color:#0f172a;margin:0;">${r.crop}</h2>
            <p style="font-size:11px;color:#64748b;margin:4px 0 0;">${r.variety} &bull; ${r.category} &bull; Harvested: ${r.harvestDate}</p>
            <p style="font-size:11px;color:#64748b;margin:4px 0 0;">Quantity: ${r.quantity} &bull; Analysis Type: ${r.type === "ai_analysis" ? "AI Analysis" : "Manual Inspection"}</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:40px;font-weight:900;color:${r.score >= 90 ? "#16a34a" : "#d97706"};margin:0;line-height:1;">Grade ${r.grade}</p>
            <p style="font-size:13px;color:#64748b;margin:4px 0 0;">Score: ${r.score}/100</p>
          </div>
        </div>
        <!-- Score Bar -->
        <div style="margin-bottom:20px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:11px;color:#64748b;">Quality Score</span>
            <span style="font-size:13px;font-weight:bold;color:${r.score >= 90 ? "#16a34a" : "#d97706"};">${r.score}%</span>
          </div>
          <div style="height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden;">
            <div style="height:100%;width:${r.score}%;background:${r.score >= 90 ? "#16a34a" : "#d97706"};border-radius:99px;"></div>
          </div>
        </div>
        <!-- Metrics -->
        <h3 style="font-size:11px;font-weight:bold;color:#0f172a;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-left:3px solid #16a34a;padding-left:10px;">Quality Metrics</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
          ${Object.entries(r.details).map(([k, v]) => `
            <div style="display:flex;justify-content:space-between;background:#f8fafc;border-radius:6px;padding:8px 12px;border:1px solid #f1f5f9;">
              <span style="font-size:10px;color:#94a3b8;text-transform:capitalize;">${k.replace(/_/g, " ")}</span>
              <span style="font-size:11px;font-weight:bold;color:#0f172a;">${v}</span>
            </div>`).join("")}
        </div>
        <!-- AI Summary -->
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 16px;margin-bottom:16px;">
          <p style="font-size:9px;color:#166534;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;font-weight:bold;">AI Analysis Summary</p>
          <p style="font-size:12px;color:#166534;margin:0;line-height:1.6;">${r.ai_summary}</p>
        </div>
        <!-- Recommendations -->
        <h3 style="font-size:11px;font-weight:bold;color:#0f172a;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;border-left:3px solid #3b82f6;padding-left:10px;">Recommendations</h3>
        <ul style="margin:0 0 16px;padding-left:18px;">
          ${r.recommendations.map((rec) => `<li style="font-size:12px;color:#475569;margin-bottom:5px;line-height:1.5;">${rec}</li>`).join("")}
        </ul>
        <!-- Market / Storage -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px;">
          ${[
            ["Market Value", r.marketValue, "#dcfce7", "#166534"],
            ["Shelf Life", r.shelfLife, "#dbeafe", "#1d4ed8"],
            ["Storage Conditions", r.storage, "#fef9c3", "#854d0e"],
          ].map(([l, v, bg, col]) => `
            <div style="background:${bg};border-radius:8px;padding:10px 12px;">
              <p style="font-size:9px;color:${col};text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;font-weight:bold;">${l}</p>
              <p style="font-size:11px;color:${col};margin:0;font-weight:bold;line-height:1.4;">${v}</p>
            </div>`).join("")}
        </div>
        <!-- Footer -->
        <div style="border-top:1px solid #e2e8f0;padding-top:12px;display:flex;justify-content:space-between;">
          <p style="font-size:9px;color:#94a3b8;margin:0;">AgriTrack Certified Quality Report &bull; Analysis Date: ${r.date}</p>
          <p style="font-size:9px;color:#94a3b8;margin:0;">Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>
    `).join("");

  win.document.write(`<!DOCTYPE html><html><head>
    <title>AgriTrack Quality Report${single ? ` — ${reports.crop}` : "s"}</title>
    <meta charset="UTF-8"/>
    <style>*{box-sizing:border-box;}body{margin:0;background:#f8fafc;}@media print{@page{size:A4;margin:10mm;}}</style>
  </head><body>
    <div style="position:fixed;top:0;left:0;right:0;background:#0f172a;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;z-index:100;print:display:none;">
      <span style="color:white;font-weight:bold;font-size:14px;font-family:sans-serif;">AgriTrack Quality Report${single ? "" : "s"}</span>
      <button onclick="window.print()" style="background:#16a34a;color:white;border:none;padding:8px 18px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:13px;font-family:sans-serif;">⬇ Download PDF</button>
    </div>
    <div style="padding-top:52px;">${pages}</div>
  </body></html>`);
  win.document.close();
}

// ── Report Detail Modal (via Portal) ─────────────────────────────────────────
function ReportModal({ report, onClose }) {
  const c = gradeColor(report.score);
  return ReactDOM.createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl sm:mb-6 overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 flex items-start justify-between sticky top-0 z-10 ${c.bg} border-b ${c.border} rounded-t-3xl`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                {report.type === "ai_analysis" ? "AI Verified" : "Manual Inspection"} · {report.id}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{report.crop}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{report.variety} · {report.category} · {report.date}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => generatePDF(report, true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all"
            >
              <Printer className="h-3.5 w-3.5" /> PDF
            </button>
            <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Grade + Score */}
          <div className={`flex items-center gap-5 p-5 ${c.bg} rounded-2xl border ${c.border}`}>
            <div className="text-center shrink-0">
              <p className={`text-5xl font-black ${c.text}`}>{report.grade}</p>
              <p className="text-xs text-slate-500 mt-1">Grade</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Quality Score</span>
                <span className={`font-bold ${c.text}`}>{report.score}/100</span>
              </div>
              <div className="h-2.5 bg-white rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${report.score}%` }} />
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {report.quantity}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Harvest: {report.harvestDate}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${statusBadge(report.status)}`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>

          {/* Info Row */}
          <div className="grid grid-cols-3 gap-2">
            {[["Farmer", FARMER_NAME], ["Location", FARM_LOCATION], ["Inspector", report.inspectorId]].map(([l, v]) => (
              <div key={l} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">{l}</p>
                <p className="text-xs font-bold text-slate-800 leading-tight">{v}</p>
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">AI Analysis Summary</span>
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">{report.ai_summary}</p>
          </div>

          {/* Metrics */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" /> Quality Metrics
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(report.details).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                  <span className="text-xs text-slate-500 capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="text-sm font-bold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Recommendations
            </h4>
            <ul className="space-y-2">
              {report.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Market / Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Market Value</p>
              <p className="text-xs font-bold text-emerald-900 leading-relaxed">{report.marketValue}</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mb-1">Shelf Life</p>
              <p className="text-xs font-bold text-blue-900">{report.shelfLife}</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mb-1">Storage</p>
              <p className="text-xs font-bold text-amber-900 leading-relaxed">{report.storage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Reports() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quality Reports</h1>
          <p className="text-sm text-slate-500">AI-verified crop quality assessments · {FARM_LOCATION}</p>
        </div>
        <button
          onClick={() => generatePDF(REPORTS)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" /> Download All Reports PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Quality Score", value: `${SUMMARY.avgScore}/100`, icon: Star, color: "emerald" },
          { label: "Crops Analyzed", value: SUMMARY.totalAnalyzed, icon: FileText, color: "blue" },
          { label: "Reports Passed", value: SUMMARY.passedReports, icon: ShieldCheck, color: "emerald" },
          { label: "Quality Trend", value: SUMMARY.qualityTrend, icon: TrendingUp, color: "amber" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all`}>
            <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 flex items-center justify-center shrink-0`}>
              <s.icon className={`h-6 w-6 text-${s.color}-600`} />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {REPORTS.map((report) => {
          const c = gradeColor(report.score);
          return (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
              onClick={() => setSelected(report)}
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={report.image}
                  alt={report.crop}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider ${c.badge}`}>
                    Grade {report.grade}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                    {report.type === "ai_analysis" ? "🤖 AI" : "👁 Manual"}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base tracking-tight">{report.crop}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{report.variety} · {report.category}</p>
                </div>

                {/* Score Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Quality Score</span>
                    <span className={`text-sm font-bold ${c.text}`}>{report.score}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${report.score}%` }} />
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {report.date}</span>
                  <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> {report.quantity}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(report); }}
                    className="flex-1 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); generatePDF(report, true); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all"
                  >
                    <Printer className="h-3.5 w-3.5" /> PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Portal Modal — rendered at document.body to avoid DOM conflicts */}
      {selected && <ReportModal report={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
