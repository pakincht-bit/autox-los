"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-background overflow-hidden font-sans">
                <div className="print:hidden">
                    <Sidebar />
                </div>
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#000A44]">
                    {/* Main Content Area - Inset Workspace */}
                    <div className="flex-1 relative p-2 overflow-hidden">
                        <div className="bg-white rounded-md h-full shadow-sm overflow-y-auto no-scrollbar border border-white/5">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
