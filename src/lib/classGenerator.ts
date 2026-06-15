import type { ClassGenInput, GeneratedClass } from "./types";
import { buildMockClass } from "./mockClass";

// ============================================================
// The single swappable entry point for class generation. The UI
// only ever calls generateClass(); everything behind it (the API
// route, the AI model, the offline fallback) can change freely.
// ============================================================

export async function generateClass(
  input: ClassGenInput,
): Promise<GeneratedClass> {
  try {
    const res = await fetch("/api/generate-class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error(`generate-class failed: ${res.status}`);

    const data = (await res.json()) as Partial<GeneratedClass>;
    // Trust the route to return a well-shaped class, but guard the
    // critical fields so a bad payload degrades gracefully.
    if (!data || !data.targetLanguage || !data.warmUp) {
      throw new Error("malformed class payload");
    }
    return {
      ...data,
      topic: input.topic,
      level: input.level,
      autisticMode: input.autisticMode,
      generatedBy: data.generatedBy ?? "ai",
    } as GeneratedClass;
  } catch {
    // Offline / no key / error → deterministic mock so the app works.
    return buildMockClass(input);
  }
}