"use client"

import { useState } from "react"
import { useMusicStore } from "@/lib/music-store"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import SongCard from "./song-card"

export default function Catalog() {
  const { songs } = useMusicStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && song.genre === activeTab
  })

  // Получаем уникальные жанры для табов
  const genres = Array.from(new Set(songs.map((song) => song.genre)))

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-6">Каталог музыки</h2>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
        <Input
          type="text"
          placeholder="Поиск по названию или исполнителю..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white/5 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
            Все
          </TabsTrigger>
          {genres.map((genre) => (
            <TabsTrigger key={genre} value={genre} className="data-[state=active]:bg-white/20">
              {genre}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => <SongCard key={song.id} song={song} />)
        ) : (
          <p className="text-white/70 col-span-2 text-center py-8">
            Песни не найдены. Попробуйте изменить параметры поиска.
          </p>
        )}
      </div>
    </div>
  )
}

