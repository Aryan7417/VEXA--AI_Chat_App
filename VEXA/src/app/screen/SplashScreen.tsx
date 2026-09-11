import { useEffect } from "react"
import { Screen } from "../../types"

interface Props { onNext: (screen: Screen) => void }

export default function SplashScreen({ onNext }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onNext("onboarding"), 2800)
    return () => clearTimeout(t)
  }, [onNext])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #060912 0%, #0D0A1E 50%, #060912 100%)" }}>

      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 280, height: 280, background: "radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)", filter: "blur(40px)", animation: "pulse-glow 3s ease-in-out infinite" }} />
      <div className="absolute bottom-1/4 right-1/4 rounded-full pointer-events-none"
        style={{ width: 180, height: 180, background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)", filter: "blur(30px)" }} />

      {/* Logo container */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo mark */}
        <div className="relative animate-float">
          <div className="rounded-3xl flex items-center justify-center"
            style={{
              width: 90, height: 90,
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 60%, #4F46E5 100%)",
              boxShadow: "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.15)"
            }}>
            {/* V letter mark */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M8 12L24 38L40 12" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 12L24 28L32 12" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: "1px solid rgba(168,85,247,0.4)", transform: "scale(1.12)", borderRadius: 28 }} />
        </div>

        {/* Word mark */}
        <div className="text-center">
          <h1 className="text-glow" style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em", color: "#EEF0FF", lineHeight: 1 }}>
            VEXA
          </h1>
          <p className="mt-2" style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 400, color: "#8892B0", letterSpacing: "0.12em" }}>
            YOUR AI COMPANION
          </p>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-20 flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-full" style={{
              width: 6, height: 6,
              background: i === 0 ? "#7C3AED" : "rgba(124,58,237,0.3)",
              animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 11, color: "#4A5568", letterSpacing: "0.08em" }}>
          Initializing intelligence...
        </p>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    </div>
  )
}
