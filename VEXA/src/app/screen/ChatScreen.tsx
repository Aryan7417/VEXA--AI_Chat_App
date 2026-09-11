import { useState, useEffect, useRef } from "react"
import { AppState, Message, Model, Screen } from "../../types"
import BottomNav from "../components/BottomNav"

interface Props {
  state: AppState
  initialMessage?: string
  onNavigate: (screen: Screen) => void
  onAddMessage: (convId: string, msg: Message) => void
}

const AI_RESPONSES = [
  "That's a great question! Let me break this down for you in a clear and comprehensive way.\n\nHere's what you need to know:\n\n1. **Core concept** — The fundamental idea here is built on a layered approach that scales naturally.\n\n2. **Implementation** — You can start with a simple structure:\n\n```javascript\nconst vexa = {\n  model: 'smart',\n  context: [],\n  async chat(message) {\n    return await this.process(message);\n  }\n};\n```\n\n3. **Best practices** — Always validate inputs and handle edge cases gracefully.\n\nWould you like me to dive deeper into any of these points?",
  "I've analyzed your request and here's my comprehensive response:\n\n**Summary:** Your approach is solid, but there are a few optimizations worth considering.\n\nThe key insight is that modern AI systems work best when given **clear context** and **specific constraints**. Think of it like giving directions — the more precise, the better the result.\n\n> \"The best AI interactions are collaborative, not transactional.\"\n\nShall I elaborate on any particular aspect?",
  "Absolutely! Here's a quick overview:\n\nThis is a fascinating area with lots of nuance. The short answer is **yes**, but the longer answer involves understanding the tradeoffs between:\n\n- **Speed** vs accuracy\n- **Simplicity** vs completeness\n- **Cost** vs quality\n\nMy recommendation would be to start simple and iterate. What specific use case are you working on?",
]

export default function ChatScreen({ state, initialMessage, onNavigate, onAddMessage }: Props) {
  const activeConv = state.conversations.find(c => c.id === state.activeConversationId)
  const [messages, setMessages] = useState<Message[]>(activeConv?.messages || [])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [streamText, setStreamText] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [dislikedIds, setDislikedIds] = useState<Set<string>>(new Set())
  const [showModel, setShowModel] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  const modelBadge: Record<Model, { label: string; color: string; icon: string }> = {
    fast: { label: "Flash", color: "#F59E0B", icon: "⚡" },
    smart: { label: "Smart", color: "#A855F7", icon: "🧠" },
    code: { label: "Code", color: "#10B981", icon: "💻" }
  }

  useEffect(() => {
    if (initialMessage && !initialized.current) {
      initialized.current = true
      sendMessage(initialMessage)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamText, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    setStreamText("")

    const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
    let i = 0
    const interval = setInterval(() => {
      i++
      setStreamText(response.slice(0, i * 3))
      if (i * 3 >= response.length) {
        clearInterval(interval)
        setIsTyping(false)
        setStreamText("")
        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: response, timestamp: new Date() }
        setMessages(prev => [...prev, aiMsg])
      }
    }, 20)
  }

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard?.writeText(content).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "")
        return (
          <div key={i} className="mt-3 mb-3 rounded-xl overflow-hidden"
            style={{ background: "#0A0E1A", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#A855F7" }}>code</span>
              <button onClick={() => handleCopy("code" + i, code)}
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8892B0" }}>
                {copiedId === "code" + i ? "copied!" : "copy"}
              </button>
            </div>
            <pre className="px-3 py-3 overflow-x-auto" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#CBD5E1", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {code}
            </pre>
          </div>
        )
      }
      return (
        <span key={i} style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#CBD5E1", lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: part
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#EEF0FF;font-weight:600">$1</strong>')
            .replace(/`(.*?)`/g, '<code style="font-family:var(--font-mono);font-size:12px;background:rgba(124,58,237,0.15);padding:1px 5px;border-radius:4px;color:#A855F7">$1</code>')
            .replace(/^> (.*)/gm, '<blockquote style="border-left:3px solid #7C3AED;padding-left:12px;margin:8px 0;color:#8892B0;font-style:italic">$1</blockquote>')
            .replace(/^• (.*)/gm, '• $1')
            .replace(/\n/g, '<br/>')
          }} />
      )
    })
  }

  const mInfo = modelBadge[state.model]

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-3"
        style={{ background: "rgba(6,9,18,0.95)", borderBottom: "1px solid rgba(124,58,237,0.1)", backdropFilter: "blur(20px)" }}>
        <button onClick={() => onNavigate("chats")} className="p-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#8892B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="rounded-xl flex items-center justify-center"
            style={{ width: 32, height: 32, background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <path d="M8 12L24 38L40 12" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#EEF0FF", lineHeight: 1 }}>VEXA</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#10B981" }}>● Active</p>
          </div>
        </div>
        <button onClick={() => setShowModel(!showModel)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
          style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
          <span style={{ fontSize: 11 }}>{mInfo.icon}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600, color: mInfo.color }}>{mInfo.label}</span>
        </button>
        <button className="p-1.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="#8892B0"/><circle cx="12" cy="12" r="1.5" fill="#8892B0"/><circle cx="12" cy="19" r="1.5" fill="#8892B0"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6" style={{ scrollbarWidth: "none" }}>
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <div className="rounded-3xl flex items-center justify-center"
              style={{ width: 64, height: 64, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
                <path d="M8 12L24 38L40 12" stroke="#A855F7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#8892B0" }}>Start a conversation</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={msg.id} className="mb-4 animate-fade-in">
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] px-4 py-3 rounded-3xl rounded-tr-lg"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#fff", lineHeight: 1.6 }}>{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2.5">
                <div className="rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ width: 28, height: 28, background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
                  <svg width="13" height="13" viewBox="0 0 48 48" fill="none">
                    <path d="M8 12L24 38L40 12" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="px-4 py-3 rounded-3xl rounded-tl-lg"
                    style={{ background: "rgba(13,18,32,0.9)", border: "1px solid rgba(124,58,237,0.15)" }}>
                    {renderContent(msg.content)}
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mt-2 px-1">
                    <button onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 transition-colors duration-150"
                      style={{ color: copiedId === msg.id ? "#10B981" : "#4A5568" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/></svg>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 11 }}>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                    </button>
                    <button onClick={() => { setLikedIds(p => { const n = new Set(p); n.has(msg.id) ? n.delete(msg.id) : n.add(msg.id); return n }) }}
                      style={{ color: likedIds.has(msg.id) ? "#10B981" : "#4A5568" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={likedIds.has(msg.id) ? "currentColor" : "none"}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button onClick={() => { setDislikedIds(p => { const n = new Set(p); n.has(msg.id) ? n.delete(msg.id) : n.add(msg.id); return n }) }}
                      style={{ color: dislikedIds.has(msg.id) ? "#EF4444" : "#4A5568" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={dislikedIds.has(msg.id) ? "currentColor" : "none"}><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button onClick={() => sendMessage(msg.content)} style={{ color: "#4A5568" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="23 4 23 11 16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing / streaming */}
        {isTyping && (
          <div className="flex gap-2.5 mb-4">
            <div className="rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
              style={{ width: 28, height: 28, background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
              <svg width="13" height="13" viewBox="0 0 48 48" fill="none">
                <path d="M8 12L24 38L40 12" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="px-4 py-3 rounded-3xl rounded-tl-lg"
                style={{ background: "rgba(13,18,32,0.9)", border: "1px solid rgba(124,58,237,0.15)" }}>
                {streamText ? (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#CBD5E1", lineHeight: 1.7 }}>
                    {streamText}
                    <span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: "#A855F7" }} />
                  </p>
                ) : (
                  <div className="flex gap-1.5 py-1">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-24"
        style={{ background: "linear-gradient(to top, #060912 60%, transparent 100%)", paddingTop: 8 }}>
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-3xl overflow-hidden"
            style={{ background: "rgba(13,18,32,0.9)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
              placeholder="Continue the conversation..."
              rows={1}
              className="w-full px-4 pt-3.5 pb-2 outline-none resize-none bg-transparent"
              style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#EEF0FF", maxHeight: 100 }} />
            <div className="flex gap-2 px-3 pb-2.5">
              <button className="p-1.5" style={{ color: "#8892B0" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
              <button className="p-1.5" style={{ color: "#8892B0" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="1.8"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
          <button onClick={() => sendMessage(input)}
            className="rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              width: 48, height: 48,
              background: input ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(124,58,237,0.2)",
              boxShadow: input ? "0 0 20px rgba(124,58,237,0.5)" : "none"
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <BottomNav active="chats" onNavigate={onNavigate} />
    </div>
  )
}
