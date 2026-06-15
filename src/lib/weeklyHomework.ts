import type { CEFRLevel, WeeklyPlan } from "./types";

// ============================================================
// Curated weekly homework, one plan per CEFR level. Five weekdays,
// each with a theme and one or two short tasks across the four
// skills, scaled to the level. A1 carries Brazilian-Portuguese
// translations (detailPt / focusPt); every other level is English
// only — they don't get translations.
// ============================================================

const PLANS: Record<CEFRLevel, WeeklyPlan> = {
  A1: {
    level: "A1",
    focus: "Talk about yourself and your everyday life in simple, clear sentences.",
    focusPt: "Fale sobre você e seu dia a dia em frases simples e claras.",
    days: [
      {
        day: "Monday",
        theme: "Introducing yourself",
        tasks: [
          {
            skill: "speaking",
            title: "Say hello (30 seconds)",
            detail: "Record yourself: your name, your city, and one hobby. Use 'My name is…', 'I live in…', 'I like…'.",
            detailPt: "Grave você falando: seu nome, sua cidade e um hobby. Use 'My name is…', 'I live in…', 'I like…'.",
          },
          {
            skill: "reading",
            title: "8 greetings",
            detail: "Learn 8 common greetings (Hello, Good morning, Nice to meet you…) and say each one aloud.",
            detailPt: "Aprenda 8 cumprimentos comuns (Hello, Good morning, Nice to meet you…) e diga cada um em voz alta.",
          },
        ],
      },
      {
        day: "Tuesday",
        theme: "Family & people",
        tasks: [
          {
            skill: "writing",
            title: "5 sentences about family",
            detail: "Write 5 sentences about your family using 'He is…', 'She has…', 'They are…'.",
            detailPt: "Escreva 5 frases sobre sua família usando 'He is…', 'She has…', 'They are…'.",
          },
          {
            skill: "listening",
            title: "Family words",
            detail: "Watch a 2-minute beginner video about family and write down 4 new words you hear.",
            detailPt: "Assista a um vídeo de 2 minutos para iniciantes sobre família e anote 4 palavras novas que você ouvir.",
          },
        ],
      },
      {
        day: "Wednesday",
        theme: "Daily routine",
        tasks: [
          {
            skill: "speaking",
            title: "Your morning (40 seconds)",
            detail: "Describe your morning out loud: 'I wake up at…', 'I eat…', 'I go to…'.",
            detailPt: "Descreva sua manhã em voz alta: 'I wake up at…', 'I eat…', 'I go to…'.",
          },
        ],
      },
      {
        day: "Thursday",
        theme: "Food & numbers",
        tasks: [
          {
            skill: "speaking",
            title: "Order in a café",
            detail: "Role-play ordering food: 'I'd like a…', 'How much is it?', 'Thank you'.",
            detailPt: "Faça uma simulação pedindo comida: 'I'd like a…', 'How much is it?', 'Thank you'.",
          },
          {
            skill: "writing",
            title: "Prices",
            detail: "Write the price of 5 things you bought this week in English (numbers + 'reais' or dollars).",
            detailPt: "Escreva o preço de 5 coisas que você comprou esta semana em inglês (números + 'reais' ou dólares).",
          },
        ],
      },
      {
        day: "Friday",
        theme: "Review & speak",
        tasks: [
          {
            skill: "speaking",
            title: "Bigger introduction",
            detail: "Re-record Monday's introduction and add 2 new sentences about your week.",
            detailPt: "Regrave sua apresentação de segunda-feira e adicione 2 frases novas sobre a sua semana.",
          },
          {
            skill: "reading",
            title: "Word check",
            detail: "Read this week's words again and tick the ones you remember without help.",
            detailPt: "Leia as palavras desta semana de novo e marque as que você lembra sem ajuda.",
          },
        ],
      },
    ],
  },

  A2: {
    level: "A2",
    focus: "Describe people, places, and recent experiences in connected sentences.",
    days: [
      {
        day: "Monday",
        theme: "Describing people",
        tasks: [
          { skill: "writing", title: "Describe a friend", detail: "Write 6 sentences about a friend — looks and personality (tall, friendly, always…)." },
          { skill: "speaking", title: "Say it aloud (40s)", detail: "Describe the same friend out loud without reading your notes." },
        ],
      },
      {
        day: "Tuesday",
        theme: "Last weekend",
        tasks: [
          { skill: "speaking", title: "Past simple story", detail: "Tell what you did last weekend in 6–8 sentences (went, ate, watched, met)." },
        ],
      },
      {
        day: "Wednesday",
        theme: "Your town",
        tasks: [
          { skill: "reading", title: "City text + 5 words", detail: "Read a short text about any city and extract 5 useful words with quick definitions." },
          { skill: "speaking", title: "My neighbourhood", detail: "Describe your neighbourhood: what's near, what you like, what's missing." },
        ],
      },
      {
        day: "Thursday",
        theme: "Plans",
        tasks: [
          { skill: "writing", title: "Next weekend", detail: "Write 6 sentences about next weekend using 'going to' and 'want to'." },
          { skill: "listening", title: "Plans dialogue", detail: "Listen to a short dialogue about plans and note 3 phrases people use to suggest things." },
        ],
      },
      {
        day: "Friday",
        theme: "Review",
        tasks: [
          { skill: "speaking", title: "My week (1 minute)", detail: "Speak for one minute about your whole week — past and future, connected with 'and / but / so'." },
        ],
      },
    ],
  },

  B1: {
    level: "B1",
    focus: "Give opinions and tell stories with reasons and connectors.",
    days: [
      {
        day: "Monday",
        theme: "Opinions with reasons",
        tasks: [
          { skill: "speaking", title: "Two-minute opinion", detail: "Pick a topic you care about and speak for 2 minutes, giving at least 3 reasons (because, since, that's why)." },
        ],
      },
      {
        day: "Tuesday",
        theme: "Storytelling",
        tasks: [
          { skill: "speaking", title: "A memorable day", detail: "Tell the story of a memorable day with a clear beginning, middle, and end. Use past tenses." },
          { skill: "writing", title: "Write the ending", detail: "Write the last paragraph of your story (80–100 words) to lock in the past tense." },
        ],
      },
      {
        day: "Wednesday",
        theme: "Listening & reacting",
        tasks: [
          { skill: "listening", title: "Podcast segment", detail: "Listen to 5 minutes of a learner podcast and summarise the main point in 3 sentences." },
          { skill: "speaking", title: "React to it", detail: "Record your reaction: do you agree? Why or why not?" },
        ],
      },
      {
        day: "Thursday",
        theme: "Writing an opinion",
        tasks: [
          { skill: "writing", title: "Opinion text (120 words)", detail: "Write a 120-word opinion using connectors: on the one hand, however, in my view, overall." },
        ],
      },
      {
        day: "Friday",
        theme: "Mini-debate",
        tasks: [
          { skill: "speaking", title: "Argue both sides", detail: "Choose a statement and speak for 1 minute FOR it, then 1 minute AGAINST it." },
        ],
      },
    ],
  },

  B2: {
    level: "B2",
    focus: "Argue a point and discuss abstract topics with fluency and structure.",
    days: [
      {
        day: "Monday",
        theme: "Structured argument",
        tasks: [
          { skill: "speaking", title: "Claim, reason, example", detail: "Argue a position for 3 minutes using the claim → reason → example pattern at least twice." },
        ],
      },
      {
        day: "Tuesday",
        theme: "Current affairs",
        tasks: [
          { skill: "reading", title: "News article", detail: "Read a news article, then summarise it neutrally and add your own evaluation." },
          { skill: "speaking", title: "Discuss it", detail: "Record a 2-minute discussion as if talking to a friend who disagrees with you." },
        ],
      },
      {
        day: "Wednesday",
        theme: "Listening for nuance",
        tasks: [
          { skill: "listening", title: "Talk or TED", detail: "Watch a 6–10 min talk and note 5 advanced collocations or signposting phrases." },
        ],
      },
      {
        day: "Thursday",
        theme: "Essay craft",
        tasks: [
          { skill: "writing", title: "Argumentative essay (180w)", detail: "Write a 180-word essay with a thesis, two supporting paragraphs, and a counter-argument." },
        ],
      },
      {
        day: "Friday",
        theme: "Spontaneous debate",
        tasks: [
          { skill: "speaking", title: "Unprepared topic", detail: "Pick a random topic and speak for 3 minutes with no preparation — fluency over perfection." },
        ],
      },
    ],
  },

  C1: {
    level: "C1",
    focus: "Speak spontaneously with nuance and precision on complex topics.",
    days: [
      {
        day: "Monday",
        theme: "Hedging & nuance",
        tasks: [
          { skill: "speaking", title: "Shades of opinion", detail: "Discuss a complex issue for 3 minutes using hedging (it tends to, arguably, by and large, to some extent)." },
        ],
      },
      {
        day: "Tuesday",
        theme: "Summarising precisely",
        tasks: [
          { skill: "reading", title: "Long-form article", detail: "Read a long article and summarise its argument in exactly 4 sentences — no detail loss." },
          { skill: "speaking", title: "Out-loud summary", detail: "Deliver that summary aloud as if briefing a colleague." },
        ],
      },
      {
        day: "Wednesday",
        theme: "Critical listening",
        tasks: [
          { skill: "listening", title: "Podcast critique", detail: "Listen to a native-level podcast and identify a weak point in the speaker's reasoning." },
        ],
      },
      {
        day: "Thursday",
        theme: "Analytical writing",
        tasks: [
          { skill: "writing", title: "Analysis (220 words)", detail: "Write a 220-word analysis weighing pros and cons and arriving at a qualified conclusion." },
        ],
      },
      {
        day: "Friday",
        theme: "Impromptu talk",
        tasks: [
          { skill: "speaking", title: "3-minute talk", detail: "Give a 3-minute impromptu talk on a prompt drawn at random. Record and review your fillers." },
        ],
      },
    ],
  },

  C2: {
    level: "C2",
    focus: "Use precise, idiomatic English effortlessly across registers.",
    days: [
      {
        day: "Monday",
        theme: "Register shifting",
        tasks: [
          { skill: "speaking", title: "Same idea, three ways", detail: "Express one idea formally, casually, and humorously. Record all three and compare." },
        ],
      },
      {
        day: "Tuesday",
        theme: "Idioms & collocations",
        tasks: [
          { skill: "reading", title: "Mine 8 idioms", detail: "Read native material and collect 8 idioms/collocations; use each in a natural sentence aloud." },
        ],
      },
      {
        day: "Wednesday",
        theme: "Critique",
        tasks: [
          { skill: "listening", title: "Lecture critique", detail: "Watch a full lecture and prepare a 2-minute critique of both content and delivery." },
        ],
      },
      {
        day: "Thursday",
        theme: "Persuasion",
        tasks: [
          { skill: "writing", title: "Persuasive piece", detail: "Write a persuasive op-ed (250 words) with rhetorical devices and a memorable close." },
        ],
      },
      {
        day: "Friday",
        theme: "High-stakes speaking",
        tasks: [
          { skill: "speaking", title: "Debate with idioms", detail: "Hold a 4-minute debate position, weaving in at least 4 idioms naturally and accurately." },
        ],
      },
    ],
  },
};

export function getWeeklyPlan(level: CEFRLevel): WeeklyPlan {
  return PLANS[level];
}
