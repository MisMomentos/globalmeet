import React, { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════════════
// ✏️  CONFIGURACIÓN — editá estos valores
// ═══════════════════════════════════════════════════════════════════════════
const APP_NAME      = "GlobalMeet";
const APP_SLOGAN    = "Reuniones sin fronteras · Traducción simultánea";
const SUPPORT_EMAIL = "germanmomentos@gmail.com";

// ── Sistema de traducciones de la interfaz ────────────────────────────────────
const UI_TRANSLATIONS = {
  es: {
    slogan:        "Reuniones sin fronteras · Traducción simultánea",
    hello:         "¡Hola, Globalmeetero! 👋",
    community:     "Somos una comunidad de profesionales que rompen barreras del idioma en sus negocios.",
    community2:    "Desde Mendoza hasta Tokio — todos hablamos el mismo idioma: los negocios.",
    loginBtn:      "Iniciar sesión con Google →",
    freedays:      "14 días gratis · Sin tarjeta de crédito",
    monthly:       "Mensual",
    annual:        "Anual −15%",
    trialBtn:      "Probar {n} días gratis",
    buyNow:        "Comprar ahora ↓",
    transfer:      "🏦 Pagar por transferencia",
    plans:         "Planes",
    hi:            "Hola",
    yourPlan:      "Tu plan",
    newConv:       "Nueva conversación",
    change:        "Cambiar ↗",
    logout:        "Salir",
    joinRoom:      "📨 Te invitaron a una sala",
    joinCode:      "Código:",
    yourName:      "¿Cómo te llamás?",
    yourLang:      "Tu idioma",
    enterRoom:     "Entrar a la sala →",
    backHome:      "← Volver al inicio",
    startChat:     "💬 Iniciar chat →",
    startVideo:    "🎥 Iniciar videollamada →",
    startEarpiece: "🎧 Iniciar modo auricular →",
    chatWelcome:   "Presioná el micrófono para comenzar",
    waitingWake:   'Esperando "Hola GlobalMeet"...',
    listening:     "Escuchando — hablá ahora",
    translating:   "Traduciendo...",
    speaking:      "Reproduciendo traducción",
    restart:       "🔄 Reiniciar escucha",
    assistantQ:    "¿Estás listo para pertenecer a nuestra comunidad Globalmeeteros? 🌍",
    communityTag:  "Comunidad Globalmeeteros",
  },
  en: {
    slogan:        "Meetings without borders · Simultaneous translation",
    hello:         "Hello, Globalmeetero! 👋",
    community:     "We are a community of professionals breaking language barriers in business.",
    community2:    "From Buenos Aires to Tokyo — we all speak the same language: business.",
    loginBtn:      "Sign in with Google →",
    freedays:      "14 days free · No credit card",
    monthly:       "Monthly",
    annual:        "Annual −15%",
    trialBtn:      "Try {n} days free",
    buyNow:        "Buy now ↓",
    transfer:      "🏦 Pay by bank transfer",
    plans:         "Plans",
    hi:            "Hello",
    yourPlan:      "Your plan",
    newConv:       "New conversation",
    change:        "Change ↗",
    logout:        "Sign out",
    joinRoom:      "📨 You were invited to a room",
    joinCode:      "Code:",
    yourName:      "What's your name?",
    yourLang:      "Your language",
    enterRoom:     "Enter room →",
    backHome:      "← Back to home",
    startChat:     "💬 Start chat →",
    startVideo:    "🎥 Start video call →",
    startEarpiece: "🎧 Start earpiece mode →",
    chatWelcome:   "Press the microphone to start",
    waitingWake:   'Waiting for "Hello GlobalMeet"...',
    listening:     "Listening — speak now",
    translating:   "Translating...",
    speaking:      "Playing translation",
    restart:       "🔄 Restart listening",
    assistantQ:    "Ready to join our Globalmeeteros community? 🌍",
    communityTag:  "Globalmeeteros Community",
  },
  pt: {
    slogan:        "Reuniões sem fronteiras · Tradução simultânea",
    hello:         "Olá, Globalmeeteiro! 👋",
    community:     "Somos uma comunidade de profissionais que quebram barreiras de idiomas nos negócios.",
    community2:    "De Buenos Aires a Tóquio — todos falamos o mesmo idioma: negócios.",
    loginBtn:      "Entrar com Google →",
    freedays:      "14 dias grátis · Sem cartão",
    monthly:       "Mensal",
    annual:        "Anual −15%",
    trialBtn:      "Testar {n} dias grátis",
    buyNow:        "Comprar agora ↓",
    transfer:      "🏦 Pagar por transferência",
    plans:         "Planos",
    hi:            "Olá",
    yourPlan:      "Seu plano",
    newConv:       "Nova conversa",
    change:        "Mudar ↗",
    logout:        "Sair",
    joinRoom:      "📨 Você foi convidado para uma sala",
    joinCode:      "Código:",
    yourName:      "Qual é o seu nome?",
    yourLang:      "Seu idioma",
    enterRoom:     "Entrar na sala →",
    backHome:      "← Voltar ao início",
    startChat:     "💬 Iniciar chat →",
    startVideo:    "🎥 Iniciar videochamada →",
    startEarpiece: "🎧 Iniciar modo fone →",
    chatWelcome:   "Pressione o microfone para começar",
    waitingWake:   'Aguardando "Olá GlobalMeet"...',
    listening:     "Ouvindo — fale agora",
    translating:   "Traduzindo...",
    speaking:      "Reproduzindo tradução",
    restart:       "🔄 Reiniciar escuta",
    assistantQ:    "Pronto para entrar na nossa comunidade Globalmeeteiros? 🌍",
    communityTag:  "Comunidade Globalmeeteiros",
  },
  fr: {
    slogan:        "Réunions sans frontières · Traduction simultanée",
    hello:         "Bonjour, Globalmeeteur! 👋",
    community:     "Nous sommes une communauté de professionnels qui brisent les barrières linguistiques.",
    community2:    "De Buenos Aires à Tokyo — nous parlons tous le même langage : les affaires.",
    loginBtn:      "Se connecter avec Google →",
    freedays:      "14 jours gratuits · Sans carte",
    monthly:       "Mensuel",
    annual:        "Annuel −15%",
    trialBtn:      "Essayer {n} jours gratuits",
    buyNow:        "Acheter maintenant ↓",
    transfer:      "🏦 Payer par virement",
    plans:         "Forfaits",
    hi:            "Bonjour",
    yourPlan:      "Votre forfait",
    newConv:       "Nouvelle conversation",
    change:        "Changer ↗",
    logout:        "Déconnexion",
    joinRoom:      "📨 Vous avez été invité dans une salle",
    joinCode:      "Code:",
    yourName:      "Quel est votre nom?",
    yourLang:      "Votre langue",
    enterRoom:     "Entrer dans la salle →",
    backHome:      "← Retour à l'accueil",
    startChat:     "💬 Démarrer le chat →",
    startVideo:    "🎥 Démarrer l'appel vidéo →",
    startEarpiece: "🎧 Mode oreillette →",
    chatWelcome:   "Appuyez sur le micro pour commencer",
    waitingWake:   'En attente de "Bonjour GlobalMeet"...',
    listening:     "À l'écoute — parlez maintenant",
    translating:   "Traduction en cours...",
    speaking:      "Lecture de la traduction",
    restart:       "🔄 Redémarrer l'écoute",
    assistantQ:    "Prêt à rejoindre notre communauté Globalmeeteurs? 🌍",
    communityTag:  "Communauté Globalmeeteurs",
  },
  de: {
    slogan:        "Meetings ohne Grenzen · Simultanübersetzung",
    hello:         "Hallo, Globalmeeterer! 👋",
    community:     "Wir sind eine Gemeinschaft von Fachleuten, die Sprachbarrieren im Geschäftsleben überwinden.",
    community2:    "Von Buenos Aires bis Tokio — wir alle sprechen dieselbe Sprache: Geschäft.",
    loginBtn:      "Mit Google anmelden →",
    freedays:      "14 Tage kostenlos · Keine Karte",
    monthly:       "Monatlich",
    annual:        "Jährlich −15%",
    trialBtn:      "{n} Tage kostenlos testen",
    buyNow:        "Jetzt kaufen ↓",
    transfer:      "🏦 Per Überweisung zahlen",
    plans:         "Pläne",
    hi:            "Hallo",
    yourPlan:      "Ihr Plan",
    newConv:       "Neues Gespräch",
    change:        "Ändern ↗",
    logout:        "Abmelden",
    joinRoom:      "📨 Sie wurden in einen Raum eingeladen",
    joinCode:      "Code:",
    yourName:      "Wie heißen Sie?",
    yourLang:      "Ihre Sprache",
    enterRoom:     "Raum betreten →",
    backHome:      "← Zurück zur Startseite",
    startChat:     "💬 Chat starten →",
    startVideo:    "🎥 Videoanruf starten →",
    startEarpiece: "🎧 Ohrhörer-Modus →",
    chatWelcome:   "Drücken Sie das Mikrofon zum Starten",
    waitingWake:   'Warte auf "Hallo GlobalMeet"...',
    listening:     "Zuhören — sprechen Sie jetzt",
    translating:   "Übersetzen...",
    speaking:      "Übersetzung wird abgespielt",
    restart:       "🔄 Zuhören neu starten",
    assistantQ:    "Bereit, unserer Globalmeeterer-Community beizutreten? 🌍",
    communityTag:  "Globalmeeterer-Gemeinschaft",
  },
  it: { slogan:"Riunioni senza confini · Traduzione simultanea", hello:"Ciao, Globalmeetero! 👋", community:"Siamo una comunità di professionisti che abbattono le barriere linguistiche.", community2:"Da Buenos Aires a Tokyo — parliamo tutti la stessa lingua: gli affari.", loginBtn:"Accedi con Google →", freedays:"14 giorni gratis · Senza carta", monthly:"Mensile", annual:"Annuale −15%", trialBtn:"Prova {n} giorni gratis", buyNow:"Acquista ora ↓", transfer:"🏦 Paga con bonifico", plans:"Piani", hi:"Ciao", yourPlan:"Il tuo piano", newConv:"Nuova conversazione", change:"Cambia ↗", logout:"Esci", joinRoom:"📨 Sei stato invitato in una stanza", joinCode:"Codice:", yourName:"Come ti chiami?", yourLang:"La tua lingua", enterRoom:"Entra nella stanza →", backHome:"← Torna all'inizio", startChat:"💬 Inizia chat →", startVideo:"🎥 Inizia videochiamata →", startEarpiece:"🎧 Modalità auricolare →", chatWelcome:"Premi il microfono per iniziare", waitingWake:'Aspettando "Ciao GlobalMeet"...', listening:"In ascolto — parla ora", translating:"Traduzione...", speaking:"Riproduzione traduzione", restart:"🔄 Riavvia ascolto", assistantQ:"Pronto a unirti alla nostra comunità Globalmeeteros? 🌍", communityTag:"Comunità Globalmeeteros" },
  ja: { slogan:"国境のない会議・同時通訳", hello:"こんにちは、グローバルミーター！👋", community:"私たちはビジネスの言語障壁を打ち破るプロフェッショナルのコミュニティです。", community2:"ブエノスアイレスから東京まで — 私たちは同じ言語を話します：ビジネス。", loginBtn:"Googleでサインイン →", freedays:"14日間無料・カード不要", monthly:"月払い", annual:"年払い −15%", trialBtn:"{n}日間無料体験", buyNow:"今すぐ購入 ↓", transfer:"🏦 銀行振込で支払う", plans:"プラン", hi:"こんにちは", yourPlan:"あなたのプラン", newConv:"新しい会話", change:"変更 ↗", logout:"ログアウト", joinRoom:"📨 ルームに招待されました", joinCode:"コード:", yourName:"お名前は？", yourLang:"言語", enterRoom:"ルームに入る →", backHome:"← ホームに戻る", startChat:"💬 チャット開始 →", startVideo:"🎥 ビデオ通話開始 →", startEarpiece:"🎧 イヤホンモード →", chatWelcome:"マイクを押して開始", waitingWake:'"こんにちは GlobalMeet"を待っています...', listening:"聞いています — 話してください", translating:"翻訳中...", speaking:"翻訳を再生中", restart:"🔄 聞き取り再開", assistantQ:"グローバルミーターコミュニティに参加する準備はできていますか？🌍", communityTag:"グローバルミーターコミュニティ" },
  zh: { slogan:"无国界会议·同声传译", hello:"你好，全球会议者！👋", community:"我们是一个打破商业语言障碍的专业人士社区。", community2:"从布宜诺斯艾利斯到东京——我们都说同一种语言：商业。", loginBtn:"使用Google登录 →", freedays:"14天免费·无需信用卡", monthly:"月付", annual:"年付 −15%", trialBtn:"免费试用{n}天", buyNow:"立即购买 ↓", transfer:"🏦 银行转账付款", plans:"方案", hi:"你好", yourPlan:"您的方案", newConv:"新对话", change:"更改 ↗", logout:"退出", joinRoom:"📨 您被邀请加入房间", joinCode:"代码:", yourName:"您叫什么名字？", yourLang:"您的语言", enterRoom:"进入房间 →", backHome:"← 返回首页", startChat:"💬 开始聊天 →", startVideo:"🎥 开始视频通话 →", startEarpiece:"🎧 耳机模式 →", chatWelcome:"按麦克风开始", waitingWake:'"你好 GlobalMeet"等待中...', listening:"正在听——请说话", translating:"翻译中...", speaking:"播放翻译", restart:"🔄 重新开始监听", assistantQ:"准备好加入我们的全球会议者社区了吗？🌍", communityTag:"全球会议者社区" },
  ar: { slogan:"اجتماعات بلا حدود · ترجمة فورية", hello:"مرحباً، عضو GlobalMeet! 👋", community:"نحن مجتمع من المحترفين الذين يكسرون حواجز اللغة في الأعمال.", community2:"من بوينس آيرس إلى طوكيو — نتحدث جميعاً نفس اللغة: الأعمال.", loginBtn:"تسجيل الدخول بـ Google ←", freedays:"14 يوماً مجاناً · بدون بطاقة", monthly:"شهري", annual:"سنوي −15%", trialBtn:"جرب {n} أيام مجاناً", buyNow:"اشترِ الآن ↓", transfer:"🏦 الدفع بالتحويل البنكي", plans:"الخطط", hi:"مرحباً", yourPlan:"خطتك", newConv:"محادثة جديدة", change:"تغيير ↗", logout:"خروج", joinRoom:"📨 تمت دعوتك إلى غرفة", joinCode:"الرمز:", yourName:"ما اسمك؟", yourLang:"لغتك", enterRoom:"دخول الغرفة ←", backHome:"← العودة للرئيسية", startChat:"💬 بدء المحادثة ←", startVideo:"🎥 بدء مكالمة الفيديو ←", startEarpiece:"🎧 وضع سماعة الأذن ←", chatWelcome:"اضغط على الميكروفون للبدء", waitingWake:'"مرحباً GlobalMeet" في انتظار...', listening:"أستمع — تحدث الآن", translating:"جاري الترجمة...", speaking:"تشغيل الترجمة", restart:"🔄 إعادة الاستماع", assistantQ:"هل أنت مستعد للانضمام إلى مجتمع GlobalMeet؟ 🌍", communityTag:"مجتمع GlobalMeet" },
  ru: { slogan:"Встречи без границ · Синхронный перевод", hello:"Привет, Глобалмитер! 👋", community:"Мы сообщество профессионалов, устраняющих языковые барьеры в бизнесе.", community2:"От Буэнос-Айреса до Токио — мы все говорим на одном языке: бизнес.", loginBtn:"Войти через Google →", freedays:"14 дней бесплатно · Без карты", monthly:"Ежемесячно", annual:"Ежегодно −15%", trialBtn:"Попробовать {n} дней бесплатно", buyNow:"Купить сейчас ↓", transfer:"🏦 Оплата переводом", plans:"Планы", hi:"Привет", yourPlan:"Ваш план", newConv:"Новый разговор", change:"Изменить ↗", logout:"Выйти", joinRoom:"📨 Вас пригласили в комнату", joinCode:"Код:", yourName:"Как вас зовут?", yourLang:"Ваш язык", enterRoom:"Войти в комнату →", backHome:"← На главную", startChat:"💬 Начать чат →", startVideo:"🎥 Начать видеозвонок →", startEarpiece:"🎧 Режим наушников →", chatWelcome:"Нажмите микрофон для начала", waitingWake:'"Привет GlobalMeet" ожидание...', listening:"Слушаю — говорите сейчас", translating:"Перевод...", speaking:"Воспроизведение перевода", restart:"🔄 Перезапустить прослушивание", assistantQ:"Готовы присоединиться к сообществу Глобалмитеров? 🌍", communityTag:"Сообщество Глобалмитеров" },
};

// ── Hook de idioma global ─────────────────────────────────────────────────────
function useAppLang() {
  const detectLang = () => {
    // 1. Preferencia guardada
    try {
      const saved = localStorage.getItem("gm_ui_lang");
      if (saved && UI_TRANSLATIONS[saved]) return saved;
    } catch {}
    // 2. Idioma del navegador
    const nav = (navigator.language || navigator.userLanguage || "es").slice(0,2).toLowerCase();
    return UI_TRANSLATIONS[nav] ? nav : "es";
  };
  const [lang, setLangState] = useState(detectLang);
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("gm_ui_lang", l); } catch {}
  };
  const t = (key, vars = {}) => {
    let str = UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.es[key] || key;
    Object.entries(vars).forEach(([k,v]) => { str = str.replace(`{${k}}`, v); });
    return str;
  };
  return { lang, setLang, t };
}

// Context para compartir el idioma en toda la app
const LangContext = React.createContext({ lang:"es", setLang:()=>{}, t:(k)=>k });
function useLang() { return React.useContext(LangContext); }
const MAX_FILE_MB   = 48;

// ✏️  SUPABASE — credenciales del proyecto
const SUPABASE_URL = "https://jiwsoabsnivzowrjmcbq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppd3NvYWJzbml2em93cmptY2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjMyODcsImV4cCI6MjA5NDc5OTI4N30.gmcS7NXO7LDo9KbyiPVHoQpwtYLjJMJDI9XYAIsG_ag";
const supabase     = createClient(SUPABASE_URL, SUPABASE_KEY);
// ═══════════════════════════════════════════════════════════════════════════

const PRECIOS = {
  basic:      { mensual: 14900, anual: 143040  },
  pro:        { mensual: 24900, anual: 239040  },
  enterprise: { mensual: 44900, anual: 431040  },
  auricular:  { mensual: 59900, anual: 575040  },
};
const MP_LINKS = {
  basic:      "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=e25b015b9acd46dcb6c854fa1f1a46a1",
  basic_anual:"https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=369e7469cf614247a9cbd78f1ed3b058",
  pro:        "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=932081a5419147dd9156f4a3643dd009",
  pro_anual:  "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=6ba29d8d35164081a50fb177c97f905d",
  enterprise: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=9e7c1e84468948538acbb0d82f6eb21f",
  enterprise_anual: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=793d70bb1195417690f7a4d41a90ed6e",
  auricular:  "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=5cce77854cc14561b066f49b0540de58",
  auricular_anual: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=6d9f565d1902439bb320ad8470121d34",
};
// ═══════════════════════════════════════════════════════════════════════════

// ✏️  EMAILJS — servicio gratuito para notificaciones de pago
// Registrate en emailjs.com, creá un servicio Gmail y una plantilla.
// La plantilla debe tener estas variables: {{user_email}}, {{user_name}},
// {{plan_name}}, {{billing}}, {{timestamp}}, {{admin_url}}
const EMAILJS_SERVICE_ID  = "service_gceoy9u";
const EMAILJS_TEMPLATE_ID = "template_g2x38tk";
const EMAILJS_PUBLIC_KEY  = "_MXZhHgxYxIAKIHFk";

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
  { id: "trial",      name: "Prueba",     emoji: "🎁", badge: "14 días gratis",      priceMonthly: 0,                         priceAnnual: 0,                         color: "#64748b", accent: "#94a3b8", participants: 2,  hasVideo: false, hasEarpiece: false, mpLink: null,                  usd: null,       trialDays: 14,
    features: ["2 participantes", "Traducción en tiempo real", "10 idiomas", "Sin tarjeta de crédito"] },
  { id: "basic",      name: "Básico",     emoji: "💼", badge: "7 días gratis",        priceMonthly: PRECIOS.basic.mensual,      priceAnnual: PRECIOS.basic.anual,       color: "#2563eb", accent: "#60a5fa", participants: 2,  hasVideo: false, hasEarpiece: false, mpLink: MP_LINKS.basic,        usd: "~USD 10",  trialDays: 7,
    features: ["🎁 7 días gratis para probar", "2 participantes", "Conversaciones ilimitadas", "10 idiomas", "Link compartible", "Historial", "Notificaciones email"] },
  { id: "pro",        name: "Pro",        emoji: "🚀", badge: "7 días gratis",        priceMonthly: PRECIOS.pro.mensual,        priceAnnual: PRECIOS.pro.anual,         color: "#7c3aed", accent: "#a78bfa", participants: 3,  hasVideo: false, hasEarpiece: false, mpLink: MP_LINKS.pro,          usd: "~USD 17",  trialDays: 7,
    features: ["🎁 7 días gratis para probar", "3 participantes", "Conversaciones ilimitadas", "10 idiomas", "Link compartible", "Historial", "Notificaciones email", "Soporte prioritario"] },
  { id: "enterprise", name: "Enterprise", emoji: "🎥", badge: "7 días gratis",        priceMonthly: PRECIOS.enterprise.mensual, priceAnnual: PRECIOS.enterprise.anual,  color: "#0f766e", accent: "#2dd4bf", participants: 30, hasVideo: true,  hasEarpiece: false, mpLink: MP_LINKS.enterprise,   usd: "~USD 32",  trialDays: 7,
    features: ["🎁 7 días gratis para probar", "👥 2, 3 o hasta 30 participantes", "📹 Videollamada Jitsi", "💬 Chat traductor", "🖥️ Compartir pantalla", `📁 Archivos hasta ${MAX_FILE_MB}MB`, "10 idiomas", "🌍 Comunidad Globalmeeteros", "Soporte 24/7"] },
  { id: "auricular",  name: "Auricular",  emoji: "🎧", badge: "7 días gratis",        priceMonthly: PRECIOS.auricular.mensual, priceAnnual: PRECIOS.auricular.anual,   color: "#b45309", accent: "#fbbf24", participants: 30, hasVideo: false, hasEarpiece: true,  mpLink: MP_LINKS.auricular,    usd: "~USD 42",  trialDays: 7,
    features: ["🎁 7 días gratis para probar", "👥 2, 3 o hasta 30 participantes", "🎧 Traducción simultánea por auricular", "🔊 Modo altavoz o solo texto", "🗣️ Voz masculina o femenina", "🎙️ Comando 'Hola GlobalMeet'", "Manos libres · sin tocar pantalla", "10 idiomas en tiempo real", "🌍 Comunidad Globalmeeteros", "Soporte 24/7"] },
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
// REVIEWS & USER COUNTER
// ══════════════════════════════════════════════════════════════════════════════

// Reseñas iniciales de muestra — se agregan las reales automáticamente
const INITIAL_REVIEWS = [
  { id:1, name:"Carlos M.", company:"Importadora del Sur", stars:5, text:"Increíble herramienta. Cerramos un contrato con clientes alemanes sin necesitar intérprete.", date:"Mayo 2026" },
  { id:2, name:"Ana G.",    company:"Turismo Andino",      stars:5, text:"El modo auricular es una revolución. Mis guías lo usan con turistas extranjeros todos los días.", date:"Mayo 2026" },
  { id:3, name:"Luis T.",   company:"LogiTrans SA",        stars:4, text:"Muy buena traducción en tiempo real. La videollamada con chat traductor es lo que más usamos.", date:"Mayo 2026" },
];

function StarRating({ value, onChange, readonly }) {
  return (
    <div style={{ display:"flex", gap:"4px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => !readonly && onChange && onChange(s)}
          style={{ fontSize: readonly?"1rem":"1.3rem", cursor: readonly?"default":"pointer", color: s<=value?"#fbbf24":"#334155", transition:"color .15s" }}>
          ★
        </span>
      ))}
    </div>
  );
}

function UserCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // Simula contador creciente — con Supabase se reemplaza por dato real
    const stored = parseInt(localStorage.getItem("gm_user_count") || "0");
    const base   = stored > 0 ? stored : 147;
    let current  = 0;
    const target = base;
    const step   = Math.ceil(target / 60);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      setCount(current);
    }, 25);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign:"center", padding:"32px 20px 20px" }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", background:"rgba(99,102,241,.08)", border:"1px solid rgba(99,102,241,.2)", borderRadius:"50px", padding:"12px 24px" }}>
        <div style={{ display:"flex", gap:"-6px" }}>
          {["🧑","👩","🧔","👨","👩‍💼"].map((e,i) => (
            <span key={i} style={{ fontSize:"1.2rem", marginLeft: i>0?"-4px":"0" }}>{e}</span>
          ))}
        </div>
        <div>
          <span style={{ color:"#a5b4fc", fontWeight:"700", fontSize:"1.2rem" }}>{count.toLocaleString("es-AR")}</span>
          <span style={{ color:"#64748b", fontSize:".82rem", marginLeft:"6px" }}>empresas ya usan GlobalMeet</span>
        </div>
      </div>
    </div>
  );
}

function ReviewsSection() {
  const [reviews,    setReviews]    = useState(INITIAL_REVIEWS);
  const [showForm,   setShowForm]   = useState(false);
  const [stars,      setStars]      = useState(5);
  const [name,       setName]       = useState("");
  const [company,    setCompany]    = useState("");
  const [text,       setText]       = useState("");
  const [submitted,  setSubmitted]  = useState(false);

  // Load saved reviews from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("gm_reviews") || "[]");
      if (saved.length > 0) setReviews([...INITIAL_REVIEWS, ...saved]);
    } catch {}
  }, []);

  const submit = () => {
    if (!name.trim() || !text.trim() || stars === 0) return;
    const newReview = { id: Date.now(), name: name.trim(), company: company.trim(), stars, text: text.trim(), date: new Date().toLocaleDateString("es-AR", { month:"long", year:"numeric" }) };
    const updated = [...reviews, newReview];
    setReviews(updated);
    // Save to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("gm_reviews") || "[]");
      localStorage.setItem("gm_reviews", JSON.stringify([...saved, newReview]));
    } catch {}
    setSubmitted(true);
    setShowForm(false);
    setName(""); setCompany(""); setText(""); setStars(5);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const avgStars = reviews.length > 0 ? (reviews.reduce((s,r) => s+r.stars, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"0 20px 48px" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"24px" }}>
        <h2 style={{ color:"#f1f5f9", fontSize:"1.3rem", fontWeight:"600", margin:"0 0 6px", fontFamily:"'Segoe UI',sans-serif" }}>
          Lo que dicen nuestros clientes
        </h2>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <StarRating value={Math.round(Number(avgStars))} readonly />
          <span style={{ color:"#fbbf24", fontWeight:"700", fontSize:"1rem" }}>{avgStars}</span>
          <span style={{ color:"#475569", fontSize:".8rem" }}>({reviews.length} reseña{reviews.length!==1?"s":""})</span>
        </div>
      </div>

      {/* Reviews grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"14px", marginBottom:"20px" }}>
        {reviews.map(r => (
          <div key={r.id} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"14px", padding:"18px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
              <div>
                <div style={{ color:"#f1f5f9", fontWeight:"600", fontSize:".85rem" }}>{r.name}</div>
                {r.company && <div style={{ color:"#475569", fontSize:".72rem" }}>{r.company}</div>}
              </div>
              <StarRating value={r.stars} readonly />
            </div>
            <p style={{ color:"#94a3b8", fontSize:".82rem", lineHeight:"1.55", margin:"0 0 8px", fontStyle:"italic" }}>
              "{r.text}"
            </p>
            <div style={{ color:"#334155", fontSize:".68rem" }}>{r.date}</div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      {submitted && (
        <div style={{ textAlign:"center", color:"#4ade80", fontSize:".85rem", marginBottom:"12px" }}>
          ✅ ¡Gracias por tu reseña! Ya aparece en la lista.
        </div>
      )}

      {!showForm ? (
        <div style={{ textAlign:"center" }}>
          <button onClick={() => setShowForm(true)} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.12)", color:"#94a3b8", borderRadius:"10px", padding:"10px 22px", cursor:"pointer", fontFamily:"'Segoe UI',sans-serif", fontSize:".82rem", touchAction:"manipulation" }}>
            ⭐ Dejar una reseña
          </button>
        </div>
      ) : (
        <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"14px", padding:"20px", maxWidth:"480px", margin:"0 auto" }}>
          <h3 style={{ color:"#f1f5f9", fontSize:".92rem", fontWeight:"600", margin:"0 0 16px", fontFamily:"'Segoe UI',sans-serif" }}>Tu reseña</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <div>
              <label style={{ color:"#64748b", fontSize:".7rem", letterSpacing:".08em", display:"block", marginBottom:"5px" }}>CALIFICACIÓN</label>
              <StarRating value={stars} onChange={setStars} />
            </div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre *" style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#e2e8f0", borderRadius:"8px", padding:"9px 12px", fontSize:".84rem", outline:"none", fontFamily:"'Segoe UI',sans-serif", width:"100%", boxSizing:"border-box" }}/>
            <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Empresa (opcional)" style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#e2e8f0", borderRadius:"8px", padding:"9px 12px", fontSize:".84rem", outline:"none", fontFamily:"'Segoe UI',sans-serif", width:"100%", boxSizing:"border-box" }}/>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Contá tu experiencia con GlobalMeet *" rows={3} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#e2e8f0", borderRadius:"8px", padding:"9px 12px", fontSize:".84rem", outline:"none", fontFamily:"'Segoe UI',sans-serif", width:"100%", boxSizing:"border-box", resize:"vertical" }}/>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={submit} style={{ flex:1, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"8px", padding:"10px", fontSize:".84rem", fontWeight:"600", cursor:"pointer", fontFamily:"'Segoe UI',sans-serif" }}>
                Publicar reseña
              </button>
              <button onClick={() => setShowForm(false)} style={{ flex:1, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#64748b", borderRadius:"8px", padding:"10px", fontSize:".84rem", cursor:"pointer", fontFamily:"'Segoe UI',sans-serif" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Plan buttons: trial + buy monthly/annual + transferencia ──────────────────
const CBU_INFO = {
  titular: "German Arturo Mercado",
  cvu:     "0000003100067143702619",
  alias:   "german.momentos",
  cuit:    "20-38333928-7",
};

function PlanButtons({ plan, onTrial, onNotify }) {
  const [showBuy,      setShowBuy]      = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [copied,       setCopied]       = useState(false);

  const handleTrial = () => { onTrial(); };

  const copyAlias = () => {
    navigator.clipboard.writeText(CBU_INFO.alias);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    // Registrar intento de pago por transferencia
    try {
      const transfers = JSON.parse(localStorage.getItem("gm_transfer_log") || "[]");
      transfers.unshift({
        id:        Date.now(),
        userEmail: "Ver comprobante",
        userName:  "Pendiente",
        plan:      plan.name,
        billing:   "mensual",
        amount:    fmt(plan.priceMonthly),
        amountNum: plan.priceMonthly,
        date:      new Date().toLocaleString("es-AR"),
        status:    "pending",
      });
      localStorage.setItem("gm_transfer_log", JSON.stringify(transfers.slice(0, 50)));
    } catch {}
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
      {/* Probar gratis */}
      <button onClick={handleTrial} style={{ width:"100%", padding:"11px", borderRadius:"10px", background:`linear-gradient(135deg,${plan.color}99,${plan.color}66)`, border:`1px solid ${plan.accent}66`, color:"#fff", cursor:"pointer", fontFamily:"inherit", fontSize:".82rem", fontWeight:"600", touchAction:"manipulation" }}>
        🎁 Probar {plan.trialDays} días gratis
      </button>

      {/* Comprar ahora toggle */}
      {!showBuy ? (
        <button onClick={() => { setShowBuy(true); setShowTransfer(false); }} style={{ width:"100%", padding:"9px", borderRadius:"10px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"#64748b", cursor:"pointer", fontFamily:"inherit", fontSize:".78rem", touchAction:"manipulation" }}>
          Comprar ahora ↓
        </button>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"6px", animation:"fadeIn .2s ease" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>

          {/* MP Mensual */}
          <a href={plan.mpLink} target="_blank" rel="noreferrer"
            onClick={() => onNotify(null, null, plan.name, "monthly")}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"9px", borderRadius:"9px", background:"#009EE3", color:"#fff", textDecoration:"none", fontFamily:"inherit", fontSize:".78rem", fontWeight:"600", touchAction:"manipulation" }}>
            <MPLogo size={13}/> {fmt(plan.priceMonthly)}/mes
          </a>

          {/* MP Anual */}
          <a href={MP_LINKS[plan.id + "_anual"] || plan.mpLink} target="_blank" rel="noreferrer"
            onClick={() => onNotify(null, null, plan.name, "annual")}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"9px", borderRadius:"9px", background:"rgba(0,158,227,.15)", border:"1px solid rgba(0,158,227,.4)", color:"#38bdf8", textDecoration:"none", fontFamily:"inherit", fontSize:".78rem", fontWeight:"600", touchAction:"manipulation" }}>
            <MPLogo size={13}/> {fmt(plan.priceAnnual)}/año · −15%
          </a>

          {/* Transferencia bancaria */}
          {!showTransfer ? (
            <button onClick={() => setShowTransfer(true)} style={{ width:"100%", padding:"8px", borderRadius:"9px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", color:"#64748b", cursor:"pointer", fontFamily:"inherit", fontSize:".74rem", touchAction:"manipulation" }}>
              🏦 Pagar por transferencia
            </button>
          ) : (
            <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:"9px", padding:"10px 12px" }}>
              <div style={{ color:"#94a3b8", fontSize:".7rem", fontWeight:"600", marginBottom:"8px" }}>🏦 Datos para transferencia</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"4px", fontSize:".72rem", color:"#64748b" }}>
                <div><span style={{ color:"#475569" }}>Titular:</span> {CBU_INFO.titular}</div>
                <div><span style={{ color:"#475569" }}>CVU:</span> {CBU_INFO.cvu}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ color:"#475569" }}>Alias:</span>
                  <strong style={{ color:"#e2e8f0" }}>{CBU_INFO.alias}</strong>
                  <button onClick={copyAlias} style={{ background: copied?"rgba(52,211,153,.15)":"rgba(255,255,255,.08)", border:`1px solid ${copied?"rgba(52,211,153,.3)":"rgba(255,255,255,.12)"}`, color: copied?"#34d399":"#64748b", borderRadius:"5px", padding:"2px 7px", cursor:"pointer", fontSize:".65rem", fontFamily:"inherit" }}>
                    {copied ? "✓" : "Copiar"}
                  </button>
                </div>
              </div>
              <div style={{ marginTop:"8px", background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.2)", borderRadius:"7px", padding:"7px 10px", color:"#a5b4fc", fontSize:".7rem", lineHeight:"1.5" }}>
                Una vez transferido enviá el comprobante a <strong>{SUPPORT_EMAIL}</strong> y activamos tu plan en menos de 24hs.
              </div>
              <button onClick={() => setShowTransfer(false)} style={{ background:"none", border:"none", color:"#334155", cursor:"pointer", fontSize:".66rem", fontFamily:"inherit", marginTop:"5px" }}>✕ Cerrar</button>
            </div>
          )}

          <div style={{ textAlign:"center", color:"#1e293b", fontSize:".6rem", lineHeight:"1.4" }}>
            Pagá → ingresá con Google → enviá comprobante a {SUPPORT_EMAIL}
          </div>
          <button onClick={() => { setShowBuy(false); setShowTransfer(false); }} style={{ background:"none", border:"none", color:"#334155", cursor:"pointer", fontSize:".68rem", fontFamily:"inherit" }}>
            ✕ Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GLOBALMEETEROS SECTION
// ══════════════════════════════════════════════════════════════════════════════
function GlobalmeeteroSection() {
  const flags = ["🇦🇷","🇺🇸","🇧🇷","🇫🇷","🇩🇪","🇯🇵","🇨🇳","🇸🇦","🇷🇺","🇮🇹","🇲🇽","🇨🇴","🇨🇱","🇺🇾","🇵🇪"];
  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"0 20px 52px", textAlign:"center", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Logo grande */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:"24px" }}>
        <div style={{ position:"relative" }}>
          <div style={{ width:"120px", height:"120px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,.2), rgba(45,212,191,.1))", border:"2px solid rgba(99,102,241,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto" }}>
            <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="glg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#2dd4bf"/>
                </linearGradient>
                <linearGradient id="glg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="24" fill="url(#glg1)" opacity="0.15"/>
              <rect x="4" y="10" width="22" height="14" rx="7" fill="url(#glg1)"/>
              <rect x="4" y="20" width="8" height="8" rx="2" fill="url(#glg1)" transform="rotate(45 8 24)"/>
              <rect x="22" y="24" width="22" height="14" rx="7" fill="url(#glg2)"/>
              <rect x="36" y="28" width="8" height="8" rx="2" fill="url(#glg2)" transform="rotate(45 40 34)"/>
              <text x="7" y="20" fontSize="9" fill="white" fontFamily="Arial" fontWeight="bold">A</text>
              <text x="27" y="34" fontSize="9" fill="white" fontFamily="Arial" fontWeight="bold">文</text>
            </svg>
          </div>
          {/* Banderas orbitando */}
          {flags.slice(0,8).map((flag,i) => {
            const angle = (i/8)*360;
            const rad   = angle*(Math.PI/180);
            const r     = 70;
            const x     = Math.cos(rad)*r;
            const y     = Math.sin(rad)*r;
            return (
              <div key={i} style={{ position:"absolute", top:"50%", left:"50%", transform:`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, fontSize:"1.1rem", filter:"drop-shadow(0 2px 4px rgba(0,0,0,.3))" }}>
                {flag}
              </div>
            );
          })}
        </div>
      </div>

      <h2 style={{ color:"#f1f5f9", fontSize:"1.6rem", fontWeight:"700", margin:"0 0 8px" }}>
        ¡Hola, Globalmeetero! 👋
      </h2>
      <p style={{ color:"#64748b", fontSize:".9rem", margin:"0 0 6px", lineHeight:"1.6" }}>
        Somos una comunidad de profesionales que rompen barreras del idioma en sus negocios.
      </p>
      <p style={{ color:"#475569", fontSize:".82rem", margin:"0 0 20px" }}>
        Desde Buenos Aires hasta Tokio — todos hablamos el mismo idioma: los negocios.
      </p>

      {/* Stats */}
      <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap", marginBottom:"20px" }}>
        {[
          { n:"10",   label:"Idiomas",           icon:"🌐" },
          { n:"30",   label:"Personas por sala",  icon:"👥" },
          { n:"24/7", label:"Disponible siempre", icon:"⏰" },
          { n:"0",    label:"Barreras",           icon:"🚫" },
        ].map((s,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"12px", padding:"14px 20px", minWidth:"100px" }}>
            <div style={{ fontSize:"1.2rem", marginBottom:"2px" }}>{s.icon}</div>
            <div style={{ color:"#a5b4fc", fontWeight:"700", fontSize:"1.3rem" }}>{s.n}</div>
            <div style={{ color:"#475569", fontSize:".7rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Flags row */}
      <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap" }}>
        {flags.map((f,i) => (
          <span key={i} style={{ fontSize:"1.4rem", filter:"drop-shadow(0 1px 3px rgba(0,0,0,.3))" }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LANDING CHATBOT — asistente IA flotante con selector de idioma
// ══════════════════════════════════════════════════════════════════════════════
const LANDING_LANGS = [
  { code:"es", label:"Español",   flag:"🇪🇸" },
  { code:"en", label:"English",   flag:"🇺🇸" },
  { code:"pt", label:"Português", flag:"🇧🇷" },
  { code:"fr", label:"Français",  flag:"🇫🇷" },
  { code:"de", label:"Deutsch",   flag:"🇩🇪" },
  { code:"it", label:"Italiano",  flag:"🇮🇹" },
  { code:"ja", label:"日本語",    flag:"🇯🇵" },
  { code:"zh", label:"中文",      flag:"🇨🇳" },
  { code:"ar", label:"العربية",  flag:"🇸🇦" },
  { code:"ru", label:"Русский",   flag:"🇷🇺" },
];

function LandingChatBot() {
  const [open,     setOpen]     = useState(false);
  const [lang,     setLang]     = useState("es");
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [bubble,   setBubble]   = useState(true); // globo de bienvenida
  const bottomRef = useRef(null);

  const WELCOMES = {
    es: "👋 ¡Hola, Globalmeetero! ¿Estás listo para pertenecer a nuestra comunidad? Puedo contarte sobre los planes, cómo funciona la traducción, o hacer una demo. 🌍",
    en: "👋 Hello, Globalmeetero! Ready to join our community? I can tell you about plans, how translation works, or run a demo. 🌍",
    pt: "👋 Olá, Globalmeeteiro! Pronto para fazer parte da nossa comunidade? Posso ajudá-lo com planos, como funciona a tradução, ou uma demo. 🌍",
    fr: "👋 Bonjour, Globalmeeteur! Prêt à rejoindre notre communauté? Je peux vous parler des forfaits, du fonctionnement ou faire une démo. 🌍",
    de: "👋 Hallo, Globalmeeterer! Bereit, unserer Community beizutreten? Ich kann Ihnen über Pläne, Funktionsweise oder eine Demo berichten. 🌍",
    it: "👋 Ciao, Globalmeetero! Pronto a far parte della nostra comunità? Posso spiegarti i piani, come funziona la traduzione, o fare una demo. 🌍",
    ja: "👋 こんにちは、グローバルミーター！コミュニティに参加する準備はできていますか？プラン、翻訳の仕組み、デモについてお話しできます。🌍",
    zh: "👋 你好，全球会议者！准备好加入我们的社区了吗？我可以为您介绍套餐、翻译功能或演示。🌍",
    ar: "👋 مرحباً، عضو GlobalMeet! هل أنت مستعد للانضمام إلى مجتمعنا؟ يمكنني إخبارك عن الخطط أو كيفية عمل الترجمة. 🌍",
    ru: "👋 Привет, Глобалмитер! Готовы присоединиться к нашему сообществу? Могу рассказать о планах, как работает перевод, или провести демонстрацию. 🌍",
  };

  const SYSTEM_PROMPT = `Sos el asistente virtual de GlobalMeet, plataforma SaaS de chat empresarial con traducción simultánea diseñada por Momentos (Argentina).

Respondé SIEMPRE en el idioma del usuario.

Info clave:
- Planes: Prueba (gratis 14d), Básico ($14.900/mes, 2 personas), Pro ($24.900/mes, 3 personas), Enterprise ($44.900/mes, hasta 30 + video), Auricular ($59.900/mes, hasta 30 + auricular manos libres)
- 10 idiomas. 7 días gratis en planes pagos. Descuento anual 15%.
- Pago: Mercado Pago o transferencia bancaria (CVU: 0000003100067143702619, alias: german.momentos)
- Chrome/Edge tienen micrófono. iPhone solo texto.
- Comando "Hola GlobalMeet" activa el auricular.
- URL: https://globalmeet-six.vercel.app — Soporte: germanmomentos@gmail.com
- Comunidad: "Globalmeeteros" — profesionales que rompen barreras del idioma.

Sé amigable y conciso. Máximo 2-3 párrafos.`;

  // Mostrar globo de bienvenida al cargar
  useEffect(() => {
    const timer = setTimeout(() => setBubble(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Inicializar chat con bienvenida al abrir
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role:"assistant", text: WELCOMES[lang] || WELCOMES.es }]);
    }
  }, [open]);

  // Cambiar idioma — resetear chat
  useEffect(() => {
    if (messages.length > 0) {
      setMessages([{ role:"assistant", text: WELCOMES[lang] || WELCOMES.es }]);
    }
  }, [lang]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);
    setMessages(prev => [...prev, { role:"user", text:userMsg }]);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: [...history, { role:"user", content:userMsg }],
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data?.content?.[0]?.text || "No pude responder. Intentá de nuevo.";
      setMessages(prev => [...prev, { role:"assistant", text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role:"assistant", text:"Lo siento, hubo un error. Intentá de nuevo en unos segundos." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Globo de bienvenida */}
      {bubble && !open && (
        <div style={{ position:"fixed", bottom:"88px", right:"24px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius:"12px 12px 4px 12px", padding:"10px 14px", color:"#fff", fontSize:".8rem", fontWeight:"500", zIndex:499, maxWidth:"220px", boxShadow:"0 4px 20px rgba(99,102,241,.4)", cursor:"pointer", animation:"popIn .4s ease" }} onClick={()=>{ setOpen(true); setBubble(false); }}>
          <style>{`@keyframes popIn{from{opacity:0;transform:scale(.8) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
          👋 ¡Hola, Globalmeetero! ¿En qué te puedo ayudar?
          <button onClick={e=>{e.stopPropagation();setBubble(false);}} style={{ position:"absolute", top:"-6px", right:"-6px", background:"#475569", border:"none", color:"#fff", borderRadius:"50%", width:"16px", height:"16px", fontSize:".55rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
      )}

      {/* Botón flotante */}
      <button onClick={() => { setOpen(p=>!p); setBubble(false); }} style={{ position:"fixed", bottom:"24px", right:"24px", width:"56px", height:"56px", borderRadius:"50%", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", fontSize:"1.4rem", cursor:"pointer", boxShadow:"0 4px 20px rgba(99,102,241,.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", touchAction:"manipulation" }}>
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{ position:"fixed", bottom:"90px", right:"24px", width:"320px", maxWidth:"calc(100vw - 32px)", background:"#0f172a", border:"1px solid rgba(99,102,241,.3)", borderRadius:"16px", boxShadow:"0 20px 60px rgba(0,0,0,.6)", zIndex:500, display:"flex", flexDirection:"column", overflow:"hidden", maxHeight:"480px" }}>
          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"1.1rem" }}>🤖</span>
              <div>
                <div style={{ color:"#fff", fontWeight:"600", fontSize:".85rem" }}>Asistente GlobalMeet</div>
                <div style={{ color:"rgba(255,255,255,.7)", fontSize:".65rem" }}>Responde en tu idioma</div>
              </div>
            </div>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", borderRadius:"6px", padding:"3px 6px", fontSize:".72rem", cursor:"pointer", outline:"none" }}>
              {LANDING_LANGS.map(l => (
                <option key={l.code} value={l.code} style={{ background:"#1e293b", color:"#fff" }}>{l.flag} {l.label}</option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"12px", display:"flex", flexDirection:"column", gap:"8px", WebkitOverflowScrolling:"touch" }}>
            {messages.map((m,i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"82%", background:m.role==="user"?"linear-gradient(135deg,#4f46e5,#7c3aed)":"rgba(255,255,255,.06)", border:m.role==="assistant"?"1px solid rgba(255,255,255,.08)":"none", borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", padding:"8px 11px", color:"#e2e8f0", fontSize:".8rem", lineHeight:"1.5" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", gap:"4px", padding:"8px 11px", background:"rgba(255,255,255,.06)", borderRadius:"12px 12px 12px 4px", width:"fit-content" }}>
                {[0,1,2].map(i=><div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#64748b", animation:`bounce .8s ease-in-out ${i*.15}s infinite` }}/>)}
                <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:"10px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", gap:"7px" }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Escribí tu pregunta..." style={{ flex:1, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#e2e8f0", borderRadius:"8px", padding:"8px 11px", fontSize:".8rem", outline:"none", fontFamily:"'Segoe UI',sans-serif" }}/>
            <button onClick={send} disabled={loading||!input.trim()} style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"8px", padding:"8px 12px", cursor:"pointer", fontSize:".8rem", opacity:loading||!input.trim()?.5:1, touchAction:"manipulation" }}>↑</button>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECURITY SECTION
// ══════════════════════════════════════════════════════════════════════════════
function SecuritySection() {
  const checks = [
    { icon:"🔒", label:"HTTPS / SSL",          gm:true,  zoom:true,  meet:true,  whatsapp:true  },
    { icon:"🔑", label:"Login con Google OAuth", gm:true,  zoom:true,  meet:true,  whatsapp:false },
    { icon:"🛡️", label:"Datos encriptados",      gm:true,  zoom:true,  meet:true,  whatsapp:true  },
    { icon:"🗄️", label:"Base de datos segura",   gm:true,  zoom:false, meet:true,  whatsapp:false },
    { icon:"🚫", label:"Sin venta de datos",      gm:true,  zoom:false, meet:false, whatsapp:false },
    { icon:"🇦🇷", label:"Servidor en Sudamérica", gm:true,  zoom:false, meet:false, whatsapp:false },
    { icon:"🤖", label:"IA empresarial (Claude)", gm:true,  zoom:false, meet:false, whatsapp:false },
    { icon:"👁️", label:"Sin publicidad",          gm:true,  zoom:false, meet:false, whatsapp:true  },
  ];

  const competitors = [
    { name:"GlobalMeet", color:"#4f46e5", accent:"#a5b4fc", isUs:true  },
    { name:"Zoom",       color:"#2d8cff", accent:"#93c5fd", isUs:false },
    { name:"Meet",       color:"#34a853", accent:"#86efac", isUs:false },
    { name:"WhatsApp",   color:"#25d366", accent:"#86efac", isUs:false },
  ];

  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"0 20px 52px", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ textAlign:"center", marginBottom:"28px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(79,70,229,.08)", border:"1px solid rgba(99,102,241,.2)", borderRadius:"50px", padding:"8px 18px", marginBottom:"14px" }}>
          <span style={{ fontSize:"1rem" }}>🔒</span>
          <span style={{ color:"#a5b4fc", fontSize:".78rem", fontWeight:"600", letterSpacing:".1em" }}>SEGURIDAD DE NIVEL EMPRESARIAL</span>
        </div>
        <h2 style={{ color:"#f1f5f9", fontSize:"1.3rem", fontWeight:"600", margin:"0 0 6px" }}>
          ¿Por qué GlobalMeet es más seguro?
        </h2>
        <p style={{ color:"#475569", fontSize:".82rem", margin:0 }}>Comparativa con las apps más usadas del mercado</p>
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"480px" }}>
          <thead>
            <tr>
              <th style={{ textAlign:"left", padding:"10px 14px", color:"#475569", fontSize:".7rem", letterSpacing:".1em", textTransform:"uppercase", borderBottom:"1px solid rgba(255,255,255,.07)", width:"40%" }}>
                Característica
              </th>
              {competitors.map(c => (
                <th key={c.name} style={{ padding:"10px 8px", textAlign:"center", borderBottom:`2px solid ${c.isUs?"rgba(99,102,241,.5)":"rgba(255,255,255,.07)"}`, background:c.isUs?"rgba(79,70,229,.08)":"transparent", fontSize:".72rem", fontWeight:"700", color:c.isUs?c.accent:"#64748b", borderRadius:c.isUs?"8px 8px 0 0":0 }}>
                  {c.isUs && <span style={{ display:"block", fontSize:".58rem", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", borderRadius:"20px", padding:"1px 8px", marginBottom:"3px", letterSpacing:".08em" }}>⭐ NOSOTROS</span>}
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checks.map((row, ri) => (
              <tr key={ri} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                <td style={{ padding:"10px 14px", color:"#94a3b8", fontSize:".8rem", display:"flex", alignItems:"center", gap:"8px" }}>
                  <span>{row.icon}</span>{row.label}
                </td>
                {[row.gm, row.zoom, row.meet, row.whatsapp].map((val, ci) => (
                  <td key={ci} style={{ padding:"10px 8px", textAlign:"center", background:ci===0?"rgba(79,70,229,.05)":"transparent" }}>
                    {val
                      ? <span style={{ color:"#4ade80", fontSize:"1.1rem" }}>✓</span>
                      : <span style={{ color:"#ef4444", fontSize:"1rem" }}>✗</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Badges */}
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", justifyContent:"center", marginTop:"20px" }}>
        {[
          { icon:"🔒", label:"SSL 256-bit" },
          { icon:"🛡️", label:"OAuth 2.0" },
          { icon:"🗄️", label:"Supabase RLS" },
          { icon:"🤖", label:"Claude AI" },
          { icon:"🇦🇷", label:"São Paulo" },
        ].map((b,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"20px", padding:"6px 14px", display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ fontSize:".9rem" }}>{b.icon}</span>
            <span style={{ color:"#64748b", fontSize:".72rem", fontWeight:"600" }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LANDING
// ══════════════════════════════════════════════════════════════════════════════
function LandingScreen({ onLogin, onTrial, onChangePlan, isLoggedIn }) {
  const [billing, setBilling] = useState("monthly");
  const { isMobile } = useBreakpoint();
  const { lang, setLang, t } = useLang();

  const handleTrial = (planId) => {
    if (isLoggedIn && onChangePlan) onChangePlan(planId);
    else onTrial(planId);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080c14", fontFamily:"'Georgia','Times New Roman',serif", color:"#e2e8f0", overflowX:"hidden" }}>
      <style>{`
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .pcard{transition:transform .25s,box-shadow .25s;} @media(hover:hover){.pcard:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,.5);}}
        .mpbtn{transition:opacity .2s;} @media(hover:hover){.mpbtn:hover{opacity:.82;}}
      `}</style>
      <BrowserBanner />

      {/* ── Language selector en header ── */}
      <div style={{ display:"flex", justifyContent:"flex-end", padding:"10px 20px 0", gap:"8px", alignItems:"center" }}>
        <span style={{ color:"#334155", fontSize:".7rem" }}>🌐</span>
        <select value={lang} onChange={e=>setLang(e.target.value)} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#94a3b8", borderRadius:"8px", padding:"5px 10px", fontSize:".75rem", cursor:"pointer", outline:"none", fontFamily:"inherit" }}>
          {LANDING_LANGS.map(l=>(
            <option key={l.code} value={l.code} style={{ background:"#1e293b", color:"#fff" }}>{l.flag} {l.label}</option>
          ))}
        </select>
      </div>

      {/* ── PRIMERO: Comunidad Globalmeeteros ── */}
      <div style={{ textAlign:"center", padding: isMobile?"32px 16px 28px":"52px 40px 32px", background:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(99,102,241,.15) 0%,transparent 70%)", animation:"fadeIn .8s ease", maxWidth:"100%", overflow:"hidden" }}>

        {/* Logo con banderas como imágenes — visibles en Chrome/Edge/Windows */}
        <div style={{ position:"relative", width:"240px", height:"240px", margin:"0 auto 28px" }}>
          <div style={{ width:"120px", height:"120px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,.25), rgba(45,212,191,.1))", border:"2px solid rgba(99,102,241,.25)", display:"flex", alignItems:"center", justifyContent:"center", position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"floatY 4s ease-in-out infinite" }}>
            <AppLogo size={60} />
          </div>
          {[
            { code:"ar", top:"2%",   left:"50%",  tx:"-50%", ty:"0"     },
            { code:"us", top:"18%",  left:"88%",  tx:"-50%", ty:"0"     },
            { code:"br", top:"50%",  left:"98%",  tx:"-50%", ty:"-50%"  },
            { code:"fr", top:"82%",  left:"88%",  tx:"-50%", ty:"-100%" },
            { code:"de", top:"98%",  left:"50%",  tx:"-50%", ty:"-100%" },
            { code:"jp", top:"82%",  left:"12%",  tx:"-50%", ty:"-100%" },
            { code:"cn", top:"50%",  left:"2%",   tx:"-50%", ty:"-50%"  },
            { code:"it", top:"18%",  left:"12%",  tx:"-50%", ty:"0"     },
          ].map((item,i) => (
            <div key={i} style={{ position:"absolute", top:item.top, left:item.left, transform:`translate(${item.tx}, ${item.ty})` }}>
              <img src={`https://flagcdn.com/w40/${item.code}.png`} alt={item.code} width="28" height="20" style={{ borderRadius:"3px", boxShadow:"0 2px 8px rgba(0,0,0,.5)", display:"block" }} />
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: isMobile?"2rem":"clamp(2rem,4vw,3.2rem)", fontWeight:"700", margin:"0 0 12px", color:"#f1f5f9", fontFamily:"'Segoe UI',system-ui,sans-serif", lineHeight:1.2 }}>
          {t("hello")}
        </h1>
        <p style={{ color:"#64748b", fontSize: isMobile?".84rem":".94rem", margin:"0 0 6px", lineHeight:1.7, maxWidth:"560px", marginLeft:"auto", marginRight:"auto" }}>
          {t("community")}
        </p>
        <p style={{ color:"#475569", fontSize: isMobile?".78rem":".84rem", margin:"0 0 28px" }}>
          {t("community2")}
        </p>

        {/* Stats */}
        <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap", marginBottom:"28px" }}>
          {[{n:"10",label:"Idiomas",icon:"🌐"},{n:"30",label:"Max/sala",icon:"👥"},{n:"24/7",label:"Disponible",icon:"⏰"},{n:"0",label:"Barreras",icon:"🚫"}].map((s,i)=>(
            <div key={i} style={{ background:"rgba(99,102,241,.08)", border:"1px solid rgba(99,102,241,.15)", borderRadius:"14px", padding:"12px 20px", minWidth:"85px" }}>
              <div style={{ fontSize:"1.1rem", marginBottom:"4px" }}>{s.icon}</div>
              <div style={{ color:"#a5b4fc", fontWeight:"700", fontSize:"1.2rem" }}>{s.n}</div>
              <div style={{ color:"#475569", fontSize:".68rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: isMobile?"2rem":"2.8rem", fontWeight:"400", fontStyle:"italic", letterSpacing:".06em", margin:"0 0 6px", color:"#f1f5f9", textShadow:"0 0 60px rgba(99,102,241,.4)", fontFamily:"'Georgia',serif" }}>
          {APP_NAME}
        </h2>
        <p style={{ color:"#64748b", fontSize: isMobile?".82rem":".9rem", margin:"0 0 6px" }}>{t("slogan")}</p>
        <p style={{ color:"#1e293b", fontSize:".62rem", margin:"0 0 24px", letterSpacing:".1em" }}>DISEÑADO POR MOMENTOS</p>

        {BROWSER.micWarning && <p style={{ color:"#d97706", fontSize:".73rem", margin:"0 0 14px" }}>⚠️ {BROWSER.micWarning}</p>}

        <button onClick={onLogin} style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"14px", padding: isMobile?"14px 28px":"15px 36px", fontSize: isMobile?".92rem":"1rem", fontWeight:"600", cursor:"pointer", fontFamily:"'Segoe UI',sans-serif", boxShadow:"0 8px 32px rgba(99,102,241,.5)", touchAction:"manipulation" }}>
          {t("loginBtn")}
        </button>
        <p style={{ marginTop:"10px", color:"#334155", fontSize:".74rem", marginBottom:"28px" }}>{t("freedays")}</p>

        {/* Banderas en fila como imágenes */}
        <div style={{ display:"flex", gap:"6px", justifyContent:"center", flexWrap:"wrap", padding:"0 20px" }}>
          {["ar","us","br","fr","de","jp","cn","sa","ru","it","mx","co","cl","uy","pe"].map((code,i)=>(
            <img key={i} src={`https://flagcdn.com/w40/${code}.png`} alt={code} width="28" height="20" style={{ borderRadius:"3px", boxShadow:"0 1px 4px rgba(0,0,0,.4)" }} />
          ))}
        </div>
      </div>


      {/* ── Billing toggle ── */}
      <div style={{ display:"flex", justifyContent:"center", margin:"28px 0 16px" }}>
        {["monthly","annual"].map(b=>(
          <button key={b} onClick={()=>setBilling(b)} style={{ background:billing===b?"rgba(99,102,241,.2)":"transparent", border:billing===b?"1px solid rgba(99,102,241,.5)":"1px solid rgba(255,255,255,.08)", color:billing===b?"#a5b4fc":"#475569", padding:"7px 18px", cursor:"pointer", fontFamily:"inherit", fontSize:".8rem", borderRadius:b==="monthly"?"8px 0 0 8px":"0 8px 8px 0", transition:"all .2s", touchAction:"manipulation" }}>
            {t(b === "monthly" ? "monthly" : "annual")}
          </button>
        ))}
      </div>

      {/* ── Plans ── */}
      <div style={{ padding:"0 16px 52px" }}>
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
                  <button onClick={() => handleTrial("trial")} style={{ width:"100%", padding:"11px", borderRadius:"10px", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", color:"#94a3b8", cursor:"pointer", fontFamily:"inherit", fontSize:".82rem", fontWeight:"600", touchAction:"manipulation" }}>
                    Empezar gratis
                  </button>
                ) : (
                  <PlanButtons plan={plan} onTrial={() => handleTrial(plan.id)} onNotify={notifyPaymentAttempt} />
                )}
              </div>
            );
          })}
        </div>
        {<p style={{ textAlign:"center", color:"#334155", fontSize:".68rem", margin:"6px 0 0" }}>← Deslizá para ver todos los planes →</p>}
      </div>

      {/* ── Seguridad ── */}
      <SecuritySection />

      {/* ── Reseñas ── */}
      <ReviewsSection />

      <div style={{ textAlign:"center", color:"#1e293b", fontSize:".65rem", paddingBottom:"28px", letterSpacing:".1em" }}>
        {APP_NAME} · DISEÑADO POR MOMENTOS · POWERED BY CLAUDE AI
      </div>

      {/* ── Chat IA flotante ── */}
      <LandingChatBot />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN — Google Auth real con Supabase
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Detectar sesión al volver del redirect de Google
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await handleSession(session.user);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await handleSession(session.user);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (authUser) => {
    setLoading(true);
    // Limpiar el historial para que el botón "atrás" funcione bien
    try { window.history.replaceState({}, document.title, window.location.pathname); } catch {}
    try {
      // Buscar o crear usuario en la tabla users
      const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!existing) {
        // Usuario nuevo — crear con plan trial
        await supabase.from("users").insert({
          id:         authUser.id,
          email:      authUser.email,
          name:       authUser.user_metadata?.full_name || authUser.email.split("@")[0],
          plan_id:    "trial",
          billing:    "monthly",
          plan_end:   new Date(Date.now() + 14 * 86400000).toISOString(),
          is_active:  true,
        });
      }

      const userData = existing || {
        id:        authUser.id,
        email:     authUser.email,
        name:      authUser.user_metadata?.full_name || authUser.email.split("@")[0],
        plan_id:   "trial",
        plan_end:  new Date(Date.now() + 14 * 86400000).toISOString(),
      };

      onLogin({
        id:        userData.id,
        email:     userData.email,
        name:      userData.name,
        planId:    userData.plan_id,
        planEnd:   new Date(userData.plan_end),
        joinedAt:  new Date(userData.created_at || Date.now()),
      });
    } catch (e) {
      setErr("Error al iniciar sesión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErr("");
    // Guardar roomCode en la URL de redirect para que no se pierda en mobile
    const pendingRoom = localStorage.getItem("gm_pending_room") || "";
    const redirectUrl = pendingRoom
      ? `https://globalmeet-six.vercel.app?room=${pendingRoom}`
      : "https://globalmeet-six.vercel.app";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
    if (error) { setErr("Error al conectar con Google."); setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"20px" }}>
      <div style={{ width:"100%", maxWidth:"380px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"20px", padding:"32px 24px", boxShadow:"0 25px 60px rgba(0,0,0,.6)" }}>
        <div style={{ textAlign:"center", marginBottom:"22px" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"12px" }}><AppLogo size={48} withText /></div>
          <p style={{ color:"#475569", fontSize:".8rem", margin:0 }}>Ingresá con tu cuenta Google</p>
        </div>
        {err && <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:"8px", padding:"8px 12px", color:"#fca5a5", fontSize:".76rem", marginBottom:"12px" }}>⚠️ {err}</div>}
        {loading ? (
          <div style={{ textAlign:"center", padding:"20px 0", color:"#64748b" }}>
            <div style={{ fontSize:"1.4rem", marginBottom:"8px" }}>⏳</div>
            <div style={{ fontSize:".84rem" }}>Conectando con Google…</div>
          </div>
        ) : (
          <>
            <button onClick={handleGoogle} style={{ width:"100%", background:"linear-gradient(135deg,#4285f4,#34a853)", border:"none", color:"#fff", borderRadius:"10px", padding:"13px", fontSize:".9rem", fontWeight:"600", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", touchAction:"manipulation" }}>
              <span style={{ fontWeight:"900", fontSize:"1rem" }}>G</span> Continuar con Google
            </button>
            <p style={{ color:"#1e293b", fontSize:".68rem", textAlign:"center", margin:"12px 0 0" }}>Solo ingresás una vez · Sesión recordada</p>
          </>
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
  const maxPart  = (plan.id==="enterprise"||plan.id==="auricular") ? 30 : plan.id==="pro" ? 3 : 2;
  const notifs   = [];
  if (daysLeft===3)            notifs.push({ t:"warn",  m:`⚠️ Tu plan vence en 3 días (${planEnd?.toLocaleDateString("es-AR")}). Renovalo para no perder acceso.` });
  if (daysLeft===1)            notifs.push({ t:"warn",  m:"⚠️ Tu plan vence mañana. ¡Renovalo hoy!" });
  if (daysLeft<=0&&!isTrial)   notifs.push({ t:"error", m:"🔴 Tu plan venció. Renovalo para seguir usando GlobalMeet." });

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
            <RoomBtn icon="🎥"  label="Video + Chat"   desc={canEnt?"Hasta 30 personas":"Enterprise"}  color="#0f766e" available={canEnt}  locked={!canEnt}  onUpgrade={onGoPlans} onClick={()=>onStartRoom(30,true,false)}  isNew />
            <RoomBtn icon="🎧"  label="Modo Auricular"  desc={canAur?"Hasta 30 personas":"Voz IA · manos libres"} color="#b45309" available={canAur} locked={!canAur} onUpgrade={onGoPlans} onClick={()=>onStartRoom(30,false,true)} isNew style={{ gridColumn: isMobile?"1 / -1":"auto" }} />
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
function RoomSetup({ count, hasVideo, hasEarpiece, user, onStart, onBack, prefilledRoomCode }) {
  const { isMobile } = useBreakpoint();
  const spks = ["A","B",...(count===3?["C"]:[])];
  const [names,setNames]=useState({ A:user?.name||"Yo", B:"Participante B", C:"Participante C" });
  const [langs,setLangs]=useState({ A:"es", B:"en", C:"fr" });
  // FIX: usar roomCode de URL si existe, sino generar uno nuevo y persistirlo
  const [roomCode]=useState(() => {
    if (prefilledRoomCode) return prefilledRoomCode;
    const existing = sessionStorage.getItem("gm_current_room");
    if (existing) return existing;
    const newCode = genCode();
    sessionStorage.setItem("gm_current_room", newCode);
    return newCode;
  });
  const [copied,setCopied]=useState(false);
  const roomLink=`${window.location.origin}?room=${roomCode}`;
  const copyLink=()=>{ navigator.clipboard.writeText(roomLink); setCopied(true); setTimeout(()=>setCopied(false),2200); };
  const usedLangs=spk=>Object.entries(langs).filter(([k])=>k!==spk).map(([,v])=>v);

  // Limpiar sala al iniciar nueva
  const handleStart = (cfg) => {
    sessionStorage.removeItem("gm_current_room");
    onStart({ ...cfg, myKey: "A" });
  };

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

        <button onClick={()=>handleStart({names,langs,roomCode,count,hasVideo,hasEarpiece})} style={{ width:"100%", background:hasEarpiece?"linear-gradient(135deg,#b45309,#f59e0b)":hasVideo?"linear-gradient(135deg,#0f766e,#0d9488)":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"10px", padding:"12px", fontSize:".88rem", fontWeight:"600", cursor:"pointer", fontFamily:"inherit", touchAction:"manipulation" }}>
          {hasEarpiece?"🎧 Iniciar modo auricular →":hasVideo?"🎥 Iniciar videollamada →":"💬 Iniciar chat →"}
        </button>
      </div>
    </div>
  );
}

// ── Confetti — animación cuando alguien entra ────────────────────────────────
function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;
    const colors = ["#4f46e5","#7c3aed","#2dd4bf","#f472b6","#fbbf24","#34d399","#60a5fa","#f87171"];
    const newPieces = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(timer);
  }, [active]);

  if (!pieces.length) return null;

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:200, overflow:"hidden" }}>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          top: "-20px",
          width: p.shape === "circle" ? `${p.size}px` : `${p.size}px`,
          height: p.shape === "circle" ? `${p.size}px` : `${p.size * 0.6}px`,
          borderRadius: p.shape === "circle" ? "50%" : "2px",
          background: p.color,
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          transform: `rotate(${p.rotation}deg)`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}
function playJoinSound() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const t    = ctx.currentTime;
    // Dos tonos ascendentes tipo "chat"
    [[440, t, 0.08], [554, t+0.1, 0.08], [659, t+0.2, 0.1]].forEach(([freq, start, dur]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, start);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.start(start); osc.stop(start + dur);
    });
  } catch {}
}

// ── Presence: detectar cuando alguien entra a la sala ─────────────────────────
function usePresence(roomCode, userName) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!roomCode || !userName) return;
    const channel = supabase.channel(`presence:${roomCode}`, {
      config: { presence: { key: userName } }
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const names = Object.keys(state).map(k => state[k][0]?.name || k);
        setParticipants(names);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        const name = newPresences[0]?.name || key;
        if (name !== userName) {
          playJoinSound();
          // Vibrar en mobile
          try { if (navigator.vibrate) navigator.vibrate([100, 50, 100]); } catch {}
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name: userName, joinedAt: Date.now() });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [roomCode, userName]);

  return participants;
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT LOGIC HOOK
// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// CHAT LOGIC HOOK — participantes dinámicos via Supabase Presence
// ══════════════════════════════════════════════════════════════════════════════
function useChatLogic(config) {
  const [messages,        setMessages]        = useState([]);
  const [activeSpk,       setActiveSpk]       = useState(null);
  const [interims,        setInterims]        = useState({});
  const [dynParticipants, setDynParticipants] = useState([]);
  const recRef = useRef(null);
  const myKey  = config.myKey || "A";

  // Presence — participantes dinámicos
  useEffect(() => {
    const myName    = config.names?.[myKey] || "Usuario";
    const myLangCode= config.langs?.[myKey] || "es";
    const myLangObj = LANGUAGES.find(l => l.code === myLangCode);

    const initial = [{ key:myKey, name:myName, lang:myLangCode, flag:myLangObj?.flag||"🌐", isMe:true }];
    setDynParticipants(initial);

    const ch = supabase.channel(`participants:${config.roomCode}`, {
      config: { presence: { key: myKey } }
    });
    ch.on("presence", { event:"sync" }, () => {
        const state = ch.presenceState();
        const all = Object.entries(state).map(([key, arr]) => ({
          key, name:arr[0]?.name||key, lang:arr[0]?.lang||"es",
          flag:arr[0]?.flag||"🌐", isMe: key===myKey,
        }));
        setDynParticipants(all.length>0 ? all : initial);
      })
      .on("presence", { event:"join" }, ({ key }) => {
        if (key !== myKey) { playJoinSound(); try{navigator.vibrate&&navigator.vibrate([100,50,100]);}catch{} }
      })
      .subscribe(async status => {
        if (status==="SUBSCRIBED") {
          await ch.track({ name:myName, lang:myLangCode, flag:myLangObj?.flag||"🌐" });
        }
      });
    return () => { supabase.removeChannel(ch); };
  }, [config.roomCode, myKey]);

  // Mensajes Realtime
  useEffect(() => {
    supabase.from("messages").select("*")
      .eq("room_code", config.roomCode)
      .order("created_at", { ascending:true })
      .then(({ data }) => {
        if (data) setMessages(data.map(m => ({
          id:m.id, speaker:m.speaker, speakerName:m.speaker_name,
          speakerFlag:m.speaker_flag, original:m.original,
          translations:m.translations||{}, targetLangs:m.target_langs||{},
          time:new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
        })));
      });
    const ch = supabase.channel(`room:${config.roomCode}`)
      .on("postgres_changes",{event:"*",schema:"public",table:"messages",filter:`room_code=eq.${config.roomCode}`},
        payload => {
          const m=payload.new; if(!m) return;
          const msg={
            id:m.id, speaker:m.speaker, speakerName:m.speaker_name,
            speakerFlag:m.speaker_flag, original:m.original,
            translations:m.translations||{}, targetLangs:m.target_langs||{},
            time:new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
          };
          if(payload.eventType==="INSERT") setMessages(prev=>prev.find(x=>x.id===msg.id)?prev:[...prev,msg]);
          else if(payload.eventType==="UPDATE") setMessages(prev=>prev.map(x=>x.id===msg.id?{...x,...msg}:x));
        }
      ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [config.roomCode]);

  const submitText = useCallback(async (spkKey, text) => {
    if (!text.trim()) return;
    const myLangCode = dynParticipants.find(p=>p.key===spkKey)?.lang || config.langs?.[spkKey] || "es";
    const myLang     = LANGUAGES.find(l=>l.code===myLangCode);
    const others     = dynParticipants.filter(p=>p.key!==spkKey);
    const otherLangs = Object.fromEntries(others.map(p=>[p.key, LANGUAGES.find(l=>l.code===p.lang)]));
    const { data:inserted } = await supabase.from("messages").insert({
      room_code:    config.roomCode,
      speaker:      spkKey,
      speaker_name: dynParticipants.find(p=>p.key===spkKey)?.name||spkKey,
      speaker_flag: myLang?.flag,
      original:     text.trim(),
      translations: {},
      target_langs: Object.fromEntries(others.map(p=>[p.key,{flag:otherLangs[p.key]?.flag,label:otherLangs[p.key]?.label}])),
    }).select().single();
    if (!inserted) return;
    const translations = {};
    await Promise.all(others.map(async p => {
      const t = await claudeTranslate(text.trim(), myLang?.label, otherLangs[p.key]?.label);
      translations[p.key] = t;
    }));
    await supabase.from("messages").update({ translations }).eq("id", inserted.id);
  }, [config, dynParticipants]);

  const toggleMic = useCallback(async spkKey => {
    if (!BROWSER.micOk) return;
    if (activeSpk) { recRef.current?.stop(); return; }
    const myLangCode = dynParticipants.find(p=>p.key===spkKey)?.lang || config.langs?.[spkKey] || "es";
    const SR  = window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = LANGUAGES.find(l=>l.code===myLangCode)?.bcp??"es-ES";
    rec.continuous=true; rec.interimResults=true;
    let final="";
    rec.onstart  = ()=>setActiveSpk(spkKey);
    rec.onerror  = ()=>{ setActiveSpk(null); setInterims(p=>({...p,[spkKey]:""})); };
    rec.onresult = e=>{
      let interim=""; final="";
      for(let i=e.resultIndex;i<e.results.length;i++){
        if(e.results[i].isFinal) final+=e.results[i][0].transcript+" ";
        else interim+=e.results[i][0].transcript;
      }
      setInterims(p=>({...p,[spkKey]:interim||final}));
    };
    rec.onend = async ()=>{
      setActiveSpk(null); setInterims(p=>({...p,[spkKey]:""}));
      if(final.trim()) await submitText(spkKey,final.trim());
    };
    recRef.current=rec; rec.start();
  }, [activeSpk, config, dynParticipants, submitText]);

  return { messages, activeSpk, interims, participants:dynParticipants, toggleMic, submitText };
}


// ── DynMicBtn — botón de micrófono para participantes dinámicos ──────────────
function DynMicBtn({ spkKey, participants, activeSpk, toggleMic, interims, colorIndex=0 }) {
  const colors = ["#1d4ed8","#be185d","#047857","#7c3aed","#b45309","#0f766e","#0369a1","#9d174d"];
  const lights = ["#60a5fa","#f472b6","#34d399","#a78bfa","#fbbf24","#2dd4bf","#38bdf8","#fb7185"];
  const p      = participants.find(x=>x.key===spkKey);
  if (!p) return null;
  const base  = colors[colorIndex % colors.length];
  const light = lights[colorIndex % lights.length];
  const lang  = LANGUAGES.find(l=>l.code===p.lang);
  const isA   = activeSpk===spkKey;
  const isDis = activeSpk!==null&&!isA;

  return (
    <button onClick={()=>toggleMic(spkKey)} disabled={isDis} style={{ flex:1, minWidth:"70px", maxWidth:"120px", background:isA?`${base}28`:"rgba(255,255,255,.03)", border:`1.5px solid ${isA?base:"rgba(255,255,255,.07)"}`, borderRadius:"12px", padding:"10px 7px", cursor:isDis?"not-allowed":"pointer", opacity:isDis?.25:1, transition:"all .2s", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", fontFamily:"inherit", touchAction:"manipulation" }}>
      <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:isA?base:"rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".88rem", boxShadow:isA?`0 0 14px ${base}88`:"none", transition:"all .2s" }}>{isA?"⏹":"🎤"}</div>
      <div style={{ color:isA?light:"#94a3b8", fontWeight:"600", fontSize:".7rem", maxWidth:"80px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name.split(" ")[0]}</div>
      {isA ? <Waveform active bars={5} color={light}/> : <span style={{ color:"#334155", fontSize:".58rem" }}>{lang?.flag} {lang?.label}</span>}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT ROOM
// ══════════════════════════════════════════════════════════════════════════════
function ChatRoom({ config, onBack, onGoHome }) {
  const { isMobile } = useBreakpoint();
  const {messages,activeSpk,interims,participants,toggleMic,submitText}=useChatLogic(config);
  const [copied,setCopied]=useState(false);
  const [joinNotif,  setJoinNotif]  = useState(null);
  const [confettiOn, setConfettiOn] = useState(false);
  const [kicked,     setKicked]     = useState(false);
  const bottomRef=useRef(null);
  const myKey = config.myKey || "A";
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,interims]);

  // Presence — detectar cuando alguien entra
  const presenceList = usePresence(config.roomCode, config.names?.[myKey] || "Usuario");
  const prevPresence = useRef([]);
  useEffect(() => {
    const prev = prevPresence.current;
    const newOnes = presenceList.filter(n => !prev.includes(n) && n !== (config.names?.[myKey] || "Usuario"));
    if (newOnes.length > 0) {
      setJoinNotif(`${newOnes[0]} se unió a la sala`);
      setConfettiOn(true);
      setTimeout(() => { setJoinNotif(null); setConfettiOn(false); }, 3500);
    }
    prevPresence.current = presenceList;
  }, [presenceList]);

  // Escuchar señales de moderación
  useEffect(() => {
    const ch = supabase.channel(`mod:${config.roomCode}`)
      .on("broadcast", { event:"kick" }, ({ payload }) => {
        if (payload.key === myKey) setKicked(true);
      })
      .on("broadcast", { event:"ban" }, ({ payload }) => {
        if (payload.key === myKey) {
          try { localStorage.setItem(`gm_banned_${config.roomCode}`, "1"); } catch {}
          setKicked(true);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [config.roomCode, myKey]);

  if (kicked) return (
    <div style={{ minHeight:"100vh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif", padding:"20px" }}>
      <div style={{ textAlign:"center", maxWidth:"340px" }}>
        <div style={{ fontSize:"3rem", marginBottom:"14px" }}>⛔</div>
        <h2 style={{ color:"#f1f5f9", fontSize:"1.1rem", fontWeight:"600", marginBottom:"8px" }}>Fuiste removido de la sala</h2>
        <p style={{ color:"#64748b", fontSize:".82rem", marginBottom:"20px" }}>El moderador te expulsó de esta conversación.</p>
        <button onClick={onGoHome} style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"10px", padding:"11px 24px", cursor:"pointer", fontFamily:"inherit", fontSize:".88rem", fontWeight:"600" }}>Volver al inicio</button>
      </div>
    </div>
  );

  const roomLink=`${window.location.origin}?room=${config.roomCode}`;
  const copyLink=()=>{ navigator.clipboard.writeText(roomLink); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div style={{ height:"100dvh", background:"#080c14", display:"flex", flexDirection:"column", fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:"hidden" }}>
      <BrowserBanner />
      <Confetti active={confettiOn} />
      {/* Join notification */}
      {joinNotif && (
        <div style={{ position:"fixed", top:"60px", left:"50%", transform:"translateX(-50%)", background:"rgba(99,102,241,.95)", borderRadius:"20px", padding:"8px 18px", color:"#fff", fontSize:".8rem", fontWeight:"600", zIndex:100, boxShadow:"0 4px 20px rgba(0,0,0,.4)", animation:"fadeIn .3s ease", display:"flex", alignItems:"center", gap:"7px" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          👋 {joinNotif}
        </div>
      )}
      {/* Header */}
      <div style={{ background:"rgba(8,12,20,.96)", borderBottom:"1px solid rgba(255,255,255,.07)", padding: isMobile?"9px 12px":"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", backdropFilter:"blur(10px)", flexShrink:0 }}>
        <div style={{ cursor:"pointer" }} onClick={onGoHome}>
          <AppLogo size={24} withText />
        </div>
        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
          <ModeratorPanel participants={participants} myKey={myKey} roomCode={config.roomCode} onKick={()=>{}} />
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
          <div style={{ padding:"10px 12px 12px" }}>
            {/* Solo el micrófono del participante actual */}
            {(() => {
              const myKey = config.myKey || "A";
              const me = participants.find(p=>p.key===myKey) || participants[0];
              if (!me) return null;
              const idx = participants.findIndex(p=>p.key===myKey);
              return (
                <div style={{ display:"flex", gap:"10px", alignItems:"center", justifyContent:"center" }}>
                  <DynMicBtn spkKey={me.key} participants={participants} activeSpk={activeSpk} toggleMic={toggleMic} interims={interims} colorIndex={idx}/>
                  {/* Lista de otros participantes conectados */}
                  {participants.filter(p=>p.key!==myKey).length > 0 && (
                    <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                      {participants.filter(p=>p.key!==myKey).map((p,i)=>{
                        const lang=LANGUAGES.find(l=>l.code===p.lang);
                        const colors=["#be185d","#047857","#7c3aed","#b45309","#0f766e"];
                        const c=colors[i%colors.length];
                        return (
                          <div key={p.key} style={{ background:`${c}18`, border:`1px solid ${c}33`, borderRadius:"10px", padding:"7px 10px", display:"flex", alignItems:"center", gap:"6px" }}>
                            <div style={{ width:"24px", height:"24px", borderRadius:"50%", background:c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".7rem" }}>👤</div>
                            <div>
                              <div style={{ color:"#e2e8f0", fontSize:".7rem", fontWeight:"600" }}>{p.name.split(" ")[0]}</div>
                              <div style={{ color:"#334155", fontSize:".58rem" }}>{lang?.flag}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          (() => {
            const myKey = config.myKey || "A";
            const me = participants.find(p=>p.key===myKey) || participants[0];
            if (!me) return null;
            const lang=LANGUAGES.find(l=>l.code===me.lang);
            return <TextInputFallback placeholder={`${me.name} — ${lang?.label}...`} onSubmit={t=>submitText(me.key,t)}/>;
          })()
        )}
        <div style={{ textAlign:"center", color:"#1e293b", fontSize:".55rem", paddingBottom:"6px", letterSpacing:".08em" }}>{APP_NAME} · MOMENTOS</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// JOIN ROOM — pantalla simplificada para quien recibe el link
// ══════════════════════════════════════════════════════════════════════════════
function JoinRoom({ config, user, onJoin, onBack }) {
  const { isMobile } = useBreakpoint();
  const [myName, setMyName] = useState(user?.name || "");
  const [myLang, setMyLang] = useState("en");

  const join = () => {
    if (!myName.trim()) return;
    // Generar una key única para este participante
    const myKey = `P${Date.now().toString(36).slice(-4).toUpperCase()}`;
    onJoin({
      ...config,
      myKey,
      names: { ...config.names, [myKey]: myName.trim() },
      langs: { ...config.langs, [myKey]: myLang },
    });
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"20px" }}>
      <div style={{ width:"100%", maxWidth:"400px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(99,102,241,.25)", borderRadius:"20px", padding:"28px 24px" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}>
          <AppLogo size={40} withText />
        </div>
        <h2 style={{ color:"#f1f5f9", fontSize:"1rem", fontWeight:"600", textAlign:"center", margin:"0 0 6px" }}>
          📨 Te invitaron a una sala
        </h2>
        <p style={{ color:"#475569", fontSize:".78rem", textAlign:"center", margin:"0 0 20px" }}>
          Código: <strong style={{ color:"#a5b4fc" }}>{config.roomCode}</strong>
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <div>
            <label style={{ color:"#64748b", fontSize:".7rem", letterSpacing:".08em", display:"block", marginBottom:"5px" }}>TU NOMBRE</label>
            <input value={myName} onChange={e=>setMyName(e.target.value)} placeholder="¿Cómo te llamás?" style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#e2e8f0", borderRadius:"8px", padding:"10px 12px", fontSize:".88rem", outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" }} />
          </div>
          <div>
            <label style={{ color:"#64748b", fontSize:".7rem", letterSpacing:".08em", display:"block", marginBottom:"5px" }}>TU IDIOMA</label>
            <LangSelect value={myLang} onChange={setMyLang} />
          </div>
          <button onClick={join} disabled={!myName.trim()} style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", color:"#fff", borderRadius:"10px", padding:"12px", fontSize:".9rem", fontWeight:"600", cursor:"pointer", fontFamily:"inherit", opacity:myName.trim()?1:.5, touchAction:"manipulation" }}>
            Entrar a la sala →
          </button>
          <button onClick={onBack} style={{ background:"none", border:"none", color:"#334155", cursor:"pointer", fontSize:".76rem", fontFamily:"inherit" }}>
            ← Volver al inicio
          </button>
        </div>
        <div style={{ textAlign:"center", color:"#1e293b", fontSize:".62rem", marginTop:"14px" }}>DISEÑADO POR MOMENTOS</div>
      </div>
    </div>
  );
}

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
// ── TTS helper ────────────────────────────────────────────────────────────────
function speakText(text, langCode) {
  try {
    window.speechSynthesis.cancel();
    const utt    = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice  = voices.find(v=>v.lang.startsWith(langCode||"es"))||voices[0];
    if (voice) utt.voice = voice;
    utt.rate=0.95; utt.pitch=1; utt.volume=1;
    window.speechSynthesis.speak(utt);
  } catch {}
}

function ChatBubble({ msg, compact }) {
  const c   = SPK[msg.speaker]||{ light:"#94a3b8", bg:"rgba(99,102,241,.18)", border:"rgba(99,102,241,.3)" };
  const isA = msg.speaker==="A";
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = (text, langCode) => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    setSpeaking(true);
    window.speechSynthesis.cancel();
    const utt    = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice  = voices.find(v=>v.lang.startsWith(langCode||"es"))||voices[0];
    if (voice) utt.voice = voice;
    utt.rate=0.95; utt.onend=()=>setSpeaking(false); utt.onerror=()=>setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:isA?"flex-start":"flex-end", marginBottom:compact?"8px":"12px", animation:"fadeIn .3s ease" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ fontSize:".58rem", color:c.light, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"2px", paddingLeft:"3px" }}>{msg.speakerName}</div>
      <div style={{ maxWidth:compact?"92%":"78%", background:c.bg, border:`1px solid ${c.border}`, borderRadius:isA?"4px 13px 13px 13px":"13px 4px 13px 13px", padding:compact?"7px 10px":"9px 12px", boxShadow:"0 2px 10px rgba(0,0,0,.3)" }}>
        <div style={{ color:"#e2e8f0", fontSize:compact?".78rem":".87rem", lineHeight:"1.5", display:"flex", alignItems:"center", gap:"4px", flexWrap:"wrap" }}>
          <span><span style={{ fontSize:".52rem", marginRight:"3px" }}>{msg.speakerFlag}</span>{msg.original}</span>
          <button onClick={()=>handleSpeak(msg.original, LANGUAGES.find(l=>l.flag===msg.speakerFlag)?.code||"es")} style={{ background:"none", border:"none", color:speaking?"#4ade80":"#334155", cursor:"pointer", fontSize:".72rem", padding:"0", flexShrink:0 }} title="Escuchar">
            {speaking?"⏹":"🔊"}
          </button>
        </div>
        {msg.translating && (
          <div style={{ marginTop:"4px", paddingTop:"4px", borderTop:"1px solid rgba(255,255,255,.06)", color:"#475569", fontSize:".68rem", display:"flex", alignItems:"center", gap:"4px" }}>
            <div style={{ width:"8px", height:"8px", border:"1.5px solid #334155", borderTopColor:"#94a3b8", borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            Traduciendo…
          </div>
        )}
        {!msg.translating && msg.translations && Object.entries(msg.translations).map(([spk,t])=>{
          const tc=SPK[spk]||{light:"#94a3b8"}; const tl=msg.targetLangs?.[spk]; const isErr=t?.startsWith("⚠️");
          return (
            <div key={spk} style={{ marginTop:"4px", paddingTop:"4px", borderTop:"1px solid rgba(255,255,255,.05)", color:isErr?"#ef4444":tc?.light??"#94a3b8", fontSize:compact?".7rem":".75rem", fontStyle:isErr?"normal":"italic", lineHeight:"1.4", display:"flex", alignItems:"center", gap:"4px" }}>
              <span style={{ flex:1 }}><span style={{ fontSize:".5rem", marginRight:"3px" }}>{tl?.flag}</span>{t||<span style={{ color:"#334155" }}>…</span>}</span>
              {t&&!isErr&&(
                <button onClick={()=>handleSpeak(t, tl?.code||"en")} style={{ background:"none", border:"none", color:"#334155", cursor:"pointer", fontSize:".65rem", padding:"0", flexShrink:0 }} title="Escuchar traducción">🔊</button>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize:".52rem", color:"#1e293b", marginTop:"2px", paddingLeft:"3px" }}>{msg.time}</div>
    </div>
  );
}

// ── Moderator Panel ───────────────────────────────────────────────────────────
function ModeratorPanel({ participants, myKey, roomCode, onKick }) {
  const [open,   setOpen]   = useState(false);
  const [banned, setBanned] = useState([]);
  if (myKey !== "A" || participants.length <= 1) return null;

  const sendMod = async (event, key) => {
    try {
      await supabase.channel(`mod:${roomCode}`).send({
        type:"broadcast", event, payload:{ key }
      });
    } catch {}
  };

  const kick = async (key) => {
    await sendMod("kick", key);
    onKick && onKick(key);
  };

  const ban = async (key) => {
    setBanned(prev=>[...prev,key]);
    await sendMod("ban", key);
    onKick && onKick(key);
  };

  return (
    <div style={{ position:"relative" }}>
      <button onClick={()=>setOpen(p=>!p)} style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.25)", color:"#f87171", borderRadius:"7px", padding:"5px 9px", cursor:"pointer", fontSize:".66rem", fontFamily:"inherit" }}>
        👮 {open?"✕":"Moderar"}
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:"#0f172a", border:"1px solid rgba(255,255,255,.1)", borderRadius:"12px", padding:"12px", minWidth:"220px", zIndex:200, boxShadow:"0 10px 30px rgba(0,0,0,.5)" }}>
          <div style={{ color:"#94a3b8", fontSize:".68rem", letterSpacing:".1em", marginBottom:"8px" }}>👮 MODERACIÓN</div>
          {participants.filter(p=>p.key!==myKey).map(p=>(
            <div key={p.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <span style={{ color:"#cbd5e1", fontSize:".78rem" }}>{p.name} {p.flag}</span>
              <div style={{ display:"flex", gap:"4px" }}>
                <button onClick={()=>sendMod("mute",p.key)} style={{ background:"rgba(217,119,6,.15)", border:"1px solid rgba(217,119,6,.3)", color:"#fbbf24", borderRadius:"5px", padding:"3px 7px", cursor:"pointer", fontSize:".62rem", fontFamily:"inherit" }} title="Silenciar">🔇</button>
                <button onClick={()=>kick(p.key)} style={{ background:"rgba(239,68,68,.15)", border:"1px solid rgba(239,68,68,.3)", color:"#f87171", borderRadius:"5px", padding:"3px 7px", cursor:"pointer", fontSize:".62rem", fontFamily:"inherit" }} title="Expulsar">⛔</button>
                <button onClick={()=>ban(p.key)} style={{ background:"rgba(239,68,68,.25)", border:"1px solid rgba(239,68,68,.4)", color:"#ef4444", borderRadius:"5px", padding:"3px 7px", cursor:"pointer", fontSize:".62rem", fontFamily:"inherit" }} title="Bloquear reingreso">🚫</button>
              </div>
            </div>
          ))}
          <div style={{ color:"#1e293b", fontSize:".6rem", marginTop:"8px" }}>🔇 Silenciar · ⛔ Expulsar · 🚫 Bloquear</div>
        </div>
      )}
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

function EarpieceRoom({ config, onBack, onGoHome }) {
  const { isMobile } = useBreakpoint();
  const [status,       setStatus]       = useState("waiting");
  const [transcript,   setTranscript]   = useState("");
  const [lastMsg,      setLastMsg]      = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [voiceId,      setVoiceId]      = useState("female_es");
  const [activeSpeaker,setActiveSpeaker]= useState(config.myKey || "A");
  const [volume,       setVolume]       = useState(1);
  const [copied,       setCopied]       = useState(false);
  const [audioMode,    setAudioMode]    = useState("earpiece"); // "earpiece" | "speaker" | "text"
  const [autoStarted,  setAutoStarted]  = useState(false);
  const recRef   = useRef(null);
  const speaking = useRef(false);
  const bottomRef = useRef(null);

  const myKey      = config.myKey || "A";
  const participants = ["A", "B", ...(config.count === 30 || config.count > 3 ? [] : config.count === 3 ? ["C"] : [])];
  const roomLink   = `${window.location.origin}?room=${config.roomCode}`;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Escuchar mensajes entrantes de otros participantes y reproducirlos ────────
  useEffect(() => {
    const myKey      = config.myKey || "A";
    const myLangCode = config.langs?.[myKey] || "es";
    const myLang     = LANGUAGES.find(l => l.code === myLangCode);

    // Cargar mensajes previos
    supabase.from("messages").select("*")
      .eq("room_code", config.roomCode)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data.map(m => ({
          id: m.id, speaker: m.speaker, speakerName: m.speaker_name,
          speakerFlag: m.speaker_flag, original: m.original,
          translations: m.translations || {}, targetLangs: m.target_langs || {},
          time: new Date(m.created_at).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
          myTranslation: (m.translations || {})[myKey] || null,
        })));
      });

    // Escuchar mensajes nuevos en tiempo real
    const channel = supabase.channel(`earpiece:${config.roomCode}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "messages",
        filter: `room_code=eq.${config.roomCode}`
      }, (payload) => {
        const m = payload.new; if (!m) return;

        const msg = {
          id: m.id, speaker: m.speaker, speakerName: m.speaker_name,
          speakerFlag: m.speaker_flag, original: m.original,
          translations: m.translations || {}, targetLangs: m.target_langs || {},
          time: new Date(m.created_at).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
          myTranslation: (m.translations || {})[myKey] || null,
        };

        // Actualizar lista de mensajes
        if (payload.eventType === "INSERT") {
          setMessages(prev => prev.find(x => x.id === msg.id) ? prev : [...prev, msg]);
        } else if (payload.eventType === "UPDATE") {
          setMessages(prev => prev.map(x => x.id === msg.id ? { ...x, ...msg } : x));

          // ✅ REPRODUCIR AUTOMÁTICAMENTE cuando llega la traducción para mí
          const myTranslation = (m.translations || {})[myKey];
          if (myTranslation && m.speaker !== myKey && !speaking.current && audioMode !== "text") {
            // Esperar un momento para no interrumpir si estoy hablando
            setTimeout(() => {
              if (!speaking.current) {
                speak(myTranslation, myLang?.bcp || "es-ES");
              }
            }, 300);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [config.roomCode, config.myKey, config.langs, audioMode, speak]);

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

  // Speak translation — respeta el modo de audio
  const speak = useCallback((text, langBcp) => {
    if (!text || speaking.current) return;
    if (audioMode === "text") return; // solo texto, no reproducir
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const { voice, rate, pitch } = getVoice(langBcp);
    if (voice) utt.voice = voice;
    utt.rate = rate; utt.pitch = pitch;
    utt.volume = audioMode === "speaker" ? 1 : volume;
    speaking.current = true;
    setStatus("speaking");
    utt.onend  = () => { speaking.current = false; setStatus("waiting"); };
    utt.onerror= () => { speaking.current = false; setStatus("waiting"); };
    window.speechSynthesis.speak(utt);
  }, [getVoice, volume, audioMode]);

  // Main listen loop
  const startListening = useCallback(() => {
    if (!BROWSER.micOk) return;
    if (speaking.current) return; // no escuchar mientras habla
    const SR  = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const spk    = activeSpeaker;
    const myLang = LANGUAGES.find(l => l.code === config.langs?.[spk]);
    const others = ["A","B","C"].filter(p => p !== spk && config.langs?.[p]);
    const otherLangs = Object.fromEntries(others.map(p => [p, LANGUAGES.find(l => l.code === config.langs[p])]));

    const rec = new SR();
    rec.lang = "es-ES"; // siempre español para detectar wake word
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
      const wakeVariants = ["hola globalmeet","hola global meet","ola globalmeet","hola globalmed","hola globe meet"];
      if (!activated && wakeVariants.some(w => full.includes(w))) {
        activated = true;
        setStatus("listening");
        setTranscript("");
        return;
      }
      if (activated) setTranscript(interim || finalText);
    };

    rec.onend = async () => {
      if (!activated || !finalText.trim()) {
        // No se detectó wake word — volver a escuchar después de un momento
        setStatus("waiting");
        if (!speaking.current) setTimeout(() => startListening(), 800);
        return;
      }
      setTranscript("");
      setStatus("translating");

      const translations = {};
      await Promise.all(others.map(async p => {
        const t = await claudeTranslate(finalText.trim(), myLang?.label, otherLangs[p]?.label);
        translations[p] = t;
      }));

      const msg = {
        id: Date.now(), speaker: spk,
        speakerName: config.names?.[spk] || spk,
        speakerFlag: myLang?.flag,
        original: finalText.trim(),
        translations,
        targetLangs: otherLangs,
        time: nowTime(),
      };
      setMessages(prev => [...prev, msg]);
      setLastMsg(msg);

      // Hablar primera traducción
      const firstOther = others[0];
      if (translations[firstOther] && audioMode !== "text") {
        speak(translations[firstOther], otherLangs[firstOther]?.bcp);
      }
      setStatus("waiting");
      // Volver a escuchar después de hablar
      setTimeout(() => { if (!speaking.current) startListening(); }, 3000);
    };

    rec.onerror = () => {
      setStatus("waiting");
      if (!speaking.current) setTimeout(startListening, 1500);
    };

    recRef.current = rec;
    try { rec.start(); } catch {}
  }, [activeSpeaker, config, speak, audioMode]);

  // Start on mount — solo una vez
  useEffect(() => {
    const timer = setTimeout(() => {
      if (BROWSER.micOk) startListening();
    }, 500);
    return () => {
      clearTimeout(timer);
      recRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  // Restart when speaker or voice changes
  useEffect(() => {
    recRef.current?.stop();
    window.speechSynthesis.cancel();
    speaking.current = false;
    if (BROWSER.micOk) setTimeout(startListening, 600);
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
        <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor:"pointer" }} onClick={onGoHome}>
          <AppLogo size={24} withText />
          <span style={{ background: "rgba(251,191,36,.15)", color: "#fbbf24", borderRadius: "20px", padding: "2px 9px", fontSize: ".62rem", fontWeight: "700" }}>🎧 AURICULAR</span>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems:"center" }}>
          {/* Selector modo audio */}
          <select value={audioMode} onChange={e=>setAudioMode(e.target.value)} style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(251,191,36,.25)", color:"#fbbf24", borderRadius:"7px", padding:"4px 8px", fontSize:".62rem", cursor:"pointer", outline:"none", fontFamily:"inherit" }}>
            <option value="earpiece" style={{background:"#1e293b"}}>🎧 Auricular</option>
            <option value="speaker"  style={{background:"#1e293b"}}>🔊 Altavoz</option>
            <option value="text"     style={{background:"#1e293b"}}>📝 Solo texto</option>
          </select>
          <button onClick={() => { navigator.clipboard.writeText(roomLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: copied ? "rgba(52,211,153,.12)" : "rgba(251,191,36,.1)", border: `1px solid ${copied ? "rgba(52,211,153,.3)" : "rgba(251,191,36,.25)"}`, color: copied ? "#34d399" : "#fbbf24", borderRadius: "7px", padding: "5px 9px", cursor: "pointer", fontSize: ".66rem", fontFamily: "inherit" }}>
            {copied ? "✓" : "🔗"}
          </button>
          <button onClick={() => { recRef.current?.stop(); window.speechSynthesis.cancel(); onBack(); }} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", color: "#475569", borderRadius: "7px", padding: "5px 9px", cursor: "pointer", fontSize: ".66rem", fontFamily: "inherit" }}>← Salir</button>
        </div>
      </div>

      {/* Modo info */}
      {audioMode === "speaker" && (
        <div style={{ background:"rgba(59,130,246,.1)", borderBottom:"1px solid rgba(59,130,246,.2)", padding:"6px 14px", color:"#60a5fa", fontSize:".72rem", textAlign:"center" }}>
          🔊 Modo altavoz — la traducción se reproduce por el parlante del teléfono
        </div>
      )}
      {audioMode === "text" && (
        <div style={{ background:"rgba(100,116,139,.1)", borderBottom:"1px solid rgba(100,116,139,.2)", padding:"6px 14px", color:"#94a3b8", fontSize:".72rem", textAlign:"center" }}>
          📝 Solo texto — la traducción aparece en pantalla sin audio
        </div>
      )}

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
              <div style={{ fontSize: ".74rem", color: "#334155" }}>Cuando alguien hable, la traducción aparecerá acá y se reproducirá en tu auricular</div>
            </div>
          )}
          {messages.map(msg => {
            const myKey      = config.myKey || "A";
            const isMe       = msg.speaker === myKey;
            const myLangCode = config.langs?.[myKey] || "es";
            const myTranslation = msg.translations?.[myKey];
            const myLangObj  = LANGUAGES.find(l => l.code === myLangCode);
            const colors     = ["#1d4ed8","#be185d","#047857","#7c3aed","#b45309"];
            const spkIdx     = ["A","B","C","D","E"].indexOf(msg.speaker);
            const spkColor   = colors[spkIdx >= 0 ? spkIdx : 0];

            return (
              <div key={msg.id} style={{ marginBottom: "12px", animation: "fadeIn .3s ease" }}>
                {/* Mensaje original */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: spkColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", color: "#fff", fontWeight: "700", flexShrink: 0 }}>
                    {msg.speakerName?.charAt(0) || "?"}
                  </div>
                  <span style={{ color: "#64748b", fontSize: ".68rem" }}>{msg.speakerName}</span>
                  <span style={{ color: "#1e293b", fontSize: ".6rem" }}>{msg.time}</span>
                  {isMe && <span style={{ color: "#4f46e5", fontSize: ".6rem", fontWeight: "600" }}>· vos</span>}
                </div>

                {/* Original */}
                <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "8px", padding: "7px 10px", marginLeft: "28px", marginBottom: "4px" }}>
                  <span style={{ color: "#94a3b8", fontSize: ".78rem" }}>{msg.speakerFlag} {msg.original}</span>
                </div>

                {/* Mi traducción — destacada */}
                {!isMe && myTranslation && (
                  <div style={{ background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.25)", borderRadius: "8px", padding: "8px 11px", marginLeft: "28px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: ".9rem", flexShrink: 0 }}>{myLangObj?.flag}</span>
                    <span style={{ color: "#fbbf24", fontSize: ".84rem", fontWeight: "500", flex: 1 }}>{myTranslation}</span>
                    {audioMode !== "text" && (
                      <button onClick={() => speak(myTranslation, myLangObj?.bcp)} style={{ background: "none", border: "none", color: "#f59e0b", cursor: "pointer", fontSize: ".8rem", flexShrink: 0 }} title="Reproducir">🔊</button>
                    )}
                  </div>
                )}

                {/* Traduciendo... */}
                {!isMe && !myTranslation && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "28px", color: "#475569", fontSize: ".72rem" }}>
                    <div style={{ width: "8px", height: "8px", border: "1.5px solid #334155", borderTopColor: "#94a3b8", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    Traduciendo...
                  </div>
                )}
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
  const langCtx = useAppLang();
  const [screen,      setScreen]      = useState("landing");
  const [user,        setUser]        = useState(null);
  const [plan,        setPlan]        = useState({ id:"trial" });
  const [roomCount,   setRoomCount]   = useState(2);
  const [hasVideo,    setHasVideo]    = useState(false);
  const [hasEarpiece, setHasEarpiece] = useState(false);
  const [chatCfg,     setChatCfg]     = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode  = urlParams.get("room");
    if (roomCode) {
      try { localStorage.setItem("gm_pending_room", roomCode); window.history.replaceState({}, document.title, "/"); } catch {}
    }
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single();
        if (userData) {
          setUser({ id:userData.id, email:userData.email, name:userData.name, planId:userData.plan_id, planEnd:new Date(userData.plan_end), joinedAt:new Date(userData.created_at) });
          setPlan({ id: userData.plan_id || "trial" });
          const pendingRoom = localStorage.getItem("gm_pending_room");
          if (pendingRoom) {
            localStorage.removeItem("gm_pending_room");
            setChatCfg({ roomCode:pendingRoom, count:2, hasVideo:false, hasEarpiece:false, names:{A:userData.name,B:"B"}, langs:{A:"es",B:"en"}, myKey:`P${Date.now().toString(36).slice(-4).toUpperCase()}` });
            setScreen("joinRoom");
          } else { setScreen("dashboard"); }
        }
      }
    });
  }, []);

  const handleLogin = u => {
    let selectedPlan = "trial";
    try { const s=localStorage.getItem("gm_selected_plan"); if(s){selectedPlan=s;localStorage.removeItem("gm_selected_plan");} } catch {}
    setUser({ ...u, joinedAt: u.joinedAt || new Date() });
    setPlan({ id: u.planId || selectedPlan });
    try {
      const pendingRoom = localStorage.getItem("gm_pending_room");
      if (pendingRoom) {
        localStorage.removeItem("gm_pending_room");
        setChatCfg({ roomCode:pendingRoom, count:2, hasVideo:false, hasEarpiece:false, names:{A:u.name,B:"B"}, langs:{A:"es",B:"en"}, myKey:`P${Date.now().toString(36).slice(-4).toUpperCase()}` });
        setScreen("joinRoom"); return;
      }
    } catch {}
    setScreen("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setPlan({ id:"trial" });
    window.history.replaceState({}, document.title, "/");
    setScreen("landing");
  };

  const handleChangePlan = async (newPlanId) => {
    if (!user?.id) { setScreen("landing"); return; }
    const planEnd = new Date(Date.now() + (newPlanId==="trial"?14:7)*86400000).toISOString();
    await supabase.from("users").update({ plan_id:newPlanId, plan_end:planEnd }).eq("id", user.id);
    setPlan({ id: newPlanId }); setScreen("dashboard");
  };

  const handleStart = (count, video, earpiece) => {
    if (plan.id==="trial" && isTrialExpired(user)) { setScreen("trialExpired"); return; }
    setRoomCount(count); setHasVideo(video); setHasEarpiece(earpiece||false); setScreen("roomSetup");
  };

  const handleLaunch = cfg => {
    setChatCfg(cfg);
    if (cfg.hasEarpiece) setScreen("earpiece");
    else if (cfg.hasVideo) setScreen("enterprise");
    else setScreen("chat");
  };

  return (
    <LangContext.Provider value={langCtx}>
      {screen==="landing"      && <LandingScreen onLogin={()=>setScreen("login")} onTrial={(planId)=>{ if(planId){try{localStorage.setItem("gm_selected_plan",planId);}catch{}} setScreen("login"); }} onChangePlan={handleChangePlan} isLoggedIn={!!user} />}
      {screen==="login"        && <LoginScreen onLogin={handleLogin} />}
      {screen==="trialExpired" && <TrialExpiredWall onGoPlans={()=>setScreen("landing")} />}
      {screen==="dashboard"    && <Dashboard user={user} plan={plan} onStartRoom={handleStart} onGoPlans={()=>setScreen("landing")} onLogout={handleLogout} />}
      {screen==="roomSetup"    && <RoomSetup count={roomCount} hasVideo={hasVideo} hasEarpiece={hasEarpiece} user={user} onStart={handleLaunch} onBack={()=>setScreen("dashboard")} prefilledRoomCode={chatCfg?.roomCode} />}
      {screen==="joinRoom"     && <JoinRoom config={chatCfg} user={user} onJoin={handleLaunch} onBack={()=>setScreen("landing")} />}
      {screen==="chat"         && <ChatRoom config={chatCfg} onBack={()=>setScreen("dashboard")} onGoHome={()=>setScreen("landing")} />}
      {screen==="enterprise"   && <EnterpriseRoom config={chatCfg} onBack={()=>setScreen("dashboard")} onGoHome={()=>setScreen("landing")} />}
      {screen==="earpiece"     && <EarpieceRoom config={chatCfg} onBack={()=>setScreen("dashboard")} onGoHome={()=>setScreen("landing")} />}
    </LangContext.Provider>
  );
}
