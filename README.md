# Texno Demo Store

Fresh Stage 1A foundations for a mobile-first Uzbek/Russian electronics storefront. This part contains the scaffold, design system, utilities and gallery; no catalog, cart, authentication or database features.

## Run

Use Node 24 LTS (`.nvmrc`) and pnpm 11.25.0 (`packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm start
```

Routes: `/` redirects to `/uz`; `/uz` and `/ru` show the localized foundation page. `/dev/gallery` exists only during development: `page.dev.tsx` is excluded from production route discovery. E2E and database commands print TODOs for their later stages.

## Map

- `src/app`: layouts, localized page, dev gallery, generated global tokens
- `src/components/{ui,shop,admin}`: image primitive and reserved UI boundaries
- `src/config/brand.ts`: single source for brand, contacts, delivery and flags
- `src/lib`: strict utilities, environment validation, fonts and i18n
- `src/messages`: locale dictionaries and parity test
- `src/styles`: token contract tests, generated names, responsive base styles
- `src/features`, `src/server/{db,repositories,services}`: reserved future boundaries
- `tools/generateTokens.mjs`: regenerate CSS/theme with `pnpm tokens` after an authorized design change
- `public`: supplied logo and placeholder, reserved demo/icons folders
- `docs/screenshots`: gallery at 360px and 1280px, each below 300 KB

## Decisions

The project was fully removed and rebuilt on the existing `stage-1/foundations` branch; Git history is retained. The supplied documents and SVGs are immutable and protected by SHA-256 tests. Part A's explicit minimal scope takes precedence over the complete Stage 1 shell described in SPEC.md.

Google Fonts returned HTTP 403. Official OFL-licensed Inter and Oswald are bundled using `next/font/local`, with `display: swap`. Their subsets cover Latin, Latin Extended, Cyrillic and Uzbek punctuation. No app asset needs network access at build time or runtime. See `docs/fonts.md`.

TypeScript 6.0.3 is pinned because the current ESLint TypeScript parser rejects version 7. Strict application checking remains enabled; Next's standard `skipLibCheck` handles upstream declaration conflicts. All other direct packages are exact stable versions resolved during setup.

`SITE_URL` is an optional zod-validated canonical origin; no secrets are required. Vercel is explicitly configured for Next.js and `.next` output. Actual Vercel deployment and Lighthouse auditing are not part of the local verification.

Next task: Stage 1B responsive shopping shell and shared UI primitives.
