import { RetailerSidebar } from "./RetailerSidebar";
import { Outlet } from "react-router-dom";

export function RetailerLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <RetailerSidebar />
            <main className="flex-1 w-full min-w-0">
                <div className="px-4 py-8 sm:px-8 lg:px-12 pt-24 lg:pt-12 max-w-[1600px] mx-auto">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
}
