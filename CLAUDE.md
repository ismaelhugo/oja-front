# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Operação Janela Aberta** — public-transparency platform for Brazilian federal deputies' CEAP expenses (Cota para Exercício da Atividade Parlamentar). This repo is the **frontend only**. All data comes from a separate backend (`oja-back`).

UI language is Portuguese (pt-BR). Domain terms stay Portuguese in code and types: `deputado`, `despesa`, `fornecedor`, `gastos`, `partido`, `siglaUf`.

## Commands

```bash
pnpm install          # pnpm-lock.yaml is the committed lockfile
pnpm dev              # next dev --turbopack, port 3000
pnpm build            # production build
pnpm start            # serve production build
npx tsc --noEmit      # type check (currently clean)
```

No tests exist in this repo — there is no test runner, no test files, no CI test job.

Caveats about the scripts:
- `pnpm lint` runs `next lint`, but ESLint is not in `devDependencies` and there is no ESLint config file. The command will prompt for setup rather than lint.
- README and CONTRIBUTING mention `npm run type-check`; that script does not exist. Use `npx tsc --noEmit`.
- Install is not reproducible on pnpm 11: `pnpm install --frozen-lockfile` aborts with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` unless `CI=true`, and the build then fails with `ERR_PNPM_IGNORED_BUILDS: @tailwindcss/oxide, sharp`. `pnpm-workspace.yaml` is a half-finished attempt at this — its `allowBuilds` entries are literal placeholder strings, not booleans. Fix properly by declaring `onlyBuiltDependencies` in `package.json`.

Deployed on Vercel at `https://oja.ismaelhugo.dev/`. The Railway backend is live again; production holds expenses for **2025–2026 only** (a 500 MB volume cannot fit the full 2023–2026 set), while a local database carries the whole range. See `../STATUS.md`.

## Stack

Next.js 15.4.10 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · recharts · lucide-react.

Tailwind v4 is CSS-first: there is **no `tailwind.config.js`**. Config lives in `src/app/globals.css` via `@import "tailwindcss"`, plus CSS custom properties under `:root` and hand-written keyframe/utility classes. Add design tokens and animations there, not in a JS config.

## Architecture

### Backend coupling

Every page resolves its API base the same way, declared as a module-level const at the top of the file:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://oja-back-production.up.railway.app' : 'http://localhost:3333');
```

This line is **duplicated in all six page files** (`page`, `chat`, `ceap`, `compare`, `deputados`, `deputados/[id]`). Change one and you must change all six, or extract it to a shared module first. Local development requires the backend running on `localhost:3333`.

Backend endpoints in use:

| Endpoint | Used by |
|---|---|
| `GET /deputado/list?page&limit&nome&partido&estado` (`limit=0` = all) | deputados, compare |
| `GET /deputado/:id` | deputados/[id], compare |
| `GET /despesa/list?deputadoId&page&limit&ano` | deputados/[id] |
| `GET /estatisticas/deputado/:id/gastos?year&month` | deputados/[id], compare |
| `GET /estatisticas/deputado/:id/fornecedores?year&limit` | deputados/[id] |
| `GET /estatisticas/estado/:uf/media-gastos?year&month` | deputados/[id], compare |
| `GET /estatisticas/estados`, `/total-geral`, `/ranking-deputados`, `/ranking-fornecedores`, `/ultima-atualizacao` | ceap |
| `GET /despesa/anos-disponiveis`, `GET /estatisticas/ultima-atualizacao` | page (home, coverage line) |
| `POST /ai/perguntar` `{pergunta, sessaoId}`, `POST /ai/limpar-sessao` `{sessaoId}` | chat |

### Rendering model

Every route is a **client component** (`'use client'`) that fetches in `useEffect` and holds results in `useState`. There are no Server Components doing data fetching, no route handlers under `src/app/api`, no `lib/`, no shared fetch client, and no data-fetching library. Follow the existing pattern unless deliberately refactoring.

Consequences worth knowing:
- Response shapes are re-declared as local `interface`s in each page (`Deputado` differs between `deputados/page.tsx` and `deputados/[id]/page.tsx`). Reconcile deliberately if you unify them.
- `formatCurrency` (Intl `pt-BR`/`BRL`) is copy-pasted in three pages; `MONTH_LABELS` in two.
- Filters/pagination are server-driven: `deputados/page.tsx` sends `nome`/`partido`/`estado` to the backend with a 500ms debounce, and separately loads the full list (`limit=0`) just to populate the dropdowns.

### Suspense requirement

`useSearchParams` must be inside a `<Suspense>` boundary or the production build fails. `compare/page.tsx` shows the pattern: the default export is a thin `<Suspense fallback={...}><ComparePageContent /></Suspense>` wrapper. Apply the same shape to any new page reading search params.

### Data quirks

Rows with `siglaPartido === "ABC"` are backend sample data and are filtered out client-side in `deputados/page.tsx` (both in the list and in the filter dropdowns). Preserve that filter when touching deputy lists.

### Homepage copy states only what the system does

`src/app/page.tsx` used to claim "tempo real", "Sincronização diária" and "Validação automática contra a API oficial", none of which exist — ingestion is manual, run by hand from the backend CLIs, with no scheduler and no validation pass. That copy is gone.

Two rules keep it gone:

- **Coverage and freshness are fetched, never written into the copy.** The page reads `GET /despesa/anos-disponiveis` and `GET /estatisticas/ultima-atualizacao` and renders the real year range and import date, falling back to a sentence with no period claim when either call fails. Production and local databases hold different year ranges, so any hardcoded range is wrong somewhere.
- **Do not add copy in the old register.** On a transparency thesis, a capability claim the system does not meet is a substance problem, not a wording one.

### Images

`next/image` with remote deputy photos from `camara.leg.br`. Any new external image host must be added to `remotePatterns` in `next.config.ts` or rendering throws. `deputados/page.tsx` keeps an `imageErrors: Set<number>` to fall back to a placeholder per deputy.

## Visual language

Dark theme, near-black backgrounds (`bg-black`, `bg-gray-900`), yellow accent `#FDCF20` (`--color-primary`, Tailwind `yellow-500`/`yellow-400`). Sticky translucent header (`bg-gray-900/80 backdrop-blur-sm`) with the logo linking home, shared `Footer` at the bottom, mobile-first responsive. Chart palettes start at `#FDCF20` and walk warm-to-cool (see `COLORS` in `deputados/[id]/page.tsx`).

`.agents/skills/frontend-design/` is a vendored copy of the `frontend-design` skill (tracked in `skills-lock.json`) — the project intends UI work to follow it.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`), messages in Portuguese or English.
- Fork + pull request workflow; one feature or fix per PR. See `CONTRIBUTING.md` and `.github/pull_request_template.md`.
- Path alias `@/*` maps to `src/*`.
- Per-route SEO metadata: since pages are client components, `metadata` lives in a sibling `layout.tsx` (see `src/app/deputados/layout.tsx`, which just returns `children`).
