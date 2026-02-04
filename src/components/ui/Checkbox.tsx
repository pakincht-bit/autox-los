"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLButtonElement,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
    }
>(({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            ref={ref}
            onClick={() => onCheckedChange?.(!checked)}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                checked
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                className
            )}
            {...props}
        >
            {checked && <Check className="h-3 w-3 flex items-center justify-center stroke-[3]" />}
        </button>
    )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
