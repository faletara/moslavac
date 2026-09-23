"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

type ToasterTheme = NonNullable<ToasterProps["theme"]>

const THEMES: readonly ToasterTheme[] = ["light", "dark", "system"]

/** `next-themes` vraća goli string; Sonner prima samo ova tri. */
const isToasterTheme = (value: string): value is ToasterTheme =>
  THEMES.some((candidate) => candidate === value)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={isToasterTheme(theme) ? theme : "system"}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
        // standardna svojstva, pa ga inline stil ovdje mora proširiti.
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
