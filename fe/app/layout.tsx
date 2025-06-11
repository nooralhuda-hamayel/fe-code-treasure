"use client"

import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/app/user/navbar"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen w-full overflow-x-hidden`}
      >
        {!isAdminPage && <Navbar />}
        <main className={!isAdminPage ? "container mx-auto max-w-[1800px] py-10 px-4" : undefined}>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
