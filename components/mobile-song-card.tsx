"use client"

import { Play, Pause, MoreHorizontal } from "lucide-react"
import { useMusicStore } from "@/lib/music-store"
import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Song } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MobileSongCardProps {
  song: Song
  onAddToPlaylist?: (song: Song) => void
  showPlaylistOptions?: boolean
  playlistId?: string
}

export default function MobileSongCard({
  song,
  onAddToPlaylist,
  showPlaylistOptions = false,
  playlistId,
}: MobileSongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlay, removeSongFromPlaylist } = useMusicStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const isCurrentSong = currentSong?.id === song.id

  const handlePlayClick = () => {
    playSong(song)
  }

  const handleRemoveFromPlaylist = () => {
    if (playlistId && confirm("Remove this track from the playlist?")) {
      removeSongFromPlaylist(playlistId, song.id)
    }
  }

  // Переключаем развернутое состояние вручную вместо использования свайпа
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden">
        <div className="flex items-center p-3">
          {/* Обложка альбома с наложенной кнопкой воспроизведения */}
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={song.image || "/placeholder.svg"} alt={song.name} fill className="object-cover" sizes="56px" />
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity"
              aria-label={isCurrentSong && isPlaying ? "Pause" : "Play"}
            >
              {isCurrentSong && isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white" />
              )}
            </button>
          </div>

          {/* Информация о песне */}
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{song.name}</h3>
                <p className="text-sm text-white/70 truncate">{song.artist}</p>
              </div>

              {/* Меню опций */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-white/10" aria-label="Song options">
                    <MoreHorizontal size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
                  {onAddToPlaylist && (
                    <DropdownMenuItem onClick={() => onAddToPlaylist(song)} className="cursor-pointer">
                      Add to playlist
                    </DropdownMenuItem>
                  )}
                  {showPlaylistOptions && playlistId && (
                    <DropdownMenuItem onClick={handleRemoveFromPlaylist} className="cursor-pointer text-red-400">
                      Remove from playlist
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => window.open(`/song/${song.id}`, "_self")} className="cursor-pointer">
                    View details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Индикатор текущего воспроизведения */}
            {isCurrentSong && (
              <div className="mt-1 flex items-center">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scaleY: isPlaying ? [0.4, 1, 0.4] : 0.4,
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                      style={{
                        width: "2px",
                        height: "8px",
                        backgroundColor: "rgb(168, 85, 247)",
                        transformOrigin: "bottom",
                      }}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs text-purple-400">Now playing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Действия при свайпе */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              onClick={handlePlayClick}
              className="h-full px-4 bg-purple-600 flex items-center justify-center"
              aria-label={isCurrentSong && isPlaying ? "Pause" : "Play"}
            >
              {isCurrentSong && isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white" />
              )}
            </button>

            {onAddToPlaylist && (
              <button
                onClick={() => onAddToPlaylist(song)}
                className="h-full px-4 bg-blue-600 flex items-center justify-center"
                aria-label="Add to playlist"
              >
                <span className="text-white text-sm">Add</span>
              </button>
            )}

            {showPlaylistOptions && playlistId && (
              <button
                onClick={handleRemoveFromPlaylist}
                className="h-full px-4 bg-red-600 flex items-center justify-center"
                aria-label="Remove from playlist"
              >
                <span className="text-white text-sm">Remove</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

