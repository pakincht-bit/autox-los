"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
} | null>(null);

export function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange: controlledOnValueChange,
    children,
    className
}: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}) {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const onValueChange = React.useCallback((val: string) => {
        if (controlledOnValueChange) {
            controlledOnValueChange(val);
        } else {
            setInternalValue(val);
        }
    }, [controlledOnValueChange]);

    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 text-muted", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.value === value;

    return (
        <button
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-white text-foreground shadow-sm" : "hover:text-foreground",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                context.onValueChange(value);
            }}
            data-state={isActive ? "active" : "inactive"}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.value !== value) return null;

    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
}
