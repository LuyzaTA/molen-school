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

function buildMockStory(topic: string, level: string, vocab: VocabItem[]): ClassStory {
  const t = topic.trim();
  const terms = vocab.slice(0, 8).map(v => v.term.split("/")[0].trim());
  const v = (i: number) => terms[i] ?? t;

  const isA1 = level === "A1";
  const isA2 = level === "A2";
  const isAdvanced = level === "C1" || level === "C2";

  if (isA1) {
    return {
      title: `Ana Learns About ${t}`,
      panels: [
        {
          text: `Ana is at a café with her friend Leo. Today they talk about ${t}.`,
          scene: `A small café — Monday morning`,
          dialogue: [
            { speaker: "Ana", line: `Hi Leo! Can we practice ${t} today?` },
            { speaker: "Leo", line: `Yes! Let's start with "${v(0)}".` },
          ],
          check: {
            question: "Where are Ana and Leo?",
            options: ["At a café", "At home", "At work"],
            answer: 0,
          },
          vocab: [v(0)],
        },
        {
          text: `Leo teaches Ana new words. She learns "${v(0)}" and "${v(1)}". One word is difficult for her.`,
          scene: `The same café — a little later`,
          dialogue: [
            { speaker: "Ana", line: `"${v(1)}" is difficult. Can you help me?` },
            { speaker: "Leo", line: `Of course. Listen and repeat: "${v(1)}".` },
          ],
          check: {
            question: "Who helps Ana?",
            options: ["Leo", "The waiter", "Nobody"],
            answer: 0,
          },
          vocab: [v(0), v(1)],
        },
        {
          text: `Now Ana knows the new words. She is happy. She wants to practice "${v(2)}" tomorrow.`,
          scene: `Outside the café — afternoon`,
          dialogue: [
            { speaker: "Ana", line: `Thank you, Leo! Now I understand.` },
            { speaker: "Leo", line: `You are welcome. See you tomorrow!` },
          ],
          check: {
            question: "How does Ana feel at the end?",
            options: ["Happy", "Sad", "Angry"],
            answer: 0,
          },
          vocab: [v(1), v(2)],
        },
      ],
    };
  }

  if (isA2) {
    return {
      title: `Marco's ${t} Surprise`,
      panels: [
        {
          text: `Last Saturday, Marco met his friend Julia at the market. He wanted to get better at ${t}, but he had a problem.`,
          scene: `A busy street market — Saturday morning`,
          dialogue: [
            { speaker: "Marco", line: `Julia, can you help me with ${t}?` },
            { speaker: "Julia", line: `Of course! But why do you look so worried?` },
          ],
          check: {
            question: "When did Marco meet Julia?",
            options: ["On Saturday", "On Monday", "Last year"],
            answer: 0,
          },
          vocab: [v(0)],
        },
        {
          text: `Marco explained his problem. He tried to use "${v(0)}" and "${v(1)}" before, but he made many mistakes.`,
          scene: `Julia's kitchen — later that morning`,
          dialogue: [
            { speaker: "Marco", line: `I tried "${v(0)}", but everything went wrong.` },
            { speaker: "Julia", line: `Don't worry — everyone makes mistakes at first.` },
          ],
          check: {
            question: "How does Julia react?",
            options: ["She is kind and helps", "She laughs at Marco", "She goes home"],
            answer: 0,
          },
          vocab: [v(0), v(1)],
        },
        {
          text: `They practiced together for an hour. Slowly, Marco got better. Then Julia had a surprise for him.`,
          scene: `The kitchen — one hour later`,
          dialogue: [
            { speaker: "Julia", line: `Close your eyes, Marco. I have a surprise!` },
            { speaker: "Marco", line: `A surprise? What is it?` },
          ],
          check: {
            question: "What does Julia have?",
            options: ["A surprise", "A problem", "A new job"],
            answer: 0,
          },
          vocab: [v(2)],
        },
        {
          text: `The surprise was a small test — and Marco passed it! He felt proud. Now he uses "${v(2)}" and "${v(3)}" every day.`,
          scene: `The living room — that evening`,
          dialogue: [
            { speaker: "Marco", line: `I did it! Thank you for your help.` },
            { speaker: "Julia", line: `You worked hard. You should be proud!` },
          ],
          check: {
            question: "Did Marco pass the test?",
            options: ["Yes", "No"],
            answer: 0,
          },
          vocab: [v(2), v(3)],
        },
      ],
    };
  }

  if (isAdvanced) {
    return {
      title: `A Question of ${t}`,
      panels: [
        {
          text: `Elena had spent years studying ${t}, yet one question continued to trouble her — a question nobody around her seemed able, or perhaps willing, to answer.`,
          scene: `A university library — late autumn`,
          dialogue: [
            { speaker: "Elena", line: `Rafael, have you ever wondered why we take ${t} for granted?` },
            { speaker: "Rafael", line: `Constantly. Though I suspect the answer is more uncomfortable than we'd like.` },
          ],
          check: {
            question: "What troubled Elena?",
            options: ["An unanswered question", "A broken computer", "Her schedule"],
            answer: 0,
          },
          vocab: [v(0)],
        },
        {
          text: `Determined to investigate, Elena organised a small seminar. She began with "${v(0)}" — a concept her colleagues thought they understood, until she pressed them on it.`,
          scene: `A seminar room — the following week`,
          dialogue: [
            { speaker: "Rafael", line: `You're suggesting we've all been working from a flawed assumption?` },
            { speaker: "Elena", line: `I'm suggesting we've never seriously questioned it.` },
          ],
          check: {
            question: "What did Elena organise?",
            options: ["A seminar", "A party", "A holiday"],
            answer: 0,
          },
          vocab: [v(0), v(1)],
        },
        {
          text: `The archives revealed something curious: a series of records connecting "${v(1)}" with "${v(2)}" in ways nobody had documented before.`,
          scene: `The archives — after midnight`,
          dialogue: [
            { speaker: "Elena", line: `Look at this. These records contradict everything in the standard literature.` },
            { speaker: "Rafael", line: `Either that, or the standard literature has been quietly ignoring them.` },
          ],
          check: {
            question: "What did the records do?",
            options: ["Contradicted accepted ideas", "Confirmed everything", "Proved nothing"],
            answer: 0,
          },
          vocab: [v(1), v(2)],
        },
        {
          text: `Rafael, initially sceptical, spent the night verifying her findings. By morning, his scepticism had turned into something closer to alarm.`,
          scene: `Rafael's office — the next morning`,
          dialogue: [
            { speaker: "Rafael", line: `If you publish this, half the department will turn on you.` },
            { speaker: "Elena", line: `And if I don't, we keep teaching something we know is incomplete.` },
          ],
          check: {
            question: "How did Rafael's attitude change?",
            options: ["From sceptical to alarmed", "From happy to sad", "It never changed"],
            answer: 0,
          },
          vocab: [v(3)],
        },
        {
          text: `The presentation provoked exactly the storm Rafael had predicted. Yet amid the objections, drawing on "${v(3)}" and "${v(4)}", Elena defended each point with quiet precision.`,
          scene: `The faculty meeting — Friday afternoon`,
          dialogue: [
            { speaker: "Elena", line: `I'm not asking you to accept my conclusions — only to examine the evidence.` },
            { speaker: "Rafael", line: `That, colleagues, is precisely what we are supposed to do.` },
          ],
          check: {
            question: "How did Elena defend her work?",
            options: ["With quiet precision", "By shouting", "She refused to answer"],
            answer: 0,
          },
          vocab: [v(3), v(4)],
        },
        {
          text: `In time, the controversy settled into curiosity, and curiosity into genuine research. Elena's question about ${t} remained open — but now, at least, it was being asked.`,
          scene: `The library — one month later`,
          dialogue: [
            { speaker: "Rafael", line: `You realise you've changed how this field thinks?` },
            { speaker: "Elena", line: `No — I've reminded it how to think. There's a difference.` },
          ],
          check: {
            question: "What happened one month later?",
            options: ["The controversy became research", "Elena left the university", "Nothing changed"],
            answer: 0,
          },
          vocab: [v(5), v(6)].filter(Boolean),
        },
      ],
    };
  }

  // B1 / B2 default (5 scenes)
  return {
    title: `The ${t} Challenge`,
    panels: [
      {
        text: `Sara arrived at work on Monday and found an unexpected email. Her manager wanted her to lead a project about ${t} — in only one week.`,
        scene: `An office in São Paulo — Monday, 9 a.m.`,
        dialogue: [
          { speaker: "Sara", line: `One week? That's impossible — I've never led anything like this.` },
          { speaker: "Daniel", line: `Relax. If we plan it carefully, we can make it work.` },
        ],
        check: {
          question: "What did the manager ask Sara to do?",
          options: ["Lead a project", "Take a holiday", "Change jobs"],
          answer: 0,
        },
        vocab: [v(0)],
      },
      {
        text: `They started with "${v(0)}", which turned out to be more complicated than expected. However, Daniel had an idea that changed everything.`,
        scene: `A meeting room — Tuesday afternoon`,
        dialogue: [
          { speaker: "Daniel", line: `What if we try a completely different approach?` },
          { speaker: "Sara", line: `It's risky... but it might actually work.` },
        ],
        check: {
          question: "How did Sara feel about Daniel's idea?",
          options: ["Unsure but interested", "Completely against it", "Bored"],
          answer: 0,
        },
        vocab: [v(0), v(1)],
      },
      {
        text: `Just when things were going well, they discovered a serious problem with "${v(1)}". Sara wanted to give up, but Daniel reminded her how far they had come.`,
        scene: `The office — Wednesday evening`,
        dialogue: [
          { speaker: "Sara", line: `Maybe I wasn't the right person for this.` },
          { speaker: "Daniel", line: `Are you joking? Look at everything you've already done.` },
        ],
        check: {
          question: "What did Sara want to do?",
          options: ["Give up", "Celebrate", "Ask for a raise"],
          answer: 0,
        },
        vocab: [v(1), v(2)],
      },
      {
        text: `They worked through the problem step by step, using "${v(2)}" and "${v(3)}". By the end of the day, the solution was finally ready.`,
        scene: `A café near the office — Thursday morning`,
        dialogue: [
          { speaker: "Daniel", line: `I told you we could do it.` },
          { speaker: "Sara", line: `We're not finished yet — the presentation is tomorrow!` },
        ],
        check: {
          question: "When is the presentation?",
          options: ["Tomorrow", "Next month", "It was cancelled"],
          answer: 0,
        },
        vocab: [v(2), v(3)],
      },
      {
        text: `The presentation was a success. The manager was impressed, and Sara realised something important: the biggest challenge had been her own doubt.`,
        scene: `The main conference room — Friday`,
        dialogue: [
          { speaker: "Sara", line: `I can't believe we actually did it.` },
          { speaker: "Daniel", line: `Believe it. And next time, you won't doubt yourself.` },
        ],
        check: {
          question: "What was Sara's biggest challenge?",
          options: ["Her own doubt", "The computer", "The weather"],
          answer: 0,
        },
        vocab: [v(4), v(0)],
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
      "Story: interactive scenes with dialogue",
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
      ...(input.level === "A1" ? {
        introPt: a1Content
          ? "Complete cada frase em voz alta. Curto e simples é perfeito!"
          : "Complete cada estrutura em voz alta, depois diga novamente um pouco mais rápido.",
      } : {}),
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
      ...(input.level === "A1" && !a1Content ? {
        sentenceFramesPt: [
          `Eu gosto muito de ${t} porque ___.`,
          `O que eu acho de ${t} é que ___.`,
          `Honestamente, eu diria ___.`,
          `Depende de ___.`,
          `Estou animado(a) para ___.`,
          `Na minha experiência, ___.`,
        ],
      } : {}),
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
      ...(input.level === "A1" ? {
        introPt: a1Content
          ? "Agora use as palavras de hoje. Diga cada resposta em voz alta — frases curtas e simples são perfeitas."
          : "Agora fale livremente. Tente frases mais longas — não pare na primeira frase.",
      } : {}),
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
      ...(input.level === "A1" && !a1Content ? {
        promptsPt: [
          `Diga seu nome e uma coisa que você sabe sobre ${t}.`,
          `Nomeie três palavras da aula de hoje.`,
          `Complete: "Eu gosto de ___ porque ___.`,
          `Diga duas coisas que você pode ver agora.`,
          `Diga uma frase sobre você mesmo(a).`,
        ],
      } : {}),
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
