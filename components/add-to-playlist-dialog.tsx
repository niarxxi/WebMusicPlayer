"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useMusicStore } from "@/lib/music-store"
import { Plus, Check } from "lucide-react"
import type { Song } from "@/lib/types"

interface AddToPlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  song: Song
  onCreatePlaylist: () => void
}

export default function AddToPlaylistDialog({ open, onOpenChange, song, onCreatePlaylist }: AddToPlaylistDialogProps) {
  const { playlists, addSongToPlaylist } = useMusicStore()
  const [addedPlaylistIds, setAddedPlaylistIds] = useState<string[]>([])
  const [existingPlaylistIds, setExistingPlaylistIds] = useState<string[]>([])
  const isMounted = useRef(true)

  // Reset state when dialog opens or song changes
  useEffect(() => {
    if (open) {
      // Find playlists that already contain this song
      const store = useMusicStore.getState()
      const existing = playlists
        .filter((playlist) => {
          const songs = store.getPlaylistSongs(playlist.id)
          return songs.some((s) => s.id === song.id)
        })
        .map((p) => p.id)

      setExistingPlaylistIds(existing)
      setAddedPlaylistIds([])
    }
  }, [open, song.id, playlists])

  // Handle component unmounting to prevent async issues
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const handleTogglePlaylist = (playlistId: string) => {
    // Skip if song is already in this playlist
    if (existingPlaylistIds.includes(playlistId)) return

    // Check if we're adding or removing
    if (addedPlaylistIds.includes(playlistId)) {
      // Remove from our local tracking state (we don't remove from actual playlist)
      setAddedPlaylistIds((prev) => prev.filter((id) => id !== playlistId))
    } else {
      // Add to our local tracking state
      setAddedPlaylistIds((prev) => [...prev, playlistId])

      // Add to the actual playlist - wrap in a try/catch to handle potential async issues
      try {
        addSongToPlaylist(playlistId, song.id)
      } catch (error) {
        console.error("Error adding song to playlist:", error)
      }
    }
  }

  const handleCreatePlaylist = () => {
    // Only proceed if component is still mounted
    if (isMounted.current) {
      onOpenChange(false)
      onCreatePlaylist()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md"
        aria-describedby="playlist-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Добавить в плейлист</DialogTitle>
          <DialogDescription id="playlist-dialog-description" className="text-white/70">
            Выберите плейлист, в который хотите добавить трек "{song.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const isInPlaylist = existingPlaylistIds.includes(playlist.id)
                const isAdded = addedPlaylistIds.includes(playlist.id)

                return (
                  <div
                    key={playlist.id}
                    className={`flex items-center justify-between p-3 rounded-lg 
                      ${isInPlaylist ? "bg-white/5 cursor-default" : "bg-white/5 hover:bg-white/10 cursor-pointer"}`}
                    onClick={() => !isInPlaylist && handleTogglePlaylist(playlist.id)}
                    role="button"
                    aria-pressed={isAdded || isInPlaylist}
                    aria-label={`Добавить в плейлист ${playlist.name}`}
                  >
                    <span className="font-medium">{playlist.name}</span>
                    {isInPlaylist ? (
                      <span className="text-sm text-white/60">Уже добавлено</span>
                    ) : isAdded ? (
                      <Check size={18} className="text-green-500" aria-hidden="true" />
                    ) : (
                      <Plus size={18} aria-hidden="true" />
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-white/60">
              <p>У вас пока нет плейлистов</p>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Button onClick={handleCreatePlaylist} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus size={16} className="mr-2" aria-hidden="true" />
            Создать новый плейлист
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}