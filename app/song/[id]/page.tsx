"use client"

import { useParams, notFound } from "next/navigation"
import { useMusicStore } from "@/lib/music-store"
import { Button } from "@/components/ui/button"
import { Play, ArrowLeft, Clock, Music, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function SongPage() {
  const params = useParams()
  const { songs, playSong, selectedCategory, setCategory } = useMusicStore()

  const song = songs.find((s) => s.id === params.id)

  if (!song) {
    notFound()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handleCategoryClick = () => {
    setCategory(song.genre)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Назад к каталогу
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image src={song.image || "/placeholder.svg"} alt={song.name} fill className="object-cover" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{song.name}</h1>
                {selectedCategory !== "all" && (
                  <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
                    <Music className="w-3 h-3 mr-1" />
                    {selectedCategory}
                  </Badge>
                )}
              </div>
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
                  <Tag size={20} className="text-white/60" />
                  <button
                    onClick={handleCategoryClick}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-purple-600/40 transition-colors"
                  >
                    {song.genre}
                  </button>
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

