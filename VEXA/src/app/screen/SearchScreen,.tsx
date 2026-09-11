import { useState } from "react"
import { AppState, Screen } from "../../types"
import BottomNav from "../components/BottomNav"

interface Props {
  state: AppState
  onNavigate: (screen: Screen) => void
  onOpenChat: (id: string) => void
}

export default function SearchScreen({ state, onNavigate, onOpenChat }: Props) {
  const [query, setQuery] = useState("")

  const allMessages = state.conversations.flatMap(conv =>
    conv.messages.map(msg => ({ ...msg, convTitle: conv.title, convId: conv.id }))
  )

  const results = query.trim().length > 1
    ? allMessages.filter(m => m.content.toLowerCase().includes(query.toLowerCase()))
    : []

  const highlight = (text: string, q: string) => {
    if (!q) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return text.slice(0, 80) + (text.length > 80 ? "..." : "")
    const start = Math.max(0, idx - 30)
    const end = Math.min(text.length, idx + q.length + 50)
    const before = (start > 0 ? "..." : "") + text.slice(start, idx)
    const match = text.slice(idx, idx + q.length)
    const after = text.slice(idx + q.length, end) + (end < text.length ? "..." : "")
    return { before, match, after }
  }

  const recentTopics = ["Python", "React hooks", "Machine learning", "Writing tips", "SQL queries"]

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <h1 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#EEF0FF" }}>
          Search
        </h1>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#8892B0" strokeWidth="1.8"/>
            <path d="M21 21l-4.35-4.35" stroke="#8892B0" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search messages, conversations..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none"
            style={{
              background: "rgba(13,18,32,0.9)", border: "1px solid rgba(124,58,237,0.25)",
              color: "#EEF0FF", fontFamily: "var(--font-body)", fontSize: 15,
              boxShadow: "0 0 0 3px rgba(124,58,237,0.08)"
            }} />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4A5568" strokeWidth="1.8"/><path d="M15 9l-6 6M9 9l6 6" stroke="#4A5568" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28 px-5" style={{ scrollbarWidth: "none" }}>
        {!query && (
          <div className="pt-6">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#8892B0", letterSpacing: "0.06em", marginBottom: 14 }}>
              RECENT TOPICS
            </p>
            <div className="flex flex-wrap gap-2">
              {recentTopics.map(topic => (
                <button key={topic} onClick={() => setQuery(topic)}
                  className="px-4 py-2 rounded-2xl transition-all duration-150"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#A855F7", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500 }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(124,58,237,0.18)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(124,58,237,0.1)"}>
                  {topic}
                </button>
              ))}
            </div>

            {state.conversations.length === 0 && (
              <div className="flex flex-col items-center gap-4 mt-16 opacity-40">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#4A5568" strokeWidth="1.5"/>
                  <path d="M21 21l-4.35-4.35" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#4A5568", textAlign: "center" }}>
                  Start some conversations to search through them
                </p>
              </div>
            )}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-16 opacity-50">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#4A5568" strokeWidth="1.5"/>
              <path d="M21 21l-4.35-4.35" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#4A5568" }}>No results for "{query}"</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="pt-4">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#8892B0", letterSpacing: "0.06em", marginBottom: 12 }}>
              {results.length} RESULT{results.length !== 1 ? "S" : ""}
            </p>
            {results.map(result => {
              const h = highlight(result.content, query)
              return (
                <button key={result.id}
                  onClick={() => { onOpenChat(result.convId); onNavigate("chat") }}
                  className="w-full text-left p-4 rounded-2xl mb-3 transition-all duration-150"
                  style={{ background: "rgba(13,18,32,0.7)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(124,58,237,0.08)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(13,18,32,0.7)"}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg px-2 py-0.5"
                      style={{ background: result.role === "user" ? "rgba(124,58,237,0.2)" : "rgba(99,102,241,0.2)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: result.role === "user" ? "#A855F7" : "#818CF8", fontWeight: 600 }}>
                        {result.role === "user" ? "You" : "VEXA"}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "#8892B0" }}>in</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "#A855F7", fontWeight: 600 }}>
                      {result.convTitle}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8892B0", lineHeight: 1.6 }}>
                    {typeof h === "string" ? h : (
                      <>
                        {h.before}
                        <mark style={{ background: "rgba(168,85,247,0.3)", color: "#EEF0FF", borderRadius: 3, padding: "0 2px" }}>{h.match}</mark>
                        {h.after}
                      </>
                    )}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav active="search" onNavigate={onNavigate} />
    </div>
  )
}
