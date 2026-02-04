import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chaiyo-blue/50 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90 border border-transparent",
                accent: "bg-chaiyo-gold text-black hover:bg-chaiyo-gold/90 border border-transparent",
                destructive:
                    "bg-status-rejected text-white hover:bg-status-rejected/90 border border-transparent",
                outline:
                    "border border-border-strong bg-white hover:bg-gray-50 text-foreground",
                secondary:
                    "bg-gray-100 text-foreground hover:bg-gray-200 border border-transparent",
                ghost: "hover:bg-gray-100 text-foreground hover:text-chaiyo-blue",
                link: "text-chaiyo-blue underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-sm px-3 text-xs",
                lg: "h-12 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        // Simplified: No Slot support
        const Comp = "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
