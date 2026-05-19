import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// ✏️  CONFIGURACIÓN — editá estos valores
// ═══════════════════════════════════════════════════════════════════════════
const APP_NAME     = "GlobalMeet";
const APP_SLOGAN   = "Reuniones sin fronteras · Traducción simultánea";
const SUPPORT_EMAIL = "germanmomentos@gmail.com";
const MAX_FILE_MB  = 48;

const PRECIOS = {
  basic:      { mensual: 14900, anual: 143040  },
  pro:        { mensual: 24900, anual: 239040  },
  enterprise: { mensual: 44900, anual: 431040  },
  auricular:  { mensual: 59900, anual: 575040  },
};
const MP_LINKS = {
  basic:      "https://mpago.la/BASIC_LINK",
  pro:        "https://mpago.la/PRO_LINK",
  enterprise: "https://mpago.la/ENTERPRISE_LINK",
  auricular:  "https://mpago.la/AURICULAR_LINK",
};
// ═══════════════════════════════════════════════════════════════════════════

// ✏️  EMAILJS — servicio gratuito para notificaciones de pago
// Registrate en emailjs.com, creá un servicio Gmail y una plantilla.
// La plantilla debe tener estas variables: {{user_email}}, {{user_name}},
// {{plan_name}}, {{billing}}, {{timestamp}}, {{admin_url}}
const EMAILJS_SERVICE_ID  = "TU_SERVICE_ID";   // ← de emailjs.com
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";  // ← de emailjs.com
const EMAILJS_PUBLIC_KEY  = "TU_PUBLIC_KEY";   // ← de emailjs.com

// ── Notificación cuando alguien hace clic en Pagar ────────────────────────────
async function notifyPaymentAttempt(userEmail, userName, planName, billing) {
  try {
    // Guardar en log local siempre
    const log = JSON.parse(localStorage.getItem("gm_payment_log") || "[]");
    log.unshift({
      userEmail: userEmail || "No registrado",
      userName:  userName  || "Usuario nuevo",
      plan:      planName,
      billing:   billing === "annual" ? "Anual" : "Mensual",
      date:      new Date().toLocaleString("es-AR"),
      status:    "pending",
    });
    localStorage.setItem("gm_payment_log", JSON.stringify(log.slice(0, 100)));

    // Enviar email via EmailJS si está configurado
    if (EMAILJS_SERVICE_ID !== "TU_SERVICE_ID") {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id:  EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id:     EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email:   SUPPORT_EMAIL,
            from_name:  APP_NAME,
            user_email: userEmail || "No registrado aún",
            user_name:  userName  || "Usuario nuevo",
            plan_name:  planName,
            billing:    billing === "annual" ? "Anual" : "Mensual",
            timestamp:  new Date().toLocaleString("es-AR"),
            admin_url:  window.location.origin + "/admin",
          }
        })
      });
    }
  } catch (e) {
    console.warn("Notificación de pago:", e);
  }
}


// ── Responsive hook ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { isMobile: w < 640, isTablet: w < 1024, w };
}

// ── Browser detection ─────────────────────────────────────────────────────────
const BROWSER = (() => {
  const ua = navigator.userAgent;
  const isIOS    = /iPad|iPhone|iPod/.test(ua);
  const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);
  const isEdge   = /Edg/.test(ua);
  const isFF     = /Firefox/.test(ua);
  const isSafari = /Safari/.test(ua) && !isChrome && !isEdge;
  const hasSpeech = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  return {
    micOk: hasSpeech && !isIOS,
    micWarning: isIOS ? "iPhone/iPad: usá el teclado para escribir tu mensaje."
      : (isFF || isSafari) ? "Navegador sin micrófono. Usá Chrome o Edge." : null,
  };
})();

const LANGUAGES = [
  { code: "es", label: "Español",   display: "Español (Spanish)",    flag: "🇪🇸", bcp: "es-ES" },
  { code: "en", label: "English",   display: "English (Inglés)",      flag: "🇺🇸", bcp: "en-US" },
  { code: "pt", label: "Português", display: "Português (Portugués)", flag: "🇧🇷", bcp: "pt-BR" },
  { code: "fr", label: "Français",  display: "Français (Francés)",    flag: "🇫🇷", bcp: "fr-FR" },
  { code: "de", label: "Deutsch",   display: "Deutsch (Alemán)",      flag: "🇩🇪", bcp: "de-DE" },
  { code: "it", label: "Italiano",  display: "Italiano (Italiano)",   flag: "🇮🇹", bcp: "it-IT" },
  { code: "ja", label: "日本語",    display: "日本語 (Japonés)",       flag: "🇯🇵", bcp: "ja-JP" },
  { code: "zh", label: "中文",      display: "中文 (Chino)",           flag: "🇨🇳", bcp: "zh-CN" },
  { code: "ar", label: "العربية",  display: "العربية (Árabe)",        flag: "🇸🇦", bcp: "ar-SA" },
  { code: "ru", label: "Русский",   display: "Русский (Ruso)",         flag: "🇷🇺", bcp: "ru-RU" },
];

const PLANS = [
  { id: "trial",      name: "Prueba",     emoji: "🎁", badge: "14 días gratis", priceMonthly: 0,                         priceAnnual: 0,                         color: "#64748b", accent: "#94a3b8", participants: 2, hasVideo: false, hasEarpiece: false, mpLink: null,                  usd: null,
    features: ["2 participantes", "Traducción en tiempo real", "10 idiomas", "Sin tarjeta de crédito"] },
  { id: "basic",      name: "Básico",     emoji: "💼", badge: "Más popular",    priceMonthly: PRECIOS.basic.mensual,      priceAnnual: PRECIOS.basic.anual,       color: "#2563eb", accent: "#60a5fa", participants: 2, hasVideo: false, hasEarpiece: false, mpLink: MP_LINKS.basic,        usd: "~USD 10",
    features: ["2 participantes", "Conversaciones ilimitadas", "10 idiomas", "Link compartible", "Historial", "Notificaciones email"] },
  { id: "pro",        name: "Pro",        emoji: "🚀", badge: "Trilingüe",      priceMonthly: PRECIOS.pro.mensual,        priceAnnual: PRECIOS.pro.anual,         color: "#7c3aed", accent: "#a78bfa", participants: 3, hasVideo: false, hasEarpiece: false, mpLink: MP_LINKS.pro,          usd: "~USD 17",
    features: ["3 participantes", "Conversaciones ilimitadas", "10 idiomas", "Link compartible", "Historial", "Notificaciones email", "Soporte prioritario"] },
  { id: "enterprise", name: "Enterprise", emoji: "🎥", badge: "Video + Chat",   priceMonthly: PRECIOS.enterprise.mensual, priceAnnual: PRECIOS.enterprise.anual,  color: "#0f766e", accent: "#2dd4bf", participants: 3, hasVideo: true,  hasEarpiece: false, mpLink: MP_LINKS.enterprise,   usd: "~USD 32",
    features: ["3 participantes", "📹 Videollamada Jitsi", "💬 Chat traductor", "🖥️ Compartir pantalla", `📁 Archivos hasta ${MAX_FILE_MB}MB`, "10 idiomas", "Soporte 24/7"] },
  { id: "auricular",  name: "Auricular",  emoji: "🎧", badge: "Nuevo · Voz IA", priceMonthly: PRECIOS.auricular.mensual, priceAnnual: PRECIOS.auricular.anual,   color: "#b45309", accent: "#fbbf24", participants: 3, hasVideo: false, hasEarpiece: true,  mpLink: MP_LINKS.auricular,    usd: "~USD 42",
    features: ["3 participantes", "🎧 Traducción simultánea por auricular", "🗣️ Voz masculina o femenina", "🎙️ Comando 'Hola GlobalMeet'", "Manos libres · sin tocar pantalla", "10 idiomas en tiempo real", "Funciona con cualquier auricular Bluetooth", "Soporte 24/7"] },
];

const SPK = {
  A: { base: "#1d4ed8", light: "#60a5fa", bg: "rgba(29,78,216,0.18)",  border: "rgba(96,165,250,0.3)"  },
  B: { base: "#be185d", light: "#f472b6", bg: "rgba(190,24,93,0.18)",  border: "rgba(244,114,182,0.3)" },
  C: { base: "#047857", light: "#34d399", bg: "rgba(4,120,87,0.18)",   border: "rgba(52,211,153,0.3)"  },
};

// ── Utils ─────────────────────────────────────────────────────────────────────
const fmt      = n => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
const nowTime  = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const genCode  = () => Math.random().toString(36).substring(2, 8).toUpperCase();
const addDays  = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const daysDiff = (a, b) => Math.ceil((b - a) / 86400000);
const isTrialExpired = u => u && new Date() > addDays(u.joinedAt, 14);

async function claudeTranslate(text, fromLabel, toLabel, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal,
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: `Professional business interpreter. Translate from ${fromLabel} to ${toLabel}. Output ONLY the translation, no explanations.`,
          messages: [{ role: "user", content: text }] }),
      });
      clearTimeout(t);
      const d = await res.json();
      return d?.content?.[0]?.text ?? "⚠️ Sin respuesta";
    } catch (e) {
      if (i === retries) return e.name === "AbortError" ? "⚠️ Tiempo agotado." : "⚠️ Error de conexión.";
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputSt = {
  background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
  color: "#e2e8f0", borderRadius: "8px", padding: "10px 13px",
  fontSize: ".88rem", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box",
};

// ── Logo ──────────────────────────────────────────────────────────────────────
function AppLogo({ size = 40, withText = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: withText ? "9px" : 0, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#2dd4bf"/>
          </linearGradient>
          <linearGradient id="lg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/>
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="24" fill="url(#lg1)" opacity="0.12"/>
        <rect x="4" y="10" width="22" height="14" rx="7" fill="url(#lg1)"/>
        <rect x="4" y="20" width="8" height="8" rx="2" fill="url(#lg1)" transform="rotate(45 8 24)"/>
        <rect x="22" y="24" width="22" height="14" rx="7" fill="url(#lg2)"/>
        <rect x="36" y="28" width="8" height="8" rx="2" fill="url(#lg2)" transform="rotate(45 40 34)"/>
        <text x="7" y="20" fontSize="9" fill="white" fontFamily="Arial" fontWeight="bold">A</text>
        <text x="27" y="34" fontSize="9" fill="white" fontFamily="Arial" fontWeight="bold">文</text>
        <path d="M18 17L21 17 M20 15L22 17L20 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".8"/>
        <path d="M30 31L27 31 M28 29L26 31L28 33" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".8"/>
      </svg>
      {withText && (
        <div>
          <div style={{ color: "#f1f5f9", fontWeight: "700", fontSize: size > 32 ? "1rem" : ".82rem", lineHeight: 1.1 }}>{APP_NAME}</div>
          {size > 28 && <div style={{ color: "#334155", fontSize: ".58rem", letterSpacing: ".08em" }}>by Momentos</div>}
        </div>
      )}
    </div>
  );
}

function MPLogo({ size = 18 }) {
  return (
    <svg width={size * 2.4} height={size} viewBox="0 0 88 40" fill="none">
      <rect width="88" height="40" rx="8" fill="#009EE3"/>
      <circle cx="20" cy="20" r="12" fill="white"/>
      <path d="M14 20L18 16L20 19L23 14L26 20" stroke="#009EE3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="36" y="15" fontSize="7" fill="white" fontFamily="Arial" fontWeight="600">Mercado</text>
      <text x="36" y="26" fontSize="7" fill="white" fontFamily="Arial" fontWeight="600">Pago</text>
    </svg>
  );
}

function Waveform({ active, color, bars = 5 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "16px" }}>
      <style>{`@keyframes wv{0%,100%{transform:scaleY(.2)}50%{transform:scaleY(1)}}`}</style>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{ width: "3px", height: "100%", background: color, borderRadius: "2px", transformOrigin: "center", transform: active ? undefined : "scaleY(.2)", animation: active ? `wv .8s ease-in-out ${i*.1}s infinite` : "none", opacity: active ? 1 : 0.3 }} />
      ))}
    </div>
  );
}

function LangSelect({ value, onChange, exclude = [] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", color: "#e2e8f0", borderRadius: "8px", padding: "7px 8px", fontSize: ".8rem", cursor: "pointer", outline: "none", fontFamily: "inherit", flex: 1, minWidth: 0 }}>
      {LANGUAGES.filter(l => !exclude.includes(l.code) || l.code === value).map(l => (
        <option key={l.code} value={l.code} style={{ background: "#1e293b" }}>{l.flag} {l.display}</option>
      ))}
    </select>
  );
}

function BrowserBanner() {
  const [off, setOff] = useState(false);
  if (!BROWSER.micWarning || off) return null;
  return (
    <div style={{ background: "rgba(217,119,6,.15)", borderBottom: "1px solid rgba(217,119,6,.3)", padding: "8px 14px", display: "flex", gap: "8px", alignItems: "center", fontSize: ".76rem", color: "#fbbf24" }}>
      <span style={{ flexShrink: 0 }}>⚠️</span>
      <span style={{ flex: 1 }}>{BROWSER.micWarning}</span>
      <button onClick={() => setOff(true)} style={{ background: "none", border: "none", color: "#92400e", cursor: "pointer", flexShrink: 0 }}>✕</button>
    </div>
  );
}

function TextInputFallback({ onSubmit, placeholder }) {
  const [text, setText] = useState("");
  const go = () => { if (text.trim()) { onSubmit(text.trim()); setText(""); } };
  return (
    <div style={{ display: "flex", gap: "7px", padding: "8px 10px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
      <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} placeholder={placeholder} style={{ ...inputSt, flex: 1, padding: "7px 10px", fontSize: ".78rem" }} />
      <button onClick={go} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", border: "none", color: "#fff", borderRadius: "7px", padding: "7px 12px", cursor: "pointer", fontSize: ".78rem", fontFamily: "inherit", flexShrink: 0 }}>↑</button>
    </div>
  );
}

function TrialExpiredWall({ onGoPlans }) {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: "380px", width: "100%", textAlign: "center", background: "rgba(255,255,255,.04)", border: "1px solid rgba(239,68,68,.3)", borderRadius: "20px", padding: "36px 24px" }}>
        <div style={{ fontSize: "2.8rem", marginBottom: "14px" }}>⏰</div>
        <AppLogo size={36} withText />
        <h2 style={{ color: "#f1f5f9", fontSize: "1.15rem", fontWeight: "600", margin: "16px 0 8px" }}>Tu prueba finalizó</h2>
        <p style={{ color: "#64748b", fontSize: ".82rem", margin: "0 0 22px", lineHeight: "1.6" }}>Los 14 días gratis terminaron. Elegí un plan para continuar sin interrupciones.</p>
        <button onClick={onGoPlans} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", border: "none", color: "#fff", borderRadius: "10px", padding: "13px", fontSize: ".9rem", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", width: "100%", marginBottom: "10px" }}>Ver planes →</button>
        <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "#475569", fontSize: ".72rem", textDecoration: "none" }}>¿Problemas? Contactá soporte</a>
      </div>
    </div>
  );
}

function FileUploader({ onFile }) {
  const ref = useRef(null);
  const handle = e => {
    const file = e.target.files[0]; if (!file) return;
    const mb = file.size / 1024 / 1024;
    if (mb > MAX_FILE_MB) { alert(`El archivo pesa ${mb.toFixed(1)} MB. Máximo: ${MAX_FILE_MB} MB.`); e.target.value = ""; return; }
    onFile({ name: file.name, url: URL.createObjectURL(file), size: mb < 1 ? (file.size/1024).toFixed(0)+" KB" : mb.toFixed(1)+" MB", time: nowTime() });
    e.target.value = "";
  };
  return (
    <>
      <input ref={ref} type="file" style={{ display: "none" }} onChange={handle} />
      <button onClick={() => ref.current?.click()} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#94a3b8", borderRadius: "7px", padding: "5px 9px", cursor: "pointer", fontSize: ".66rem", fontFamily: "inherit" }}>📁</button>
    </>
  );
}

function JitsiFrame({ roomCode }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const url = `https://meet.jit.si/GlobalMeet-${roomCode}`;
  return (
    <div style={{ flex: 1, position: "relative", background: "#000", minHeight: "220px" }}>
      {!loaded && !error && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "#475569" }}>
          <div style={{ width: "24px", height: "24px", border: "3px solid rgba(45,212,191,.2)", borderTopColor: "#2dd4bf", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <span style={{ fontSize: ".76rem" }}>Cargando videollamada…</span>
        </div>
      )}
      {error && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "20px", textAlign: "center" }}>
          <span style={{ fontSize: "1.8rem" }}>📹</span>
          <a href={url} target="_blank" rel="noreferrer" style={{ color: "#2dd4bf", fontSize: ".8rem" }}>Abrir en nueva pestaña →</a>
          <span style={{ color: "#334155", fontSize: ".68rem" }}>Sala: GlobalMeet-{roomCode}</span>
        </div>
      )}
      <iframe src={url} allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation allow-downloads" style={{ width: "100%", height: "100%", border: "none", minHeight: "220px", opacity: loaded ? 1 : 0 }} title="Jitsi" onLoad={() => setLoaded(true)} onError={() => setError(true)} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LANDING
// ══════════════════════════════════════════════════════════════════════════════
function LandingScreen({ onLogin, onTrial }) {
  const [billing, setBilling] = useState("monthly");
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0", overflowX: "hidden" }}>
      <style>{`
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .pcard{transition:transform .25s,box-shadow .25s;} @media(hover:hover){.pcard:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,.5);}}
        .mpbtn{transition:opacity .2s;} @media(hover:hover){.mpbtn:hover{opacity:.82;}}
      `}</style>
      <BrowserBanner />

      {/* Hero */}
      <div style={{ textAlign: "center", padding: isMobile ? "48px 20px 32px" : "64px 24px 44px", background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(99,102,241,.15) 0%,transparent 70%)", animation: "fadeIn .8s ease" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px", animation: "floatY 4s ease-in-out infinite" }}>
          <AppLogo size={isMobile ? 56 : 72} />
        </div>
        <h1 style={{ fontSize: isMobile ? "2.2rem" : "clamp(2.2rem,5vw,3.4rem)", fontWeight: "400", fontStyle: "italic", letterSpacing: ".06em", margin: "0 0 6px", color: "#f1f5f9", textShadow: "0 0 60px rgba(99,102,241,.4)" }}>
          {APP_NAME}
        </h1>
        <p style={{ color: "#64748b", fontSize: isMobile ? ".82rem" : ".9rem", margin: "0 0 4px", lineHeight: 1.5 }}>{APP_SLOGAN}</p>
        <p style={{ color: "#1e293b", fontSize: ".65rem", margin: "0 0 20px", letterSpacing: ".1em" }}>DISEÑADO POR MOMENTOS</p>
        {BROWSER.micWarning && <p style={{ color: "#d97706", fontSize: ".73rem", margin: "0 0 14px" }}>⚠️ {BROWSER.micWarning}</p>}
        <button onClick={onLogin} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", border: "none", color: "#fff", borderRadius: "12px", padding: isMobile ? "13px 24px" : "13px 30px", fontSize: ".92rem", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 28px rgba(99,102,241,.45)", touchAction: "manipulation" }}>
          Iniciar sesión con Google →
        </button>
        <p style={{ marginTop: "10px", color: "#334155", fontSize: ".72rem" }}>14 días gratis · Sin tarjeta de crédito</p>
      </div>

      {/* Billing toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        {["monthly","annual"].map(b => (
          <button key={b} onClick={() => setBilling(b)} style={{ background: billing===b ? "rgba(99,102,241,.2)" : "transparent", border: billing===b ? "1px solid rgba(99,102,241,.5)" : "1px solid rgba(255,255,255,.08)", color: billing===b ? "#a5b4fc" : "#475569", padding: "7px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: ".8rem", borderRadius: b==="monthly" ? "8px 0 0 8px" : "0 8px 8px 0", transition: "all .2s", touchAction: "manipulation" }}>
            {b === "monthly" ? "Mensual" : "Anual −15%"}
          </button>
        ))}
      </div>

      {/* Plans — horizontal scroll */}
      <div style={{ padding: "0 16px 52px" }}>
        <div style={{
          display: "flex", gap: "14px",
          overflowX: "auto",
          paddingBottom: "16px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          maxWidth: "100%",
        }}>
          {PLANS.map(plan => {
            const perMonth = billing==="annual" ? Math.round(plan.priceAnnual/12) : plan.priceMonthly;
            const saving   = plan.priceMonthly*12 - plan.priceAnnual;
            const isEnt = plan.id==="enterprise"; const isPro = plan.id==="pro";
            return (
              <div key={plan.id} className="pcard" style={{
                flex: "0 0 200px",
                minWidth: "200px",
                maxWidth: isMobile ? "82vw" : "210px",
                scrollSnapAlign: "start",
                background: isEnt ? "linear-gradient(160deg,rgba(15,118,110,.3),rgba(15,23,42,.9))" : isPro ? "linear-gradient(160deg,rgba(124,58,237,.2),rgba(15,23,42,.9))" : "rgba(255,255,255,.03)",
                border: `1px solid ${isEnt?"rgba(45,212,191,.4)":isPro?"rgba(167,139,250,.35)":"rgba(255,255,255,.07)"}`,
                borderRadius: "18px", padding: "22px 18px", position: "relative", overflow: "hidden",
                boxShadow: isEnt?"0 0 40px rgba(45,212,191,.12)":isPro?"0 0 30px rgba(124,58,237,.12)":"none",
              }}>
                {(isEnt||isPro) && <span style={{ position:"absolute", top:"11px", right:"11px", background:`linear-gradient(135deg,${plan.color},${plan.accent})`, borderRadius:"20px", padding:"2px 9px", fontSize:".58rem", fontWeight:"700", color:"#fff", letterSpacing:".08em" }}>{isEnt?"⭐ NUEVO":"⭐ TOP"}</span>}
                <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>{plan.emoji}</div>
                <div style={{ fontSize: "1.05rem", fontWeight: "600", color: "#f1f5f9", marginBottom: "4px" }}>{plan.name}</div>
                <span style={{ background:`${plan.accent}22`, border:`1px solid ${plan.accent}44`, color:plan.accent, borderRadius:"20px", padding:"2px 9px", fontSize:".62rem", fontWeight:"600" }}>{plan.badge}</span>
                <div style={{ margin: "14px 0 10px" }}>
                  {plan.priceMonthly===0 ? (
                    <div style={{ fontSize:"1.7rem", fontWeight:"700", color:"#94a3b8" }}>Gratis</div>
                  ) : (
                    <>
                      <div style={{ fontSize:"1.6rem", fontWeight:"700", color:"#f1f5f9" }}>{fmt(perMonth)}<span style={{ fontSize:".76rem", color:"#64748b", fontWeight:"400" }}>/mes</span></div>
                      {plan.usd && <div style={{ fontSize:".66rem", color:"#334155", marginTop:"2px" }}>{plan.usd}</div>}
                      {billing==="annual" && <div style={{ fontSize:".68rem", color:"#64748b" }}>{fmt(plan.priceAnnual)}/año · ahorrás {fmt(saving)}</div>}
                    </>
                  )}
                </div>
                <div style={{ fontSize:".67rem", color:"#475569", marginBottom:"12px" }}>👥 {plan.participants} participante{plan.participants>1?"s":""}{plan.hasVideo?" · 📹":""}</div>
                <ul style={{ listStyle:"none", padding:0, margin:"0 0 18px", display:"flex", flexDirection:"column", gap:"6px" }}>
                  {plan.features.map((f,i) => <li key={i} style={{ display:"flex", gap:"6px", fontSize:".75rem", color:"#94a3b8", lineHeight:"1.4" }}><span style={{ color:plan.accent, flexShrink:0 }}>✓</span>{f}</li>)}
                </ul>
                {plan.priceMonthly===0 ? (
                  <button onClick={onTrial} style={{ width:"100%", padding:"11px", borderRadius:"10px", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", color:"#94a3b8", cursor:"pointer", fontFamily:"inherit", fontSize:".82rem", fontWeight:"600", touchAction:"manipulation" }}>
                    Empezar gratis
                  </button>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    <a href={plan.mpLink} target="_blank" rel="noreferrer" className="mpbtn"
                      onClick={() => notifyPaymentAttempt(null, null, plan.name, billing)}
                      style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"9px", padding:"10px", borderRadius:"10px", background:"#009EE3", color:"#fff", textDecoration:"none", fontFamily:"inherit", fontSize:".8rem", fontWeight:"600", touchAction:"manipulation" }}>
                      <MPLogo size={15}/><span>Pagar con Mercado Pago</span>
                    </a>
                    <div style={{ textAlign:"center", color:"#1e293b", fontSize:".62rem", lineHeight:"1.4" }}>Pagá → ingresá con Google → enviá comprobante a {SUPPORT_EMAIL}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {<p style={{ textAlign:"center", color:"#334155", fontSize:".68rem", margin:"6px 0 0" }}>← Deslizá para ver todos los planes →</p>}
      </div>

      <div style={{ textAlign:"center", color:"#1e293b", fontSize:".65rem", paddingBottom:"28px", letterSpacing:".1em" }}>
        {APP_NAME} · DISEÑADO POR MOMENTOS · POWERED BY CLAUDE AI
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email,setEmail]=useState(""); const [name,setName]=useState(""); const [step,setStep]=useState("form"); const [err,setErr]=useState("");
  const go = () => {
    if (!name.trim()) { setErr("Ingresá tu nombre."); return; }
    if (!email.includes("@")||!email.includes(".")) { setErr("Email inválido."); return; }
    setErr(""); setStep("loading");
    setTimeout(() => onLogin({ email: email.trim().toLowerCase(), name: name.trim() }), 1400);
  };
  return (
    <div style={{ minHeight:"100vh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"20px" }}>
      <div style={{ width:"100%", maxWidth:"380px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"20px", padding:"32px 24px", boxShadow:"0 25px 60px rgba(0,0,0,.6)" }}>
        <div style={{ textAlign:"center", marginBottom:"22px" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"12px" }}><AppLogo size={48} withText /></div>
          <p style={{ color:"#475569", fontSize:".8rem", margin:0 }}>Ingresá con tu cuenta Google</p>
        </div>
        {step==="loading" ? (
          <div style={{ textAlign:"center", padding:"20px 0", color:"#64748b" }}>
            <div style={{ fontSize:"1.4rem", marginBottom:"8px" }}>⏳</div>
            <div style={{ fontSize:".84rem" }}>Verificando…</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {err && <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:"8px", padding:"8px 12px", color:"#fca5a5", fontSize:".76rem" }}>⚠️ {err}</div>}
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre completo" style={inputSt} />
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@gmail.com" type="email" style={inputSt} onKeyDown={e=>e.key==="Enter"&&go()} />
            <button onClick={go} style={{ background:"linear-gradient(135deg,#4285f4,#34a853)", border:"none", color:"#fff", borderRadius:"10px", padding:"13px", fontSize:".9rem", fontWeight:"600", cursor:"pointer", fontFamily:"inherit", touchAction:"manipulation" }}>
              <span style={{ fontWeight:"900" }}>G</span>  Continuar con Google
            </button>
            <p style={{ color:"#1e293b", fontSize:".68rem", textAlign:"center", margin:0 }}>Solo ingresás una vez · Sesión recordada</p>
          </div>
        )}
        <div style={{ textAlign:"center", color:"#1e293b", fontSize:".62rem", marginTop:"16px", letterSpacing:".08em" }}>DISEÑADO POR MOMENTOS</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ user, plan, onStartRoom, onGoPlans, onLogout }) {
  const { isMobile } = useBreakpoint();
  const planInfo = PLANS.find(p=>p.id===plan.id);
  const planEnd  = plan.id!=="trial" ? addDays(user.joinedAt,30) : addDays(user.joinedAt,14);
  const daysLeft = daysDiff(new Date(), planEnd);
  const isTrial  = plan.id==="trial";
  const canPro   = plan.id==="pro"||plan.id==="enterprise"||plan.id==="auricular";
  const canEnt   = plan.id==="enterprise";
  const canAur   = plan.id==="auricular";
  const notifs   = [];
  if (daysLeft<=7&&daysLeft>0) notifs.push({ t:"warn", m:`⚠️ Tu plan vence en ${daysLeft} día${daysLeft!==1?"s":""}. Renovalo pronto.` });
  if (daysLeft<=0&&!isTrial)   notifs.push({ t:"error", m:"🔴 Tu plan venció. Renovalo para seguir." });

  return (
    <div style={{ minHeight:"100vh", background:"#080c14", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#e2e8f0" }}>
      <BrowserBanner />
      {/* Topbar */}
      <div style={{ background:"rgba(15,23,42,.9)", borderBottom:"1px solid rgba(255,255,255,.07)", padding: isMobile?"11px 14px":"12px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:10 }}>
        <AppLogo size={28} withText />
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          {!isMobile && <span style={{ color:"#334155", fontSize:".74rem" }}>{user.email}</span>}
          <button onClick={onLogout} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"#64748b", borderRadius:"7px", padding:"5px 10px", cursor:"pointer", fontSize:".72rem", fontFamily:"inherit" }}>Salir</button>
        </div>
      </div>

      <div style={{ maxWidth:"820px", margin:"0 auto", padding: isMobile?"16px 14px":"28px 20px" }}>
        {notifs.map((n,i) => (
          <div key={i} style={{ background:n.t==="error"?"rgba(239,68,68,.1)":"rgba(217,119,6,.1)", border:`1px solid ${n.t==="error"?"rgba(239,68,68,.3)":"rgba(217,119,6,.3)"}`, borderRadius:"10px", padding:"10px 14px", marginBottom:"10px", fontSize:".8rem", color:n.t==="error"?"#fca5a5":"#fbbf24", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"8px" }}>
            <span>{n.m}</span>
            <button onClick={onGoPlans} style={{ background:"rgba(255,255,255,.08)", border:"none", color:"#fff", borderRadius:"6px", padding:"4px 10px", cursor:"pointer", fontSize:".7rem", fontFamily:"inherit", flexShrink:0 }}>Renovar →</button>
          </div>
        ))}

        {isTrial && (
          <div style={{ background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.25)", borderRadius:"10px", padding:"11px 14px", marginBottom:"14px" }}>
            <div style={{ color:"#a5b4fc", fontWeight:"600", fontSize:".78rem", marginBottom:"2px" }}>💳 ¿Ya pagaste?</div>
            <div style={{ color:"#475569", fontSize:".74rem" }}>Enviá tu comprobante a <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:"#818cf8" }}>{SUPPORT_EMAIL}</a> y activamos en menos de 24hs.</div>
          </div>
        )}

        <h1 style={{ fontSize: isMobile?"1.25rem":"1.4rem", fontWeight:"600", margin:"0 0 3px", color:"#f1f5f9" }}>Hola, {user.name} 👋</h1>
        <p style={{ color:"#475569", margin:"0 0 20px", fontSize:".8rem" }}>
          Plan {planInfo?.name} · {isTrial?`${Math.max(0,daysLeft)} días restantes`:`Vence ${planEnd?.toLocaleDateString("es-AR")}`}
        </p>

        {/* Plan card */}
        <div style={{ background:`linear-gradient(135deg,${planInfo?.color}18,rgba(255,255,255,.02))`, border:`1px solid ${planInfo?.color}44`, borderRadius:"13px", padding:"15px 18px", marginBottom:"18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
          <div>
            <div style={{ fontSize:".92rem", fontWeight:"600", marginBottom:"2px" }}>{planInfo?.emoji} Plan {planInfo?.name}</div>
            <div style={{ color:"#64748b", fontSize:".74rem" }}>{planInfo?.participants} participantes{planInfo?.hasVideo?" · 📹 Video":""}</div>
          </div>
          <button onClick={onGoPlans} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#94a3b8", borderRadius:"8px", padding:"6px 12px", cursor:"pointer", fontSize:".74rem", fontFamily:"inherit" }}>Cambiar ↗</button>
        </div>

        {/* Room buttons */}
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"13px", padding:"18px 16px", marginBottom:"12px" }}>
          <h2 style={{ fontSize:".9rem", fontWeight:"600", margin:"0 0 13px", color:"#f1f5f9" }}>Nueva conversación</h2>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(4,1fr)", gap:"10px" }}>
            <RoomBtn icon="👥" label="2 Participantes" desc="Bilingüe"   color="#2563eb" available onClick={()=>onStartRoom(2,false,false)} />
            <RoomBtn icon="👨‍👩‍👧" label="3 Participantes" desc="Trilingüe"  color="#7c3aed" available={canPro} locked={!canPro} onUpgrade={onGoPlans} onClick={()=>onStartRoom(3,false,false)} />
            <RoomBtn icon="🎥"  label="Video + Chat"   desc="Enterprise"  color="#0f766e" available={canEnt}  locked={!canEnt}  onUpgrade={onGoPlans} onClick={()=>onStartRoom(3,true,false)}  isNew />
            <RoomBtn icon="🎧"  label="Modo Auricular"  desc="Voz IA · manos libres" color="#b45309" available={canAur} locked={!canAur} onUpgrade={onGoPlans} onClick={()=>onStartRoom(2,false,true)} isNew style={{ gridColumn: isMobile?"1 / -1":"auto" }} />
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:"10px", padding:"12px 16px" }}>
          <p style={{ color:"#334155", fontSize:".73rem", margin:"0 0 3px" }}>📧 Notificaciones → <strong style={{ color:"#475569" }}>{user.email}</strong></p>
          <p style={{ color:"#1e293b", fontSize:".68rem", margin:0 }}>Soporte: <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:"#334155" }}>{SUPPORT_EMAIL}</a></p>
        </div>

        <div style={{ textAlign:"center", marginTop:"18px", color:"#1e293b", fontSize:".62rem", letterSpacing:".1em" }}>{APP_NAME} · DISEÑADO POR MOMENTOS</div>
      </div>
    </div>
  );
}

function RoomBtn({ icon, label, desc, color, available, locked, onClick, onUpgrade, isNew, style: extraStyle }) {
  return (
    <div style={{ background:locked?"rgba(255,255,255,.02)":`${color}18`, border:`1px solid ${locked?"rgba(255,255,255,.06)":`${color}44`}`, borderRadius:"11px", padding:"13px 11px", opacity:locked?.5:1, cursor:locked?"default":"pointer", position:"relative", transition:"all .2s", touchAction:"manipulation", ...extraStyle }} onClick={locked?undefined:onClick}>
      {isNew&&!locked && <span style={{ position:"absolute", top:"-8px", right:"9px", background:"#0f766e", color:"#fff", fontSize:".54rem", fontWeight:"700", padding:"2px 7px", borderRadius:"8px" }}>NUEVO</span>}
      <div style={{ fontSize:"1.3rem", marginBottom:"5px" }}>{icon}</div>
      <div style={{ fontWeight:"600", fontSize:".8rem", color:locked?"#475569":"#f1f5f9", marginBottom:"1px" }}>{label}</div>
      <div style={{ fontSize:".68rem", color:"#475569", marginBottom:locked?"8px":0 }}>{desc}</div>
      {locked && <button onClick={e=>{e.stopPropagation();onUpgrade();}} style={{ background:`linear-gradient(135deg,${color},#6366f1)`, border:"none", color:"#fff", borderRadius:"5px", padding:"4px 8px", fontSize:".65rem", cursor:"pointer", fontFamily:"inherit", fontWeight:"600" }}>Actualizar →</button>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM SETUP
// ══════════════════════════════════════════════════════════════════════════════
function RoomSetup({ count, hasVideo, hasEarpiece, user, onStart, onBack }) {
  const { isMobile } = useBreakpoint();
  const spks = ["A","B",...(count===3?["C"]:[])];
  const [names,setNames]=useState({ A:user.name, B:"Participante B", C:"Participante C" });
  const [langs,setLangs]=useState({ A:"es", B:"en", C:"fr" });
  const [roomCode]=useState(genCode);
  const [copied,setCopied]=useState(false);
  const roomLink=`${window.location.href.split("?")[0]}?room=${roomCode}`;
  const copyLink=()=>{ navigator.clipboard.writeText(roomLink); setCopied(true); setTimeout(()=>setCopied(false),2200); };
  const usedLangs=spk=>Object.entries(langs).filter(([k])=>k!==spk).map(([,v])=>v);

  return (
    <div style={{ minHeight:"100vh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"16px" }}>
      <div style={{ width:"100%", maxWidth:"480px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"18px", padding: isMobile?"20px 16px":"28px 24px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:".78rem", fontFamily:"inherit", padding:0, marginBottom:"13px" }}>← Volver</button>
        <div style={{ display:"flex", alignItems:"center", gap:"9px", marginBottom:"13px" }}>
          <AppLogo size={26} />
          <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:0 }}>{hasEarpiece?"🎧 Modo Auricular":hasVideo?"🎥 Video + Chat":`💬 Chat · ${count} participantes`}</h2>
        </div>
        {BROWSER.micWarning && <div style={{ background:"rgba(217,119,6,.1)", border:"1px solid rgba(217,119,6,.3)", borderRadius:"8px", padding:"7px 11px", marginBottom:"12px", color:"#fbbf24", fontSize:".72rem" }}>⚠️ {BROWSER.micWarning}</div>}
        {hasEarpiece && (
          <div style={{ background:"rgba(180,83,9,.1)", border:"1px solid rgba(251,191,36,.25)", borderRadius:"8px", padding:"9px 12px", marginBottom:"12px", color:"#fbbf24", fontSize:".74rem", lineHeight:"1.5" }}>
            🎧 Conectá tu auricular Bluetooth antes de iniciar. Decí <strong>"Hola GlobalMeet"</strong> para activar la escucha.
          </div>
        )}

        {/* Share link */}
        <div style={{ background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.25)", borderRadius:"9px", padding:"10px 12px", marginBottom:"14px" }}>
          <div style={{ color:"#818cf8", fontSize:".64rem", letterSpacing:".08em", marginBottom:"5px" }}>🔗 LINK PARA COMPARTIR</div>
          <div style={{ display:"flex", gap:"7px", alignItems:"center" }}>
            <div style={{ color:"#475569", fontSize:".7rem", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{roomLink}</div>
            <button onClick={copyLink} style={{ background:copied?"rgba(52,211,153,.15)":"rgba(99,102,241,.2)", border:`1px solid ${copied?"rgba(52,211,153,.3)":"rgba(99,102,241,.3)"}`, color:copied?"#34d399":"#818cf8", borderRadius:"6px", padding:"5px 9px", cursor:"pointer", fontSize:".68rem", fontFamily:"inherit", flexShrink:0, touchAction:"manipulation" }}>
              {copied?"✓ Copiado":"Copiar"}
            </button>
          </div>
        </div>

        {/* Participants */}
        <div style={{ display:"flex", flexDirection:"column", gap:"9px", marginBottom:"14px" }}>
          {spks.map(spk => {
            const c=SPK[spk];
            return (
              <div key={spk} style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:"9px", padding:"10px 12px" }}>
                <div style={{ color:c.light, fontSize:".63rem", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"6px" }}>Participante {spk}</div>
                <div style={{ display:"flex", gap:"7px" }}>
                  <input value={names[spk]} onChange={e=>setNames(p=>({...p,[spk]:e.target.value}))} style={{ ...inputSt, flex:"0 0 120px" }} placeholder="Nombre" />
                  <LangSelect value={langs[spk]} onChange={v=>setLangs(p=>({...p,[spk]:v}))} exclude={usedLangs(spk)} />
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={()=>onStart({names,langs,roomCode,count,hasVideo,hasEarpiece})} style={{ width:"100%", background:hasEarpiece?"linear-gradient(135deg,#b45309,#f59e0b)":hasVideo?"linear-gradient(135deg,#0f766e,#0d9488)":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"10px", padding:"12px", fontSize:".88rem", fontWeight:"600", cursor:"pointer", fontFamily:"inherit", touchAction:"manipulation" }}>
          {hasEarpiece?"🎧 Iniciar modo auricular →":hasVideo?"🎥 Iniciar videollamada →":"💬 Iniciar chat →"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT LOGIC HOOK
// ══════════════════════════════════════════════════════════════════════════════
function useChatLogic(config) {
  const [messages, setMessages]   = useState([]);
  const [activeSpk, setActiveSpk] = useState(null);
  const [interims, setInterims]   = useState({ A:"", B:"", C:"" });
  const recRef = useRef(null);
  const participants = ["A","B",...(config.count===3?["C"]:[])];

  useEffect(() => {
    const handler = e => {
      if (e.key===`room_${config.roomCode}`) {
        try {
          const data=JSON.parse(e.newValue);
          if (data?.msg) setMessages(prev => {
            const ex=prev.find(m=>m.id===data.msg.id);
            return ex ? prev.map(m=>m.id===data.msg.id?{...m,...data.msg}:m) : [...prev,data.msg];
          });
        } catch {}
      }
    };
    window.addEventListener("storage",handler);
    return ()=>window.removeEventListener("storage",handler);
  },[config.roomCode]);

  const broadcast = msg => { try { localStorage.setItem(`room_${config.roomCode}`,JSON.stringify({msg,ts:Date.now()})); } catch {} };

  const submitText = useCallback(async (spk, text) => {
    if (!text.trim()) return;
    const myLang=LANGUAGES.find(l=>l.code===config.langs[spk]);
    const others=participants.filter(p=>p!==spk);
    const otherLangs=Object.fromEntries(others.map(p=>[p,LANGUAGES.find(l=>l.code===config.langs[p])]));
    const id=Date.now(); const init=Object.fromEntries(others.map(p=>[p,""]));
    const msg={id,speaker:spk,speakerName:config.names[spk],speakerFlag:myLang?.flag,original:text.trim(),translations:init,targetLangs:otherLangs,time:nowTime(),translating:true};
    setMessages(prev=>[...prev,msg]); broadcast(msg);
    await Promise.all(others.map(async p=>{
      const t=await claudeTranslate(text.trim(),myLang?.label,otherLangs[p]?.label);
      const upd={...msg,translations:{...msg.translations,[p]:t},translating:false};
      setMessages(prev=>prev.map(m=>m.id===id?upd:m)); broadcast(upd);
    }));
  },[config,participants]);

  const toggleMic = useCallback(async spk => {
    if (!BROWSER.micOk) return;
    if (activeSpk) { recRef.current?.stop(); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.lang=LANGUAGES.find(l=>l.code===config.langs[spk])?.bcp??"es-ES";
    rec.continuous=true; rec.interimResults=true;
    let final="";
    rec.onstart=()=>setActiveSpk(spk);
    rec.onerror=()=>{ setActiveSpk(null); setInterims(p=>({...p,[spk]:""})); };
    rec.onresult=e=>{
      let interim=""; final="";
      for(let i=e.resultIndex;i<e.results.length;i++){
        if(e.results[i].isFinal) final+=e.results[i][0].transcript+" ";
        else interim+=e.results[i][0].transcript;
      }
      setInterims(p=>({...p,[spk]:interim||final}));
    };
    rec.onend=async()=>{
      setActiveSpk(null); setInterims(p=>({...p,[spk]:""}));
      if (final.trim()) await submitText(spk,final.trim());
    };
    recRef.current=rec; rec.start();
  },[activeSpk,config,submitText]);

  return {messages,activeSpk,interims,participants,toggleMic,submitText};
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT ROOM
// ══════════════════════════════════════════════════════════════════════════════
function ChatRoom({ config, onBack }) {
  const { isMobile } = useBreakpoint();
  const {messages,activeSpk,interims,participants,toggleMic,submitText}=useChatLogic(config);
  const [copied,setCopied]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,interims]);
  const roomLink=`${window.location.href.split("?")[0]}?room=${config.roomCode}`;
  const copyLink=()=>{ navigator.clipboard.writeText(roomLink); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  // Mobile: show one mic at a time — tap to select which participant
  const [activeMobile, setActiveMobile] = useState(null);

  return (
    <div style={{ height:"100dvh", background:"#080c14", display:"flex", flexDirection:"column", fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:"hidden" }}>
      <BrowserBanner />
      {/* Header */}
      <div style={{ background:"rgba(8,12,20,.96)", borderBottom:"1px solid rgba(255,255,255,.07)", padding: isMobile?"9px 12px":"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", backdropFilter:"blur(10px)", flexShrink:0 }}>
        <AppLogo size={24} withText />
        <div style={{ display:"flex", gap:"6px" }}>
          <button onClick={copyLink} style={{ background:copied?"rgba(52,211,153,.1)":"rgba(99,102,241,.1)", border:`1px solid ${copied?"rgba(52,211,153,.3)":"rgba(99,102,241,.25)"}`, color:copied?"#34d399":"#818cf8", borderRadius:"7px", padding:"5px 9px", cursor:"pointer", fontSize:".66rem", fontFamily:"inherit", touchAction:"manipulation" }}>{copied?"✓":"🔗"}</button>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#475569", borderRadius:"7px", padding:"5px 9px", cursor:"pointer", fontSize:".66rem", fontFamily:"inherit", touchAction:"manipulation" }}>← Salir</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding: isMobile?"12px 12px 6px":"16px 14px 6px", maxWidth:"780px", width:"100%", margin:"0 auto", boxSizing:"border-box", WebkitOverflowScrolling:"touch" }}>
        {messages.length===0 && (
          <div style={{ textAlign:"center", color:"#1e293b", padding:"50px 0" }}>
            <AppLogo size={36} />
            <p style={{ color:"#334155", fontSize:".78rem", marginTop:"12px" }}>{BROWSER.micOk?"Presioná el micrófono para comenzar":"Escribí tu mensaje para comenzar"}</p>
          </div>
        )}
        {messages.map(msg=><ChatBubble key={msg.id} msg={msg} />)}
        {participants.map(spk=>interims[spk]&&activeSpk===spk?<InterimBubble key={spk} text={interims[spk]} speaker={spk}/>:null)}
        <div ref={bottomRef}/>
      </div>

      {/* Controls */}
      <div style={{ background:"rgba(8,12,20,.96)", borderTop:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
        {BROWSER.micOk ? (
          isMobile ? (
            // Mobile: compact mic bar
            <div style={{ padding:"10px 10px 12px" }}>
              {activeMobile === null ? (
                // Show participant selector
                <div style={{ display:"flex", gap:"8px" }}>
                  {participants.map(spk=>{
                    const c=SPK[spk]; const lang=LANGUAGES.find(l=>l.code===config.langs[spk]);
                    return (
                      <button key={spk} onClick={()=>setActiveMobile(spk)} style={{ flex:1, background:`${c.base}18`, border:`1px solid ${c.border}`, borderRadius:"12px", padding:"10px 6px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", fontFamily:"inherit", touchAction:"manipulation" }}>
                        <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:c.base, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".85rem" }}>🎤</div>
                        <div style={{ color:c.light, fontSize:".65rem", fontWeight:"600" }}>{config.names[spk].split(" ")[0]}</div>
                        <span style={{ color:"#334155", fontSize:".58rem" }}>{lang?.flag}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Active speaker mic
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  <MicBtn spk={activeMobile} config={config} activeSpk={activeSpk} toggleMic={toggleMic} />
                  <button onClick={()=>{ recRef?.current?.stop(); setActiveMobile(null); }} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#475569", borderRadius:"8px", padding:"7px", cursor:"pointer", fontSize:".72rem", fontFamily:"inherit" }}>
                    ← Cambiar participante
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Desktop: all mics visible
            <div style={{ display:"flex", gap:"8px", justifyContent:"center", maxWidth:"780px", margin:"0 auto", padding:"11px 14px 13px" }}>
              {participants.map(spk=><MicBtn key={spk} spk={spk} config={config} activeSpk={activeSpk} toggleMic={toggleMic}/>)}
            </div>
          )
        ) : (
          participants.map(spk=>{
            const lang=LANGUAGES.find(l=>l.code===config.langs[spk]);
            return <TextInputFallback key={spk} placeholder={`${config.names[spk]} — ${lang?.label}...`} onSubmit={t=>submitText(spk,t)}/>;
          })
        )}
        <div style={{ textAlign:"center", color:"#1e293b", fontSize:".55rem", paddingBottom:"6px", letterSpacing:".08em" }}>{APP_NAME} · MOMENTOS</div>
      </div>
    </div>
  );
}

// ── Need to pass recRef down for mobile stop
const recRef = { current: null };

function MicBtn({ spk, config, activeSpk, toggleMic }) {
  const c=SPK[spk]; const lang=LANGUAGES.find(l=>l.code===config.langs[spk]);
  const isA=activeSpk===spk; const isDis=activeSpk!==null&&!isA;
  return (
    <button onClick={()=>toggleMic(spk)} disabled={isDis} style={{ flex:1, background:isA?`${c.base}28`:"rgba(255,255,255,.03)", border:`1.5px solid ${isA?c.base:"rgba(255,255,255,.07)"}`, borderRadius:"12px", padding:"10px 7px", cursor:isDis?"not-allowed":"pointer", opacity:isDis?.25:1, transition:"all .2s", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", fontFamily:"inherit", touchAction:"manipulation" }}>
      <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:isA?c.base:"rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".88rem", boxShadow:isA?`0 0 14px ${c.base}88`:"none", transition:"all .2s" }}>{isA?"⏹":"🎤"}</div>
      <div style={{ color:isA?c.light:"#94a3b8", fontWeight:"600", fontSize:".7rem" }}>{config.names[spk]}</div>
      {isA?<Waveform active bars={5} color={c.light}/>:<span style={{ color:"#334155", fontSize:".58rem" }}>{lang?.flag} {lang?.label}</span>}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ENTERPRISE ROOM
// ══════════════════════════════════════════════════════════════════════════════
function EnterpriseRoom({ config, onBack }) {
  const { isMobile, isTablet } = useBreakpoint();
  const {messages,activeSpk,interims,participants,toggleMic,submitText}=useChatLogic(config);
  const [chatOpen, setChatOpen] = useState(!isMobile); // mobile: video first
  const [files,    setFiles]    = useState([]);
  const [copied,   setCopied]   = useState(false);
  const [screenMsg,setScreenMsg]= useState(null);
  const bottomRef=useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,interims]);
  const roomLink=`${window.location.href.split("?")[0]}?room=${config.roomCode}`;
  const copyLink=()=>{ navigator.clipboard.writeText(roomLink); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div style={{ height:"100dvh", background:"#070b10", display:"flex", flexDirection:"column", fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:"hidden" }}>
      <BrowserBanner />
      {/* Header */}
      <div style={{ background:"rgba(6,10,16,.96)", borderBottom:"1px solid rgba(45,212,191,.15)", padding: isMobile?"8px 11px":"9px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <AppLogo size={24} withText />
        <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
          <button onClick={copyLink} style={{ background:copied?"rgba(52,211,153,.12)":"rgba(45,212,191,.1)", border:`1px solid ${copied?"rgba(52,211,153,.3)":"rgba(45,212,191,.25)"}`, color:copied?"#34d399":"#2dd4bf", borderRadius:"6px", padding:"4px 8px", cursor:"pointer", fontSize:".62rem", fontFamily:"inherit", touchAction:"manipulation" }}>{copied?"✓":"🔗"}</button>
          <button onClick={()=>{ setScreenMsg("🖥️ En Jitsi: presioná el ícono de pantalla para compartir. Todos lo verán."); setTimeout(()=>setScreenMsg(null),5000); }} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", color:"#94a3b8", borderRadius:"6px", padding:"4px 8px", cursor:"pointer", fontSize:".62rem", fontFamily:"inherit" }}>🖥️</button>
          <FileUploader onFile={f=>setFiles(prev=>[...prev,f])}/>
          <button onClick={()=>setChatOpen(p=>!p)} style={{ background:"rgba(45,212,191,.1)", border:"1px solid rgba(45,212,191,.2)", color:"#2dd4bf", borderRadius:"6px", padding:"4px 8px", cursor:"pointer", fontSize:".62rem", fontFamily:"inherit" }}>{chatOpen?"💬 Chat ✓":"💬 Chat"}</button>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:"#475569", borderRadius:"6px", padding:"4px 8px", cursor:"pointer", fontSize:".62rem", fontFamily:"inherit" }}>← Salir</button>
        </div>
      </div>
      {screenMsg && <div style={{ background:"rgba(45,212,191,.1)", borderBottom:"1px solid rgba(45,212,191,.2)", padding:"7px 14px", color:"#2dd4bf", fontSize:".74rem", textAlign:"center" }}>{screenMsg}</div>}

      {/* Body */}
      <div style={{ flex:1, display:"flex", flexDirection: isMobile?"column":"row", overflow:"hidden", minHeight:0 }}>

        {/* Video */}
        <div style={{ flex: isMobile?(chatOpen?"0 0 45%":"1 1 100%"):(chatOpen?"1 1 55%":"1 1 100%"), display:"flex", flexDirection:"column", minHeight:0, transition:"flex .3s" }}>
          <JitsiFrame roomCode={config.roomCode}/>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div style={{
            flex: isMobile?"1 1 auto":"0 0 300px",
            borderTop: isMobile?"1px solid rgba(255,255,255,.07)":"none",
            borderLeft: isMobile?"none":"1px solid rgba(255,255,255,.07)",
            display:"flex", flexDirection:"column", background:"#080c14", overflow:"hidden",
          }}>
            {/* Files */}
            {files.length>0 && (
              <div style={{ padding:"7px 10px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", flexDirection:"column", gap:"4px", maxHeight:"80px", overflowY:"auto" }}>
                {files.map((f,i)=>(
                  <a key={i} href={f.url} download={f.name} style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"6px", padding:"4px 8px", textDecoration:"none" }}>
                    <span>📄</span>
                    <span style={{ color:"#94a3b8", fontSize:".68rem", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                    <span style={{ color:"#60a5fa", fontSize:".58rem" }}>↓</span>
                  </a>
                ))}
              </div>
            )}

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"10px 10px 4px", WebkitOverflowScrolling:"touch" }}>
              {messages.length===0 && <div style={{ textAlign:"center", color:"#1e293b", padding:"20px 0" }}><AppLogo size={28}/><p style={{ color:"#1e293b", fontSize:".7rem", marginTop:"8px" }}>{BROWSER.micOk?"Usá el micrófono":"Escribí abajo"}</p></div>}
              {messages.map(msg=><ChatBubble key={msg.id} msg={msg} compact/>)}
              {participants.map(spk=>interims[spk]&&activeSpk===spk?<InterimBubble key={spk} text={interims[spk]} speaker={spk}/>:null)}
              <div ref={bottomRef}/>
            </div>

            {/* Mic / text input */}
            <div style={{ padding:"8px 8px 9px", borderTop:"1px solid rgba(255,255,255,.06)", background:"rgba(8,12,20,.95)" }}>
              {BROWSER.micOk ? (
                <div style={{ display:"flex", gap:"5px" }}>
                  {participants.map(spk=>{
                    const c=SPK[spk]; const lang=LANGUAGES.find(l=>l.code===config.langs[spk]);
                    const isA=activeSpk===spk; const isDis=activeSpk!==null&&!isA;
                    return (
                      <button key={spk} onClick={()=>toggleMic(spk)} disabled={isDis} style={{ flex:1, background:isA?`${c.base}28`:"rgba(255,255,255,.03)", border:`1px solid ${isA?c.base:"rgba(255,255,255,.07)"}`, borderRadius:"9px", padding:"7px 4px", cursor:isDis?"not-allowed":"pointer", opacity:isDis?.25:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", fontFamily:"inherit", touchAction:"manipulation" }}>
                        <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:isA?c.base:"rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".75rem", boxShadow:isA?`0 0 10px ${c.base}88`:"none" }}>{isA?"⏹":"🎤"}</div>
                        <div style={{ color:isA?c.light:"#64748b", fontSize:".58rem", fontWeight:"600" }}>{config.names[spk].split(" ")[0]}</div>
                        {isA?<Waveform active bars={4} color={c.light}/>:<span style={{ color:"#1e293b", fontSize:".54rem" }}>{lang?.flag}</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                participants.map(spk=>{
                  const lang=LANGUAGES.find(l=>l.code===config.langs[spk]);
                  return <TextInputFallback key={spk} placeholder={`${config.names[spk]} — ${lang?.label}...`} onSubmit={t=>submitText(spk,t)}/>;
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bubbles ───────────────────────────────────────────────────────────────────
function ChatBubble({ msg, compact }) {
  const c=SPK[msg.speaker]; const isA=msg.speaker==="A";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:isA?"flex-start":"flex-end", marginBottom:compact?"8px":"12px", animation:"fadeIn .3s ease" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ fontSize:".58rem", color:c.light, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"2px", paddingLeft:"3px" }}>{msg.speakerName}</div>
      <div style={{ maxWidth:compact?"92%":"78%", background:c.bg, border:`1px solid ${c.border}`, borderRadius:isA?"4px 13px 13px 13px":"13px 4px 13px 13px", padding:compact?"7px 10px":"9px 12px", boxShadow:"0 2px 10px rgba(0,0,0,.3)" }}>
        <div style={{ color:"#e2e8f0", fontSize:compact?".78rem":".87rem", lineHeight:"1.5" }}>
          <span style={{ fontSize:".52rem", marginRight:"3px" }}>{msg.speakerFlag}</span>{msg.original}
        </div>
        {msg.translating && (
          <div style={{ marginTop:"4px", paddingTop:"4px", borderTop:"1px solid rgba(255,255,255,.06)", color:"#475569", fontSize:".68rem", display:"flex", alignItems:"center", gap:"4px" }}>
            <div style={{ width:"8px", height:"8px", border:"1.5px solid #334155", borderTopColor:"#94a3b8", borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            Traduciendo…
          </div>
        )}
        {!msg.translating && msg.translations && Object.entries(msg.translations).map(([spk,t])=>{
          const tc=SPK[spk]; const tl=msg.targetLangs?.[spk]; const isErr=t?.startsWith("⚠️");
          return (
            <div key={spk} style={{ marginTop:"4px", paddingTop:"4px", borderTop:"1px solid rgba(255,255,255,.05)", color:isErr?"#ef4444":tc?.light??"#94a3b8", fontSize:compact?".7rem":".75rem", fontStyle:isErr?"normal":"italic", lineHeight:"1.4" }}>
              <span style={{ fontSize:".5rem", marginRight:"3px" }}>{tl?.flag}</span>{t||<span style={{ color:"#334155" }}>…</span>}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize:".52rem", color:"#1e293b", marginTop:"2px", paddingLeft:"3px" }}>{msg.time}</div>
    </div>
  );
}

function InterimBubble({ text, speaker }) {
  const c=SPK[speaker];
  return (
    <div style={{ display:"flex", justifyContent:speaker==="A"?"flex-start":"flex-end", marginBottom:"6px" }}>
      <div style={{ maxWidth:"70%", background:c.bg, border:`1px dashed ${c.border}`, borderRadius:"8px", padding:"5px 10px", color:"#64748b", fontSize:".78rem", fontStyle:"italic" }}>
        {text}<span style={{ animation:"blink 1s infinite", marginLeft:"2px" }}>|</span>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EARPIECE ROOM — Modo Auricular con comando de voz y TTS
// ══════════════════════════════════════════════════════════════════════════════
const WAKE_WORD = "hola globalmeet";

const VOICE_OPTIONS = [
  { id: "female_es", label: "Femenina · Natural",  gender: "female", rate: 0.92, pitch: 1.1  },
  { id: "male_es",   label: "Masculina · Natural", gender: "male",   rate: 0.90, pitch: 0.85 },
  { id: "female_fast", label: "Femenina · Rápida", gender: "female", rate: 1.15, pitch: 1.1  },
  { id: "male_fast",   label: "Masculina · Rápido",gender: "male",   rate: 1.15, pitch: 0.85 },
];

function EarpieceRoom({ config, onBack }) {
  const { isMobile } = useBreakpoint();
  const [status,     setStatus]     = useState("waiting"); // waiting | listening | translating | speaking
  const [transcript, setTranscript] = useState("");
  const [lastMsg,    setLastMsg]    = useState(null);
  const [messages,   setMessages]   = useState([]);
  const [voiceId,    setVoiceId]    = useState("female_es");
  const [activeSpeaker, setActiveSpeaker] = useState("A");
  const [volume,     setVolume]     = useState(1);
  const [copied,     setCopied]     = useState(false);
  const recRef   = useRef(null);
  const speaking = useRef(false);
  const bottomRef = useRef(null);

  const participants = ["A", "B", ...(config.count === 3 ? ["C"] : [])];
  const roomLink = `${window.location.href.split("?")[0]}?room=${config.roomCode}`;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Get TTS voice based on selection and target language
  const getVoice = useCallback((langBcp) => {
    const opt = VOICE_OPTIONS.find(v => v.id === voiceId) || VOICE_OPTIONS[0];
    const voices = window.speechSynthesis.getVoices();
    const langCode = langBcp?.slice(0, 2) ?? "es";
    // Try to find matching gender + language
    const match = voices.find(v =>
      v.lang.startsWith(langCode) &&
      (opt.gender === "female" ? /female|mujer|woman/i.test(v.name) : /male|hombre|man/i.test(v.name))
    ) || voices.find(v => v.lang.startsWith(langCode)) || voices[0];
    return { voice: match, rate: opt.rate, pitch: opt.pitch };
  }, [voiceId]);

  // Speak translation
  const speak = useCallback((text, langBcp) => {
    if (!text || speaking.current) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const { voice, rate, pitch } = getVoice(langBcp);
    if (voice) utt.voice = voice;
    utt.rate = rate; utt.pitch = pitch; utt.volume = volume;
    speaking.current = true;
    setStatus("speaking");
    utt.onend  = () => { speaking.current = false; setStatus("waiting"); startListening(); };
    utt.onerror= () => { speaking.current = false; setStatus("waiting"); };
    window.speechSynthesis.speak(utt);
  }, [getVoice, volume]);

  // Main listen loop
  const startListening = useCallback(() => {
    if (!BROWSER.micOk) return;
    const SR  = window.SpeechRecognition || window.webkitSpeechRecognition;
    const spk = activeSpeaker;
    const myLang = LANGUAGES.find(l => l.code === config.langs[spk]);
    const others = participants.filter(p => p !== spk);
    const otherLangs = Object.fromEntries(others.map(p => [p, LANGUAGES.find(l => l.code === config.langs[p])]));

    const rec = new SR();
    rec.lang = myLang?.bcp ?? "es-ES";
    rec.continuous = false;
    rec.interimResults = true;

    let activated = false;
    let finalText = "";

    rec.onstart = () => setStatus("waiting");

    rec.onresult = (e) => {
      let interim = ""; finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      const full = (finalText || interim).toLowerCase().trim();

      // Detect wake word
      if (!activated && full.includes(WAKE_WORD)) {
        activated = true;
        setStatus("listening");
        setTranscript("");
        return;
      }
      if (activated) setTranscript(interim || finalText);
    };

    rec.onend = async () => {
      if (!activated || !finalText.trim()) { startListening(); return; }
      setTranscript("");
      setStatus("translating");

      // Translate to all other participants
      const translations = {};
      await Promise.all(others.map(async p => {
        const t = await claudeTranslate(finalText.trim(), myLang?.label, otherLangs[p]?.label);
        translations[p] = t;
      }));

      const msg = {
        id: Date.now(), speaker: spk,
        speakerName: config.names[spk], speakerFlag: myLang?.flag,
        original: finalText.trim(), translations,
        targetLangs: otherLangs, time: nowTime(),
      };
      setMessages(prev => [...prev, msg]);
      setLastMsg(msg);

      // Speak first translation
      const firstOther = others[0];
      if (translations[firstOther]) {
        speak(translations[firstOther], otherLangs[firstOther]?.bcp);
      } else {
        setStatus("waiting");
        startListening();
      }
    };

    rec.onerror = () => { setStatus("waiting"); setTimeout(startListening, 1000); };
    recRef.current = rec;
    rec.start();
  }, [activeSpeaker, config, participants, speak]);

  // Start on mount
  useEffect(() => {
    if (BROWSER.micOk) startListening();
    return () => { recRef.current?.stop(); window.speechSynthesis.cancel(); };
  }, []);

  // Restart when speaker changes
  useEffect(() => {
    recRef.current?.stop();
    window.speechSynthesis.cancel();
    speaking.current = false;
    if (BROWSER.micOk) setTimeout(startListening, 500);
  }, [activeSpeaker, voiceId]);

  const statusInfo = {
    waiting:     { icon: "👂", color: "#64748b", label: `Esperando "Hola GlobalMeet"...`  },
    listening:   { icon: "🎙️", color: "#22c55e", label: "Escuchando — hablá ahora"        },
    translating: { icon: "⚡", color: "#f59e0b", label: "Traduciendo..."                   },
    speaking:    { icon: "🔊", color: "#3b82f6", label: "Reproduciendo traducción"         },
  };
  const si = statusInfo[status];

  return (
    <div style={{ height: "100dvh", background: "#07080f", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.08)}}
        @keyframes wv{0%,100%{transform:scaleY(.2)}50%{transform:scaleY(1)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
      `}</style>

      {/* Header */}
      <div style={{ background: "rgba(7,8,15,.96)", borderBottom: "1px solid rgba(251,191,36,.15)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <AppLogo size={24} withText />
          <span style={{ background: "rgba(251,191,36,.15)", color: "#fbbf24", borderRadius: "20px", padding: "2px 9px", fontSize: ".62rem", fontWeight: "700" }}>🎧 AURICULAR</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => { navigator.clipboard.writeText(roomLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: copied ? "rgba(52,211,153,.12)" : "rgba(251,191,36,.1)", border: `1px solid ${copied ? "rgba(52,211,153,.3)" : "rgba(251,191,36,.25)"}`, color: copied ? "#34d399" : "#fbbf24", borderRadius: "7px", padding: "5px 9px", cursor: "pointer", fontSize: ".66rem", fontFamily: "inherit" }}>
            {copied ? "✓" : "🔗"}
          </button>
          <button onClick={() => { recRef.current?.stop(); window.speechSynthesis.cancel(); onBack(); }} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", color: "#475569", borderRadius: "7px", padding: "5px 9px", cursor: "pointer", fontSize: ".66rem", fontFamily: "inherit" }}>← Salir</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Status orb */}
        <div style={{ textAlign: "center", padding: isMobile ? "20px 16px 12px" : "28px 16px 16px", flexShrink: 0 }}>
          <div style={{ width: isMobile ? "90px" : "110px", height: isMobile ? "90px" : "110px", borderRadius: "50%", background: `radial-gradient(circle, ${si.color}44, ${si.color}11)`, border: `2px solid ${si.color}66`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "2.2rem" : "2.8rem", animation: status === "listening" ? "pulse 1.2s ease-in-out infinite" : status === "speaking" ? "pulse 0.8s ease-in-out infinite" : "none", boxShadow: `0 0 30px ${si.color}44` }}>
            {si.icon}
          </div>
          <div style={{ color: si.color, fontWeight: "600", fontSize: isMobile ? ".82rem" : ".9rem", marginBottom: "6px" }}>{si.label}</div>
          {transcript && (
            <div style={{ color: "#94a3b8", fontSize: ".78rem", fontStyle: "italic", maxWidth: "320px", margin: "0 auto", background: "rgba(255,255,255,.04)", borderRadius: "8px", padding: "7px 12px" }}>
              "{transcript}"
            </div>
          )}
          {/* Waveform when listening */}
          {(status === "listening" || status === "speaking") && (
            <div style={{ display: "flex", justifyContent: "center", gap: "3px", height: "24px", marginTop: "10px" }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ width: "3px", height: "100%", background: si.color, borderRadius: "2px", transformOrigin: "center", animation: `wv ${0.6 + i * 0.05}s ease-in-out ${i * 0.08}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        {/* Speaker selector */}
        <div style={{ padding: "0 14px 10px", flexShrink: 0 }}>
          <div style={{ color: "#334155", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "7px", textAlign: "center" }}>¿Quién habla?</div>
          <div style={{ display: "flex", gap: "7px", justifyContent: "center" }}>
            {participants.map(spk => {
              const c = SPK[spk]; const lang = LANGUAGES.find(l => l.code === config.langs[spk]);
              const isActive = activeSpeaker === spk;
              return (
                <button key={spk} onClick={() => setActiveSpeaker(spk)} style={{ flex: 1, maxWidth: "140px", background: isActive ? `${c.base}28` : "rgba(255,255,255,.03)", border: `1.5px solid ${isActive ? c.base : "rgba(255,255,255,.07)"}`, borderRadius: "11px", padding: "9px 7px", cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", touchAction: "manipulation" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: isActive ? c.base : "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".85rem", boxShadow: isActive ? `0 0 12px ${c.base}88` : "none" }}>🎤</div>
                  <div style={{ color: isActive ? c.light : "#64748b", fontSize: ".65rem", fontWeight: "600" }}>{config.names[spk].split(" ")[0]}</div>
                  <div style={{ color: "#334155", fontSize: ".58rem" }}>{lang?.flag} {lang?.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice + Volume settings */}
        <div style={{ padding: "0 14px 10px", display: "flex", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: "160px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ color: "#64748b", fontSize: ".65rem", letterSpacing: ".08em", marginBottom: "6px" }}>🔊 VOZ DE TRADUCCIÓN</div>
            <select value={voiceId} onChange={e => setVoiceId(e.target.value)} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "#e2e8f0", borderRadius: "7px", padding: "6px 9px", fontSize: ".78rem", outline: "none", fontFamily: "inherit", width: "100%" }}>
              {VOICE_OPTIONS.map(v => <option key={v.id} value={v.id} style={{ background: "#1e293b" }}>{v.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "130px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ color: "#64748b", fontSize: ".65rem", letterSpacing: ".08em", marginBottom: "6px" }}>🔉 VOLUMEN</div>
            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: "100%", accentColor: "#fbbf24" }} />
            <div style={{ color: "#334155", fontSize: ".62rem", textAlign: "right" }}>{Math.round(volume * 100)}%</div>
          </div>
        </div>

        {/* Hint */}
        <div style={{ margin: "0 14px 10px", background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.15)", borderRadius: "9px", padding: "9px 12px", flexShrink: 0 }}>
          <div style={{ color: "#fbbf24", fontSize: ".72rem", lineHeight: "1.5" }}>
            💡 Decí <strong>"Hola GlobalMeet"</strong> para activar · Luego hablá normalmente · La traducción se reproduce sola por el auricular
          </div>
        </div>

        {/* Messages log */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 8px", WebkitOverflowScrolling: "touch" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#1e293b", padding: "20px 0" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>🎧</div>
              <div style={{ fontSize: ".74rem", color: "#334155" }}>Las conversaciones traducidas aparecerán acá</div>
            </div>
          )}
          {messages.map(msg => {
            const c = SPK[msg.speaker]; const isA = msg.speaker === "A";
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isA ? "flex-start" : "flex-end", marginBottom: "10px", animation: "fadeIn .3s ease" }}>
                <div style={{ fontSize: ".58rem", color: c.light, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "2px" }}>{msg.speakerName}</div>
                <div style={{ maxWidth: "82%", background: c.bg, border: `1px solid ${c.border}`, borderRadius: isA ? "4px 12px 12px 12px" : "12px 4px 12px 12px", padding: "7px 10px" }}>
                  <div style={{ color: "#e2e8f0", fontSize: ".82rem" }}>{msg.speakerFlag} {msg.original}</div>
                  {Object.entries(msg.translations).map(([spk, t]) => {
                    const tc = SPK[spk]; const tl = msg.targetLangs?.[spk];
                    return <div key={spk} style={{ marginTop: "4px", paddingTop: "4px", borderTop: "1px solid rgba(255,255,255,.05)", color: tc?.light, fontSize: ".72rem", fontStyle: "italic" }}>{tl?.flag} {t}</div>;
                  })}
                </div>
                <div style={{ fontSize: ".52rem", color: "#1e293b", marginTop: "2px" }}>{msg.time}</div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "rgba(7,8,15,.96)", borderTop: "1px solid rgba(255,255,255,.06)", padding: "10px 14px 12px", flexShrink: 0, textAlign: "center" }}>
        <button onClick={() => { recRef.current?.stop(); window.speechSynthesis.cancel(); speaking.current = false; setTimeout(startListening, 300); }} style={{ background: "linear-gradient(135deg,#b45309,#f59e0b)", border: "none", color: "#fff", borderRadius: "10px", padding: "10px 24px", fontSize: ".82rem", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", touchAction: "manipulation" }}>
          🔄 Reiniciar escucha
        </button>
        <div style={{ color: "#1e293b", fontSize: ".58rem", marginTop: "6px", letterSpacing: ".08em" }}>{APP_NAME} · MODO AURICULAR · MOMENTOS</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,    setScreen]    = useState("landing");
  const [user,      setUser]      = useState(null);
  const [plan,      setPlan]      = useState({ id:"trial" });
  const [roomCount, setRoomCount] = useState(2);
  const [hasVideo,  setHasVideo]  = useState(false);
  const [hasEarpiece, setHasEarpiece] = useState(false);
  const [chatCfg,   setChatCfg]   = useState(null);

  const handleLogin = u => { setUser({...u,joinedAt:new Date()}); setScreen("dashboard"); };
  const handleStart = (count, video, earpiece) => {
    if (plan.id==="trial"&&isTrialExpired(user)) { setScreen("trialExpired"); return; }
    setRoomCount(count); setHasVideo(video); setHasEarpiece(earpiece || false);
    setScreen("roomSetup");
  };
  const handleLaunch = cfg => {
    setChatCfg(cfg);
    if (cfg.hasEarpiece) setScreen("earpiece");
    else if (cfg.hasVideo) setScreen("enterprise");
    else setScreen("chat");
  };

  if (screen==="landing")      return <LandingScreen onLogin={()=>setScreen("login")} onTrial={()=>setScreen("login")}/>;
  if (screen==="login")        return <LoginScreen onLogin={handleLogin}/>;
  if (screen==="trialExpired") return <TrialExpiredWall onGoPlans={()=>setScreen("landing")}/>;
  if (screen==="dashboard")    return <Dashboard user={user} plan={plan} onStartRoom={handleStart} onGoPlans={()=>setScreen("landing")} onLogout={()=>{setUser(null);setScreen("landing");}}/>;
  if (screen==="roomSetup")    return <RoomSetup count={roomCount} hasVideo={hasVideo} hasEarpiece={hasEarpiece} user={user} onStart={handleLaunch} onBack={()=>setScreen("dashboard")}/>;
  if (screen==="chat")         return <ChatRoom config={chatCfg} onBack={()=>setScreen("dashboard")}/>;
  if (screen==="enterprise")   return <EnterpriseRoom config={chatCfg} onBack={()=>setScreen("dashboard")}/>;
  if (screen==="earpiece")     return <EarpieceRoom config={chatCfg} onBack={()=>setScreen("dashboard")}/>;
  return null;
}
