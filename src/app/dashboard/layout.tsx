"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { DashboardPageHeader } from "@/components/layout/DashboardPageHeader";

function DashboardLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { breadcrumbs, rightContent } = useSidebar();

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <div className="print:hidden">
                    <Sidebar />
                </div>
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#000F9F]">
                    {/* Main Content Area - Inset Workspace */}
                    <div className="flex-1 relative p-2 overflow-hidden">
                        <div className="bg-white rounded-md h-full shadow-sm flex flex-col overflow-hidden border border-white/5">
                            {/* Fixed Header - Only rendered if content exists */}
                            {(breadcrumbs.length > 0 || rightContent) && (
                                <DashboardPageHeader breadcrumbs={breadcrumbs} rightContent={rightContent} />
                            )}

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardLayoutContent>
                {children}
            </DashboardLayoutContent>
        </SidebarProvider>
    );
}
