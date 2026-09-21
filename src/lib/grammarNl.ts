// ============================================================
// SOS Gramática data. `target` fields hold the course language:
// English in the English course, Dutch in the Dutch course.
// Explanations stay in Portuguese (it's a PT → target reference).
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

export const DUTCH_GRAMMAR_CLASSES: GrammarClass[] = [
  {
    number: 1,
    ptName: "Substantivo",
    targetName: "Zelfstandig naamwoord",
    definition:
      "Palavra que dá nome a pessoas, lugares, objetos, animais, sentimentos ou ideias. Em holandês, todo substantivo tem artigo: de ou het — aprenda sempre os dois juntos.",
    examples: [
      { pt: "a casa", target: "het huis" },
      { pt: "o amor", target: "de liefde" },
      { pt: "o estudante", target: "de student" },
    ],
    sentencePt: "O estudante comprou um livro.",
    sentenceTarget: "De student kocht een boek.",
  },
  {
    number: 2,
    ptName: "Pronome",
    targetName: "Voornaamwoord",
    definition: "Palavra usada no lugar de um substantivo para evitar repetição.",
    examples: [
      { pt: "eu", target: "ik" },
      { pt: "ele", target: "hij" },
      { pt: "eles / elas", target: "zij / ze" },
    ],
    sentencePt: "Maria é minha amiga. Ela é inteligente.",
    sentenceTarget: "Maria is mijn vriendin. Ze is slim.",
  },
  {
    number: 3,
    ptName: "Adjetivo",
    targetName: "Bijvoeglijk naamwoord",
    definition:
      "Palavra que descreve um substantivo. Antes do substantivo ganha -e (de grote stad), exceto com palavras 'het' no singular com 'een' (een groot huis).",
    examples: [
      { pt: "bonito", target: "mooi" },
      { pt: "grande", target: "groot" },
      { pt: "inteligente", target: "slim" },
    ],
    sentencePt: "Ela tem uma casa grande.",
    sentenceTarget: "Ze heeft een groot huis.",
  },
  {
    number: 4,
    ptName: "Verbo",
    targetName: "Werkwoord",
    definition:
      "Palavra que indica ação, estado ou acontecimento. Na frase principal, o verbo conjugado fica SEMPRE na segunda posição.",
    examples: [
      { pt: "correr", target: "rennen" },
      { pt: "estudar / aprender", target: "leren" },
      { pt: "ser / estar", target: "zijn" },
    ],
    sentencePt: "Eu estudo holandês todos os dias.",
    sentenceTarget: "Ik leer elke dag Nederlands.",
  },
  {
    number: 5,
    ptName: "Advérbio",
    targetName: "Bijwoord",
    definition:
      "Palavra que modifica um verbo, adjetivo ou outro advérbio. Se a frase começa com um advérbio, o verbo vem logo depois (inversão): Morgen ga ik…",
    examples: [
      { pt: "rapidamente", target: "snel" },
      { pt: "sempre", target: "altijd" },
      { pt: "muito", target: "heel / erg" },
    ],
    sentencePt: "Ela fala holandês muito bem.",
    sentenceTarget: "Ze spreekt heel goed Nederlands.",
  },
  {
    number: 6,
    ptName: "Artigo",
    targetName: "Lidwoord",
    definition:
      "Palavra que acompanha o substantivo. Holandês tem dois artigos definidos: de e het. No plural é sempre de.",
    examples: [
      { pt: "o, a, os, as", target: "de / het" },
      { pt: "um, uma", target: "een" },
    ],
    sentencePt: "Eu comprei um carro.",
    sentenceTarget: "Ik heb een auto gekocht.",
  },
  {
    number: 7,
    ptName: "Preposição",
    targetName: "Voorzetsel",
    definition: "Palavra que conecta termos e mostra relações como lugar, tempo ou direção.",
    examples: [
      { pt: "em", target: "in / op" },
      { pt: "com", target: "met" },
      { pt: "para", target: "naar / voor" },
    ],
    sentencePt: "O livro está na mesa.",
    sentenceTarget: "Het boek ligt op de tafel.",
  },
  {
    number: 8,
    ptName: "Conjunção",
    targetName: "Voegwoord",
    definition:
      "Palavra que liga palavras ou frases. Atenção: depois de omdat, dat, als e toen o verbo vai para o FINAL da frase.",
    examples: [
      { pt: "e", target: "en" },
      { pt: "mas", target: "maar" },
      { pt: "porque", target: "omdat / want" },
    ],
    sentencePt: "Eu estudo holandês porque gosto de idiomas.",
    sentenceTarget: "Ik leer Nederlands omdat ik talen leuk vind.",
  },
  {
    number: 9,
    ptName: "Interjeição",
    targetName: "Tussenwerpsel",
    definition: "Palavra que expressa emoção, reação ou sentimento.",
    examples: [
      { pt: "Uau!", target: "Wauw!" },
      { pt: "Ai!", target: "Au!" },
      { pt: "Olá!", target: "Hallo!" },
    ],
    sentencePt: "Uau! Que lugar bonito!",
    sentenceTarget: "Wauw! Wat een mooie plek!",
  },
  {
    number: 10,
    ptName: "Numeral",
    targetName: "Telwoord",
    definition: "Palavra que indica quantidade ou ordem.",
    examples: [
      { pt: "um", target: "één" },
      { pt: "dois", target: "twee" },
      { pt: "primeiro", target: "eerste" },
    ],
    sentencePt: "Tenho dois irmãos.",
    sentenceTarget: "Ik heb twee broers.",
  },
  {
    number: 11,
    ptName: "Verbo Auxiliar",
    targetName: "Hulpwerkwoord",
    definition:
      "Verbo que acompanha o verbo principal. Hebben e zijn formam o passado composto (ik heb gewerkt, ik ben gegaan). Os modais (kunnen, moeten, willen, mogen) mandam o outro verbo para o final no infinitivo.",
    examples: [
      { pt: "ter (passado composto)", target: "hebben" },
      { pt: "ser (passado de movimento/mudança)", target: "zijn" },
      { pt: "poder / conseguir", target: "kunnen" },
      { pt: "dever / precisar", target: "moeten" },
      { pt: "querer", target: "willen" },
      { pt: "vou / vai (futuro)", target: "gaan / zullen" },
    ],
    sentencePt: "Você pode me ajudar? Eu não entendo.",
    sentenceTarget: "Kun je me helpen? Ik begrijp het niet.",
  },
  {
    number: 12,
    ptName: "Verbos Irregulares",
    targetName: "Onregelmatige werkwoorden",
    definition:
      "Verbos que NÃO seguem a regra do passado com -te/-de. Cada um tem três formas próprias (infinitivo – passado – particípio) que precisam ser memorizadas. Os 15 abaixo aparecem em quase toda conversa.",
    examples: [
      { pt: "ser / estar", target: "zijn – was/waren – geweest" },
      { pt: "ter", target: "hebben – had/hadden – gehad" },
      { pt: "ir", target: "gaan – ging – gegaan" },
      { pt: "vir", target: "komen – kwam – gekomen" },
      { pt: "fazer", target: "doen – deed – gedaan" },
      { pt: "ver", target: "zien – zag – gezien" },
      { pt: "comer", target: "eten – at – gegeten" },
      { pt: "beber", target: "drinken – dronk – gedronken" },
      { pt: "dar", target: "geven – gaf – gegeven" },
      { pt: "pegar / levar", target: "nemen – nam – genomen" },
      { pt: "falar", target: "spreken – sprak – gesproken" },
      { pt: "ler", target: "lezen – las – gelezen" },
      { pt: "escrever", target: "schrijven – schreef – geschreven" },
      { pt: "encontrar / achar", target: "vinden – vond – gevonden" },
      { pt: "saber", target: "weten – wist – geweten" },
    ],
    sentencePt: "Ontem eu fui ao mercado e fiz o jantar.",
    sentenceTarget: "Gisteren ging ik naar de markt en maakte ik het avondeten.",
  },
];

export const DUTCH_GRAMMAR_SUMMARY: [string, string][] = [
  ["Substantivo", "Zelfstandig naamwoord"],
  ["Pronome", "Voornaamwoord"],
  ["Adjetivo", "Bijvoeglijk naamwoord"],
  ["Verbo", "Werkwoord"],
  ["Advérbio", "Bijwoord"],
  ["Artigo", "Lidwoord"],
  ["Preposição", "Voorzetsel"],
  ["Conjunção", "Voegwoord"],
  ["Interjeição", "Tussenwerpsel"],
  ["Numeral", "Telwoord"],
  ["Verbo Auxiliar", "Hulpwerkwoord"],
  ["Verbos Irregulares", "Onregelmatige werkwoorden"],
];
