"use client"

import LevelsPage from "@/app/user/level/[levelId]/LevelPage"
import AuthWrapper from "@/lib/auth-wrapper"

export default function LevelPage() {
  return (
    <AuthWrapper>
      <LevelPage />
    </AuthWrapper>
  )
}
  //used for levels page 