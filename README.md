# Texno Demo Store

Mobile-first Uzbek/Russian electronics storefront. Stage 1 foundations, components and shell are complete; Stage 2A adds a deterministic mock catalog, validated read APIs and the Home page. Cart business logic, authentication and database work remain later stages.

## Run

Use Node 24 LTS (`.nvmrc`) and pnpm 11.25.0 (`packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm start
```

Routes: `/` redirects to `/uz`; `/uz` and `/ru` show Home with mock catalog data. `/catalog`, `/cart`, `/favorites` and `/profile` remain shell placeholders. Product/category links have minimal `/p/[slug]` and `/c/[slug]` destinations. Public reads: `/api/catalog/products` and `/api/catalog/suggest`. `/[locale]/info/demo` demonstrates a no-tab-bar sub-page. `/dev/gallery` exists only during development: `page.dev.tsx` is excluded from production route discovery. E2E and database commands print TODOs for their later stages.

## Map

- `src/app`: layouts, localized page, dev gallery, generated global tokens
- `src/components/{ui,shop,admin}`: shared controls, storefront shell/Home components; admin is reserved
- `src/config/brand.ts`: single source for brand, contacts, delivery and flags
- `src/lib`: strict utilities, environment validation, fonts and i18n
- `src/messages`: locale dictionaries and parity test
- `src/styles`: token contract tests, generated names, responsive base styles
- `src/features/catalog`, `src/server/{repositories,services}`: Zod catalog domain, mock data and pure services; `src/server/db` is reserved for Stage 5
- `tools/generateTokens.mjs`: regenerate CSS/theme with `pnpm tokens` after an authorized design change
- `public`: supplied logo and placeholder, reserved demo/icons folders
- `docs/screenshots`: gallery, shell and Home captures at 360px/1280px, each below 300 KB

## Decisions

The supplied documents and SVGs are immutable and protected by SHA-256 tests. Stage 1's completed audit is recorded in `docs/reviews/stage-1-review.md`.

Google Fonts returned HTTP 403. Official OFL-licensed Inter and Oswald are bundled using `next/font/local`, with `display: swap`. Their subsets cover Latin, Latin Extended, Cyrillic and Uzbek punctuation. No app asset needs network access at build time or runtime. See `docs/fonts.md`.

TypeScript 6.0.3 is pinned because the current ESLint TypeScript parser rejects version 7. Strict application checking remains enabled; Next's standard `skipLibCheck` handles upstream declaration conflicts. All other direct packages are exact stable versions resolved during setup.

`SITE_URL` is an optional zod-validated canonical origin; no secrets are required. Vercel is explicitly configured for Next.js and `.next` output. Actual Vercel deployment and Lighthouse auditing are not part of the local verification.

Usage and verification: [Stage 1B](docs/stage1b.md), [Stage 2A](docs/stage2a.md). Next task: Stage 2B listing/filter/search interfaces.
