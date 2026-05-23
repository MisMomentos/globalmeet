import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// ✏️  CONFIGURACIÓN ADMIN
// ═══════════════════════════════════════════════════════════════════════════
const ADMIN_EMAIL    = "germanmomentos@gmail.com";
const ADMIN_PASSWORD = "GlobalMeet2024!";
const APP_NAME       = "GlobalMeet";
const SUPPORT_EMAIL  = "germanmomentos@gmail.com";
const PRECIOS = {
  basic:      { mensual: 14900, anual: 143040  },
  pro:        { mensual: 24900, anual: 239040  },
  enterprise: { mensual: 44900, anual: 431040  },
  auricular:  { mensual: 59900, anual: 575040  },
};
// ═══════════════════════════════════════════════════════════════════════════

// ── Leer log de intentos de pago ─────────────────────────────────────────────
function usePaymentLog() {
  const [log, setLog] = useState([]);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("gm_payment_log") || "[]");
      setLog(stored);
    } catch {}
  }, []);
  const clear = () => { localStorage.removeItem("gm_payment_log"); setLog([]); };
  return { log, clear };
}

// ── Leer transferencias pendientes ───────────────────────────────────────────
function useTransferLog() {
  const [transfers, setTransfers] = useState([]);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("gm_transfer_log") || "[]");
      setTransfers(stored);
    } catch {}
  }, []);
  const confirm = (id) => {
    setTransfers(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status: "confirmed" } : t);
      localStorage.setItem("gm_transfer_log", JSON.stringify(updated));
      return updated;
    });
  };
  const reject = (id) => {
    setTransfers(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status: "rejected" } : t);
      localStorage.setItem("gm_transfer_log", JSON.stringify(updated));
      return updated;
    });
  };
  return { transfers, confirm, reject };
}

// ── Responsive hook ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 768, w };
}

const fmt     = n => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
const fmtDate = d => new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
const addDays  = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const daysDiff = (a, b) => Math.ceil((b - a) / 86400000);

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id:"1", name:"Carlos Mendez",   email:"carlos@empresa.com",    plan:"pro",        billing:"monthly", joinedAt:new Date(Date.now()-20*86400000), planEnd:new Date(Date.now()+10*86400000), active:true,  paid:true,  paymentRef:"MP-1234567" },
  { id:"2", name:"Ana García",      email:"ana@importadora.ar",    plan:"basic",      billing:"annual",  joinedAt:new Date(Date.now()-5*86400000),  planEnd:new Date(Date.now()+25*86400000), active:true,  paid:true,  paymentRef:"MP-2345678" },
  { id:"3", name:"Luis Torres",     email:"luis@logistica.com",    plan:"enterprise", billing:"monthly", joinedAt:new Date(Date.now()-2*86400000),  planEnd:new Date(Date.now()+28*86400000), active:true,  paid:true,  paymentRef:"MP-3456789" },
  { id:"4", name:"María Fernández", email:"maria@turismo.ar",      plan:"trial",      billing:"monthly", joinedAt:new Date(Date.now()-8*86400000),  planEnd:new Date(Date.now()+6*86400000),  active:true,  paid:false, paymentRef:null         },
  { id:"5", name:"Roberto Silva",   email:"roberto@export.com",    plan:"trial",      billing:"monthly", joinedAt:new Date(Date.now()-16*86400000), planEnd:new Date(Date.now()-2*86400000),  active:false, paid:false, paymentRef:null         },
  { id:"6", name:"Claudia Ríos",    email:"claudia@callcenter.ar", plan:"basic",      billing:"monthly", joinedAt:new Date(Date.now()-30*86400000), planEnd:new Date(Date.now()+1*86400000),  active:true,  paid:true,  paymentRef:"MP-4567890" },
];
const MOCK_PAYMENTS = [
  { id:"p1", userId:"1", userName:"Carlos Mendez",   email:"carlos@empresa.com",    plan:"pro",        billing:"monthly", amount:PRECIOS.pro.mensual,        status:"confirmed", date:new Date(Date.now()-20*86400000), ref:"MP-1234567" },
  { id:"p2", userId:"2", userName:"Ana García",      email:"ana@importadora.ar",    plan:"basic",      billing:"annual",  amount:PRECIOS.basic.anual,         status:"confirmed", date:new Date(Date.now()-5*86400000),  ref:"MP-2345678" },
  { id:"p3", userId:"3", userName:"Luis Torres",     email:"luis@logistica.com",    plan:"enterprise", billing:"monthly", amount:PRECIOS.enterprise.mensual,  status:"confirmed", date:new Date(Date.now()-2*86400000),  ref:"MP-3456789" },
  { id:"p4", userId:"6", userName:"Claudia Ríos",    email:"claudia@callcenter.ar", plan:"basic",      billing:"monthly", amount:PRECIOS.basic.mensual,       status:"pending",   date:new Date(Date.now()-1*86400000),  ref:"MP-4567890" },
];

const PLAN_ST = {
  trial:      { bg:"rgba(100,116,139,.15)", color:"#94a3b8", label:"Prueba"     },
  basic:      { bg:"rgba(37,99,235,.15)",   color:"#60a5fa", label:"Básico"     },
  pro:        { bg:"rgba(124,58,237,.15)",  color:"#a78bfa", label:"Pro"        },
  enterprise: { bg:"rgba(15,118,110,.15)",  color:"#2dd4bf", label:"Enterprise" },
};
const STATUS_ST = {
  confirmed: { bg:"rgba(22,163,74,.15)",  color:"#4ade80", label:"Confirmado" },
  pending:   { bg:"rgba(217,119,6,.15)",  color:"#fbbf24", label:"Pendiente"  },
  cancelled: { bg:"rgba(239,68,68,.15)",  color:"#f87171", label:"Cancelado"  },
};

function Badge({ type, map }) {
  const s = map[type] || { bg:"rgba(255,255,255,.05)", color:"#64748b", label:type };
  return <span style={{ background:s.bg, color:s.color, borderRadius:"20px", padding:"2px 8px", fontSize:".65rem", fontWeight:"600", letterSpacing:".05em", whiteSpace:"nowrap" }}>{s.label}</span>;
}

const inputSt = { background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#e2e8f0", borderRadius:"8px", padding:"9px 12px", fontSize:".85rem", outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" };
const btnP = { background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"8px", padding:"9px 18px", fontSize:".83rem", fontWeight:"600", cursor:"pointer", fontFamily:"inherit", touchAction:"manipulation" };
const btnG = { ...btnP, background:"linear-gradient(135deg,#16a34a,#15803d)" };
const btnR = { ...btnP, background:"linear-gradient(135deg,#dc2626,#b91c1c)" };
const btnGr= { ...btnP, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", color:"#94a3b8" };

function Logo({ size=30 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="alg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#2dd4bf"/></linearGradient>
          <linearGradient id="alg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
        </defs>
        <circle cx="24" cy="24" r="24" fill="url(#alg1)" opacity="0.12"/>
        <rect x="4" y="10" width="22" height="14" rx="7" fill="url(#alg1)"/>
        <rect x="4" y="20" width="8" height="8" rx="2" fill="url(#alg1)" transform="rotate(45 8 24)"/>
        <rect x="22" y="24" width="22" height="14" rx="7" fill="url(#alg2)"/>
        <rect x="36" y="28" width="8" height="8" rx="2" fill="url(#alg2)" transform="rotate(45 40 34)"/>
        <text x="7" y="20" fontSize="9" fill="white" fontFamily="Arial" fontWeight="bold">A</text>
        <text x="27" y="34" fontSize="9" fill="white" fontFamily="Arial" fontWeight="bold">文</text>
      </svg>
      <div>
        <div style={{ color:"#f1f5f9", fontWeight:"700", fontSize:size>26?".95rem":".8rem", lineHeight:1.1 }}>{APP_NAME}</div>
        <div style={{ color:"#334155", fontSize:".58rem", letterSpacing:".08em" }}>Panel Admin</div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"16px" }}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,.1)", borderRadius:"16px", padding:"24px 20px", width:"100%", maxWidth:"440px", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 25px 60px rgba(0,0,0,.6)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px" }}>
          <h3 style={{ color:"#f1f5f9", fontSize:".95rem", fontWeight:"600", margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"1.2rem", touchAction:"manipulation" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  return (
    <div style={{ position:"fixed", top:"16px", right:"16px", left:"16px", maxWidth:"360px", margin:"0 auto", background:type==="warn"?"rgba(217,119,6,.95)":"rgba(22,163,74,.95)", borderRadius:"10px", padding:"12px 16px", color:"#fff", fontSize:".83rem", fontWeight:"600", zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,.4)", textAlign:"center" }}>
      {type==="warn"?"⚠️":"✅"} {msg}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState("");
  const go=()=>{ email===ADMIN_EMAIL&&pass===ADMIN_PASSWORD?onLogin():setErr("Credenciales incorrectas."); };
  return (
    <div style={{ minHeight:"100dvh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"20px" }}>
      <div style={{ width:"100%", maxWidth:"360px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"18px", padding:"30px 22px" }}>
        <div style={{ textAlign:"center", marginBottom:"22px" }}><Logo size={36}/><p style={{ color:"#475569", fontSize:".78rem", margin:"10px 0 0" }}>Acceso de administrador</p></div>
        {err && <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:"8px", padding:"8px 12px", color:"#fca5a5", fontSize:".76rem", marginBottom:"10px" }}>⚠️ {err}</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email admin" type="email" style={inputSt}/>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Contraseña" type="password" style={inputSt} onKeyDown={e=>e.key==="Enter"&&go()}/>
          <button onClick={go} style={{ ...btnP, padding:"12px" }}>Ingresar →</button>
        </div>
        <div style={{ textAlign:"center", color:"#1e293b", fontSize:".6rem", marginTop:"16px", letterSpacing:".08em" }}>GLOBALMEET · DISEÑADO POR MOMENTOS</div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardView({ users, payments }) {
  const { isMobile } = useBreakpoint();
  const activeUsers  = users.filter(u=>u.active).length;
  const paidUsers    = users.filter(u=>u.paid).length;
  const expiringSoon = users.filter(u=>{ const d=daysDiff(new Date(),u.planEnd); return d>=0&&d<=7&&u.plan!=="trial"; }).length;
  const expired      = users.filter(u=>u.planEnd<new Date()&&u.plan!=="trial").length;
  const mRevenue     = payments.filter(p=>p.status==="confirmed"&&p.billing==="monthly").reduce((s,p)=>s+p.amount,0);
  const aRevenue     = payments.filter(p=>p.status==="confirmed"&&p.billing==="annual").reduce((s,p)=>s+p.amount,0);
  const planCount    = { basic:0,pro:0,enterprise:0,trial:0 };
  users.forEach(u=>{ planCount[u.plan]=(planCount[u.plan]||0)+1; });

  const metrics=[
    { icon:"👥", label:"Usuarios totales",   value:users.length,  sub:`${activeUsers} activos`,       color:"#4f46e5" },
    { icon:"✅", label:"Clientes pagos",     value:paidUsers,      sub:`${users.filter(u=>u.plan==="trial").length} en prueba`, color:"#16a34a" },
    { icon:"⚠️", label:"Vencen esta semana", value:expiringSoon,   sub:expiringSoon>0?"Atención":"Al día", color:"#d97706" },
    { icon:"🔴", label:"Planes vencidos",    value:expired,        sub:"Requieren renovación",         color:"#dc2626" },
  ];

  return (
    <div>
      <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:"0 0 16px" }}>📊 Resumen</h2>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:"10px", marginBottom:"16px" }}>
        {metrics.map(m=>(
          <div key={m.label} style={{ background:"rgba(255,255,255,.03)", border:`1px solid ${m.color}33`, borderRadius:"12px", padding:"14px 16px" }}>
            <div style={{ fontSize:"1.3rem", marginBottom:"6px" }}>{m.icon}</div>
            <div style={{ fontSize:"1.5rem", fontWeight:"700", color:"#f1f5f9" }}>{m.value}</div>
            <div style={{ fontSize:".72rem", color:"#64748b" }}>{m.label}</div>
            <div style={{ fontSize:".68rem", color:m.color, marginTop:"2px" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(79,70,229,.2),rgba(124,58,237,.1))", border:"1px solid rgba(99,102,241,.3)", borderRadius:"12px", padding:"16px" }}>
          <div style={{ color:"#a5b4fc", fontSize:".68rem", letterSpacing:".1em", marginBottom:"5px" }}>INGRESOS MENSUALES</div>
          <div style={{ fontSize:"1.6rem", fontWeight:"700", color:"#f1f5f9" }}>{fmt(mRevenue)}</div>
          <div style={{ color:"#475569", fontSize:".7rem" }}>Pagos confirmados</div>
        </div>
        <div style={{ background:"linear-gradient(135deg,rgba(15,118,110,.2),rgba(6,182,212,.1))", border:"1px solid rgba(45,212,191,.3)", borderRadius:"12px", padding:"16px" }}>
          <div style={{ color:"#2dd4bf", fontSize:".68rem", letterSpacing:".1em", marginBottom:"5px" }}>INGRESOS ANUALES</div>
          <div style={{ fontSize:"1.6rem", fontWeight:"700", color:"#f1f5f9" }}>{fmt(aRevenue)}</div>
          <div style={{ color:"#475569", fontSize:".7rem" }}>Suscripciones anuales</div>
        </div>
      </div>

      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"12px", padding:"16px" }}>
        <div style={{ color:"#94a3b8", fontSize:".68rem", letterSpacing:".1em", marginBottom:"12px" }}>DISTRIBUCIÓN DE PLANES</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
          {Object.entries(planCount).map(([plan,count])=>{
            const s=PLAN_ST[plan]; const pct=users.length?Math.round(count/users.length*100):0;
            return (
              <div key={plan} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"1.4rem", fontWeight:"700", color:s.color }}>{count}</div>
                <Badge type={plan} map={PLAN_ST}/>
                <div style={{ height:"3px", background:"rgba(255,255,255,.05)", borderRadius:"2px", marginTop:"6px" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:s.color, borderRadius:"2px" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {expiringSoon>0 && (
        <div style={{ background:"rgba(217,119,6,.1)", border:"1px solid rgba(217,119,6,.3)", borderRadius:"10px", padding:"12px 15px", marginTop:"14px" }}>
          <div style={{ color:"#fbbf24", fontWeight:"600", fontSize:".82rem", marginBottom:"6px" }}>⚠️ Vencen esta semana</div>
          {users.filter(u=>{ const d=daysDiff(new Date(),u.planEnd); return d>=0&&d<=7&&u.plan!=="trial"; }).map(u=>(
            <div key={u.id} style={{ color:"#92400e", fontSize:".76rem", padding:"3px 0", borderBottom:"1px solid rgba(217,119,6,.1)" }}>
              {u.name} · vence en {daysDiff(new Date(),u.planEnd)} día{daysDiff(new Date(),u.planEnd)!==1?"s":""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── USERS ─────────────────────────────────────────────────────────────────────
function UsersView({ users, setUsers }) {
  const { isMobile } = useBreakpoint();
  const [search,setSearch]=useState(""); const [filter,setFilter]=useState("all");
  const [editUser,setEditUser]=useState(null); const [toast,setToast]=useState(null);
  const showToast=(msg,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const filtered=users.filter(u=>{
    const ms=u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="all"?true:filter==="active"?(u.active&&u.plan!=="trial"):filter==="trial"?(u.plan==="trial"):filter==="expired"?(u.planEnd<new Date()):filter==="expiring"?(daysDiff(new Date(),u.planEnd)<=7&&daysDiff(new Date(),u.planEnd)>=0&&u.plan!=="trial"):true;
    return ms&&mf;
  });

  const savePlan=(uid,plan,billing)=>{
    setUsers(prev=>prev.map(u=>u.id===uid?{...u,plan,billing,planEnd:addDays(new Date(),billing==="annual"?365:30),active:true}:u));
    setEditUser(null); showToast(`Plan actualizado a ${PLAN_ST[plan].label}`);
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
      <div style={{ display:"flex", gap:"8px", marginBottom:"14px", flexWrap:"wrap", alignItems:"center" }}>
        <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:0, flex:"0 0 auto" }}>👥 Usuarios</h2>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{ ...inputSt, flex:"1 1 140px", padding:"7px 11px" }}/>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ ...inputSt, flex:"0 0 auto", width:"auto", padding:"7px 10px" }}>
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="trial">Prueba</option>
          <option value="expiring">Vencen pronto</option>
          <option value="expired">Vencidos</option>
        </select>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
        {filtered.map(u=>{
          const dL=daysDiff(new Date(),u.planEnd);
          const isExp=u.planEnd<new Date(); const isExpiring=dL<=7&&dL>=0&&u.plan!=="trial";
          return (
            <div key={u.id} style={{ background:"rgba(255,255,255,.03)", border:`1px solid ${isExp?"rgba(239,68,68,.25)":isExpiring?"rgba(217,119,6,.25)":"rgba(255,255,255,.07)"}`, borderRadius:"11px", padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:"10px", flexWrap:"wrap" }}>
                <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:`${PLAN_ST[u.plan]?.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:"700", color:PLAN_ST[u.plan]?.color, fontSize:".9rem" }}>{u.name.charAt(0)}</div>
                <div style={{ flex:1, minWidth:"140px" }}>
                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center", marginBottom:"2px" }}>
                    <span style={{ color:"#f1f5f9", fontWeight:"600", fontSize:".86rem" }}>{u.name}</span>
                    <Badge type={u.plan} map={PLAN_ST}/>
                    {!u.active && <span style={{ background:"rgba(239,68,68,.15)", color:"#f87171", borderRadius:"20px", padding:"1px 7px", fontSize:".6rem", fontWeight:"600" }}>SUSPENDIDO</span>}
                    {isExpiring && <span style={{ background:"rgba(217,119,6,.15)", color:"#fbbf24", borderRadius:"20px", padding:"1px 7px", fontSize:".6rem", fontWeight:"600" }}>VENCE PRONTO</span>}
                    {isExp&&u.plan!=="trial" && <span style={{ background:"rgba(239,68,68,.15)", color:"#f87171", borderRadius:"20px", padding:"1px 7px", fontSize:".6rem", fontWeight:"600" }}>VENCIDO</span>}
                  </div>
                  <div style={{ color:"#475569", fontSize:".72rem" }}>{u.email}</div>
                  <div style={{ color:"#334155", fontSize:".68rem", marginTop:"1px" }}>
                    Vence: {fmtDate(u.planEnd)} · {u.billing==="annual"?"Anual":"Mensual"}{u.paymentRef?` · ${u.paymentRef}`:""}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:"6px", marginTop:"10px", flexWrap:"wrap" }}>
                <button onClick={()=>setEditUser(u)} style={{ ...btnGr, padding:"5px 11px", fontSize:".72rem" }}>✏️ Plan</button>
                {u.active
                  ? <button onClick={()=>{ setUsers(p=>p.map(x=>x.id===u.id?{...x,active:false}:x)); showToast("Suspendido","warn"); }} style={{ ...btnR, padding:"5px 11px", fontSize:".72rem" }}>⛔</button>
                  : <button onClick={()=>{ setUsers(p=>p.map(x=>x.id===u.id?{...x,active:true}:x)); showToast("Reactivado"); }} style={{ ...btnG, padding:"5px 11px", fontSize:".72rem" }}>✅</button>
                }
                <a href={`mailto:${u.email}`} style={{ ...btnGr, padding:"5px 11px", fontSize:".72rem", textDecoration:"none", display:"inline-block" }}>📧</a>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div style={{ textAlign:"center", color:"#334155", padding:"32px 0", fontSize:".82rem" }}>Sin resultados.</div>}
      </div>

      {editUser && (
        <Modal title={`Editar — ${editUser.name}`} onClose={()=>setEditUser(null)}>
          <EditPlanForm user={editUser} onSave={savePlan} onClose={()=>setEditUser(null)}/>
        </Modal>
      )}
    </div>
  );
}

function EditPlanForm({ user, onSave, onClose }) {
  const [plan,setPlan]=useState(user.plan); const [billing,setBilling]=useState(user.billing);
  const price=plan==="trial"?0:billing==="annual"?PRECIOS[plan]?.anual:PRECIOS[plan]?.mensual;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"13px" }}>
      <div>
        <label style={{ color:"#94a3b8", fontSize:".68rem", letterSpacing:".08em", display:"block", marginBottom:"6px" }}>PLAN</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px" }}>
          {["trial","basic","pro","enterprise"].map(p=>(
            <button key={p} onClick={()=>setPlan(p)} style={{ padding:"8px", borderRadius:"8px", border:`1px solid ${plan===p?PLAN_ST[p].color:"rgba(255,255,255,.08)"}`, background:plan===p?`${PLAN_ST[p].color}22`:"rgba(255,255,255,.03)", color:plan===p?PLAN_ST[p].color:"#64748b", cursor:"pointer", fontFamily:"inherit", fontSize:".76rem", fontWeight:"600", touchAction:"manipulation" }}>
              {PLAN_ST[p].label}
            </button>
          ))}
        </div>
      </div>
      {plan!=="trial" && (
        <div>
          <label style={{ color:"#94a3b8", fontSize:".68rem", letterSpacing:".08em", display:"block", marginBottom:"6px" }}>FACTURACIÓN</label>
          <div style={{ display:"flex", gap:"7px" }}>
            {["monthly","annual"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{ flex:1, padding:"8px", borderRadius:"8px", border:`1px solid ${billing===b?"#4f46e5":"rgba(255,255,255,.08)"}`, background:billing===b?"rgba(79,70,229,.2)":"rgba(255,255,255,.03)", color:billing===b?"#a5b4fc":"#64748b", cursor:"pointer", fontFamily:"inherit", fontSize:".76rem", touchAction:"manipulation" }}>
                {b==="monthly"?"Mensual":"Anual"}
              </button>
            ))}
          </div>
        </div>
      )}
      {plan!=="trial" && price && (
        <div style={{ background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.25)", borderRadius:"8px", padding:"10px 13px" }}>
          <div style={{ color:"#a5b4fc", fontSize:".68rem" }}>MONTO</div>
          <div style={{ color:"#f1f5f9", fontWeight:"700", fontSize:"1.05rem" }}>{fmt(price)}</div>
          <div style={{ color:"#475569", fontSize:".68rem" }}>{billing==="annual"?"anual · renueva en 365 días":"mensual · renueva en 30 días"}</div>
        </div>
      )}
      <div style={{ display:"flex", gap:"7px" }}>
        <button onClick={()=>onSave(user.id,plan,billing)} style={{ ...btnG, flex:1 }}>✅ Confirmar</button>
        <button onClick={onClose} style={{ ...btnGr, flex:1 }}>Cancelar</button>
      </div>
    </div>
  );
}

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
function PaymentsView({ payments, setPayments, setUsers }) {
  const [toast,setToast]=useState(null);
  const showToast=msg=>{ setToast(msg); setTimeout(()=>setToast(null),3000); };

  const confirm=id=>{
    const p=payments.find(x=>x.id===id);
    setPayments(prev=>prev.map(x=>x.id===id?{...x,status:"confirmed"}:x));
    setUsers(prev=>prev.map(u=>u.id===p.userId?{...u,plan:p.plan,billing:p.billing,paid:true,active:true,planEnd:addDays(new Date(),p.billing==="annual"?365:30)}:u));
    showToast(`Confirmado — ${p.userName}`);
  };

  const pending=payments.filter(p=>p.status==="pending");
  const confirmed=payments.filter(p=>p.status==="confirmed");

  return (
    <div>
      {toast && <Toast msg={toast} type="success"/>}
      <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:"0 0 16px" }}>💳 Pagos</h2>

      {pending.length>0 && (
        <div style={{ marginBottom:"20px" }}>
          <div style={{ color:"#fbbf24", fontSize:".68rem", letterSpacing:".1em", marginBottom:"8px" }}>⏳ PENDIENTES ({pending.length})</div>
          {pending.map(p=>(
            <div key={p.id} style={{ background:"rgba(217,119,6,.08)", border:"1px solid rgba(217,119,6,.3)", borderRadius:"11px", padding:"12px 14px", marginBottom:"7px" }}>
              <div style={{ display:"flex", gap:"7px", flexWrap:"wrap", alignItems:"center", marginBottom:"4px" }}>
                <span style={{ color:"#f1f5f9", fontWeight:"600", fontSize:".86rem" }}>{p.userName}</span>
                <Badge type={p.plan} map={PLAN_ST}/><Badge type={p.status} map={STATUS_ST}/>
              </div>
              <div style={{ color:"#475569", fontSize:".72rem" }}>{p.email} · {p.ref} · {fmt(p.amount)}</div>
              <div style={{ display:"flex", gap:"7px", marginTop:"9px" }}>
                <button onClick={()=>confirm(p.id)} style={{ ...btnG, padding:"6px 13px", fontSize:".76rem" }}>✅ Confirmar</button>
                <button onClick={()=>setPayments(prev=>prev.map(x=>x.id===p.id?{...x,status:"cancelled"}:x))} style={{ ...btnR, padding:"6px 13px", fontSize:".76rem" }}>✕ Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <div style={{ color:"#64748b", fontSize:".68rem", letterSpacing:".1em", marginBottom:"8px" }}>HISTORIAL ({confirmed.length})</div>
        {confirmed.map(p=>(
          <div key={p.id} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:"9px", padding:"10px 13px", marginBottom:"5px", display:"flex", alignItems:"center", gap:"9px", flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center" }}>
                <span style={{ color:"#cbd5e1", fontSize:".83rem" }}>{p.userName}</span>
                <Badge type={p.plan} map={PLAN_ST}/><Badge type={p.status} map={STATUS_ST}/>
              </div>
              <div style={{ color:"#334155", fontSize:".68rem", marginTop:"2px" }}>{fmtDate(p.date)} · {p.email}</div>
            </div>
            <div style={{ color:"#4ade80", fontWeight:"700", fontSize:".88rem" }}>{fmt(p.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PRICING ───────────────────────────────────────────────────────────────────
function PricingView() {
  const [prices,setPrices]=useState({ bm:PRECIOS.basic.mensual, ba:PRECIOS.basic.anual, pm:PRECIOS.pro.mensual, pa:PRECIOS.pro.anual, em:PRECIOS.enterprise.mensual, ea:PRECIOS.enterprise.anual });
  const [dolar,setDolar]=useState(1415); const [saved,setSaved]=useState(false);
  const rows=[{ lbl:"Básico",emoji:"💼",mk:"bm",ak:"ba" },{ lbl:"Pro",emoji:"🚀",mk:"pm",ak:"pa" },{ lbl:"Enterprise",emoji:"🎥",mk:"em",ak:"ea" }];
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", flexWrap:"wrap", gap:"8px" }}>
        <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:0 }}>💰 Precios</h2>
        <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
          <span style={{ color:"#64748b", fontSize:".76rem" }}>USD 1 =</span>
          <input type="number" value={dolar} onChange={e=>setDolar(Number(e.target.value))} style={{ ...inputSt, width:"80px", padding:"6px 9px" }}/>
          <span style={{ color:"#64748b", fontSize:".76rem" }}>ARS</span>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"9px", marginBottom:"16px" }}>
        {rows.map(r=>(
          <div key={r.lbl} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"11px", padding:"14px 15px" }}>
            <div style={{ color:"#94a3b8", fontWeight:"600", fontSize:".82rem", marginBottom:"10px" }}>{r.emoji} Plan {r.lbl}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              <div>
                <label style={{ color:"#64748b", fontSize:".66rem", letterSpacing:".08em", display:"block", marginBottom:"4px" }}>MENSUAL (ARS)</label>
                <input type="number" value={prices[r.mk]} onChange={e=>setPrices(p=>({...p,[r.mk]:Number(e.target.value)}))} style={inputSt}/>
                <div style={{ color:"#334155", fontSize:".64rem", marginTop:"2px" }}>≈ USD {Math.round(prices[r.mk]/dolar)}</div>
              </div>
              <div>
                <label style={{ color:"#64748b", fontSize:".66rem", letterSpacing:".08em", display:"block", marginBottom:"4px" }}>ANUAL (ARS)</label>
                <input type="number" value={prices[r.ak]} onChange={e=>setPrices(p=>({...p,[r.ak]:Number(e.target.value)}))} style={inputSt}/>
                <div style={{ color:"#334155", fontSize:".64rem", marginTop:"2px" }}>≈ USD {Math.round(prices[r.ak]/dolar)} · −{Math.round((1-prices[r.ak]/(prices[r.mk]*12))*100)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>{ setSaved(true); setTimeout(()=>setSaved(false),2500); }} style={{ ...btnP, width:"100%" }}>{saved?"✅ Guardado":"Guardar precios"}</button>
      <p style={{ color:"#334155", fontSize:".7rem", textAlign:"center", marginTop:"8px" }}>Actualizá también el bloque PRECIOS en GlobalMeet.jsx para aplicar los cambios.</p>
    </div>
  );
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
function NotificationsView({ users }) {
  const [sent,setSent]=useState([]); const [sending,setSending]=useState(false);
  const exp7    = users.filter(u=>{ const d=daysDiff(new Date(),u.planEnd); return d>=0&&d<=7&&u.plan!=="trial"; });
  const expToday= users.filter(u=>{ const d=daysDiff(new Date(),u.planEnd); return d<=0&&d>=-1&&u.plan!=="trial"; });
  const total   = exp7.length+expToday.length;

  const sendAll=async()=>{
    setSending(true); await new Promise(r=>setTimeout(r,1500));
    setSent(prev=>[...[ ...exp7.map(u=>({email:u.email,name:u.name,type:"7days",time:new Date()})), ...expToday.map(u=>({email:u.email,name:u.name,type:"expired",time:new Date()})) ],...prev]);
    setSending(false);
  };

  return (
    <div>
      <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:"0 0 16px" }}>📧 Notificaciones</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
        <div style={{ background:"rgba(217,119,6,.1)", border:"1px solid rgba(217,119,6,.3)", borderRadius:"11px", padding:"13px 15px" }}>
          <div style={{ color:"#fbbf24", fontWeight:"600", fontSize:".78rem", marginBottom:"3px" }}>⚠️ Vencen en 7 días</div>
          <div style={{ fontSize:"1.4rem", fontWeight:"700", color:"#f1f5f9" }}>{exp7.length}</div>
        </div>
        <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:"11px", padding:"13px 15px" }}>
          <div style={{ color:"#f87171", fontWeight:"600", fontSize:".78rem", marginBottom:"3px" }}>🔴 Vencen hoy</div>
          <div style={{ fontSize:"1.4rem", fontWeight:"700", color:"#f1f5f9" }}>{expToday.length}</div>
        </div>
      </div>

      <button onClick={sendAll} disabled={sending||total===0} style={{ ...btnP, width:"100%", marginBottom:"14px", opacity:sending?.7:1 }}>
        {sending?"⏳ Enviando...":total===0?"Sin notificaciones pendientes":`📨 Enviar ${total} notificaciones`}
      </button>

      {[...exp7,...expToday].map(u=>(
        <div key={u.id} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:"7px", padding:"8px 12px", marginBottom:"5px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <span style={{ color:"#cbd5e1", fontSize:".82rem" }}>{u.name}</span>
            <span style={{ color:"#334155", fontSize:".72rem", marginLeft:"7px" }}>{u.email}</span>
          </div>
          <span style={{ color:expToday.includes(u)?"#f87171":"#fbbf24", fontSize:".7rem", flexShrink:0 }}>
            {expToday.includes(u)?"Hoy":`${daysDiff(new Date(),u.planEnd)}d`}
          </span>
        </div>
      ))}

      {sent.length>0 && (
        <div style={{ marginTop:"16px", background:"rgba(22,163,74,.06)", border:"1px solid rgba(22,163,74,.2)", borderRadius:"10px", padding:"12px 14px" }}>
          <div style={{ color:"#4ade80", fontSize:".68rem", letterSpacing:".1em", marginBottom:"6px" }}>LOG DE ENVÍOS</div>
          {sent.slice(0,10).map((s,i)=>(
            <div key={i} style={{ color:"#334155", fontSize:".7rem", padding:"2px 0" }}>✅ {s.time.toLocaleTimeString()} → {s.email}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT LOG VIEW
// ══════════════════════════════════════════════════════════════════════════════
function PaymentLogView() {
  const { log, clear } = usePaymentLog();

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", flexWrap:"wrap", gap:"8px" }}>
        <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:0 }}>🔔 Intentos de pago</h2>
        {log.length > 0 && (
          <button onClick={clear} style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.25)", color:"#f87171", borderRadius:"7px", padding:"5px 12px", cursor:"pointer", fontSize:".72rem", fontFamily:"inherit" }}>
            Limpiar log
          </button>
        )}
      </div>

      <div style={{ background:"rgba(99,102,241,.08)", border:"1px solid rgba(99,102,241,.2)", borderRadius:"10px", padding:"12px 14px", marginBottom:"16px" }}>
        <div style={{ color:"#818cf8", fontWeight:"600", fontSize:".8rem", marginBottom:"4px" }}>💡 Cómo funciona</div>
        <div style={{ color:"#475569", fontSize:".74rem", lineHeight:"1.6" }}>
          Cada vez que alguien hace clic en "Pagar con Mercado Pago", queda registrado acá.
          Si configuraste EmailJS, también te llega un email en el momento.
          Usá esta lista para verificar en Mercado Pago y activar el plan desde la sección Pagos.
        </div>
      </div>

      {log.length === 0 ? (
        <div style={{ textAlign:"center", color:"#334155", padding:"40px 0", fontSize:".82rem" }}>
          <div style={{ fontSize:"2rem", marginBottom:"10px" }}>🔔</div>
          Todavía no hubo intentos de pago registrados.
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
          {log.map((entry, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"10px", padding:"12px 14px", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"rgba(0,158,227,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"1rem" }}>💳</div>
              <div style={{ flex:1, minWidth:"150px" }}>
                <div style={{ display:"flex", gap:"7px", alignItems:"center", flexWrap:"wrap", marginBottom:"2px" }}>
                  <span style={{ color:"#f1f5f9", fontWeight:"600", fontSize:".85rem" }}>
                    {entry.userName !== "Usuario nuevo" ? entry.userName : "Usuario sin registrar"}
                  </span>
                  <span style={{ background:"rgba(0,158,227,.15)", color:"#38bdf8", borderRadius:"20px", padding:"1px 8px", fontSize:".62rem", fontWeight:"600" }}>
                    Plan {entry.plan}
                  </span>
                  <span style={{ background:"rgba(255,255,255,.05)", color:"#64748b", borderRadius:"20px", padding:"1px 8px", fontSize:".62rem" }}>
                    {entry.billing}
                  </span>
                </div>
                <div style={{ color:"#475569", fontSize:".72rem" }}>
                  {entry.userEmail !== "No registrado" ? entry.userEmail : "Email no disponible aún"}
                </div>
                <div style={{ color:"#334155", fontSize:".68rem", marginTop:"1px" }}>{entry.date}</div>
              </div>
              <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                <a href={`mailto:${entry.userEmail !== "No registrado" ? entry.userEmail : SUPPORT_EMAIL}`}
                  style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#94a3b8", borderRadius:"6px", padding:"5px 10px", fontSize:".7rem", textDecoration:"none", display:"inline-block" }}>
                  📧 Contactar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:"20px", background:"rgba(217,119,6,.08)", border:"1px solid rgba(217,119,6,.2)", borderRadius:"10px", padding:"12px 14px" }}>
        <div style={{ color:"#fbbf24", fontWeight:"600", fontSize:".78rem", marginBottom:"4px" }}>⚙️ Configurar email en tiempo real</div>
        <div style={{ color:"#64748b", fontSize:".74rem", lineHeight:"1.6" }}>
          Para recibir un email cada vez que alguien hace clic en Pagar:
          1) Registrate en emailjs.com (gratis hasta 200 emails/mes).
          2) Creá un servicio Gmail y una plantilla de email.
          3) Pegá los IDs en las variables EMAILJS_* al inicio de GlobalMeet.jsx.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TRANSFERS VIEW
// ══════════════════════════════════════════════════════════════════════════════
function TransfersView() {
  const { transfers, confirm, reject } = useTransferLog();
  const [toast, setToast] = useState(null);
  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const pending   = transfers.filter(t => t.status === "pending");
  const confirmed = transfers.filter(t => t.status === "confirmed");
  const rejected  = transfers.filter(t => t.status === "rejected");

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
      <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:"0 0 16px" }}>🏦 Transferencias</h2>

      {/* Alerta pendientes */}
      {pending.length > 0 && (
        <div style={{ background:"rgba(217,119,6,.1)", border:"1px solid rgba(217,119,6,.3)", borderRadius:"10px", padding:"12px 16px", marginBottom:"16px" }}>
          <div style={{ color:"#fbbf24", fontWeight:"600", fontSize:".85rem", marginBottom:"8px" }}>
            ⚠️ {pending.length} transferencia{pending.length>1?"s":""} pendiente{pending.length>1?"s":""} de verificar
          </div>
          <div style={{ color:"#92400e", fontSize:".76rem" }}>
            Verificá en tu cuenta bancaria o MP que el monto coincida antes de confirmar.
          </div>
        </div>
      )}

      {/* Pendientes */}
      {pending.length > 0 && (
        <div style={{ marginBottom:"20px" }}>
          <div style={{ color:"#fbbf24", fontSize:".68rem", letterSpacing:".1em", marginBottom:"8px" }}>PENDIENTES DE VERIFICAR</div>
          {pending.map(t => (
            <div key={t.id} style={{ background:"rgba(217,119,6,.08)", border:"1px solid rgba(217,119,6,.3)", borderRadius:"11px", padding:"12px 14px", marginBottom:"7px" }}>
              <div style={{ display:"flex", gap:"7px", flexWrap:"wrap", alignItems:"center", marginBottom:"4px" }}>
                <span style={{ color:"#f1f5f9", fontWeight:"600", fontSize:".86rem" }}>{t.userName || "Usuario"}</span>
                <span style={{ background:"rgba(217,119,6,.2)", color:"#fbbf24", borderRadius:"20px", padding:"1px 8px", fontSize:".62rem", fontWeight:"600" }}>TRANSFERENCIA</span>
                <span style={{ background:"rgba(255,255,255,.05)", color:"#64748b", borderRadius:"20px", padding:"1px 8px", fontSize:".62rem" }}>{t.plan}</span>
              </div>
              <div style={{ color:"#475569", fontSize:".72rem" }}>{t.userEmail} · {t.date}</div>
              <div style={{ color:"#fbbf24", fontWeight:"700", fontSize:".9rem", margin:"4px 0 8px" }}>{t.amount}</div>
              <div style={{ display:"flex", gap:"7px" }}>
                <button onClick={()=>{ confirm(t.id); showToast("Transferencia confirmada — activá el plan del usuario"); }} style={{ ...btnG, padding:"6px 13px", fontSize:".76rem" }}>✅ Confirmar</button>
                <button onClick={()=>{ reject(t.id); showToast("Transferencia rechazada","warn"); }} style={{ ...btnR, padding:"6px 13px", fontSize:".76rem" }}>✕ Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmadas */}
      {confirmed.length > 0 && (
        <div style={{ marginBottom:"16px" }}>
          <div style={{ color:"#64748b", fontSize:".68rem", letterSpacing:".1em", marginBottom:"8px" }}>CONFIRMADAS ({confirmed.length})</div>
          {confirmed.map(t => (
            <div key={t.id} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:"9px", padding:"10px 13px", marginBottom:"5px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
              <div>
                <div style={{ color:"#cbd5e1", fontSize:".83rem" }}>{t.userName} · {t.plan}</div>
                <div style={{ color:"#334155", fontSize:".7rem" }}>{t.userEmail} · {t.date}</div>
              </div>
              <div style={{ color:"#4ade80", fontWeight:"700" }}>{t.amount}</div>
            </div>
          ))}
        </div>
      )}

      {transfers.length === 0 && (
        <div style={{ textAlign:"center", color:"#334155", padding:"40px 0" }}>
          <div style={{ fontSize:"2rem", marginBottom:"10px" }}>🏦</div>
          <p style={{ fontSize:".85rem" }}>No hay transferencias registradas todavía.</p>
          <p style={{ fontSize:".76rem", color:"#1e293b" }}>Cuando un cliente elija pagar por transferencia aparecerá acá.</p>
        </div>
      )}

      <div style={{ background:"rgba(99,102,241,.08)", border:"1px solid rgba(99,102,241,.2)", borderRadius:"10px", padding:"12px 14px", marginTop:"16px" }}>
        <div style={{ color:"#818cf8", fontWeight:"600", fontSize:".8rem", marginBottom:"4px" }}>💡 Flujo de transferencias</div>
        <div style={{ color:"#475569", fontSize:".74rem", lineHeight:"1.6" }}>
          1. Cliente elige "Pagar por transferencia" → ve tu CVU/alias<br/>
          2. Transfiere y envía comprobante a {SUPPORT_EMAIL}<br/>
          3. Vos verificás en tu cuenta → confirmás acá<br/>
          4. Activás el plan del usuario en la sección Usuarios
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COST CENTER VIEW
// ══════════════════════════════════════════════════════════════════════════════
function CostCenterView({ payments, users }) {
  const { transfers } = useTransferLog();
  const { log: payLog } = usePaymentLog();

  const fmt = n => new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(n);

  // Calcular ingresos por método de pago
  const mpRevenue       = payments.filter(p=>p.status==="confirmed").reduce((s,p)=>s+p.amount,0);
  const transferRevenue = transfers.filter(t=>t.status==="confirmed").reduce((s,t)=>s+(t.amountNum||0),0);
  const totalRevenue    = mpRevenue + transferRevenue;

  // Ingresos por plan
  const byPlan = {};
  payments.filter(p=>p.status==="confirmed").forEach(p => {
    if (!byPlan[p.plan]) byPlan[p.plan]={ count:0, total:0 };
    byPlan[p.plan].count++;
    byPlan[p.plan].total+=p.amount;
  });

  // Ingresos por mes (últimos 3 meses)
  const now = new Date();
  const months = [0,1,2].map(i => {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    return {
      label: d.toLocaleDateString("es-AR", { month:"long", year:"numeric" }),
      total: payments.filter(p => {
        const pd = new Date(p.date);
        return p.status==="confirmed" && pd.getMonth()===d.getMonth() && pd.getFullYear()===d.getFullYear();
      }).reduce((s,p)=>s+p.amount,0)
    };
  }).reverse();

  const PLAN_LABELS = { trial:"Prueba", basic:"Básico", pro:"Pro", enterprise:"Enterprise", auricular:"Auricular" };

  return (
    <div>
      <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", margin:"0 0 16px" }}>📊 Centro de costos</h2>

      {/* Totales */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"10px", marginBottom:"20px" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(79,70,229,.2),rgba(124,58,237,.1))", border:"1px solid rgba(99,102,241,.3)", borderRadius:"12px", padding:"16px" }}>
          <div style={{ color:"#a5b4fc", fontSize:".68rem", letterSpacing:".1em", marginBottom:"5px" }}>TOTAL INGRESOS</div>
          <div style={{ fontSize:"1.6rem", fontWeight:"700", color:"#f1f5f9" }}>{fmt(totalRevenue)}</div>
          <div style={{ color:"#475569", fontSize:".7rem" }}>acumulado</div>
        </div>
        <div style={{ background:"rgba(0,158,227,.1)", border:"1px solid rgba(0,158,227,.3)", borderRadius:"12px", padding:"16px" }}>
          <div style={{ color:"#38bdf8", fontSize:".68rem", letterSpacing:".1em", marginBottom:"5px" }}>MERCADO PAGO</div>
          <div style={{ fontSize:"1.6rem", fontWeight:"700", color:"#f1f5f9" }}>{fmt(mpRevenue)}</div>
          <div style={{ color:"#475569", fontSize:".7rem" }}>{payments.filter(p=>p.status==="confirmed").length} pagos</div>
        </div>
        <div style={{ background:"rgba(22,163,74,.1)", border:"1px solid rgba(22,163,74,.3)", borderRadius:"12px", padding:"16px" }}>
          <div style={{ color:"#4ade80", fontSize:".68rem", letterSpacing:".1em", marginBottom:"5px" }}>TRANSFERENCIAS</div>
          <div style={{ fontSize:"1.6rem", fontWeight:"700", color:"#f1f5f9" }}>{fmt(transferRevenue)}</div>
          <div style={{ color:"#475569", fontSize:".7rem" }}>{transfers.filter(t=>t.status==="confirmed").length} confirmadas</div>
        </div>
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"12px", padding:"16px" }}>
          <div style={{ color:"#94a3b8", fontSize:".68rem", letterSpacing:".1em", marginBottom:"5px" }}>CLIENTES ACTIVOS</div>
          <div style={{ fontSize:"1.6rem", fontWeight:"700", color:"#f1f5f9" }}>{users.filter(u=>u.active&&u.plan!=="trial").length}</div>
          <div style={{ color:"#475569", fontSize:".7rem" }}>pagos activos</div>
        </div>
      </div>

      {/* Por plan */}
      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"12px", padding:"16px", marginBottom:"16px" }}>
        <div style={{ color:"#94a3b8", fontSize:".68rem", letterSpacing:".1em", marginBottom:"12px" }}>INGRESOS POR PLAN</div>
        {Object.keys(byPlan).length === 0 ? (
          <div style={{ color:"#334155", fontSize:".8rem" }}>Sin datos todavía</div>
        ) : (
          Object.entries(byPlan).map(([plan, data]) => (
            <div key={plan} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
              <div>
                <span style={{ color:"#cbd5e1", fontSize:".83rem" }}>{PLAN_LABELS[plan]||plan}</span>
                <span style={{ color:"#475569", fontSize:".72rem", marginLeft:"8px" }}>{data.count} cliente{data.count!==1?"s":""}</span>
              </div>
              <span style={{ color:"#4ade80", fontWeight:"700", fontSize:".88rem" }}>{fmt(data.total)}</span>
            </div>
          ))
        )}
      </div>

      {/* Por mes */}
      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"12px", padding:"16px" }}>
        <div style={{ color:"#94a3b8", fontSize:".68rem", letterSpacing:".1em", marginBottom:"12px" }}>INGRESOS POR MES</div>
        {months.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
            <span style={{ color:"#94a3b8", fontSize:".82rem", textTransform:"capitalize" }}>{m.label}</span>
            <span style={{ color: m.total>0?"#4ade80":"#334155", fontWeight:"700", fontSize:".88rem" }}>{fmt(m.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminPanel() {
  const { isMobile } = useBreakpoint();
  const { log } = usePaymentLog();
  const [logged,setLogged]=useState(false);
  const [tab,setTab]=useState("dashboard");
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [users,setUsers]=useState(MOCK_USERS);
  const [payments,setPayments]=useState(MOCK_PAYMENTS);

  if (!logged) return <AdminLogin onLogin={()=>setLogged(true)}/>;

  const pendingCount    = payments.filter(p=>p.status==="pending").length;
  const expiringCount   = users.filter(u=>{ const d=daysDiff(new Date(),u.planEnd); return d>=0&&d<=7&&u.plan!=="trial"; }).length;
  const payLogCount     = log.length;
  const { transfers }   = useTransferLog();
  const transferPending = transfers.filter(t=>t.status==="pending").length;

  const tabs=[
    { id:"dashboard",     icon:"📊", label:"Resumen"        },
    { id:"users",         icon:"👥", label:"Usuarios"        },
    { id:"payments",      icon:"💳", label:"Pagos",    badge:pendingCount   },
    { id:"transfers",     icon:"🏦", label:"Transf.",  badge:transferPending },
    { id:"paylog",        icon:"🔔", label:"Intentos", badge:payLogCount > 0 ? payLogCount : 0 },
    { id:"costcenter",    icon:"📈", label:"Costos"          },
    { id:"pricing",       icon:"💰", label:"Precios"         },
    { id:"notifications", icon:"📧", label:"Emails",   badge:expiringCount  },
  ];

  const NavItem=({ t })=>(
    <button onClick={()=>{ setTab(t.id); setDrawerOpen(false); }} style={{ width:"100%", background:tab===t.id?"rgba(99,102,241,.2)":"transparent", border:tab===t.id?"1px solid rgba(99,102,241,.3)":"1px solid transparent", borderRadius:"9px", padding:"10px 12px", cursor:"pointer", fontFamily:"inherit", color:tab===t.id?"#a5b4fc":"#475569", fontSize:".82rem", fontWeight:tab===t.id?"600":"400", textAlign:"left", display:"flex", alignItems:"center", gap:"9px", marginBottom:"2px", transition:"all .15s", touchAction:"manipulation" }}>
      <span>{t.icon}</span>
      <span style={{ flex:1 }}>{t.label}</span>
      {t.badge>0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:"20px", padding:"1px 7px", fontSize:".6rem", fontWeight:"700" }}>{t.badge}</span>}
    </button>
  );

  return (
    <div style={{ minHeight:"100dvh", background:"#080c14", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#e2e8f0", display:"flex", flexDirection:isMobile?"column":"row" }}>
      <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

      {/* Mobile top bar */}
      {isMobile && (
        <div style={{ background:"rgba(15,23,42,.95)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"11px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:20 }}>
          <Logo size={26}/>
          <button onClick={()=>setDrawerOpen(p=>!p)} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#94a3b8", borderRadius:"8px", padding:"6px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:".78rem", touchAction:"manipulation" }}>
            {drawerOpen?"✕ Cerrar":"☰ Menú"}
            {(pendingCount+expiringCount)>0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:"50%", width:"8px", height:"8px", display:"inline-block", marginLeft:"6px" }}/>}
          </button>
        </div>
      )}

      {/* Mobile drawer overlay */}
      {isMobile && drawerOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:30, background:"rgba(0,0,0,.6)" }} onClick={()=>setDrawerOpen(false)}>
          <div style={{ width:"240px", height:"100%", background:"rgba(15,23,42,.98)", padding:"20px 14px", animation:"slideIn .25s ease" }} onClick={e=>e.stopPropagation()}>
            <div style={{ marginBottom:"16px" }}><Logo size={30}/></div>
            {tabs.map(t=><NavItem key={t.id} t={t}/>)}
            <div style={{ marginTop:"auto", paddingTop:"20px" }}>
              <button onClick={()=>setLogged(false)} style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#475569", borderRadius:"8px", padding:"8px", cursor:"pointer", fontFamily:"inherit", fontSize:".75rem" }}>Cerrar sesión</button>
              <div style={{ color:"#1e293b", fontSize:".58rem", textAlign:"center", marginTop:"10px", letterSpacing:".08em" }}>DISEÑADO POR MOMENTOS</div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div style={{ width:"210px", background:"rgba(15,23,42,.95)", borderRight:"1px solid rgba(255,255,255,.07)", display:"flex", flexDirection:"column", minHeight:"100vh", flexShrink:0 }}>
          <div style={{ padding:"18px 16px", borderBottom:"1px solid rgba(255,255,255,.07)" }}><Logo size={30}/></div>
          <nav style={{ flex:1, padding:"10px 8px" }}>{tabs.map(t=><NavItem key={t.id} t={t}/>)}</nav>
          <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
            <button onClick={()=>setLogged(false)} style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#475569", borderRadius:"8px", padding:"8px", cursor:"pointer", fontFamily:"inherit", fontSize:".72rem" }}>Cerrar sesión</button>
            <div style={{ color:"#1e293b", fontSize:".58rem", textAlign:"center", marginTop:"8px", letterSpacing:".08em" }}>DISEÑADO POR MOMENTOS</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex:1, padding: isMobile?"16px 14px":"24px 26px", overflowY:"auto" }}>
        <div style={{ maxWidth:"880px" }}>
          {tab==="dashboard"     && <DashboardView     users={users} payments={payments}/>}
          {tab==="users"         && <UsersView         users={users} setUsers={setUsers}/>}
          {tab==="payments"      && <PaymentsView      payments={payments} setPayments={setPayments} setUsers={setUsers}/>}
          {tab==="transfers"     && <TransfersView/>}
          {tab==="paylog"        && <PaymentLogView/>}
          {tab==="costcenter"    && <CostCenterView    payments={payments} users={users}/>}
          {tab==="pricing"       && <PricingView/>}
          {tab==="notifications" && <NotificationsView users={users}/>}
        </div>
      </div>
    </div>
  );
}
