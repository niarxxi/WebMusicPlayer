"use client"

import { create } from "zustand"
import type { Song } from "./types"

interface MusicStore {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  playSong: (song: Song) => void
  togglePlay: () => void
  nextSong: () => void
  prevSong: () => void
}

// Расширенные данные о песнях
const songsData: Song[] = [
  {
    id: "1",
    name: "Supernova",
    artist: "aespa",
    album: "Supernova - Single",
    year: "2023",
    genre: "K-Pop",
    duration: 180,
    image: "https://i.scdn.co/image/ab67616d0000b2736beb5db12245ae89a260e11e",
    path: "https://lmusic.kz/api/download/183624",
    description: "\"Supernova\" is the eighth digital single by aespa. It was released on May 13, 2024 as the pre-release for the group's first full-length album, Armageddon.",
  },
  {
    id: "2",
    name: "How Sweet",
    artist: "New Jeans",
    album: "Get Up",
    year: "2023",
    genre: "K-Pop",
    duration: 195,
    image: "https://i.scdn.co/image/ab67616d0000b273b657fbb27b17e7bd4691c2b2",
    path: "https://lmusic.kz/api/download/167845",
    description: "\"How Sweet\" is a song by the South Korean girl group NewJeans from their second single album of the same name. It was released by ADOR on May 24, 2024, along with the B-side track \"Bubble Gum\". NewJeans began promoting the single in April 2024, through the release of the music video for \"Bubble Gum\" on YouTube, featuring the Japanese version of the track in advertisements and television programs in Japan, and appearing on music shows and variety shows in South Korea. The single album debuted at number one in South Korea. It has been described as a Miami bass and electropop song.",
  },
  {
    id: "3",
    name: "See That?",
    artist: "NMIXX",
    album: "expérgo",
    year: "2023",
    genre: "K-Pop",
    duration: 210,
    image: "https://i.scdn.co/image/ab67616d0000b273c9c9aaadb2d6d3d44be06332",
    path: "https://lmusic.kz/api/download/177315",
    description: "\"See That?\" (Korean: 별별별; RR: Byeolbyeolbyeol; lit. All sorts of things) is a song by South Korean girl group Nmixx for their third extended play Fe3O4: Stick Out. It was released as the EP's lead single by JYP Entertainment and Republic Records on August 19, 2024.",
  },
  {
    id: "4",
    name: "MEOW",
    artist: "MEOVV",
    album: "MEOW - Single",
    year: "2023",
    genre: "K-Pop",
    duration: 165,
    image: "https://i.scdn.co/image/ab67616d0000b273c0fd19def5108123e077d634",
    path: "https://lmusic.kz/api/download/180106",
    description: "\"Meow\" is the debut single by South Korean girl group Meovv. It was released by The Black Label on September 6, 2024.",
  },
  {
    id: "5",
    name: "earthquake",
    artist: "JISOO",
    album: "Amortage",
    year: "2025",
    genre: "K-Pop",
    duration: 191,
    image: "https://i.scdn.co/image/ab67616d0000b273557019801cd1cb6d8175f3f1",
    path: "https://lmusic.kz/api/download/208595",
    description:
      "'Earthquake' is a song by South Korean singer Jisoo. It was released through her label Blissoo and Warner Records on February 14, 2025, as the lead single from her debut extended play, Amortage (2025). It marked Jisoo's first single under her own label since departing from YG Entertainment and Interscope Records as a solo artist in 2023. An electropop song about the excitement of new love, 'Earthquake' was written by Jisoo with Jack Brady, Jordan Roman, Sarah Troy and Sara Boe, while it was produced by Blissoo and the Wavys.",
  },
  {
    id: "6",
    name: "Your Love",
    artist: "JISOO",
    album: "Amortage",
    year: "2025",
    genre: "K-Pop",
    duration: 173,
    image: "https://i.scdn.co/image/ab67616d0000b273557019801cd1cb6d8175f3f1",
    path: "https://lmusic.kz/api/download/208599",
    description:
      "'Your Love' is a song recorded by South Korean singer Jisoo. It is the second track on her debut extended play, Amortage (2025), which was released on February 14, 2025, through her label Blissoo and Warner Records. Blending elements of electropop, pop-rock, and bubblegum pop, the song captures a woman's deep and immersive happiness of romantic love. The track was written by Jisoo, Jack Brady, Jordan Roman, Violet Skies, Lilian Caputo and Jenna Raine. Production was handled by Blissoo and The Wavys.",
  },
  {
    id: "7",
    name: "Timeless",
    artist: "The Weeknd feat. Playboi Carti",
    album: "Hurry Up Tomorrow",
    year: "2024",
    genre: "Trap",
    duration: 256 ,
    image: "https://i.scdn.co/image/ab67616d0000b27358cd6595ed970f6862906ab8",
    path: "https://lmusic.kz/api/download/184710",
    description:
      "'Timeless' is a song by Canadian singer-songwriter the Weeknd and American rapper Playboi Carti. It was released on September 27, 2024, through XO and Republic Records as the lead single from the former's sixth studio album, Hurry Up Tomorrow (2025). Produced by Pharrell Williams, Mike Dean, Ojivolta, and Jarrod 'Twisco' Morgan, the song peaked at number three on the US Billboard Hot 100 and number eight on the Billboard Global 200, and debuted in the top ten in 15 countries.",
  },
  {
    id: "8",
    name: "We Still Dont Trust You",
    artist: "Future feat. Metro Boomin",
    album: "We Still Don't Trust You",
    year: "2023",
    genre: "R&B",
    duration: 252,
    image: "https://i.scdn.co/image/ab67616d0000b273d353552c4c2932094456bbe9",
    path: "https://lmusic.kz/api/download/161241",
    description:
      "'We Still Don't Trust You' is a song by American rapper Future, American record producer Metro Boomin, and Canadian singer-songwriter the Weeknd. It was sent to Italian radio airplay as the lead single from Future and Metro Boomin's collaborative studio album of the same name, a week after its release on April 19, 2024. Its official music video was released six days earlier, which was a day after its parent album was released, and stars Canadian fashion model Winnie Harlow.",
  },
  {
    id: "9",
    name: "Bored!",
    artist: "NINGNING",
    album: "SYNK : PARALLEL LINE - Special Digital Single",
    year: "2024",
    genre: "K-Pop",
    duration: 171,
    image: "https://i.scdn.co/image/ab67616d0000b273253096eda3b7826c11c7fab8",
    path: "https://lmusic.kz/api/download/187124",
    description: "Bored is the debut solo single by aespa member NINGNING, and the 3rd track on aespa - synk parallel line, an compilation of the member's solo singles that they performed during the tour of the same name. It was produced by Dom Rivinius, who is most notable for producing for Baekhyun, Alicia Keys, Taylor Swift, Eminem and BTS.",
  },
  {
    id: "10",
    name: "Fuel",
    artist: "Eminem feat. JID",
    album: "The Death of Slim Shady (Coup De Grâce)",
    year: "2024",
    genre: "Hip-Hop/Rap",
    duration: 213,
    image: "https://i.scdn.co/image/ab67616d0000b2731633c43b5695735f7de36487",
    path: "https://lmusic.kz/api/download/185209",
    description:
      "“Fuel” joins Eminem with East Atlanta rapper JID. The high-octane collaboration sees the two rappers asserting their dominance in the rap game and their refusal to be silenced. JID sets the tone for the song with an opening verse that establishes his street credibility through references to the struggles and violence prevalent in his hometown. Eminem follows with a verse that taunts his critics and doubters, weaving in contemporary references such as the Kyle Rittenhouse case, Halyna Hutchins' accidental death on set by Alec Baldwin, and sexual assault allegations against Diddy, as well as his alleged involvement in the death of 2Pac.",
  },
  {
    id: "11",
    name: "pocket locket",
    artist: "Alaina Castillo",
    album: "parallel universe pt. 1",
    year: "2021",
    genre: "Pop",
    duration: 207,
    image: "https://i.scdn.co/image/ab67616d0000b2738816fc9d74259e88c7323650",
    path: "https://musify.club/track/dl/17529112/alaina-castillo-pocket-locket.mp3",
    description:
      "“pocket locket” is the first track off the first part of Alaina Castillo’s debut album, parallel universe pt. 1. Alaina mentioned for the first time on June 25, 2020 during an Instagram live and sang a little snippet, after that, the same day, she sang the same snippet on a Youtube live. On April 23, 2021, the song title was confirmed as “pocket locket”, the song was first teased as “chicken pocket”",
  },
  {
    id: "12",
    name: "Pops",
    artist: "THEY.",
    album: "Pops",
    year: "2018",
    genre: "Hip-Hop/Rap",
    duration: 160,
    image: "https://i.scdn.co/image/ab67616d0000b2732fec021ac6765e208d60c022",
    path: "https://mus.zvukofon.com/dl/1068765761/THEY_-_Pops_(musportal.org).mp3",
    description:
      "On “Pops”, Dante details his complicated relationship with his father. Although they have their issues, he still loves and misses him very much and speaks on his appreciation for him.",
  },
  {
    id: "13",
    name: "Radio (Dum-Dum)",
    artist: "YUQI",
    album: "Radio (Dum-Dum) - Single",
    year: "2025",
    genre: "K-Pop",
    duration: 152,
    image: "https://i.scdn.co/image/ab67616d0000b2737c8419b88944e9f7f5d44fdd",
    path: "https://lmusic.kz/api/download/213058",
    description:
      "\"Radio (Dum-Dum)\" is the third digital single by Yuqi. It was released on March 17, 2025, but the special clip was released on September 23, 2024.",
  },
  {
    id: "14",
    name: "NEW DROP",
    artist: "Don Toliver",
    album: "HARDSTONE PSYCHO",
    year: "2024",
    genre: "R&B",
    duration: 217,
    image: "https://i.scdn.co/image/ab67616d0000b273c800e1a4a237cf8f085183c5",
    path: "https://mus.zvukofon.com/dl/1846702569/Don_Toliver_-_NEW_DROP_(musportal.org).mp3",
    description:
      "\"New Drop\" is a song by American rapper and singer Don Toliver. It was released through Cactus Jack and Atlantic Records as a track from his fourth studio album, Hardstone Psycho, on June 14, 2024. Toliver wrote the song with producers Wheezy, Psymun, Dez Wright, and Coleman. The song gained mainstream popularity a few months after its release due to it being played in the background of a lot of videos on the online video platform TikTok.",
  },
]

export const useMusicStore = create<MusicStore>((set, get) => ({
  songs: songsData,
  currentSong: null,
  isPlaying: false,

  playSong: (song) => {
    set({ currentSong: song, isPlaying: true })
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }))
  },

  nextSong: () => {
    const { songs, currentSong } = get()
    if (!currentSong) return

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % songs.length
    set({ currentSong: songs[nextIndex], isPlaying: true })
  },

  prevSong: () => {
    const { songs, currentSong } = get()
    if (!currentSong) return

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    set({ currentSong: songs[prevIndex], isPlaying: true })
  },
}))

