import { useState, useEffect, useRef } from "react"
import { Screen } from "../../types"

interface Props {
  phone: string
  onNext: (screen: Screen) => void
  onBack: () => void
}

export default function OTPScreen({ phone, onNext, onBack }: Props) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(30)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer <= 0) return
    const t = setInterval(() => setTimer(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError(false)
    if (value && index < 5) inputs.current[index + 1]?.focus()
    if (newOtp.every(d => d) && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleVerify = (code: string) => {
    setVerifying(true)
    setTimeout(() => {
      if (code === "123456" || code.length === 6) {
        setVerified(true)
        setTimeout(() => onNext("profile-setup"), 900)
      } else {
        setError(true)
        setVerifying(false)
        setOtp(["", "", "", "", "", ""])
        inputs.current[0]?.focus()
      }
    }, 1200)
  }

  const filled = otp.join("").length

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 300, height: 200, background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)", filter: "blur(30px)" }} />

      {/* Back button */}
      <button onClick={onBack} className="absolute left-5 top-14 z-10 p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#8892B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="flex flex-col flex-1 px-6 pt-20">
        {/* Icon */}
        <div className="mb-8 flex flex-col items-start">
          <div className="rounded-2xl flex items-center justify-center mb-6"
            style={{ width: 56, height: 56, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="2" width="14" height="20" rx="2" stroke="#A855F7" strokeWidth="1.8"/>
              <path d="M9 7h6M9 11h6M9 15h4" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="17" cy="17" r="4" fill="#7C3AED"/>
              <path d="M15.5 17l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#EEF0FF" }}>
            Verify your number
          </h1>
          <p className="mt-2" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#8892B0" }}>
            Enter the 6-digit code sent to
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#A855F7" }}>
            {phone}
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el }}
              type="text" inputMode="numeric" maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="flex-1 rounded-2xl text-center outline-none transition-all duration-200"
              style={{
                height: 58, fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 700,
                background: digit ? "rgba(124,58,237,0.12)" : "rgba(13,18,32,0.8)",
                border: error ? "1.5px solid rgba(239,68,68,0.6)" : digit ? "1.5px solid rgba(124,58,237,0.6)" : "1.5px solid rgba(124,58,237,0.2)",
                color: error ? "#EF4444" : "#EEF0FF",
                boxShadow: digit && !error ? "0 0 12px rgba(124,58,237,0.2)" : "none"
              }}
              disabled={verifying || verified}
            />
          ))}
        </div>

        {/* Status */}
        {error && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#EF4444" }}>Incorrect code. Try again.</span>
          </div>
        )}

        {verified && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl animate-fade-in"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#10B981" }}>Verified! Setting up your account...</span>
          </div>
        )}

        {/* Verify button */}
        <button onClick={() => filled === 6 && handleVerify(otp.join(""))}
          disabled={filled < 6 || verifying || verified}
          className="w-full rounded-2xl py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-3"
          style={{
            fontFamily: "var(--font-display)", fontSize: 16,
            background: filled === 6 && !verifying && !verified ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "rgba(124,58,237,0.15)",
            color: filled === 6 && !verifying && !verified ? "#fff" : "#4A5568",
            boxShadow: filled === 6 && !verifying && !verified ? "0 0 24px rgba(124,58,237,0.4)" : "none",
            cursor: filled === 6 && !verifying && !verified ? "pointer" : "not-allowed"
          }}>
          {verifying && <div className="flex gap-1"><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div>}
          {!verifying && (verified ? "Verified ✓" : "Verify Code")}
        </button>

        {/* Resend */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8892B0" }}>Didn't receive a code?</span>
          {timer > 0 ? (
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "#4A5568" }}>
              Resend in {timer}s
            </span>
          ) : (
            <button onClick={() => setTimer(30)}
              style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "#A855F7" }}>
              Resend OTP
            </button>
          )}
        </div>

        {/* Hint */}
        <p className="mt-8 text-center" style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#4A5568" }}>
          Tip: Use any 6 digits to continue
        </p>
      </div>
    </div>
  )
}
