"use client";

// Sync: Move sidebar button
import React from 'react';
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/components/layout/SidebarContext";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
}

export interface DashboardPageHeaderProps {
    breadcrumbs: BreadcrumbItem[];
    rightContent?: React.ReactNode;
}

export function DashboardPageHeader({ breadcrumbs, rightContent }: DashboardPageHeaderProps) {
    return (
        <div className="w-full border-b border-gray-100 bg-white sticky top-0 z-40 h-12">
            <div className="flex items-center justify-between w-full h-full px-6 lg:px-8">
                {/* LEFT: Toggle + Breadcrumb */}
                <div className="flex-1 flex items-center justify-start text-sm text-gray-500 gap-1">
                    <div className="flex items-center gap-1">
                        {breadcrumbs.map((bc, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    {bc.href ? (
                                        <Link href={bc.href} className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1.5 font-medium">
                                            <span className="truncate">{bc.label}</span>
                                        </Link>
                                    ) : (
                                        <div className={`px-2 py-1 flex items-center gap-1.5 ${bc.isActive ? 'font-bold text-gray-900' : 'font-medium'}`}>
                                            <span className="truncate">{bc.label}</span>
                                        </div>
                                    )}
                                    {!isLast && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>

                {/* RIGHT: Depend Container */}
                <div className="flex items-center justify-end">
                    {rightContent}
                </div>
            </div>
        </div>
    );
}
