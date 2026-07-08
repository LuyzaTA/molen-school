"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Lang ─────────────────────────────────────────────────────────────────────
export type Lang = "en" | "pt";
const LANG_KEY = "molen.lang";

function useLang() {
  const [lang, setLangState] = useState<Lang>("pt");
  useEffect(() => {
    try {
      const s = localStorage.getItem(LANG_KEY) as Lang | null;
      if (s === "en" || s === "pt") setLangState(s);
    } catch {}
  }, []);
  function setLang(l: Lang) {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}
  }
  return { lang, setLang };
}

// ── Brand palette ─────────────────────────────────────────────────────────────
const P = {
  parchment: "#F4ECDA",
  cream:     "#FFFAEF",
  dark:      "#1C2218",
  darkMid:   "#253A18",
  green:     "#4C6A2E",
  gold:      "#C29A57",
  tan:       "#DCC8A0",
  ink:       "#2A2D28",
  inkMuted:  "#6A6253",
  inkSubtle: "#978B74",
  maroon:    "#6E1822",
} as const;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

// ── Translations ─────────────────────────────────────────────────────────────
type Bi = { en: string; pt: string };
const b = (en: string, pt: string): Bi => ({ en, pt });

const C = {
  signIn:       b("Sign in",     "Entrar"),
  getStarted:   b("Get started", "Começar"),

  heroEyebrow:  b("Speaking-first English · Brazil", "Inglês com foco em conversação · Brasil"),
  heroH1:       b("Where English\nFinds Your Voice.", "Onde o Inglês\nEncontra a Sua Voz."),
  heroBold:     b("95 % of people speak English fluently", "95% da população fala inglês com fluência"),
  heroBody1:    b("Inspired by the country where", "Inspirado no país onde"),
  heroBody2:    b(
    "— Molen puts real conversation at the heart of every lesson, from the very first class.",
    "— a Molen coloca a conversa de verdade no centro de cada aula, desde a primeira.",
  ),
  heroCta1:     b("Start learning", "Começar"),
  heroCta2:     b("Already a student", "Já sou aluno(a)"),
  heroQuote:    b('"I finally started speaking!" 🎉', '"Finalmente comecei a falar!" 🎉'),
  heroStat:     b("#1 English fluency worldwide", "#1 em fluência de inglês no mundo"),

  whyEyebrow:   b("Why Molen Works", "Por que a Molen Funciona"),
  whyH2:        b("English is spoken, not memorized.", "Inglês se fala, não se memoriza."),
  whyBody:      b(
    "Most courses wait months before asking you to speak. We flip the script — because the only way to get fluent is to actually use the language.",
    "A maioria dos cursos espera meses antes de pedir que você fale. Nós invertemos o processo — porque a única forma de atingir a fluência é usando o idioma de verdade.",
  ),

  aboutEyebrow: b("Meet your teacher", "Conheça sua professora"),
  aboutQuote:   b(
    "Fluency is built, class by class, mistakes by mistakes, conversation by conversation. I'm here to walk every step of that journey with you. Are you ready to communicate with confidence in a multi-polar world?",
    "A fluência é construída aula por aula, erro por erro, conversa por conversa. Estou aqui para caminhar cada passo dessa jornada com você. Você está pronto(a) para se comunicar com confiança em um mundo multipolar?",
  ),
  aboutIt:      b("IT background", "Background em TI"),
  aboutItDesc:  b(
    "10 years living and working across 3 countries in technology.",
    "10 anos morando e trabalhando em 3 países na área de tecnologia.",
  ),
  aboutItLink:  b("See portfolio →", "Ver portfólio →"),

  contactEyebrow: b("Get in touch", "Entre em contato"),
  contactH2:    b("Ready to find your English voice?", "Pronto(a) para encontrar a sua voz em inglês?"),
  contactBody:  b(
    "Have a question before starting? Send a message — or go ahead and create your account. Your first class could be this week.",
    "Tem alguma dúvida antes de começar? Mande uma mensagem — ou crie sua conta agora. Sua primeira aula pode ser ainda esta semana.",
  ),
  contactCta:   b("Contact Us →", "Fale Conosco →"),

  footerAbout:   b("About",   "Sobre"),
  footerContact: b("Contact", "Contato"),
  footerSignIn:  b("Sign in", "Entrar"),
} as const;

// ── Static data (bilingual) ───────────────────────────────────────────────────
function getPillars(lang: Lang) {
  return [
    {
      icon: "🎙️", iconBg: "#E4E9CF", iconColor: "#4C6A2E",
      title: lang === "en" ? "Speak from Day One"        : "Fale desde o Primeiro Dia",
      desc:  lang === "en"
        ? "No grammar drills before you open your mouth. From the very first class you speak, respond, and converse — mistakes and all."
        : "Sem exercícios de gramática antes de abrir a boca. Na primeira aula você já fala, responde e conversa — erros inclusos.",
    },
    {
      icon: "🇳🇱", iconBg: "#F1E6CB", iconColor: "#9E7A36",
      title: lang === "en" ? "The Dutch Blueprint"       : "O Método Holandês",
      desc:  lang === "en"
        ? "The Netherlands ranks #1 globally in English proficiency. Their method: immersive speaking over rote memorization. That's exactly what Molen teaches."
        : "A Holanda é #1 mundial em proficiência em inglês. O método deles: conversação imersiva em vez de memorização. É exatamente isso que a Molen ensina.",
    },
    {
      icon: "👥", iconBg: "#E7E4C6", iconColor: "#6B6A2F",
      title: lang === "en" ? "Small Groups, Real Results" : "Grupos Pequenos, Resultados Reais",
      desc:  lang === "en"
        ? "Intimate live sessions mean you actually speak — a lot. Plus conversation circles to practice with peers at your exact level."
        : "Sessões ao vivo em turmas reduzidas garantem que você fale de verdade — e bastante. Além de círculos de conversação para praticar com colegas do seu nível.",
    },
  ];
}

// Flag emojis don't render on Windows (they fall back to letter pairs like
// "BR"), so flags are drawn as tiny inline SVGs that look the same everywhere.
type FlagCode = "br" | "pl" | "bg" | "nl" | "us";

const FLAG_ART: Record<FlagCode, React.ReactNode> = {
  br: (
    <>
      <rect width="30" height="21" fill="#009C3B" />
      <path d="M15 3.2 26 10.5 15 17.8 4 10.5Z" fill="#FEDF00" />
      <circle cx="15" cy="10.5" r="4" fill="#002776" />
    </>
  ),
  pl: (
    <>
      <rect width="30" height="10.5" fill="#FFFFFF" />
      <rect y="10.5" width="30" height="10.5" fill="#DC143C" />
    </>
  ),
  bg: (
    <>
      <rect width="30" height="7" fill="#FFFFFF" />
      <rect y="7" width="30" height="7" fill="#00966E" />
      <rect y="14" width="30" height="7" fill="#D62612" />
    </>
  ),
  nl: (
    <>
      <rect width="30" height="7" fill="#AE1C28" />
      <rect y="7" width="30" height="7" fill="#FFFFFF" />
      <rect y="14" width="30" height="7" fill="#21468B" />
    </>
  ),
  us: (
    <>
      <rect width="30" height="21" fill="#FFFFFF" />
      <rect y="0" width="30" height="3" fill="#B22234" />
      <rect y="6" width="30" height="3" fill="#B22234" />
      <rect y="12" width="30" height="3" fill="#B22234" />
      <rect y="18" width="30" height="3" fill="#B22234" />
      <rect width="13" height="9" fill="#3C3B6E" />
    </>
  ),
};

function Flag({ code, width = 30 }: { code: FlagCode; width?: number }) {
  const height = Math.round(width * 0.7);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 21"
      aria-hidden
      style={{ display: "block", borderRadius: 3, boxShadow: "0 0 0 1px rgba(42,45,40,0.15)" }}
    >
      <clipPath id={`flag-clip-${code}`}>
        <rect width="30" height="21" rx="3" />
      </clipPath>
      <g clipPath={`url(#flag-clip-${code})`}>{FLAG_ART[code]}</g>
    </svg>
  );
}

function getCountries(lang: Lang) {
  return [
    {
      flags: ["br"] as FlagCode[],
      label: lang === "en" ? "Born & raised in Brazil"                        : "Nascida e criada no Brasil",
      desc:  lang === "en" ? "Where the dream of speaking English fluently began." : "Onde começou o sonho de falar inglês com fluência.",
    },
    {
      flags: ["pl", "bg", "nl"] as FlagCode[],
      label: lang === "en" ? "Poland · Bulgaria · Netherlands — 10 years abroad" : "Polônia · Bulgária · Países Baixos — 10 anos no exterior",
      desc:  lang === "en"
        ? "A decade building an IT career across Europe, with language as the constant thread."
        : "Uma década construindo carreira em TI pela Europa, com o idioma como fio condutor.",
    },
    {
      flags: ["us"] as FlagCode[],
      label: lang === "en" ? "California — English studies"                    : "Califórnia — estudos de inglês",
      desc:  lang === "en"
        ? "Immersive language study in the United States, from classrooms to daily conversations."
        : "Estudo imersivo nos Estados Unidos, de salas de aula a conversas do cotidiano.",
    },
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────
export function LandingClient() {
  const { lang, setLang } = useLang();
  const s = (bi: Bi) => bi[lang];
  const pillars  = getPillars(lang);
  const countries = getCountries(lang);

  return (
    <div style={{ backgroundColor: P.parchment, color: P.ink, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: P.parchment, borderBottom: `1px solid ${P.tan}`,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, padding: "0 clamp(0.9rem, 4vw, 2rem)" }}>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(1.7rem, 5.5vw, 2.2rem)", color: P.maroon, letterSpacing: "-0.01em" }}>Molen</div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.28em", textTransform: "uppercase", color: P.dark, fontWeight: 700, marginTop: 5 }}>English Classes</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Language switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, border: `1px solid ${P.tan}`, borderRadius: 999, padding: "2px 3px" }}>
              {(["pt", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: "4px 11px", borderRadius: 999, border: "none",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em",
                    backgroundColor: lang === l ? P.ink : "transparent",
                    color: lang === l ? P.parchment : P.inkMuted,
                    transition: "all 150ms",
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <Link href="/login" className="hidden hover:bg-[#EAE0C8] sm:inline-block" style={{ padding: "7px 20px", borderRadius: 999, fontSize: 14, fontWeight: 600, color: P.ink, textDecoration: "none" }}>
              {s(C.signIn)}
            </Link>
            <Link href="/contact" className="hover:opacity-90" style={{ padding: "8px clamp(14px, 3vw, 22px)", borderRadius: 999, fontSize: 14, fontWeight: 700, backgroundColor: P.green, color: P.cream, textDecoration: "none", whiteSpace: "nowrap" }}>
              {s(C.getStarted)}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: `radial-gradient(ellipse 60% 80% at 80% 20%, rgba(194,154,87,0.18) 0%, transparent 70%), linear-gradient(145deg, ${P.dark} 0%, ${P.darkMid} 60%, #1A2E12 100%)`,
        color: P.parchment, padding: "80px clamp(1rem, 4vw, 2rem) 96px", overflow: "hidden", position: "relative",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,154,87,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -100, left: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(93,122,70,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", display: "flex", alignItems: "center", gap: 56, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 340px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: 16 }}>
              {s(C.heroEyebrow)}
            </p>
            <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(2.6rem, 6vw, 4.25rem)", lineHeight: 1.07, letterSpacing: "-0.01em", color: P.parchment, marginBottom: 24, whiteSpace: "pre-line" }}>
              {s(C.heroH1)}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(244,236,218,0.78)", maxWidth: 480, marginBottom: 40 }}>
              {s(C.heroBody1)}{" "}
              <strong style={{ color: P.gold, fontWeight: 600 }}>{s(C.heroBold)}</strong>{" "}
              {s(C.heroBody2)}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <Link href="/contact" className="hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(194,154,87,0.45)]" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 999, backgroundColor: P.gold, color: P.dark, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 24px rgba(194,154,87,0.35)" }}>
                {s(C.heroCta1)} <span aria-hidden>→</span>
              </Link>
              <Link href="/login" className="hover:bg-white/10" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 999, border: "1.5px solid rgba(244,236,218,0.28)", color: "rgba(244,236,218,0.88)", fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                {s(C.heroCta2)}
              </Link>
            </div>
          </div>

          <div style={{ position: "relative", maxWidth: "100%", paddingTop: 32, paddingBottom: 32, margin: "0 auto" }}>
            <Image src="/circular_logo.png" alt="Molen English Classes" width={300} height={300} style={{ display: "block", maxWidth: "100%", height: "auto", filter: "drop-shadow(0 16px 56px rgba(0,0,0,0.5))" }} priority />
            <div style={{ position: "absolute", top: 0, right: -16, maxWidth: 168, transform: "rotate(3deg)", backgroundColor: P.cream, color: P.ink, borderRadius: 16, padding: "12px 16px", fontSize: 13, fontWeight: 500, lineHeight: 1.45, boxShadow: "0 8px 32px rgba(0,0,0,0.22)" }}>
              {s(C.heroQuote)}
            </div>
            <div style={{ position: "absolute", bottom: 0, left: -8, transform: "rotate(-2deg)", backgroundColor: P.gold, color: P.dark, borderRadius: 14, padding: "10px 18px", fontSize: 13, fontWeight: 700, boxShadow: "0 6px 24px rgba(0,0,0,0.25)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
              <Flag code="nl" width={22} />
              {s(C.heroStat)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Molen Works ── */}
      <section style={{ backgroundColor: P.parchment, padding: "80px 2rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: P.green, marginBottom: 12 }}>{s(C.whyEyebrow)}</p>
          <h2 style={{ fontFamily: SERIF, fontWeight: 700, textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: P.ink, marginBottom: 16, lineHeight: 1.2 }}>{s(C.whyH2)}</h2>
          <p style={{ textAlign: "center", fontSize: 15, lineHeight: 1.7, color: P.inkMuted, maxWidth: 520, margin: "0 auto 56px" }}>{s(C.whyBody)}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {pillars.map(({ icon, title, desc, iconBg, iconColor }) => (
              <div key={title} style={{ backgroundColor: P.cream, border: `1px solid ${P.tan}`, borderRadius: 20, padding: "28px 28px 32px", boxShadow: "0 1px 2px rgba(42,45,40,0.04), 0 8px 24px -12px rgba(42,45,40,0.08)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>{icon}</div>
                <h3 style={{ fontFamily: SERIF, fontWeight: 700, color: P.ink, fontSize: 16, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: P.inkMuted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{ background: "linear-gradient(155deg, #EDE0C0 0%, #F6F0DE 100%)", padding: "80px 2rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: P.green, marginBottom: 12 }}>{s(C.aboutEyebrow)}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 56, alignItems: "start" }}>

            {/* Story */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                <Image
                  src="/luyza.jpg"
                  alt="Luyza Alexandre"
                  width={100}
                  height={100}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: `3px solid ${P.gold}`,
                    boxShadow: "0 4px 20px rgba(42,45,40,0.15)",
                  }}
                />
                <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: P.ink, fontSize: "clamp(1.8rem, 4vw, 2.3rem)", lineHeight: 1.15, margin: 0 }}>Luyza Alexandre</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 15, lineHeight: 1.75, color: P.inkMuted }}>

                {lang === "pt" ? (
                  <>
                    <p>Quatro países, um fio condutor: o inglês. Minha carreira em tecnologia me levou do Brasil à Polônia, à Bulgária e aos <strong style={{ color: P.ink, fontWeight: 600 }}>Países Baixos</strong> — e, em cada lugar, a fluência foi a ponte entre quem eu era e quem eu poderia me tornar.</p>
                    <p>Uma década em <strong style={{ color: P.ink, fontWeight: 600 }}>equipes multinacionais</strong> me ensinou a navegar por todos os sotaques que o inglês pode ter. E, do outro lado da mesa de entrevista, me mostrou algo mais difícil de aceitar: consultores brasileiros brilhantes perdendo oportunidades que mereciam — não por falta de talento, mas por falta de confiança no inglês falado.</p>
                    <p>Foram os holandeses que redefiniram fluência para mim: <strong style={{ color: P.ink, fontWeight: 600 }}>mais de 95% falam inglês com naturalidade</strong> — 1º lugar no mundo — não por talento, mas por hábito. A língua vive no dia a dia, não trancada numa sala de aula. Eu me imergi na <strong style={{ color: P.ink, fontWeight: 600 }}>Califórnia</strong> para absorver o inglês como ele realmente é falado; nos Países Baixos, entendi como ensiná-lo.</p>
                    <p>É por isso que a <strong style={{ color: P.ink, fontWeight: 600 }}>Molen English Classes</strong> existe. Você já tem o que a fluência mais exige — calor humano, expressividade e coragem de se conectar. Meu papel é criar o ambiente onde o seu inglês finalmente aparece. O seu é simplesmente falar.</p>
                  </>
                ) : (
                  <>
                    <p>Four countries, one thread: English. My career in technology carried me from Brazil to Poland, Bulgaria and the <strong style={{ color: P.ink, fontWeight: 600 }}>Netherlands</strong> — and everywhere I went, fluency was the bridge between who I was and who I could become.</p>
                    <p>A decade on <strong style={{ color: P.ink, fontWeight: 600 }}>cross-country teams</strong> taught me to navigate every accent English has to offer. And on the other side of the interview table, it showed me something harder to accept: brilliant Brazilian consultants losing opportunities they deserved — not for lack of talent, but for lack of confidence in spoken English.</p>
                    <p>It was the Dutch who redefined fluency for me: <strong style={{ color: P.ink, fontWeight: 600 }}>over 95% speak English effortlessly</strong> — #1 in the world — not through talent, but through habit. The language lives in daily life, not locked inside a classroom. I immersed myself in <strong style={{ color: P.ink, fontWeight: 600 }}>California</strong> to absorb English as it is truly spoken; in the Netherlands, I understood how to teach it.</p>
                    <p>That is why <strong style={{ color: P.ink, fontWeight: 600 }}>Molen English Classes</strong> exists. You already have what fluency demands most — warmth, expressiveness and the courage to connect. My role is to build the environment where your English finally comes out. Yours is simply to speak.</p>
                  </>
                )}

                <blockquote style={{ borderLeft: `4px solid ${P.gold}`, paddingLeft: 20, marginTop: 8, fontSize: 15.5, fontWeight: 600, color: P.ink, fontStyle: "normal", lineHeight: 1.6 }}>
                  {s(C.aboutQuote)}
                </blockquote>
              </div>
            </div>

            {/* Country + IT cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
              {countries.map(({ flags, label, desc }) => (
                <div key={label} style={{ backgroundColor: P.cream, border: `1px solid ${P.tan}`, borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 16, boxShadow: "0 1px 2px rgba(42,45,40,0.04)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, paddingTop: 2 }}>
                    {flags.map((f) => (
                      <Flag key={f} code={f} />
                    ))}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: P.ink }}>{label}</p>
                    <p style={{ fontSize: 13, color: P.inkMuted, marginTop: 3, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
              <div style={{ backgroundColor: P.cream, border: `1px solid ${P.tan}`, borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 16, boxShadow: "0 1px 2px rgba(42,45,40,0.04)" }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>💻</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: P.ink }}>{s(C.aboutIt)}</p>
                  <p style={{ fontSize: 13, color: P.inkMuted, marginTop: 3, lineHeight: 1.5 }}>
                    {s(C.aboutItDesc)}{" "}
                    <a href="https://luyzata-website.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: P.green, fontWeight: 600, textDecoration: "none" }} className="hover:underline">
                      {s(C.aboutItLink)}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section id="contact" style={{ background: `linear-gradient(145deg, ${P.dark} 0%, ${P.darkMid} 100%)`, color: P.parchment, padding: "80px 2rem", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -120, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,154,87,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "44rem", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: 12 }}>{s(C.contactEyebrow)}</p>
          <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: P.parchment, marginBottom: 18, lineHeight: 1.2 }}>{s(C.contactH2)}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(244,236,218,0.72)", marginBottom: 40 }}>{s(C.contactBody)}</p>
          <Link href="/contact" className="hover:opacity-90" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 999, backgroundColor: P.gold, color: P.dark, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(194,154,87,0.3)" }}>
            {s(C.contactCta)}
          </Link>
          <p style={{ marginTop: 24, fontSize: 13, color: "rgba(244,236,218,0.45)", letterSpacing: "0.04em" }}>
            alexandre.t.luyza@gmail.com
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: P.parchment, borderTop: `1px solid ${P.tan}`, padding: "28px 2rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <p style={{ fontSize: 13, color: P.inkSubtle }}>
            © 2026 Molen English Classes · {lang === "en" ? "Brazil" : "Brasil"}
          </p>
          <div style={{ display: "flex", gap: 28, fontSize: 13 }}>
            <a href="#about"   style={{ color: P.inkMuted, textDecoration: "none" }} className="hover:text-[#2A2D28]">{s(C.footerAbout)}</a>
            <a href="#contact" style={{ color: P.inkMuted, textDecoration: "none" }} className="hover:text-[#2A2D28]">{s(C.footerContact)}</a>
            <Link href="/login" style={{ color: P.inkMuted, textDecoration: "none" }} className="hover:text-[#2A2D28]">{s(C.footerSignIn)}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
