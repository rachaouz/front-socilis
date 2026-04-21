// src/pages/Auth.jsx

import { useState } from "react";
import Button from "../components/button";
import Input from "../components/input";
import { LOGO_URL } from "../constants";

function useAuthForm() {
  const [mode,     setMode]     = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email))       return "Enter a valid email address.";
    if (!password || password.length < 6)             return "Password must be at least 6 characters.";
    if (mode === "signup" && password !== confirm)    return "Passwords do not match.";
    return null;
  };

const handleSubmit = (onNavigate) => {
  const err = validate();
  if (err) { setError(err); return; }
  setError(""); setLoading(true);
  setTimeout(() => {
    setLoading(false);
    onNavigate("chat");
  }, 1800);
};

  const switchMode = (m) => {
    setMode(m); setError("");
    setEmail(""); setPassword(""); setConfirm("");
  };

  return { mode, email, setEmail, password, setPassword, confirm, setConfirm, error, loading, handleSubmit, switchMode };
}

export default function Auth({ onNavigate }) {
  const {
    mode, email, setEmail, password, setPassword,
    confirm, setConfirm, error, loading, handleSubmit, switchMode,
  } = useAuthForm();

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 60% 80% at 50% 50%, #041a30 0%, #020b18 70%)",
      }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t border-l border-accent opacity-40 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-accent opacity-40 pointer-events-none" />

      {/* Card */}
      <div
        className="
          relative z-10 w-full max-w-[420px]
          bg-[rgba(4,16,32,0.9)] border border-[rgba(0,212,255,0.2)]
          p-10 backdrop-blur-[20px] clip-card
          shadow-card
        "
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <img
            src={LOGO_URL}
            alt="Socilis"
            className="h-14 w-auto mb-2 drop-shadow-[0_0_16px_rgba(0,212,255,0.6)]"
          />
          <div className="font-display text-[1.8rem] font-black tracking-[0.25em] text-accent drop-shadow-[0_0_30px_rgba(0,212,255,0.6)]">
            SOCILIS
          </div>
        </div>

        <div className="text-center mb-8 text-[0.75rem] tracking-[0.25em] text-[#7aa3c0] uppercase font-body">
          // Secure Access Portal
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border border-[rgba(0,212,255,0.15)] bg-[rgba(0,0,0,0.3)]">
          {["login", "signup"].map((tab) => (
            <button
              key={tab}
              onClick={() => switchMode(tab)}
              className={`
                flex-1 py-[0.65rem] text-center font-display text-[0.65rem]
                tracking-[0.15em] border-none cursor-pointer transition-all duration-200
                ${mode === tab
                  ? "bg-[rgba(0,212,255,0.1)] text-accent shadow-[0_0_12px_rgba(0,212,255,0.15)]"
                  : "bg-transparent text-[#7aa3c0]"
                }
              `}
            >
              {tab === "login" ? "LOGIN" : "SIGN UP"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-[rgba(255,60,60,0.08)] border border-[rgba(255,60,60,0.25)] text-[#ff8080] text-[0.82rem] px-4 py-[0.65rem] mb-5 tracking-[0.05em] font-body">
            <span className="w-[5px] h-[5px] rounded-full bg-[#ff4444] flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Fields */}
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="analyst@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {mode === "signup" && (
          <Input
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
        )}

       <Button variant="submit" onClick={() => handleSubmit(onNavigate)} disabled={loading}>
  {loading
    ? "AUTHENTICATING..."
    : mode === "login"
    ? "INITIATE SESSION"
    : "CREATE ACCOUNT"
  }
</Button>

        <button
          onClick={() => onNavigate("home")}
          className="block w-full text-center mt-6 text-[0.78rem] text-[#7aa3c0] tracking-[0.1em] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-accent font-body"
        >
          ← Return to <span className="text-accent2">Socilis</span>
        </button>
      </div>
    </div>
  );
}
