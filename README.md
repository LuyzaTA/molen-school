# Molen English School

A speaking-first English-learning web app for Brazilian learners, built for
Molen English School. The core idea: learners already **understand** English but
**freeze when speaking**, so the app inverts the usual model — speaking is the
spine of every lesson.

## Highlights

- **Daily Class engine** — pick any topic (presets or free-text / special-interest
  deep dives) and get a 45–60 min speaking class generated for your level,
  delivered as a 5-step stepper: Warm-up → Target Language → Guided Production →
  Free Production → Delayed Feedback. Speaking ratio rises with CEFR level
  (A1 40% → C2 85%).
- **Autistic / Calm mode** — a persistent global toggle that *changes behaviour*,
  not just looks: lower-contrast, lower-saturation palette, zero animation, the
  full agenda shown before each lesson, idioms flagged and explained literally,
  concrete feedback, built-in processing time, a written prompt alongside every
  spoken one, a predictable speaking order, and a "you may pass" affordance
  everywhere.
- **Homework** — auto-generated each day across all four skills (record a voice
  note via MediaRecorder, listen + answer, read + mine words, write reusing the
  day's vocabulary). Completion is tracked.
- **Meetings** — monthly Conversation Circles with speaker badges, prep packs
  that unlock 48h before, and an on-demand 1:1 / small-group booking list (mock
  data in v1).
- **Resources** — searchable, categorised library of free podcasts, platforms,
  and native-practice communities.
- **Progress** — streak, classes, words learned, homework, meetings — calm
  visuals, no pressure framing.
- **Accessibility** — WCAG-minded, keyboard-navigable, `prefers-reduced-motion`
  respected, a dyslexia-friendly font toggle, light/dark themes.

## Tech stack

- **Next.js (App Router)** + React + TypeScript
- **Tailwind CSS** with a CSS-variable design system (themes swap at runtime via
  `data-*` attributes on `<html>`)
- **localStorage** for all persistence (typed helpers in `src/lib/storage.ts`) —
  structured so a backend can replace them later
- **Anthropic API** (`claude-sonnet-4-6`) for class generation, called from a
  server route so the key never reaches the browser
- Deploy target: **Vercel**

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — add ANTHROPIC_API_KEY for live classes
npm run dev
```

Open http://localhost:3000. On first load you'll go through onboarding (name,
CEFR level, Calm mode, font), then land on the dashboard.

> **No API key?** The app still works fully — `/api/generate-class` returns a
> deterministic sample class so you can demo every screen offline.

## How AI class generation works

```
TopicPicker → generateClass() ──► POST /api/generate-class ──► Anthropic Messages API
   (UI)        (lib/classGenerator)      (server route)          (claude-sonnet-4-6,
                     │                                            structured JSON output)
                     └── on any failure / no key ──► buildMockClass() (deterministic)
```

- `src/lib/prompts.ts` builds the system prompt (level-scaled, Calm-mode aware,
  spiral-review aware) and the JSON schema for structured output.
- `src/lib/classGenerator.ts` is the single swappable entry point the UI calls —
  the model, route, or fallback can all change without touching components.
- The route reads `ANTHROPIC_API_KEY` from the environment only.

## Project structure

```
src/
├── app/                 routes: onboarding, /, class, homework, meetings,
│                        resources, progress, settings, api/generate-class
├── components/
│   ├── layout/          AppShell, nav, QuickSettings
│   ├── ui/              Button, Card, Chip, Badge, Toggle, ProgressBar, Stepper, Logo
│   ├── class/           TopicPicker, AgendaPreview, ClassSteps, SpeakPrompt, StepShell
│   └── homework/        VoiceRecorder
├── context/             SettingsContext (theme/calm/font), ProgressContext
├── hooks/               useMediaRecorder, useIsClient
└── lib/                 types, storage, cefr, prompts, mockClass, classGenerator,
                         homework, mockData, topics
```

## Spiral review

Learned vocabulary is persisted (`ProgressContext` → `learnedVocab`) and passed
into later class generations as `knownVocab`, so earlier words resurface in new
topics.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel.
3. Add `ANTHROPIC_API_KEY` as an environment variable (optional but recommended).
4. Deploy — no other configuration needed.

---

v1 uses mock data for speakers, circles, and booking slots, and stores all
learner data locally. The code is structured so each of these can be swapped for
a backend without UI changes.