# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Molen English School: a speaking-first English-learning web app for Brazilian learners (Next.js 15 App Router, React 19, TypeScript, Tailwind 3). Deployed on Vercel at molen-school.vercel.app; every push to `main` auto-deploys.

## Commands

```bash
npm run dev      # local dev server on http://localhost:3000
npm run build    # production build (also the type-check; there is no separate tsc script)
npm run lint     # next lint
```

There is no test suite. Verify changes with `npm run build` and by running the app.

Env vars (`.env.local`): `AUTH_SECRET` (required: signs sessions and peppers CPF hashes), `BLOB_READ_WRITE_TOKEN` (required for any account/state storage), `ANTHROPIC_API_KEY` (optional), `RESEND_API_KEY` (contact form email). Scripts that touch production data run with Vercel's env: `npx vercel env run node scripts/<script>.mjs`.

## Architecture

The README describes the original localStorage-only v1. The app has since gained accounts, an admin area, and server storage. The README's feature and AI-flow sections are still accurate; its persistence notes are not.

### Persistence: Vercel Blob as a JSON key-value store
- `src/lib/server/blobKV.ts` wraps `@vercel/blob` as `kvGet/kvSet/kvList/kvDelete`. Blobs are public but get unguessable random suffixes, and are found by prefix through the token-authenticated `list()`. Never return blob URLs or the token to the client.
- `src/lib/server/store.ts` is the only data layer. Key layout:
  - `users/<sub>`: `AccountRecord`. `sub` is `cpfToSub(cpf)`, a peppered SHA-256 of the CPF.
  - `state/<sub>`: per-user `AppState` (progress, homework by day, weekly completion).
  - `userid/<M######>`: index mapping the public user ID to `sub`. Admin routes address users by userId.
  - `config/{pricing,meetings,resources,cert-design}`: platform-wide, admin-managed config. Getters merge stored values over defaults.
- Everything under `src/lib/server/` imports `server-only`.

### Auth
- `src/lib/server/auth.ts`: scrypt password hashes plus a stateless HMAC-signed `mes_session` cookie (30 days). `getSession()` returns `{ sub, name }`.
- `src/middleware.ts` only checks that the cookie *exists* and redirects page routes (API routes are excluded from the matcher). Real authorization happens in each API route through `getSession()`, or `getAdmin()` (`src/lib/server/adminGuard.ts`) for `/api/admin/*`.
- Registration (`/api/auth/register`) allows at most one admin. Students start with `approved: false` until an admin approves them, and admins can also set `active: false`.

### Client state
- `SettingsContext` holds the profile/settings, loaded from `/api/me` and saved to `/api/settings`. It applies theme, Calm ("autistic") mode, font and motion as `data-theme`, `data-autistic`, `data-font` and `data-motion` attributes on `<html>`. Styling reacts to those attributes through CSS variables in `globals.css`, so a new visual mode should be a data attribute and CSS variables, not conditional classNames.
- `ProgressContext` loads `/api/state` once and saves it back with a debounce. Progress and homework live on the server.
- `src/lib/storage.ts` (localStorage, `fluentbr.*` keys) is now mainly used for the in-progress class. Bump `CLASS_CONTENT_VERSION` when the `GeneratedClass` shape changes, so stale saved classes get discarded.

### AI class generation
`TopicPicker` → `lib/classGenerator.ts` → `POST /api/generate-class` → Anthropic Messages API with structured JSON output (the schema comes from `lib/prompts.ts`; the model is fixed in the route). If the key is missing or anything fails, the route returns `buildMockClass()` (`lib/mockClass.ts`, plus `a1TopicMocks.ts`). Keep the mock path working, because the app is meant to demo fully offline. Learned vocabulary goes back into later classes as `knownVocab` (spiral review).

### Levels and language
CEFR level drives everything (`lib/cefr.ts`, where speaking ratio rises with level). Portuguese translation (`profile.translatePt`, `PtToggle`) exists **only for A1**; every other level is English-only. Tracks are `general` or `business`.

### Routes
Learner pages are `dashboard`, `class`, `homework`, `meetings`, `resources`, `progress`, `settings` and `sos-gramatica`, all wrapped in `components/layout/AppShell`. The admin pages live under `src/app/admin/*` and pair with `/api/admin/*`. `/`, `/contact`, `/login` and `/register` are public.

## Conventions
- After making changes, commit and push to `main` so Vercel redeploys.
- `backup_*.tgz` files in the root are local backups and are gitignored. Never commit them.
- `assets/` holds source brand files. Only `public/` is served.
