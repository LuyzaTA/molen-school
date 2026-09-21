import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";

export const runtime = "nodejs";

// ============================================================
// Google Cloud Text-to-Speech proxy (Dutch course only).
// The API key stays on the server (GOOGLE_TTS_API_KEY). GET so the
// browser can cache each phrase; a small in-memory cache per server
// instance avoids paying twice for the same sentence.
// Returns 503 when no key is configured — the client then falls back
// to the browser's built-in speech synthesis.
// ============================================================

const ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";
const MAX_CHARS = 600;
const DEFAULT_VOICE = "nl-NL-Wavenet-B";

const cache = new Map<string, Buffer>();
const CACHE_LIMIT = 300;

async function synthesize(key: string, text: string, rate: number, voiceName?: string) {
  const voice: Record<string, string> = { languageCode: "nl-NL" };
  if (voiceName) voice.name = voiceName;
  return fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice,
      audioConfig: { audioEncoding: "MP3", speakingRate: rate },
    }),
  });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) return NextResponse.json({ error: "TTS not configured" }, { status: 503 });

  const text = (req.nextUrl.searchParams.get("text") ?? "").trim().slice(0, MAX_CHARS);
  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });
  const rateParam = Number(req.nextUrl.searchParams.get("rate"));
  const rate = rateParam >= 0.5 && rateParam <= 1.5 ? rateParam : 1;

  const cacheKey = `${rate}|${text}`;
  let audio = cache.get(cacheKey);

  if (!audio) {
    try {
      const voiceName = process.env.GOOGLE_TTS_VOICE_NL || DEFAULT_VOICE;
      let res = await synthesize(key, text, rate, voiceName);
      // An unknown voice name is a 400 — retry with Google's default nl-NL voice.
      if (res.status === 400) res = await synthesize(key, text, rate);
      if (!res.ok) {
        console.error("tts error:", res.status, await res.text().catch(() => ""));
        return NextResponse.json({ error: "TTS failed" }, { status: 502 });
      }
      const data = (await res.json()) as { audioContent?: string };
      if (!data.audioContent) {
        return NextResponse.json({ error: "TTS failed" }, { status: 502 });
      }
      audio = Buffer.from(data.audioContent, "base64");
      if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
      cache.set(cacheKey, audio);
    } catch (err) {
      console.error("tts error:", err);
      return NextResponse.json({ error: "TTS failed" }, { status: 502 });
    }
  }

  return new NextResponse(new Uint8Array(audio), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=604800",
    },
  });
}
