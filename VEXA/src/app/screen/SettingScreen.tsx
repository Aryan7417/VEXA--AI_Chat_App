import { useState } from "react"
import { AppState, Screen } from "../types"
import BottomNav from "../components/BottomNav"

interface Props {
  state: AppState
  onNavigate: (screen: Screen) => void
  onUpdate: (updates: Partial<AppState>) => void
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative transition-all duration-300"
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(255,255,255,0.1)", boxShadow: value ? "0 0 12px rgba(124,58,237,0.4)" : "none" }}>
      <div className="absolute top-1 transition-all duration-300 rounded-full"
        style={{ width: 16, height: 16, background: "white", left: value ? 24 : 4, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </button>
  )
}

export default function SettingsScreen({ state, onNavigate, onUpdate }: Props) {
  const [notifications, setNotifications] = useState(state.notifications)
  const [streaming, setStreaming] = useState(state.streamingMessages)
  const [language, setLanguage] = useState(state.language)

  const languages = ["English", "Spanish", "French", "German", "Japanese", "Chinese", "Portuguese", "Arabic"]

  const sections = [
    {
      title: "Appearance",
      items: [
        {
          icon: "🎨", label: "Theme", sub: "Dark (recommended)",
          right: (
            <div className="flex gap-2">
              {["dark", "darker"].map(t => (
                <button key={t} onClick={() => onUpdate({ theme: t as "dark" | "darker" })}
                  className="px-3 py-1.5 rounded-xl transition-all duration-150"
                  style={{
                    background: state.theme === t ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${state.theme === t ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: state.theme === t ? "#A855F7" : "#8892B0",
                    fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 500,
                    textTransform: "capitalize"
                  }}>
                  {t}
                </button>
              ))}
            </div>
          )
        }
      ]
    },
    {
      title: "AI Preferences",
      items: [
        {
          icon: "🤖", label: "AI Model", sub: `Active: ${state.model}`,
          right: (
            <button onClick={() => onNavigate("model-selection")}
              className="px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#A855F7", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600 }}>
              Change
            </button>
          )
        },
        {
          icon: "⚡", label: "Streaming", sub: "Show AI responses as they generate",
          right: <Toggle value={streaming} onChange={v => { setStreaming(v); onUpdate({ streamingMessages: v }) }} />
        }
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          icon: "🔔", label: "Push Notifications", sub: "Receive chat updates",
          right: <Toggle value={notifications} onChange={v => { setNotifications(v); onUpdate({ notifications: v }) }} />
        },
        {
          icon: "💬", label: "Message Sounds", sub: "Play sound on new message",
          right: <Toggle value={false} onChange={() => {}} />
        }
      ]
    },
    {
      title: "Language & Region",
      items: [
        {
          icon: "🌐", label: "Language", sub: language,
          right: (
            <select value={language} onChange={e => { setLanguage(e.target.value); onUpdate({ language: e.target.value }) }}
              className="rounded-xl px-3 py-1.5 outline-none"
              style={{ background: "rgba(13,18,32,0.9)", border: "1px solid rgba(124,58,237,0.3)", color: "#A855F7", fontFamily: "var(--font-display)", fontSize: 12, cursor: "pointer" }}>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          )
        }
      ]
    },
    {
      title: "Data & Privacy",
      items: [
        { icon: "🗑️", label: "Clear Chat History", sub: "Delete all conversations", right: (
          <button className="px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600 }}>
            Clear
          </button>
        )},
        { icon: "📤", label: "Export Data", sub: "Download your conversations", right: (
          <button className="px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#A855F7", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600 }}>
            Export
          </button>
        )}
      ]
    }
  ]

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("profile")} className="p-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="#8892B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#EEF0FF" }}>Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-4" style={{ scrollbarWidth: "none" }}>
        {sections.map(section => (
          <div key={section.title} className="mb-6">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600, color: "#8892B0", letterSpacing: "0.08em", marginBottom: 10 }}>
              {section.title.toUpperCase()}
            </p>
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(13,18,32,0.7)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {section.items.map((item, i) => (
                <div key={i}
                  className="flex items-center gap-4 px-4 py-4"
                  style={{ borderBottom: i < section.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 38, height: 38, background: "rgba(124,58,237,0.08)", fontSize: 18 }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#EEF0FF" }}>{item.label}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8892B0" }}>{item.sub}</p>
                  </div>
                  {item.right}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Version info */}
        <div className="text-center py-4">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#4A5568" }}>VEXA v1.0.0 · Build 2024.001</p>
        </div>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}
