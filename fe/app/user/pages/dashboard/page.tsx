"use client"

import AuthWrapper from "@/lib/auth-wrapper"
import UserDashboard from "@/app/user/user-dashboard"

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <UserDashboard />
    </AuthWrapper>
  )
}
