"use client"

import { useState } from "react"
import { useMusicStore } from "@/lib/music-store"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Music } from "lucide-react"
import SongCard from "./song-card"
import { Badge } from "@/components/ui/badge"

export default function Catalog() {
  const { songs, selectedCategory, setCategory } = useMusicStore()
  const [searchQuery, setSearchQuery] = useState("")

  // Получаем уникальные жанры для табов
  const genres = Array.from(new Set(songs.map((song) => song.genre)))

  // Фильтруем песни по поисковому запросу и выбранной категории
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedCategory === "all") return matchesSearch
    return matchesSearch && song.genre === selectedCategory
  })

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Каталог музыки</h2>
        {selectedCategory !== "all" && (
          <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
            <Music className="w-3 h-3 mr-1" />
            {selectedCategory}
          </Badge>
        )}
      </div>

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

      <Tabs defaultValue={selectedCategory} value={selectedCategory} onValueChange={setCategory} className="mb-6">
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

