import React from "react";
import FarmerSidebar from "./FarmerSidebar";
import { Outlet } from "react-router-dom";

export function FarmerLayout({ children }) {
    return (
        <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            <FarmerSidebar />
            <main className="lg:pl-64 farmer-mobile-text">
                <div className="px-4 py-6 sm:px-6 lg:px-8 pt-16 lg:pt-6">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
}
