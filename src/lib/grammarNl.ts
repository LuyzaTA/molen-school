// ============================================================
// SOS Gramática data. `target` fields hold the course language.
//
// English course: explanations in Portuguese (a PT → English reference).
// Dutch course: every explanation exists in both support languages
// (`pt` / `en`), and the page shows the one the learner chose.
// ============================================================

export interface GrammarClass {
  number: number;
  ptName: string;
  targetName: string;
  definition: string;
  examples: { pt: string; target: string }[];
  sentencePt: string;
  sentenceTarget: string;
}

/** Text in both support languages of the Dutch course. */
export interface Bi {
  pt: string;
  en: string;
}

export interface DutchGrammarClass {
  number: number;
  name: Bi; // the word class, in the support language
  nl: string; // Dutch term
  definition: Bi;
  examples: { source: Bi; nl: string }[];
  sentence: Bi;
  sentenceNl: string;
}

export const DUTCH_GRAMMAR_CLASSES: DutchGrammarClass[] = [
  {
    number: 1,
    name: { pt: "Substantivo", en: "Noun" },
    nl: "Zelfstandig naamwoord",
    definition: {
      pt: "Palavra que dá nome a pessoas, lugares, objetos, animais, sentimentos ou ideias. Em holandês, todo substantivo tem artigo: de ou het — aprenda sempre os dois juntos.",
      en: "A word that names people, places, things, animals, feelings or ideas. In Dutch every noun has an article, de or het — always learn them together.",
    },
    examples: [
      { source: { pt: "a casa", en: "the house" }, nl: "het huis" },
      { source: { pt: "o amor", en: "love" }, nl: "de liefde" },
      { source: { pt: "o estudante", en: "the student" }, nl: "de student" },
    ],
    sentence: { pt: "O estudante comprou um livro.", en: "The student bought a book." },
    sentenceNl: "De student kocht een boek.",
  },
  {
    number: 2,
    name: { pt: "Pronome", en: "Pronoun" },
    nl: "Voornaamwoord",
    definition: {
      pt: "Palavra usada no lugar de um substantivo para evitar repetição.",
      en: "A word used instead of a noun, to avoid repeating it.",
    },
    examples: [
      { source: { pt: "eu", en: "I" }, nl: "ik" },
      { source: { pt: "ele", en: "he" }, nl: "hij" },
      { source: { pt: "eles / elas", en: "they" }, nl: "zij / ze" },
    ],
    sentence: { pt: "Maria é minha amiga. Ela é inteligente.", en: "Maria is my friend. She is clever." },
    sentenceNl: "Maria is mijn vriendin. Ze is slim.",
  },
  {
    number: 3,
    name: { pt: "Adjetivo", en: "Adjective" },
    nl: "Bijvoeglijk naamwoord",
    definition: {
      pt: "Palavra que descreve um substantivo. Antes do substantivo ganha -e (de grote stad), exceto com palavras 'het' no singular com 'een' (een groot huis).",
      en: "A word that describes a noun. Before the noun it takes -e (de grote stad), except with singular 'het' words after 'een' (een groot huis).",
    },
    examples: [
      { source: { pt: "bonito", en: "beautiful" }, nl: "mooi" },
      { source: { pt: "grande", en: "big" }, nl: "groot" },
      { source: { pt: "inteligente", en: "clever" }, nl: "slim" },
    ],
    sentence: { pt: "Ela tem uma casa grande.", en: "She has a big house." },
    sentenceNl: "Ze heeft een groot huis.",
  },
  {
    number: 4,
    name: { pt: "Verbo", en: "Verb" },
    nl: "Werkwoord",
    definition: {
      pt: "Palavra que indica ação, estado ou acontecimento. Na frase principal, o verbo conjugado fica SEMPRE na segunda posição.",
      en: "A word for an action, state or event. In a main clause the conjugated verb ALWAYS comes in second position.",
    },
    examples: [
      { source: { pt: "correr", en: "to run" }, nl: "rennen" },
      { source: { pt: "estudar / aprender", en: "to study / to learn" }, nl: "leren" },
      { source: { pt: "ser / estar", en: "to be" }, nl: "zijn" },
    ],
    sentence: { pt: "Eu estudo holandês todos os dias.", en: "I study Dutch every day." },
    sentenceNl: "Ik leer elke dag Nederlands.",
  },
  {
    number: 5,
    name: { pt: "Advérbio", en: "Adverb" },
    nl: "Bijwoord",
    definition: {
      pt: "Palavra que modifica um verbo, adjetivo ou outro advérbio. Se a frase começa com um advérbio, o verbo vem logo depois (inversão): Morgen ga ik…",
      en: "A word that modifies a verb, adjective or another adverb. If a sentence starts with an adverb, the verb comes straight after it (inversion): Morgen ga ik…",
    },
    examples: [
      { source: { pt: "rapidamente", en: "quickly" }, nl: "snel" },
      { source: { pt: "sempre", en: "always" }, nl: "altijd" },
      { source: { pt: "muito", en: "very" }, nl: "heel / erg" },
    ],
    sentence: { pt: "Ela fala holandês muito bem.", en: "She speaks Dutch very well." },
    sentenceNl: "Ze spreekt heel goed Nederlands.",
  },
  {
    number: 6,
    name: { pt: "Artigo", en: "Article" },
    nl: "Lidwoord",
    definition: {
      pt: "Palavra que acompanha o substantivo. Holandês tem dois artigos definidos: de e het. No plural é sempre de.",
      en: "A word that goes with a noun. Dutch has two definite articles, de and het. In the plural it is always de.",
    },
    examples: [
      { source: { pt: "o, a, os, as", en: "the" }, nl: "de / het" },
      { source: { pt: "um, uma", en: "a / an" }, nl: "een" },
    ],
    sentence: { pt: "Eu comprei um carro.", en: "I bought a car." },
    sentenceNl: "Ik heb een auto gekocht.",
  },
  {
    number: 7,
    name: { pt: "Preposição", en: "Preposition" },
    nl: "Voorzetsel",
    definition: {
      pt: "Palavra que conecta termos e mostra relações como lugar, tempo ou direção.",
      en: "A word that links words and shows relations such as place, time or direction.",
    },
    examples: [
      { source: { pt: "em", en: "in / on" }, nl: "in / op" },
      { source: { pt: "com", en: "with" }, nl: "met" },
      { source: { pt: "para", en: "to / for" }, nl: "naar / voor" },
    ],
    sentence: { pt: "O livro está na mesa.", en: "The book is on the table." },
    sentenceNl: "Het boek ligt op de tafel.",
  },
  {
    number: 8,
    name: { pt: "Conjunção", en: "Conjunction" },
    nl: "Voegwoord",
    definition: {
      pt: "Palavra que liga palavras ou frases. Atenção: depois de omdat, dat, als e toen o verbo vai para o FINAL da frase.",
      en: "A word that joins words or clauses. Watch out: after omdat, dat, als and toen the verb goes to the END of the clause.",
    },
    examples: [
      { source: { pt: "e", en: "and" }, nl: "en" },
      { source: { pt: "mas", en: "but" }, nl: "maar" },
      { source: { pt: "porque", en: "because" }, nl: "omdat / want" },
    ],
    sentence: {
      pt: "Eu estudo holandês porque gosto de idiomas.",
      en: "I study Dutch because I like languages.",
    },
    sentenceNl: "Ik leer Nederlands omdat ik talen leuk vind.",
  },
  {
    number: 9,
    name: { pt: "Interjeição", en: "Interjection" },
    nl: "Tussenwerpsel",
    definition: {
      pt: "Palavra que expressa emoção, reação ou sentimento.",
      en: "A word that expresses emotion, reaction or feeling.",
    },
    examples: [
      { source: { pt: "Uau!", en: "Wow!" }, nl: "Wauw!" },
      { source: { pt: "Ai!", en: "Ouch!" }, nl: "Au!" },
      { source: { pt: "Olá!", en: "Hello!" }, nl: "Hallo!" },
    ],
    sentence: { pt: "Uau! Que lugar bonito!", en: "Wow! What a beautiful place!" },
    sentenceNl: "Wauw! Wat een mooie plek!",
  },
  {
    number: 10,
    name: { pt: "Numeral", en: "Numeral" },
    nl: "Telwoord",
    definition: {
      pt: "Palavra que indica quantidade ou ordem.",
      en: "A word that shows quantity or order.",
    },
    examples: [
      { source: { pt: "um", en: "one" }, nl: "één" },
      { source: { pt: "dois", en: "two" }, nl: "twee" },
      { source: { pt: "primeiro", en: "first" }, nl: "eerste" },
    ],
    sentence: { pt: "Tenho dois irmãos.", en: "I have two brothers." },
    sentenceNl: "Ik heb twee broers.",
  },
  {
    number: 11,
    name: { pt: "Verbo Auxiliar", en: "Auxiliary Verb" },
    nl: "Hulpwerkwoord",
    definition: {
      pt: "Verbo que acompanha o verbo principal. Hebben e zijn formam o passado composto (ik heb gewerkt, ik ben gegaan). Os modais (kunnen, moeten, willen, mogen) mandam o outro verbo para o final no infinitivo.",
      en: "A verb that goes with the main verb. Hebben and zijn form the perfect tense (ik heb gewerkt, ik ben gegaan). Modal verbs (kunnen, moeten, willen, mogen) send the other verb to the end as an infinitive.",
    },
    examples: [
      { source: { pt: "ter (passado composto)", en: "to have (perfect tense)" }, nl: "hebben" },
      { source: { pt: "ser (passado de movimento/mudança)", en: "to be (perfect of movement/change)" }, nl: "zijn" },
      { source: { pt: "poder / conseguir", en: "can / to be able to" }, nl: "kunnen" },
      { source: { pt: "dever / precisar", en: "must / to have to" }, nl: "moeten" },
      { source: { pt: "querer", en: "to want" }, nl: "willen" },
      { source: { pt: "vou / vai (futuro)", en: "going to / will (future)" }, nl: "gaan / zullen" },
    ],
    sentence: { pt: "Você pode me ajudar? Eu não entendo.", en: "Can you help me? I don't understand." },
    sentenceNl: "Kun je me helpen? Ik begrijp het niet.",
  },
  {
    number: 12,
    name: { pt: "Verbos Irregulares", en: "Irregular Verbs" },
    nl: "Onregelmatige werkwoorden",
    definition: {
      pt: "Verbos que NÃO seguem a regra do passado com -te/-de. Cada um tem três formas próprias (infinitivo – passado – particípio) que precisam ser memorizadas. Os 15 abaixo aparecem em quase toda conversa.",
      en: "Verbs that DON'T follow the -te/-de past-tense rule. Each has three forms of its own (infinitive – past – participle) to memorise. The 15 below come up in almost every conversation.",
    },
    examples: [
      { source: { pt: "ser / estar", en: "to be" }, nl: "zijn – was/waren – geweest" },
      { source: { pt: "ter", en: "to have" }, nl: "hebben – had/hadden – gehad" },
      { source: { pt: "ir", en: "to go" }, nl: "gaan – ging – gegaan" },
      { source: { pt: "vir", en: "to come" }, nl: "komen – kwam – gekomen" },
      { source: { pt: "fazer", en: "to do" }, nl: "doen – deed – gedaan" },
      { source: { pt: "ver", en: "to see" }, nl: "zien – zag – gezien" },
      { source: { pt: "comer", en: "to eat" }, nl: "eten – at – gegeten" },
      { source: { pt: "beber", en: "to drink" }, nl: "drinken – dronk – gedronken" },
      { source: { pt: "dar", en: "to give" }, nl: "geven – gaf – gegeven" },
      { source: { pt: "pegar / levar", en: "to take" }, nl: "nemen – nam – genomen" },
      { source: { pt: "falar", en: "to speak" }, nl: "spreken – sprak – gesproken" },
      { source: { pt: "ler", en: "to read" }, nl: "lezen – las – gelezen" },
      { source: { pt: "escrever", en: "to write" }, nl: "schrijven – schreef – geschreven" },
      { source: { pt: "encontrar / achar", en: "to find" }, nl: "vinden – vond – gevonden" },
      { source: { pt: "saber", en: "to know" }, nl: "weten – wist – geweten" },
    ],
    sentence: {
      pt: "Ontem eu fui ao mercado e fiz o jantar.",
      en: "Yesterday I went to the market and made dinner.",
    },
    sentenceNl: "Gisteren ging ik naar de markt en maakte ik het avondeten.",
  },
];

/** Page copy for the Dutch version, in both support languages. */
export const DUTCH_GRAMMAR_COPY = {
  eyebrow: { pt: "Referência rápida", en: "Quick reference" },
  intro: {
    pt: "Principais classes gramaticais do Português → Holandês. Um guia rápido para revisar a estrutura das frases. Toque em 🔊 para ouvir o holandês.",
    en: "The main word classes, English → Dutch. A quick guide to review sentence structure. Tap 🔊 to hear the Dutch.",
  },
  whatIs: { pt: "O que é: ", en: "What it is: " },
  examples: { pt: "Exemplos", en: "Examples" },
  summaryTitle: { pt: "Resumo Rápido", en: "Quick Summary" },
  summaryText: {
    pt: "Para aprender holandês, entender essas classes ajuda a identificar a função de cada palavra dentro da frase.",
    en: "When learning Dutch, knowing these classes helps you see what each word does in a sentence.",
  },
  sourceColumn: { pt: "Português", en: "English" },
} satisfies Record<string, Bi>;
