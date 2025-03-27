"use client"

import type React from "react"
import { useMusicStore } from "@/lib/music-store"
import { useAudio } from "@/components/audio-provider"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

interface MiniPlayerProps {
  onExpand: () => void
}

export default function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const isMobile = useIsMobile()
  const { currentTime, duration, isBuffering } = useAudio()

  const currentSong = useMusicStore((state) => state.currentSong)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const togglePlay = useMusicStore((state) => state.togglePlay)
  const nextSong = useMusicStore((state) => state.nextSong)
  const prevSong = useMusicStore((state) => state.prevSong)

  if (!currentSong || !isMobile) return null

  // Безопасный расчет процента прогресса
  const progressPercentage = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  // Обработка воспроизведения/паузы с остановкой события
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    togglePlay()
  }

  // Обработка следующей/предыдущей песни с остановкой события
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    prevSong()
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    nextSong()
  }

  // Обработка нажатия/касания мини-плеера для разворачивания
  const handleExpandClick = () => {
    onExpand()
  }

  return (
    <div onClick={handleExpandClick}>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", damping: 20 }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(16px)",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Индикатор свайпа */}
        <div className="w-9 h-1 bg-white/30 rounded-full mx-auto my-1" />

        <div className="flex items-center p-2 px-4 gap-3">
          {/* Обложка альбома */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={currentSong.image || "/placeholder.svg"} alt={currentSong.name} fill className="object-cover" />
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Информация о песне */}
          <div className="flex-1 min-w-0 text-white">
            <h3 className="text-sm font-medium truncate">{currentSong.name}</h3>
            <p className="text-xs text-white/70 truncate">{currentSong.artist}</p>
          </div>

          {/* Элементы управления */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Предыдущая"
            >
              <SkipBack size={16} color="white" />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
            >
              {isPlaying ? <Pause size={18} color="white" /> : <Play size={18} color="white" />}
            </button>

            <button
              onClick={handleNext}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Следующая"
            >
              <SkipForward size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Полоса прогресса */}
        <div className="h-0.5 bg-purple-600/30 relative">
          <div
            className="absolute top-0 left-0 h-full bg-purple-600 transition-width duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </motion.div>
    </div>
  )
}

