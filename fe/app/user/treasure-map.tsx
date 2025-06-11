"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface TreasureMapProps {
  currentPosition: number
  totalSteps: number
}

interface Question {
  type: 'drag-drop' | 'fill-gap' | 'typed-gap';
  // ... other properties
}

export default function TreasureMap({ currentPosition, totalSteps }: TreasureMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate path points based on total steps
  const generatePathPoints = (total: number) => {
    const points = []

    // Start point
    points.push({ x: 50, y: 380 })

    // Generate a winding path
    let prevX = 50
    let prevY = 380

    for (let i = 1; i < total; i++) {
      // Create a winding path that goes up
      const progress = i / total
      const amplitude = 100 // How much the path winds left and right
      const x = 150 + Math.sin(progress * Math.PI * 2) * amplitude
      const y = 380 - progress * 300 // Move upward

      points.push({ x, y })
      prevX = x
      prevY = y
    }

    // End point (treasure)
    points.push({ x: 150, y: 50 })

    return points
  }

  const pathPoints = generatePathPoints(totalSteps)

  // Create SVG path string from points
  const createPathString = (points: { x: number; y: number }[]) => {
    return points.reduce((path, point, i) => {
      return path + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
    }, "")
  }

  const pathString = createPathString(pathPoints)

  // Get current position coordinates
  const getCurrentPosition = () => {
    if (currentPosition >= pathPoints.length) {
      return pathPoints[pathPoints.length - 1]
    }
    return pathPoints[currentPosition]
  }

  const currentPos = getCurrentPosition()

  // Draw background effects on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 300
    canvas.height = 400

    // Draw stars
    const drawStars = () => {
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height * 0.6 // Stars only in the top 60%
        const radius = Math.random() * 1.5
        const opacity = Math.random() * 0.8 + 0.2

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        // Add twinkle effect to some stars
        if (Math.random() > 0.8) {
          ctx.beginPath()
          ctx.moveTo(x - radius * 3, y)
          ctx.lineTo(x + radius * 3, y)
          ctx.moveTo(x, y - radius * 3)
          ctx.lineTo(x, y + radius * 3)
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    // Draw clouds
    const drawClouds = () => {
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * 150 + 30
        const radius = Math.random() * 25 + 15
        const opacity = Math.random() * 0.2 + 0.1

        // Cloud body
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        // Cloud puffs
        const puffs = Math.floor(Math.random() * 3) + 2
        for (let j = 0; j < puffs; j++) {
          const puffX = x + Math.random() * radius * 1.5 - radius * 0.75
          const puffY = y + Math.random() * radius * 0.5 - radius * 0.25
          const puffRadius = radius * (Math.random() * 0.5 + 0.3)

          ctx.beginPath()
          ctx.arc(puffX, puffY, puffRadius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 1.2})`
          ctx.fill()
        }
      }
    }

    // Draw moon
    const drawMoon = () => {
      const x = canvas.width * 0.8
      const y = canvas.height * 0.15
      const radius = 25

      // Moon glow
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 2.5)
      gradient.addColorStop(0, "rgba(255, 255, 200, 0.4)")
      gradient.addColorStop(1, "rgba(255, 255, 200, 0)")

      ctx.beginPath()
      ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Moon body
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 220, 0.9)"
      ctx.fill()

      // Moon craters
      const craters = 3
      for (let i = 0; i < craters; i++) {
        const craterX = x + Math.random() * radius * 0.8 - radius * 0.4
        const craterY = y + Math.random() * radius * 0.8 - radius * 0.4
        const craterRadius = radius * (Math.random() * 0.15 + 0.05)

        ctx.beginPath()
        ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(220, 220, 200, 0.8)"
        ctx.fill()
      }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background effects
    drawMoon()
    drawStars()
    drawClouds()
  }, [])

  // Function to generate coins when monkey moves
  const generateCoins = () => {
    if (currentPosition === 0) return null

    const coins = []
    const coinCount = 3

    for (let i = 0; i < coinCount; i++) {
      const delay = i * 0.2
      const randomOffsetX = Math.random() * 40 - 20
      const randomOffsetY = Math.random() * 40 - 20

      coins.push(
        <motion.div
          key={`coin-${currentPosition}-${i}`}
          initial={{
            opacity: 0,
            scale: 0,
            x: currentPos.x + randomOffsetX,
            y: currentPos.y + randomOffsetY,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: currentPos.y + randomOffsetY - 30,
          }}
          transition={{
            duration: 1,
            delay: delay,
            ease: "easeOut",
          }}
          className="absolute"
          style={{
            zIndex: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="#fcd34d" stroke="#d97706" strokeWidth="0.5" />
            <text x="10" y="13" fontSize="8" fontWeight="bold" fill="#92400e" textAnchor="middle">
              ★
            </text>
          </svg>
        </motion.div>,
      )
    }

    return coins
  }

  return (
    <div
      className="relative w-full max-w-md h-[450px] rounded-xl overflow-hidden shadow-2xl border-4 border-amber-500/50"
      ref={mapRef}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-amber-900"></div>

      {/* Canvas for background effects */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80"></canvas>

      {/* Map background with tropical elements */}
      <div className="absolute inset-0">
        {/* Ocean */}
        <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-blue-800/30 backdrop-blur-sm"></div>

        {/* Island shape */}
        <svg
          className="absolute bottom-0 left-0 right-0 h-[300px] w-full"
          viewBox="0 0 300 300"
          preserveAspectRatio="none"
        >
          {/* Island base */}
          <defs>
            <linearGradient id="islandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <filter id="islandShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
              <feOffset dx="0" dy="5" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Island shape with irregular edges */}
          <path
            d="M0,300 L0,150 C30,140 60,160 90,150 C120,140 150,130 180,140 C210,150 240,170 270,160 C300,150 300,140 300,130 L300,300 Z"
            fill="url(#islandGradient)"
            filter="url(#islandShadow)"
          />

          {/* Beach areas */}
          <path
            d="M0,300 L0,180 C30,175 60,185 90,180 C120,175 150,170 180,175 C210,180 240,190 270,185 C300,180 300,175 300,170 L300,300 Z"
            fill="#f8d784"
            opacity="0.6"
          />
        </svg>

        {/* Palm trees */}
        <svg className="absolute bottom-[100px] left-[30px] w-[60px] h-[100px]" viewBox="0 0 60 100">
          {/* Tree trunk */}
          <path d="M30,100 C25,80 35,60 30,40 C25,60 15,80 30,100 Z" fill="#8b4513" stroke="#5d2906" strokeWidth="1" />

          {/* Palm leaves */}
          <g transform="translate(30, 40)">
            <path d="M0,0 C10,-10 30,-15 50,-5 C30,-15 10,-20 0,0 Z" fill="#2d6a4f" transform="rotate(0)" />
            <path d="M0,0 C10,-10 30,-15 50,-5 C30,-15 10,-20 0,0 Z" fill="#2d6a4f" transform="rotate(60)" />
            <path d="M0,0 C10,-10 30,-15 50,-5 C30,-15 10,-20 0,0 Z" fill="#2d6a4f" transform="rotate(120)" />
            <path d="M0,0 C10,-10 30,-15 50,-5 C30,-15 10,-20 0,0 Z" fill="#2d6a4f" transform="rotate(180)" />
            <path d="M0,0 C10,-10 30,-15 50,-5 C30,-15 10,-20 0,0 Z" fill="#2d6a4f" transform="rotate(240)" />
            <path d="M0,0 C10,-10 30,-15 50,-5 C30,-15 10,-20 0,0 Z" fill="#2d6a4f" transform="rotate(300)" />
          </g>
        </svg>

        <svg className="absolute bottom-[120px] right-[40px] w-[50px] h-[80px]" viewBox="0 0 50 80">
          {/* Tree trunk */}
          <path d="M25,80 C20,65 30,50 25,35 C20,50 15,65 25,80 Z" fill="#8b4513" stroke="#5d2906" strokeWidth="1" />

          {/* Palm leaves */}
          <g transform="translate(25, 35)">
            <path d="M0,0 C8,-8 25,-12 40,-4 C25,-12 8,-16 0,0 Z" fill="#2d6a4f" transform="rotate(0)" />
            <path d="M0,0 C8,-8 25,-12 40,-4 C25,-12 8,-16 0,0 Z" fill="#2d6a4f" transform="rotate(72)" />
            <path d="M0,0 C8,-8 25,-12 40,-4 C25,-12 8,-16 0,0 Z" fill="#2d6a4f" transform="rotate(144)" />
            <path d="M0,0 C8,-8 25,-12 40,-4 C25,-12 8,-16 0,0 Z" fill="#2d6a4f" transform="rotate(216)" />
            <path d="M0,0 C8,-8 25,-12 40,-4 C25,-12 8,-16 0,0 Z" fill="#2d6a4f" transform="rotate(288)" />
          </g>
        </svg>

        {/* Water/pond with ripple animation */}
        <svg className="absolute bottom-[140px] left-[100px] w-[80px] h-[40px]" viewBox="0 0 80 40">
          <ellipse cx="40" cy="20" rx="40" ry="20" fill="#3b82f6" opacity="0.7" />
          <ellipse cx="40" cy="20" rx="35" ry="17" fill="#60a5fa" opacity="0.5" />
          <ellipse cx="40" cy="20" rx="25" ry="12" fill="#93c5fd" opacity="0.3" />

          {/* Animated ripples */}
          <ellipse cx="40" cy="20" rx="15" ry="7" fill="none" stroke="#bfdbfe" strokeWidth="1" opacity="0.6">
            <animate attributeName="rx" values="15;20;15" dur="3s" repeatCount="indefinite" />
            <animate attributeName="ry" values="7;10;7" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
          </ellipse>

          <ellipse cx="40" cy="20" rx="8" ry="4" fill="none" stroke="#bfdbfe" strokeWidth="1" opacity="0.6">
            <animate attributeName="rx" values="8;12;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="ry" values="4;6;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </svg>

        {/* Rocks */}
        <svg className="absolute bottom-[80px] left-[180px] w-[60px] h-[30px]" viewBox="0 0 60 30">
          <path d="M10,30 L0,15 L15,0 L30,5 L45,0 L60,15 L50,30 Z" fill="#64748b" stroke="#475569" strokeWidth="1" />
          <path d="M15,30 L5,20 L15,10 L25,15 L35,10 L45,20 L35,30 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
        </svg>

        {/* Small bushes/vegetation */}
        <svg className="absolute bottom-[90px] left-[50px] w-[30px] h-[20px]" viewBox="0 0 30 20">
          <ellipse cx="15" cy="15" rx="15" ry="5" fill="#166534" />
          <ellipse cx="10" cy="12" rx="8" ry="4" fill="#15803d" />
          <ellipse cx="20" cy="10" rx="10" ry="5" fill="#16a34a" />
        </svg>

        <svg className="absolute bottom-[100px] right-[80px] w-[25px] h-[15px]" viewBox="0 0 25 15">
          <ellipse cx="12" cy="12" rx="12" ry="3" fill="#166534" />
          <ellipse cx="8" cy="9" rx="6" ry="3" fill="#15803d" />
          <ellipse cx="16" cy="8" rx="8" ry="4" fill="#16a34a" />
        </svg>
      </div>

      {/* Path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        {/* Path shadow */}
        <filter id="pathShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <path
          d={pathString}
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="5,8"
          filter="url(#pathShadow)"
        />

        {/* Main path with texture */}
        <path
          d={pathString}
          fill="none"
          stroke="#8B4513"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="5,8"
        />

        {/* Path highlights */}
        <path
          d={pathString}
          fill="none"
          stroke="#D2B48C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5,8"
          strokeDashoffset="2"
          opacity="0.6"
        />

        {/* Glowing effect for completed path */}
        {currentPosition > 0 && (
          <>
            {/* Outer glow */}
            <path
              d={createPathString(pathPoints.slice(0, currentPosition + 1))}
              fill="none"
              stroke="rgba(255, 215, 0, 0.3)"
              strokeWidth="16"
              strokeLinecap="round"
              filter="blur(8px)"
            />

            {/* Inner glow */}
            <path
              d={createPathString(pathPoints.slice(0, currentPosition + 1))}
              fill="none"
              stroke="rgba(255, 215, 0, 0.6)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="5,8"
            />

            {/* Highlight */}
            <path
              d={createPathString(pathPoints.slice(0, currentPosition + 1))}
              fill="none"
              stroke="rgba(255, 255, 200, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="5,8"
              strokeDashoffset="2"
            />
          </>
        )}

        {/* Position markers */}
        {pathPoints.map((point, index) => (
          <g key={index}>
            {/* Marker shadow */}
            <circle cx={point.x + 2} cy={point.y + 2} r={9} fill="rgba(0,0,0,0.4)" filter="blur(1px)" />

            {/* Marker base */}
            <circle
              cx={point.x}
              cy={point.y}
              r={8}
              fill={index <= currentPosition ? "#FFD700" : "#D3D3D3"}
              stroke={index <= currentPosition ? "#B8860B" : "#A9A9A9"}
              strokeWidth="1.5"
            />

            {/* Marker texture */}
            <circle
              cx={point.x}
              cy={point.y}
              r={6}
              fill="none"
              stroke={index <= currentPosition ? "#FFC125" : "#C0C0C0"}
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity="0.6"
            />

            {/* Inner circle */}
            <circle cx={point.x} cy={point.y} r={3.5} fill={index <= currentPosition ? "#FFA500" : "#FFFFFF"} />

            {/* Highlight */}
            <circle
              cx={point.x - 1}
              cy={point.y - 1}
              r={1.5}
              fill={index <= currentPosition ? "#FFFFFF" : "#F8F8F8"}
              opacity="0.8"
            />

            {/* Glow effect for current position */}
            {index === currentPosition && (
              <>
                <circle cx={point.x} cy={point.y} r={12} fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" values="10;15;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                </circle>

                <circle cx={point.x} cy={point.y} r={18} fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" values="15;22;15" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Treasure chest */}
      <div
        className="absolute"
        style={{ top: `${pathPoints[totalSteps].y - 30}px`, left: `${pathPoints[totalSteps].x - 30}px` }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <defs>
            <filter id="chestShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="2" dy="3" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="chestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>

            <linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>

            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fcd34d" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow effect when reached */}
          {currentPosition === totalSteps && (
            <circle cx="30" cy="30" r="28" fill="url(#glowGradient)" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Chest base */}
          <rect
            x="10"
            y="25"
            width="40"
            height="25"
            rx="5"
            ry="5"
            fill="url(#chestGradient)"
            stroke="#78350f"
            strokeWidth="1.5"
            filter="url(#chestShadow)"
          />

          {/* Chest details */}
          <rect
            x="12"
            y="30"
            width="36"
            height="15"
            rx="2"
            ry="2"
            fill="none"
            stroke="#78350f"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Chest lock */}
          <rect x="27" y="27" width="6" height="8" rx="1" ry="1" fill="#78350f" stroke="#78350f" strokeWidth="0.5" />

          {/* Chest lid */}
          <path
            d="M10,25 L10,15 C10,12 15,10 30,10 C45,10 50,12 50,15 L50,25"
            fill="url(#lidGradient)"
            stroke="#78350f"
            strokeWidth="1.5"
          />

          {/* Lid details */}
          <path
            d="M15,22 L15,17 C15,15 20,13 30,13 C40,13 45,15 45,17 L45,22"
            fill="none"
            stroke="#78350f"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Chest hinges */}
          <rect x="12" y="23" width="4" height="2" fill="#78350f" />
          <rect x="44" y="23" width="4" height="2" fill="#78350f" />

          {/* Gold coins (visible when reached) */}
          {currentPosition === totalSteps && (
            <>
              <circle cx="25" cy="15" r="4" fill="url(#goldGradient)" stroke="#f59e0b" strokeWidth="0.5" />
              <circle cx="32" cy="13" r="3" fill="url(#goldGradient)" stroke="#f59e0b" strokeWidth="0.5" />
              <circle cx="20" cy="18" r="3.5" fill="url(#goldGradient)" stroke="#f59e0b" strokeWidth="0.5" />
              <circle cx="28" cy="19" r="2.5" fill="url(#goldGradient)" stroke="#f59e0b" strokeWidth="0.5" />

              {/* Sparkles */}
              <path d="M22,12 L22,8 M20,10 L24,10" stroke="#fef3c7" strokeWidth="0.5" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.3s" repeatCount="indefinite" />
              </path>
              <path d="M33,9 L33,5 M31,7 L35,7" stroke="#fef3c7" strokeWidth="0.5" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.7s" repeatCount="indefinite" />
              </path>
              <path d="M18,17 L18,15 M17,16 L19,16" stroke="#fef3c7" strokeWidth="0.5" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      </div>

      {/* Monkey character */}
      <motion.div
        className="absolute w-[60px] h-[60px]"
        initial={{ x: pathPoints[0].x - 30, y: pathPoints[0].y - 30 }}
        animate={{ x: currentPos.x - 30, y: currentPos.y - 30 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <defs>
            <filter id="monkeyShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
              <feOffset dx="1" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="bodyGradient" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fcd34d" />
            </radialGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="30" cy="55" rx="15" ry="4" fill="rgba(0,0,0,0.3)" filter="blur(2px)" />

          {/* Body */}
          <circle cx="30" cy="30" r="20" fill="url(#bodyGradient)" filter="url(#monkeyShadow)" />

          {/* Face */}
          <circle cx="30" cy="28" r="12" fill="url(#faceGradient)" />

          {/* Ears */}
          <circle cx="15" cy="18" r="7" fill="url(#bodyGradient)" />
          <circle cx="45" cy="18" r="7" fill="url(#bodyGradient)" />
          <circle cx="15" cy="18" r="4" fill="#92400e" />
          <circle cx="45" cy="18" r="4" fill="#92400e" />

          {/* Eyes */}
          <g className="eyes">
            <circle cx="25" cy="24" r="3" fill="white" />
            <circle cx="35" cy="24" r="3" fill="white" />
            <circle cx="25" cy="24" r="1.5" fill="black">
              <animate attributeName="cy" values="24;23;24" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="35" cy="24" r="1.5" fill="black">
              <animate attributeName="cy" values="24;23;24" dur="3s" repeatCount="indefinite" />
            </circle>
            <ellipse cx="25" cy="22" rx="0.8" ry="0.5" fill="white" opacity="0.8" />
            <ellipse cx="35" cy="22" rx="0.8" ry="0.5" fill="white" opacity="0.8" />
          </g>

          {/* Nose */}
          <ellipse cx="30" cy="29" rx="4" ry="2.5" fill="#92400e" />
          <ellipse cx="28.5" cy="28" rx="1" ry="0.8" fill="black" opacity="0.6" />
          <ellipse cx="31.5" cy="28" rx="1" ry="0.8" fill="black" opacity="0.6" />

          {/* Mouth */}
          <path d="M26,33 Q30,36 34,33" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />

          {/* Arms */}
          <path d="M15,35 Q10,40 12,45" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <path d="M45,35 Q50,40 48,45" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />

          {/* Tail */}
          <motion.path
            d="M30,50 Q40,55 45,50"
            fill="none"
            stroke="#78350f"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ d: ["M30,50 Q40,55 45,50", "M30,50 Q40,60 45,55", "M30,50 Q40,55 45,50"] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />

          {/* Fur texture */}
          <path d="M20,15 Q25,10 30,15 Q35,10 40,15" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.5" />
          <path d="M15,25 Q20,20 15,20" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.5" />
          <path d="M45,25 Q40,20 45,20" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.5" />

          {/* Expression - changes based on position */}
          {currentPosition === totalSteps ? (
            // Happy expression when reached treasure
            <>
              <path d="M26,33 Q30,37 34,33" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M24,24 Q25,22 26,24" fill="none" stroke="black" strokeWidth="0.8" />
              <path d="M34,24 Q35,22 36,24" fill="none" stroke="black" strokeWidth="0.8" />

              {/* Happy sparkles */}
              <path d="M22,18 L22,16 M21,17 L23,17" stroke="#fef3c7" strokeWidth="0.5" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.3s" repeatCount="indefinite" />
              </path>
              <path d="M38,18 L38,16 M37,17 L39,17" stroke="#fef3c7" strokeWidth="0.5" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.7s" repeatCount="indefinite" />
              </path>
            </>
          ) : (
            // Normal expression
            <path d="M26,33 Q30,36 34,33" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </motion.div>

      {/* Coins animation when monkey moves */}
      {generateCoins()}

      {/* Start sign */}
      <div className="absolute" style={{ top: `${pathPoints[0].y - 35}px`, left: `${pathPoints[0].x - 20}px` }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <defs>
            <filter id="signShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
              <feOffset dx="1" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="signGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>

            <linearGradient id="postGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Sign post */}
          <rect x="18" y="25" width="4" height="15" fill="url(#postGradient)" filter="url(#signShadow)" />

          {/* Sign board */}
          <rect
            x="5"
            y="10"
            width="30"
            height="15"
            rx="2"
            ry="2"
            fill="url(#signGradient)"
            stroke="#d97706"
            strokeWidth="1"
            filter="url(#signShadow)"
          />

          {/* Wood grain */}
          <line x1="5" y1="15" x2="35" y2="15" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="5" y1="20" x2="35" y2="20" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="10" y1="10" x2="10" y2="25" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="20" y1="10" x2="20" y2="25" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="30" y1="10" x2="30" y2="25" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />

          {/* Text */}
          <text x="20" y="19" fontFamily="Arial" fontSize="6" fontWeight="bold" fill="#92400e" textAnchor="middle">
            START
          </text>
        </svg>
      </div>

      {/* Finish sign */}
      <div
        className="absolute"
        style={{ top: `${pathPoints[totalSteps].y - 35}px`, left: `${pathPoints[totalSteps].x - 25}px` }}
      >
        <svg width="50" height="40" viewBox="0 0 50 40">
          <defs>
            <filter id="treasureSignShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
              <feOffset dx="1" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="treasureSignGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Sign post */}
          <rect x="23" y="25" width="4" height="15" fill="url(#postGradient)" filter="url(#treasureSignShadow)" />

          {/* Sign board */}
          <rect
            x="5"
            y="10"
            width="40"
            height="15"
            rx="2"
            ry="2"
            fill="url(#treasureSignGradient)"
            stroke="#d97706"
            strokeWidth="1"
            filter="url(#treasureSignShadow)"
          />

          {/* Wood grain */}
          <line x1="5" y1="15" x2="45" y2="15" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="5" y1="20" x2="45" y2="20" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="15" y1="10" x2="15" y2="25" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="25" y1="10" x2="25" y2="25" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />
          <line x1="35" y1="10" x2="35" y2="25" stroke="#d97706" strokeWidth="0.5" opacity="0.5" />

          {/* Text */}
          <text x="25" y="19" fontFamily="Arial" fontSize="6" fontWeight="bold" fill="#92400e" textAnchor="middle">
            TREASURE
          </text>

          {/* Decorative elements */}
          <circle cx="10" cy="17.5" r="1.5" fill="#92400e" />
          <circle cx="40" cy="17.5" r="1.5" fill="#92400e" />
        </svg>
      </div>
    </div>
  )
}
