import type { ClassGenInput, CEFRLevel } from "./types";
import { getCEFRInfo } from "./cefr";

function levelCurriculum(level: CEFRLevel): string {
  switch (level) {
    case "A1":
      return `
A1 CEFR CURRICULUM — STRICT RULES:
- Every sentence must be SHORT and SIMPLE: Subject + Verb + (Object). Maximum 8 words.
- Use ONLY high-frequency vocabulary from A1 CEFR domains: greetings, self-introductions,
  family, numbers, colours, daily routines, food & drink, home & furniture, animals,
  weather, basic shopping, body parts, classroom objects, days/months/seasons.
- No idioms, phrasal verbs, or abstract concepts. No conditionals. No passive voice.
- Grammar focus: am/is/are, have/has, simple present tense, basic pronouns, a/an/the,
  imperatives, there is/there are, possessives (my/your/his/her).
- freeProduction MUST be a structured vocabulary or sentence-building activity — NOT open
  discussion. Examples: "Say your name, age, and one thing you like", "Name 5 things in
  your room using today's words", "Complete: I am ___, I have ___, I like ___".
  Prompts must be completable with 1–3 simple words or a single short sentence.
  Choose format "vocabulary_practice", "sentence_building", or "picture_description".`;
    case "A2":
      return `
A2 CEFR CURRICULUM:
- Grammar focus: past simple (regular & irregular verbs), future (will / going to),
  comparatives & superlatives, countable/uncountable nouns, modals (can, should, must),
  present continuous (current actions and future arrangements).
- Vocabulary: shopping, travel & transport, work & colleagues, health, food & restaurants,
  describing people and places, making arrangements, feelings & emotions, simple experiences.
- Sentences may be compound (and/but/because/so). Avoid complex embedded clauses.
- freeProduction: simple discussion of personal experiences and everyday situations.
  Use concrete, relatable scenarios — no abstract debates. Format: "discussion".`;
    case "B1":
      return `
B1 CEFR CURRICULUM:
- Grammar focus: present perfect (just/already/yet/for/since), past continuous, first
  conditional, passive voice (simple present/past), reported speech (basic), relative
  clauses (who/which/that).
- Vocabulary: opinions & arguments, storytelling, career & plans, social media, health &
  lifestyle, environment, cultural differences, travel problems, social conversations.
- Learner can express and justify opinions, describe experiences, and explain plans with
  some fluency.
- freeProduction: open discussion or storytelling around real-world, relatable topics.`;
    case "B2":
      return `
B2 CEFR CURRICULUM:
- Grammar focus: second & third conditionals, mixed conditionals, advanced passive
  structures, modal perfects (should have, might have, could have), advanced linking
  words (however, nevertheless, in contrast, despite), cleft sentences.
- Vocabulary: professional communication, debate language, abstract ideas, argumentative
  phrases, cohesive devices, nuanced adjectives, presentations, reports.
- Learner can discuss complex and abstract topics fluently and can argue a position with
  structured reasoning.
- freeProduction: structured debate or discussion on substantive topics. Push for
  well-organised arguments with evidence and counter-arguments, not just opinions.`;
    case "C1":
      return `
C1 CEFR CURRICULUM:
- Grammar focus: complex sentence structures, inversion for emphasis (Not only did…,
  Rarely have…), advanced discourse markers (notwithstanding, insofar as), mixed
  conditionals, concession clauses (even though, while, albeit), cleft/pseudo-cleft.
- Vocabulary: academic register, negotiation & persuasion language, leadership &
  management, idiomatic expressions in context, specialized vocabulary, register shifts.
- Learner uses English professionally or academically. Expects nuance, stylistic variety,
  and register awareness. Push for spontaneity and precision.
- freeProduction: sophisticated debate or academic discussion with rhetorical structure.
  Expect longer, well-organised turns with precise vocabulary and stylistic range.`;
    case "C2":
      return `
C2 CEFR CURRICULUM:
- Grammar: full grammatical flexibility and stylistic control. No single grammar point to
  drill — focus on precision, register, elegance, and nuance of expression.
- Vocabulary: literature, academic texts, humour, cultural references & allusions, subtle
  connotations, nuanced collocations, specialised professional/academic fields, slang in
  appropriate context.
- Learner has near-native command. Classes should challenge with complexity, subtlety, and
  cultural depth. Push for sophisticated self-expression and stylistic range.
- freeProduction: high-level debate, literary or cultural analysis, or professional
  discourse — challenge the learner to reach for precision and rhetorical sophistication.`;
    default:
      return "";
  }
}

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
    grammarNote: { type: "string" },
  };
  const warmUpRequired = ["questions", "grammarNote"];
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
        format: {
          type: "string",
          enum: a1
            ? ["vocabulary_practice", "sentence_building", "picture_description"]
            : ["discussion", "debate", "storytelling"],
        },
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

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
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

  const repeatTopic =
    input.topicRepeatCount && input.topicRepeatCount > 0
      ? `
REPEAT TOPIC — MANDATORY NEW CONTENT:
The student is studying "${input.topic}" for the ${ordinal(input.topicRepeatCount + 1)} time.
You MUST produce entirely different content from any previous class on this topic.
${
  input.priorTopicVocab?.length
    ? `BANNED VOCABULARY — do NOT teach any of these words, they are already known:
${input.priorTopicVocab.slice(0, 50).join(", ")}.`
    : ""
}
Rules for this repeat class:
- Teach the NEXT LAYER of vocabulary: synonyms, collocations, sub-topics, more nuanced expressions.
- Use a completely different scenario for the role-play.
- Write all-new sentence frames and prompts — zero overlap with the previous class.
- Take a fresh angle on the topic (e.g. "Food & drink" visit 1 → basic words (bread, water, eat);
  visit 2 → restaurant ordering & preferences; visit 3 → cooking verbs, recipes, cultural food).`
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

  const curriculumGuidance = levelCurriculum(input.level);

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
${autisticGuidance}${spiral}${repeatTopic}${ptGuidance}${curriculumGuidance}${businessFocus}

CRITICAL — TEACH THE TOPIC, NOT ABOUT THE TOPIC:
Every vocabulary item, sentence frame, role-play, and prompt must contain language
the student actually learns and uses IN this topic — never generic phrases adapted
to the topic name.

  ✓ Topic "Greetings & Introductions" → vocab: Hello, Good morning, My name is ___,
    Nice to meet you, How are you?, I'm fine — frames: "Hello! My name is ___.  I'm from ___."
  ✗ Topic "Greetings & Introductions" → vocab: "I'm really into greetings",
    "The thing about introductions is that…", "in my experience" — these are wrong.

  ✓ Topic "Food & drink" → vocab: water, bread, eat, drink, hungry, delicious, I like ___
  ✗ Topic "Food & drink" → vocab: "to keep up with", "a big deal", "it depends" — wrong.

Apply this rule at every level: for "Travel experiences" (B1) teach: delayed, depart,
luggage, customs, book a hotel, recommend, journey — not meta-discussion phrases about travel.

Content requirements:
- warmUp.questions: exactly 5 personal, easy-to-answer questions to break the ice.
- targetLanguage.vocab: 8–12 useful words/phrases for the topic at this level, each
  with a plain meaning and a natural example sentence.
- targetLanguage.structures: exactly 2 sentence structures/patterns with an example.
- guidedProduction: a short intro, 4–6 sentence frames the learner completes, one
  role-play (scenario + roles), and 2–3 picture/visualisation prompts.
- freeProduction: a short intro and 3–5 prompts. For A1: structured vocabulary/sentence-
  building activities (format: vocabulary_practice, sentence_building, or
  picture_description). For A2+: open-ended speaking (format: discussion, debate,
  or storytelling) appropriate to the level.
- feedback: a short intro, a 4–6 item self-correction checklist, and 3–5 concrete
  common errors Brazilian learners make on this topic to listen for.
- agenda: 5 short human-readable labels, one per stage, for an at-a-glance preview.
- grammar: 3–5 named grammar points the class practises (e.g. "Past simple",
  "Possessive pronouns", "Present perfect", "Comparatives"). Short labels only.
- warmUp.grammarNote: a 2–3 sentence student-friendly explanation of today's grammar
  focus. Use **bold** for grammar term names. Explain what to watch out for and why
  these points matter in speaking. Write it directly to the learner (use "you").

Return ONLY the structured JSON. Be encouraging, practical, and concrete.`;
}

export function buildUserPrompt(input: ClassGenInput): string {
  return `Create today's speaking class. Topic: "${input.topic}". Level: ${input.level}.
Teach the actual language content OF this topic — the words and phrases a student says and hears in "${input.topic}" situations. Do NOT use generic discussion phrases adapted to the topic name.`;
}