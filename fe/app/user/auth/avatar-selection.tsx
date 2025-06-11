import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const avatars = [
  { 
    id: 1, 
    name: "Cat", 
    emoji: "🐱", 
    sound: "https://assets.mixkit.co/active_storage/sfx/2373/2373-preview.mp3"  // Cat meow
  },
  { 
    id: 2, 
    name: "Dog", 
    emoji: "🐶", 
    sound: "https://assets.mixkit.co/active_storage/sfx/2197/2197-preview.mp3"  // Dog bark
  },
  { 
    id: 3, 
    name: "Monkey", 
    emoji: "🐵", 
    sound: "https://assets.mixkit.co/active_storage/sfx/1139/1139-preview.mp3"  // Monkey sound
  },
  { 
    id: 4, 
    name: "Frog", 
    emoji: "🐸", 
    sound: "https://assets.mixkit.co/active_storage/sfx/1394/1394-preview.mp3"  // Frog croak
  }
]

interface AvatarSelectionProps {
  onSelect: (avatarId: number) => void
  onSubmit: () => void
  selectedAvatarId?: number
}

export default function AvatarSelection({ onSelect, onSubmit, selectedAvatarId }: AvatarSelectionProps) {
  const [audioElements, setAudioElements] = useState<{ [key: number]: HTMLAudioElement }>({})

  useEffect(() => {
    // Create audio elements for each avatar
    const elements: { [key: number]: HTMLAudioElement } = {}
    avatars.forEach((avatar) => {
      const audio = new Audio(avatar.sound)
      audio.preload = "auto"
      elements[avatar.id] = audio
    })
    setAudioElements(elements)

    // Cleanup function to remove audio elements
    return () => {
      Object.values(elements).forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
    }
  }, [])

  const handleAvatarClick = (avatarId: number) => {
    const audio = audioElements[avatarId]
    if (audio) {
      // Stop all other sounds first
      Object.values(audioElements).forEach((a) => {
        if (a !== audio) {
          a.pause()
          a.currentTime = 0
        }
      })
      // Play the selected avatar's sound
      audio.currentTime = 0
      audio.play().catch((error) => console.log("Audio playback failed:", error))
    }
    onSelect(avatarId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-slate-800/50 border-slate-700 shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Choose Your Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarClick(avatar.id)}
                className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                  selectedAvatarId === avatar.id
                    ? "border-amber-500 bg-amber-500/20"
                    : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                }`}
              >
                <div className="text-4xl mb-2">{avatar.emoji}</div>
                <div className="text-white">{avatar.name}</div>
              </button>
            ))}
          </div>
          <Button
            onClick={onSubmit}
            disabled={!selectedAvatarId}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
} 