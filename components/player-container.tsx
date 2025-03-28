"use client"

import { useState, useEffect } from "react"
import { useMusicStore } from "@/lib/music-store"
import MusicPlayer from "./music-player"
import MobilePlayer from "./mobile-player"
import MiniPlayer from "./mini-player"
import { useIsMobile } from "@/hooks/use-mobile"

export default function PlayerContainer() {
  const isMobile = useIsMobile()
  const currentSong = useMusicStore((state) => state.currentSong)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)

  // Закрываем полноэкранный плеер, когда нет воспроизводимой песни
  useEffect(() => {
    if (!currentSong) {
      setIsFullscreenOpen(false)
    }
  }, [currentSong])

  // Добавляем класс к body, когда мини-плеер видим
  useEffect(() => {
    if (isMobile && currentSong) {
      if (!isFullscreenOpen) {
        document.body.classList.add("has-mini-player")
      } else {
        document.body.classList.remove("has-mini-player")
        document.body.classList.add("has-fullscreen-player")
      }
    } else {
      document.body.classList.remove("has-mini-player", "has-fullscreen-player")
    }

    return () => {
      document.body.classList.remove("has-mini-player", "has-fullscreen-player")
    }
  }, [isMobile, currentSong, isFullscreenOpen])

  // Обработка открытия полноэкранного плеера
  const handleOpenFullscreen = () => {
    setIsFullscreenOpen(true)
  }

  // Обработка закрытия полноэкранного плеера
  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false)
  }

  return (
    <>
      {/* Десктопный плеер */}
      {!isMobile && <MusicPlayer />}

      {/* Мобильный мини-плеер */}
      {isMobile && currentSong && !isFullscreenOpen && <MiniPlayer onExpand={handleOpenFullscreen} />}

      {/* Мобильный полноэкранный плеер */}
      <MobilePlayer isOpen={isFullscreenOpen} onClose={handleCloseFullscreen} />
    </>
  )
}

