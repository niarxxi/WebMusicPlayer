'use client'

import { useEffect } from 'react'

/**
 * Hook to prevent body scrolling when a modal/overlay is open
 * @param isLocked Whether scrolling should be locked
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    // Don't do anything during SSR
    if (typeof document === 'undefined') return
    
    const originalStyle = window.getComputedStyle(document.body).overflow
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight
    
    // Function to get the width of the scrollbar to prevent layout shift
    const getScrollbarWidth = () => {
      const outer = document.createElement('div')
      outer.style.visibility = 'hidden'
      outer.style.overflow = 'scroll'
      document.body.appendChild(outer)
      
      const inner = document.createElement('div')
      outer.appendChild(inner)
      
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
      outer.parentNode?.removeChild(outer)
      
      return scrollbarWidth
    }
    
    if (isLocked) {
      // Save current scroll position
      const scrollY = window.scrollY
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = getScrollbarWidth()
      
      // Apply styles to lock scrolling
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      
      // Add padding to prevent layout shift when scrollbar disappears
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      // Get the scroll position from the body's top property
      const scrollY = document.body.style.top
      
      // Restore original styles
      document.body.style.overflow = originalStyle
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.paddingRight = originalPaddingRight
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }
    
    // Cleanup function to ensure we restore original state
    return () => {
      document.body.style.overflow = originalStyle
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.paddingRight = originalPaddingRight
      
      // Restore scroll position if component unmounts while locked
      const scrollY = document.body.style.top
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }
  }, [isLocked])
}