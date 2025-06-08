"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/levels")
      }
    }
  }, [loading, router, user])

  if (loading || user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
          Code Treasure
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8">
          Learn coding through interactive challenges and help the monkey find the treasure!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Login
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
