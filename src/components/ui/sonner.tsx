"use client"

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CircleCheck className="h-4 w-4 text-green-600" />,
        info: <Info className="h-4 w-4 text-blue-600" />,
        warning: <TriangleAlert className="h-4 w-4 text-amber-600" />,
        error: <OctagonX className="h-4 w-4 text-red-600" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans group-[.toaster]:!bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:font-sans",
          description: "group-[.toast]:text-muted-foreground font-sans",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-sans",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-sans",
        },
        style: {
          fontFamily: 'var(--font-ibm-plex-thai), ui-sans-serif, system-ui, -apple-system, sans-serif'
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
