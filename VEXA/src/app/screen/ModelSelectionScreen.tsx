import { Model, Screen } from "../../types"
import BottomNav from "../components/BottomNav"

interface Props {
  currentModel: Model
  onSelect: (model: Model) => void
  onNavigate: (screen: Screen) => void
  prevScreen: Screen | null
}

const models = [
  {
    id: "fast" as Model,
    name: "Flash",
    tagline: "Fast & Efficient",
    description: "Optimized for speed and everyday tasks. Perfect for quick questions, summaries, and casual conversation.",
    icon: "⚡",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    specs: ["~0.5s response", "Best for: Quick tasks", "Efficiency focused", "Low latency"]
  },
  {
    id: "smart" as Model,
    name: "Smart",
    tagline: "Intelligent & Thorough",
    description: "Advanced reasoning and deep analysis. Ideal for complex questions, research, writing, and creative tasks.",
    icon: "🧠",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.3)",
    specs: ["~2s response", "Best for: Deep reasoning", "High accuracy", "Nuanced responses"],
    recommended: true
  },
  {
    id: "code" as Model,
    name: "Code",
    tagline: "Developer's Companion",
    description: "Specialized for programming, debugging, code review, and technical documentation across all languages.",
    icon: "💻",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    specs: ["~1.5s response", "Best for: Coding", "All languages", "Debug & review"]
  }
]

export default function ModelSelectionScreen({ currentModel, onSelect, onNavigate, prevScreen }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 300, height: 200, background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(30px)" }} />

      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <button onClick={() => onNavigate(prevScreen || "home")} className="p-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#8892B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#EEF0FF" }}>Select AI Model</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8892B0" }}>Choose the right model for your task</p>
        </div>
      </div>

      {/* Models */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-5" style={{ scrollbarWidth: "none" }}>
        {models.map(model => {
          const isActive = currentModel === model.id
          return (
            <button key={model.id} onClick={() => { onSelect(model.id); onNavigate(prevScreen || "home") }}
              className="w-full text-left mb-4 rounded-3xl p-5 transition-all duration-200 relative overflow-hidden"
              style={{
                background: isActive ? model.bg : "rgba(13,18,32,0.7)",
                border: `1.5px solid ${isActive ? model.border : "rgba(255,255,255,0.07)"}`,
                boxShadow: isActive ? `0 0 20px ${model.color}20` : "none",
                transform: isActive ? "scale(1.01)" : "scale(1)"
              }}>

              {/* Recommended badge */}
              {model.recommended && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, color: "#A855F7", letterSpacing: "0.05em" }}>
                    RECOMMENDED
                  </span>
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-2xl flex items-center justify-center"
                  style={{ width: 50, height: 50, background: model.bg, border: `1px solid ${model.border}`, fontSize: 24 }}>
                  {model.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#EEF0FF" }}>{model.name}</h3>
                    {isActive && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: `${model.color}20`, border: `1px solid ${model.color}40` }}>
                        <div className="rounded-full animate-pulse" style={{ width: 5, height: 5, background: model.color }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: model.color, fontWeight: 600 }}>ACTIVE</span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: model.color }}>{model.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="mb-4" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8892B0", lineHeight: 1.6 }}>
                {model.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2">
                {model.specs.map(spec => (
                  <div key={spec} className="flex items-center gap-1.5">
                    <div className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: model.color }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#8892B0" }}>{spec}</span>
                  </div>
                ))}
              </div>
            </button>
          )
        })}

        {/* Note */}
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8892B0", lineHeight: 1.6 }}>
            💡 You can switch models anytime. The selected model applies to all new conversations.
          </p>
        </div>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}
