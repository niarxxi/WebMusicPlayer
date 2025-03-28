import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AudioProvider } from "@/components/audio-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Музыкальный плеер",
  description: "Современное веб-приложение для прослушивания музыки",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  )
}

