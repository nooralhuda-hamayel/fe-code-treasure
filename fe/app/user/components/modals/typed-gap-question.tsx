"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import type { TypedGapQuestion as TypedGapQuestionType } from "@/lib/types"

interface TypedGapQuestionProps {
  question: TypedGapQuestionType
  typedAnswer: string
  onAnswerChange: (value: string) => void
  answered: boolean
  isCorrect: boolean
}

export default function TypedGapQuestion({
  question,
  typedAnswer,
  onAnswerChange,
  answered,
  isCorrect,
}: TypedGapQuestionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Memoize the code parts to prevent unnecessary re-renders
  const parts = useMemo(() => question.code_snippet.split("___"), [question.code_snippet])

  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current && !answered) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [answered])

  // Add line numbers to code
  const renderCodeWithLineNumbers = useMemo(() => {
    const lines = question.code_snippet.split("\n")
    const gapLineIndex = lines.findIndex((line) => line.includes("___"))

    return (
      <div className="grid grid-cols-[auto,1fr] gap-2">
        <div className="text-slate-500 text-right select-none">
          {lines.map((_, i) => (
            <div key={i} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <div>
          {lines.map((line, i) => (
            <div key={i} className="h-6 leading-6">
              {line.includes("___") ? (
                <div className="flex items-center space-x-0">
                  <span>{line.split("___")[0]}</span>
                  <div className="relative inline-block">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={typedAnswer}
                      onChange={(e) => onAnswerChange(e.target.value)}
                      disabled={answered}
                      className={`w-[120px] h-6 px-2 py-0 font-mono text-sm inline-block bg-transparent border-b-2 focus:ring-0 focus:outline-none ${
                        answered
                          ? isCorrect
                            ? "border-green-500 text-green-400"
                            : "border-red-500 text-red-400"
                          : isFocused
                            ? "border-amber-500 text-amber-300"
                            : "border-slate-600 text-slate-300"
                      }`}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute top-full left-0 mt-1 px-2 py-1 rounded text-xs ${
                          isCorrect ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                        }`}
                      >
                        {isCorrect ? "Correct!" : `Expected: ${question.correct_answer}`}
                      </motion.div>
                    )}
                  </div>
                  <span>{line.split("___")[1]}</span>
                </div>
              ) : (
                line
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }, [question.code_snippet, typedAnswer, answered, isCorrect, isFocused])

  // Determine language-specific syntax highlighting classes
  const getLanguageClass = useMemo(() => {
    switch (question.language) {
      case "javascript":
        return "language-javascript"
      case "css":
        return "language-css"
      case "sql":
        return "language-sql"
      case "python":
        return "language-python"
      default:
        return "language-javascript"
    }
  }, [question.language])

  return (
    <div className="space-y-6">
      <Card
        className={`p-4 bg-slate-900 text-white font-mono text-sm overflow-x-auto rounded-lg border ${
          answered
            ? isCorrect
              ? "border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
              : "border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            : "border-slate-700 shadow-lg"
        } transition-all duration-300`}
      >
        <pre className={`whitespace-pre-wrap ${getLanguageClass}`}>{renderCodeWithLineNumbers}</pre>
      </Card>

      {answered && !isCorrect && question.hint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-slate-800 p-4 rounded-lg border border-slate-700"
        >
          <h4 className="text-amber-400 text-sm font-medium mb-2">Hint:</h4>
          <p className="text-slate-300 text-sm">{question.hint}</p>
        </motion.div>
      )}
    </div>
  )
} 