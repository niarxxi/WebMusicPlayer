"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import Catalog from "@/components/catalog"
import MobileCatalog from "@/components/mobile-catalog"
import { useState, useEffect } from "react"

export default function CatalogWrapper() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  // Рендерим только после монтирования компонента, чтобы избежать несоответствия гидратации
  useEffect(() => {
    setMounted(true)
  }, [])

  // Ничего не показываем во время SSR или до монтирования на клиенте
  if (!mounted) {
    return <div className="h-96 flex items-center justify-center text-white/50">Loading catalog...</div>
  }

  return isMobile ? <MobileCatalog /> : <Catalog />
}

