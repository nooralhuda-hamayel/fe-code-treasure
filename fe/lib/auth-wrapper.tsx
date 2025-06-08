"use client"
//used for admin levels page
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth"

interface AuthWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export default function AuthWrapper({ children, requireAuth = false, requireAdmin = false }: AuthWrapperProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const isAuthenticated = !!user

  // Temporarily disable auth checks
  if (requireAdmin) {
    return <>{children}</>
  }

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push("/login")
      }
    }
  }, [loading, isAuthenticated, user, router, requireAuth])

  if (loading) {
    return <div>Loading...</div>
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
