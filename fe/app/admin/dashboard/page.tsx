"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { adminService } from "@/lib/services/api"
import { DashboardStats } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Trophy, Star, Target } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await adminService.getDashboardStats()
        
        if (response.success) {
          setStats(response.data)
        } else {
          setError(response.error || "Failed to load dashboard stats")
        }
      } catch (err) {
        setError("An error occurred while loading the dashboard")
        console.error("Error loading dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-900 rounded-lg text-red-400 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error || "Failed to load dashboard"}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.userStats.total_users}</h3>
              <p className="text-sm text-blue-400 mt-1">
                +{stats.userStats.new_users_last_week} this week
              </p>
            </div>
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Completions</p>
              <h3 className="text-2xl font-bold text-white">{stats.completionStats.total_completions}</h3>
              <p className="text-sm text-amber-400 mt-1">
                {stats.completionStats.average_stars.toFixed(1)} avg stars
              </p>
            </div>
            <div className="p-2 bg-amber-900/30 rounded-lg">
              <Trophy className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Answer Accuracy</p>
              <h3 className="text-2xl font-bold text-white">{stats.answerStats.accuracy_percentage}%</h3>
              <p className="text-sm text-purple-400 mt-1">
                {stats.answerStats.correct_answers} correct answers
              </p>
            </div>
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Average Score</p>
              <h3 className="text-2xl font-bold text-white">{stats.completionStats.average_score}%</h3>
              <p className="text-sm text-emerald-400 mt-1">
                {stats.levelStats.total_levels} total levels
              </p>
            </div>
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <Star className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <h2 className="text-xl font-bold mb-6">Daily Activity</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.userStats.daily_new_users}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "#94a3b8" }}
                itemStyle={{ color: "#94a3b8" }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="New Users"
              />
              <Line
                type="monotone"
                dataKey="completions"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Completions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
