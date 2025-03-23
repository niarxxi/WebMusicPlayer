"use client"

import { useMusicStore } from "@/lib/music-store"
import { Play, MoreVertical, ListMusic } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { Playlist } from "@/lib/types"

interface PlaylistCardProps {
  playlist: Playlist
  onRename: (playlist: Playlist) => void
}

export default function PlaylistCard({ playlist, onRename }: PlaylistCardProps) {
  const { getPlaylistSongs, setActivePlaylist, deletePlaylist } = useMusicStore()
  const router = useRouter()

  const songs = getPlaylistSongs(playlist.id)
  const songsCount = songs.length
  const updatedAt = formatDistanceToNow(new Date(playlist.updatedAt), {
    addSuffix: true,
    locale: ru,
  })

  const handlePlayClick = () => {
    if (songsCount > 0) {
      setActivePlaylist(playlist.id)
      router.push("/")
    }
  }

  const handleViewClick = () => {
    router.push(`/playlist/${playlist.id}`)
  }

  const handleDeleteClick = () => {
    if (confirm(`Вы уверены, что хотите удалить плейлист "${playlist.name}"?`)) {
      deletePlaylist(playlist.id)
    }
  }

  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium truncate">{playlist.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-white/10">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
              <DropdownMenuItem onClick={handleViewClick} className="cursor-pointer">
                Просмотреть
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(playlist)} className="cursor-pointer">
                Переименовать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick} className="cursor-pointer text-red-400">
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center text-sm text-white/60 mb-4">
          <ListMusic size={14} className="mr-1" />
          <span>
            {songsCount} {songsCount === 1 ? "трек" : songsCount >= 2 && songsCount <= 4 ? "трека" : "треков"}
          </span>
          <span className="mx-2">•</span>
          <span>Обновлен {updatedAt}</span>
        </div>

        <button
          onClick={handlePlayClick}
          disabled={songsCount === 0}
          className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 
            ${
              songsCount > 0
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-white/10 text-white/50 cursor-not-allowed"
            }`}
        >
          <Play size={16} />
          {songsCount > 0 ? "Воспроизвести" : "Нет треков"}
        </button>
      </div>
    </div>
  )
}

