"use client"

import { useState, useEffect, useRef } from "react"
import { useMusicStore } from "@/lib/music-store"
import { Search, Music, ListMusic, X, ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import MobileSongCard from "./mobile-song-card"
import AddToPlaylistDialog from "./add-to-playlist-dialog"
import PlaylistDialog from "./playlist-dialog"
import type { Song } from "@/lib/types"

export default function MobileCatalog() {
  // Получаем данные из хранилища
  const songs = useMusicStore((state) => state.songs)
  const selectedCategory = useMusicStore((state) => state.selectedCategory)
  const setCategory = useMusicStore((state) => state.setCategory)
  const activePlaylist = useMusicStore((state) => state.activePlaylist)
  const getPlaylistById = useMusicStore((state) => state.getPlaylistById)
  const getFilteredSongs = useMusicStore((state) => state.getFilteredSongs)
  const resetFilters = useMusicStore((state) => state.resetFilters)

  // Локальное состояние
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [addToPlaylistDialogOpen, setAddToPlaylistDialogOpen] = useState(false)
  const [createPlaylistDialogOpen, setCreatePlaylistDialogOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [displaySongs, setDisplaySongs] = useState<Song[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isMounted = useRef(true)

  // Получаем уникальные жанры для вкладок
  const genres = Array.from(new Set(songs.map((song) => song.genre)))

  // Получаем данные активного плейлиста
  const activePlaylistData = activePlaylist ? getPlaylistById(activePlaylist) : null

  // Обновляем отображаемые песни при изменении фильтров
  useEffect(() => {
    const updateSongs = async () => {
      try {
        const filteredSongs = getFilteredSongs()
        const searchFiltered = filteredSongs.filter(
          (song) =>
            song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
        )

        // Обновляем состояние только если компонент все еще смонтирован
        if (isMounted.current) {
          setDisplaySongs(searchFiltered)
        }
      } catch (error) {
        console.error("Ошибка при фильтрации песен:", error)
      }
    }

    updateSongs()
  }, [searchQuery, getFilteredSongs, selectedCategory, activePlaylist])

  // Обработка размонтирования компонента для предотвращения асинхронных проблем
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  // Фокусировка на поле поиска при активации поиска
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song)
    setAddToPlaylistDialogOpen(true)
  }

  const handleCreatePlaylist = () => {
    setCreatePlaylistDialogOpen(true)
  }

  // Упрощенная навигация без react-swipeable
  const handleBackToMain = () => {
    if (activePlaylist) {
      resetFilters()
    }
  }

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-3xl overflow-hidden text-white pb-16">
      {/* Заголовок с переключателем поиска */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            {activePlaylist && (
              <Button variant="ghost" size="icon" onClick={resetFilters} className="mr-2 text-white hover:bg-white/10">
                <ChevronLeft size={20} />
                <span className="sr-only">Назад к каталогу</span>
              </Button>
            )}
            <h2 className="text-xl font-bold">
              {activePlaylistData ? `${activePlaylistData.name}` : "Каталог музыки"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isSearchActive && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchActive(true)}
                className="text-white hover:bg-white/10"
              >
                <Search size={20} />
                <span className="sr-only">Поиск</span>
              </Button>
            )}
            <Link href="/playlists">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ListMusic size={20} />
                <span className="sr-only">Плейлисты</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Строка поиска */}
        <AnimatePresence>
          {isSearchActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ padding: "0 1rem 1rem 1rem" }}
            >
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Поиск по названию или исполнителю..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12 rounded-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchActive(false)
                    setSearchQuery("")
                  }}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Отмена
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Вкладки категорий */}
        <div className="px-4 pb-2 overflow-x-auto hide-scrollbar">
          <Tabs defaultValue={selectedCategory} value={selectedCategory} onValueChange={setCategory} className="w-full">
            <TabsList className="bg-white/5 p-1 w-full flex justify-start overflow-x-auto hide-scrollbar">
              <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white/20 px-4 py-1.5 text-sm">
                Все
              </TabsTrigger>
              {genres.map((genre) => (
                <TabsTrigger
                  key={genre}
                  value={genre}
                  className="rounded-full data-[state=active]:bg-white/20 px-4 py-1.5 text-sm whitespace-nowrap"
                >
                  {genre}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Список песен */}
      <div className="p-4">
        {displaySongs.length > 0 ? (
          <div className="space-y-3">
            {displaySongs.map((song) => (
              <MobileSongCard
                key={song.id}
                song={song}
                onAddToPlaylist={handleAddToPlaylist}
                showPlaylistOptions={!!activePlaylistData}
                playlistId={activePlaylistData?.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Music size={48} className="text-white/30 mb-4" />
            <p className="text-white/70">
              {activePlaylistData
                ? "В этом плейлисте пока нет треков. Добавьте треки из каталога."
                : selectedCategory !== "all"
                  ? "Песни выбранного жанра не найдены. Попробуйте выбрать другой жанр."
                  : "Песни не найдены. Попробуйте изменить параметры поиска."}
            </p>
          </div>
        )}
      </div>

      {/* Диалоговые окна */}
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

