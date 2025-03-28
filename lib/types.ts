export type CategoryFilter = string | "all"

export interface Song {
  id: string
  name: string
  artist: string
  album?: string
  year?: string
  genre: string
  duration: number
  image: string
  path: string
  description?: string
}

export interface Playlist {
  id: string
  name: string
  songs: string[] // Array of song IDs
  createdAt: number
  updatedAt: number
}

