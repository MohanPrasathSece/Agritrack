import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 transition-all shadow-sm hover:shadow-md group">
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{title}</p>
                        <p className="text-2xl text-slate-900 font-bold tracking-tight">{value}</p>
                    </div>

                    {(subtitle || trend) && (
                        <div className="flex items-center gap-2">
                            {trend && (
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    }`}>
                                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {trend}
                                </div>
                            )}
                            {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
                        </div>
                    )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300">
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
            </div>
        </div>
    );
}
