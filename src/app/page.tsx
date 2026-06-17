import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

export const metadata = {
  title: "Molen English Classes — Where English Finds Your Voice",
  description:
    "Speaking-first English classes in Brazil, inspired by the country where 95% of people speak English fluently. Start your journey today.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-base">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-base/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-wide items-center justify-between px-5 sm:px-8">
          <Logo size={40} />
          <nav className="hidden items-center gap-7 sm:flex">
            <a href="#about" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">About</a>
            <a href="#contact" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-pill px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-accent-soft"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-pill bg-accent px-4 py-1.5 text-sm font-bold text-accent-ink transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero-grad relative overflow-hidden px-5 pb-24 pt-20 text-accent-ink sm:px-8 sm:pb-32 sm:pt-28">
        <div aria-hidden className="decor animate-float absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full bg-gold/20" />
        <div aria-hidden className="decor animate-float-slow absolute -bottom-40 -left-20 h-[440px] w-[440px] rounded-full bg-accent/20" />

        <div className="relative mx-auto flex max-w-wide flex-col items-center gap-14 lg:flex-row lg:items-center">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Speaking-first English · Brazil
            </p>
            <h1
              className="mb-6 text-5xl font-bold leading-[1.07] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ fontFamily: SERIF }}
            >
              Where English
              <br />
              Finds Your Voice.
            </h1>
            <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-accent-ink/80 lg:mx-0">
              Inspired by the country where{" "}
              <strong className="font-semibold text-gold">95 % of people speak English fluently</strong>{" "}
              — Molen puts conversation at the heart of every lesson, from the very first class.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-pill bg-gold px-7 py-3.5 text-base font-bold text-mark shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Start learning <span aria-hidden>→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-pill border border-accent-ink/30 px-7 py-3.5 text-base font-medium text-accent-ink/90 backdrop-blur transition-colors hover:bg-white/10"
              >
                Already a student
              </Link>
            </div>
          </div>

          {/* Logo image + floating badges */}
          <div className="relative shrink-0">
            <div className="rounded-[28px] p-1 shadow-2xl ring-1 ring-white/10">
              <Image
                src="/molen-logo.png"
                alt="Molen English Classes"
                width={270}
                height={270}
                className="rounded-[22px]"
                priority
              />
            </div>
            <div className="absolute -right-5 -top-7 max-w-[165px] rotate-3 rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-ink shadow-xl">
              &ldquo;I finally started speaking!&rdquo; 🎉
            </div>
            <div className="absolute -bottom-5 -left-5 -rotate-2 rounded-2xl bg-gold px-4 py-3 text-sm font-bold text-mark shadow-xl">
              🇳🇱 #1 English fluency worldwide
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Speaking ── */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-wide">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Why Molen Works
          </p>
          <h2
            className="mb-4 text-center text-3xl font-bold text-ink sm:text-4xl"
            style={{ fontFamily: SERIF }}
          >
            English is spoken,
            <br className="sm:hidden" /> not memorized.
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-[15px] leading-relaxed text-ink-muted">
            Most courses wait months before asking you to speak. We flip the script — because
            the only way to get fluent is to actually use the language.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {PILLARS.map(({ icon, title, desc, tone }) => (
              <div key={title} className="card rounded-card p-7">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    tone === "accent"
                      ? "bg-accent-soft text-accent"
                      : tone === "gold"
                        ? "bg-gold-soft text-gold"
                        : "bg-green-soft text-green"
                  }`}
                >
                  {icon}
                </div>
                <h3 className="mb-2 font-bold text-ink" style={{ fontFamily: SERIF }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="surface-grad px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-wide">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Meet your teacher
          </p>
          <div className="grid gap-12 lg:grid-cols-[1fr_460px] lg:items-start">
            {/* Story */}
            <div>
              <h2
                className="mb-6 text-3xl font-bold text-ink sm:text-4xl"
                style={{ fontFamily: SERIF }}
              >
                Luyza Alexandre
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted">
                <p>
                  My journey with English started long before I ever stood in front of a class.
                  I grew up in Brazil, then built a career as a software engineer across three
                  countries — Brazil, the Netherlands, and the United States — and language was
                  the thread that tied it all together.
                </p>
                <p>
                  Living in the{" "}
                  <strong className="font-semibold text-ink">Netherlands</strong> changed my
                  perspective entirely. I was surrounded by people who switched to English
                  effortlessly — at work, in shops, with strangers — not because they had some
                  special gift, but because they had simply <em>used</em> it their whole lives.
                  The Dutch are the most English-proficient non-native speakers on the planet:{" "}
                  <strong className="font-semibold text-ink">
                    over 95 % of the population speaks English fluently
                  </strong>
                  , ranking #1 in the EF English Proficiency Index year after year. No dubbing on
                  TV. English music, films, and podcasts consumed raw. And a culture that treats
                  speaking as a daily habit, not an exam subject.
                </p>
                <p>
                  I then moved to{" "}
                  <strong className="font-semibold text-ink">California</strong> specifically to
                  immerse myself in English studies — absorbing the language as it lives in real
                  conversations, not textbooks. Combined with my background in technology{" "}
                  <a
                    href="https://luyzata-website.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent hover:underline"
                  >
                    (see my IT portfolio)
                  </a>
                  , I think about language learning the way engineers think about systems: find
                  what actually works, cut what doesn&rsquo;t, and iterate.
                </p>
                <p>
                  That&rsquo;s why I created{" "}
                  <strong className="font-semibold text-ink">Molen English Classes</strong> — to
                  bring this Dutch-inspired, speaking-first method to Brazil. Because Brazilians
                  are warm, expressive, deeply communicative people. All they need is the right
                  environment to unlock that fluency in English.
                </p>
                <blockquote className="mt-6 border-l-4 border-gold pl-5 text-base font-semibold text-ink">
                  Fluency isn&rsquo;t reserved for the gifted or the lucky — it&rsquo;s built,
                  class by class, conversation by conversation. I&rsquo;m here to walk every step
                  of that journey with you.
                </blockquote>
              </div>
            </div>

            {/* Country / background cards */}
            <div className="flex flex-col gap-4 lg:pt-14">
              {COUNTRIES.map(({ flag, label, desc }) => (
                <div key={label} className="card rounded-card flex items-start gap-4 p-5">
                  <span className="text-3xl">{flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{label}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{desc}</p>
                  </div>
                </div>
              ))}
              <div className="card rounded-card flex items-start gap-4 p-5">
                <span className="text-3xl">💻</span>
                <div>
                  <p className="text-sm font-semibold text-ink">Software Engineer background</p>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    Years in IT across international companies.{" "}
                    <a
                      href="https://luyzata-website.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent hover:underline"
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
      <section id="contact" className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Get in touch
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-ink sm:text-4xl"
            style={{ fontFamily: SERIF }}
          >
            Ready to find your voice?
          </h2>
          <p className="mb-10 text-[15px] leading-relaxed text-ink-muted">
            Have a question before starting? Send a message — or go ahead and create your
            account. Your first class could be this week.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-pill bg-accent px-7 py-3.5 text-base font-bold text-accent-ink shadow transition-opacity hover:opacity-90"
            >
              Create your account →
            </Link>
            <a
              href="mailto:alexandre.t.luyza@gmail.com"
              className="inline-flex items-center gap-2 rounded-pill border border-border px-7 py-3.5 text-base font-medium text-ink transition-colors hover:bg-surface"
            >
              ✉️ Send an email
            </a>
          </div>
          <p className="mt-6 text-sm text-ink-subtle">alexandre.t.luyza@gmail.com</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-wide flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo size={36} />
          <p className="text-center text-sm text-ink-subtle">
            © 2026 Molen English Classes · Brazil
          </p>
          <div className="flex gap-5 text-sm text-ink-muted">
            <a href="#about" className="transition-colors hover:text-ink">About</a>
            <a href="#contact" className="transition-colors hover:text-ink">Contact</a>
            <Link href="/login" className="transition-colors hover:text-ink">Sign in</Link>
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
    tone: "accent",
    desc: "No long grammar drills before you open your mouth. From the very first class you speak, respond, and converse — mistakes and all.",
  },
  {
    icon: "🇳🇱",
    title: "The Dutch Blueprint",
    tone: "gold",
    desc: "The Netherlands ranks #1 globally in English proficiency. Their method: immersive speaking over rote memorization. That's exactly what Molen teaches.",
  },
  {
    icon: "👥",
    title: "Small Groups, Real Results",
    tone: "green",
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
    desc: "Witnessed first-hand how a nation achieved 95 % English fluency through a speaking-first culture.",
  },
  {
    flag: "🇺🇸",
    label: "California — English studies",
    desc: "Immersive language study in the United States, from classrooms to daily conversations.",
  },
] as const;
