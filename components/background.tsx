"use client"

import type React from "react"

import { useMusicStore } from "@/lib/music-store"
import { useEffect, useState, useRef } from "react"

export default function Background() {
  const { currentSong, isPlaying } = useMusicStore()
  const [opacity, setOpacity] = useState(0)
  const [useGradient, setUseGradient] = useState(false)
  const [gradientStyle, setGradientStyle] = useState<React.CSSProperties>({})
  const imgRef = useRef<HTMLImageElement>(null)
  const attemptedRef = useRef<Set<string>>(new Set())

  // Генерация градиента на основе ID песни
  const generateGradient = (songId: string) => {
    const id = Number.parseInt(songId, 10)
    const hue1 = (id * 137) % 360
    const hue2 = (hue1 + 40) % 360
    const hue3 = (hue1 + 80) % 360

    return {
      background: `linear-gradient(135deg, 
        hsl(${hue1}, 70%, 30%) 0%, 
        hsl(${hue2}, 80%, 25%) 50%, 
        hsl(${hue3}, 70%, 20%) 100%)`,
    }
  }

  useEffect(() => {
    // Сбрасываем состояния при изменении песни
    if (currentSong) {
      setOpacity(0)

      // Небольшая задержка перед началом новой анимации
      const timer = setTimeout(() => {
        // Проверяем, пытались ли мы уже загрузить это изображение и не удалось
        const shouldUseGradient = attemptedRef.current.has(currentSong.image)
        setUseGradient(shouldUseGradient)

        if (shouldUseGradient) {
          // Если уже знаем, что изображение не загрузится, сразу используем градиент
          setGradientStyle(generateGradient(currentSong.id))
          setOpacity(isPlaying ? 1 : 0)
        } else if (isPlaying) {
          // Пробуем загрузить изображение
          const img = new Image()
          img.crossOrigin = "anonymous"

          img.onload = () => {
            setUseGradient(false)
            setOpacity(1)
          }

          img.onerror = () => {
            // Запоминаем, что это изображение не загружается
            attemptedRef.current.add(currentSong.image)
            setUseGradient(true)
            setGradientStyle(generateGradient(currentSong.id))
            setOpacity(1)
          }

          img.src = currentSong.image
        }
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setOpacity(0)
    }
  }, [currentSong, isPlaying])

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Базовый градиент (всегда виден) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"
        style={{ opacity: currentSong && isPlaying ? 1 - opacity : 1 }}
      />

      {currentSong && (
        <>
          {/* Динамический фон на основе текущей песни */}
          {useGradient ? (
            // Градиентный фон (фолбэк)
            <div className="absolute inset-0 transition-opacity duration-1000" style={{ ...gradientStyle, opacity }} />
          ) : (
            // Фон на основе изображения
            <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity }}>
              <img
                ref={imgRef}
                src={currentSong.image || "/placeholder.svg"}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110"
              />
              <div className="absolute inset-0 bg-black/30" /> {/* Затемнение */}
            </div>
          )}
        </>
      )}
    </div>
  )
}

