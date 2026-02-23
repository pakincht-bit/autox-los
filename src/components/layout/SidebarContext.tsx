"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
}

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    toggleCollapsed: () => void;
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (bc: BreadcrumbItem[]) => void;
    rightContent: React.ReactNode;
    setRightContent: (content: React.ReactNode) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => { },
    toggleCollapsed: () => { },
    breadcrumbs: [],
    setBreadcrumbs: () => { },
    rightContent: null,
    setRightContent: () => { },
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [rightContent, setRightContent] = useState<React.ReactNode>(null);

    const toggleCollapsed = () => setIsCollapsed(prev => !prev);

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            setIsCollapsed,
            toggleCollapsed,
            breadcrumbs,
            setBreadcrumbs,
            rightContent,
            setRightContent
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
