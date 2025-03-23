"use client"
import { Play, Pause, MoreVertical, PlusCircle } from "lucide-react"
import { useMusicStore } from "@/lib/music-store"
import Image from "next/image"
import type { Song } from "@/lib/types"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRef, useEffect } from "react"

interface SongCardProps {
  song: Song
  onAddToPlaylist?: (song: Song) => void
  showPlaylistOptions?: boolean
  playlistId?: string
}

export default function SongCard({ song, onAddToPlaylist, showPlaylistOptions = false, playlistId }: SongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlay, removeSongFromPlaylist } = useMusicStore()
  const isMounted = useRef(true)

  // Handle component unmounting to prevent async issues
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const isCurrentSong = currentSong?.id === song.id

  const handlePlayClick = async () => {
    try {
      if (isCurrentSong) {
        togglePlay()
      } else {
        playSong(song)
      }
    } catch (error) {
      console.error("Error playing song:", error)
    }
  }

  const handleRemoveFromPlaylist = async () => {
    if (playlistId && confirm("Удалить трек из плейлиста?")) {
      try {
        await removeSongFromPlaylist(playlistId, song.id)
      } catch (error) {
        console.error("Error removing song from playlist:", error)
      }
    }
  }

  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden flex h-32">
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image src={song.image || "/placeholder.svg"} alt={song.name} fill className="object-cover" sizes="80px" priority/>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link href={`/song/${song.id}`} className="font-medium hover:underline truncate block">
              {song.name}
            </Link>
            <p className="text-sm text-white/70 truncate">{song.artist}</p>
          </div>

          {(onAddToPlaylist || showPlaylistOptions) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-white/10 ml-2" aria-label="Опции трека">
                  <MoreVertical size={16} aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
                {onAddToPlaylist && (
                  <DropdownMenuItem onClick={() => onAddToPlaylist(song)} className="cursor-pointer">
                    <PlusCircle size={14} className="mr-2" aria-hidden="true" />
                    Добавить в плейлист
                  </DropdownMenuItem>
                )}
                {showPlaylistOptions && playlistId && (
                  <DropdownMenuItem onClick={handleRemoveFromPlaylist} className="cursor-pointer text-red-400">
                    Удалить из плейлиста
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50 truncate max-w-[70%]">{song.genre}</span>
          <button
            onClick={handlePlayClick}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={isCurrentSong && isPlaying ? "Pause" : "Play"}
          >
            {isCurrentSong && isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

