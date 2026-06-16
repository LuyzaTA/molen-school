import type { ClassGenInput, CEFRLevel } from "./types";
import { getCEFRInfo } from "./cefr";

// ============================================================
// Prompt construction for the AI class generator. Kept separate
// from the API route so it can be unit-tested and swapped.
// ============================================================

/**
 * JSON Schema passed to the Messages API (output_config.format).
 * A1 learners get extra Portuguese fields (meaningPt / questionsPt);
 * every other level is English-only.
 */
export function buildClassSchema(level: CEFRLevel) {
  const a1 = level === "A1";

  const vocabProps: Record<string, unknown> = {
    term: { type: "string" },
    meaning: { type: "string" },
    example: { type: "string" },
    isIdiom: { type: "boolean" },
    literalMeaning: { type: "string" },
  };
  const vocabRequired = ["term", "meaning", "example", "isIdiom", "literalMeaning"];
  if (a1) {
    vocabProps.meaningPt = { type: "string" };
    vocabRequired.push("meaningPt");
  }

  const warmUpProps: Record<string, unknown> = {
    questions: { type: "array", items: { type: "string" } },
  };
  const warmUpRequired = ["questions"];
  if (a1) {
    warmUpProps.questionsPt = { type: "array", items: { type: "string" } };
    warmUpRequired.push("questionsPt");
  }

  return {
  type: "object",
  additionalProperties: false,
  properties: {
    speakingRatio: { type: "number" },
    estimatedMinutes: { type: "integer" },
    agenda: { type: "array", items: { type: "string" } },
    warmUp: {
      type: "object",
      additionalProperties: false,
      properties: warmUpProps,
      required: warmUpRequired,
    },
    targetLanguage: {
      type: "object",
      additionalProperties: false,
      properties: {
        vocab: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: vocabProps,
            required: vocabRequired,
          },
        },
        structures: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              pattern: { type: "string" },
              example: { type: "string" },
            },
            required: ["pattern", "example"],
          },
        },
      },
      required: ["vocab", "structures"],
    },
    guidedProduction: {
      type: "object",
      additionalProperties: false,
      properties: {
        intro: { type: "string" },
        sentenceFrames: { type: "array", items: { type: "string" } },
        rolePlay: {
          type: "object",
          additionalProperties: false,
          properties: {
            scenario: { type: "string" },
            roles: { type: "array", items: { type: "string" } },
          },
          required: ["scenario", "roles"],
        },
        picturePrompts: { type: "array", items: { type: "string" } },
      },
      required: ["intro", "sentenceFrames", "rolePlay", "picturePrompts"],
    },
    freeProduction: {
      type: "object",
      additionalProperties: false,
      properties: {
        intro: { type: "string" },
        prompts: { type: "array", items: { type: "string" } },
        format: { type: "string", enum: ["discussion", "debate", "storytelling"] },
      },
      required: ["intro", "prompts", "format"],
    },
    feedback: {
      type: "object",
      additionalProperties: false,
      properties: {
        intro: { type: "string" },
        checklist: { type: "array", items: { type: "string" } },
        commonErrors: { type: "array", items: { type: "string" } },
      },
      required: ["intro", "checklist", "commonErrors"],
    },
    grammar: { type: "array", items: { type: "string" } },
  },
  required: [
    "speakingRatio",
    "estimatedMinutes",
    "agenda",
    "warmUp",
    "targetLanguage",
    "guidedProduction",
    "freeProduction",
    "feedback",
    "grammar",
  ],
  } as const;
}

export function buildSystemPrompt(input: ClassGenInput): string {
  const info = getCEFRInfo(input.level);
  const speakingPct = Math.round(info.speakingRatio * 100);

  const autisticGuidance = input.autisticMode
    ? `
AUTISTIC MODE IS ON. Adapt the content accordingly:
- Flag EVERY idiom or figurative phrase (set isIdiom true) and give a literal,
  concrete explanation in literalMeaning. Avoid sarcasm and vague language.
- Keep instructions explicit, literal, and concrete. One idea per sentence.
- Feedback items must be concrete and specific — never vague praise like "good job".
  Prefer "You used the past tense correctly in 3 sentences" style.
- Prompts should be predictable and low-ambiguity, with clear expectations.`
    : `
Autistic mode is off. You may use natural idioms; still set isIdiom true and fill
literalMeaning for any idiomatic items so learners can study them.`;

  const spiral =
    input.knownVocab && input.knownVocab.length
      ? `\nSPIRAL REVIEW: the learner has previously studied these words — weave a few
naturally into examples and prompts where they fit: ${input.knownVocab
          .slice(0, 24)
          .join(", ")}.`
      : "";

  // A1 learners get Portuguese support; every other level is English-only.
  const ptGuidance =
    input.level === "A1"
      ? `
PORTUGUESE SUPPORT (A1 only): this is an absolute beginner. For EVERY vocab item,
also fill "meaningPt" with a short Brazilian-Portuguese translation of the meaning.
Also fill warmUp.questionsPt with Brazilian-Portuguese translations of each warm-up
question, in the same order. Keep the English itself simple and short.`
      : "";

  const businessFocus =
    input.track === "business"
      ? `
BUSINESS VOCABULARY TRACK: this class is part of a Business English programme.
Focus the vocabulary, examples, role-plays, and prompts on professional/workplace
contexts (meetings, emails, negotiations, presentations, networking, finance,
projects). Keep it practical for someone using English at work.`
      : "";

  return `You are an expert English-as-a-foreign-language teacher who designs SPEAKING-FIRST
classes for Brazilian learners. Your learners understand English but freeze when
speaking, so every class is built around getting them to talk.

Design a single 45–60 minute speaking class on the learner's topic.

Learner level: ${input.level} (${info.name}) — ${info.canDo}
Target speaking ratio: about ${speakingPct}% of class time is the learner speaking.
Set the "speakingRatio" field to ${info.speakingRatio}.

Calibrate vocabulary difficulty, sentence length, and abstraction to ${input.level}.
${autisticGuidance}${spiral}${ptGuidance}${businessFocus}

Content requirements:
- warmUp.questions: exactly 3 personal, easy-to-answer questions to break the ice.
- targetLanguage.vocab: 8–12 useful words/phrases for the topic at this level, each
  with a plain meaning and a natural example sentence.
- targetLanguage.structures: exactly 2 sentence structures/patterns with an example.
- guidedProduction: a short intro, 4–6 sentence frames the learner completes, one
  role-play (scenario + roles), and 2–3 picture/visualisation prompts.
- freeProduction: a short intro, 3–5 open prompts, and pick a format
  (discussion, debate, or storytelling) appropriate to the level.
- feedback: a short intro, a 4–6 item self-correction checklist, and 3–5 concrete
  common errors Brazilian learners make on this topic to listen for.
- agenda: 5 short human-readable labels, one per stage, for an at-a-glance preview.
- grammar: 3–5 named grammar points the class practises (e.g. "Past simple",
  "Possessive pronouns", "Present perfect", "Comparatives"). Short labels only.

Return ONLY the structured JSON. Be encouraging, practical, and concrete.`;
}

export function buildUserPrompt(input: ClassGenInput): string {
  return `Create today's speaking class. Topic: "${input.topic}". Level: ${input.level}.`;
}