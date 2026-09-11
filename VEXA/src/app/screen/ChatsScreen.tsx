import { useState } from "react"
import { AppState, Conversation, Screen } from "../../types"
import BottomNav from "../components/BottomNav"

interface Props {
  state: AppState
  onNavigate: (screen: Screen) => void
  onOpenChat: (convId: string) => void
  onDeleteChat: (convId: string) => void
  onRenameChat: (convId: string, name: string) => void
}

export default function ChatsScreen({ state, onNavigate, onOpenChat, onDeleteChat, onRenameChat }: Props) {
  const [search, setSearch] = useState("")
  const [menuId, setMenuId] = useState<string | null>(null)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  const filtered = state.conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.preview.toLowerCase().includes(search.toLowerCase())
  )

  const modelColors: Record<string, string> = { fast: "#F59E0B", smart: "#A855F7", code: "#10B981" }
  const modelIcons: Record<string, string> = { fast: "⚡", smart: "🧠", code: "💻" }

  const formatDate = (d: Date) => {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return "just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4"
        style={{ background: "rgba(6,9,18,0.95)", borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#EEF0FF" }}>
            Conversations
          </h1>
          <button onClick={() => onNavigate("home")}
            className="rounded-xl flex items-center gap-1.5 px-3 py-2"
            style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 0 14px rgba(124,58,237,0.4)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "white" }}>New</span>
          </button>
        </div>
        {/* Search bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#4A5568" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl outline-none"
            style={{ background: "rgba(13,18,32,0.8)", border: "1px solid rgba(124,58,237,0.2)", color: "#EEF0FF", fontFamily: "var(--font-body)", fontSize: 14 }} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="#4A5568" strokeWidth="1.5"/>
            </svg>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#4A5568" }}>
              {search ? "No results found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          <div className="px-4 pt-3">
            {filtered.map(conv => (
              <div key={conv.id} className="relative">
                <button onClick={() => { setMenuId(null); onOpenChat(conv.id); onNavigate("chat") }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl mb-2 text-left transition-all duration-150"
                  style={{ background: "rgba(13,18,32,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(124,58,237,0.08)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(13,18,32,0.6)"}>

                  {/* Icon */}
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 42, height: 42, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <span style={{ fontSize: 18 }}>{modelIcons[conv.model]}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#EEF0FF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {conv.title}
                      </p>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#4A5568", flexShrink: 0, marginLeft: 8 }}>
                        {formatDate(conv.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded-md" style={{ background: `${modelColors[conv.model]}18`, color: modelColors[conv.model], fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}>
                        {conv.model}
                      </span>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8892B0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {conv.preview}
                      </p>
                    </div>
                  </div>

                  {/* Menu btn */}
                  <button onClick={e => { e.stopPropagation(); setMenuId(menuId === conv.id ? null : conv.id) }}
                    className="p-1 rounded-lg flex-shrink-0"
                    style={{ color: "#4A5568" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                    </svg>
                  </button>
                </button>

                {/* Context menu */}
                {menuId === conv.id && (
                  <div className="absolute right-2 top-14 z-50 rounded-2xl overflow-hidden"
                    style={{ background: "#0D1220", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", minWidth: 160 }}>
                    <button onClick={() => { setRenameId(conv.id); setRenameValue(conv.title); setMenuId(null) }}
                      className="w-full flex items-center gap-3 px-4 py-3"
                      style={{ color: "#EEF0FF", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(124,58,237,0.1)"}
                      onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>Rename</span>
                    </button>
                    <button onClick={() => { onDeleteChat(conv.id); setMenuId(null) }}
                      className="w-full flex items-center gap-3 px-4 py-3"
                      style={{ color: "#EF4444" }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                      onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rename modal */}
      {renameId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setRenameId(null)}>
          <div className="w-full rounded-3xl p-6" style={{ background: "#0D1220", border: "1px solid rgba(124,58,237,0.3)", boxShadow: "0 0 40px rgba(124,58,237,0.2)" }}
            onClick={e => e.stopPropagation()}>
            <h3 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#EEF0FF" }}>Rename Chat</h3>
            <input value={renameValue} onChange={e => setRenameValue(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 outline-none mb-4"
              style={{ background: "rgba(6,9,18,0.8)", border: "1px solid rgba(124,58,237,0.3)", color: "#EEF0FF", fontFamily: "var(--font-display)", fontSize: 15 }} />
            <div className="flex gap-3">
              <button onClick={() => setRenameId(null)}
                className="flex-1 py-3 rounded-2xl"
                style={{ background: "rgba(124,58,237,0.1)", color: "#8892B0", fontFamily: "var(--font-display)", fontSize: 14 }}>
                Cancel
              </button>
              <button onClick={() => { onRenameChat(renameId, renameValue); setRenameId(null) }}
                className="flex-1 py-3 rounded-2xl"
                style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", color: "white", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tap outside to close menu */}
      {menuId && <div className="absolute inset-0 z-40" onClick={() => setMenuId(null)} />}

      <BottomNav active="chats" onNavigate={onNavigate} />
    </div>
  )
}
