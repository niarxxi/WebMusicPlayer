"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface TouchHandlerProps {
  onSwipeDown: () => void
  children: React.ReactNode
  threshold?: number
}

export default function TouchHandler({ onSwipeDown, children, threshold = 50 }: TouchHandlerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === null) return

      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      // If scrolled to top and trying to pull down
      if (container.scrollTop <= 0 && diff > 0) {
        e.preventDefault() // Prevent default only when at the top and pulling down
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (startY.current === null) return

      const currentY = e.changedTouches[0].clientY
      const diff = currentY - startY.current

      // If scrolled to top and swiped down past threshold
      if (container.scrollTop <= 0 && diff > threshold) {
        onSwipeDown()
      }

      startY.current = null
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [onSwipeDown, threshold])

  return (
    <div ref={containerRef} className="player-scrollable-content">
      {children}
    </div>
  )
}

