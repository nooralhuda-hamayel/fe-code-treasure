"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export default function Confetti() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const duration = 8 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    // Create a more elaborate confetti celebration
    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Confetti from the sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF8C00", "#FF4500"],
      })

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF8C00", "#FF4500"],
      })

      // Occasional center burst
      if (Math.random() > 0.9) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
          colors: ["#FFD700", "#FFA500", "#FF8C00", "#FF4500"],
          ticks: 200,
          gravity: 1.2,
          scalar: 1.2,
          shapes: ["circle", "square"],
        })
      }
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return null
}
