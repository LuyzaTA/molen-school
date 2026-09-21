import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ClassGenInput, GeneratedClass } from "@/lib/types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildClassSchema,
} from "@/lib/prompts";
import { buildMockClass } from "@/lib/mockClass";
import { isSupportLanguage } from "@/lib/language";
import { getCEFRInfo } from "@/lib/cefr";

export const runtime = "nodejs";

// The model is fixed per the product spec. The key comes from the
// environment (ANTHROPIC_API_KEY) — never from the client.
const MODEL = "claude-sonnet-4-6";

function isValidInput(b: unknown): b is ClassGenInput {
  if (!b || typeof b !== "object") return false;
  const o = b as Record<string, unknown>;
  return typeof o.topic === "string" && typeof o.level === "string";
}

export async function POST(req: NextRequest) {
  let input: ClassGenInput;
  try {
    const body = await req.json();
    if (!isValidInput(body)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    input = {
      topic: body.topic.slice(0, 200),
      level: body.level,
      autisticMode: !!body.autisticMode,
      track: body.track === "business" ? "business" : "general",
      language: body.language === "nl" ? "nl" : "en",
      supportLang: isSupportLanguage(body.supportLang) ? body.supportLang : "pt",
      knownVocab: Array.isArray(body.knownVocab)
        ? (body.knownVocab as string[]).slice(0, 40)
        : [],
    };
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // No key configured → return the deterministic mock. The app still works.
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(buildMockClass(input));
  }

  try {
    const client = new Anthropic();

    const response = await client.messages.create({
      model: MODEL,
      // Dutch classes carry support-language translations, so they need more room.
      max_tokens: input.language === "nl" ? 12000 : 4000,
      system: buildSystemPrompt(input),
      messages: [{ role: "user", content: buildUserPrompt(input) }],
      // Structured output: guarantees the first text block is valid JSON
      // matching our schema. Cast because output_config is newer than the
      // installed SDK's static types in some versions.
      ...({
        output_config: {
          format: { type: "json_schema", schema: buildClassSchema(input.level, input.language) },
        },
      } as Record<string, unknown>),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text block in response");
    }

    const parsed = JSON.parse(textBlock.text) as Partial<GeneratedClass>;

    const klass: GeneratedClass = {
      topic: input.topic,
      level: input.level,
      autisticMode: input.autisticMode,
      speakingRatio: parsed.speakingRatio ?? getCEFRInfo(input.level).speakingRatio,
      estimatedMinutes: parsed.estimatedMinutes ?? 50,
      agenda: parsed.agenda ?? [],
      story: parsed.story,
      warmUp: parsed.warmUp!,
      targetLanguage: parsed.targetLanguage!,
      guidedProduction: parsed.guidedProduction!,
      freeProduction: parsed.freeProduction!,
      feedback: parsed.feedback!,
      grammar: parsed.grammar ?? [],
      track: input.track ?? "general",
      language: input.language,
      ...(input.language === "nl" ? { supportLang: input.supportLang } : {}),
      generatedBy: "ai",
    };

    return NextResponse.json(klass);
  } catch (err) {
    // Any failure (rate limit, parse error, network) → graceful mock.
    console.error("generate-class error:", err);
    return NextResponse.json(buildMockClass(input));
  }
}