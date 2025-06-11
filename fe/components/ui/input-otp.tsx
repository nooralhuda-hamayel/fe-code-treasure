"use client"

import * as React from "react"
import { OTPInput, type SlotProps } from "input-otp"
import { cn } from "@/lib/utils"
import { Dot } from "lucide-react"

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, ...props }, ref) => (
    <OTPInput ref={ref} containerClassName={cn("flex items-center gap-2", className)} {...props} />
  ),
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<React.ElementRef<"div">, SlotProps & React.ComponentPropsWithoutRef<"div">>(
  ({ char, hasFocus, isActive, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center border-y border-r border-slate-700 text-xl transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950",
        hasFocus && "z-10 ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950",
        className,
      )}
      {...props}
    >
      {char ? (
        <div className="animate-in fade-in-50 text-white">{char}</div>
      ) : (
        <Dot className="h-4 w-4 text-slate-500" />
      )}
      {hasFocus && <div className="absolute inset-0 animate-pulse rounded-md bg-amber-500/10" />}
    </div>
  ),
)
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }
