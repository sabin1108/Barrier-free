"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { signUp, requestSignupOtp } from "@/lib/auth-db"
import Link from "next/link"
import { toast } from "sonner"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ArrowLeft, RefreshCw } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"info" | "otp">("info")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

  // Timer countdown for OTP expiry
  useEffect(() => {
    if (step !== "otp") return
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [step, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const result = await requestSignupOtp(email)
      if (result.success) {
        setStep("otp")
        setTimeLeft(300) // reset timer
        toast.success("인증 코드가 전송되었습니다. 콘솔과 알림창을 확인하세요!")
        
        // If OTP is returned (in development mode), toast it for convenience
        if (result.otp) {
          toast.info(`[개발자 인증용] OTP 코드: ${result.otp}`, {
            duration: 15000,
          })
          console.log(`[TESTING OTP]: ${result.otp}`)
        }
      } else {
        setError(result.error || "인증 코드 발송에 실패했습니다.")
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setIsResending(true)
    try {
      const result = await requestSignupOtp(email)
      if (result.success) {
        setTimeLeft(300) // reset timer
        toast.success("인증 코드가 재발송되었습니다.")
        if (result.otp) {
          toast.info(`[개발자 인증용] OTP 코드: ${result.otp}`, {
            duration: 15000,
          })
        }
      } else {
        toast.error(result.error || "재발송 실패")
      }
    } catch (err) {
      toast.error("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otpCode.length !== 6) {
      setError("6자리 인증 코드를 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp(email, password, name, otpCode)
      if (result.success) {
        toast.success("회원가입이 완료되었습니다!")
        router.push("/admin")
        router.refresh()
      } else {
        setError(result.error || "인증에 실패했습니다.")
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const pageTitle = step === "info" ? "Create Account" : "Verify Account"
  const pageDescription = step === "info" 
    ? "Sign up to start managing your portfolio" 
    : "Enter the 6-digit verification code to complete sign up"

  return (
    <AuthLayout title={pageTitle} description={pageDescription}>
      {step === "info" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating OTP..." : "Proceed to Verification"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitSignup} className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Label className="text-sm font-medium">Verification Code</Label>
            <div className="flex flex-col items-center gap-2">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={(value) => setOtpCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              
              <div className="flex items-center justify-between w-full mt-2 text-xs text-muted-foreground px-1 gap-8">
                <span>
                  {timeLeft > 0 ? (
                    <span className="text-destructive font-medium">
                      Expires in: {formatTime(timeLeft)}
                    </span>
                  ) : (
                    <span className="text-destructive font-bold">Expired</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-50 font-medium cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
                  Resend Code
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setStep("info")
                setError("")
              }}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || timeLeft <= 0 || otpCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Sign Up"}
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
