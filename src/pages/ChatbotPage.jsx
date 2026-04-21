import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_HISTORY = [
  { id: 1, title: "Analyse IP 192.168.1.1", date: "Aujourd'hui", preview: "Score: 85/100 · Malicieux" },
  { id: 2, title: "Hash MD5 d41d8cd9...", date: "Aujourd'hui", preview: "Score: 12/100 · Propre" },
  { id: 3, title: "CVE-2024-1234", date: "Hier", preview: "CVSS 9.8 · Critique" },
  { id: 4, title: "Domain malware.ru", date: "Hier", preview: "Score: 92/100 · Malicieux" },
  { id: 5, title: "URL phishing scan", date: "20 Avr", preview: "Score: 78/100 · Suspect" },
];

const IOC_TYPES = ["HASH", "IP", "URL", "DOMAIN", "CVE"];

function VerdictBadge({ verdict }) {
  const colors = {
    malicious:  { bg: "rgba(255,50,50,0.15)",  border: "#ff3232", text: "#ff6464", label: "⚠ MALICIEUX" },
    clean:      { bg: "rgba(0,255,136,0.15)",  border: "#00ff88", text: "#00ff88", label: "✓ PROPRE" },
    suspicious: { bg: "rgba(255,165,0,0.15)",  border: "#ffa500", text: "#ffa500", label: "⚡ SUSPECT" },
  };
  const c = colors[verdict] || colors.suspicious;
  return (
    <span style={{
      padding: "2px 10px", borderRadius: "4px",
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, fontSize: "11px", fontWeight: "700", letterSpacing: "2px",
    }}>{c.label}</span>
  );
}

function ThreatReport({ data, darkMode }) {
  const [copied, setCopied] = useState(false);
  const score = data.score || 0;
  const scoreColor = score > 70 ? "#ff4444" : score > 40 ? "#ffa500" : "#00ff88";

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: darkMode ? "rgba(0,20,40,0.8)" : "rgba(230,255,245,0.8)",
      border: darkMode ? "1px solid rgba(0,200,255,0.2)" : "1px solid rgba(0,168,107,0.3)",
      borderRadius: "8px", padding: "16px", marginTop: "8px",
      fontSize: "12px", fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ color: darkMode ? "#00c8ff" : "#00a86b", fontWeight: "700", letterSpacing: "2px" }}>
          ▶ THREAT INTELLIGENCE REPORT
        </span>
        <button onClick={handleCopy} style={{
          background: "transparent",
          border: darkMode ? "1px solid rgba(0,200,255,0.3)" : "1px solid rgba(0,168,107,0.4)",
          color: copied ? "#00ff88" : darkMode ? "#00c8ff" : "#00a86b",
          padding: "3px 10px", borderRadius: "4px", fontSize: "10px",
          cursor: "pointer", letterSpacing: "1px", transition: "all 0.2s",
        }}>
          {copied ? "✓ COPIÉ" : "⎘ COPIER"}
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <span style={{ color: darkMode ? "rgba(0,200,255,0.5)" : "rgba(0,168,107,0.6)", fontSize: "10px", letterSpacing: "2px" }}>IOC · </span>
        <span style={{ color: darkMode ? "#e0f0ff" : "#0a1f15" }}>{data.ioc}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <VerdictBadge verdict={data.verdict} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "2px" }}>THREAT SCORE</span>
            <span style={{ color: scoreColor, fontWeight: "700" }}>{score}/100</span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${score}%`,
              background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`,
              borderRadius: "2px", boxShadow: `0 0 6px ${scoreColor}`,
              transition: "width 1s ease",
            }} />
          </div>
        </div>
      </div>

      {data.cves?.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ color: darkMode ? "rgba(0,200,255,0.5)" : "rgba(0,168,107,0.6)", fontSize: "10px", letterSpacing: "2px", marginBottom: "6px" }}>CVEs ASSOCIÉES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {data.cves.map(c => (
              <span key={c} style={{
                padding: "2px 8px", background: "rgba(255,100,0,0.1)",
                border: "1px solid rgba(255,100,0,0.3)", borderRadius: "3px",
                color: "#ff8844", fontSize: "11px",
              }}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {data.sources?.length > 0 && (
        <div>
          <div style={{ color: darkMode ? "rgba(0,200,255,0.5)" : "rgba(0,168,107,0.6)", fontSize: "10px", letterSpacing: "2px", marginBottom: "6px" }}>SOURCES</div>
          {data.sources.map(s => (
            <div key={s} style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,50,30,0.5)", fontSize: "11px", marginBottom: "2px" }}>→ {s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg, darkMode }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "16px", animation: "fadeInUp 0.3s ease",
    }}>
      {!isUser && (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: darkMode
            ? "linear-gradient(135deg, #0a2a4a, #0d3d6b)"
            : "linear-gradient(135deg, #00a86b, #00d48a)",
          border: darkMode ? "1px solid rgba(0,200,255,0.4)" : "1px solid rgba(0,168,107,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", marginRight: "10px", flexShrink: 0,
          boxShadow: darkMode ? "0 0 12px rgba(0,200,255,0.2)" : "0 0 12px rgba(0,168,107,0.3)",
        }}>🛡</div>
      )}
      <div style={{ maxWidth: "75%" }}>
        <div style={{
          background: isUser
            ? darkMode
              ? "linear-gradient(135deg, rgba(0,150,255,0.2), rgba(0,100,200,0.15))"
              : "linear-gradient(135deg, rgba(0,168,107,0.15), rgba(0,120,80,0.1))"
            : darkMode
              ? "rgba(10,25,45,0.7)"
              : "rgba(225,245,235,0.9)",
          border: isUser
            ? darkMode ? "1px solid rgba(0,150,255,0.3)" : "1px solid rgba(0,168,107,0.3)"
            : darkMode ? "1px solid rgba(0,200,255,0.15)" : "1px solid rgba(0,168,107,0.2)",
          borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
          padding: "12px 16px",
          color: darkMode ? "#d0e8ff" : "#0a1f15",
          fontSize: "13px", lineHeight: "1.6",
          fontFamily: "'Courier New', monospace",
        }}>
          {msg.content}
        </div>
        {msg.report && <ThreatReport data={msg.report} darkMode={darkMode} />}
        <div style={{
          fontSize: "10px",
          color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,100,60,0.4)",
          marginTop: "4px",
          textAlign: isUser ? "right" : "left", letterSpacing: "1px",
        }}>
          {msg.timestamp}
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ onClose, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: darkMode ? "#061524" : "#f0fff8",
        border: darkMode ? "1px solid rgba(0,200,255,0.3)" : "1px solid rgba(0,168,107,0.4)",
        borderRadius: "12px", padding: "28px", width: "340px",
        fontFamily: "'Courier New', monospace",
        boxShadow: darkMode ? "0 0 40px rgba(0,200,255,0.1)" : "0 0 40px rgba(0,168,107,0.15)",
      }}>
        <div style={{
          color: darkMode ? "#00c8ff" : "#00a86b",
          letterSpacing: "3px", fontSize: "13px", marginBottom: "20px", fontWeight: "700",
        }}>
          ⚙ PARAMÈTRES
        </div>

        <div style={{
          background: darkMode ? "rgba(0,200,255,0.05)" : "rgba(0,168,107,0.07)",
          border: darkMode ? "1px solid rgba(0,200,255,0.1)" : "1px solid rgba(0,168,107,0.2)",
          borderRadius: "8px", padding: "12px", marginBottom: "12px",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: darkMode
              ? "linear-gradient(135deg, #00c8ff, #0066cc)"
              : "linear-gradient(135deg, #00a86b, #00d48a)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>👤</div>
          <div>
            <div style={{ color: darkMode ? "#d0e8ff" : "#0a1f15", fontSize: "13px", fontWeight: "700" }}>Analyste SOC</div>
            <div style={{ color: darkMode ? "rgba(0,200,255,0.5)" : "rgba(0,168,107,0.7)", fontSize: "11px" }}>analyst@mobilis.dz</div>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px",
          background: darkMode ? "rgba(0,200,255,0.03)" : "rgba(0,168,107,0.05)",
          border: darkMode ? "1px solid rgba(0,200,255,0.1)" : "1px solid rgba(0,168,107,0.15)",
          borderRadius: "8px", marginBottom: "12px", cursor: "pointer",
        }} onClick={() => setDarkMode(!darkMode)}>
          <span style={{ color: darkMode ? "#d0e8ff" : "#0a1f15", fontSize: "12px", letterSpacing: "1px" }}>
            {darkMode ? "🌙 Mode Sombre" : "☀️ Mode Clair"}
          </span>
          <div style={{
            width: "40px", height: "22px", borderRadius: "11px",
            background: darkMode ? "#00c8ff" : "#00a86b",
            position: "relative", transition: "all 0.3s",
          }}>
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
              position: "absolute", top: "2px",
              left: darkMode ? "20px" : "2px", transition: "all 0.3s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }} />
          </div>
        </div>

        <button onClick={() => navigate("/auth")} style={{
          width: "100%", padding: "10px",
          background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.3)",
          borderRadius: "8px", color: "#ff6464", fontSize: "12px",
          letterSpacing: "2px", cursor: "pointer",
          fontFamily: "'Courier New', monospace", transition: "all 0.2s",
        }}>
          ⏻ SE DÉCONNECTER
        </button>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([{
    id: 1, role: "bot",
    content: "Système SOCILIS initialisé. Je suis votre assistant Threat Intelligence. Soumettez un IOC (Hash, IP, URL, Domaine ou CVE) pour analyse.",
    timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeIOC, setActiveIOC] = useState(null);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput("");

    const userMsg = {
      id: Date.now(), role: "user", content: msgText,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 1500));
    const isMalicious = Math.random() > 0.5;
    const score = isMalicious
      ? Math.floor(Math.random() * 30) + 65
      : Math.floor(Math.random() * 35) + 5;

    const botMsg = {
      id: Date.now() + 1, role: "bot",
      content: `Analyse terminée pour : ${msgText}`,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      report: {
        ioc: msgText,
        verdict: isMalicious ? "malicious" : "clean",
        score,
        cves: isMalicious ? ["CVE-2024-1182", "CVE-2023-4567"] : [],
        sources: ["VirusTotal", "AbuseIPDB", "Shodan"],
      },
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleQuickAction = (type) => {
    setActiveIOC(type);
    setInput(`[${type}] `);
  };

  const bg          = darkMode ? "#020d1a"  : "#f0f7f4";
  const sidebarBg   = darkMode ? "#040f1f"  : "#e8f5f0";
  const textColor   = darkMode ? "#d0e8ff"  : "#0a1f15";
  const borderColor = darkMode ? "rgba(0,200,255,0.15)" : "rgba(0,168,107,0.25)";
  const accent      = darkMode ? "#00c8ff"  : "#00a86b";
  const accentFaint = darkMode ? "rgba(0,200,255,0.1)"  : "rgba(0,168,107,0.1)";

  return (
    <div style={{
      display: "flex", height: "100vh", background: bg,
      fontFamily: "'Courier New', monospace", color: textColor, overflow: "hidden",
    }}>
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {/* ── SIDEBAR ── */}
      <div style={{
        width: sidebarOpen ? "260px" : "0px",
        minWidth: sidebarOpen ? "260px" : "0px",
        background: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden", transition: "all 0.3s ease",
      }}>
        {sidebarOpen && (<>
          {/* Logo */}
          <div style={{
            padding: "20px 16px", borderBottom: `1px solid ${borderColor}`,
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <img src="/logo_socilis.webp" alt="SOCILIS"
              style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px", letterSpacing: "2px" }}>
                <span style={{ color: darkMode ? "#fff" : "#0a1f15" }}>SOCI</span>
                <span style={{ color: accent }}>LIS</span>
              </div>
              <div style={{ color: darkMode ? "rgba(0,200,255,0.5)" : "rgba(0,168,107,0.6)", fontSize: "9px", letterSpacing: "2px" }}>SOC AI</div>
            </div>
          </div>

          {/* New chat */}
          <div style={{ padding: "12px" }}>
            <button onClick={() => { setMessages([]); setSelectedChat(null); }} style={{
              width: "100%", padding: "8px", background: "transparent",
              border: `1px dashed ${darkMode ? "rgba(0,200,255,0.3)" : "rgba(0,168,107,0.4)"}`,
              borderRadius: "6px", color: accent, fontSize: "11px", letterSpacing: "2px",
              cursor: "pointer", fontFamily: "'Courier New', monospace",
            }}>
              + NOUVELLE ANALYSE
            </button>
          </div>

          {/* History */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
            <div style={{ fontSize: "9px", color: darkMode ? "rgba(0,200,255,0.4)" : "rgba(0,168,107,0.5)", letterSpacing: "3px", padding: "8px" }}>
              HISTORIQUE
            </div>
            {MOCK_HISTORY.map(item => (
              <div key={item.id} onClick={() => setSelectedChat(item.id)} style={{
                padding: "10px", borderRadius: "6px", marginBottom: "2px", cursor: "pointer",
                background: selectedChat === item.id ? accentFaint : "transparent",
                border: selectedChat === item.id
                  ? `1px solid ${darkMode ? "rgba(0,200,255,0.2)" : "rgba(0,168,107,0.3)"}`
                  : "1px solid transparent",
                transition: "all 0.2s",
              }}>
                <div style={{
                  fontSize: "11px", color: textColor, marginBottom: "3px",
                  overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                }}>{item.title}</div>
                <div style={{ fontSize: "10px", color: darkMode ? "rgba(0,200,255,0.4)" : "rgba(0,168,107,0.6)" }}>{item.preview}</div>
                <div style={{ fontSize: "9px", color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,100,60,0.3)", marginTop: "2px" }}>{item.date}</div>
              </div>
            ))}
          </div>

          {/* Settings button */}
          <div style={{ padding: "12px", borderTop: `1px solid ${borderColor}` }}>
            <button onClick={() => setSettingsOpen(true)} style={{
              width: "100%", padding: "8px", background: "transparent",
              border: `1px solid ${darkMode ? "rgba(0,200,255,0.2)" : "rgba(0,168,107,0.3)"}`,
              borderRadius: "6px",
              color: darkMode ? "rgba(0,200,255,0.7)" : "rgba(0,168,107,0.8)",
              fontSize: "11px", letterSpacing: "2px", cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              ⚙ PARAMÈTRES
            </button>
          </div>
        </>)}
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          height: "52px", borderBottom: `1px solid ${borderColor}`,
          display: "flex", alignItems: "center", padding: "0 16px", gap: "12px", flexShrink: 0,
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "transparent", border: "none", color: accent,
            cursor: "pointer", fontSize: "16px", padding: "4px",
          }}>☰</button>
          <div style={{ flex: 1, color: darkMode ? "rgba(0,200,255,0.6)" : "rgba(0,168,107,0.8)", fontSize: "11px", letterSpacing: "3px" }}>
            THREAT INTELLIGENCE CHATBOT
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#00ff88", letterSpacing: "2px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#00ff88", boxShadow: "0 0 6px #00ff88",
              animation: "pulse2 2s ease-in-out infinite",
            }} />
            SYSTÈME ACTIF
          </div>
        </div>

        {/* IOC Buttons */}
        <div style={{
          padding: "10px 16px", display: "flex", gap: "8px",
          borderBottom: `1px solid ${borderColor}`, flexShrink: 0, flexWrap: "wrap",
        }}>
          {IOC_TYPES.map(type => (
            <button key={type} onClick={() => handleQuickAction(type)} style={{
              padding: "5px 14px",
              background: activeIOC === type ? accentFaint : "transparent",
              border: activeIOC === type
                ? `1px solid ${accent}`
                : `1px solid ${darkMode ? "rgba(0,200,255,0.25)" : "rgba(0,168,107,0.3)"}`,
              borderRadius: "4px",
              color: activeIOC === type ? accent : darkMode ? "rgba(0,200,255,0.6)" : "rgba(0,168,107,0.7)",
              fontSize: "11px", letterSpacing: "2px", cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              fontWeight: activeIOC === type ? "700" : "400",
              transition: "all 0.2s",
              boxShadow: activeIOC === type ? `0 0 10px ${accentFaint}` : "none",
            }}>{type}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "20px",
          scrollbarWidth: "thin",
          scrollbarColor: darkMode ? "rgba(0,200,255,0.2) transparent" : "rgba(0,168,107,0.2) transparent",
        }}>
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} darkMode={darkMode} />
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: darkMode
                  ? "linear-gradient(135deg, #0a2a4a, #0d3d6b)"
                  : "linear-gradient(135deg, #00a86b, #00d48a)",
                border: darkMode ? "1px solid rgba(0,200,255,0.4)" : "1px solid rgba(0,168,107,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
              }}>🛡</div>
              <div style={{
                background: darkMode ? "rgba(10,25,45,0.7)" : "rgba(225,245,235,0.9)",
                border: darkMode ? "1px solid rgba(0,200,255,0.15)" : "1px solid rgba(0,168,107,0.2)",
                borderRadius: "12px 12px 12px 2px", padding: "12px 20px",
                display: "flex", gap: "6px", alignItems: "center",
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: accent,
                    animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${borderColor}`, flexShrink: 0 }}>
          <div style={{
            display: "flex", gap: "10px",
            background: darkMode ? "rgba(0,20,45,0.8)" : "rgba(235,255,248,0.9)",
            border: `1px solid ${input ? accent : borderColor}`,
            borderRadius: "8px", padding: "6px 6px 6px 14px",
            transition: "border-color 0.2s",
            boxShadow: input ? `0 0 12px ${accentFaint}` : "none",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Entrez un IOC (hash, IP, URL, domaine, CVE)..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: textColor, fontSize: "12px",
                fontFamily: "'Courier New', monospace", letterSpacing: "0.5px",
              }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
              padding: "8px 18px",
              background: input.trim() && !loading
                ? darkMode
                  ? "linear-gradient(135deg, #0066cc, #00c8ff)"
                  : "linear-gradient(135deg, #00a86b, #00d48a)"
                : accentFaint,
              border: "none", borderRadius: "6px",
              color: input.trim() && !loading ? "#fff" : darkMode ? "rgba(0,200,255,0.3)" : "rgba(0,168,107,0.4)",
              fontSize: "11px", letterSpacing: "2px",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              fontFamily: "'Courier New', monospace", fontWeight: "700", transition: "all 0.2s",
            }}>
              ▶ ANALYSER
            </button>
          </div>
          <div style={{
            textAlign: "center", fontSize: "9px",
            color: darkMode ? "rgba(0,200,255,0.25)" : "rgba(0,168,107,0.35)",
            marginTop: "6px", letterSpacing: "2px",
          }}>
            SOCILIS · SECURE CHATBOT BY MOBILIS · USAGE INTERNE UNIQUEMENT
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes pulse2 {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,168,107,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}