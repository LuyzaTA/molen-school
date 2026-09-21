"use client";

import { useState } from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Flag, langFlag } from "@/components/ui/Flag";
import { ListenButton } from "@/components/class/ListenButton";
import { cn } from "@/lib/cn";
import {
  EXAM_PARTS,
  REQUIRED_BY_DATE,
  KNM_THEMES,
  KNM_TOPIC_PREFIX,
  KNM_QUIZ,
  PRACTICAL,
  OFFICIAL_LINKS,
  INBURGEREN_SOURCE,
  type Bilingual,
} from "@/lib/inburgeren";

/** Link that opens the class builder straight on an exam-prep topic. */
function classHref(topic: string) {
  return `/class?topic=${encodeURIComponent(topic)}`;
}

export default function InburgerenPage() {
  const { profile, switchLanguage } = useSettings();
  const sl = profile.supportLang;
  const tr = (b: Bilingual) => (sl === "pt" ? b.pt : b.en);

  if (profile.language !== "nl") {
    return (
      <div className="mx-auto max-w-content py-10">
        <Card className="space-y-3 text-center">
          <div className="text-4xl">🏛️</div>
          <h1 className="text-xl font-bold text-ink">Inburgeren is part of the Dutch course</h1>
          <p className="text-[15px] text-ink-muted">
            Switch to Molen Dutch Classes to prepare for the Dutch civic integration exam.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => switchLanguage("nl")}>
              <Flag code="nl" width={18} className="mr-2" /> Switch to Dutch
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content space-y-8">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Inburgeringsexamen
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Civic integration exam
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          {tr({
            en: "Everything you need to prepare for inburgeren: what each exam looks like, which exams apply to you, and practice classes built around the exam. You need to pass the language exams at level A2 or higher.",
            pt: "Tudo para se preparar para o inburgeren: como é cada exame, quais exames se aplicam a você e aulas práticas voltadas para o exame. É preciso passar nos exames de língua no nível A2 ou superior.",
          })}
        </p>
      </header>

      {/* Which exams */}
      <Card>
        <SectionHeading
          title="Which exams do you take?"
          description={tr({
            en: "It depends on when your integration requirement started. Your own list is in Mijn Inburgering — some people take fewer exams (illness, disability, existing diplomas).",
            pt: "Depende de quando começou a sua obrigação de integração. A sua lista está no Mijn Inburgering — algumas pessoas fazem menos exames (doença, deficiência, diplomas).",
          })}
        />
        <div className="space-y-3">
          {REQUIRED_BY_DATE.map((row) => (
            <div key={row.since.en} className="rounded-xl border border-border bg-surface p-3">
              <p className="text-sm font-semibold text-ink">{tr(row.since)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {row.parts.map((code) => {
                  const part = EXAM_PARTS.find((p) => p.code === code)!;
                  return <Badge key={code} tone="neutral">{part.nl}</Badge>;
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Exam parts */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">The exam parts</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {EXAM_PARTS.map((part) => (
            <Card key={part.code} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-ink">{part.nl}</p>
                  <p className="text-sm text-ink-subtle">{tr(part.name)}</p>
                </div>
                <Badge tone="accent">{part.code}</Badge>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{tr(part.what)}</p>
              <p className="mt-2 rounded-lg bg-accent-soft px-3 py-2 text-xs text-ink-muted">
                {tr(part.format)}
              </p>
              {part.practiceTopic && (
                <Link
                  href={classHref(part.practiceTopic)}
                  className="mt-auto pt-4 text-sm font-semibold text-accent hover:underline"
                >
                  Practise in a class →
                </Link>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* KNM themes */}
      <Card>
        <SectionHeading
          title="KNM themes — practice classes"
          description={tr({
            en: "Each class teaches the Dutch words and facts for one theme of Dutch society, with the usual story, speaking, and self-check steps.",
            pt: "Cada aula ensina as palavras e os fatos de um tema da sociedade holandesa, com a história, a fala e a autoavaliação de sempre.",
          })}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {KNM_THEMES.map((t) => (
            <Link
              key={t.nl}
              href={classHref(KNM_TOPIC_PREFIX + t.nl)}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 transition-colors hover:border-accent/60 hover:bg-accent-soft/50"
            >
              <span>
                <span className="block text-sm font-semibold text-ink">{t.nl}</span>
                <span className="block text-xs text-ink-subtle">{tr(t.name)}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-accent">Class →</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* KNM quiz */}
      <KnmQuiz tr={tr} flag={langFlag(sl)} />

      {/* Practical */}
      <Card>
        <SectionHeading title="Registering, dates, and results" />
        <ul className="space-y-2">
          {PRACTICAL.map((p) => (
            <li key={p.en} className="flex items-start gap-2.5 text-sm text-ink-muted">
              <span className="mt-0.5 shrink-0 text-accent">•</span>
              {tr(p)}
            </li>
          ))}
        </ul>
      </Card>

      {/* Official links */}
      <Card>
        <SectionHeading
          title="Official practice & information"
          description={tr({
            en: "DUO's free practice exams are the best way to see the real screens. A desktop computer works best (the Speaking practice exam does not work in Safari).",
            pt: "Os simulados gratuitos do DUO são a melhor forma de ver as telas reais. Um computador funciona melhor (o simulado de Fala não funciona no Safari).",
          })}
        />
        <ul className="space-y-2">
          {OFFICIAL_LINKS.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent hover:underline"
              >
                {tr(l.label)} ↗
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-center text-xs text-ink-subtle">
        Source:{" "}
        <a href={INBURGEREN_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">
          inburgeren.nl (DUO)
        </a>
        , checked September 2026. Rules and fees can change — always confirm in Mijn Inburgering.
      </p>
    </div>
  );
}

function KnmQuiz({ tr, flag }: { tr: (b: Bilingual) => string; flag: ReturnType<typeof langFlag> }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const answered = Object.keys(picked).length;
  const correct = KNM_QUIZ.filter((q, i) => picked[i] === q.answer).length;

  return (
    <Card>
      <SectionHeading
        title="KNM practice quiz"
        description={tr({
          en: "Short questions in simple Dutch, like the KNM exam. Tap an answer to see the explanation.",
          pt: "Perguntas curtas em holandês simples, como no exame KNM. Toque numa resposta para ver a explicação.",
        })}
      />
      <ol className="space-y-4">
        {KNM_QUIZ.map((q, i) => {
          const choice = picked[i];
          const done = choice !== undefined;
          return (
            <li key={i} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <Badge tone="neutral">{q.theme}</Badge>
                <span className="text-xs text-ink-subtle">{i + 1}/{KNM_QUIZ.length}</span>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <p className="flex-1 font-semibold text-ink">{q.question}</p>
                <ListenButton text={q.question} />
              </div>
              <p className="mt-1 flex items-start gap-1.5 text-sm italic text-ink-subtle">
                <Flag code={flag} width={16} className="mt-[3px]" />
                {tr(q.translation)}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const isAnswer = oi === q.answer;
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={done}
                      onClick={() => setPicked((p) => ({ ...p, [i]: oi }))}
                      className={cn(
                        "rounded-lg border px-3.5 py-2 text-left text-sm font-medium transition-colors",
                        done && isAnswer && "border-success bg-success/10 text-success",
                        done && !isAnswer && choice === oi && "border-warning/60 bg-warning/10 text-ink-subtle line-through",
                        done && !isAnswer && choice !== oi && "border-border text-ink-subtle",
                        !done && "border-border bg-surface text-ink hover:border-accent",
                      )}
                    >
                      {opt}
                      {done && isAnswer ? "  ✓" : ""}
                    </button>
                  );
                })}
              </div>
              {done && (
                <p className="mt-2.5 text-sm text-ink-muted">{tr(q.explain)}</p>
              )}
            </li>
          );
        })}
      </ol>
      {answered > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">
            {correct} / {answered} correct
          </p>
          <button
            type="button"
            onClick={() => setPicked({})}
            className="text-sm font-medium text-ink-muted hover:text-ink hover:underline"
          >
            Start again
          </button>
        </div>
      )}
    </Card>
  );
}
