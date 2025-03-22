"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Music } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useMusicStore } from "@/lib/music-store"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    isShuffle,
    isLoop,
    selectedCategory,
    togglePlay,
    toggleShuffle,
    toggleLoop,
    nextSong,
    prevSong,
    getFilteredSongs,
  } = useMusicStore()

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const filteredSongs = getFilteredSongs()

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Ошибка воспроизведения:", err))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
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

  if (!currentSong) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl text-white h-full flex flex-col items-center justify-center">
        <Music size={64} className="text-white/30 mb-4" />
        <h3 className="text-xl font-medium mb-2">Нет выбранного трека</h3>
        <p className="text-white/70 text-center mb-4">Выберите песню из каталога для воспроизведения</p>
        {selectedCategory !== "all" && (
          <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
            <Music className="w-3 h-3 mr-1" />
            Фильтр: {selectedCategory}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white/70">Сейчас играет</h3>
        {selectedCategory !== "all" && (
          <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
            <Music className="w-3 h-3 mr-1" />
            {selectedCategory}
          </Badge>
        )}
      </div>

      <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-2xl">
        <Image
          src={currentSong.image || "/placeholder.svg"}
          alt={currentSong.name}
          fill
          className={`object-cover transition-all duration-500 ${isPlaying ? "scale-105" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold truncate">{currentSong.name}</h2>
      <h3 className="text-lg text-white/80 mb-6 truncate">{currentSong.artist}</h3>

      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-white/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="w-[80%]">
          <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={toggleShuffle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isShuffle ? "bg-purple-600 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
          title="Перемешать"
        >
          <Shuffle size={18} />
        </button>
        <button
          onClick={prevSong}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button
          onClick={nextSong}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <SkipForward size={24} />
        </button>
        <button
          onClick={toggleLoop}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isLoop ? "bg-purple-600 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
          title="Повторять"
        >
          <Repeat size={18} />
        </button>
      </div>

      <div className="text-xs text-white/50 text-center">
        {filteredSongs.length}{" "}
        {filteredSongs.length === 1
          ? "трек"
          : filteredSongs.length >= 2 && filteredSongs.length <= 4
            ? "трека"
            : "треков"}{" "}
        в текущем плейлисте
      </div>

      <audio
        ref={audioRef}
        src={currentSong.path}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
        onLoadedMetadata={handleTimeUpdate}
      />
    </div>
  )
}

