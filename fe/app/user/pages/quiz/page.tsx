"use client"

import AuthWrapper from "@/lib/auth-wrapper"
import Quiz from "@/app/user/quiz"

export default function QuizPage() {
  return (
    <AuthWrapper>
      <Quiz />
    </AuthWrapper>
  )
}
