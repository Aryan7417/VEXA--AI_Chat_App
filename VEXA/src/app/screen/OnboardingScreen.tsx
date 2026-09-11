import { useState } from "react"
import { Screen } from "../../types"

interface Props { onNext: (screen: Screen) => void }

const slides = [
  {
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect width="56" height="56" rx="16" fill="rgba(124,58,237,0.15)"/>
        <path d="M14 36L28 14L42 36" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="28" cy="38" r="2.5" fill="#A855F7"/>
        <path d="M20 28h16" stroke="rgba(168,85,247,0.4)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    tag: "AI CHAT",
    title: "Talk to VEXA,\nanytime.",
    description: "Engage in natural conversations with an AI that understands context, nuance, and your unique needs — available 24/7.",
    accent: "#7C3AED"
  },
  {
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect width="56" height="56" rx="16" fill="rgba(99,102,241,0.15)"/>
        <path d="M14 28c0-7.73 6.27-14 14-14s14 6.27 14 14-6.27 14-14 14" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M28 20v8l5 5" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 38l-4 4" stroke="rgba(129,140,248,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="14" cy="42" r="2" fill="#818CF8"/>
      </svg>
    ),
    tag: "LEARNING",
    title: "Learn & grow\nwith AI.",
    description: "Whether it's a new language, a complex concept, or creative writing — VEXA adapts to your learning style and pace.",
    accent: "#6366F1"
  },
  {
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect width="56" height="56" rx="16" fill="rgba(168,85,247,0.12)"/>
        <rect x="14" y="18" width="28" height="20" rx="3" stroke="#C084FC" strokeWidth="2.2" fill="none"/>
        <path d="M21 26l4 4-4 4" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M29 34h6" stroke="rgba(192,132,252,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="36" cy="16" r="5" fill="#7C3AED"/>
        <path d="M34 16l1.5 1.5L38 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "CODE & CREATE",
    title: "Code, create,\nimagine.",
    description: "Debug code, generate scripts, write stories, brainstorm ideas — VEXA is your creative co-pilot for every project.",
    accent: "#A855F7"
  }
]

export default function OnboardingScreen({ onNext }: Props) {
  const [current, setCurrent] = useState(0)

  const handleNext = () => {
    if (current < slides.length - 1) setCurrent(current + 1)
    else onNext("login")
  }

  const slide = slides[current]

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: "#060912" }}>

      {/* Skip */}
      <div className="flex justify-end px-6 pt-16">
        <button onClick={() => onNext("login")}
          style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "#8892B0" }}>
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8" key={current}
        style={{ animation: "fadeIn 0.4s ease forwards" }}>

        {/* Illustration area */}
        <div className="relative mb-10">
          <div className="rounded-3xl flex items-center justify-center"
            style={{
              width: 140, height: 140,
              background: `radial-gradient(ellipse at 30% 30%, rgba(124,58,237,0.2) 0%, rgba(6,9,18,0.8) 100%)`,
              border: "1px solid rgba(124,58,237,0.2)",
              boxShadow: `0 0 40px rgba(124,58,237,0.15)`
            }}>
            <div style={{ transform: "scale(1.5)" }}>{slide.icon}</div>
          </div>
          {/* Floating dots */}
          <div className="absolute -top-2 -right-2 rounded-full animate-float"
            style={{ width: 10, height: 10, background: slide.accent, opacity: 0.7, boxShadow: `0 0 12px ${slide.accent}` }} />
          <div className="absolute -bottom-3 -left-3 rounded-full animate-float"
            style={{ width: 6, height: 6, background: "#6366F1", opacity: 0.5, animationDelay: "0.5s" }} />
        </div>

        {/* Tag */}
        <div className="mb-3 px-3 py-1 rounded-full"
          style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 600, color: "#A855F7", letterSpacing: "0.1em" }}>
            {slide.tag}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-center mb-4" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "#EEF0FF", lineHeight: 1.2, whiteSpace: "pre-line" }}>
          {slide.title}
        </h2>

        {/* Description */}
        <p className="text-center" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#8892B0", lineHeight: 1.7, maxWidth: 280 }}>
          {slide.description}
        </p>
      </div>

      {/* Dots + CTA */}
      <div className="px-6 pb-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 6, height: 6,
                background: i === current ? "#7C3AED" : "rgba(124,58,237,0.25)"
              }} />
          ))}
        </div>

        <button onClick={handleNext}
          className="w-full rounded-2xl py-4 font-semibold transition-all duration-200 active:scale-98"
          style={{
            fontFamily: "var(--font-display)", fontSize: 16,
            background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
            color: "#fff",
            boxShadow: "0 0 24px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4)"
          }}>
          {current < slides.length - 1 ? "Continue" : "Get Started"}
        </button>
      </div>
    </div>
  )
}
