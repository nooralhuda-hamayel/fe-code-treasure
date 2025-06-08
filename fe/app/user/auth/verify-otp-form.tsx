"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, KeyRound } from "lucide-react"
import { verifyOtp, requestPasswordReset } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(120) // 2 minutes countdown

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password")
    }
  }, [email, router])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await verifyOtp(email, otp)
      router.push(`/reset-password?token=${encodeURIComponent(result.resetToken)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await requestPasswordReset(email)
      setCountdown(120)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
            <KeyRound className="h-6 w-6 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">Verify Code</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">
              {countdown > 0 ? (
                <>
                  Code expires in <span className="text-amber-400">{formatTime(countdown)}</span>
                </>
              ) : (
                "Code has expired"
              )}
            </p>
            <button
              onClick={handleResendCode}
              disabled={isLoading || countdown > 0}
              className={`text-sm ${
                countdown > 0
                  ? "text-slate-500 cursor-not-allowed"
                  : "text-amber-500 hover:text-amber-400 transition-colors"
              }`}
            >
              Resend code
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/forgot-password"
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
