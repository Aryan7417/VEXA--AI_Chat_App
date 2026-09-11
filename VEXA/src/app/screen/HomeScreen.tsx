import { useState } from "react"
import { AppState, Screen, Conversation, Model } from "../../types"
import BottomNav from "../components/BottomNav"

interface Props {
  state: AppState
  onNavigate: (screen: Screen) => void
  onNewChat: (message: string, model: Model) => void
}

const suggestions = [
  { emoji: "💡", text: "Explain quantum computing simply", color: "#7C3AED" },
  { emoji: "🐍", text: "Write a Python web scraper", color: "#6366F1" },
  { emoji: "✍️", text: "Write a product launch email", color: "#A855F7" },
  { emoji: "🎯", text: "Help plan my weekly goals", color: "#8B5CF6" },
]

const modelBadges: Record<Model, { label: string; color: string; icon: string }> = {
  fast: { label: "Flash", color: "#F59E0B", icon: "⚡" },
  smart: { label: "Smart", color: "#A855F7", icon: "🧠" },
  code: { label: "Code", color: "#10B981", icon: "💻" }
}

export default function HomeScreen({ state, onNavigate, onNewChat }: Props) {
  const [message, setMessage] = useState("")
  const [showAttach, setShowAttach] = useState(false)

  const modelInfo = modelBadges[state.model]

  const handleSend = () => {
    if (!message.trim()) return
    onNewChat(message.trim(), state.model)
    setMessage("")
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      {/* Header */}
      <div className="px-5 pt-16 pb-4 flex items-center justify-between">
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "#8892B0", fontWeight: 400 }}>
            {greeting}, {state.userName} 👋
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#EEF0FF" }}>
            How can I help you?
          </h1>
        </div>
        <button onClick={() => onNavigate("profile")}
          className="rounded-2xl flex items-center justify-center"
          style={{ width: 40, height: 40, background: "linear-gradient(135deg, #7C3AED, #6366F1)", boxShadow: "0 0 14px rgba(124,58,237,0.4)" }}>
          <span style={{ fontSize: 18 }}>🧑</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28" style={{ scrollbarWidth: "none" }}>
        {/* VEXA greeting card */}
        <div className="rounded-3xl p-5 mb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(99,102,241,0.1) 100%)",
            border: "1px solid rgba(124,58,237,0.25)"
          }}>
          <div className="absolute -right-6 -top-6 rounded-full opacity-30"
            style={{ width: 100, height: 100, background: "radial-gradient(ellipse, #7C3AED, transparent)", filter: "blur(20px)" }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl flex items-center justify-center"
              style={{ width: 36, height: 36, background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M8 12L24 38L40 12" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "#EEF0FF" }}>VEXA</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A855F7" }}>● Online</div>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#CBD5E1", lineHeight: 1.6 }}>
            Hello, {state.userName}! I'm VEXA, your AI companion. Ask me anything — from coding help to creative writing, I'm here to assist.
          </p>
        </div>

        {/* Model selector */}
        <div className="flex items-center gap-2 mb-5">
          <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "#8892B0", fontWeight: 500 }}>Model:</span>
          <button onClick={() => onNavigate("model-selection")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
            <span style={{ fontSize: 12 }}>{modelInfo.icon}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: modelInfo.color }}>{modelInfo.label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#8892B0" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Suggestions */}
        <div className="mb-4">
          <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#8892B0", letterSpacing: "0.06em", marginBottom: 12 }}>
            SUGGESTIONS
          </p>
          <div className="grid grid-cols-2 gap-3">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => { setMessage(s.text) }}
                className="p-3.5 rounded-2xl text-left transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(13,18,32,0.8)", border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
                }}
                onMouseOver={e => e.currentTarget.style.border = `1px solid ${s.color}40`}
                onMouseOut={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"}>
                <span style={{ fontSize: 20 }}>{s.emoji}</span>
                <p className="mt-2" style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 500, color: "#CBD5E1", lineHeight: 1.4 }}>
                  {s.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent chats */}
        {state.conversations.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#8892B0", letterSpacing: "0.06em", marginBottom: 12 }}>
              RECENT
            </p>
            {state.conversations.slice(0, 3).map(conv => (
              <button key={conv.id} onClick={() => onNavigate("chat")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl mb-2 text-left transition-all duration-150"
                style={{ background: "rgba(13,18,32,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(124,58,237,0.08)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(13,18,32,0.6)"}>
                <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 36, height: 36, background: "rgba(124,58,237,0.15)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="#A855F7" strokeWidth="1.8" fill="none"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "#EEF0FF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.title}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8892B0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.preview}
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat composer */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-24"
        style={{ background: "linear-gradient(to top, #060912 60%, transparent 100%)" }}>
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-3xl overflow-hidden"
            style={{ background: "rgba(13,18,32,0.9)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Ask VEXA anything..."
              rows={1}
              className="w-full px-4 pt-3.5 pb-2 outline-none resize-none bg-transparent"
              style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#EEF0FF", maxHeight: 100 }} />
            <div className="flex items-center gap-2 px-3 pb-2.5">
              <button onClick={() => setShowAttach(!showAttach)}
                className="p-1.5 rounded-xl transition-colors duration-150"
                style={{ color: "#8892B0" }}
                onMouseOver={e => e.currentTarget.style.color = "#A855F7"}
                onMouseOut={e => e.currentTarget.style.color = "#8892B0"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
              <button className="p-1.5 rounded-xl transition-colors duration-150"
                style={{ color: "#8892B0" }}
                onMouseOver={e => e.currentTarget.style.color = "#A855F7"}
                onMouseOut={e => e.currentTarget.style.color = "#8892B0"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="1.8"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          <button onClick={handleSend}
            className="rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
            style={{
              width: 48, height: 48,
              background: message ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(124,58,237,0.2)",
              boxShadow: message ? "0 0 20px rgba(124,58,237,0.5)" : "none"
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}
