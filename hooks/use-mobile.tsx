"use client"

import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // Устанавливаем начальное значение
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Добавляем слушатель события изменения размера окна
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    window.addEventListener("resize", handleResize)

    // Очистка
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

