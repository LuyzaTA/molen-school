import { Card } from "@/components/ui/Card";

interface GrammarClass {
  number: number;
  ptName: string;
  enName: string;
  definition: string;
  examples: { pt: string; en: string }[];
  sentencePt: string;
  sentenceEn: string;
}

const GRAMMAR_CLASSES: GrammarClass[] = [
  {
    number: 1,
    ptName: "Substantivo",
    enName: "Noun",
    definition: "Palavra que dá nome a pessoas, lugares, objetos, animais, sentimentos ou ideias.",
    examples: [
      { pt: "casa", en: "house" },
      { pt: "amor", en: "love" },
      { pt: "estudante", en: "student" },
    ],
    sentencePt: "O estudante comprou um livro.",
    sentenceEn: "The student bought a book.",
  },
  {
    number: 2,
    ptName: "Pronome",
    enName: "Pronoun",
    definition: "Palavra usada no lugar de um substantivo para evitar repetição.",
    examples: [
      { pt: "eu", en: "I" },
      { pt: "ele", en: "he" },
      { pt: "eles", en: "they" },
    ],
    sentencePt: "Maria é minha amiga. Ela é inteligente.",
    sentenceEn: "Maria is my friend. She is intelligent.",
  },
  {
    number: 3,
    ptName: "Adjetivo",
    enName: "Adjective",
    definition: "Palavra que descreve ou caracteriza um substantivo.",
    examples: [
      { pt: "bonito", en: "beautiful" },
      { pt: "grande", en: "big" },
      { pt: "inteligente", en: "intelligent" },
    ],
    sentencePt: "Ela tem uma casa grande.",
    sentenceEn: "She has a big house.",
  },
  {
    number: 4,
    ptName: "Verbo",
    enName: "Verb",
    definition: "Palavra que indica ação, estado ou acontecimento.",
    examples: [
      { pt: "correr", en: "run" },
      { pt: "estudar", en: "study" },
      { pt: "ser/estar", en: "be" },
    ],
    sentencePt: "Eu estudo inglês todos os dias.",
    sentenceEn: "I study English every day.",
  },
  {
    number: 5,
    ptName: "Advérbio",
    enName: "Adverb",
    definition: "Palavra que modifica um verbo, adjetivo ou outro advérbio. Indica como, quando, onde ou intensidade.",
    examples: [
      { pt: "rapidamente", en: "quickly" },
      { pt: "sempre", en: "always" },
      { pt: "muito", en: "very" },
    ],
    sentencePt: "Ela fala inglês muito bem.",
    sentenceEn: "She speaks English very well.",
  },
  {
    number: 6,
    ptName: "Artigo",
    enName: "Article",
    definition: "Palavra que acompanha o substantivo.",
    examples: [
      { pt: "o, a, os, as", en: "the" },
      { pt: "um, uma", en: "a / an" },
    ],
    sentencePt: "Eu comprei um carro.",
    sentenceEn: "I bought a car.",
  },
  {
    number: 7,
    ptName: "Preposição",
    enName: "Preposition",
    definition: "Palavra que conecta termos e mostra relações como lugar, tempo ou direção.",
    examples: [
      { pt: "em", en: "in / on / at" },
      { pt: "com", en: "with" },
      { pt: "para", en: "to / for" },
    ],
    sentencePt: "O livro está na mesa.",
    sentenceEn: "The book is on the table.",
  },
  {
    number: 8,
    ptName: "Conjunção",
    enName: "Conjunction",
    definition: "Palavra que liga palavras ou frases.",
    examples: [
      { pt: "e", en: "and" },
      { pt: "mas", en: "but" },
      { pt: "porque", en: "because" },
    ],
    sentencePt: "Eu estudo inglês porque gosto de idiomas.",
    sentenceEn: "I study English because I like languages.",
  },
  {
    number: 9,
    ptName: "Interjeição",
    enName: "Interjection",
    definition: "Palavra que expressa emoção, reação ou sentimento.",
    examples: [
      { pt: "Uau!", en: "Wow!" },
      { pt: "Ai!", en: "Ouch!" },
      { pt: "Olá!", en: "Hello!" },
    ],
    sentencePt: "Uau! Que lugar bonito!",
    sentenceEn: "Wow! What a beautiful place!",
  },
  {
    number: 10,
    ptName: "Numeral",
    enName: "Numeral",
    definition: "Palavra que indica quantidade ou ordem.",
    examples: [
      { pt: "um", en: "one" },
      { pt: "dois", en: "two" },
      { pt: "primeiro", en: "first" },
    ],
    sentencePt: "Tenho dois irmãos.",
    sentenceEn: "I have two brothers.",
  },
  {
    number: 11,
    ptName: "Verbo Auxiliar",
    enName: "Auxiliary Verb",
    definition: "Verbo que acompanha o verbo principal para formar tempos verbais, perguntas, negações ou expressar modalidade (possibilidade, obrigação, permissão). Em inglês, os auxiliares são essenciais e muito diferentes do português.",
    examples: [
      { pt: "ser/estar (presente)", en: "am / is / are" },
      { pt: "ter (passado/perfeito)", en: "have / has / had" },
      { pt: "fazer (perguntas/negação)", en: "do / does / did" },
      { pt: "poder / conseguir", en: "can / could" },
      { pt: "dever / precisar", en: "must / should / need" },
      { pt: "vou / vai (futuro)", en: "will / shall" },
    ],
    sentencePt: "Você pode me ajudar? Eu não entendo.",
    sentenceEn: "Can you help me? I don't understand.",
  },
];

const SUMMARY = [
  ["Substantivo", "Noun"],
  ["Pronome", "Pronoun"],
  ["Adjetivo", "Adjective"],
  ["Verbo", "Verb"],
  ["Advérbio", "Adverb"],
  ["Artigo", "Article"],
  ["Preposição", "Preposition"],
  ["Conjunção", "Conjunction"],
  ["Interjeição", "Interjection"],
  ["Numeral", "Numeral"],
  ["Verbo Auxiliar", "Auxiliary Verb"],
];

export default function SosGramaticaPage() {
  return (
    <div className="mx-auto max-w-wide space-y-8">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Referência rápida</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">SOS Gramática</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Principais classes gramaticais do Português → Inglês. Um guia rápido para revisar a estrutura das frases.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {GRAMMAR_CLASSES.map((g) => (
          <Card key={g.number} className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                  {g.number}. {g.ptName}
                </p>
                <p className="mt-0.5 text-lg font-bold text-accent">{g.enName}</p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                {g.number}
              </span>
            </div>

            {/* Definition */}
            <p className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">O que é: </span>
              {g.definition}
            </p>

            {/* Examples */}
            <div className="rounded-lg border border-border bg-base/50 px-3 py-2">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-subtle">Exemplos</p>
              <div className="space-y-1">
                {g.examples.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-ink">{ex.pt}</span>
                    <span className="text-ink-subtle">→</span>
                    <span className="font-semibold text-accent">{ex.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Example sentences */}
            <div className="space-y-1 border-t border-border pt-3">
              <p className="text-sm text-ink-muted">🇧🇷 {g.sentencePt}</p>
              <p className="text-sm font-medium text-ink">🇬🇧 {g.sentenceEn}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary table */}
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Resumo Rápido</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Para aprender inglês, entender essas classes ajuda a identificar a função de cada palavra dentro da frase.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left font-semibold text-ink">Português</th>
                <th className="pb-2 text-left font-semibold text-accent">English</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY.map(([pt, en], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-ink-muted">{pt}</td>
                  <td className="py-2 font-medium text-ink">{en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
