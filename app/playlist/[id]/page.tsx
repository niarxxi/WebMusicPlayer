"use client"

import { useParams, notFound, useRouter } from "next/navigation"
import { useMusicStore } from "@/lib/music-store"
import { Button } from "@/components/ui/button"
import { Play, ListMusic, Plus, MoreVertical, Library } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import SongCard from "@/components/song-card"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import PlaylistDialog from "@/components/playlist-dialog"
import BreadcrumbNav from "@/components/breadcrumb-nav"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const { getPlaylistById, getPlaylistSongs, setActivePlaylist, deletePlaylist, selectedCategory, setCategory } =
    useMusicStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isMounted = useRef(true)

  // Handle component unmounting to prevent async issues
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const playlist = getPlaylistById(params.id as string)

  if (!playlist) {
    notFound()
  }

  const songs = getPlaylistSongs(playlist.id)
  const updatedAt = formatDistanceToNow(new Date(playlist.updatedAt), {
    addSuffix: true,
    locale: ru,
  })

  const handlePlayClick = () => {
    if (songs.length > 0) {
      setActivePlaylist(playlist.id)
      router.push("/")
    }
  }

  const handleDeleteClick = async () => {
    if (confirm(`Вы уверены, что хотите удалить плейлист "${playlist.name}"?`)) {
      try {
        await deletePlaylist(playlist.id)

        // Only navigate if component is still mounted
        if (isMounted.current) {
          router.push("/playlists")
        }
      } catch (error) {
        console.error("Error deleting playlist:", error)
      }
    }
  }

  const handleRenameClick = () => {
    setDialogOpen(true)
  }

  const handleGoToCatalog = async () => {
    setIsTransitioning(true)

    try {
      // Use setTimeout with a Promise to handle async transition
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Only update state if component is still mounted
      if (isMounted.current) {
        setActivePlaylist(playlist.id)
        router.push("/")
      }
    } catch (error) {
      console.error("Error during transition to catalog:", error)
      // Reset transitioning state if there's an error
      if (isMounted.current) {
        setIsTransitioning(false)
      }
    }
  }

  // Reset category filter when viewing a playlist
  useEffect(() => {
    if (selectedCategory !== "all") {
      setCategory("all")
    }
  }, [selectedCategory, setCategory])

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <BreadcrumbNav />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            borderRadius: "1.5rem",
            padding: "1.5rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            color: "white",
            marginBottom: "1.5rem",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{playlist.name}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-white/10" aria-label="Опции плейлиста">
                  <MoreVertical size={20} aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
                <DropdownMenuItem onClick={handleRenameClick} className="cursor-pointer">
                  Переименовать
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick} className="cursor-pointer text-red-400">
                  Удалить плейлист
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-sm text-white/60 mb-6">
            <p>
              {songs.length} {songs.length === 1 ? "трек" : songs.length >= 2 && songs.length <= 4 ? "трека" : "треков"}
              <span className="mx-2">•</span>
              Обновлен {updatedAt}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handlePlayClick}
              disabled={songs.length === 0}
              className={`
                ${
                  songs.length > 0
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }
              `}
              aria-label={songs.length > 0 ? "Воспроизвести все треки" : "Нет треков для воспроизведения"}
            >
              <Play size={18} className="mr-2" aria-hidden="true" />
              {songs.length > 0 ? "Воспроизвести все" : "Нет треков"}
            </Button>

            <Button
              onClick={handleGoToCatalog}
              variant="outline"
              className={`
                bg-white/10 border-white/20 text-white hover:bg-white/15
                ${isTransitioning ? "opacity-50 pointer-events-none" : ""}
              `}
              aria-label="Открыть плейлист в плеере"
            >
              <Library size={18} className="mr-2" aria-hidden="true" />
              Открыть в плеере
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
                aria-label="Добавить треки из каталога"
              >
                <Plus size={18} className="mr-2" aria-hidden="true" />
                Добавить треки
              </Button>
            </Link>
          </div>
        </motion.div>

        {songs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} showPlaylistOptions={true} playlistId={playlist.id} />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 text-center text-white">
            <ListMusic size={64} className="mx-auto mb-4 text-white/30" aria-hidden="true" />
            <h2 className="text-xl font-medium mb-2">Плейлист пуст</h2>
            <p className="text-white/70 mb-6">Добавьте треки из каталога, чтобы начать слушать</p>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" aria-label="Добавить треки из каталога">
                <Plus size={18} className="mr-2" aria-hidden="true" />
                Добавить треки
              </Button>
            </Link>
          </div>
        )}
      </div>

      <PlaylistDialog open={dialogOpen} onOpenChange={setDialogOpen} playlist={playlist} />
    </main>
  )
}



