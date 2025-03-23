"use client"

import { Play, Pause } from "lucide-react"
import { useMusicStore } from "@/lib/music-store"
import Image from "next/image"
import type { Song } from "@/lib/types"
import Link from "next/link"

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = useMusicStore()

  const isCurrentSong = currentSong?.id === song.id

  const handlePlayClick = () => {
    if (isCurrentSong) {
      togglePlay()
    } else {
      playSong(song)
    }
  }

  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden flex">
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image src={song.image || "/placeholder.svg"} alt={song.name} fill className="object-cover" priority/>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <Link href={`/song/${song.id}`} className="font-medium hover:underline truncate block">
            {song.name}
          </Link>
          <p className="text-sm text-white/70 truncate">{song.artist}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">{song.genre}</span>
          <button
            onClick={handlePlayClick}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            {isCurrentSong && isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

