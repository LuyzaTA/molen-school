import type { ClassGenInput, GeneratedClass, VocabItem, ClassStory } from "./types";
import { getCEFRInfo } from "./cefr";
import { getA1TopicContent } from "./a1TopicMocks";

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

function buildGrammarNote(beginner: boolean, advanced: boolean, business: boolean): string {
  let note = beginner
    ? "Today you'll practice the **present simple** — use it for habits and facts. Watch the 's' ending on he/she/it verbs (*he likes*, not *he like*). **Personal pronouns** (I, you, he, she…) and **possessive adjectives** (my, your, his, her…) will come up in the warm-up."
    : advanced
      ? "Today's focus includes the **present perfect** for recent events (*I've done…*). **Second and third conditionals** let you speculate (*If I had…, I would have…*). **Relative clauses** (*which*, *who*, *that*) add detail without starting a new sentence — a key marker of fluency."
      : "Today you'll practice the **past simple** for storytelling — use irregular forms (*went*, *said*, *thought*). **Comparatives** (*more… than*, *-er than*) and **superlatives** (*the most…*, *the -est*) help you compare ideas. **Linking words** (because, so, although) make your speaking flow naturally.";
  if (business) {
    note += " In the business track, pay attention to **polite requests** (*Could you…? Would you mind…?*) — essential for professional tone. **Future plans** (*going to* for intentions, *will* for offers and predictions) appear in every meeting.";
  }
  return note;
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

// ---- Topic emoji map (best-effort visual matching) ----
const TOPIC_EMOJI_MAP: [string, string[]][] = [
  ["greet|introduc",   ["👋", "😊", "🤝"]],
  ["family|parents",   ["👨‍👩‍👧", "🏠", "❤️"]],
  ["food|drink|eat|restaurant|café|cafe", ["🍽️", "☕", "🥗"]],
  ["travel|transport|trip|flight|airport", ["✈️", "🗺️", "🚂"]],
  ["work|job|office|business|meeting",    ["💼", "📊", "🤝"]],
  ["school|class|study|learn|education",  ["📚", "✏️", "🎓"]],
  ["weather|rain|sun|cloud|season",       ["☀️", "🌧️", "🌤️"]],
  ["sport|exercise|gym|fitness|football", ["⚽", "🏃", "💪"]],
  ["music|concert|song|band|play",        ["🎵", "🎸", "🎤"]],
  ["home|house|room|apartment|flat",      ["🏠", "🛋️", "🪟"]],
  ["technology|tech|computer|phone|internet", ["💻", "📱", "🔧"]],
  ["health|doctor|hospital|medicine|sick", ["🏥", "💊", "🩺"]],
  ["animal|pet|dog|cat|zoo",             ["🐕", "🐈", "🦁"]],
  ["shopping|shop|store|buy|price",      ["🛍️", "💳", "🏪"]],
  ["colour|color|number|count",          ["🎨", "🔢", "✨"]],
  ["body|exercise|yoga|stretch",         ["🧘", "💪", "🏃"]],
  ["clothes|fashion|wear|dress",         ["👗", "👔", "👟"]],
  ["hobby|read|draw|paint|game",         ["🎮", "📖", "🎨"]],
];

function topicEmojis(topic: string): string[] {
  const t = topic.toLowerCase();
  for (const [pattern, emojis] of TOPIC_EMOJI_MAP) {
    if (new RegExp(pattern).test(t)) return emojis;
  }
  return ["📖", "💡", "🌟", "🎯", "✨", "🗣️"];
}

function buildMockStory(topic: string, level: string, vocab: VocabItem[]): ClassStory {
  const t = topic.trim();
  const terms = vocab.slice(0, 8).map(v => v.term.split("/")[0].trim());
  const emojis = topicEmojis(t);

  const isA1 = level === "A1";
  const isA2 = level === "A2";
  const isAdvanced = level === "C1" || level === "C2";
  const panelCount = isA1 ? 3 : isA2 ? 4 : isAdvanced ? 6 : 5;

  // Build natural sentences that embed the vocab terms
  const v = (i: number) => terms[i] ?? t;

  if (isA1) {
    return {
      title: `A ${t} Story`,
      panels: [
        {
          text: `This is Ana. She is a student. Today she learns about ${t}.`,
          scene: `Student at desk with book`,
          emoji: emojis[0],
          vocab: terms.slice(0, 2),
        },
        {
          text: `Ana says: "${v(0)}!" She uses ${v(1)}. It is easy and fun.`,
          scene: `Student speaking and smiling`,
          emoji: emojis[1],
          vocab: terms.slice(0, 3),
        },
        {
          text: `At the end, Ana is happy. She says: "${v(2)}!" She practices every day.`,
          scene: `Happy student giving thumbs up`,
          emoji: emojis[2] ?? "🌟",
          vocab: terms.slice(2, 4),
        },
      ],
    };
  }

  if (isA2) {
    return {
      title: `A Story About ${t}`,
      panels: [
        {
          text: `Last week, Marco decided to explore ${t}. He was nervous at first, but he knew it was important.`,
          scene: `Person thinking about starting something new`,
          emoji: emojis[0],
          vocab: [v(0), v(1)],
        },
        {
          text: `He used ${v(0)} and ${v(1)} to get started. It was simpler than he expected.`,
          scene: `Person actively doing the activity`,
          emoji: emojis[1],
          vocab: [v(0), v(1), v(2)],
        },
        {
          text: `Marco made a small mistake with ${v(2)}, but he didn't give up. He tried again.`,
          scene: `Person overcoming a challenge`,
          emoji: emojis[2] ?? "💪",
          vocab: [v(2), v(3)],
        },
        {
          text: `In the end, Marco felt confident. He understood ${v(3)} and ${v(4)} much better now.`,
          scene: `Person smiling, looking confident`,
          emoji: "🌟",
          vocab: [v(3), v(4)],
        },
      ],
    };
  }

  if (isAdvanced) {
    return {
      title: `The Art of ${t}`,
      panels: [
        {
          text: `Elena had always been fascinated by ${t}. She had grown up surrounded by it, absorbing its nuances without ever formally studying them.`,
          scene: `Person reflecting on a lifelong passion`,
          emoji: emojis[0],
          vocab: [v(0), v(1)],
        },
        {
          text: `One afternoon, she decided to challenge herself. Using ${v(0)} and ${v(1)}, she approached the subject from an entirely new angle.`,
          scene: `Person studying and taking notes at a desk`,
          emoji: emojis[1],
          vocab: [v(0), v(1), v(2)],
        },
        {
          text: `The deeper she explored, the more she discovered. ${v(2)} led her to ${v(3)}, and ${v(3)} opened doors she hadn't expected.`,
          scene: `Lightbulb moment, person realising connections`,
          emoji: "💡",
          vocab: [v(2), v(3)],
        },
        {
          text: `She consulted colleagues, debated ideas, and tested assumptions. The tension between ${v(4)} and ${v(5)} became the central question of her inquiry.`,
          scene: `Group discussion in a professional setting`,
          emoji: emojis[2] ?? "🗣️",
          vocab: [v(4), v(5)],
        },
        {
          text: `Weeks later, Elena presented her findings. Her command of the subject — its vocabulary, its subtleties, its contradictions — was unmistakably refined.`,
          scene: `Person presenting confidently to an audience`,
          emoji: "🎯",
          vocab: [v(5), v(6)],
        },
        {
          text: `The journey through ${t} had changed her perspective entirely. She understood not just the what, but the why — and that made all the difference.`,
          scene: `Person looking satisfied and thoughtful`,
          emoji: "✨",
          vocab: [v(6), v(7)].filter(Boolean),
        },
      ],
    };
  }

  // B1 / B2 default (5 panels)
  return {
    title: `A Story About ${t}`,
    panels: [
      {
        text: `Sara had been thinking about ${t} for a long time. She decided it was finally time to do something about it.`,
        scene: `Person making a decision`,
        emoji: emojis[0],
        vocab: [v(0), v(1)],
      },
      {
        text: `She started with ${v(0)} — it was harder than expected, but she kept going. ${v(1)} turned out to be the key.`,
        scene: `Person working through a challenge`,
        emoji: emojis[1],
        vocab: [v(0), v(1), v(2)],
      },
      {
        text: `Along the way, she met different people. Some agreed with her approach to ${v(2)}, others didn't — but everyone had something interesting to say.`,
        scene: `People having a lively conversation`,
        emoji: "💬",
        vocab: [v(2), v(3)],
      },
      {
        text: `There was a difficult moment when ${v(3)} went wrong. But Sara used ${v(4)} to find a solution, and it worked.`,
        scene: `Person solving a problem with determination`,
        emoji: emojis[2] ?? "💪",
        vocab: [v(3), v(4)],
      },
      {
        text: `In the end, Sara felt proud. She had learned that ${v(5)} and ${v(0)} were more connected than she ever realised.`,
        scene: `Person smiling at the result of their efforts`,
        emoji: "🌟",
        vocab: [v(5), v(0)],
      },
    ],
  };
}

export function buildMockClass(input: ClassGenInput): GeneratedClass {
  const info = getCEFRInfo(input.level);
  const t = input.topic.trim() || "everyday life";
  const beginner = isBeginner(input.level);
  const advanced = isAdvanced(input.level);
  const business = input.track === "business";

  const format =
    input.level === "A1" ? "vocabulary_practice"
    : input.level === "A2" ? "discussion"
    : advanced ? "debate"
    : "discussion";

  // Use topic-specific A1 content only on the FIRST visit — subsequent visits
  // fall through to the generic builder so content is not repeated verbatim.
  const isRepeat = (input.topicRepeatCount ?? 0) > 0;
  const a1Content = input.level === "A1" && !business && !isRepeat ? getA1TopicContent(t) : undefined;

  const warmUpQuestions = a1Content
    ? a1Content.warmUpQuestions
    : [
        `When did you last talk about ${t}? Who with?`,
        `How do you feel about ${t} — interested, neutral, or tired of it?`,
        `What is one word that comes to mind when you think of ${t}?`,
        `Have you ever tried or experienced something related to ${t}?`,
        `Who in your life is also interested in ${t}?`,
      ];

  const warmUpQuestionsPt = a1Content
    ? a1Content.warmUpQuestionsPt
    : [
        `Quando foi a última vez que você falou sobre ${t}? Com quem?`,
        `Como você se sente em relação a ${t} — interessado(a), neutro(a) ou cansado(a)?`,
        `Qual é uma palavra que vem à sua mente quando você pensa em ${t}?`,
        `Você já tentou ou experimentou algo relacionado a ${t}?`,
        `Quem na sua vida também tem interesse em ${t}?`,
      ];

  // Build the vocab list first so the story can reference real terms.
  const vocabList = a1Content ? a1Content.vocab : business ? buildBusinessVocab(t) : buildVocab(t);

  return {
    topic: t,
    level: input.level,
    autisticMode: input.autisticMode,
    track: input.track ?? "general",
    grammar: a1Content ? a1Content.grammarPoints : buildGrammar(beginner, advanced, business),
    speakingRatio: info.speakingRatio,
    estimatedMinutes: beginner ? 45 : advanced ? 60 : 50,
    story: buildMockStory(t, input.level, vocabList),
    generatedBy: "mock",
    agenda: [
      "Story: illustrated comic panels",
      "Warm-up: 5 questions",
      "Target language: vocabulary + 2 structures",
      "Guided production: frames & role-play",
      a1Content ? "Vocabulary practice" : "Free production: speak freely",
      "Feedback: self-check",
    ],
    warmUp: {
      questions: warmUpQuestions,
      questionsPt: warmUpQuestionsPt,
      grammarNote: a1Content ? a1Content.grammarNote : buildGrammarNote(beginner, advanced, business),
    },
    targetLanguage: {
      vocab: vocabList,
      structures: a1Content
        ? [
            { pattern: "I am / I have ___", example: `I am a student. I have a ${t.split(" ")[0].toLowerCase()}.` },
            { pattern: "I like ___ because ___", example: `I like ${t} because it is interesting.` },
          ]
        : [
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
      intro: a1Content
        ? "Complete each sentence out loud. Short and simple is perfect!"
        : "Complete each frame out loud, then say it again a little faster.",
      sentenceFrames: a1Content
        ? a1Content.sentenceFrames
        : [
            `I'm into ${t} because ___.`,
            `The thing about ${t} is that ___.`,
            `Honestly, I'd say ___.`,
            `It depends on ___.`,
            `I look forward to ___.`,
            `In my experience, ___.`,
          ],
      rolePlay: a1Content
        ? { scenario: a1Content.rolePlayScenario, roles: a1Content.rolePlayRoles }
        : {
            scenario: `A new friend asks you about ${t} at a café. Keep the chat going for two minutes — ask them a question back.`,
            roles: ["You (the enthusiast)", "A curious new friend"],
          },
      picturePrompts: a1Content
        ? [
            `Look around the room. Point to something and say its name in English.`,
            `Draw or imagine a simple picture related to ${t}. Describe it in two sentences.`,
          ]
        : [
            `Picture a scene related to ${t}. Describe what you see for 30 seconds.`,
            `Imagine explaining ${t} to a 10-year-old. Try it out loud.`,
          ],
    },
    freeProduction: {
      intro: a1Content
        ? "Now use today's words. Say each answer out loud — short, simple sentences are perfect."
        : advanced
        ? "Now speak freely and push for precision — aim for nuance, not just fluency."
        : "Now speak freely. Aim for longer turns — don't stop at one sentence.",
      prompts: a1Content
        ? a1Content.practicePrompts
        : input.level !== "A1"
        ? [
            `Tell a short story about a time ${t} surprised you.`,
            `Argue for or against this: "${t} is overrated."`,
            `If you had to teach a class on ${t}, what would you start with?`,
            advanced
              ? `Where do you think ${t} will be in ten years, and why?`
              : `What is one thing about ${t} you'd like to be better at?`,
          ]
        : [
            `Say your name and one thing you know about ${t}.`,
            `Name three words from today's lesson.`,
            `Complete: "I like ___ because ___.`,
            `Say two things you can see right now.`,
            `Say one sentence about yourself.`,
          ],
      format,
    },
    feedback: {
      intro: "Listen back to your speaking and check yourself concretely.",
      checklist: a1Content
        ? [
            "Did I say the target words correctly?",
            "Did I speak in short, complete sentences?",
            "Did I use 'I am' and 'I have' correctly?",
            "Did I keep speaking in English without stopping?",
            "Did I remember at least 5 words from today?",
          ]
        : [
            "Did I use at least 4 of today's target words?",
            "Did I speak in full sentences, not just single words?",
            "Did I use the past tense correctly when telling a story?",
            "Did I keep going instead of switching to Portuguese when stuck?",
            advanced
              ? "Did I add nuance (hedging, contrast) rather than flat statements?"
              : "Did I link ideas with 'and', 'but', 'because', 'so'?",
          ],
      commonErrors: a1Content
        ? [
            "Saying word order in Portuguese order (adjective after noun): say 'a big dog', not 'a dog big'.",
            "Forgetting the verb 'to be': say 'I am happy', not 'I happy'.",
            "Saying 'I have 20 years' — correct: 'I am 20 years old'.",
            "Forgetting the -s on he/she/it: 'She has', not 'She have'.",
            "Mixing up 'I like' (habit) and 'I am liking' — use 'I like' for general preferences.",
          ]
        : [
            "Saying 'I have 30 years' instead of 'I am 30 years old'.",
            "Dropping the -s on he/she/it verbs (he like → he likes).",
            "Using 'people is' instead of 'people are'.",
            "Pronouncing the -ed ending as an extra syllable everywhere.",
            "Saying 'I have doubt' instead of 'I have a question'.",
          ],
    },
  };
}
