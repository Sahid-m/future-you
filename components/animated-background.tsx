"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-pulse" />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-bounce"
        style={{ animationDelay: "0s", animationDuration: "6s" }}
      />
      <div
        className="absolute top-3/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-bounce"
        style={{ animationDelay: "2s", animationDuration: "8s" }}
      />
      <div
        className="absolute top-1/2 left-3/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-bounce"
        style={{ animationDelay: "4s", animationDuration: "10s" }}
      />

      {/* Interactive mouse follower */}
      <div
        className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  )
}
