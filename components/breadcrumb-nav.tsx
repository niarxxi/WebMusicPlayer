"use client"

import type React from "react"

import { ChevronRight, Home, ListMusic } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMusicStore } from "@/lib/music-store"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ReactNode
  onClick?: () => void
}

export default function BreadcrumbNav() {
  const pathname = usePathname()
  const { getPlaylistById, resetFilters, activePlaylist } = useMusicStore()

  // Создаем элементы breadcrumbs на основе текущего пути
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Главная",
      href: "/",
      icon: <Home size={16} />,
      onClick: resetFilters, // Сбрасываем фильтры при нажатии на Главную
    },
  ]

  // Добавляем breadcrumbs, связанные с плейлистами
  if (pathname.startsWith("/playlists")) {
    breadcrumbs.push({
      label: "Плейлисты",
      href: "/playlists",
      icon: <ListMusic size={16} />,
    })
  } else if (pathname.startsWith("/playlist/")) {
    breadcrumbs.push({
      label: "Плейлисты",
      href: "/playlists",
      icon: <ListMusic size={16} />,
    })

    // Добавляем конкретное имя плейлиста, если мы находимся на странице плейлиста
    const playlistId = pathname.split("/").pop()
    if (playlistId) {
      const playlist = getPlaylistById(playlistId)
      if (playlist) {
        breadcrumbs.push({
          label: playlist.name,
          href: `/playlist/${playlistId}`,
        })
      }
    }
  } else if (pathname.startsWith("/song/")) {
    breadcrumbs.push({
      label: "Информация о треке",
      href: pathname,
    })
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-white/70 mb-6 overflow-x-auto pb-2 max-w-full">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight size={14} className="mx-1 text-white/40" />}

            <Link
              href={item.href}
              className={cn(
                "flex items-center hover:text-white transition-colors whitespace-nowrap",
                isLast ? "text-white font-medium" : "text-white/70",
              )}
              aria-current={isLast ? "page" : undefined}
              onClick={item.onClick}
            >
              {item.icon && <span className="mr-1.5">{item.icon}</span>}
              {item.label}
            </Link>
          </div>
        )
      })}
    </nav>
  )
}

