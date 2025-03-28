"use client"

import { useState, useEffect } from "react"
import { useMusicStore } from "@/lib/music-store"
import { useAudio } from "@/components/audio-provider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  ChevronDown,
  ListMusic,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { useIosSafariFix } from "@/hooks/use-ios-safari-fix"

interface MobilePlayerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobilePlayer({ isOpen, onClose }: MobilePlayerProps) {
  const isMobile = useIsMobile()
  const { currentTime, duration, setCurrentTime, isBuffering } = useAudio()

  // Получаем данные из хранилища с использованием отдельных селекторов для минимизации повторных рендеров
  const currentSong = useMusicStore((state) => state.currentSong)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const isShuffle = useMusicStore((state) => state.isShuffle)
  const isLoop = useMusicStore((state) => state.isLoop)
  const selectedCategory = useMusicStore((state) => state.selectedCategory)
  const activePlaylist = useMusicStore((state) => state.activePlaylist)
  const togglePlay = useMusicStore((state) => state.togglePlay)
  const toggleShuffle = useMusicStore((state) => state.toggleShuffle)
  const toggleLoop = useMusicStore((state) => state.toggleLoop)
  const nextSong = useMusicStore((state) => state.nextSong)
  const prevSong = useMusicStore((state) => state.prevSong)
  const getPlaylistById = useMusicStore((state) => state.getPlaylistById)

  // Локальное состояние
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  useScrollLock(isOpen && isMobile)
  useIosSafariFix(isOpen && isMobile)

  // Получаем данные активного плейлиста
  const activePlaylistData = activePlaylist ? getPlaylistById(activePlaylist) : null

  // Обработка изменений громкости
  useEffect(() => {
    const audio = document.querySelector("audio")
    if (audio) {
      // Сохраняем предыдущую громкость для восстановления позже
      const prevVolume = audio.volume

      // Обновляем только если громкость действительно изменилась
      if (isMuted && prevVolume > 0) {
        audio.volume = 0
      } else if (!isMuted && volume !== prevVolume) {
        audio.volume = volume
      }
    }
  }, [volume, isMuted])

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // Обработка жестов вручную вместо использования react-swipeable
  const handleSwipeDown = () => {
    onClose()
  }

  if (!currentSong) return null

  return (
    <AnimatePresence>
      {isOpen && isMobile && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "linear-gradient(to bottom, rgba(24, 24, 27, 0.95), rgba(0, 0, 0, 0.95))",
            backdropFilter: "blur(16px)",
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Индикатор свайпа для ручного жеста */}
          <div
            className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mt-2 mb-1 cursor-pointer"
            onClick={handleSwipeDown}
          />

          {/* Размытый фон с использованием обложки альбома */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <Image
                src={currentSong.image || "/placeholder.svg"}
                alt=""
                fill
                className="object-cover blur-2xl scale-110"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Контейнер содержимого */}
          <div className="relative z-10 flex flex-col h-full max-h-full overflow-hidden">
            {/* Заголовок с кнопкой закрытия */}
            <div className="flex items-center justify-between p-4 pb-0 flex-shrink-0 safe-area-top">
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                <ChevronDown size={24} />
                <span className="sr-only">Закрыть плеер</span>
              </Button>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-white/70">Сейчас играет</p>
              </div>
              <div className="w-10" /> {/* Пустой div для сбалансированного макета */}
            </div>

            {/* Основная область содержимого с вкладками */}
            <div className="flex-1 flex overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                {showDescription ? (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    transition={{ type: "spring", damping: 30 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: "1.5rem",
                    }}
                  >
                    <h3 className="text-xl font-bold mb-4">Описание</h3>
                    <div className="overflow-y-auto flex-1 text-white/80">
                      <p className="mb-4">{currentSong.description || "Описание для этой песни недоступно."}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="player"
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ type: "spring", damping: 30 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Обложка альбома */}
                    <div className="px-6 flex-1 flex justify-center items-center min-h-0 py-4">
                      <div className="relative w-full max-w-[300px] aspect-square rounded-xl overflow-hidden shadow-2xl">
                        <Image
                          src={currentSong.image || "/placeholder.svg"}
                          alt={currentSong.name}
                          fill
                          className="object-cover"
                          priority
                        />
                        {isBuffering && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Информация о песне */}
                    <div className="px-6 py-2 flex-shrink-0">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold truncate">{currentSong.name}</h2>
                        <p className="text-white/70 truncate text-lg">{currentSong.artist}</p>
                      </div>

                      {/* Значок категории или плейлиста */}
                      <div className="mt-2 flex justify-center">
                        {activePlaylistData ? (
                          <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
                            <ListMusic className="w-3 h-3 mr-1" />
                            {activePlaylistData.name}
                          </Badge>
                        ) : (
                          selectedCategory !== "all" && (
                            <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
                              {selectedCategory}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Индикаторы вкладок */}
            <div className="flex justify-center gap-2 py-2">
              <button
                className={`w-2 h-2 rounded-full ${!showDescription ? "bg-white" : "bg-white/30"}`}
                onClick={() => setShowDescription(false)}
                aria-label="Показать плеер"
              />
              <button
                className={`w-2 h-2 rounded-full ${showDescription ? "bg-white" : "bg-white/30"}`}
                onClick={() => setShowDescription(true)}
                aria-label="Показать описание"
              />
            </div>

            {/* Полоса прогресса */}
            <div className="px-6 py-4 flex-shrink-0">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="my-2"
              />
              <div className="flex justify-between text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Элементы управления */}
            <div className="px-6 py-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={`rounded-full w-12 h-12 ${
                    isShuffle ? "text-purple-500 bg-purple-500/20" : "text-white/70"
                  } hover:bg-white/10`}
                >
                  <Shuffle size={20} />
                  <span className="sr-only">Перемешать</span>
                </Button>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSong}
                    className="rounded-full w-14 h-14 text-white hover:bg-white/10"
                  >
                    <SkipBack size={24} />
                    <span className="sr-only">Предыдущая</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="rounded-full w-16 h-16 bg-white text-black hover:bg-white/90"
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    <span className="sr-only">{isPlaying ? "Пауза" : "Воспроизвести"}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSong}
                    className="rounded-full w-14 h-14 text-white hover:bg-white/10"
                  >
                    <SkipForward size={24} />
                    <span className="sr-only">Следующая</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLoop}
                  className={`rounded-full w-12 h-12 ${
                    isLoop ? "text-purple-500 bg-purple-500/20" : "text-white/70"
                  } hover:bg-white/10`}
                >
                  <Repeat size={20} />
                  <span className="sr-only">Повторять</span>
                </Button>
              </div>

              {/* Управление громкостью */}
              <div className="flex items-center gap-3 w-full px-2 pb-4 safe-area-bottom">
                <button onClick={toggleMute} className="text-white/70 hover:bg-white/10 p-2 rounded-full">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  <span className="sr-only">Громкость</span>
                </button>

                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

