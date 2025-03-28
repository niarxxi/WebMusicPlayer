"use client"

import { useEffect } from "react"

/**
 * Hook to fix iOS Safari-specific scrolling issues
 * @param isActive Whether the fix should be active
 */
export function useIosSafariFix(isActive: boolean) {
  useEffect(() => {
    // Only run on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    if (!isIOS) return

    if (isActive) {
      // Save the current scroll position
      const scrollY = window.scrollY

      // Prevent touchmove events on body
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault()
      }

      // Add event listener with passive: false to allow preventDefault
      document.body.addEventListener("touchmove", preventTouchMove, { passive: false })

      // Fix for position: fixed elements and viewport height issues
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)

      return () => {
        // Remove event listener
        document.body.removeEventListener("touchmove", preventTouchMove)

        // Restore scroll position
        window.scrollTo(0, scrollY)
      }
    }
  }, [isActive])
}

