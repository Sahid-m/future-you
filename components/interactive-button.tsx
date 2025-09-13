"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface InteractiveButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export function InteractiveButton({
  children,
  className,
  variant = "default",
  size = "default",
  disabled,
  onClick,
  type = "button",
}: InteractiveButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-transparent before:via-white/20 before:to-transparent",
        "before:translate-x-[-100%] before:transition-transform before:duration-500",
        "hover:before:translate-x-[100%]",
        "shadow-lg hover:shadow-xl hover:shadow-primary/25",
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Button>
  )
}
