"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { adminService } from "@/lib/services/admin.service"
import { Level } from "@/lib/types"
import { Edit, Trash2, Plus } from "lucide-react"
import AuthWrapper from "@/lib/auth-wrapper"

type LevelFormData = Omit<Level, 'id'>

const defaultFormData: LevelFormData = {
  name: "",
  description: "",
  difficulty: "easy",
  order: 1,
  time_limit: 300,
  questions_count: 5,
  required_score: 70,
  map_image: null,
  reward_coins: 100
}

export default function AdminLevels() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingLevel, setEditingLevel] = useState<Level | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<LevelFormData>(defaultFormData)

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllLevels()
      
      if (response.success && response.data) {
        setLevels(response.data)
      } else {
        setError(response.error || "Failed to load levels")
      }
    } catch (err) {
      setError("An error occurred while loading levels")
      console.error("Error loading levels:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingLevel) {
        const response = await adminService.updateLevel(editingLevel.id, formData)
        if (response.success && response.data) {
          const updatedLevel = response.data as Level
          setLevels((prevLevels: Level[]): Level[] => 
            prevLevels.map((level: Level): Level => 
              level.id === editingLevel.id ? updatedLevel : level
            )
          )
        }
      } else {
        const response = await adminService.createLevel(formData)
        if (response.success && response.data) {
          const newLevel = response.data as Level
          setLevels((prevLevels: Level[]): Level[] => [...prevLevels, newLevel])
        }
      }
      
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error saving level:", err)
    }
  }

  const handleEdit = (level: Level) => {
    setEditingLevel(level)
    setFormData({
      name: level.name,
      description: level.description,
      difficulty: level.difficulty,
      order: level.order,
      time_limit: level.time_limit,
      questions_count: level.questions_count,
      required_score: level.required_score,
      map_image: level.map_image,
      reward_coins: level.reward_coins
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (levelId: string) => {
    if (!confirm("Are you sure you want to delete this level?")) return

    try {
      const response = await adminService.deleteLevel(levelId)
      if (response.success) {
        setLevels(prevLevels => prevLevels.filter(level => level.id !== levelId))
      }
    } catch (err) {
      console.error("Error deleting level:", err)
    }
  }

  const resetForm = () => {
    setEditingLevel(null)
    setFormData({
      ...defaultFormData,
      order: levels.length + 1
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-900 rounded-lg text-red-400 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <AuthWrapper requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
            Manage Levels
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Level
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLevel ? "Edit Level" : "Add New Level"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Level Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={value => setFormData({ ...formData, difficulty: value as "easy" | "medium" | "hard" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                    <Input
                      id="time_limit"
                      type="number"
                      value={formData.time_limit}
                      onChange={e => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalQuestions">Total Questions</Label>
                    <Input
                      id="questions_count"
                      type="number"
                      value={formData.questions_count}
                      onChange={e => setFormData({ ...formData, questions_count: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="requiredScore">Required Score (%)</Label>
                    <Input
                      id="required_score"
                      type="number"
                      value={formData.required_score}
                      onChange={e => setFormData({ ...formData, required_score: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="map_image">Map Image URL</Label>
                    <Input
                      id="map_image"
                      type="text"
                      value={formData.map_image || ""}
                      onChange={e => setFormData({ ...formData, map_image: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward_coins">Reward Coins</Label>
                    <Input
                      id="reward_coins"
                      type="number"
                      value={formData.reward_coins}
                      onChange={e => setFormData({ ...formData, reward_coins: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLevel ? "Update Level" : "Create Level"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map(level => (
            <Card key={level.id} className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{level.name}</h3>
                  <p className="text-sm text-slate-400">{level.description}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  level.difficulty === "easy" ? "bg-emerald-900/20 text-emerald-400" :
                  level.difficulty === "medium" ? "bg-amber-900/20 text-amber-400" :
                  "bg-red-900/20 text-red-400"
                }`}>
                  {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-slate-400">Order:</span>
                  <span className="ml-2 text-white">{level.order}</span>
                </div>
                <div>
                  <span className="text-slate-400">Time Limit:</span>
                  <span className="ml-2 text-white">{level.time_limit}s</span>
                </div>
                <div>
                  <span className="text-slate-400">Questions:</span>
                  <span className="ml-2 text-white">{level.questions_count}</span>
                </div>
                <div>
                  <span className="text-slate-400">Required:</span>
                  <span className="ml-2 text-white">{level.required_score}%</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(level)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(level.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AuthWrapper>
  )
}
