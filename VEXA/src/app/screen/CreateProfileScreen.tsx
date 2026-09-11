import { useState } from "react"
import { Screen } from "../../types"

interface Props {
  onNext: (screen: Screen, name: string, avatar: string | null) => void
}

const avatarColors = ["#7C3AED", "#6366F1", "#EC4899", "#10B981", "#F59E0B", "#EF4444"]
const avatarEmojis = ["🧑", "👩", "🧔", "👨‍💻", "👩‍💻", "🤖"]

export default function CreateProfileScreen({ onNext }: Props) {
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(0)

  const isValid = name.trim().length >= 2

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 300, height: 200, background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)", filter: "blur(30px)" }} />

      <div className="flex flex-col flex-1 px-6 pt-16">
        <div className="mb-8">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#EEF0FF" }}>
            Create your profile
          </h1>
          <p className="mt-2" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#8892B0" }}>
            Personalize your VEXA experience
          </p>
        </div>

        {/* Avatar selection */}
        <div className="flex flex-col items-center mb-8">
          {/* Large avatar preview */}
          <div className="relative mb-5">
            <div className="rounded-3xl flex items-center justify-center"
              style={{
                width: 96, height: 96,
                background: `linear-gradient(135deg, ${avatarColors[selectedAvatar]} 0%, ${avatarColors[(selectedAvatar + 1) % avatarColors.length]} 100%)`,
                boxShadow: `0 0 30px ${avatarColors[selectedAvatar]}60, 0 0 60px ${avatarColors[selectedAvatar]}20`
              }}>
              <span style={{ fontSize: 40 }}>{avatarEmojis[selectedAvatar]}</span>
            </div>
            <button className="absolute -bottom-2 -right-2 rounded-full flex items-center justify-center"
              style={{ width: 30, height: 30, background: "#7C3AED", border: "2px solid #060912" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Avatar options */}
          <div className="flex gap-3">
            {avatarEmojis.map((emoji, i) => (
              <button key={i} onClick={() => setSelectedAvatar(i)}
                className="rounded-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  width: 44, height: 44, fontSize: 22,
                  background: i === selectedAvatar ? `${avatarColors[i]}25` : "rgba(13,18,32,0.8)",
                  border: i === selectedAvatar ? `1.5px solid ${avatarColors[i]}` : "1.5px solid rgba(255,255,255,0.06)",
                  boxShadow: i === selectedAvatar ? `0 0 12px ${avatarColors[i]}40` : "none",
                  transform: i === selectedAvatar ? "scale(1.08)" : "scale(1)"
                }}>
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="mb-6">
          <label style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#8892B0", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
            YOUR NAME
          </label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-2xl px-4 outline-none transition-all duration-200"
            style={{
              height: 56, background: "rgba(13,18,32,0.8)",
              border: `1px solid ${name ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.2)"}`,
              color: "#EEF0FF", fontFamily: "var(--font-display)", fontSize: 16,
              boxShadow: name ? "0 0 0 3px rgba(124,58,237,0.1)" : "none"
            }} />
        </div>

        {/* What name used for */}
        <div className="flex items-start gap-3 p-4 rounded-2xl mb-8"
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" stroke="#A855F7" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="#A855F7" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8892B0", lineHeight: 1.5 }}>
            VEXA will use your name to personalize responses and make conversations feel more natural.
          </p>
        </div>

        <button disabled={!isValid}
          onClick={() => onNext("home", name.trim(), null)}
          className="w-full rounded-2xl py-4 font-semibold transition-all duration-200"
          style={{
            fontFamily: "var(--font-display)", fontSize: 16,
            background: isValid ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "rgba(124,58,237,0.15)",
            color: isValid ? "#fff" : "#4A5568",
            boxShadow: isValid ? "0 0 24px rgba(124,58,237,0.4)" : "none",
            cursor: isValid ? "pointer" : "not-allowed"
          }}>
          Start Exploring
        </button>
      </div>
    </div>
  )
}
