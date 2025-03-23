"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Song, CategoryFilter, Playlist } from "./types"

// Обновляем интерфейс MusicStore, добавляя новые состояния и методы для плейлистов
interface MusicStore {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  isShuffle: boolean
  isLoop: boolean
  shuffleQueue: string[]
  selectedCategory: CategoryFilter
  playlists: Playlist[]
  activePlaylist: string | null
  playSong: (song: Song) => void
  togglePlay: () => void
  toggleShuffle: () => void
  toggleLoop: () => void
  setCategory: (category: CategoryFilter) => void
  nextSong: () => void
  prevSong: () => void
  getFilteredSongs: () => Song[]
  resetFilters: () => void
  // Новые методы для работы с плейлистами
  createPlaylist: (name: string) => string
  renamePlaylist: (id: string, name: string) => void
  deletePlaylist: (id: string) => void
  addSongToPlaylist: (playlistId: string, songId: string) => void
  removeSongFromPlaylist: (playlistId: string, songId: string) => void
  reorderPlaylistSongs: (playlistId: string, sourceIndex: number, destinationIndex: number) => void
  setActivePlaylist: (playlistId: string | null) => void
  getPlaylistById: (id: string) => Playlist | undefined
  getPlaylistSongs: (playlistId: string) => Song[]
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
  {
    id: "15",
    name: "Tambourine Dream",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 33,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573210/mac-miller-tambourine-dream.mp3",
    description:
      "“Tambourine Dream” is a short intro track, featuring solely the tambourine being played by Mac. Tambourine can be heard in much of Mac’s music around this era, including both of his 2014 projects: Balloonerism and Faces. In a Twitch stream the week after Balloonerism’s release, engineer Josh Berg revealed that it was always the same tambourine being used in Mac’s music, and that the tambourine had its own makeshift stand inside of the studio.",
  },
  {
    id: "16",
    name: "DJ's Chord Organ",
    artist: "Mac Miller Feat. SZA",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 316,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573211/mac-miller-djs-chord-organ-feat-sza.mp3",
    description:
      "“DJ’s Chord Organ” was made using the chord organ of lo-fi pioneer Daniel Johnston. Mac acquired the organ in November 2013 after becoming an executive producer of Johnston’s biographical film Hi, How Are You Daniel Johnston? when he donated $10,000 to the film’s production. Around this time, upcoming singer-songwriter SZA had just signed to Top Dawg Entertainment and moved to Los Angeles, the home base of both Mac and TDE. Likely meeting Mac through her labelmates ScHoolboy Q and Ab-Soul, who were close friends of Mac, SZA says that he was the first person she met after moving to L.A., and she would “come over everyday” and record.",
  },
  {
    id: "17",
    name: "Do You Have A Destination?",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 205,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573212/mac-miller-do-you-have-a-destination.mp3",
    description:
      "“Do You Have a Destination?” by Mac Miller is a profound track from his posthumous album Balloonerism, which encapsulates the artist's distinctive blend of introspection, humor, and existential musings. From the outset, the song establishes a meditative mood with its jazz-influenced instrumentals, which effortlessly complement Mac's reflective lyrical content. His signature laid-back delivery is present, but underneath the nonchalance lies deep philosophical questioning, particularly regarding purpose, mortality, and self-identity. The title itself suggests a sense of searching or wandering, which permeates the entire song.",
  },
  {
    id: "18",
    name: "5 Dollar Pony Rides",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 222,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573213/mac-miller-5-dollar-pony-rides.mp3",
    description:
      "“5 Dollar Pony Rides”, the lead single from Balloonerism, sees Mac Miller reflecting on a complex, emotionally distant relationship. The song blends nostalgia with empathy, as Mac offers both temporary comfort (“What you want”) and deeper emotional support (“What you need”). The title “5 Dollar Pony Rides” serves as a metaphor for fleeting pleasures, highlighting the emptiness of quick fixes. With a mix of longing and frustration, Mac explores themes of loneliness, missed opportunities, and the difficulty of truly connecting.",
  },
  {
    id: "19",
    name: "Friendly Hallucinations",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 286,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573214/mac-miller-friendly-hallucinations.mp3",
    description:
      "On “Friendly Hallucinations”, Mac explores the relationship between drugs and the false sense of comfort that they may bring, as well as the detachment from the world and raw human emotions it may evoke.",
  },
  {
    id: "20",
    name: "Mrs. Deborah Downer",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 245,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573215/mac-miller-mrs-deborah-downer.mp3",
    description:
      "“Mrs. Deborah Downer” from Mac Miller’s posthumous album Balloonerism offers a melancholic and introspective vibe, showcasing his signature smooth flow and rich instrumentation. From the onset, the track immerses listeners in a laid-back, almost spoken-word atmosphere, with a steady bassline that grounds the song while the jazzy chords and subtle percussion create a dreamlike ambiance. The track feels both intimate and reflective, with Mac’s voice at the forefront, letting the emotional weight of his lyrics shine. There's a gentle complexity in how he navigates the interplay between light-hearted melodies and deeper, somber subject matter, making the song feel both soothing and thought-provoking.",
  },
  {
    id: "21",
    name: "Stoned",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 244,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573216/mac-miller-stoned.mp3",
    description:
      "“Stoned”, from Mac Miller's posthumous album Balloonerism, encapsulates a reflective and melancholic vibe that captures the complexities of the artist's relationship with both his inner self and a significant other. The track begins with a lush soundscape paired with a slow, blues-driven guitar that sets the tone for the mellow, laid-back vibe that dominates the song. As the track progresses, Mac's verse enters, carried by a slow drum beat that further solidifies the contemplative nature of the song. The smooth instrumentation and relaxed rhythm work perfectly to convey the sense of both emotional and physical languor.",
  },
  {
    id: "22",
    name: "Shangri-La",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 169,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573217/mac-miller-shangri-la.mp3",
    description:
      "“Shangri-La” from Mac Miller’s posthumous album Balloonerism is a mesmerizing blend of experimental sounds and introspective lyricism. The track kicks off with a spoken word sample that sets the tone for a dreamlike journey, underscored by a slow, almost hypnotic drum beat. True to Mac Miller's style, the sound is both weird and experimental, seamlessly blending genres and moods in a way that feels familiar yet refreshingly different. The hazy, laid-back vibe pulls you into a meditative state, perfectly complementing the song's overarching themes of escapism and self-reflection.",
  },
  {
    id: "23",
    name: "Funny Papers",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 264,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573218/mac-miller-funny-papers.mp3",
    description:
      "“Funny Papers”, a posthumous track from Mac Miller's album Balloonerism, is a poignant reflection on life, death, and the fleeting nature of existence. The song opens with a laid-back piano melody and a sample of Mac teaching how to dance, which sets the mood for a contemplative yet uplifting track. The production is smooth and mellow, providing a chilled-out vibe that complements Mac's introspective lyrics. The juxtaposition of heavy themes like death and loss with lighter, hopeful moments creates a balance that draws listeners into Mac’s world, where he's appreciating life despite its inevitable sadness.",
  },
  {
    id: "24",
    name: "Excelsior",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 144,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573219/mac-miller-excelsior.mp3",
    description:
      "“Excelsior” from Mac Miller’s posthumous album Balloonerism is a tranquil, introspective track that masterfully captures the essence of Mac's signature style. The song’s minimalist instrumentation, featuring a laid-back drum beat and sparse production, creates an atmosphere of relaxation. Mac Miller's delivery is soft and chilled, effortlessly blending into the dreamy soundscape as he reflects on the innocence of childhood and the inevitable encroachment of adulthood. The track feels like a slow, contemplative walk through memory, where each lyric evokes a sense of nostalgia and longing for simpler times.",
  },
  {
    id: "25",
    name: "Transformations",
    artist: "Mac Miller Feat. Delusional Thomas",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 185,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573220/mac-miller-transformations-feat-delusional-thomas.mp3",
    description:
      "“Transformations” from Mac Miller's posthumous album Balloonerism offers a peculiar, yet intriguing interlude that captures the listener’s attention through its experimental production and eccentric vocal delivery. The track feels like a fusion of genres, blending trip-hop, jazz, and subtle hip-hop influences with abstract vocal pitch-shifting. The jazz instrumental backdrop, combined with the heavily distorted beats, creates an eerie yet laid-back atmosphere, characteristic of Mac's later experimental works. It feels like a collage of sounds stitched together, adding to its disjointed yet captivating nature.",
  },
  {
    id: "26",
    name: "Manakins",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 189,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573221/mac-miller-manakins.mp3",
    description:
      "“Manakins” by Mac Miller, from his posthumous album Balloonerism, offers a deep reflection on life, mortality, and the divine. Opening with a minimalist instrumental that swells in and out, the track sets a contemplative mood as Mac raps with a confident yet introspective tone. His thoughts on God and existence are at the forefront, drawing listeners into his internal world. The song is a meditation on the presence of a higher power and how that presence shapes his actions and thoughts.",
  },
  {
    id: "27",
    name: "Rick's Piano",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 309,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573222/mac-miller-ricks-piano.mp3",
    description:
      "“Rick's Piano”, a posthumous track from Mac Miller's Balloonerism, offers a hauntingly beautiful introspection on the artist's life, struggles, and philosophical musings. The song begins with a soft, minimalist instrumental, featuring a mellow piano that perfectly complements Mac's reflective lyrics. This gentle production, paired with the slow-paced rapping, creates an intimate atmosphere that feels both personal and vulnerable. It's a piece that resonates with listeners, particularly those familiar with Mac's battles with mental health and substance abuse, as it encapsulates his search for meaning in the face of personal turmoil.",
  },
  {
    id: "28",
    name: "Tomorrow Will Never Know",
    artist: "Mac Miller",
    album: "Balloonerism",
    year: "2025",
    genre: "Hip-Hop/Rap",
    duration: 713,
    image: "https://i.scdn.co/image/ab67616d0000b2739a9c4cd69a6f514dfbb7305a",
    path: "https://musify.club/track/dl/20573223/mac-miller-tomorrow-will-never-know.mp3",
    description:
      "“Tomorrow Will Never Know” from Mac Miller’s posthumous album Balloonerism is a hauntingly slow and introspective journey, lasting a staggering 11 minutes. The track builds a psychedelic atmosphere that blends abstract and ambient sounds with a sense of deep existential reflection. Its dreamy, atmospheric qualities set the tone for Mac Miller's exploration of the intricacies of life, death, and the blurred lines between them. This track’s immersive quality captures listeners in a hypnotic flow that resonates deeply with the themes of mortality and introspection.",
  },
]

// Функция для создания случайной очереди воспроизведения
const createShuffleQueue = (songs: Song[], currentSongId?: string): string[] => {
  // Создаем массив ID всех песен, кроме ��екущей
  const songIds = songs.map((song) => song.id).filter((id) => id !== currentSongId)

  // Перемешиваем массив
  for (let i = songIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[songIds[i], songIds[j]] = [songIds[j], songIds[i]]
  }

  // Если есть текущая песня, добавляем ее в начало
  if (currentSongId) {
    songIds.unshift(currentSongId)
  }

  return songIds
}

// Функция для генерации уникального ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      songs: songsData,
      currentSong: null,
      isPlaying: false,
      isShuffle: false,
      isLoop: false,
      shuffleQueue: [],
      selectedCategory: "all",
      playlists: [],
      activePlaylist: null,

      getFilteredSongs: () => {
        const { songs, selectedCategory, activePlaylist, playlists } = get()

        // If activePlaylist is set, return songs from that playlist
        if (activePlaylist) {
          const playlist = playlists.find((p) => p.id === activePlaylist)
          if (playlist) {
            // Get the songs from the playlist
            const playlistSongs = playlist.songs
              .map((id) => songs.find((song) => song.id === id))
              .filter((song): song is Song => song !== undefined)

            // If a category is selected (not "all"), filter the playlist songs by that category
            if (selectedCategory !== "all") {
              return playlistSongs.filter((song) => song.genre === selectedCategory)
            }

            return playlistSongs
          }
        }

        // Otherwise filter by category
        if (selectedCategory === "all") {
          return songs
        }
        return songs.filter((song) => song.genre === selectedCategory)
      },

      resetFilters: () => {
        set({
          selectedCategory: "all",
          activePlaylist: null,
        })
      },

      setCategory: (category) => {
        const { currentSong } = get()
        set({ selectedCategory: category })

        // Если текущая песня не соответствует выбранной категории, сбрасываем её
        if (currentSong && category !== "all" && currentSong.genre !== category) {
          set({ currentSong: null, isPlaying: false })
        }

        // Обновляем очередь shuffle, если она активна
        const { isShuffle } = get()
        if (isShuffle) {
          const filteredSongs = get().getFilteredSongs()
          const shuffleQueue = createShuffleQueue(filteredSongs)
          set({ shuffleQueue })
        }
      },

      playSong: (song) => {
        const { isShuffle, getFilteredSongs } = get()
        let shuffleQueue: string[] = []

        if (isShuffle) {
          const filteredSongs = getFilteredSongs()
          shuffleQueue = createShuffleQueue(filteredSongs, song.id)
        }

        set({
          currentSong: song,
          isPlaying: true,
          shuffleQueue: isShuffle ? shuffleQueue : [],
        })
      },

      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }))
      },

      toggleShuffle: () => {
        const { isShuffle, currentSong, getFilteredSongs } = get()
        let shuffleQueue: string[] = []

        // Если включаем shuffle, создаем новую очередь
        if (!isShuffle && currentSong) {
          const filteredSongs = getFilteredSongs()
          shuffleQueue = createShuffleQueue(filteredSongs, currentSong.id)
        }

        set({
          isShuffle: !isShuffle,
          shuffleQueue: !isShuffle ? shuffleQueue : [],
        })
      },

      toggleLoop: () => {
        set((state) => ({ isLoop: !state.isLoop }))
      },

      nextSong: () => {
        const { currentSong, isShuffle, shuffleQueue, isLoop, getFilteredSongs } = get()
        if (!currentSong) return

        const filteredSongs = getFilteredSongs()
        let nextSong = null

        if (isShuffle) {
          // Находим индекс текущей песни в очереди shuffle
          const currentIndex = shuffleQueue.findIndex((id) => id === currentSong.id)

          // Если это последняя песня в очереди
          if (currentIndex === shuffleQueue.length - 1) {
            if (isLoop) {
              // Если включен loop, создаем новую очередь shuffle
              const newShuffleQueue: string[] = createShuffleQueue(filteredSongs)
              nextSong = filteredSongs.find((song) => song.id === newShuffleQueue[0]) || null
              set({ shuffleQueue: newShuffleQueue })
            } else {
              // Если loop выключен, останавливаемся на последней песне
              return
            }
          } else {
            // Берем следующую песню из очереди shuffle
            const nextId = shuffleQueue[currentIndex + 1]
            nextSong = filteredSongs.find((song) => song.id === nextId) || null
          }
        } else {
          // Обычный режим воспроизведения
          const currentIndex = filteredSongs.findIndex((song) => song.id === currentSong.id)

          // Если это последняя песня
          if (currentIndex === filteredSongs.length - 1) {
            if (isLoop) {
              // Если включен loop, переходим к первой песне
              nextSong = filteredSongs[0]
            } else {
              // Если loop выключен, останавливаемся на последней песне
              return
            }
          } else {
            // Берем следующую песню
            nextSong = filteredSongs[currentIndex + 1]
          }
        }

        if (nextSong) {
          set({ currentSong: nextSong, isPlaying: true })
        }
      },

      prevSong: () => {
        const { currentSong, isShuffle, shuffleQueue, getFilteredSongs } = get()
        if (!currentSong) return

        const filteredSongs = getFilteredSongs()
        let prevSong = null

        if (isShuffle) {
          // Находим индекс текущей песни в очереди shuffle
          const currentIndex = shuffleQueue.findIndex((id) => id === currentSong.id)

          // Если это первая песня в очереди
          if (currentIndex === 0) {
            // Остаемся на первой песне
            return
          } else {
            // Берем предыдущую песню из очереди shuffle
            const prevId = shuffleQueue[currentIndex - 1]
            prevSong = filteredSongs.find((song) => song.id === prevId) || null
          }
        } else {
          // Обычный режим воспроизведения
          const currentIndex = filteredSongs.findIndex((song) => song.id === currentSong.id)

          // Если это первая песня
          if (currentIndex === 0) {
            // Остаемся на первой песне
            return
          } else {
            // Берем предыдущую песню
            prevSong = filteredSongs[currentIndex - 1]
          }
        }

        if (prevSong) {
          set({ currentSong: prevSong, isPlaying: true })
        }
      },

      // Методы для работы с плейлистами
      createPlaylist: (name) => {
        const id = generateId()
        const newPlaylist: Playlist = {
          id,
          name,
          songs: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }))

        return id
      },

      renamePlaylist: (id, name) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === id ? { ...playlist, name, updatedAt: Date.now() } : playlist,
          ),
        }))
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id),
          activePlaylist: state.activePlaylist === id ? null : state.activePlaylist,
        }))
      },

      addSongToPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId && !playlist.songs.includes(songId)
              ? {
                  ...playlist,
                  songs: [...playlist.songs, songId],
                  updatedAt: Date.now(),
                }
              : playlist,
          ),
        }))
      },

      removeSongFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: playlist.songs.filter((id) => id !== songId),
                  updatedAt: Date.now(),
                }
              : playlist,
          ),
        }))
      },

      reorderPlaylistSongs: (playlistId, sourceIndex, destinationIndex) => {
        const playlist = get().playlists.find((p) => p.id === playlistId)
        if (!playlist) return

        const newSongs = [...playlist.songs]
        const [removed] = newSongs.splice(sourceIndex, 1)
        newSongs.splice(destinationIndex, 0, removed)

        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, songs: newSongs, updatedAt: Date.now() } : p,
          ),
        }))
      },

      setActivePlaylist: (playlistId) => {
        set({
          activePlaylist: playlistId,
        })
      },

      getPlaylistById: (id) => {
        return get().playlists.find((playlist) => playlist.id === id)
      },

      getPlaylistSongs: (playlistId) => {
        const { songs, playlists, selectedCategory } = get()
        const playlist = playlists.find((p) => p.id === playlistId)
        if (!playlist) return []

        const playlistSongs = playlist.songs
          .map((id) => songs.find((song) => song.id === id))
          .filter((song): song is Song => song !== undefined)

        // Apply category filter if one is selected
        if (selectedCategory !== "all") {
          return playlistSongs.filter((song) => song.genre === selectedCategory)
        }

        return playlistSongs
      },
    }),
    {
      name: "music-player-storage",
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        playlists: state.playlists,
        activePlaylist: state.activePlaylist,
      }),
    },
  ),
)