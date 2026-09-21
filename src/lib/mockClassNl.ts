import type { ClassGenInput, GeneratedClass, VocabItem, ClassStory } from "./types";
import type { SupportLanguage } from "./language";
import { getCEFRInfo } from "./cefr";

// ============================================================
// Deterministic offline fallback for the Dutch course. Used when
// the AI endpoint is unavailable. Topic-agnostic, beginner-safe
// Dutch conversation language with every explanation in the
// learner's support language (English or Brazilian Portuguese).
// ============================================================

export function buildDutchMockClass(input: ClassGenInput): GeneratedClass {
  const sl: SupportLanguage = input.supportLang ?? "pt";
  const tx = (en: string, pt: string) => (sl === "pt" ? pt : en);
  const t = input.topic.trim() || tx("everyday life", "o dia a dia");
  const info = getCEFRInfo(input.level);
  const a1 = input.level === "A1";

  const vocab: VocabItem[] = [
    { term: "Hoe gaat het?", meaning: tx("How are you?", "Como vai?"), example: "Hoi Sanne, hoe gaat het?", exampleTranslation: tx("Hi Sanne, how are you?", "Oi Sanne, como vai?"), isIdiom: false },
    { term: "Ik vind ___ leuk", meaning: tx("I like ___", "Eu gosto de ___"), example: "Ik vind fietsen leuk.", exampleTranslation: tx("I like cycling.", "Eu gosto de andar de bicicleta."), isIdiom: false },
    { term: "Wat vind jij van ___?", meaning: tx("What do you think of ___?", "O que você acha de ___?"), example: "Wat vind jij van Utrecht?", exampleTranslation: tx("What do you think of Utrecht?", "O que você acha de Utrecht?"), isIdiom: false },
    { term: "lekker", meaning: tx("tasty; nice, pleasant", "gostoso; agradável"), example: "De koffie is lekker.", exampleTranslation: tx("The coffee is nice.", "O café está gostoso."), isIdiom: false },
    { term: "gezellig", meaning: tx("cosy, sociable, fun to be with", "aconchegante, animado, agradável (com pessoas)"), example: "Het feest is gezellig.", exampleTranslation: tx("The party is fun and cosy.", "A festa está animada e aconchegante."), isIdiom: true, literalMeaning: tx("There is no exact translation: it describes a warm, friendly atmosphere.", "Não há tradução exata: descreve um clima caloroso e amigável.") },
    { term: "Ik woon in ___", meaning: tx("I live in ___", "Eu moro em ___"), example: "Ik woon in Rotterdam.", exampleTranslation: tx("I live in Rotterdam.", "Eu moro em Roterdã."), isIdiom: false },
    { term: "de fiets", meaning: tx("the bicycle", "a bicicleta"), example: "Mijn fiets is nieuw.", exampleTranslation: tx("My bike is new.", "Minha bicicleta é nova."), isIdiom: false },
    { term: "Mag ik ___?", meaning: tx("May I have ___? / Can I ___?", "Posso ___? / Pode me dar ___?"), example: "Mag ik een koffie?", exampleTranslation: tx("Can I have a coffee?", "Pode me dar um café?"), isIdiom: false },
    { term: "Dat klopt", meaning: tx("That's right", "Isso mesmo; está certo"), example: "Je bent Braziliaans? Dat klopt.", exampleTranslation: tx("You're Brazilian? That's right.", "Você é brasileiro? Isso mesmo."), isIdiom: false },
    { term: "Wat bedoel je?", meaning: tx("What do you mean?", "O que você quer dizer?"), example: "Sorry, wat bedoel je?", exampleTranslation: tx("Sorry, what do you mean?", "Desculpe, o que você quer dizer?"), isIdiom: false },
  ];

  const questions = [
    "Hoe heet je?",
    "Waar woon je?",
    "Wat vind je leuk?",
    "Hoe ga je naar je werk of school?",
    "Wat drink je graag?",
  ];
  const questionsPt = [
    tx("What's your name?", "Como você se chama?"),
    tx("Where do you live?", "Onde você mora?"),
    tx("What do you like?", "Do que você gosta?"),
    tx("How do you get to work or school?", "Como você vai para o trabalho ou a escola?"),
    tx("What do you like to drink?", "O que você gosta de beber?"),
  ];

  const frames = [
    "Ik heet ______ en ik kom uit ______.",
    "Ik woon in ______.",
    "Ik vind ______ leuk.",
    "Ik vind ______ niet leuk.",
    "Mag ik een ______?",
  ];
  const framesPt = [
    tx("My name is ______ and I come from ______.", "Eu me chamo ______ e sou de ______."),
    tx("I live in ______.", "Eu moro em ______."),
    tx("I like ______.", "Eu gosto de ______."),
    tx("I don't like ______.", "Eu não gosto de ______."),
    tx("Can I have a ______?", "Pode me dar um(a) ______?"),
  ];

  const prompts = a1
    ? [
        "Noem drie dingen die je leuk vindt.",
        "Zeg je naam, je stad en je werk.",
        "Bestel een koffie en een broodje.",
      ]
    : [
        `Wat vind jij van ${t}?`,
        "Vertel over een gezellige dag.",
        "Wat is anders in Nederland dan in Brazilië?",
      ];
  const promptsPt = a1
    ? [
        tx("Name three things you like.", "Diga três coisas de que você gosta."),
        tx("Say your name, your city and your job.", "Diga seu nome, sua cidade e seu trabalho."),
        tx("Order a coffee and a sandwich.", "Peça um café e um sanduíche."),
      ]
    : [
        tx(`What do you think of ${t}?`, `O que você acha de ${t}?`),
        tx("Talk about a 'gezellige' day.", "Fale sobre um dia 'gezellig'."),
        tx("What is different in the Netherlands compared to Brazil?", "O que é diferente na Holanda em relação ao Brasil?"),
      ];

  const story: ClassStory = {
    title: "Een nieuwe buurvrouw",
    panels: [
      {
        scene: "Een straat in Utrecht — maandagochtend",
        text: "Ana woont in Utrecht. Ze pakt haar fiets.",
        textTranslation: tx("Ana lives in Utrecht. She gets her bike.", "Ana mora em Utrecht. Ela pega a bicicleta."),
        dialogue: [
          { speaker: "Sanne", line: "Hoi! Ik ben Sanne. Hoe gaat het?", translation: tx("Hi! I'm Sanne. How are you?", "Oi! Eu sou a Sanne. Como vai?") },
          { speaker: "Ana", line: "Goed! Ik woon in Utrecht.", translation: tx("Good! I live in Utrecht.", "Bem! Eu moro em Utrecht.") },
        ],
        check: { question: "Waar woont Ana?", options: ["In Utrecht", "In Rotterdam", "In Brazilië"], answer: 0 },
        vocab: ["Hoe gaat het?", "Ik woon in ___", "de fiets"],
      },
      {
        scene: "Een café — maandagmiddag",
        text: "Sanne en Ana drinken koffie.",
        textTranslation: tx("Sanne and Ana drink coffee.", "Sanne e Ana tomam café."),
        dialogue: [
          { speaker: "Ana", line: "Mag ik een koffie?", translation: tx("Can I have a coffee?", "Pode me dar um café?") },
          { speaker: "Sanne", line: "De koffie is lekker!", translation: tx("The coffee is nice!", "O café está gostoso!") },
        ],
        check: { question: "Wat drinken ze?", options: ["Thee", "Koffie", "Water"], answer: 1 },
        vocab: ["Mag ik ___?", "lekker"],
      },
      {
        scene: "Het huis van Sanne — maandagavond",
        text: "Sanne geeft een feest. Ana komt ook.",
        textTranslation: tx("Sanne has a party. Ana comes too.", "Sanne dá uma festa. Ana também vem."),
        dialogue: [
          { speaker: "Sanne", line: "Wat vind jij van het feest?", translation: tx("What do you think of the party?", "O que você acha da festa?") },
          { speaker: "Ana", line: "Heel gezellig! Ik vind het leuk.", translation: tx("Really cosy! I like it.", "Muito animada! Estou gostando.") },
        ],
        check: { question: "Hoe is het feest?", options: ["Saai", "Gezellig", "Koud"], answer: 1 },
        vocab: ["Wat vind jij van ___?", "gezellig"],
      },
    ],
  };

  return {
    topic: input.topic,
    level: input.level,
    autisticMode: input.autisticMode,
    speakingRatio: info.speakingRatio,
    estimatedMinutes: 50,
    agenda: [
      tx("Story: a new neighbour", "História: uma nova vizinha"),
      tx("Warm-up: five easy questions", "Aquecimento: cinco perguntas fáceis"),
      tx("Target language: 10 useful phrases", "Língua-alvo: 10 frases úteis"),
      tx("Guided speaking with sentence frames", "Fala guiada com frases-modelo"),
      tx("Free speaking", "Fala livre"),
      tx("Self-check: review your speaking", "Autoavaliação: revise sua fala"),
    ],
    story,
    warmUp: {
      questions,
      questionsPt,
      grammarNote: tx(
        "Today you practise the **present tense**: *ik woon*, *jij woont*, *hij woont*. In a question the verb comes first and loses the *t* after *jij*: *Woon jij in Utrecht?* Learn every noun with its article: **de** or **het**.",
        "Hoje você pratica o **presente**: *ik woon*, *jij woont*, *hij woont*. Na pergunta o verbo vem primeiro e perde o *t* depois de *jij*: *Woon jij in Utrecht?* Aprenda cada substantivo com o artigo: **de** ou **het**.",
      ),
    },
    targetLanguage: {
      vocab,
      structures: [
        { pattern: "Ik vind ___ leuk / niet leuk", example: "Ik vind koffie leuk, maar ik vind thee niet leuk." },
        { pattern: "Mag ik ___?", example: "Mag ik een broodje kaas?" },
      ],
    },
    guidedProduction: {
      intro: tx("Complete each sentence out loud with your own information.", "Complete cada frase em voz alta com as suas informações."),
      sentenceFrames: frames,
      sentenceFramesPt: framesPt,
      rolePlay: {
        scenario: tx(
          `You meet a new Dutch neighbour. Introduce yourself and talk briefly about ${t}.`,
          `Você conhece um vizinho holandês novo. Apresente-se e fale um pouco sobre ${t}.`,
        ),
        roles: [tx("You", "Você"), tx("Dutch neighbour", "Vizinho holandês")],
      },
      picturePrompts: [
        tx("Picture your street. Say three things you see, in Dutch.", "Imagine sua rua. Diga três coisas que você vê, em holandês."),
        tx("Picture a café. Order something in Dutch.", "Imagine um café. Peça algo em holandês."),
      ],
    },
    freeProduction: {
      intro: tx("Answer in Dutch. Short sentences are perfect.", "Responda em holandês. Frases curtas são perfeitas."),
      prompts,
      promptsPt,
      format: a1 ? "vocabulary_practice" : "discussion",
    },
    feedback: {
      intro: tx("Look back at your speaking. Tick what you managed.", "Revise a sua fala. Marque o que você conseguiu."),
      checklist: [
        tx("I used the article (de/het) with new nouns.", "Usei o artigo (de/het) com substantivos novos."),
        tx("I put the verb in second place.", "Coloquei o verbo em segundo lugar."),
        tx("I asked at least one question.", "Fiz pelo menos uma pergunta."),
        tx("I used 'ik vind … leuk'.", "Usei 'ik vind … leuk'."),
      ],
      commonErrors: [
        tx("Saying 'ik heb 30 jaar' (Portuguese style) — in Dutch: 'ik ben 30 jaar'.", "Dizer 'ik heb 30 jaar' (como em português) — em holandês: 'ik ben 30 jaar'."),
        tx("Forgetting the t: 'hij woon' → 'hij woont'.", "Esquecer o t: 'hij woon' → 'hij woont'."),
        tx("Using 'niet' before a noun with 'een': 'niet een fiets' → 'geen fiets'.", "Usar 'niet' antes de substantivo com 'een': 'niet een fiets' → 'geen fiets'."),
      ],
    },
    grammar: [
      tx("Present tense (tegenwoordige tijd)", "Presente (tegenwoordige tijd)"),
      tx("Articles de/het", "Artigos de/het"),
      tx("Questions by inversion (inversie)", "Perguntas com inversão (inversie)"),
    ],
    track: input.track ?? "general",
    language: "nl",
    supportLang: sl,
    generatedBy: "mock",
  };
}
