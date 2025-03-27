"use client"

import type React from "react"
import { createContext, useContext, useRef, useEffect, useState } from "react"
import { useMusicStore } from "@/lib/music-store"

interface AudioContextType {
  // Изменяем тип, чтобы он соответствовал фактическому типу useRef
  audioRef: React.RefObject<HTMLAudioElement | null>
  currentTime: number
  duration: number
  buffered: TimeRanges | null
  isBuffering: boolean
  setCurrentTime: (time: number) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState<TimeRanges | null>(null)
  const [isBuffering, setIsBuffering] = useState(false)

  // Получаем данные из хранилища
  const currentSong = useMusicStore((state) => state.currentSong)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const nextSong = useMusicStore((state) => state.nextSong)

  // Обработка воспроизведения/паузы
  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    let isCancelled = false

    const handlePlayback = async () => {
      try {
        if (isPlaying && audioRef.current && audioRef.current.paused) {
          setIsBuffering(true)
          try {
            await audioRef.current.play()
          } catch (error: unknown) {
            // Если ошибка не связана с действиями пользователя или прерыванием, логируем её
            const err = error as Error
            if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
              console.error("Playback error:", err)
              useMusicStore.setState({ isPlaying: false })
            }
          }
        } else if (!isPlaying && audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause()
          // Не сбрасываем currentTime при паузе
        }
      } finally {
        if (!isCancelled) {
          setIsBuffering(false)
        }
      }
    }

    handlePlayback()

    return () => {
      isCancelled = true
    }
  }, [isPlaying, currentSong])

  
  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    // Создаем флаг для отслеживания, актуален ли еще этот экземпляр эффекта
    let isCurrent = true

    const loadAndPlayAudio = async () => {
      try {
        // Проверяем, переключаем ли мы ту же песню или загружаем новую
        const isSameSong = audioRef.current && audioRef.current.src.includes(currentSong.path)

        // Сбрасываем текущее время только при переходе к другой песне
        if (!isSameSong) {
          setCurrentTime(0)
        }

        // Приостанавливаем текущее воспроизведение перед изменением источника
        if (audioRef.current && audioRef.current.paused === false) {
          audioRef.current.pause()
        }

        // Устанавливаем новый источник только если это другая песня
        if (audioRef.current && !isSameSong) {
          audioRef.current.src = currentSong.path
        }

        // Ждем, пока аудио будет готово, прежде чем пытаться воспроизвести
        if (isPlaying && audioRef.current) {
          setIsBuffering(true)

          // Нужно ждать canplaythrough только если мы изменили источник
          if (!isSameSong) {
            // Используем событие canplaythrough, чтобы убедиться, что аудио готово к воспроизведению
            await new Promise<void>((resolve) => {
              const handleCanPlay = () => {
                if (audioRef.current) {
                  audioRef.current.removeEventListener("canplaythrough", handleCanPlay)
                }
                resolve()
              }

              if (audioRef.current) {
                audioRef.current.addEventListener("canplaythrough", handleCanPlay, { once: true })

                // Также разрешаем промис при ошибке, чтобы избежать зависания
                const handleError = () => {
                  if (audioRef.current) {
                    audioRef.current.removeEventListener("error", handleError)
                  }
                  resolve()
                }

                audioRef.current.addEventListener("error", handleError, { once: true })

                // Загружаем аудио
                audioRef.current.load()
              } else {
                resolve() // Разрешаем промис немедленно, если audioRef равен null
              }
            })
          }

          // Продолжаем только если этот эффект все еще актуален
          if (isCurrent && audioRef.current) {
            try {
              await audioRef.current.play()
            } catch (error: unknown) {
              const err = error as Error
              console.error("Error playing song:", err)
              useMusicStore.setState({ isPlaying: false })
            }
          }
        }
      } finally {
        if (isCurrent) {
          setIsBuffering(false)
        }
      }
    }

    loadAndPlayAudio()

    return () => {
      isCurrent = false
    }
  }, [currentSong, isPlaying])

  // Обработка обновлений времени
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setBuffered(audioRef.current.buffered)
    }
  }

  // Обработка загрузки метаданных
  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentSong?.duration || 0)
    }
  }

  // Обработка перемотки
  const handleSetCurrentTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        currentTime,
        duration,
        buffered,
        isBuffering,
        setCurrentTime: handleSetCurrentTime,
      }}
    >
      {children}

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onEnded={nextSong}
        onError={(e) => {
          console.error("Audio loading error:", (e.target as HTMLAudioElement).error)
          useMusicStore.setState({ isPlaying: false })
        }}
        style={{ display: "none" }}
      />
    </AudioContext.Provider>
  )
}

