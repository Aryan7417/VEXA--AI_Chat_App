import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default function PhoneFrame({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, #02040A 60%)" }}>
      {/* Ambient glow orbs */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #7C3AED 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #6366F1 0%, transparent 70%)", filter: "blur(80px)" }} />

      {/* Phone frame */}
      <div className="relative" style={{ width: 390, height: 844 }}>
        {/* Outer bezel */}
        <div className="absolute inset-0 rounded-[52px] pointer-events-none z-20"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.3) 100%)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 0 8px #0A0A12, 0 0 0 10px rgba(255,255,255,0.04), 0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(124,58,237,0.15)"
          }} />

        {/* Screen area */}
        <div className="absolute rounded-[46px] overflow-hidden"
          style={{ inset: 4, background: "#060912" }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 relative z-10"
            style={{ background: "transparent" }}>
            <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-display)", color: "#EEF0FF" }}>9:41</span>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <div className="flex items-end gap-px">
                {[3,5,7,9].map((h, i) => (
                  <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: i < 3 ? "#EEF0FF" : "rgba(238,240,255,0.3)" }} />
                ))}
              </div>
              {/* WiFi */}
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                <path d="M7.5 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3.5a5 5 0 0 1 3.54 1.46l-1.07 1.07A3.5 3.5 0 0 0 7.5 7.5a3.5 3.5 0 0 0-2.47 1.03L3.96 7.46A5 5 0 0 1 7.5 6zm0-3.5a8.5 8.5 0 0 1 6.01 2.49L12.44 6.06A6.5 6.5 0 0 0 7.5 4a6.5 6.5 0 0 0-4.94 2.06L1.49 4.99A8.5 8.5 0 0 1 7.5 2.5z" fill="#EEF0FF"/>
              </svg>
              {/* Battery */}
              <div className="flex items-center gap-px">
                <div className="relative rounded-[2px] border border-white/60" style={{ width: 22, height: 11 }}>
                  <div className="absolute left-0.5 top-0.5 bottom-0.5 rounded-sm" style={{ width: "72%", background: "#EEF0FF" }} />
                </div>
                <div className="rounded-r-sm" style={{ width: 2, height: 5, background: "rgba(238,240,255,0.5)" }} />
              </div>
            </div>
          </div>

          {/* Dynamic island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full z-20"
            style={{ width: 120, height: 34, background: "#000" }} />

          {/* Content */}
          <div className="absolute inset-0 top-0 overflow-hidden">
            {children}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-30"
          style={{ width: 120, height: 4, background: "rgba(255,255,255,0.25)" }} />

        {/* Side buttons */}
        <div className="absolute left-[-12px] top-[140px] rounded-l-sm" style={{ width: 4, height: 30, background: "#1a1a2e" }} />
        <div className="absolute left-[-12px] top-[185px] rounded-l-sm" style={{ width: 4, height: 50, background: "#1a1a2e" }} />
        <div className="absolute left-[-12px] top-[250px] rounded-l-sm" style={{ width: 4, height: 50, background: "#1a1a2e" }} />
        <div className="absolute right-[-12px] top-[200px] rounded-r-sm" style={{ width: 4, height: 70, background: "#1a1a2e" }} />
      </div>
    </div>
  )
}
