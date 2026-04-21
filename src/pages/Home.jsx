// src/pages/Home.jsx

import Button from "../components/Button";
import GlowingSphere from "../components/glowingsphere";
import { LOGO_URL, NAV_ITEMS } from "../constants";

export default function Home({ onNavigate }) {
  // Split NAV_ITEMS into 2 columns: [ATM Mobilis, Mission] | [Cybersecurity, Platform]
  const col1 = [NAV_ITEMS[0], NAV_ITEMS[1]];
  const col2 = [NAV_ITEMS[2], NAV_ITEMS[3]];

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 70% 50%, #0a2540 0%, #020b18 60%),
          radial-gradient(ellipse 40% 40% at 20% 80%, #001a33 0%, transparent 70%)
        `,
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Scanline */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)`,
        }}
      />

      {/* Animated sphere */}
      <GlowingSphere />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-4 border-b border-[rgba(0,212,255,0.08)] bg-[rgba(2,11,24,0.6)] backdrop-blur-[12px]">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Socilis logo"
            className="h-14 w-auto drop-shadow-[0_0_14px_rgba(0,212,255,0.6)]"
          />
          <span className="font-display text-[1.3rem] font-bold tracking-[0.2em] text-accent drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
            SOCILIS
            <span className="text-[#7aa3c0] text-[0.65em] ml-2 tracking-[0.1em]">// SOC AI</span>
          </span>
        </div>
        <Button variant="login" onClick={() => onNavigate("auth")}>LOGIN</Button>
      </nav>

      {/* ── Hero ── */}
      <div className="relative z-[2] flex-1 flex items-center px-10 py-8">
        <div className="max-w-[600px]">

          {/* Status tag */}
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-[0.3rem] border border-[rgba(0,153,204,0.3)] bg-[rgba(0,153,204,0.06)] text-[0.7rem] tracking-[0.2em] text-accent2 font-body">
            <span className="w-[6px] h-[6px] rounded-full bg-[#00ff9d] shadow-[0_0_8px_#00ff9d] animate-[blink_2s_ease-in-out_infinite]" />
            SYSTEM ONLINE · THREAT INTEL ACTIVE
          </div>

          {/* Title — single line SOCILIS */}
          <h1
            className="font-display font-black tracking-[0.06em] leading-none text-white drop-shadow-[0_0_40px_rgba(0,212,255,0.25)] mb-1 whitespace-nowrap"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
          >
            SOCI<span className="text-accent">LIS</span>
          </h1>

          <p className="font-body text-[1.05rem] font-light tracking-[0.14em] text-[#7aa3c0] uppercase mb-8">
            Detect faster. Respond smarter.
          </p>

          {/* ── 2×2 grid of buttons ── */}
          <div className="grid grid-cols-2 gap-3 max-w-[560px]">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              {col1.map((item) => (
                <Button key={item.label} variant="hero" onClick={() => {}}>
                  {item.label}
                </Button>
              ))}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              {col2.map((item) => (
                <Button key={item.label} variant="hero" onClick={() => {}}>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer strip ── */}
      <div className="relative z-[5] flex items-center gap-3 px-10 py-3 border-t border-[rgba(0,212,255,0.08)] bg-[rgba(2,11,24,0.8)] backdrop-blur-[8px] text-[0.74rem] text-[#7aa3c0] tracking-[0.05em] font-body">
        <span className="w-1 h-1 rounded-full bg-accent2 opacity-60 flex-shrink-0" />
        Developed in collaboration with ATM Mobilis · AI-Powered Security Operations Center
      </div>
    </div>
  );
}

