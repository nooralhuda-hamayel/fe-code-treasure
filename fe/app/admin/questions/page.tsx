"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { adminService } from "@/lib/services/api"
import { Question, FillGapQuestion, DragDropQuestion, TypedGapQuestion, QuestionConversion, BackendQuestion } from "@/lib/types"
import { Edit, Trash2, Plus } from "lucide-react"
import AuthWrapper from "@/lib/auth-wrapper"

// Convert frontend question to backend format
const toBackendQuestion = (question: Question): Omit<BackendQuestion, 'id'> => {
  const baseQuestion = {
    level_id: question.level_id,
    description: question.text,
    position_x: 0,
    position_y: 0,
    ordering: question.order,
    hint: null,
    type: question.type,
    code_snippet: 'codeSnippet' in question ? question.codeSnippet : question.text,
    points: question.points,
    language: question.language
  };

  let options = [];
  if (question.type === 'drag-drop') {
    options = question.codeBlocks.map((block, index) => ({
      id: parseInt(question.correctOrder[index]),
      label: block,
      is_correct: true,
      ordering: index
    }));
  } else if (question.type === 'typed-gap') {
    options = [{
      id: 1,
      label: question.correctAnswer,
      is_correct: true,
      ordering: 0
    }];
  } else {
    options = question.options.map((opt, index) => ({
      id: index + 1,
      label: opt,
      is_correct: opt === question.correctAnswer,
      ordering: index
    }));
  }

  return {
    ...baseQuestion,
    options
  };
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "drag-drop" as "drag-drop" | "fill-gap" | "typed-gap",
    text: "",
    description: "",
    level_id: "",
    points: 10,
    order: 1,
    language: "javascript",
    codeBlocks: [] as string[],
    correctOrder: [] as number[],
    codeSnippet: "",
    options: [] as string[],
    correctAnswer: ""
  })

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllQuestions()
      
      if (response.success) {
        setQuestions(response.data)
      } else {
        setError(response.error || "Failed to load questions")
      }
    } catch (err) {
      setError("An error occurred while loading questions")
      console.error("Error loading questions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!editingQuestion) return;

      const baseData = {
        text: formData.text,
        description: formData.description,
        level_id: formData.level_id,
        points: formData.points,
        order: formData.order,
        language: formData.language,
        id: editingQuestion.id,
        created_at: editingQuestion.created_at,
        updated_at: editingQuestion.updated_at
      }

      let questionData: Question;
      
      if (formData.type === 'drag-drop') {
        questionData = {
          ...baseData,
          type: 'drag-drop',
          codeBlocks: formData.codeBlocks,
          correctOrder: formData.correctOrder.map(String)
        };
      } else if (formData.type === 'fill-gap') {
        questionData = {
          ...baseData,
          type: 'fill-gap',
          codeSnippet: formData.codeSnippet,
          options: formData.options,
          correctAnswer: formData.correctAnswer
        };
      } else {
        questionData = {
          ...baseData,
          type: 'typed-gap',
          codeSnippet: formData.codeSnippet,
          correctAnswer: formData.correctAnswer
        };
      }

      const response = await adminService.updateQuestion(editingQuestion.id, toBackendQuestion(questionData));
      
      if (response.success) {
        setQuestions(questions.map(question => 
          question.id === editingQuestion.id ? response.data : question
        ));
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error("Error saving question:", err)
    }
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      type: question.type,
      text: question.text,
      description: question.description,
      level_id: question.level_id,
      points: question.points,
      order: question.order,
      language: question.language,
      codeBlocks: question.type === 'drag-drop' ? question.codeBlocks : [],
      correctOrder: question.type === 'drag-drop' ? question.correctOrder.map(Number) : [],
      codeSnippet: question.type !== 'drag-drop' ? question.codeSnippet : '',
      options: question.type === 'fill-gap' ? question.options : [],
      correctAnswer: question.type !== 'drag-drop' ? question.correctAnswer : ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      const response = await adminService.deleteQuestion(questionId)
      if (response.success) {
        setQuestions(questions.filter(question => question.id !== questionId))
      }
    } catch (err) {
      console.error("Error deleting question:", err)
    }
  }

  const resetForm = () => {
    setEditingQuestion(null)
    setFormData({
      type: "drag-drop",
      text: "",
      description: "",
      level_id: "",
      points: 10,
      order: 1,
      language: "javascript",
      codeBlocks: [],
      correctOrder: [],
      codeSnippet: "",
      options: [],
      correctAnswer: ""
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
            Manage Questions
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Question Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={value => setFormData({ ...formData, type: value as "drag-drop" | "fill-gap" | "typed-gap" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drag-drop">Drag & Drop</SelectItem>
                      <SelectItem value="fill-gap">Fill in the Gap</SelectItem>
                      <SelectItem value="typed-gap">Type in the Gap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="text">Question Text</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={e => setFormData({ ...formData, text: e.target.value })}
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
                  <Label htmlFor="level_id">Level</Label>
                  <Select
                    value={formData.level_id}
                    onValueChange={value => setFormData({ ...formData, level_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Add level options */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    required
                  />
                </div>
                {formData.type === "drag-drop" && (
                  <div>
                    <Label>Code Blocks</Label>
                    {formData.codeBlocks.map((block, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={block}
                          onChange={e => {
                            const newBlocks = [...formData.codeBlocks]
                            newBlocks[index] = e.target.value
                            setFormData({ ...formData, codeBlocks: newBlocks })
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newBlocks = formData.codeBlocks.filter((_, i) => i !== index)
                            setFormData({ ...formData, codeBlocks: newBlocks })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          codeBlocks: [...formData.codeBlocks, ""]
                        })
                      }}
                    >
                      Add Code Block
                    </Button>
                  </div>
                )}
                {formData.type === "fill-gap" && (
                  <div>
                    <Label>Options</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={option}
                          onChange={e => {
                            const newOptions = [...formData.options]
                            newOptions[index] = e.target.value
                            setFormData({ ...formData, options: newOptions })
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newOptions = formData.options.filter((_, i) => i !== index)
                            setFormData({ ...formData, options: newOptions })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          options: [...formData.options, ""]
                        })
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                )}
                {(formData.type === "fill-gap" || formData.type === "typed-gap") && (
                  <div>
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Input
                      id="correctAnswer"
                      value={formData.correctAnswer}
                      onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                      required
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingQuestion ? "Update Question" : "Create Question"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map(question => (
            <Card key={question.id} className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{question.text}</h3>
                  <p className="text-sm text-slate-400">{question.description}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium bg-blue-900/20 text-blue-400`}>
                  {question.type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-slate-400">Level:</span>
                  <span className="ml-2 text-white">{question.level_id}</span>
                </div>
                <div>
                  <span className="text-slate-400">Points:</span>
                  <span className="ml-2 text-white">{question.points}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(question)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(question.id)}
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
