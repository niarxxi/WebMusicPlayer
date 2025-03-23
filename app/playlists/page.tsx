"use client"

import { useState } from "react"
import { useMusicStore } from "@/lib/music-store"
import { Button } from "@/components/ui/button"
import { Plus, ListMusic, ArrowLeft } from "lucide-react"
import PlaylistCard from "@/components/playlist-card"
import PlaylistDialog from "@/components/playlist-dialog"
import Link from "next/link"
import BreadcrumbNav from "@/components/breadcrumb-nav"
import { motion } from "framer-motion"
import type { Playlist } from "@/lib/types"

export default function PlaylistsPage() {
  const { playlists } = useMusicStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | undefined>(undefined)

  const handleCreatePlaylist = () => {
    setEditingPlaylist(undefined)
    setDialogOpen(true)
  }

  const handleRenamePlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist)
    setDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingPlaylist(undefined)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <BreadcrumbNav />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Мои плейлисты</h1>
          <Button onClick={handleCreatePlaylist} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus size={18} className="mr-2" />
            Создать плейлист
          </Button>
        </div>

        <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Вернуться к каталогу
        </Link>

        {playlists.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}
          >
            {playlists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <PlaylistCard playlist={playlist} onRename={handleRenamePlaylist} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center text-white">
            <ListMusic size={64} className="mx-auto mb-4 text-white/30" />
            <h2 className="text-xl font-medium mb-2">У вас пока нет плейлистов</h2>
            <p className="text-white/70 mb-6">Создайте свой первый плейлист, чтобы сохранять любимые треки</p>
            <Button onClick={handleCreatePlaylist} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus size={18} className="mr-2" />
              Создать плейлист
            </Button>
          </div>
        )}
      </div>

      <PlaylistDialog open={dialogOpen} onOpenChange={handleDialogOpenChange} playlist={editingPlaylist} />
    </main>
  )
}



