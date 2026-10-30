# AGENTS.md

Engineering rules for AI coding agents working on **Texno Demo Store**: a full-stack, mobile-first web shop for a single electronics & home-appliances store with home delivery (Uzbekistan).

## 0. Read order and source of truth

Before any task, read these files in the repo root:

1. `AGENTS.md` (this file): how to build.
2. `SPEC.md`: what to build (screens, flows, data, rules, phases).
3. `DESIGN.md`: how it must look and move (tokens, components, motion).

If they conflict: `SPEC.md` wins on behavior, `DESIGN.md` wins on visuals, this file wins on code structure and process. If something is missing or ambiguous, make the smallest reasonable assumption, write it in the PR/commit description under "Assumptions", and continue. Ask only when a wrong guess would be expensive (data model, security, payments).

## 1. Product in one paragraph

One store, one catalog, home delivery. Customers browse, add to cart, check out with phone-number login (SMS code), pay on delivery (online payments later), and track orders. The store owner manages catalog, banners and orders in `/admin`. On screens < 1024px the site must feel like a native shopping app (Uzum Market style); on desktop it is a clean Nike-style commerce site. UI languages: Uzbek (Latin, default) and Russian. Currency: UZS (integers, no decimals).

## 2. Stack

- **Next.js** (App Router) + **TypeScript** (`strict: true`), React Server Components by default.
- **Tailwind CSS** with tokens as CSS variables (see `DESIGN.md` Implementation Notes). **shadcn/ui** (Radix) primitives only after restyling to `DESIGN.md`.
- **motion** (Framer Motion) for animations; CSS transitions for simple states.
- **PostgreSQL + Drizzle ORM** (introduced in Stage 5; until then use the in-memory mock repositories behind the same interfaces).
- **next-intl** for i18n (`uz` default, `ru`).
- **zod** for all input validation (forms, route handlers, env).
- **TanStack Query** only for client-side mutable server state (cart, favorites, orders list); prefer server components and server actions for reads.
- **lucide-react** for icons.
- Tests: **Vitest** + Testing Library (unit/component), **Playwright** (e2e, from Stage 3).
- Package manager: **pnpm**. Use the latest stable versions at setup time and pin them in `package.json`/lockfile. Do not upgrade major versions inside unrelated tasks.

## 3. Commands

Define these scripts in `package.json` in Stage 1 and keep them working:

```
pnpm dev          # next dev
pnpm build        # next build
pnpm start        # next start
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
pnpm e2e          # playwright test (from Stage 3)
pnpm format       # prettier --write .
pnpm db:generate  # drizzle-kit generate (Stage 5)
pnpm db:migrate   # drizzle-kit migrate (Stage 5)
pnpm db:seed      # seed demo data (Stage 5)
```

**Definition of done for every task:** `pnpm lint && pnpm typecheck && pnpm test` pass, and `pnpm build` passes for tasks that touch routing, config or data. Report the results in the final message. Never mark a task done with failing checks or skipped tests without saying so explicitly.

## 4. Environment assumptions (important for cloud agents)

- **Assume there is no internet access during the task.** Do not rely on CDNs, hotlinked images, or runtime downloads. Fonts via `next/font/google` need network at build time: if unavailable, use `next/font/local` with font files committed under `src/assets/fonts/` (Inter, Oswald) and note it.
- Do not assume Docker or a running Postgres. Stages 1-4 must run with mock data only.
- Secrets never go in the repo. Use `.env.local` (git-ignored) and commit `.env.example` with every variable documented. Validate env with zod in `src/lib/env.ts`.

## 5. Project structure

```
src/
  app/
    [locale]/
      (shop)/                 # customer-facing routes
        page.tsx              # home
        catalog/ ...
        p/[slug]/ ...
        cart/ checkout/ favorites/ orders/ profile/ search/
      (auth)/login/ ...
      admin/ ...              # store owner area (Stage 5)
    api/                      # route handlers (webhooks, health)
    dev/gallery/              # component gallery (non-production)
    globals.css               # tokens as CSS variables
  components/
    ui/                       # design-system primitives (Button, Chip, SearchPill, ...)
    shop/                     # ProductCard, PriceBlock, BottomTabBar, Header, ...
    admin/
  config/brand.ts             # store name, logo, contacts, delivery settings, feature flags
  features/<feature>/         # catalog, cart, favorites, checkout, orders, auth, admin
    components/ hooks/ actions.ts queries.ts schemas.ts types.ts
  lib/                        # env, format (price/phone/date), i18n helpers, utils
  server/
    db/                       # drizzle schema, client, migrations (Stage 5)
    repositories/             # interfaces + mock + drizzle implementations
    services/                 # business logic (pricing, orders, otp, notifications)
  messages/ uz.json ru.json
public/
  brand/ placeholders/ demo/ icons/
```

Rules: features own their code; shared UI lives in `components/ui`; business rules live in `server/services`, never in components. Repositories are the only layer that touches data sources; the app depends on interfaces so mock and Drizzle implementations are swappable.

## 6. Coding standards

- TypeScript strict, no `any` (use `unknown` + zod parsing). No non-null assertions without a comment.
- Server components by default; add `"use client"` only for interactivity, and keep client components small and leaf-level.
- Mutations through server actions or route handlers with zod validation, auth check and typed results `{ ok: true, data } | { ok: false, error }`.
- Money: integers in UZS (soʻm) everywhere. Format only at the edge with `formatPrice()`. Never use floating point for money.
- Dates: store UTC, display in `Asia/Tashkent`.
- Phone numbers: store E.164 (`+998XXXXXXXXX`), validate with zod.
- No hardcoded user-facing strings: every string goes through next-intl messages in **both** `uz.json` and `ru.json`. A missing key in either locale must fail a unit test.
- Uzbek text uses `ʻ` (U+02BB) in `oʻ`/`gʻ` and `ʼ` (U+02BC) for tutuq. **Search and slug normalization must treat `'`, `ʻ`, `ʼ`, `‘`, `’`, `` ` `` as equivalent** and be case-insensitive; Uzbek Latin and Russian Cyrillic queries should both work (basic transliteration is a Stage 6 improvement).
- Accessibility is part of done: semantic HTML, labels, focus-visible, keyboard operability, `aria-*` where needed, reduced-motion respected.
- Comments explain *why*, not *what*. Keep functions small; extract when a file passes ~250 lines.
- Naming: components `PascalCase.tsx`, hooks `useThing.ts`, utilities `camelCase.ts`, DB tables `snake_case`.

## 7. Design-system rules (enforced)

- Use only tokens from `DESIGN.md`. **No raw hex colors, no arbitrary px values for radius/spacing/duration** in components (`bg-[#fff]`, `rounded-[13px]` are violations). If a needed value does not exist, add the token to `DESIGN.md` and the theme first.
- No `box-shadow` except the documented inset hairlines. No gradients except the skeleton shimmer. No drop-shadow filters.
- Build every new primitive in `components/ui`, add it to `/dev/gallery` with all states, then use it in screens.
- Product/banners/images always go through `<ProductImage>`. It handles aspect ratio, placeholder fallback and error fallback.
- Motion follows `DESIGN.md` → Motion. Max 2 simultaneous animations; transform/opacity only; wrap with `MotionConfig reducedMotion="user"`.
- Store name, logo, phone, address, delivery fee and feature flags come only from `src/config/brand.ts`.

## 8. Mobile-first rules

- Write mobile styles first; enhance with `sm:`, `md:`, `lg:` (shell switches at `lg` = 1024px).
- Below `lg`: app shell with sticky header + bottom tab bar; hide the tab bar on PDP, checkout, auth.
- Use `dvh`/`svh` units, `env(safe-area-inset-*)`, `viewport-fit=cover`; no horizontal page scroll at 320px.
- Tap targets ≥ 44px; no hover-only interactions; `@media (hover: hover)` for hover styles.
- Performance budget (mobile, mid-range phone, slow 4G): LCP < 2.5s on home and PDP; images via `next/image` with explicit sizes and lazy loading below the fold; no layout shift from images or fonts; keep client JS lean (prefer RSC, dynamic import for map, carousels, admin charts).
- The app should be installable as a PWA (manifest + icons) in Stage 6; do not build offline mode beyond a simple offline fallback page.

## 9. Security & privacy

- Validate everything on the server; never trust client prices, totals, stock or user ids. **Recalculate order totals on the server** from DB prices at order creation.
- Authentication: phone + SMS OTP. OTP: 6 digits, 5-minute expiry, max 5 attempts, resend cooldown 60s, rate limit by phone and IP, store only a hash. In non-production, a fixed dev code (`000000`) is allowed **only** when `NODE_ENV !== "production"` and `ALLOW_DEV_OTP=true`.
- SMS goes through an adapter interface (`SmsProvider`) with `ConsoleSmsProvider` for dev; the real provider is plugged in later.
- Sessions: httpOnly, secure, sameSite=lax cookies; rotate on login; CSRF protection on mutations (server actions + origin checks).
- Authorization: customers access only their own addresses/orders/favorites; `/admin` requires an admin role, checked on every server action and route handler, not only in the UI.
- Never log phone numbers, OTPs, tokens or addresses in plain text. Sanitize and escape all user-generated content (reviews, notes).
- Payment secrets and webhook keys live only in server env vars; payment webhooks verify signatures and are idempotent.
- Personal data of customers may be subject to local data-storage rules; keep database access behind repositories and avoid vendor-specific lock-in so the database can be hosted in-country if required.
- Add security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`) in Stage 6.

## 10. Data & repositories

- Interfaces first: `CatalogRepository`, `CartRepository`, `OrderRepository`, `UserRepository`, `AddressRepository`, `BannerRepository`, `FavoriteRepository`.
- Stage 1-4: `mock` implementations (in-memory + seeded demo data from `src/server/repositories/mock/`), same behavior as real ones (including stock checks and latency simulation of 200-400ms in dev to exercise skeletons).
- Stage 5: Drizzle implementations + migrations + `db:seed`. Mock stays for tests.
- Every list query is paginated (cursor or limit/offset with a hard max of 48).

## 11. Testing policy

- Unit tests for: price/phone/date formatting, pricing/delivery/discount rules, installment calc, OTP service, search normalization, cart merging (guest → user).
- Component tests for each `ui` primitive's states and for ProductCard, PriceBlock, BottomTabBar.
- E2E (Playwright, 390x844 and 1280x800): browse → PDP → add to cart → checkout → order success → order visible in "Buyurtmalarim"; login via dev OTP; admin changes order status and the customer sees it.
- Bug fixes include a regression test.
- Snapshot tests only for stable, small outputs (no whole-page snapshots).

## 12. Task protocol

1. Restate the task in 1-3 lines and list the files you expect to touch.
2. Implement the **smallest vertical slice** that satisfies the task. Do not refactor unrelated code or add features not in `SPEC.md`.
3. Add/adjust tests and gallery entries.
4. Run the checks from section 3.
5. Commit with a Conventional Commit message (`feat(cart): ...`, `fix(ui): ...`, `chore: ...`). One logical change per commit.
6. Final message: what changed, how to verify (commands + routes), assumptions, known gaps, and the next suggested task. Keep it short.

If a task is too big, stop at a clean checkpoint, commit, and say what remains.

## 13. Do not

- Do not add dependencies without a one-line justification in the commit message; prefer what is already installed.
- Do not introduce a second state-management, styling or form library.
- Do not hotlink images/fonts/scripts; do not commit files > 300 KB without a reason.
- Do not copy brand assets or trademarks (including Nike, Uzum or electronics brands) into the repo. Demo content uses generic names and the demo logo.
- Do not remove or weaken validation, auth checks, or tests to make a task pass.
- Do not edit `DESIGN.md`/`SPEC.md` silently: if a change is needed, propose it in the final message and make it only when the task says so (exception: adding a missing token to `DESIGN.md` per section 7).
- Do not ship dev-only routes (`/dev/*`) or dev OTP to production builds.

## 14. Quick reference: feature flags (in `brand.ts`)

`installment` (default false), `onlinePayments` (false), `reviews` (true), `compare` (false), `telegramNotifications` (false), `pwa` (false until Stage 6). Code for disabled features may exist but must not render in the UI.
