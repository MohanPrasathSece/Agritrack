import React from "react";

const statusStyles = {
    listed: "bg-blue-50 text-blue-600 border-blue-100",
    collected: "bg-orange-50 text-orange-600 border-orange-100",
    sold: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    released: "bg-green-50 text-green-600 border-green-100",
    "in-transit": "bg-blue-50 text-blue-600 border-blue-100",
    delivered: "bg-green-50 text-green-600 border-green-100",
    graded: "bg-emerald-50 text-emerald-600 border-emerald-100",
    confirmed: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase border ${statusStyles[status] || "bg-slate-50 text-slate-500 border-slate-100"
                }`}
        >
            {status}
        </span>
    );
}
