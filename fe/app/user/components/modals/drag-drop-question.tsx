"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { GripVertical, CheckCircle, XCircle } from "lucide-react"
import { motion, PanInfo } from "framer-motion"

interface DragDropQuestionProps {
  question: {
    codeBlocks: string[]
    correctOrder: number[]
    language: string
  }
  currentOrder: number[]
  onReorder: (newOrder: number[]) => void
  answered: boolean
  isCorrect: boolean
}

export default function DragDropQuestion({
  question,
  currentOrder,
  onReorder,
  answered,
  isCorrect,
}: DragDropQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [dragOverItem, setDragOverItem] = useState<number | null>(null)

  const handleDragStart = (_: any, info: PanInfo, index: number) => {
    setDraggedItem(index)
  }

  const handleDragEnd = (_: any, info: PanInfo, index: number) => {
    if (draggedItem !== null && dragOverItem !== null) {
      const newOrder = [...currentOrder]
      const draggedValue = newOrder[draggedItem]
      
      newOrder.splice(draggedItem, 1)
      newOrder.splice(dragOverItem, 0, draggedValue)
      
      onReorder(newOrder)
    }
    
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDrag = (_: any, info: PanInfo, index: number) => {
    const elements = document.elementsFromPoint(info.point.x, info.point.y)
    const droppableElement = elements.find(el => 
      el.getAttribute('data-droppable-id') !== null
    ) as HTMLElement | undefined

    if (droppableElement) {
      const newDropIndex = parseInt(droppableElement.getAttribute('data-droppable-id') || '0')
      setDragOverItem(newDropIndex)
    }
  }

  // Determine language-specific syntax highlighting classes
  const getLanguageClass = () => {
    switch (question.language) {
      case "jsx":
        return "language-jsx"
      case "python":
        return "language-python"
      default:
        return "language-javascript"
    }
  }

  return (
    <div className="space-y-6">
      <Card
        className={`p-4 bg-slate-900 text-white overflow-hidden rounded-lg border ${
          answered
            ? isCorrect
              ? "border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
              : "border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            : "border-slate-700 shadow-lg"
        } transition-all duration-300`}
      >
        <div className="space-y-1">
          {currentOrder.map((blockIndex, index) => (
            <motion.div
              key={index}
              data-droppable-id={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex items-start space-x-2 p-3 rounded-md ${
                answered
                  ? blockIndex === question.correctOrder[index]
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                  : dragOverItem === index
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : "bg-slate-800 border border-slate-700 hover:bg-slate-700/70"
              } transition-colors`}
              drag={!answered}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragStart={(e, info) => handleDragStart(e, info, index)}
              onDrag={(e, info) => handleDrag(e, info, index)}
              onDragEnd={(e, info) => handleDragEnd(e, info, index)}
            >
              <div className="flex items-center h-full pt-1">
                {!answered && (
                  <div
                    className={`flex items-center justify-center h-6 w-6 rounded-full ${
                      dragOverItem === index
                        ? "bg-amber-500/50 text-amber-200"
                        : "bg-slate-700/50 text-slate-400 cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </div>
                )}
                {answered && (
                  <div
                    className={`h-6 w-6 flex items-center justify-center rounded-full ${
                      blockIndex === question.correctOrder[index]
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {blockIndex === question.correctOrder[index] ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>
              <div className={`font-mono text-sm whitespace-pre overflow-x-auto flex-1 pt-1 ${getLanguageClass()}`}>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <div className="text-slate-500 text-right select-none">{index + 1}</div>
                  <div>{question.codeBlocks[blockIndex]}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {answered && !isCorrect && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-4 bg-slate-800 text-white mt-4 border border-slate-700 rounded-lg">
            <h4 className="text-sm font-medium mb-3 text-amber-400 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> Correct Order:
            </h4>
            <div className="space-y-1 bg-slate-900 p-3 rounded-md border border-slate-700">
              {question.correctOrder.map((blockIndex, index) => (
                <div key={index} className="p-2 rounded bg-green-500/5 border border-green-500/10">
                  <div className="grid grid-cols-[auto,1fr] gap-2">
                    <div className="text-slate-500 text-right select-none">{index + 1}</div>
                    <pre className="font-mono text-sm whitespace-pre overflow-x-auto text-slate-300">
                      <code>{question.codeBlocks[blockIndex]}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {!answered && (
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 mt-4">
          <p className="text-amber-300 text-sm flex items-center">
            <GripVertical className="h-4 w-4 mr-2" />
            <span>Drag and drop the code blocks to arrange them in the correct order.</span>
          </p>
        </div>
      )}
    </div>
  )
}
