"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Level, UserProgress } from "@/lib/types"
import { motion } from "framer-motion"
import { Star, Clock, Award, Play, Trophy, BarChart3 } from "lucide-react"

interface LevelStartModalProps {
  level: Level
  isOpen: boolean
  onClose: () => void
  onStart: () => void
  userProgress: UserProgress | undefined
}

export default function LevelStartModal({ level, isOpen, onClose, onStart, userProgress }: LevelStartModalProps) {
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Trigger animations after modal opens
      const timer = setTimeout(() => {
        setAnimateIn(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimateIn(false)
    }
  }, [isOpen])

  // Get difficulty level text and color
  const getDifficultyColor = () => {
    switch (level.difficulty) {
      case "easy":
        return "text-emerald-500"
      case "medium":
        return "text-amber-500"
      case "hard":
        return "text-rose-500"
      default:
        return "text-slate-500"
    }
  }

  const getStarsDisplay = () => {
    if (!userProgress || !userProgress.completed) return null

    return (
      <div className="flex items-center justify-center mt-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -30 }}
            animate={animateIn ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
          >
            <Star
              className={`h-10 w-10 mx-1 ${
                index < userProgress.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"
              }`}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
            {level.name}
          </DialogTitle>
        </DialogHeader>

        <div className="my-4">
          <div className="text-center mb-6">
            <div
              className={`inline-block ${getDifficultyColor()} text-sm font-medium px-3 py-1 rounded-full border border-current mb-4`}
            >
              {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)} Difficulty
            </div>
            <p className="text-slate-300">{level.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              className="bg-slate-800 p-3 rounded-lg text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={animateIn ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-sm text-slate-400">Time Limit</div>
              <div className="text-lg font-bold">{level.time_limit}s</div>
            </motion.div>

            <motion.div
              className="bg-slate-800 p-3 rounded-lg text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={animateIn ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Award className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-sm text-slate-400">Questions</div>
              <div className="text-lg font-bold">{level.questions_count}</div>
            </motion.div>

            <motion.div
              className="bg-slate-800 p-3 rounded-lg text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={animateIn ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <BarChart3 className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-sm text-slate-400">To Pass</div>
              <div className="text-lg font-bold">{level.required_score}%</div>
            </motion.div>
          </div>

          {userProgress?.completed && (
            <motion.div
              className="bg-slate-800/50 rounded-lg p-4 mb-6"
              initial={{ opacity: 0 }}
              animate={animateIn ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-center text-amber-400 font-bold mb-3 flex items-center justify-center">
                <Trophy className="h-4 w-4 mr-2" /> Your Best Results
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-slate-400 text-sm">Best Time</div>
                  <div className="text-white font-bold">
                    {userProgress.best_time ? `${userProgress.best_time}s` : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Best Score</div>
                  <div className="text-white font-bold">{userProgress.best_score}%</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Attempts</div>
                  <div className="text-white font-bold">{userProgress.attempts}</div>
                </div>
              </div>
            </motion.div>
          )}

          {getStarsDisplay()}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onStart}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 flex items-center justify-center gap-2"
          >
            {userProgress?.completed ? (
              <>
                <Play className="h-4 w-4" /> Replay Level
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Start Level
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 