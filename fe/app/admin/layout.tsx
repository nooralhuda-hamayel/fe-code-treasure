"use client"

import AdminSidebar from "@/app/user/admin-sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="container mx-auto py-10 px-4 max-w-[1800px]">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
