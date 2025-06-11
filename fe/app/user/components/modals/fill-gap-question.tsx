"use client"

import { useMemo } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { FillGapQuestion as FillGapQuestionType } from "@/lib/types"

interface FillGapQuestionProps {
  question: FillGapQuestionType
  selectedOption: string
  onOptionSelect: (option: string) => void
  answered: boolean
  isCorrect: boolean
}

export default function FillGapQuestion({
  question,
  selectedOption,
  onOptionSelect,
  answered,
  isCorrect,
}: FillGapQuestionProps) {
  // Memoize the code parts to prevent unnecessary re-renders
  const parts = useMemo(() => question.code_snippet.split("___"), [question.code_snippet])

  // Add line numbers to code with memoization
  const codeWithLineNumbers = useMemo(() => {
    const lines = (parts[0] + (selectedOption || "___") + parts[1]).split("\n")

    return lines.map((line, index) => (
      <div key={index} className="flex">
        <div className="w-8 text-right pr-2 text-slate-500 select-none">{index + 1}</div>
        <div className="flex-1">
          {index === 0 && parts[0].split("\n").length - 1 === 0 ? (
            <>
              {parts[0].split("\n")[0]}
              <span
                className={`px-1 py-0.5 rounded ${
                  answered
                    ? isCorrect
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {selectedOption || "___"}
              </span>
              {parts[1].split("\n")[0]}
            </>
          ) : line.includes("___") ? (
            <>
              {line.split("___")[0]}
              <span
                className={`px-1 py-0.5 rounded ${
                  answered
                    ? isCorrect
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {selectedOption || "___"}
              </span>
              {line.split("___")[1]}
            </>
          ) : (
            line
          )}
        </div>
      </div>
    ))
  }, [parts, selectedOption, answered, isCorrect])

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-slate-900 text-white font-mono text-sm overflow-x-auto rounded-lg border border-slate-700 shadow-lg">
        <pre className="whitespace-pre-wrap">{codeWithLineNumbers}</pre>
      </Card>

      <div className="mt-4">
        <RadioGroup value={selectedOption} onValueChange={onOptionSelect} className="space-y-3">
          {question.options.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-all ${
                answered
                  ? option === question.correct_answer
                    ? "border-green-500/50 bg-green-500/10"
                    : option === selectedOption && option !== question.correct_answer
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-slate-700 bg-slate-800/50"
                  : "border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600"
              }`}
            >
              <RadioGroupItem value={option} id={option} disabled={answered} className="text-amber-500" />
              <Label htmlFor={option} className="flex-1 cursor-pointer font-mono text-slate-300">
                {option}
              </Label>
              {answered && option === question.correct_answer && <CheckCircle className="h-5 w-5 text-green-500" />}
              {answered && option === selectedOption && option !== question.correct_answer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </motion.div>
          ))}
        </RadioGroup>
      </div>

      {answered && !isCorrect && question.hint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/50 p-4 rounded-lg border border-slate-700"
        >
          <h4 className="text-amber-400 text-sm font-medium mb-2">Hint:</h4>
          <p className="text-slate-300 text-sm">{question.hint}</p>
        </motion.div>
      )}
    </div>
  )
} 