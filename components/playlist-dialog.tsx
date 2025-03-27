"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMusicStore } from "@/lib/music-store"
import type { Playlist } from "@/lib/types"

interface PlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlist?: Playlist
}

export default function PlaylistDialog({ open, onOpenChange, playlist }: PlaylistDialogProps) {
  const { createPlaylist, renamePlaylist } = useMusicStore()
  const [name, setName] = useState("")
  const isMounted = useRef(true)
  const isEditing = !!playlist

  // Обработка размонтирования компонента для предотвращения асинхронных проблем
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (open && playlist) {
      setName(playlist.name)
    } else if (open) {
      setName("")
    }
  }, [open, playlist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim()) {
      try {
        if (isEditing && playlist) {
          await renamePlaylist(playlist.id, name.trim())
        } else {
          await createPlaylist(name.trim())
        }

        // Обновляем состояние только если компонент все еще смонтирован
        if (isMounted.current) {
          onOpenChange(false)
        }
      } catch (error) {
        console.error("Error saving playlist:", error)
      }
    }
  }

  const dialogDescription = isEditing ? "Введите новое название для плейлиста" : "Введите название для нового плейлиста"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md"
        aria-describedby="playlist-dialog-description"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Переименовать плейлист" : "Создать плейлист"}</DialogTitle>
            <DialogDescription id="playlist-dialog-description" className="text-white/70">
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название плейлиста"
              className="bg-white/5 border-white/10 text-white"
              autoFocus
              aria-label="Название плейлиста"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={!name.trim()} className="bg-purple-600 hover:bg-purple-700 text-white">
              {isEditing ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

