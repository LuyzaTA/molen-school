import Image from "next/image";
import Link from "next/link";

// ── Fixed brand palette — landing renders the same regardless of OS theme ─────
const P = {
  parchment:  "#F4ECDA",
  cream:      "#FFFAEF",
  dark:       "#1C2218",
  darkMid:    "#253A18",
  green:      "#4C6A2E",
  greenMid:   "#5D7A46",
  gold:       "#C29A57",
  goldDark:   "#9E7A36",
  tan:        "#DCC8A0",
  ink:        "#2A2D28",
  inkMuted:   "#6A6253",
  inkSubtle:  "#978B74",
  maroon:     "#6E1822",
} as const;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

export const metadata = {
  title: "Molen English Classes — Where English Finds Your Voice",
  description:
    "Speaking-first English classes in Brazil, inspired by the country where 95% of people speak English fluently. Start your journey today.",
};

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: P.parchment, color: P.ink, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: P.parchment,
        borderBottom: `1px solid ${P.tan}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: "72rem", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 72, padding: "0 2rem",
        }}>
          {/* Brand wordmark only */}
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "2.2rem", color: P.maroon, letterSpacing: "-0.01em" }}>
              Molen
            </div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.28em", textTransform: "uppercase", color: P.dark, fontWeight: 700, marginTop: 5 }}>
              English Classes
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="https://molen-school.vercel.app/login" style={{
              padding: "7px 20px", borderRadius: 999,
              fontSize: 14, fontWeight: 600,
              color: P.ink, textDecoration: "none",
              transition: "background 150ms",
            }}
              className="hover:bg-[#EAE0C8]"
            >
              Sign in
            </Link>
            <Link href="/contact" style={{
              padding: "8px 22px", borderRadius: 999,
              fontSize: 14, fontWeight: 700,
              backgroundColor: P.green, color: P.cream,
              textDecoration: "none", transition: "opacity 150ms",
            }}
              className="hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: `radial-gradient(ellipse 60% 80% at 80% 20%, rgba(194,154,87,0.18) 0%, transparent 70%),
                     linear-gradient(145deg, ${P.dark} 0%, ${P.darkMid} 60%, #1A2E12 100%)`,
        color: P.parchment,
        padding: "80px 2rem 96px",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Decorative blobs */}
        <div aria-hidden style={{
          position: "absolute", top: -80, right: -80,
          width: 480, height: 480, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(194,154,87,0.14) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", bottom: -100, left: -60,
          width: 360, height: 360, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(93,122,70,0.18) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: "72rem", margin: "0 auto", position: "relative",
          display: "flex", alignItems: "center", gap: 56,
          flexWrap: "wrap",
        }}>
          {/* Text column */}
          <div style={{ flex: "1 1 340px" }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: P.gold, marginBottom: 16,
            }}>
              Speaking-first English · Brazil
            </p>
            <h1 style={{
              fontFamily: SERIF, fontWeight: 700,
              fontSize: "clamp(2.6rem, 6vw, 4.25rem)",
              lineHeight: 1.07, letterSpacing: "-0.01em",
              color: P.parchment, marginBottom: 24,
            }}>
              Where English
              <br />Finds Your Voice.
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.7,
              color: "rgba(244,236,218,0.78)",
              maxWidth: 480, marginBottom: 40,
            }}>
              Inspired by the country where{" "}
              <strong style={{ color: P.gold, fontWeight: 600 }}>
                95 % of people speak English fluently
              </strong>{" "}
              — Molen puts real conversation at the heart of every lesson,
              from the very first class.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <Link href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 30px", borderRadius: 999,
                backgroundColor: P.gold, color: P.dark,
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 4px 24px rgba(194,154,87,0.35)",
                transition: "transform 150ms, box-shadow 150ms",
              }}
                className="hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(194,154,87,0.45)]"
              >
                Start learning <span aria-hidden>→</span>
              </Link>
              <Link href="https://molen-school.vercel.app/login" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 999,
                border: `1.5px solid rgba(244,236,218,0.28)`,
                color: "rgba(244,236,218,0.88)", fontSize: 15, fontWeight: 500,
                textDecoration: "none", transition: "background 150ms",
              }}
                className="hover:bg-white/10"
              >
                Already a student
              </Link>
            </div>
          </div>

          {/* Brand image + badges */}
          <div style={{ position: "relative", flexShrink: 0, paddingTop: 32, paddingBottom: 32 }}>
            <Image
              src="/circular_logo.png"
              alt="Molen English Classes"
              width={300} height={300}
              style={{ display: "block", filter: "drop-shadow(0 16px 56px rgba(0,0,0,0.5))" }}
              priority
            />
            {/* Quote badge */}
            <div style={{
              position: "absolute", top: 0, right: -16,
              maxWidth: 168, transform: "rotate(3deg)",
              backgroundColor: P.cream, color: P.ink,
              borderRadius: 16, padding: "12px 16px",
              fontSize: 13, fontWeight: 500, lineHeight: 1.45,
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            }}>
              &ldquo;I finally started speaking!&rdquo; 🎉
            </div>
            {/* Stat badge */}
            <div style={{
              position: "absolute", bottom: 0, left: -8,
              transform: "rotate(-2deg)",
              backgroundColor: P.gold, color: P.dark,
              borderRadius: 14, padding: "10px 18px",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
            }}>
              🇳🇱 #1 English fluency worldwide
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Speaking ── */}
      <section style={{ backgroundColor: P.parchment, padding: "80px 2rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <p style={{
            textAlign: "center", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: P.green, marginBottom: 12,
          }}>
            Why Molen Works
          </p>
          <h2 style={{
            fontFamily: SERIF, fontWeight: 700, textAlign: "center",
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: P.ink,
            marginBottom: 16, lineHeight: 1.2,
          }}>
            English is spoken, not memorized.
          </h2>
          <p style={{
            textAlign: "center", fontSize: 15, lineHeight: 1.7,
            color: P.inkMuted, maxWidth: 520, margin: "0 auto 56px",
          }}>
            Most courses wait months before asking you to speak.
            We flip the script — because the only way to get fluent is to
            actually use the language.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {PILLARS.map(({ icon, title, desc, iconBg, iconColor }) => (
              <div key={title} style={{
                backgroundColor: P.cream,
                border: `1px solid ${P.tan}`,
                borderRadius: 20,
                padding: "28px 28px 32px",
                boxShadow: "0 1px 2px rgba(42,45,40,0.04), 0 8px 24px -12px rgba(42,45,40,0.08)",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: iconBg, color: iconColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, marginBottom: 20,
                }}>
                  {icon}
                </div>
                <h3 style={{ fontFamily: SERIF, fontWeight: 700, color: P.ink, fontSize: 16, marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: P.inkMuted }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{
        background: `linear-gradient(155deg, #EDE0C0 0%, #F6F0DE 100%)`,
        padding: "80px 2rem",
      }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: P.green, marginBottom: 12,
          }}>
            Meet your teacher
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 56, alignItems: "start",
          }}>
            {/* Story */}
            <div>
              <h2 style={{
                fontFamily: SERIF, fontWeight: 700, color: P.ink,
                fontSize: "clamp(1.8rem, 4vw, 2.3rem)", marginBottom: 28, lineHeight: 1.15,
              }}>
                Luyza Alexandre
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 15, lineHeight: 1.75, color: P.inkMuted }}>
                <p>
                  My journey with English started long before I ever stood in front of a class.
                  I grew up in Brazil, then built a career as a software engineer across three
                  countries — Brazil, the Netherlands, and the United States — and language was
                  the thread that tied it all together.
                </p>
                <p>
                  Living in the <strong style={{ color: P.ink, fontWeight: 600 }}>Netherlands</strong> changed
                  my perspective entirely. I was surrounded by people who switched to English
                  effortlessly — at work, in shops, with strangers. Not because they had some
                  special gift, but because they had simply <em>used</em> it their whole lives.
                  The Dutch are the most English-proficient non-native speakers on the planet:{" "}
                  <strong style={{ color: P.ink, fontWeight: 600 }}>
                    over 95 % of the population speaks English fluently
                  </strong>
                  , ranking #1 in the EF English Proficiency Index year after year. No dubbing on TV,
                  English media consumed raw, and a culture that treats speaking as a daily habit — not
                  a test.
                </p>
                <p>
                  I then moved to{" "}
                  <strong style={{ color: P.ink, fontWeight: 600 }}>California</strong> specifically
                  to immerse myself in English studies, absorbing the language as it lives in real
                  conversations. Combined with my{" "}
                  <a
                    href="https://luyzata-website.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: P.green, fontWeight: 600, textDecoration: "none" }}
                    className="hover:underline"
                  >
                    background in technology
                  </a>
                  , I approach language learning the way engineers approach problems: find what
                  actually works, cut what doesn&rsquo;t, and iterate.
                </p>
                <p>
                  That&rsquo;s why I created{" "}
                  <strong style={{ color: P.ink, fontWeight: 600 }}>Molen English Classes</strong> — to
                  bring this Dutch-inspired, speaking-first method to Brazil. Brazilians are warm,
                  expressive, deeply communicative people. All they need is the right environment to
                  unlock that fluency.
                </p>
                <blockquote style={{
                  borderLeft: `4px solid ${P.gold}`,
                  paddingLeft: 20, marginTop: 8,
                  fontSize: 15.5, fontWeight: 600, color: P.ink,
                  fontStyle: "normal", lineHeight: 1.6,
                }}>
                  Fluency isn&rsquo;t reserved for the gifted or the lucky — it&rsquo;s built,
                  class by class, conversation by conversation. I&rsquo;m here to walk every step
                  of that journey with you.
                </blockquote>
              </div>
            </div>

            {/* Country + background cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
              {COUNTRIES.map(({ flag, label, desc }) => (
                <div key={label} style={{
                  backgroundColor: P.cream, border: `1px solid ${P.tan}`,
                  borderRadius: 18, padding: "18px 20px",
                  display: "flex", alignItems: "flex-start", gap: 16,
                  boxShadow: "0 1px 2px rgba(42,45,40,0.04)",
                }}>
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{flag}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: P.ink }}>{label}</p>
                    <p style={{ fontSize: 13, color: P.inkMuted, marginTop: 3, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
              <div style={{
                backgroundColor: P.cream, border: `1px solid ${P.tan}`,
                borderRadius: 18, padding: "18px 20px",
                display: "flex", alignItems: "flex-start", gap: 16,
                boxShadow: "0 1px 2px rgba(42,45,40,0.04)",
              }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>💻</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: P.ink }}>Software Engineer background</p>
                  <p style={{ fontSize: 13, color: P.inkMuted, marginTop: 3, lineHeight: 1.5 }}>
                    Years in IT across international companies.{" "}
                    <a
                      href="https://luyzata-website.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: P.green, fontWeight: 600, textDecoration: "none" }}
                      className="hover:underline"
                    >
                      See portfolio →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{
        background: `linear-gradient(145deg, ${P.dark} 0%, ${P.darkMid} 100%)`,
        color: P.parchment, padding: "80px 2rem",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{
          position: "absolute", top: -120, right: -120,
          width: 440, height: 440, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,154,87,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "44rem", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: P.gold, marginBottom: 12,
          }}>
            Get in touch
          </p>
          <h2 style={{
            fontFamily: SERIF, fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            color: P.parchment, marginBottom: 18, lineHeight: 1.2,
          }}>
            Ready to find your English voice?
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.75,
            color: "rgba(244,236,218,0.72)", marginBottom: 40,
          }}>
            Have a question before starting? Send a message — or go ahead and create your
            account. Your first class could be this week.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 30px", borderRadius: 999,
              backgroundColor: P.gold, color: P.dark,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(194,154,87,0.3)",
              transition: "opacity 150ms",
            }}
              className="hover:opacity-90"
            >
              Contact Us →
            </Link>
          </div>
          <p style={{ marginTop: 24, fontSize: 13, color: "rgba(244,236,218,0.45)", letterSpacing: "0.04em" }}>
            alexandre.t.luyza@gmail.com
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        backgroundColor: P.parchment,
        borderTop: `1px solid ${P.tan}`,
        padding: "28px 2rem",
      }}>
        <div style={{
          maxWidth: "72rem", margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          <p style={{ fontSize: 13, color: P.inkSubtle }}>
            © 2026 Molen English Classes · Brazil
          </p>
          <div style={{ display: "flex", gap: 28, fontSize: 13, color: P.inkMuted }}>
            <a href="#about" style={{ color: P.inkMuted, textDecoration: "none" }} className="hover:text-[#2A2D28]">About</a>
            <a href="#contact" style={{ color: P.inkMuted, textDecoration: "none" }} className="hover:text-[#2A2D28]">Contact</a>
            <Link href="https://molen-school.vercel.app/login" style={{ color: P.inkMuted, textDecoration: "none" }} className="hover:text-[#2A2D28]">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: "🎙️",
    title: "Speak from Day One",
    iconBg: "#E4E9CF", iconColor: "#4C6A2E",
    desc: "No grammar drills before you open your mouth. From the very first class you speak, respond, and converse — mistakes and all.",
  },
  {
    icon: "🇳🇱",
    title: "The Dutch Blueprint",
    iconBg: "#F1E6CB", iconColor: "#9E7A36",
    desc: "The Netherlands ranks #1 globally in English proficiency. Their method: immersive speaking over rote memorization. That's exactly what Molen teaches.",
  },
  {
    icon: "👥",
    title: "Small Groups, Real Results",
    iconBg: "#E7E4C6", iconColor: "#6B6A2F",
    desc: "Intimate live sessions mean you actually speak — a lot. Plus conversation circles to practice with peers at your exact level.",
  },
] as const;

const COUNTRIES = [
  {
    flag: "🇧🇷",
    label: "Born & raised in Brazil",
    desc: "Where the dream of speaking English fluently began.",
  },
  {
    flag: "🇳🇱",
    label: "Netherlands — the inspiration",
    desc: "Witnessed how a nation achieved 95 % English fluency through a speaking-first culture.",
  },
  {
    flag: "🇺🇸",
    label: "California — English studies",
    desc: "Immersive language study in the United States, from classrooms to daily conversations.",
  },
] as const;
