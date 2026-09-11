import { AppState, Screen } from "../../types"
import BottomNav from "../components/BottomNav"

interface Props {
  state: AppState
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const stats = [
  { label: "Conversations", getValue: (s: AppState) => s.conversations.length.toString() },
  { label: "Messages", getValue: (s: AppState) => s.conversations.reduce((a, c) => a + c.messages.length, 0).toString() },
  { label: "Days Active", getValue: () => "1" },
]

export default function ProfileScreen({ state, onNavigate, onLogout }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 400, height: 300, background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#EEF0FF" }}>Profile</h1>
        <button onClick={() => onNavigate("settings")}
          className="p-2 rounded-xl"
          style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#A855F7" strokeWidth="1.8"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke="#A855F7" strokeWidth="1.8"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28" style={{ scrollbarWidth: "none" }}>
        {/* Avatar + name */}
        <div className="flex flex-col items-center py-8">
          <div className="relative mb-4">
            <div className="rounded-3xl flex items-center justify-center"
              style={{
                width: 90, height: 90,
                background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                boxShadow: "0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(124,58,237,0.2)"
              }}>
              <span style={{ fontSize: 40 }}>🧑</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#10B981", border: "2px solid #060912" }}>
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#EEF0FF" }}>
            {state.userName}
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8892B0", marginTop: 4 }}>
            {state.phone || "+1 555 0100"}
          </p>
          <div className="mt-2 px-3 py-1 rounded-full"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600, color: "#A855F7" }}>
              VEXA Pro
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-2xl p-4 text-center"
              style={{ background: "rgba(13,18,32,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#EEF0FF" }}>
                {stat.getValue(state)}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#8892B0", marginTop: 2 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Menu items */}
        {[
          { icon: "👤", label: "Edit Profile", sub: "Update name and avatar", action: () => {} },
          { icon: "🤖", label: "AI Model", sub: `Currently: ${state.model}`, action: () => onNavigate("model-selection") },
          { icon: "🔔", label: "Notifications", sub: state.notifications ? "Enabled" : "Disabled", action: () => onNavigate("settings") },
          { icon: "🔒", label: "Privacy & Security", sub: "Manage your data", action: () => {} },
          { icon: "❓", label: "Help & Support", sub: "FAQs and contact us", action: () => {} },
          { icon: "⭐", label: "Rate VEXA", sub: "Share your feedback", action: () => {} },
        ].map((item, i) => (
          <button key={i} onClick={item.action}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl mb-2 text-left transition-all duration-150"
            style={{ background: "rgba(13,18,32,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(124,58,237,0.08)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(13,18,32,0.6)"}>
            <div className="rounded-xl flex items-center justify-center"
              style={{ width: 40, height: 40, background: "rgba(124,58,237,0.1)", fontSize: 18 }}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#EEF0FF" }}>{item.label}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8892B0" }}>{item.sub}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        ))}

        {/* Logout */}
        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl mt-2"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>Sign Out</span>
        </button>

        <p className="text-center mt-4" style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#4A5568" }}>
          VEXA v1.0.0 · Made with ♥
        </p>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}
