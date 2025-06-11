"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FlyingCoinProps {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function FlyingCoin({ startX, startY, endX, endY }: FlyingCoinProps) {
  const [coins, setCoins] = useState<{ id: number; delay: number }[]>([])
  const coinSoundRef = useRef<HTMLAudioElement | null>(null)
  const collectSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize sounds
    coinSoundRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3") // Coin toss sound
    collectSoundRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3") // Coins collect sound
    
    // Set volume
    if (coinSoundRef.current) coinSoundRef.current.volume = 0.3
    if (collectSoundRef.current) collectSoundRef.current.volume = 0.4

    return () => {
      // Cleanup sounds
      if (coinSoundRef.current) {
        coinSoundRef.current.pause()
        coinSoundRef.current = null
      }
      if (collectSoundRef.current) {
        collectSoundRef.current.pause()
        collectSoundRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Create multiple coins with different delays
    const newCoins = []
    const coinCount = 5

    for (let i = 0; i < coinCount; i++) {
      newCoins.push({
        id: i,
        delay: i * 0.1,
      })
    }

    setCoins(newCoins)

    // Play initial coin sound
    if (coinSoundRef.current) {
      coinSoundRef.current.currentTime = 0
      coinSoundRef.current.play().catch(console.error)
    }

    // Play collect sound after coins reach destination
    const collectTimer = setTimeout(() => {
      if (collectSoundRef.current) {
        collectSoundRef.current.currentTime = 0
        collectSoundRef.current.play().catch(console.error)
      }
    }, 1000) // Adjust timing to match when coins reach destination

    // Clean up coins after animation
    const cleanupTimer = setTimeout(() => {
      setCoins([])
    }, 2000)

    return () => {
      clearTimeout(cleanupTimer)
      clearTimeout(collectTimer)
    }
  }, [startX, startY])

  // Calculate a curved path for each coin
  const getCurvedPath = (index: number) => {
    // Add some randomness to make coins fly in slightly different paths
    const randomOffsetX = Math.random() * 100 - 50
    const randomOffsetY = Math.random() * -100 - 50

    // Control point for the bezier curve
    const cpX = (startX + endX) / 2 + randomOffsetX
    const cpY = Math.min(startY, endY) - 100 + randomOffsetY

    return [
      [startX, startY],
      [cpX, cpY],
      [endX, endY],
    ]
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {coins.map((coin) => (
          <motion.div
            key={coin.id}
            initial={{
              scale: 0.5,
              opacity: 0,
              x: startX,
              y: startY,
              rotate: 0,
            }}
            animate={{
              scale: [0.5, 1, 0.8, 0.5],
              opacity: [0, 1, 1, 0],
              x: [startX, getCurvedPath(coin.id)[1][0], endX],
              y: [startY, getCurvedPath(coin.id)[1][1], endY],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              delay: coin.delay,
              ease: "easeOut",
            }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute"
            style={{
              marginLeft: -15,
              marginTop: -15,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              <defs>
                <radialGradient id={`coinGradient-${coin.id}`} cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="80%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </radialGradient>
                <filter id={`coinGlow-${coin.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Coin glow */}
              <circle cx="15" cy="15" r="12" fill="#fcd34d" opacity="0.3" filter={`url(#coinGlow-${coin.id})`} />

              {/* Coin body */}
              <circle
                cx="15"
                cy="15"
                r="10"
                fill={`url(#coinGradient-${coin.id})`}
                stroke="#d97706"
                strokeWidth="0.5"
              />

              {/* Coin details */}
              <circle cx="15" cy="15" r="7" fill="none" stroke="#fef3c7" strokeWidth="0.5" opacity="0.7" />
              <text x="15" y="18" fontSize="8" fontWeight="bold" fill="#fef3c7" textAnchor="middle">
                ★
              </text>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
