"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useMusicStore } from "@/lib/music-store"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Music, ListMusic } from "lucide-react"
import SongCard from "./song-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AddToPlaylistDialog from "./add-to-playlist-dialog"
import PlaylistDialog from "./playlist-dialog"
import ViewToggle from "./view-toggle"
import BreadcrumbNav from "./breadcrumb-nav"
import type { Song } from "@/lib/types"

export default function Catalog() {
  // Get data from store
  const songs = useMusicStore((state) => state.songs)
  const selectedCategory = useMusicStore((state) => state.selectedCategory)
  const setCategory = useMusicStore((state) => state.setCategory)
  const activePlaylist = useMusicStore((state) => state.activePlaylist)
  const getPlaylistById = useMusicStore((state) => state.getPlaylistById)
  const getFilteredSongs = useMusicStore((state) => state.getFilteredSongs)

  // Local state
  const [searchQuery, setSearchQuery] = useState("")
  const [addToPlaylistDialogOpen, setAddToPlaylistDialogOpen] = useState(false)
  const [createPlaylistDialogOpen, setCreatePlaylistDialogOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [displaySongs, setDisplaySongs] = useState<Song[]>([])
  const isMounted = useRef(true)

  // Handle component unmounting to prevent async issues
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  // Get unique genres for tabs
  const genres = useMemo(() => Array.from(new Set(songs.map((song) => song.genre))), [songs])

  // Get active playlist data
  const activePlaylistData = useMemo(
    () => (activePlaylist ? getPlaylistById(activePlaylist) : null),
    [activePlaylist, getPlaylistById],
  )

  // Update displayed songs when filters change
  useEffect(() => {
    const updateSongs = async () => {
      try {
        const filteredSongs = getFilteredSongs()
        const searchFiltered = filteredSongs.filter(
          (song) =>
            song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
        )

        // Only update state if component is still mounted
        if (isMounted.current) {
          setDisplaySongs(searchFiltered)
        }
      } catch (error) {
        console.error("Error filtering songs:", error)
      }
    }

    updateSongs()
  }, [searchQuery, getFilteredSongs, selectedCategory, activePlaylist])

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song)
    setAddToPlaylistDialogOpen(true)
  }

  const handleCreatePlaylist = () => {
    setCreatePlaylistDialogOpen(true)
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl text-white">
      {/* Breadcrumb navigation */}
      <BreadcrumbNav />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {activePlaylistData ? `Плейлист: ${activePlaylistData.name}` : "Каталог музыки"}
        </h2>

        {activePlaylistData ? (
          <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
            <ListMusic className="w-3 h-3 mr-1" aria-hidden="true" />
            Плейлист
          </Badge>
        ) : (
          selectedCategory !== "all" && (
            <Badge variant="outline" className="bg-purple-600/20 text-white border-purple-400">
              <Music className="w-3 h-3 mr-1" aria-hidden="true" />
              {selectedCategory}
            </Badge>
          )
        )}
      </div>

      {/* View toggle button */}
      <ViewToggle />

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
        {displaySongs.length > 0 ? (
          displaySongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onAddToPlaylist={handleAddToPlaylist}
              showPlaylistOptions={!!activePlaylistData}
              playlistId={activePlaylistData?.id}
            />
          ))
        ) : (
          <p className="text-white/70 text-center py-8" role="status">
            {activePlaylistData
              ? "В этом плейлисте пока нет треков. Добавьте треки из каталога."
              : selectedCategory !== "all"
                ? "Песни выбранного жанра не найдены. Попробуйте выбрать другой жанр."
                : "Песни не найдены. Попробуйте изменить параметры поиска."}
          </p>
        )}
      </div>

      {selectedSong && (
        <AddToPlaylistDialog
          open={addToPlaylistDialogOpen}
          onOpenChange={setAddToPlaylistDialogOpen}
          song={selectedSong}
          onCreatePlaylist={handleCreatePlaylist}
        />
      )}

      <PlaylistDialog open={createPlaylistDialogOpen} onOpenChange={setCreatePlaylistDialogOpen} />
    </div>
  )
}

