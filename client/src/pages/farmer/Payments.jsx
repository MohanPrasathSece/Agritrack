import React, { useState, useEffect } from "react";
import { StatCard } from "../../components/farmer/StatCard";
import { StatusBadge } from "../../components/farmer/StatusBadge";
import { Wallet, Clock, CheckCircle, ExternalLink, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { farmerApi } from "../../utils/api";

// Comprehensive dummy payment data
const dummyPaymentData = {
    stats: {
        wallet_balance: 3200,
        pending_payments: 1500,
        total_earned: 8450
    },
    payments: [
        {
            id: "PAY-2024-001",
            crop: "Premium Basmati Rice",
            amount: 1250,
            status: "completed",
            hash: "0x7f9a8b3c4d5e6f1a2b3c4d5e6f1...",
            date: "2024-03-25"
        },
        {
            id: "PAY-2024-002", 
            crop: "Organic Wheat",
            amount: 850,
            status: "completed",
            hash: "0x8b2c3d4e5f6a1b2c3d4e5f6a1...",
            date: "2024-03-22"
        },
        {
            id: "PAY-2024-003",
            crop: "Fresh Brinjal",
            amount: 620,
            status: "pending",
            hash: "—",
            date: "2024-03-20"
        },
        {
            id: "PAY-2024-004",
            crop: "Farm Carrots",
            amount: 1480,
            status: "completed",
            hash: "0x9c3d4e5f6a1b2c3d4e5f6a1...",
            date: "2024-03-18"
        },
        {
            id: "PAY-2024-005",
            crop: "Green Chilly",
            amount: 730,
            status: "pending",
            hash: "—",
            date: "2024-03-15"
        },
        {
            id: "PAY-2024-006",
            crop: "Potato (Kufri)",
            amount: 1120,
            status: "completed",
            hash: "0xa4e5f6a1b2c3d4e5f6a1b...",
            date: "2024-03-12"
        },
        {
            id: "PAY-2024-007",
            crop: "Red Onions",
            amount: 1390,
            status: "completed",
            hash: "0xb5f6a1b2c3d4e5f6a1b2c...",
            date: "2024-03-10"
        },
        {
            id: "PAY-2024-008",
            crop: "Green Peppers",
            amount: 880,
            status: "pending",
            hash: "—",
            date: "2024-03-08"
        }
    ]
};

export default function Payments() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ payments: [], stats: {} });

    useEffect(() => {
        const fetchPayments = async () => {
            if (!user?.email) return;
            setLoading(true);
            setTimeout(() => {
                setData(dummyPaymentData);
                setLoading(false);
            }, 600);
        };

        fetchPayments();
    }, [user?.email]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">Loading payments...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl text-slate-900 tracking-tight">Payments</h1>
                    <p className="text-sm text-slate-500">View your earnings and payment history.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-white transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-600/15 active:scale-95">
                    Withdraw Balance <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard title="Balance" value={`₹${data.stats.wallet_balance?.toLocaleString() || 0}`} icon={Wallet} />
                <StatCard title="Pending" value={`₹${data.stats.pending_payments?.toLocaleString() || 0}`} icon={Clock} subtitle="Awaiting settlement" />
                <StatCard title="Total Earned" value={`₹${data.stats.total_earned?.toLocaleString() || 0}`} icon={CheckCircle} trend="All time" trendUp />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm mt-6 sm:mt-8">
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/30">
                    <h2 className="text-sm text-slate-900 font-medium">Transaction History</h2>
                </div>

                {data.payments.length > 0 ? (
                    <>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-white">
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">ID</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Crop</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Amount (₹)</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Status</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Verification</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-slate-400 font-medium uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.payments.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-4 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm font-mono text-slate-500">{tx.id}</td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm text-slate-800 font-medium capitalize">{tx.crop}</td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm text-slate-900 font-semibold">₹{(Number(tx.amount) || 0).toLocaleString()}</td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-5"><StatusBadge status={tx.status} /></td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-5">
                                                {tx.hash !== "—" ? (
                                                    <a
                                                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors text-xs sm:text-sm"
                                                    >
                                                        Verified <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-xs sm:text-sm">Processing</span>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm text-slate-400 capitalize">{tx.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {data.payments.map((tx) => (
                                <div key={tx.id} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-slate-400">{tx.id}</span>
                                        <StatusBadge status={tx.status} />
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100">
                                        <span className="text-xs text-slate-400 capitalize">{tx.crop}</span>
                                        <span className="text-sm text-slate-900 font-semibold">₹{(Number(tx.amount) || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 capitalize">{tx.date}</div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 sm:py-20 px-6 sm:px-8">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-slate-100">
                            <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-slate-200" />
                        </div>
                        <h3 className="text-lg sm:text-xl text-slate-900 mb-2 sm:mb-3 tracking-tight">No Payments Yet</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">Payment records will appear here when orders are completed.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
