"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { fetchLevels, fetchUserProgress } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Star, Trophy, Clock, Award, Sparkles, Loader2, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import type { Level, UserProgress } from "@/lib/types"
 
export default function UserDashboard() {
  const [levels, setLevels] = useState<Level[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch levels and user progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch levels data
        const levelsData = await fetchLevels()

        // Type assertion to match the expected type
        const typedLevelsData = levelsData.map((level) => ({
          ...level,
          difficulty: level.difficulty as "easy" | "medium" | "hard",
        }))

        setLevels(typedLevelsData)

        // Fetch user progress
        const progressData = await fetchUserProgress()
        setUserProgress(progressData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Failed to load dashboard",
          description: "Please try refreshing the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Calculate stats
  const totalLevels = levels.length
  const completedLevels = userProgress.filter((p) => p.completed).length
  const totalStars = userProgress.reduce((sum, p) => sum + p.stars, 0)
  const maxPossibleStars = totalLevels * 3
  const bestScore = userProgress.length > 0 ? Math.max(...userProgress.map((p) => p.best_score)) : 0
  const totalAttempts = userProgress.reduce((sum, p) => sum + p.attempts, 0)
  const completionPercentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0
  const starPercentage = maxPossibleStars > 0 ? Math.round((totalStars / maxPossibleStars) * 100) : 0

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading your stats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Your Dashboard</h2>
            <p className="text-slate-400">Track your coding progress and achievements</p>
          </div>
          <div className="mt-4 md:mt-0 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400">
              Welcome, <span className="text-amber-400 font-medium">{user?.name || "Coder"}</span>
            </p>
          </div>
        </div>

        {/* Progress overview */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" /> Progress Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Levels Completed</span>
                <span className="font-medium">
                  {completedLevels}/{totalLevels}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2 bg-slate-700" indicatorClassName="bg-emerald-500" />
              <p className="text-xs text-slate-500 mt-1">{completionPercentage}% complete</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Stars Collected</span>
                <span className="font-medium">
                  {totalStars}/{maxPossibleStars}
                </span>
              </div>
              <Progress value={starPercentage} className="h-2 bg-slate-700" indicatorClassName="bg-amber-500" />
              <p className="text-xs text-slate-500 mt-1">{starPercentage}% of total stars</p>
            </div>
          </div>
        </Card>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-slate-800 border-slate-700 p-4 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Best Score</p>
                  <p className="text-2xl font-bold mt-1">{bestScore}%</p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-slate-800 border-slate-700 p-4 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Stars</p>
                  <p className="text-2xl font-bold mt-1">{totalStars}</p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-slate-800 border-slate-700 p-4 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Levels Completed</p>
                  <p className="text-2xl font-bold mt-1">{completedLevels}</p>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-slate-800 border-slate-700 p-4 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Attempts</p>
                  <p className="text-2xl font-bold mt-1">{totalAttempts}</p>
                </div>
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent activity */}
        <Card className="bg-slate-800 border-slate-700 p-6 mt-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" /> Recent Activity
          </h3>

          {userProgress.length > 0 ? (
            <div className="space-y-4">
              {userProgress
                .filter((p) => p.last_played)
                .sort((a, b) => {
                  const dateA = a.last_played ? new Date(a.last_played).getTime() : 0
                  const dateB = b.last_played ? new Date(b.last_played).getTime() : 0
                  return dateB - dateA
                })
                .slice(0, 5)
                .map((progress) => {
                  const level = levels.find((l) => l.id === progress.level_id)
                  if (!level || !progress.last_played) return null

                  return (
                    <div
                      key={progress.level_id}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                          {progress.completed ? (
                            <Trophy className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Sparkles className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{level.name}</p>
                          <p className="text-xs text-slate-400">
                            {progress.completed ? "Completed" : "Attempted"} •{" "}
                            {new Date(progress.last_played).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-3 text-right">
                          <p className="text-sm font-medium">{progress.best_score}%</p>
                          <p className="text-xs text-slate-400">Best Score</p>
                        </div>
                        <div className="flex">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                            i < progress.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No activity yet. Start playing to see your progress!</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
