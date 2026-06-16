import type { ClassGenInput, GeneratedClass, VocabItem } from "./types";
import { getCEFRInfo } from "./cefr";

// ============================================================
// Deterministic offline fallback. Used when the AI endpoint is
// unavailable (no key, network error) so the app always works —
// and it's deliberately substantial, not a stub: 10 vocab items,
// level-aware framing, Portuguese gloss for A1 learners, and a
// format that shifts with the CEFR level.
// ============================================================

function isBeginner(level: string) {
  return level === "A1" || level === "A2";
}
function isAdvanced(level: string) {
  return level === "C1" || level === "C2";
}

function buildGrammar(beginner: boolean, advanced: boolean, business: boolean): string[] {
  const base = beginner
    ? ["Present simple", "Personal pronouns", "Possessive adjectives"]
    : advanced
      ? ["Present perfect", "Conditionals (2nd & 3rd)", "Relative clauses"]
      : ["Past simple", "Comparatives & superlatives", "Linking words"];
  if (business) {
    return [...base, "Polite requests (could / would)", "Future plans (going to / will)"].slice(0, 5);
  }
  return base;
}

function buildBusinessVocab(topic: string): VocabItem[] {
  return [
    { term: "to touch base", meaning: "to make brief contact to share an update", meaningPt: "entrar em contato rapidamente", example: `Let's touch base about ${topic} on Monday.`, isIdiom: true, literalMeaning: "Not about a physical base — it means a quick check-in." },
    { term: "deadline", meaning: "the latest time something must be finished", meaningPt: "prazo final", example: `The deadline for ${topic} is Friday.`, isIdiom: false },
    { term: "to follow up", meaning: "to check on progress after something", meaningPt: "dar seguimento / acompanhar", example: `I'll follow up on ${topic} by email.`, isIdiom: true, literalMeaning: "Not following a person — it means continuing the matter." },
    { term: "stakeholder", meaning: "a person with an interest in a project", meaningPt: "parte interessada", example: `Every stakeholder cares about ${topic}.`, isIdiom: false },
    { term: "to be on the same page", meaning: "to share the same understanding", meaningPt: "estar de acordo / alinhado(a)", example: `Are we on the same page about ${topic}?`, isIdiom: true, literalMeaning: "Not a real page — it means agreeing." },
    { term: "deliverable", meaning: "a concrete result you must produce", meaningPt: "entregável", example: `The first deliverable for ${topic} is a draft.`, isIdiom: false },
    { term: "to reach out", meaning: "to contact someone", meaningPt: "entrar em contato", example: `Reach out if ${topic} is unclear.`, isIdiom: true, literalMeaning: "Not stretching your arm — it means contacting." },
    { term: "bandwidth", meaning: "the time/capacity to take on work", meaningPt: "capacidade / tempo disponível", example: `I don't have the bandwidth for ${topic} this week.`, isIdiom: true, literalMeaning: "Not internet speed — it means availability." },
    { term: "to circle back", meaning: "to return to a topic later", meaningPt: "retomar o assunto depois", example: `Let's circle back to ${topic} next call.`, isIdiom: true, literalMeaning: "Not moving in a circle — it means revisiting later." },
    { term: "key takeaway", meaning: "the most important point to remember", meaningPt: "principal conclusão", example: `The key takeaway about ${topic} is to plan early.`, isIdiom: false },
  ];
}

function buildVocab(topic: string): VocabItem[] {
  return [
    {
      term: "to be into (something)",
      meaning: "to be interested in or enjoy something",
      meaningPt: "gostar muito de algo; ter interesse",
      example: `I'm really into ${topic} these days.`,
      isIdiom: true,
      literalMeaning: "It does not mean physically inside — it means you like it.",
    },
    {
      term: "to keep up with",
      meaning: "to stay informed or move at the same pace",
      meaningPt: "acompanhar; manter-se atualizado",
      example: `It's hard to keep up with ${topic}.`,
      isIdiom: true,
      literalMeaning: "Not about walking speed — it means staying current.",
    },
    {
      term: "a big deal",
      meaning: "something important",
      meaningPt: "algo importante; grande coisa",
      example: `For me, ${topic} is a big deal.`,
      isIdiom: true,
      literalMeaning: "Not a business deal — it means 'important'.",
    },
    {
      term: "honestly",
      meaning: "used to give a frank opinion",
      meaningPt: "honestamente; para ser sincero",
      example: `Honestly, I think ${topic} is underrated.`,
      isIdiom: false,
    },
    {
      term: "it depends",
      meaning: "the answer changes with the situation",
      meaningPt: "depende",
      example: `Do I like ${topic}? It depends.`,
      isIdiom: false,
    },
    {
      term: "on the other hand",
      meaning: "introducing a contrasting point",
      meaningPt: "por outro lado",
      example: `${topic} is fun; on the other hand, it takes time.`,
      isIdiom: true,
      literalMeaning: "Nothing to do with hands — it signals a contrast.",
    },
    {
      term: "to look forward to",
      meaning: "to feel excited about a future thing",
      meaningPt: "estar ansioso(a) por; aguardar com expectativa",
      example: `I look forward to learning more about ${topic}.`,
      isIdiom: false,
    },
    {
      term: "in my experience",
      meaning: "based on what has happened to me",
      meaningPt: "na minha experiência",
      example: `In my experience, ${topic} gets easier over time.`,
      isIdiom: false,
    },
    {
      term: "to get the hang of it",
      meaning: "to learn how to do something with practice",
      meaningPt: "pegar o jeito",
      example: `${topic} was tricky, but I got the hang of it.`,
      isIdiom: true,
      literalMeaning: "Nothing hangs — it means you learned the skill.",
    },
    {
      term: "worth it",
      meaning: "good enough to justify the time or effort",
      meaningPt: "vale a pena",
      example: `Learning about ${topic} is totally worth it.`,
      isIdiom: false,
    },
  ];
}

export function buildMockClass(input: ClassGenInput): GeneratedClass {
  const info = getCEFRInfo(input.level);
  const t = input.topic.trim() || "everyday life";
  const beginner = isBeginner(input.level);
  const advanced = isAdvanced(input.level);
  const business = input.track === "business";

  const format = beginner ? "storytelling" : advanced ? "debate" : "discussion";

  return {
    topic: t,
    level: input.level,
    autisticMode: input.autisticMode,
    track: input.track ?? "general",
    grammar: buildGrammar(beginner, advanced, business),
    speakingRatio: info.speakingRatio,
    estimatedMinutes: beginner ? 45 : advanced ? 60 : 50,
    generatedBy: "mock",
    agenda: [
      "Warm-up: 3 quick questions",
      "Target language: 10 words + 2 structures",
      "Guided production: frames & role-play",
      "Free production: speak freely",
      "Feedback: self-check",
    ],
    warmUp: {
      questions: [
        `When did you last talk about ${t}? Who with?`,
        `How do you feel about ${t} — interested, neutral, or tired of it?`,
        `What is one word that comes to mind when you think of ${t}?`,
      ],
      questionsPt: [
        `Quando foi a última vez que você falou sobre ${t}? Com quem?`,
        `Como você se sente em relação a ${t} — interessado(a), neutro(a) ou cansado(a)?`,
        `Qual é uma palavra que vem à sua mente quando você pensa em ${t}?`,
      ],
    },
    targetLanguage: {
      vocab: business ? buildBusinessVocab(t) : buildVocab(t),
      structures: [
        {
          pattern: beginner ? "I like ___ because ___" : "I'd say (that) + opinion",
          example: beginner
            ? `I like ${t} because it is fun.`
            : `I'd say that ${t} is worth it.`,
        },
        {
          pattern: advanced
            ? "What strikes me about ___ is that ___"
            : "The thing about ___ is that ___",
          example: advanced
            ? `What strikes me about ${t} is that opinions are so divided.`
            : `The thing about ${t} is that it takes practice.`,
        },
      ],
    },
    guidedProduction: {
      intro: "Complete each frame out loud, then say it again a little faster.",
      sentenceFrames: [
        `I'm into ${t} because ___.`,
        `The thing about ${t} is that ___.`,
        `Honestly, I'd say ___.`,
        `It depends on ___.`,
        `I look forward to ___.`,
        `In my experience, ___.`,
      ],
      rolePlay: {
        scenario: `A new friend asks you about ${t} at a café. Keep the chat going for two minutes — ask them a question back.`,
        roles: ["You (the enthusiast)", "A curious new friend"],
      },
      picturePrompts: [
        `Picture a scene related to ${t}. Describe what you see for 30 seconds.`,
        `Imagine explaining ${t} to a 10-year-old. Try it out loud.`,
      ],
    },
    freeProduction: {
      intro: advanced
        ? "Now speak freely and push for precision — aim for nuance, not just fluency."
        : "Now speak freely. Aim for longer turns — don't stop at one sentence.",
      prompts: [
        `Tell a short story about a time ${t} surprised you.`,
        `Argue for or against this: "${t} is overrated."`,
        `If you had to teach a class on ${t}, what would you start with?`,
        advanced
          ? `Where do you think ${t} will be in ten years, and why?`
          : `What is one thing about ${t} you'd like to be better at?`,
      ],
      format,
    },
    feedback: {
      intro: "Listen back to your speaking and check yourself concretely.",
      checklist: [
        "Did I use at least 4 of today's target words?",
        "Did I speak in full sentences, not just single words?",
        "Did I use the past tense correctly when telling a story?",
        "Did I keep going instead of switching to Portuguese when stuck?",
        advanced
          ? "Did I add nuance (hedging, contrast) rather than flat statements?"
          : "Did I link ideas with 'and', 'but', 'because', 'so'?",
      ],
      commonErrors: [
        "Saying 'I have 30 years' instead of 'I am 30 years old'.",
        "Dropping the -s on he/she/it verbs (he like → he likes).",
        "Using 'people is' instead of 'people are'.",
        "Pronouncing the -ed ending as an extra syllable everywhere.",
        "Saying 'I have doubt' instead of 'I have a question'.",
      ],
    },
  };
}
