"use client"

import { useParams, notFound } from "next/navigation"
import { useMusicStore } from "@/lib/music-store"
import { Button } from "@/components/ui/button"
import { Play, ArrowLeft, Clock, Music } from "lucide-react"
import Link from "next/link"
import Background from "@/components/background"

export default function SongPage() {
  const params = useParams()
  const { songs, playSong } = useMusicStore()

  const song = songs.find((s) => s.id === params.id)

  if (!song) {
    notFound()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <main className="min-h-screen p-4 relative overflow-hidden">
      {/* Динамический фон */}
      <Background />

      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Назад к каталогу
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
              <img src={song.image || "/placeholder.svg"} alt={song.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{song.name}</h1>
              <h2 className="text-xl text-white/80 mb-6">{song.artist}</h2>

              <div className="grid gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <Music size={20} className="text-white/60" />
                  <span>Альбом: {song.album || "Неизвестно"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-white/60" />
                  <span>Длительность: {formatDuration(song.duration)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{song.genre}</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{song.year || "Неизвестно"}</span>
                </div>
              </div>

              {song.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-2">О треке</h3>
                  <p className="text-white/80">{song.description}</p>
                </div>
              )}

              <Button
                onClick={() => playSong(song)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Play size={20} className="mr-2" />
                Воспроизвести
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}