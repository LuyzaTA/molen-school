"use client";

import { Card } from "@/components/ui/Card";
import { Flag, langFlag } from "@/components/ui/Flag";
import { ListenButton } from "@/components/class/ListenButton";
import { useSettings } from "@/context/SettingsContext";
import {
  DUTCH_GRAMMAR_CLASSES,
  DUTCH_GRAMMAR_COPY,
  type Bi,
  type GrammarClass,
} from "@/lib/grammarNl";

const GRAMMAR_CLASSES: GrammarClass[] = [
  {
    number: 1,
    ptName: "Substantivo",
    targetName: "Noun",
    definition: "Palavra que dá nome a pessoas, lugares, objetos, animais, sentimentos ou ideias.",
    examples: [
      { pt: "casa", target: "house" },
      { pt: "amor", target: "love" },
      { pt: "estudante", target: "student" },
    ],
    sentencePt: "O estudante comprou um livro.",
    sentenceTarget: "The student bought a book.",
  },
  {
    number: 2,
    ptName: "Pronome",
    targetName: "Pronoun",
    definition: "Palavra usada no lugar de um substantivo para evitar repetição.",
    examples: [
      { pt: "eu", target: "I" },
      { pt: "ele", target: "he" },
      { pt: "eles", target: "they" },
    ],
    sentencePt: "Maria é minha amiga. Ela é inteligente.",
    sentenceTarget: "Maria is my friend. She is intelligent.",
  },
  {
    number: 3,
    ptName: "Adjetivo",
    targetName: "Adjective",
    definition: "Palavra que descreve ou caracteriza um substantivo.",
    examples: [
      { pt: "bonito", target: "beautiful" },
      { pt: "grande", target: "big" },
      { pt: "inteligente", target: "intelligent" },
    ],
    sentencePt: "Ela tem uma casa grande.",
    sentenceTarget: "She has a big house.",
  },
  {
    number: 4,
    ptName: "Verbo",
    targetName: "Verb",
    definition: "Palavra que indica ação, estado ou acontecimento.",
    examples: [
      { pt: "correr", target: "run" },
      { pt: "estudar", target: "study" },
      { pt: "ser/estar", target: "be" },
    ],
    sentencePt: "Eu estudo inglês todos os dias.",
    sentenceTarget: "I study English every day.",
  },
  {
    number: 5,
    ptName: "Advérbio",
    targetName: "Adverb",
    definition: "Palavra que modifica um verbo, adjetivo ou outro advérbio. Indica como, quando, onde ou intensidade.",
    examples: [
      { pt: "rapidamente", target: "quickly" },
      { pt: "sempre", target: "always" },
      { pt: "muito", target: "very" },
    ],
    sentencePt: "Ela fala inglês muito bem.",
    sentenceTarget: "She speaks English very well.",
  },
  {
    number: 6,
    ptName: "Artigo",
    targetName: "Article",
    definition: "Palavra que acompanha o substantivo.",
    examples: [
      { pt: "o, a, os, as", target: "the" },
      { pt: "um, uma", target: "a / an" },
    ],
    sentencePt: "Eu comprei um carro.",
    sentenceTarget: "I bought a car.",
  },
  {
    number: 7,
    ptName: "Preposição",
    targetName: "Preposition",
    definition: "Palavra que conecta termos e mostra relações como lugar, tempo ou direção.",
    examples: [
      { pt: "em", target: "in / on / at" },
      { pt: "com", target: "with" },
      { pt: "para", target: "to / for" },
    ],
    sentencePt: "O livro está na mesa.",
    sentenceTarget: "The book is on the table.",
  },
  {
    number: 8,
    ptName: "Conjunção",
    targetName: "Conjunction",
    definition: "Palavra que liga palavras ou frases.",
    examples: [
      { pt: "e", target: "and" },
      { pt: "mas", target: "but" },
      { pt: "porque", target: "because" },
    ],
    sentencePt: "Eu estudo inglês porque gosto de idiomas.",
    sentenceTarget: "I study English because I like languages.",
  },
  {
    number: 9,
    ptName: "Interjeição",
    targetName: "Interjection",
    definition: "Palavra que expressa emoção, reação ou sentimento.",
    examples: [
      { pt: "Uau!", target: "Wow!" },
      { pt: "Ai!", target: "Ouch!" },
      { pt: "Olá!", target: "Hello!" },
    ],
    sentencePt: "Uau! Que lugar bonito!",
    sentenceTarget: "Wow! What a beautiful place!",
  },
  {
    number: 10,
    ptName: "Numeral",
    targetName: "Numeral",
    definition: "Palavra que indica quantidade ou ordem.",
    examples: [
      { pt: "um", target: "one" },
      { pt: "dois", target: "two" },
      { pt: "primeiro", target: "first" },
    ],
    sentencePt: "Tenho dois irmãos.",
    sentenceTarget: "I have two brothers.",
  },
  {
    number: 11,
    ptName: "Verbo Auxiliar",
    targetName: "Auxiliary Verb",
    definition: "Verbo que acompanha o verbo principal para formar tempos verbais, perguntas, negações ou expressar modalidade (possibilidade, obrigação, permissão). Em inglês, os auxiliares são essenciais e muito diferentes do português.",
    examples: [
      { pt: "ser/estar (presente)", target: "am / is / are" },
      { pt: "ter (passado/perfeito)", target: "have / has / had" },
      { pt: "fazer (perguntas/negação)", target: "do / does / did" },
      { pt: "poder / conseguir", target: "can / could" },
      { pt: "dever / precisar", target: "must / should / need" },
      { pt: "vou / vai (futuro)", target: "will / shall" },
    ],
    sentencePt: "Você pode me ajudar? Eu não entendo.",
    sentenceTarget: "Can you help me? I don't understand.",
  },
  {
    number: 12,
    ptName: "Verbos Irregulares",
    targetName: "Irregular Verbs",
    definition:
      "Verbos que NÃO seguem a regra do -ed no passado. Cada um tem três formas próprias (presente – passado – particípio) que precisam ser memorizadas. São os verbos mais usados do inglês — os 15 abaixo aparecem em quase toda conversa.",
    examples: [
      { pt: "ser / estar", target: "be – was/were – been" },
      { pt: "ter", target: "have – had – had" },
      { pt: "fazer", target: "do – did – done" },
      { pt: "dizer", target: "say – said – said" },
      { pt: "ir", target: "go – went – gone" },
      { pt: "conseguir / pegar", target: "get – got – gotten" },
      { pt: "fazer / criar", target: "make – made – made" },
      { pt: "saber / conhecer", target: "know – knew – known" },
      { pt: "pensar", target: "think – thought – thought" },
      { pt: "pegar / levar", target: "take – took – taken" },
      { pt: "ver", target: "see – saw – seen" },
      { pt: "vir", target: "come – came – come" },
      { pt: "dar", target: "give – gave – given" },
      { pt: "encontrar / achar", target: "find – found – found" },
      { pt: "contar / dizer", target: "tell – told – told" },
    ],
    sentencePt: "Ontem eu fui ao mercado e fiz o jantar.",
    sentenceTarget: "Yesterday I went to the market and made dinner.",
  },
];

const SUMMARY: [string, string][] = [
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
  ["Verbos Irregulares", "Irregular Verbs"],
];

export default function SosGramaticaPage() {
  const { profile } = useSettings();
  if (profile.language === "nl") return <DutchGrammar />;
  return <EnglishGrammar />;
}

/** English course: Portuguese → English reference (explanations in Portuguese). */
function EnglishGrammar() {
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
                <p className="mt-0.5 text-lg font-bold text-accent">{g.targetName}</p>
              </div>
              <NumberBadge n={g.number} />
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
                    <span className="font-semibold text-accent">{ex.target}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Example sentences */}
            <div className="space-y-1 border-t border-border pt-3">
              <p className="flex items-start gap-1.5 text-sm text-ink-muted">
                <Flag code="br" width={16} className="mt-[3px]" /> {g.sentencePt}
              </p>
              <p className="flex items-start gap-1.5 text-sm font-medium text-ink">
                <Flag code="gb" width={16} className="mt-[3px]" /> {g.sentenceTarget}
              </p>
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

/**
 * Dutch course: explanations in the support language chosen at sign-in
 * (English or Portuguese); only the Dutch words and sentences get audio.
 */
function DutchGrammar() {
  const { profile } = useSettings();
  const sl = profile.supportLang;
  const tr = (b: Bi) => (sl === "pt" ? b.pt : b.en);
  const c = DUTCH_GRAMMAR_COPY;

  return (
    <div className="mx-auto max-w-wide space-y-8">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{tr(c.eyebrow)}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">SOS Gramática</h1>
        <p className="mt-2 text-[15px] text-ink-muted">{tr(c.intro)}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {DUTCH_GRAMMAR_CLASSES.map((g) => (
          <Card key={g.number} className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                  {g.number}. {tr(g.name)}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-lg font-bold text-accent">
                  {g.nl}
                  <ListenButton text={g.nl} />
                </p>
              </div>
              <NumberBadge n={g.number} />
            </div>

            {/* Definition */}
            <p className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">{tr(c.whatIs)}</span>
              {tr(g.definition)}
            </p>

            {/* Examples */}
            <div className="rounded-lg border border-border bg-base/50 px-3 py-2">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                {tr(c.examples)}
              </p>
              <div className="space-y-1">
                {g.examples.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-ink">{tr(ex.source)}</span>
                    <span className="text-ink-subtle">→</span>
                    <span className="font-semibold text-accent">{ex.nl}</span>
                    <ListenButton text={ex.nl} className="h-6 w-6" />
                  </div>
                ))}
              </div>
            </div>

            {/* Example sentences */}
            <div className="space-y-1 border-t border-border pt-3">
              <p className="flex items-start gap-1.5 text-sm text-ink-muted">
                <Flag code={langFlag(sl)} width={16} className="mt-[3px]" /> {tr(g.sentence)}
              </p>
              <div className="flex items-start gap-1.5 text-sm font-medium text-ink">
                <Flag code="nl" width={16} className="mt-[3px]" />
                <span className="flex-1">{g.sentenceNl}</span>
                <ListenButton text={g.sentenceNl} className="-mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary table */}
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">{tr(c.summaryTitle)}</h2>
          <p className="mt-1 text-sm text-ink-muted">{tr(c.summaryText)}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left font-semibold text-ink">{tr(c.sourceColumn)}</th>
                <th className="pb-2 text-left font-semibold text-accent">Nederlands</th>
              </tr>
            </thead>
            <tbody>
              {DUTCH_GRAMMAR_CLASSES.map((g) => (
                <tr key={g.number} className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-ink-muted">{tr(g.name)}</td>
                  <td className="py-2 font-medium text-ink">
                    <span className="inline-flex items-center gap-2">
                      {g.nl}
                      <ListenButton text={g.nl} className="h-6 w-6" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
      {n}
    </span>
  );
}
