# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Molen: a speaking-first language-learning web app for Brazilian learners, teaching **English** and **Dutch** ("Molen English Classes" / "Molen Dutch Classes") (Next.js 15 App Router, React 19, TypeScript, Tailwind 3). Deployed on Vercel at molen-school.vercel.app; every push to `main` auto-deploys.

## Commands

```bash
npm run dev      # local dev server on http://localhost:3000
npm run build    # production build (also the type-check; there is no separate tsc script)
npm run lint     # next lint
```

There is no test suite. Verify changes with `npm run build` and by running the app.

Env vars (`.env.local`): `AUTH_SECRET` (required: signs sessions and peppers CPF hashes), `BLOB_READ_WRITE_TOKEN` (required for any account/state storage), `ANTHROPIC_API_KEY` (optional), `RESEND_API_KEY` (contact form email), `GOOGLE_TTS_API_KEY` (optional: Dutch audio; without it the browser's own voice is used), `GOOGLE_TTS_VOICE_NL` (optional voice override, default `nl-NL-Wavenet-B`). Scripts that touch production data run with Vercel's env: `npx vercel env run node scripts/<script>.mjs`.

## Architecture

The README describes the original localStorage-only v1. The app has since gained accounts, an admin area, and server storage. The README's feature and AI-flow sections are still accurate; its persistence notes are not.

### Persistence: Vercel Blob as a JSON key-value store
- `src/lib/server/blobKV.ts` wraps `@vercel/blob` as `kvGet/kvSet/kvList/kvDelete`. Blobs are public but get unguessable random suffixes, and are found by prefix through the token-authenticated `list()`. Never return blob URLs or the token to the client.
- `src/lib/server/store.ts` is the only data layer. Key layout:
  - `users/<sub>`: `AccountRecord`. `sub` is a random id created at registration (older code assumed `cpfToSub(cpf)`; always resolve a user's `sub` through `getSubByUserId`).
  - `state/<sub>` (English) and `state-nl/<sub>` (Dutch): per-user, per-course `AppState` (progress, homework by day, weekly completion).
  - `userid/<M######>`: index mapping the public user ID to `sub`. Admin routes address users by userId.
  - `config/{pricing,meetings,resources}` (English) and `config/nl/{…}` (Dutch): admin-managed config per course; `config/cert-design` is shared. Getters merge stored values over defaults (`defaultMeetings(lang)` / `defaultResources(lang)` in `lib/mockData.ts`).
- Everything under `src/lib/server/` imports `server-only`.

### Auth
- `src/lib/server/auth.ts`: scrypt password hashes plus a stateless HMAC-signed `mes_session` cookie (30 days). `getSession()` returns `{ sub, name }`.
- `src/middleware.ts` only checks that the cookie *exists* and redirects page routes (API routes are excluded from the matcher). Real authorization happens in each API route through `getSession()`, or `getAdmin()` (`src/lib/server/adminGuard.ts`) for `/api/admin/*`.
- Registration (`/api/auth/register`) allows at most one admin. Students start with `approved: false` until an admin approves them, and admins can also set `active: false`.

### Client state
- `SettingsContext` holds the profile/settings, loaded from `/api/me` and saved to `/api/settings`. It applies theme, Calm ("autistic") mode, font and motion as `data-theme`, `data-autistic`, `data-font` and `data-motion` attributes on `<html>`. Styling reacts to those attributes through CSS variables in `globals.css`, so a new visual mode should be a data attribute and CSS variables, not conditional classNames.
- `ProgressContext` loads `/api/state` once and saves it back with a debounce. Progress and homework live on the server. With the `autoSave` setting off, changes stay local (`saveStatus: "unsaved"`) until `saveNow()` (the "Save progress" button in Quick Settings, Settings, and the header); leaving the page with unsaved progress triggers a browser warning.
- Audio speed: `ttsRate(profile)` in `ListenButton` combines level (A1–A2 slower), the `ttsSpeed` setting, and Calm mode (`CALM_TTS_FACTOR`).
- `src/lib/storage.ts` (localStorage, `fluentbr.*` keys) is now mainly used for the in-progress class. Bump `CLASS_CONTENT_VERSION` when the `GeneratedClass` shape changes, so stale saved classes get discarded.

### AI class generation
`TopicPicker` → `lib/classGenerator.ts` → `POST /api/generate-class` → Anthropic Messages API with structured JSON output (the schema comes from `lib/prompts.ts`; the model is fixed in the route). If the key is missing or anything fails, the route returns `buildMockClass()` (`lib/mockClass.ts`, plus `a1TopicMocks.ts`). Keep the mock path working, because the app is meant to demo fully offline. Learned vocabulary goes back into later classes as `knownVocab` (spiral review).

### Courses (target languages)
- The course is chosen on the sign-in screen (or the header `LanguageSwitch`) and stored in the `mes_lang` cookie (`lib/server/lang.ts` → `getLang()`). Every API route that reads per-course data calls `getLang()`; students and the admin both work in one course at a time. `lib/language.ts` holds the shared types and names.
- Each course is its own track: English uses the account's top-level `level`/`schedule`; Dutch lives in `account.dutch` (`level`, `supportLang`, `schedule`). Use the store helpers `levelFor/scheduleFor/setLevelFor/setScheduleFor/studiesLanguage/startCourse`, never `account.level` directly. `account.languages` lists started courses (absent = English-only legacy account).
- Progress saves are pinned to the language they were loaded for (`PUT /api/state?lang=`), so a pending save can't cross courses during a switch. In-progress classes are stored per course in localStorage.
- `profile.language` / `profile.supportLang` on the client come from `/api/me`.

### Levels and support language
CEFR level drives everything (`lib/cefr.ts`, where speaking ratio rises with level). Tracks are `general` or `business`.
- English course: Portuguese translation (`profile.translatePt`, `PtToggle`) exists **only for A1**; every other level is English-only.
- Dutch course: the learner picks a support language (English or Portuguese). Explanations (meanings, grammar notes, instructions, feedback) are written in it at every level; the `*Pt` fields and `exampleTranslation` hold support-language translations of the Dutch; A1–A2 stories also get line translations. Prompt: `lib/promptsNl.ts`; schema switches in `buildClassSchema(level, language)`; offline fallback `lib/mockClassNl.ts`; weekly plans `lib/weeklyHomeworkNl.ts`; grammar guide data `lib/grammarNl.ts`.
- Dutch audio: `ListenButton` → `GET /api/tts` (Google Cloud TTS, signed-in users only). Dutch course only.
- Inburgeren (civic integration exam) module: `/inburgeren` page + `lib/inburgeren.ts` (facts from inburgeren.nl, with source links). Topics starting with "Inburgeren" add exam-prep rules to the Dutch prompt. `/class?topic=…` starts a class directly.
- Flags are inline SVGs (`components/ui/Flag.tsx`): emoji flags don't render on Windows.

### Routes
Learner pages are `dashboard`, `class`, `homework`, `meetings`, `resources`, `progress`, `settings`, `sos-gramatica` and (Dutch course) `inburgeren`, all wrapped in `components/layout/AppShell`. The admin pages live under `src/app/admin/*` and pair with `/api/admin/*`. `/`, `/contact`, `/login` and `/register` are public.

## Conventions
- After making changes, commit and push to `main` so Vercel redeploys.
- `backup_*.tgz` files in the root are local backups and are gitignored. Never commit them.
- `assets/` holds source brand files. Only `public/` is served.
