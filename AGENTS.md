# AGENTS.md

## Commands

- Package manager is **pnpm** (`pnpm install` / `pnpm dev` / `pnpm build` / `pnpm preview`). README's `npm install` is stale; trust pnpm-lock.yaml.
- Dev server runs on port 4321.
- No tests, lint, or typecheck scripts exist. `pnpm build` is the only verification step; run it before finishing.

## Stack & structure

- Astro 5 + React 19 islands + Tailwind **v3** via `@astrojs/tailwind`. Do NOT use Tailwind v4 config/plugins. All source components are `.jsx`, no TypeScript.
- Single page. Static content (hero, formulas section, footer, all meta/JSON-LD) lives directly in `src/pages/index.astro`. Interactive React islands hydrate with `client:load`:
  - `src/components/PercentageCalculator.jsx` = the 6-card calculator grid
  - `src/components/StackInfo.jsx` = floating info button + modal
- `src/components/ui/` = shadcn-style primitives (button, card, input, select; Radix select + cva). `src/components/calculator/` = the six card types plus shared chrome (`CalculatorFrame`, `AnswerDisplay`, `AnswerPanel`) and pure math/formatting in `utils.js`.
- Global CSS is `src/styles.css`, imported only from `index.astro` (font faces, fixed grain/glow background decor, card-entry and ring animations, reduced-motion guards).

## Design system

Repo-local design skill: `.agents/skills/design-taste-frontend/SKILL.md`. Load it for any design work; it has a mandatory pre-flight checklist.

- Font: OpenRunde (self-hosted woff2 in `public/`; only Regular + Semibold faces exist, so use `font-semibold`, never heavier weights or faux-bold).
- Accent: orange only (orange-600 light / orange-400-500 dark), locked across the whole page. No other accent colors.
- Radius lock: cards `rounded-3xl`, inputs/selects `rounded-xl`, interactive controls pill (`rounded-full`).
- Icons: `@phosphor-icons/react` only, no hand-rolled SVGs. Phosphor components are React, so they cannot be used directly in `.astro` markup; keep icons inside islands or use plain text in static markup.
- Dark mode is automatic via `prefers-color-scheme` using Tailwind `dark:` variants (Tailwind v3 media default, no config change needed). Every new component needs both modes. Respect `prefers-reduced-motion` (CSS guards exist in styles.css).

## Gotchas

- Result objects flow `{ value: string, explanation?, error?, placeholder?, direction? }` from `calculator/utils.js` (`formatNumber` / `formatPercent`, values are strings with 2-decimal formatting). `CalculatorFrame`'s copy button copies `result.value`; `AnswerDisplay` and `AnswerPanel` render it. Change the shape or formatting only in `utils.js` plus both consumers.
- The "Percentage of" card is the featured cell: `md:col-span-2 lg:row-span-2`, side-by-side inputs + quick-example chips + the big `AnswerPanel` (`showAnswer={false}` on `CalculatorFrame`). The grid must stay exactly full (6 cards, 9 cells at lg) with no empty cells.
- Use `min-h-dvh` for viewport sizing, never `h-screen`.
- Deployed on Vercel (site URL in `astro.config.mjs`; repo `mateofilip/Percento`). SEO artifacts live in `public/` (`robots.txt`, `sitemap.xml`, `site.jpg`, `favicon-16/32.png`, `apple-touch-icon.png`) and `index.astro` metas (OG/twitter, theme-color, canonical, JSON-LD); keep them in sync when redesigning.
- `dist/` and `.astro/` are generated and gitignored.
