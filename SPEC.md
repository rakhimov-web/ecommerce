# SPEC.md: Texno Demo Store

Product specification for a single-store online shop (electronics & home appliances) with home delivery. Companion files: `AGENTS.md` (how to build), `DESIGN.md` (how it looks and moves).

## 1. Vision & scope

**Goal:** let customers of one physical store browse its catalog and order for home delivery from their phone, with an experience comparable to Uzum Market's mobile app, and let the owner run the shop from an admin area.

**In scope (MVP):** catalog, search, product pages, favorites, cart, phone-OTP login, checkout with address and delivery slot, pay on delivery, order history and tracking, banners, admin for catalog/orders/banners, Uzbek + Russian UI, mobile-first responsive web, demo data and placeholders.

**Later (flagged off or after MVP):** online payments (Payme/Click), installment display, product comparison, Telegram order notifications, push notifications, PWA install, reviews moderation, promo codes, courier app.

**Out of scope:** multi-vendor marketplace, native mobile apps, inventory sync with external ERP, dark mode, RTL.

## 2. Users & roles

| Role | Can do |
|---|---|
| Guest | Browse, search, view products, use cart and favorites (stored in browser) |
| Customer | Everything a guest can + login, addresses, checkout, orders, profile; guest cart/favorites merge on login |
| Admin (store owner / manager) | Manage products, categories, banners, orders (status), customers (read), settings |

Admin accounts are created by seed/CLI, not by public sign-up. Roles are enforced on the server.

## 3. Platform, language & localization

- Responsive web app, **mobile-first**. App shell below 1024px, desktop shell from 1024px (see `DESIGN.md`).
- Locales: `uz` (default, Latin) and `ru`. URL prefix `/uz/...`, `/ru/...`; language switcher in Profil and desktop header. Product/category content stored with per-locale fields (`name_uz`, `name_ru`); fall back to `uz` if `ru` is empty.
- Currency: UZS integer. Format `1 250 000 soʻm` (NBSP).
- Timezone: `Asia/Tashkent`. Working hours and delivery slots are in that timezone.
- Phone: `+998 XX XXX XX XX`.

## 4. Information architecture & routes

| Route | Screen | Shell notes |
|---|---|---|
| `/[locale]` | Home | tab bar |
| `/[locale]/catalog` | Category tree / all categories | tab bar |
| `/[locale]/c/[slug]` | Category listing (filters, sorting) | tab bar |
| `/[locale]/search?q=` | Search results | tab bar |
| `/[locale]/p/[slug]` | Product detail | sticky buy bar, no tab bar |
| `/[locale]/cart` | Cart | tab bar |
| `/[locale]/checkout` | Checkout | no tab bar |
| `/[locale]/checkout/success/[orderNo]` | Order success | no tab bar |
| `/[locale]/favorites` | Favorites | tab bar |
| `/[locale]/profile` | Profile hub | tab bar |
| `/[locale]/orders`, `/orders/[orderNo]` | Orders list / details & tracking | back bar |
| `/[locale]/profile/addresses` | Saved addresses | back bar |
| `/[locale]/login` | Phone + OTP | no tab bar |
| `/[locale]/info/[slug]` | Static pages: about, delivery, returns, warranty, contacts | back bar |
| `/[locale]/admin/...` | Admin (dashboard, orders, products, categories, banners, settings) | desktop-first layout |
| `/dev/gallery` | Component gallery (dev only) | |

## 5. Screens

For every data-driven screen implement **loading (skeleton), empty, error and success** states. Copy keys live in `messages/{uz,ru}.json`.

### 5.1 Home
- Sticky header with search pill; banner carousel (1-5 active banners, each links to a category/product/page); category grid (top-level categories, 4 columns on mobile); quick chips (Chegirmalar, Yangi, Ommabop, Nasiya if flag on); product rails: "Chegirmalar" (discounted), "Yangi" (latest), "Ommabop" (by sales/views); "Siz uchun" infinite 2-up grid; contact block at the end.
- Rails show ≥ 8 items; "Hammasi" link goes to a pre-filtered listing.

### 5.2 Catalog & listing
- Catalog: top-level categories as large icon cards; tapping opens subcategories then listing.
- Listing: sticky filter chip row; sort (Ommabop, Arzon → qimmat, Qimmat → arzon, Yangi, Chegirma); filters: price range, brand, in stock only, discounted only, category-specific attributes (e.g. RAM, screen size, energy class) driven by attribute definitions; result count; infinite scroll with "load more" fallback; active filters shown as removable chips.
- URL query params reflect filters/sort (shareable, back-button safe).

### 5.3 Search
- Search pill opens a full-screen search view: recent searches (local), popular queries (from settings), live suggestions (products + categories) after 2 characters with 250ms debounce.
- Matching: normalized (case, apostrophe variants, diacritics), name + brand + model + category; ranking: exact model > name prefix > contains.
- Empty result: suggestions and popular categories.

### 5.4 Product detail
- Gallery (swipe, dots, desktop thumbnails + zoom on click), title, brand, SKU, rating summary, price block (current, old, discount %), stock line, key attributes chips, variant selector for color/storage when variants exist, description, full specs table, delivery & warranty info row, reviews list (if flag on), related products, sticky buy bar.
- Add to cart rules: respects stock; quantity stepper after first add; "Savatga oʻtish" shortcut.
- Share button (Web Share API with copy fallback), favorite toggle.
- SEO: server-rendered, `Product` JSON-LD, canonical, per-locale metadata.

### 5.5 Favorites
- Grid of favorited products; remove with heart; guest favorites in `localStorage`, merged into account on login.

### 5.6 Cart
- Lines with image, name, variant, unit price, quantity stepper (1..min(stock, 10)), line total, remove (with undo toast).
- Free-delivery progress; delivery fee line (calculated from `brand.ts` settings); order total.
- Price/stock changes since adding are detected on cart load: show warning row and use the current price.
- Guest cart stored in `localStorage`, merged on login (sum quantities, cap by stock).
- Sticky summary + "Buyurtma berish" (requires login; redirects to login then back).

### 5.7 Login
- Step 1: phone (+998 prefix, mask). Step 2: OTP (6 boxes, resend timer 60s, change number). On first login ask for name (optional) after success. No passwords.
- Errors: invalid phone, wrong/expired code, too many attempts (with remaining cooldown).

### 5.8 Checkout
- Sections (one open at a time): Recipient (name, phone prefilled), Address, Delivery date & time slot, Payment method, Order review.
- Address: saved addresses chips or new address form: city/district (select), street, house, apartment, entrance, floor, landmark, optional map pin (Stage 4+). Delivery zones are configured in settings; addresses outside zones show a clear message.
- Delivery slots: next 3 days, slots from settings (e.g. 10:00-13:00, 13:00-17:00, 17:00-21:00), cut-off logic (today's slot unavailable if less than 2 hours remain).
- Payment: `cash_on_delivery`, `card_on_delivery`; online methods appear only if `onlinePayments` flag is on.
- Optional comment (max 300 chars). Double-submit protection and idempotency key.
- On submit the **server recalculates** items, prices, discounts, delivery fee and stock; if anything changed, return to cart with an explanation instead of creating the order.
- Success: order number, summary, estimated delivery, buttons to orders/continue shopping.

### 5.9 Orders & tracking
- List: order number, date, status chip, total, thumbnails; details: items, address, slot, payment method, totals, status timeline (`order-status-stepper`), contact-store button (tel link), cancel button while status is `new` or `confirmed` (with reason).
- Reorder button (adds available items to cart).

### 5.10 Profile
- Name, phone, language, addresses, orders, favorites, info pages, contact store, logout. Delete account request (soft-delete flow, can be a "contact us" link in MVP).

### 5.11 Static info pages
About, Delivery, Returns, Warranty, Contacts (address, phone, working hours, map link, Telegram). Content stored as Markdown per locale, editable in admin (Stage 5).

### 5.12 Admin
- **Dashboard:** today/7-day orders and revenue, orders by status, low-stock list.
- **Orders:** table with filters (status, date, phone, order no), order details, status change with optional note (writes `order_status_history`), print-friendly view, customer contact data.
- **Products:** list/search, create/edit (names uz/ru, slug, category, brand, price, old price, stock, SKU, attributes, specs, descriptions uz/ru, images with ordering and alt text, active flag, badges), duplicate, archive.
- **Categories:** tree with ordering, icon, names uz/ru.
- **Banners:** image desktop + mobile, title, link target, order, active dates.
- **Settings:** store info, working hours, delivery fee/free threshold/min order, delivery zones, slots, popular searches, feature flags that are runtime-safe.
- Admin is desktop-first but must be usable at 768px; no tab bar; table → card list on small screens.

## 6. Key flows

1. **Browse → buy:** Home → category → PDP → Savatga → Cart → Login (if needed) → Checkout → Success.
2. **Guest merge:** guest adds items and favorites → logs in → local data merges into account without duplicates.
3. **Reorder:** Orders → details → Qayta buyurtma → cart prefilled (unavailable items listed).
4. **Admin fulfilment:** new order appears → admin confirms → packing → out for delivery → delivered (each change timestamped, visible to the customer).
5. **Price/stock drift:** item price changes while in cart → cart shows warning, checkout uses the server price.

## 7. Data model (Postgres, snake_case)

Money fields are integers in soʻm. All tables have `id` (uuid), `created_at`, `updated_at` unless noted.

- **users**: `phone` (unique, E.164), `name`, `role` (`customer`|`admin`), `locale`, `last_login_at`, `deleted_at`.
- **otp_codes**: `phone`, `code_hash`, `expires_at`, `attempts`, `consumed_at`, `ip`.
- **sessions**: `user_id`, `token_hash`, `expires_at`, `user_agent`.
- **addresses**: `user_id`, `label`, `recipient_name`, `recipient_phone`, `city`, `district`, `street`, `house`, `apartment`, `entrance`, `floor`, `landmark`, `lat`, `lng`, `is_default`.
- **categories**: `parent_id`, `slug` (unique), `name_uz`, `name_ru`, `icon`, `sort_order`, `is_active`.
- **brands**: `slug`, `name`, `logo_path`.
- **products**: `slug` (unique), `sku`, `category_id`, `brand_id`, `name_uz`, `name_ru`, `description_uz`, `description_ru`, `price`, `old_price` (nullable), `stock`, `is_active`, `badges` (text[]), `rating_avg`, `rating_count`, `sales_count`, `warranty_months`.
- **product_images**: `product_id`, `path`, `alt_uz`, `alt_ru`, `sort_order`.
- **product_variants** (optional per product): `product_id`, `sku`, `name_uz`, `name_ru`, `price`, `stock`, `attributes` (jsonb, e.g. color, storage).
- **attribute_defs**: `category_id`, `key`, `name_uz`, `name_ru`, `type` (`text`|`number`|`enum`|`bool`), `unit`, `is_filterable`, `sort_order`.
- **product_attributes**: `product_id`, `attribute_key`, `value_text`, `value_number`.
- **favorites**: `user_id`, `product_id` (unique pair).
- **carts** / **cart_items**: `user_id` (nullable for future), `product_id`, `variant_id`, `quantity` (server cart for logged-in users).
- **orders**: `order_no` (human-readable, unique, e.g. `T-000123`), `user_id`, `status`, `subtotal`, `discount_total`, `delivery_fee`, `total`, `payment_method`, `payment_status` (`pending`|`paid`|`failed`|`refunded`), `recipient_name`, `recipient_phone`, `address_snapshot` (jsonb), `delivery_date`, `delivery_slot`, `comment`, `idempotency_key` (unique), `cancel_reason`.
- **order_items**: `order_id`, `product_id`, `variant_id`, `name_snapshot`, `sku_snapshot`, `unit_price`, `quantity`, `line_total`, `image_snapshot`.
- **order_status_history**: `order_id`, `status`, `note`, `changed_by`, `created_at`.
- **banners**: `image_desktop`, `image_mobile`, `title_uz`, `title_ru`, `link_type`, `link_target`, `sort_order`, `starts_at`, `ends_at`, `is_active`.
- **pages**: `slug`, `title_uz`, `title_ru`, `body_uz_md`, `body_ru_md`.
- **settings**: key/value jsonb (store info, hours, delivery config, slots, zones, popular searches).
- **reviews** (flag): `product_id`, `user_id`, `rating`, `text`, `status` (`pending`|`approved`|`rejected`).

Indexes: products (`slug`, `category_id`, `is_active`, `price`), orders (`user_id`, `status`, `created_at`), trigram/full-text on product names (Stage 6).

## 8. Business rules

- **Order status flow:** `new → confirmed → packing → out_for_delivery → delivered`; `cancelled` allowed from `new|confirmed|packing` by admin and from `new|confirmed` by the customer. Transitions are validated on the server; every transition writes `order_status_history`.
- **Stock:** decremented when the order is created (reserved); restored on cancellation. Orders that would exceed stock are rejected with a per-item message.
- **Price:** the price at order creation is snapshotted into `order_items`. Discount % shown = `round((old_price - price) / old_price * 100)` only when `old_price > price`.
- **Delivery fee:** `delivery_fee` from settings; free when subtotal ≥ `free_delivery_from`; minimum order amount from settings (checkout disabled below it with a clear message). Demo values (editable in `brand.ts`/settings): fee 30 000, free from 2 000 000, minimum 100 000 soʻm.
- **Payment (MVP):** cash or card on delivery; `payment_status` set to `paid` by admin when delivered. Online payments (Payme/Click) will be added behind the flag with server-side signature-verified, idempotent webhooks.
- **Installment display (flag, default off):** informational calculator: `monthly = ceil(price × (1 + markup_percent/100) / months)` for 3/6/12 months with markup and legal note from settings. It is not a credit offer.
- **Quantity limits:** 1 to min(stock, 10) per line.
- **Order number:** sequential `T-` + 6 digits, generated server-side.
- **Search & favorites:** see section 5.
- **Cleanup:** expired OTPs and sessions are purged by a scheduled job (Stage 6).

## 9. Notifications

- MVP: on-screen status only. Stage 6: Telegram bot message to a store chat on new order (flag), SMS to customer on status `out_for_delivery` (optional, through `SmsProvider`), Web Push later.
- Telegram message includes order number, items, total, address, phone, slot, and an admin link.

## 10. Non-functional requirements

- **Performance (mobile, slow 4G):** LCP < 2.5s, CLS < 0.1, INP < 200ms on home, listing, PDP. Images responsive via `next/image`, lazy below the fold; fonts preloaded; minimal client JS.
- **SEO:** SSR/SSG for catalog and PDP, `sitemap.xml`, `robots.txt`, hreflang uz/ru, Open Graph tags, JSON-LD (Product, BreadcrumbList, Organization).
- **Accessibility:** WCAG 2.1 AA target (see `DESIGN.md`).
- **Security:** see `AGENTS.md` section 9.
- **Reliability:** idempotent order creation, graceful error states, `/api/health`.
- **Observability:** structured server logs without personal data; error tracking hook in Stage 6.
- **Browser support:** current and previous major versions of Chrome, Safari (iOS 15+), Firefox, Samsung Internet, Edge.

## 11. Demo content (seed)

Generic, fictional brands only (e.g. "Aurora", "Nordix", "Kelvin", "Vita"). ~25 products across 8 top-level categories, 2-3 subcategories each:

1. Smartfonlar va gadjetlar (smartphones, tablets, smart watches)
2. Noutbuklar va kompyuterlar
3. Televizorlar va audio
4. Sovutgichlar va muzlatgichlar
5. Kir yuvish va quritish mashinalari
6. Konditsionerlar va isitish
7. Oshxona texnikasi (mikroto'lqinli pech, blender, multivarka, choynak)
8. Uy uchun kichik texnika (changyutgich, dazmol, fen)

Each product: 3 placeholder images (1 real placeholder path, others empty to exercise fallback), 5-10 attributes, realistic price range (e.g. 150 000 to 25 000 000 soʻm), some with `old_price`, stock between 0 and 40 (include 2-3 out-of-stock and 3 low-stock), both `uz` and `ru` names. Include 4 banners, 5 info pages, 1 admin user (`+998900000000`, dev OTP) and 1 demo customer.

## 12. Stages (delivery plan)

Each stage ends in a working, demoable build with all checks green.

| # | Stage | Outcome |
|---|---|---|
| 1 | Foundations | Repo scaffold, tokens/theme, fonts, i18n, brand config, demo logo + placeholders, shell (header, tab bar, desktop nav), UI primitives, `/dev/gallery` |
| 2 | Catalog (mock data) | Home, catalog, listing + filters/sort, search, PDP, skeletons/empty/error, SEO basics |
| 3 | Cart & favorites | Guest + (mock) user cart and favorites, add-to-cart animation, cart screen, e2e smoke tests |
| 4 | Auth & checkout & orders (mock) | Phone OTP (dev code), addresses, checkout, success, orders list/details/tracking, server-side order recalculation |
| 5 | Database & admin | Drizzle schema/migrations/seed, real repositories, admin (orders, products, categories, banners, settings), image upload |
| 6 | Integrations & polish | SMS provider, Telegram notifications, PWA, security headers, search improvements, analytics hook, online payments behind flag |
| 7 | QA & release | Performance/a11y pass, e2e suite, content review, deployment config, backups, handover docs |

### Stage 1 acceptance criteria
- `pnpm dev/build/lint/typecheck/test` all pass.
- All design tokens from `DESIGN.md` exist as CSS variables and Tailwind theme keys; no raw hex in components.
- Uzbek and Russian locales switch via URL; sample strings render correctly with `oʻ`, `gʻ` and Cyrillic in both fonts.
- App shell works: < 1024px shows sticky header + bottom tab bar (5 tabs, cart badge), ≥ 1024px shows utility bar + primary nav + footer.
- `/dev/gallery` shows every primitive in all states (default, pressed, focus, disabled, loading, error, skeleton, long uz/ru text).
- `<ProductImage>` renders placeholder when no image and on error; layout never shifts.
- `public/brand/logo-demo.svg` and `public/placeholders/image-placeholder.svg` are in place and used via `brand.ts`.
- No horizontal scroll at 320px; Lighthouse accessibility ≥ 95 on the gallery page.

## 13. Open questions (decide later, do not block stages 1-4)

- Final store name, logo, brand color usage, real product photos.
- Delivery zones, fee schedule, same-day delivery policy.
- Installment partners and legal copy.
- Online payment providers and merchant contracts.
- Hosting location (in-country vs abroad) and data-residency requirements.
- Admin staff accounts count and permissions beyond a single admin role.
