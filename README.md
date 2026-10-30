# Texno Demo Store

Stage 1A foundations for a mobile-first, bilingual electronics storefront. No catalog, cart, authentication, or database is implemented in this part.

## Run

Use Node from `.nvmrc` (24 LTS) and pnpm 11.25.0 (`packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm start
```

Routes: `/` redirects to `/uz`; `/uz` and `/ru` show the foundation page. `/dev/gallery` is available only in development: its `page.dev.tsx` extension is excluded from production route discovery. E2E and database scripts are explicit future-stage TODOs.

## Folder map

- `src/app`: locale layouts/pages, development gallery, global tokens
- `src/components/{ui,shop,admin}`: shared UI and future shells
- `src/config/brand.ts`: single brand/contact/delivery/feature-flag source
- `src/lib`: validated environment, formatting, normalization, fonts and i18n
- `src/messages`: Uzbek/Russian messages and parity tests
- `src/styles`: token gallery data and reference-contract tests
- `src/features`, `src/server/{db,repositories,services}`: reserved boundaries; no services yet
- `public/brand`, `public/placeholders`: immutable supplied assets
- `docs/screenshots`: gallery captures at 360px and 1280px

## Decisions and limitations

- Existing Vite code is replaced on this branch; it remains in Git history. The selected repository is retained.
- Part A intentionally stops before the full Stage 1 shopping shell and primitive set.
- Google Fonts requests returned HTTP 403. Licensed local Inter (400–700 variable) and Oswald (500) are bundled; no build/runtime font downloads. Subsets retain Latin, Latin Extended, Cyrillic and Uzbek apostrophes. See `docs/fonts.md`.
- TypeScript 6.0.3 is the latest compatible stable version: current typescript-eslint rejects TypeScript 7. Dependency declaration checking uses Next's standard `skipLibCheck`; application strict checking remains enabled. Upstream jest-dom/Vitest declaration augmentation also currently conflicts.
- Environment requires no secrets. `SITE_URL` is an optional validated canonical origin; copy `.env.example` to `.env.local` to override it.
- Mobile typography overrides the YAML desktop defaults; the hierarchy table additionally specifies 16px desktop product names.
- Screenshot and browser validation are smoke checks, not a Lighthouse audit or cross-browser certification.
