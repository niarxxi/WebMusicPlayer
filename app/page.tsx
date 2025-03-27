import { Suspense } from "react"
import Background from "@/components/background"
import PlayerContainer from "@/components/player-container"
import CatalogWrapper from "@/components/catalog-wrapper"

export default function Home() {
  return (
    <main className="min-h-screen p-4 relative overflow-hidden mobile-layout">
      {/* Динамический фон */}
      <Background />

      <div className="container mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white text-center mb-8 pt-4 md:block hidden">Музыкальный плеер</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <Suspense fallback={<div className="text-white">Загрузка каталога...</div>}>
            <CatalogWrapper />
          </Suspense>

          <div className="order-first lg:order-last">
            <PlayerContainer />
          </div>
        </div>
      </div>
    </main>
  )
}

