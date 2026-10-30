# Stage 2A — catalog data and Home

Branch: `stage-2/catalog-data-home`. Based on default `origin/main` at `22df82f`, which
already contains the Stage 1 audit. The first commit removes the audit's unused
`.gallery-banner` and `toast-enter` CSS. No dependencies or immutable specifications
were changed.

## Delivered

- Zod-derived catalog domain and replaceable catalog/banner/page repository interfaces.
- Deterministic seed: 8 roots with 3 children each, 6 fictional brands, 30 bilingual
  products with 5 attributes each, 10 discounts, 3 out-of-stock and 4 low-stock cases,
  variants, ratings, dates, 4 banners and 5 bilingual Markdown pages.
- Pure category, search, filtering, sorting, facet and pagination services. All five
  sorts have stable ID ties. Search covers both languages, category ancestors, brand,
  SKU/model and normalized Uzbek apostrophes; transliteration remains Stage 6.
- Safe validated public reads and a server-rendered bilingual Home, with carousel,
  category icons, quick links, three eight-item rails, progressively loaded product
  grid, loading/error/empty states, DEMO contacts and Organization JSON-LD.
- Art-directed, aspect-reserved `ProductImage` banners and consistent fallback sizing;
  banner states also appear in the development gallery.

## Verify

```sh
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm dev --hostname 127.0.0.1 --port 3040
# Optional, with host Python Playwright and /usr/bin/chromium:
python tools/check-stage2-home.py
```

Routes: `/uz`, `/ru`, `/api/catalog/products`, `/api/catalog/suggest?q=Aurora`.
Open a product card for the minimal `/[locale]/p/[slug]` placeholder (no mobile tabs).
`/[locale]/c/[slug]` is a minimal category destination. The full listing/search/PDP
screens remain later parts. `/dev/gallery` remains development-only.

API success: `{ok: true, data}`; invalid parameters/cursors return HTTP 400 with
`INVALID_QUERY`; unexpected failures return HTTP 503 with `CATALOG_UNAVAILABLE`.
Neither envelope contains internal error details. Products accept:

| Parameter               | Contract                                                                         |
| ----------------------- | -------------------------------------------------------------------------------- |
| `categorySlug`, `q`     | Category includes descendants; search is capped at 100 characters                |
| `brandSlugs`            | Repeated or comma-separated slugs; OR within the selected brands                 |
| `priceMin`, `priceMax`  | Inclusive nonnegative integer UZS; minimum must not exceed maximum               |
| `inStock`, `discounted` | Exact `true` / `false` values                                                    |
| `attributes`            | JSON object, e.g. `{"ram":[4,8],"color":["black"]}`; OR per key, AND across keys |
| `sort`                  | `popular`, `priceAsc`, `priceDesc`, `newest`, `discount`                         |
| `cursor`, `limit`       | Opaque cursor; default 24, maximum 48; Home requests 8 at a time                 |

Suggestions accept `q` and `limit` (default 8, maximum 48); fewer than two normalized
characters return an empty list. Unknown URL parameters are rejected.

## Assumptions and limits

- Seven category roots plus the final “All” tile preserve DESIGN.md's two-row,
  four-column Home grid. All eight roots remain available through the repository.
- Facets are **conjunctive**: they describe the complete filtered result, independent
  of pagination, including current brand/attribute selections. Empty price bounds
  are `null`; missing facet values are omitted.
- Base64url cursors contain a version, last ID and SHA-256 query fingerprint. They
  bind filters/sort while allowing a page-size change; they are pagination tokens,
  not authentication credentials. A stale/mismatched cursor is rejected.
- Mock reads clone data and simulate 300 ms only in development outside tests.
  Production reads need no database or external assets. Fixed UTC dates avoid
  runtime randomness; no dates are displayed in this slice.
- Banner art uses the supplied placeholder. No real products, photos or contacts
  are implied. Invalid DEMO phone/address values remain visible text, are sourced
  from `brand.ts`, and are omitted from Organization structured contact fields.
- Cart/favorite controls are disabled when no action callback exists. Gallery
  callbacks still demonstrate their states; cart/favorites behavior is out of scope.
- The localized category and product destinations are intentionally placeholders.
  Listing/filter/search interfaces and a complete PDP are parts B/C. Info pages are
  repository data here; no Markdown renderer, auth or database is introduced.

## Evidence

Final required chain: **lint, typecheck, 268 tests across 15 files, and production
build all pass**. Full output: [stage2-checks.log](reviews/evidence/stage2-checks.log).
The build includes both public read endpoints and excludes `/dev/gallery`.

The service, seed, reusable repository contract, route and component tests cover
each filter/sort, combined filters, full-seed cursor traversal, ranking/normalization,
facets, malformed requests, repository isolation/dev latency, carousel controls and
grid loading/retry/end behavior. Existing Stage 1 tests remain intact.
The existing sheet test now awaits focus/scroll restoration together with presence
removal, preventing a passive-effect timing race without removing assertions.

Browser evidence: [stage2-home-browser.json](reviews/evidence/stage2-home-browser.json).
Six Chromium cases cover uz/ru at 320/360/1280 px: no page overflow, all measured
application targets at least 44 px, 30 distinct grid products, correct banner aspect,
zero WCAG 2.1 A/AA axe violations, zero page errors and zero external requests.
This is not a Lighthouse performance score or a manual screen-reader certification.
The final browser run used `pnpm start --hostname 127.0.0.1 --port 3050` and
`STAGE2_BASE_URL=http://127.0.0.1:3050 python tools/check-stage2-home.py` against the
successful production build. At 320 px it suppresses observer notifications to
verify the fallback independently; 360/1280 px exercise actual observer loading.

Screenshots: [360px](screenshots/stage2-home-360.jpg) and
[1280px](screenshots/stage2-home-1280.jpg), each below 300 KB. Images reserve their
geometry; mobile LCP on representative hardware remains a later performance check.

Next: Stage 2B catalog/category listings and URL-driven filtering/search, reusing
these services, public reads and repository contracts.
