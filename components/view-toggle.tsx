"use client"

import { useState, useEffect, useRef } from "react"
import { useMusicStore } from "@/lib/music-store"
import { Button } from "@/components/ui/button"
import { ListMusic, Library, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function ViewToggle() {
  const { activePlaylist, getPlaylistById, setActivePlaylist } = useMusicStore()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isMounted = useRef(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if we're in a playlist page
  const isPlaylistPage = pathname.startsWith("/playlist/")

  // Handle component unmounting to prevent async issues
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const activePlaylistData = activePlaylist ? getPlaylistById(activePlaylist) : null

  const handleToggleView = async () => {
    if (activePlaylist) {
      // If we're in a playlist view, go back to main catalog
      setIsTransitioning(true)

      try {
        // Use setTimeout with a Promise to handle async transition
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Only update state if component is still mounted
        if (isMounted.current) {
          setActivePlaylist(null)
          setIsTransitioning(false)
        }
      } catch (error) {
        console.error("Error during view transition:", error)
        // Reset transitioning state if there's an error
        if (isMounted.current) {
          setIsTransitioning(false)
        }
      }
    } else {
      // If we're in the main catalog, go to playlists page
      router.push("/playlists")
    }
  }

  // Determine button text based on context
  const buttonText = isPlaylistPage
    ? "Вернуться к плейлистам"
    : activePlaylist
      ? "Вернуться в каталог"
      : "Перейти к плейлистам"

  // Determine button icon based on context
  const ButtonIcon = isPlaylistPage ? ArrowLeft : activePlaylist ? Library : ListMusic

  return (
    <div className="relative mb-6">
      <Button
        onClick={handleToggleView}
        variant="outline"
        className={cn(
          "relative z-10 bg-white/10 border-white/20 text-white hover:bg-white/15",
          "transition-all duration-300 w-full justify-between group",
          isTransitioning ? "opacity-50 pointer-events-none" : "",
        )}
        aria-label={buttonText}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex items-center">
          <ButtonIcon size={16} className="mr-2 text-purple-400" aria-hidden="true" />
          <span>{buttonText}</span>
        </span>

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: activePlaylist || isPlaylistPage ? -5 : 5 }}
          transition={{ duration: 0.3 }}
          style={{
            color: isHovered ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
            transition: "color 0.2s ease",
          }}
          aria-hidden="true"
        >
          {activePlaylist || isPlaylistPage ? "←" : "→"}
        </motion.div>
      </Button>
            
    </div>
  )
}





