import { Screen } from "../../types"

interface Props {
  active: "home" | "chats" | "search" | "settings"
  onNavigate: (screen: Screen) => void
}

const tabs = [
  {
    id: "home" as const, label: "Home", screen: "home" as Screen,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"
          stroke={active ? "#A855F7" : "#4A5568"} strokeWidth="1.8" fill={active ? "rgba(168,85,247,0.15)" : "none"} strokeLinejoin="round"/>
        <path d="M9 21V12h6v9" stroke={active ? "#A855F7" : "#4A5568"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: "chats" as const, label: "Chats", screen: "chats" as Screen,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
          stroke={active ? "#A855F7" : "#4A5568"} strokeWidth="1.8" fill={active ? "rgba(168,85,247,0.15)" : "none"} strokeLinejoin="round"/>
        {active && <circle cx="8" cy="10" r="1.2" fill="#A855F7"/>}
        {active && <circle cx="12" cy="10" r="1.2" fill="#A855F7"/>}
        {active && <circle cx="16" cy="10" r="1.2" fill="#A855F7"/>}
        {!active && <circle cx="8" cy="10" r="1.2" fill="#4A5568"/>}
        {!active && <circle cx="12" cy="10" r="1.2" fill="#4A5568"/>}
        {!active && <circle cx="16" cy="10" r="1.2" fill="#4A5568"/>}
      </svg>
    )
  },
  {
    id: "search" as const, label: "Search", screen: "search" as Screen,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={active ? "#A855F7" : "#4A5568"} strokeWidth="1.8" fill={active ? "rgba(168,85,247,0.15)" : "none"}/>
        <path d="M21 21l-4.35-4.35" stroke={active ? "#A855F7" : "#4A5568"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: "settings" as const, label: "Settings", screen: "settings" as Screen,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={active ? "#A855F7" : "#4A5568"} strokeWidth="1.8" fill={active ? "rgba(168,85,247,0.15)" : "none"}/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          stroke={active ? "#A855F7" : "#4A5568"} strokeWidth="1.8"/>
      </svg>
    )
  }
]

export default function BottomNav({ active, onNavigate }: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50"
      style={{
        background: "linear-gradient(to top, rgba(6,9,18,0.98) 0%, rgba(6,9,18,0.95) 100%)",
        borderTop: "1px solid rgba(124,58,237,0.15)",
        backdropFilter: "blur(20px)",
        paddingBottom: 24
      }}>
      <div className="flex items-center justify-around pt-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onNavigate(tab.screen)}
            className="flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200"
            style={{ minWidth: 60 }}>
            <div className="relative">
              {tab.icon(active === tab.id)}
              {active === tab.id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: 4, height: 4, background: "#A855F7", boxShadow: "0 0 8px #A855F7" }} />
              )}
            </div>
            <span className="text-[10px] font-medium transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                color: active === tab.id ? "#A855F7" : "#4A5568"
              }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
