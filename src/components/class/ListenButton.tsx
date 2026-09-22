"use client";

import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/cn";

// ============================================================
// "Listen" button for Dutch text. Audio comes from Google Cloud TTS
// via /api/tts (cached per phrase in memory for the session); when
// TTS isn't configured or fails, the browser's own nl-NL voice is
// used so the button always does something useful.
// ============================================================

const audioCache = new Map<string, string>(); // cache key -> object URL
let current: HTMLAudioElement | null = null;
let serverTtsUnavailable = false;
// Bumped on every click so a newer click stops an older playlist.
let playSession = 0;

/** Fill-in blanks ("______") read badly — speak them as a pause. */
function speakable(text: string): string {
  return text.replace(/_{2,}/g, "…").replace(/\s+/g, " ").trim();
}

function browserSpeak(text: string, rate: number, onStart: () => void): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return resolve();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL";
    u.rate = rate;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("nl"));
    if (voice) u.voice = voice;
    u.onstart = onStart;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

async function play(text: string, rate: number, onStart: () => void): Promise<void> {
  current?.pause();
  const key = `${rate}|${text}`;
  let url = audioCache.get(key);
  if (!url && !serverTtsUnavailable) {
    try {
      const res = await fetch(
        `/api/tts?text=${encodeURIComponent(text)}&rate=${rate}`,
      );
      if (res.status === 503) serverTtsUnavailable = true;
      if (res.ok) {
        url = URL.createObjectURL(await res.blob());
        audioCache.set(key, url);
      }
    } catch {
      /* network error — fall back below */
    }
  }
  if (!url) return browserSpeak(text, rate, onStart);

  const audio = new Audio(url);
  current = audio;
  await new Promise<void>((resolve) => {
    audio.onplaying = onStart;
    // Starting another phrase pauses this one — release this button too.
    audio.onpause = () => resolve();
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
}

/**
 * `text` plays one phrase. `texts` plays several in order (e.g. a whole
 * story) and shows `label` next to the icon; any other listen click stops it.
 */
export function ListenButton({
  text,
  texts,
  className,
  label = "Listen",
}: {
  text?: string;
  texts?: string[];
  className?: string;
  label?: string;
}) {
  const { profile } = useSettings();
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  // Beginners hear Dutch a little slower.
  const rate = profile.level === "A1" || profile.level === "A2" ? 0.85 : 1;

  async function onClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (state !== "idle") return;
    const queue = (texts ?? (text ? [text] : [])).map(speakable).filter(Boolean);
    const session = ++playSession;
    setState("loading");
    for (const t of queue) {
      if (session !== playSession) break;
      await play(t, rate, () => setState("playing"));
    }
    setState("idle");
  }

  const playlist = !!texts;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={playlist ? label : `${label}: ${text}`}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface align-middle text-ink-muted transition-colors hover:border-accent hover:text-accent",
        playlist ? "h-8 gap-1.5 px-3 text-sm font-semibold" : "h-7 w-7",
        state !== "idle" && "border-accent text-accent",
        className,
      )}
    >
      {state === "loading" ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          {state === "playing" ? (
            <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
          ) : (
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          )}
        </svg>
      )}
      {playlist && <span>{label}</span>}
    </button>
  );
}
