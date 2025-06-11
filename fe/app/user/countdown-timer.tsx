"use client"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  timeRemaining: number
  totalTime: number
  isActive: boolean
}

export default function CountdownTimer({ timeRemaining, totalTime, isActive }: CountdownTimerProps) {
  // Calculate percentage of time remaining
  const percentage = (timeRemaining / totalTime) * 100

  // Determine color based on time remaining
  const getColor = () => {
    if (percentage > 60) return "#22c55e" // Green
    if (percentage > 30) return "#f59e0b" // Amber
    return "#ef4444" // Red
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative w-16 h-16">
      {/* Background circle */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 40}`}
          strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
          transform="rotate(-90 50 50)"
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
          }}
        />

        {/* Pulse effect when time is low */}
        {percentage <= 30 && isActive && (
          <circle cx="50" cy="50" r="46" fill="transparent" stroke={getColor()} strokeWidth="2" opacity="0.5">
            <animate attributeName="r" values="46;50;46" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <Clock className={`h-4 w-4 mb-0.5 ${percentage <= 30 && isActive ? "text-red-500" : "text-slate-400"}`} />
        <span className={`text-xs font-bold ${percentage <= 30 ? "text-red-500" : "text-white"}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  )
}
