import MusicPlayer from "@/components/music-player"
import Catalog from "@/components/catalog"
import { Suspense } from "react"
import Background from "@/components/background"

export default function Home() {
  return (
    <main className="min-h-screen p-4 relative overflow-hidden">
      {/* Динамический фон */}
      <Background />

      <div className="container mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white text-center mb-8 pt-4">Музыкальный плеер</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <Suspense fallback={<div className="text-white">Загрузка каталога...</div>}>
            <Catalog />
          </Suspense>

          <div className="order-first lg:order-last">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </main>
  )
}