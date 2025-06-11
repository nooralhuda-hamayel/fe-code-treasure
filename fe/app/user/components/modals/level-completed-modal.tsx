"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Level } from "@/lib/types"
import { motion } from "framer-motion"
import { Star, Clock, Home, ArrowRight, Trophy, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import Confetti from "@/app/user/confetti"

interface LevelCompletedModalProps {
  isOpen: boolean
  onClose: () => void
  level: Level
  stars: number
  time: number
  score: number
  onNextLevel: () => void
}

export default function LevelCompletedModal({
  isOpen,
  onClose,
  level,
  stars,
  time,
  score,
  onNextLevel,
}: LevelCompletedModalProps) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Show confetti effect
      setShowConfetti(true)

      // Trigger animations after modal opens
      const timer = setTimeout(() => {
        setAnimateIn(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setShowConfetti(false)
      setAnimateIn(false)
    }
  }, [isOpen])

  // Clear confetti after a few seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const handleGoHome = () => {
    onClose()
    router.push("/levels")
  }

  const getScoreColor = () => {
    if (score >= 90) return "text-emerald-500"
    if (score >= 70) return "text-amber-500"
    if (score >= 50) return "text-yellow-500"
    return "text-rose-500"
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center flex flex-col items-center">
              <Trophy className="h-8 w-8 text-amber-400 mb-2" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                Level {level.id} Completed!
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="my-4">
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl text-white font-medium">{level.name}</h3>
              <p className="text-slate-400">{level.description}</p>
            </motion.div>

            <div className="flex justify-center my-6">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={animateIn ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.2 }}
                  className="mx-2"
                >
                  <Star className={`h-12 w-12 ${index < stars ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                className="bg-slate-800 p-4 rounded-lg text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={animateIn ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Completion Time</div>
                <div className="text-lg font-bold">{time}s</div>
              </motion.div>

              <motion.div
                className="bg-slate-800 p-4 rounded-lg text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={animateIn ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <Sparkles className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Your Score</div>
                <div className={`text-lg font-bold ${getScoreColor()}`}>{score}%</div>
              </motion.div>
            </div>

            <motion.div
              className="bg-slate-800/50 rounded-lg p-4 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={animateIn ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 1 }}
            >
              <p className="text-slate-300">
                {stars >= 3
                  ? "Perfect! You've mastered this level!"
                  : stars >= 2
                    ? "Great job! Can you get all 3 stars?"
                    : "Good work! Try again to improve your score."}
              </p>
            </motion.div>
          </div>

          <DialogFooter className="flex gap-3 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" /> Levels Menu
            </Button>
            <Button
              onClick={onNextLevel}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 flex items-center justify-center gap-2"
            >
              Next Level <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 