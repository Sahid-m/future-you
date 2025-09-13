"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface FloatingCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FloatingCard({ children, className, delay = 0 }: FloatingCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-500 ease-out",
        "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20",
        "hover:-translate-y-2 cursor-pointer",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/5 before:to-primary/0",
        "before:translate-x-[-100%] before:transition-transform before:duration-700",
        "hover:before:translate-x-[100%]",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative z-10">{children}</div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
        <div
          className="absolute bottom-6 left-6 w-1 h-1 bg-accent/40 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </Card>
  )
}
