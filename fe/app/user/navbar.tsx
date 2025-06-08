"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Navbar() {
  const { user, logout } = useAuth()
  const isAuthenticated = !!user

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 border-b border-slate-700 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white hover:text-amber-500 transition-colors">
            Code Treasure
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin/dashboard">
                    <Button variant="ghost" className="text-white hover:text-amber-500">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/levels">
                  <Button variant="ghost" className="text-white hover:text-amber-500">
                    Levels
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-white hover:text-amber-500"
                  onClick={() => {
                    logout()
                    window.location.href = "/login"
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-amber-500">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="ghost" className="text-white hover:text-amber-500">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
