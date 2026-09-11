import { useState } from "react"
import { Screen } from "../../types"

interface Props {
  onNext: (screen: Screen, phone?: string) => void
}

const countries = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "GB" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+55", flag: "🇧🇷", name: "BR" },
  { code: "+91", flag: "ind", name: "IND" },
]

export default function PhoneLoginScreen({ onNext }: Props) {
  const [country, setCountry] = useState(countries[0])
  const [phone, setPhone] = useState("")
  const [showCountries, setShowCountries] = useState(false)

  const isValid = phone.replace(/\D/g, "").length >= 7

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#060912" }}>
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 300, height: 200, background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)", filter: "blur(30px)" }} />

      <div className="flex flex-col flex-1 px-6 pt-20">
        {/* Logo small */}
        <div className="mb-10">
          <div className="rounded-2xl flex items-center justify-center mb-6"
            style={{ width: 52, height: 52, background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <path d="M8 12L24 38L40 12" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#EEF0FF", lineHeight: 1.2 }}>
            Welcome to VEXA
          </h1>
          <p className="mt-2" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#8892B0", lineHeight: 1.6 }}>
            Enter your phone number to continue. We'll send you a verification code.
          </p>
        </div>

        {/* Phone input */}
        <div className="mb-4">
          <label style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#8892B0", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
            PHONE NUMBER
          </label>
          <div className="flex gap-3">
            {/* Country picker */}
            <button onClick={() => setShowCountries(!showCountries)}
              className="flex items-center gap-2 rounded-2xl px-3 transition-all duration-200"
              style={{
                height: 56, minWidth: 90,
                background: "rgba(13,18,32,0.8)", border: "1px solid rgba(124,58,237,0.25)",
                color: "#EEF0FF"
              }}>
              <span style={{ fontSize: 18 }}>{country.flag}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>{country.code}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#8892B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Phone field */}
            <div className="flex-1 relative">
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="Mobile number"
                className="w-full rounded-2xl px-4 outline-none transition-all duration-200"
                style={{
                  height: 56, background: "rgba(13,18,32,0.8)",
                  border: `1px solid ${phone ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.2)"}`,
                  color: "#EEF0FF", fontFamily: "var(--font-display)", fontSize: 16,
                  boxShadow: phone ? "0 0 0 3px rgba(124,58,237,0.1)" : "none"
                }} />
            </div>
          </div>

          {/* Country dropdown */}
          {showCountries && (
            <div className="mt-2 rounded-2xl overflow-hidden z-10"
              style={{ background: "#0D1220", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
              {countries.map(c => (
                <button key={c.code} onClick={() => { setCountry(c); setShowCountries(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#EEF0FF" }}
                  onMouseOver={e => (e.currentTarget.style.background = "rgba(124,58,237,0.1)")}
                  onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, flex: 1 }}>{c.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#8892B0" }}>{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="mt-2 mb-8" style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#4A5568", lineHeight: 1.6 }}>
          By continuing, you agree to our{" "}
          <span style={{ color: "#7C3AED" }}>Terms of Service</span> and{" "}
          <span style={{ color: "#7C3AED" }}>Privacy Policy</span>
        </p>

        <button disabled={!isValid}
          onClick={() => onNext("otp", `${country.code} ${phone}`)}
          className="w-full rounded-2xl py-4 font-semibold transition-all duration-200"
          style={{
            fontFamily: "var(--font-display)", fontSize: 16,
            background: isValid ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "rgba(124,58,237,0.15)",
            color: isValid ? "#fff" : "#4A5568",
            boxShadow: isValid ? "0 0 24px rgba(124,58,237,0.4)" : "none",
            cursor: isValid ? "pointer" : "not-allowed"
          }}>
          Continue
        </button>
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    </div>
  )
}
