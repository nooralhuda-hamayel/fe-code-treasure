"use client"

import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  HelpCircle,
  MessageSquare
} from "lucide-react"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const AdminSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors",
              pathname === "/admin/dashboard"
                ? "bg-amber-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="mr-3">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/users"
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors",
              pathname === "/admin/users"
                ? "bg-amber-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="mr-3">
              <Users className="h-5 w-5" />
            </span>
            <span>Users</span>
          </Link>

          <Link
            href="/admin/levels"
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors",
              pathname === "/admin/levels"
                ? "bg-amber-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="mr-3">
              <BookOpen className="h-5 w-5" />
            </span>
            <span>Levels</span>
          </Link>

          <Link
            href="/admin/questions"
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors",
              pathname === "/admin/questions"
                ? "bg-amber-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="mr-3">
              <HelpCircle className="h-5 w-5" />
            </span>
            <span>Questions</span>
          </Link>

          <Link
            href="/admin/chat"
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors",
              pathname === "/admin/chat"
                ? "bg-amber-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="mr-3">
              <MessageSquare className="h-5 w-5" />
            </span>
            <span>Chat</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar 