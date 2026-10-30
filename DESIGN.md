---
version: alpha
name: Texno Demo Store
description: >
  Mobile-first electronics & home-appliances store (single store, home delivery, Uzbekistan).
  Visual system derived from Nike's commerce system (monochrome chrome, pill geometry,
  photography-first, flat cards) and adapted to an Uzum-Market-style mobile app shell
  (bottom tab bar, sticky search, dense 2-up product grid, sticky buy bar).
colors:
  ink: "#111111"
  canvas: "#ffffff"
  on-primary: "#ffffff"
  soft-cloud: "#f5f5f5"
  hairline: "#cacacb"
  hairline-soft: "#e5e5e5"
  charcoal: "#39393b"
  ash: "#4b4b4d"
  mute: "#707072"
  stone: "#9e9ea0"
  sale: "#d30005"
  sale-deep: "#780700"
  success: "#007d48"
  success-bright: "#1eaa52"
  info: "#1151ff"
  info-deep: "#0034e3"
  warning: "#b45309"
  skeleton-base: "#f5f5f5"
  skeleton-shine: "#ececec"
typography:
  display-campaign:
    fontFamily: Oswald
    fontSize: 96px
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: 0
    textTransform: uppercase
  heading-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
  heading-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
  heading-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  product-name:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  price-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  price-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.25
  button-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  button-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
  caption-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
  caption-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
  tab-label:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
rounded:
  none: 0px
  sm: 18px
  md: 24px
  lg: 30px
  full: 9999px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  xl: 24px
  xxl: 30px
  section: 48px
  section-tablet: 32px
  section-mobile: 24px
motion:
  duration-instant: 100ms
  duration-fast: 150ms
  duration-base: 250ms
  duration-slow: 400ms
  ease-standard: "cubic-bezier(0.2, 0, 0, 1)"
  ease-enter: "cubic-bezier(0, 0, 0.2, 1)"
  ease-exit: "cubic-bezier(0.4, 0, 1, 1)"
  ease-linear: "linear"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    height: 48px
    padding: 0 32px
  button-primary-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    transform: "scale(0.96)"
    opacity: 0.7
  button-primary-disabled:
    backgroundColor: "{colors.hairline-soft}"
    textColor: "{colors.stone}"
  button-secondary:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    height: 48px
    padding: 0 32px
  button-outline-on-image:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: 12px 24px
  button-icon-circular:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  button-icon-circular-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 40px
  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    height: 40px
    padding: 0 16px
  filter-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  search-pill:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 44px
    padding: 0 16px
  search-pill-focused:
    backgroundColor: "{colors.canvas}"
    border: "2px solid {colors.ink}"
    halo: "0 0 0 12px {colors.soft-cloud}"
  text-field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
    height: 48px
    padding: 0 16px
  text-field-error:
    border: "2px solid {colors.sale}"
  product-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: 0
  product-card-image:
    backgroundColor: "{colors.soft-cloud}"
    aspectRatio: "1 / 1"
    imageFit: contain
    imagePadding: 10%
  badge-promo:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: 4px 12px
  bottom-tab-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    activeTextColor: "{colors.ink}"
    typography: "{typography.tab-label}"
    height: 56px
    borderTop: "1px solid {colors.hairline-soft}"
  sticky-buy-bar:
    backgroundColor: "{colors.canvas}"
    height: 72px
    borderTop: "1px solid {colors.hairline-soft}"
  quantity-stepper:
    backgroundColor: "{colors.soft-cloud}"
    rounded: "{rounded.lg}"
    height: 40px
  swatch-dot:
    rounded: "{rounded.full}"
    size: 12px
  skeleton:
    backgroundColor: "{colors.skeleton-base}"
    rounded: "{rounded.none}"
---

## Overview

This is the design system of the **Texno Demo Store**: an online electronics and home-appliances store for a single shop, served as a responsive web app that looks and behaves like a native shopping app on phones (Uzum Market style) and like a clean Nike-style commerce site on desktop.

The base is Nike's commerce system, kept almost intact: **photography speaks, the chrome doesn't.** Chrome is neutral typography, pill geometry and flat surfaces on `{colors.canvas}` and `{colors.soft-cloud}`. No gradients, no drop shadows, no decorative accent colors. The only chromatic signal in retail chrome is the sale price (`{colors.sale}`), plus functional success/warning/info colors.

On top of that base, this file adds what Nike's file does not cover and what a mobile app-style shop needs: an **app shell** (bottom tab bar, sticky search, sticky buy bar), a **dense mobile product grid**, **price and installment blocks**, **forms and checkout**, **order tracking**, a **motion system**, and a **placeholder-imagery system** for the demo phase.

### Deviations from the Nike source (these override the Nike behavior)

| Topic | Nike original | This project | Why |
|---|---|---|---|
| Mobile product grid | 1-up below 600px | **2-up** from 320px | App-style density, easier price comparison |
| Product image fit | full-bleed, no padding | **contain with ~10% padding** on `{colors.soft-cloud}` | Electronics photos are cut-outs/white background, not full-bleed shoes |
| Navigation on mobile | hamburger drawer + top bar | **bottom tab bar** + sticky search; hamburger removed | App-like navigation with thumb reach |
| Shell switch | multiple tablet steps | **single switch at 1024px** (below = app shell, above = desktop shell) | Simpler to build and test |
| Fonts | Nike Futura ND / Helvetica Now (proprietary) | **Oswald** (display) + **Inter** (UI) | Free fonts with Latin-Extended and Cyrillic coverage (Uzbek + Russian) |
| UI font weight | 500 everywhere | 400 body, 500 UI, **600/700 for headings and prices** | Prices must scan fast in dense grids |
| Pressed state | `scale(0.5)` + `opacity 0.5` | `scale(0.96)` + `opacity 0.7` for 100ms | The original is too aggressive for dense mobile UI |
| Hover states | not documented | defined below (desktop only, pointer devices) | Needed for desktop shell |
| Sale discount | text only, no badge | keep text; **plus** `-NN%` as red inline text | Same rule, applied to Uzbek market |
| Dark mode | not documented | **not supported in v1** | Scope control |

## Colors

The chrome palette is exactly Nike's. Do not add colors without adding a token here first.

### Brand & Accent
- **Ink** (`{colors.ink}` `#111111`): primary CTA, active chip, headlines, body text, cart badge, tab active state. When the UI asserts anything, it goes black.
- **Canvas / On-primary** (`{colors.canvas}` `#ffffff`): every page background, on-image CTA, inverse text on ink.

### Surface
- **Soft Cloud** (`{colors.soft-cloud}` `#f5f5f5`): product image stage, search pill, secondary button, quantity stepper, skeleton base, installment panel.
- **Hairline** (`{colors.hairline}` `#cacacb`): 1px dividers, input borders, chip borders.
- **Hairline Soft** (`{colors.hairline-soft}` `#e5e5e5`): the only "shadow": inset 1px line under sticky headers and above the bottom bars; disabled button fill.

### Text
- **Ink** primary; **Charcoal** (`#39393b`) softer body; **Ash** (`#4b4b4d`) low-emphasis; **Mute** (`#707072`) secondary metadata (category, old price, helper text); **Stone** (`#9e9ea0`) only for disabled text or on dark surfaces (fails contrast on white for normal text, never use it for readable content).

### Semantic
- **Sale** (`{colors.sale}` `#d30005`): discounted price, `-NN%`, form error border/text. **Never** a background, never chrome.
- **Success** (`{colors.success}` `#007d48`): in stock, order delivered, confirmations.
- **Warning** (`{colors.warning}` `#b45309`): low stock ("Oxirgi 3 dona"), price-changed notice in cart. *(Addition, not in Nike.)*
- **Info** (`{colors.info}` `#1151ff`): inline informational links/callouts only.

### Category accents
Nike's pink/purple/teal category accents are **not used** in this project. Category tiles use `{colors.soft-cloud}` + an ink line icon.

## Typography

### Font family
- **Oswald** (display tier only): uppercase campaign headlines on banners. Subsets: latin, latin-ext, cyrillic. Fallback: Arial Narrow, Arial, sans-serif.
- **Inter**: everything else. Subsets: latin, latin-ext, cyrillic. Fallback: system-ui, Helvetica, Arial, sans-serif.
- Load via `next/font/google`, `display: swap`, only the weights listed (Inter 400/500/600/700, Oswald 500).
- **Verify glyphs** for Uzbek Latin `oʻ`, `gʻ` (U+02BB), tutuq `ʼ` (U+02BC) and Russian Cyrillic in both fonts during Stage 1; add a gallery sample line for it.

### Hierarchy (desktop / mobile)

| Token | Desktop | Mobile | Weight | Line height | Use |
|---|---|---|---|---|---|
| `{typography.display-campaign}` | 96px | 40px | 500 | 0.9 | Banner headline only, uppercase, max 3 lines |
| `{typography.heading-xl}` | 32px | 24px | 600 | 1.2 | Section titles ("Chegirmalar", "Yangi mahsulotlar"), PDP title |
| `{typography.heading-lg}` | 24px | 20px | 600 | 1.2 | Subsection, card group title |
| `{typography.heading-md}` | 16px | 16px | 600 | 1.5 | Filter group header, accordion label |
| `{typography.body-md}` | 16px | 16px | 400 | 1.5 | Body copy, inputs |
| `{typography.body-strong}` | 16px | 16px | 500 | 1.5 | Nav links, row labels |
| `{typography.product-name}` | 16px | 14px | 500 | 1.4 | Product card name, **clamp to 2 lines** |
| `{typography.price-lg}` | 24px | 24px | 700 | 1.2 | PDP price |
| `{typography.price-md}` | 16px | 16px | 700 | 1.25 | Card price, cart line price |
| `{typography.button-md}` | 16px | 16px | 500 | 1.5 | Pill CTAs |
| `{typography.button-sm}` | 14px | 14px | 500 | 1.5 | Chips, compact CTAs |
| `{typography.caption-md}` | 14px | 14px | 500 | 1.5 | Subtitles, footer links |
| `{typography.caption-sm}` | 12px | 12px | 500 | 1.5 | Old price, badge, installment line |
| `{typography.tab-label}` | n/a | 11px | 500 | 1.2 | Bottom tab labels |

### Principles
- Extreme contrast between the single display tier and the quiet 12-16px UI tier. Do not invent middle sizes.
- Numbers (prices, quantities) use `font-variant-numeric: tabular-nums`.
- **Uzbek and Russian strings are ~20-35% longer than English.** Never fix widths on buttons, chips or tab labels; use `min-width` + padding, allow tab labels to ellipsize, allow chips to scroll horizontally.
- Price format: `1 250 000 soʻm` with non-breaking spaces (`\u00A0`) between groups and before the currency; never wrap a price across lines. Old price uses strike-through in `{colors.mute}`.

## Layout

### Shells
- **App shell (< 1024px)**: sticky header (logo row + search pill), content, **bottom tab bar** (5 tabs: Bosh sahifa, Katalog, Savat, Sevimlilar, Profil). No utility bar, no hamburger.
- **Desktop shell (≥ 1024px)**: utility bar, primary nav (logo, categories, search pill, favorites, cart, profile), content with optional filter sidebar, footer. The bottom tab bar is not rendered.
- Safe areas: bottom tab bar, sticky buy bar and sticky checkout summary add `padding-bottom: env(safe-area-inset-bottom)`; viewport meta uses `viewport-fit=cover`.

### Spacing
- Base unit 8px; tokens `xxs`-`section` in front matter.
- Page edge padding: **12px** mobile, 24px tablet, up to ~80px at 1920 (content max-width ~1440px).
- Vertical rhythm between major blocks: `{spacing.section}` 48px desktop, 32px tablet, **24px mobile**.
- Product grid gutters: `{spacing.sm}` 8px (`{spacing.xs}` 4px is allowed below 360px).
- Card internal padding: 0; metadata rows sit directly under the image with 8px gaps.

### Grid
| Width | Product columns | Notes |
|---|---|---|
| 320-639 | 2 | App shell |
| 640-1023 | 3 | App shell |
| 1024+ | 4 (3 when filter sidebar is shown) | Desktop shell, sidebar ~220px |

Home page composition (mobile, top to bottom): sticky search → banner carousel → category grid (4 columns of icon cards, 2 rows, "Barchasi" last) → quick chips row ("Chegirmalar", "Yangi", "Ommabop", "Nasiya") → product rails (horizontal scroll, 2.3 cards visible, peek-next) → 2-up product grid ("Siz uchun") with infinite load.

### Whitespace philosophy
Same as Nike: whitespace separates, the `{colors.soft-cloud}` stage provides the "air". No decorative dividers between sections.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 Flat | no shadow, no border | cards, buttons, sections (default) |
| 1 Hairline | `1px solid {colors.hairline}` | input borders, accordion separators, footer |
| 2 Inset line | `inset 0 -1px 0 {colors.hairline-soft}` (bottom) or `inset 0 1px 0` (top) | sticky header bottom edge; bottom tab bar and sticky buy bar top edge |

No drop shadows anywhere in retail chrome. **Overlays** (bottom sheet, modal) are separated from content by a scrim `rgba(17,17,17,0.5)`, not by shadow. Sticky bars that overlap scrolling content stay opaque `{colors.canvas}`.

## Shapes

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0 | Product cards, product imagery, banners, tiles, sticky bars, footer |
| `{rounded.sm}` | 18px | Textarea, OTP boxes, avatar/icon containers |
| `{rounded.md}` | 24px | Search pill, text fields |
| `{rounded.lg}` | 30px | Every CTA pill, chip, badge, quantity stepper |
| `{rounded.full}` | 9999px | Swatch dots, circular icon buttons, carousel dots, avatar |

Photography geometry: product 1:1 on soft-cloud (contain, ~10% padding); PDP gallery 1:1 swipe on mobile, thumbnail rail on desktop; banner **16:9 desktop / 4:5 mobile** (art-directed pair); category icon card: ~72px line icon on `{colors.canvas}` with `{typography.caption-md}` label.

## Components

Each component covers Default and Active/Pressed; Hover applies only inside `@media (hover: hover)`; Focus-visible is always defined.

### Global interaction rules
- **Pressed:** `transform: scale(0.96)`, `opacity: 0.7`, `duration-instant`.
- **Hover (desktop only):** primary → background `{colors.charcoal}`; secondary and icon-circular → background `{colors.hairline-soft}`; text links → underline; chips → border `{colors.ink}`. Cards: no lift, no shadow; the product name gets underline.
- **Focus-visible:** `2px solid {colors.ink}` outline with `2px` offset on every interactive element (on ink surfaces use `{colors.canvas}` outline). Never remove outlines.
- **Touch target:** minimum 44x44 hit area (extend with padding/pseudo-element for 40px icon buttons).

### Buttons
- `button-primary`: ink pill, 48px, one per viewport fold. Disabled = `button-primary-disabled`.
- `button-secondary`: soft-cloud pill. Never next to a second primary.
- `button-outline-on-image`: white pill anchored bottom-left on banners.
- `button-icon-circular` (soft-cloud) and `button-icon-circular-ink` (quick "add to cart" on product card, 40px).
- Loading state: label replaced by a 20px spinner (linear rotate 800ms), width unchanged, button not clickable.

### Inputs & forms
- `search-pill` / `search-pill-focused` as in Nike (halo 12px soft-cloud). On mobile it is full width, 44px, with search icon left and voice/clear affordance right.
- `text-field` (checkout, login, address): 48px, `{rounded.md}`, hairline border; focus = 2px ink border + soft-cloud halo; error = `{colors.sale}` 2px border + 12px helper text in sale; label above in `{typography.caption-md}` ink. Textarea uses `{rounded.sm}`.
- Phone field: fixed `+998` prefix chip, 9-digit mask `XX XXX XX XX`, `inputMode="numeric"`, `autocomplete="tel-national"`.
- OTP: 6 boxes, each 48x56, `{rounded.sm}`, auto-advance, `autocomplete="one-time-code"`.
- Radio/checkbox rows (payment, delivery slot): full-width row, 56px, hairline divider; selected row shows ink ring icon (concentric ring like `swatch-dot-active`).

### Product card (`product-card`)
Order inside the card, 8px gaps:
1. Image stage 1:1 on soft-cloud (`product-card-image`). Top-left `badge-promo` (Yangi / Chegirma / Nasiya / Sotuvda yoʻq). Top-right `button-icon-circular` heart, 32px visual on canvas.
2. Product name, `{typography.product-name}`, clamp 2 lines.
3. Rating row: ink-filled star + `4.8` in `caption-sm` ink + `(124)` in mute. Hide when no reviews.
4. Price row: current price `{typography.price-md}` ink (or `{colors.sale}` when discounted), old price `caption-sm` mute strikethrough, `-20%` `caption-sm` sale.
5. Installment line (only if feature flag on): `Oyiga 187 500 soʻm × 12` in `caption-sm` mute.
6. Quick-add: `button-icon-circular-ink` aligned to the bottom-right of the card meta; replaced by a `quantity-stepper` after the first add.
Out of stock: image at 40% opacity, quick-add hidden, badge "Sotuvda yoʻq".

### Price block (PDP)
`{typography.price-lg}` current price; below: old price + `-NN%` in sale; below: installment panel on soft-cloud (month chips 3/6/12 using `filter-chip`, computed monthly amount, small legal note). Stock line: success "Omborda bor" / warning "Oxirgi N dona".

### Banners (`campaign-tile`)
Full-bleed, `{rounded.none}`, display headline uppercase burned into the image, one `button-outline-on-image` bottom-left. Carousel: 1 banner visible, 12px peek optional, pill dots (`{rounded.full}`) 6px, active dot 18px wide ink. Maximum 5 banners. **Placeholder banners** (demo phase) use soft-cloud stage + placeholder icon + display headline in ink.

### Category grid
4 columns on mobile (`category-icon-card`): 72px icon, `caption-md` label, max 2 lines, centered. "Barchasi" tile last. Tapping navigates to the listing.

### Filters & sorting
- Mobile: a sticky row under the header with `filter-chip`s (Saralash, Filtr, Narx, Brend ...). "Filtr" opens a **full-height bottom sheet** (slides up 250ms) with grouped sections (`heading-md`), a sticky footer with `button-secondary` "Tozalash" and `button-primary` "Natijalarni koʻrsatish (N)".
- Desktop: 220px left rail (Nike `filter-sidebar`), "Filtrlarni yashirish" toggle.
- Price range: two `text-field`s + dual-thumb slider (track `{colors.hairline-soft}`, fill ink, thumb 24px ink circle).

### Navigation
- **Mobile header (sticky)**: row 1 (scrolls away): logo-demo left, delivery city chip right. Row 2 (sticks): `search-pill` full width. Bottom edge: inset hairline-soft once scrolled.
- **Bottom tab bar** (`bottom-tab-bar`): 5 tabs; icon 24px, 1.75 stroke, outlined when inactive (`{colors.mute}`), filled when active (`{colors.ink}`); label `tab-label`. Cart tab shows a count badge: ink circle 18px, white 11px number (not red). Tap feedback: pressed rule. Hidden on PDP (replaced by `sticky-buy-bar`), checkout, auth screens, and when the on-screen keyboard is open.
- **Desktop primary nav**: Nike pattern, 64px height, logo left, category links center, right cluster (search pill, heart, bag with count, profile). Active link: 2px ink underline.
- **Back navigation**: sub-pages in the app shell show a 56px top bar: circular back button, centered title, optional action.

### PDP (mobile)
Swipe gallery 1:1 full-bleed with pill dots and a counter; title `heading-xl`; rating and review link; price block; short key specs (3-4 chips: RAM, ekran, rang); accordion rows (`pdp-disclosure-row`: Xususiyatlar, Tavsif, Yetkazib berish va qaytarish, Sharhlar (n)); related products rail; **`sticky-buy-bar`**: left = price (+ old price), right = `button-primary` "Savatga qoʻshish" (becomes quantity stepper + "Savatga oʻtish" after add).

### Cart
Line: 80px image on soft-cloud, name (2 lines), price-md, `quantity-stepper`, remove link in mute. Free-delivery progress: 4px bar, track hairline-soft, fill ink, text above in `caption-md`. Sticky summary bar above the safe area: total + `button-primary` "Buyurtma berish". Price-changed or stock-changed lines show a warning row in `{colors.warning}`.

### Checkout
Single page, stacked sections with `pdp-disclosure-row` headers that open one at a time: 1 Qabul qiluvchi, 2 Manzil (map or manual, saved address chips), 3 Yetkazib berish vaqti (date chips + slot rows), 4 Toʻlov usuli (cash / card on delivery; online methods only if feature flag on), 5 Buyurtma tarkibi. Sticky summary with total and primary CTA. Success screen: 64px check drawn with linear stroke animation, order number, `button-primary` "Buyurtmalarim", `button-secondary` "Xaridni davom ettirish".

### Order tracking (`order-status-stepper`)
Vertical list of statuses (Yangi, Tasdiqlandi, Yigʻilmoqda, Yoʻlda, Yetkazildi). Completed: filled ink dot 12px; current: concentric ring (ink ring, 2px gap, ink dot); upcoming: hairline ring. Connecting line 2px: `{colors.ink}` for completed segments, `{colors.hairline-soft}` after. Cancelled: single `{colors.sale}` line of text, no red backgrounds.

### Empty, loading, error states
- **Skeleton** (`skeleton`): `{colors.skeleton-base}` blocks matching the final layout (card image 1:1 + 2 text lines + price line); shimmer is a linear gradient to `{colors.skeleton-shine}` moving left-to-right in 1.2s, infinite, disabled under reduced motion.
- **Empty** (cart, favorites, orders, search): centered 96px line illustration (ink 1.75 stroke on canvas), `heading-lg` message, one `button-primary`.
- **Error**: same layout with retry `button-secondary`; inline field errors use the text-field error style.

### Toasts & sheets
Toast: ink pill, white `caption-md` text, appears 16px above the bottom tab bar, slides up 250ms, auto-dismiss 3s. Bottom sheet: canvas background, `{rounded.none}` corners (flat rule, no rounded top), a 4x40 pill drag handle in `{colors.hairline}`, scrim as defined in Elevation.

### Footer (desktop)
Nike pattern: four columns (Xaridorlarga, Yordam, Doʻkon haqida, Aksiyalar), fine-print row. On mobile the footer content moves into Profil → "Doʻkon haqida" and contact rows; the home page ends with a compact contact block (phone, address, working hours, Telegram link).

## Motion

> Principles: motion explains state change, never decorates. Simple, linear or near-linear, short. Animate only `transform` and `opacity` (exception: accordion height). Maximum **2 simultaneous animations** per screen region. Use the `motion` library for orchestrated animations and plain CSS transitions for simple states.

### Tokens
`duration-instant` 100ms (press), `duration-fast` 150ms (micro), `duration-base` 250ms (most UI), `duration-slow` 400ms (hero, fly-to-cart, progress). Easing: `ease-standard` for most, `ease-enter` for entering, `ease-exit` for exiting, `ease-linear` for progress, loaders and shimmer.

### Catalog of animations
| Element | Animation | Spec |
|---|---|---|
| Route change | fade + 8px translateY up | 250ms, ease-enter; exit fade 150ms |
| Bottom tab indicator / active icon | opacity + fill swap | 150ms |
| Product card first appearance | fade + 8px up, stagger 40ms, max 6 items, **first mount only** | 250ms |
| Product image load | opacity 0 → 1 | 250ms |
| Skeleton shimmer | linear gradient sweep | 1200ms linear infinite |
| Banner carousel | slide, autoplay 5s, pauses on touch | 400ms ease-standard |
| Favorite heart | scale 1 → 1.2 → 1, fill swap | 150ms + 150ms |
| **Add to cart** | product thumbnail (48px) flies in a straight line from the button to the cart tab icon, scaling to 0.3 and fading at the end | 400ms linear; then cart badge scale 1 → 1.25 → 1 (150ms ×2) |
| Quantity stepper | number slides vertically 8px with fade | 150ms |
| Accordion | height auto + chevron rotate 180° | 250ms ease-standard |
| Bottom sheet / filter drawer | translateY 100% → 0, scrim fade | 250ms enter / 150ms exit |
| Toast | translateY 16px + fade | 250ms in, 150ms out |
| Free-delivery progress bar / order stepper line | width/scaleX fill | 400ms linear |
| Success check | stroke-dashoffset draw | 400ms linear |
| Button loading | spinner rotate | 800ms linear infinite |
| Search pill focus | border + halo transition | 150ms |

### Rules
- `prefers-reduced-motion: reduce`: remove translate/scale/fly animations, keep opacity fades at 100ms, stop shimmer and autoplay. Implement once via `MotionConfig reducedMotion="user"` and a global CSS media query.
- No parallax, no scroll-jacking, no looping decorative animation, no bounce/spring overshoot except the 1.2 heart/badge pop.
- Never block interaction on an animation: the fly-to-cart must not delay the cart state update.
- Keep the cost low: no animation on lists beyond the first screenful; use `will-change` only during an animation.

## Imagery & Placeholders (demo phase)

The demo phase has **no real photos and a demo logo.** The rules below make the temporary assets consistent and trivially replaceable.

- **Brand config:** store name, logo path, contact data and delivery settings live in one file, `src/config/brand.ts`. Nothing else hardcodes them.
- **Demo logo:** `public/brand/logo-demo.svg` (wordmark "TEXNO DEMO" with a square mark). Replace the file and the config name later.
- **Placeholder image:** `public/placeholders/image-placeholder.svg`, a flat gray "picture" icon (frame, sun, mountains) as in the supplied reference. It is rendered centered on `{colors.soft-cloud}` at ~40% of the container size.
- **`<ProductImage>` component** (single entry point for all product/banner images): renders `next/image` when a real `src` exists, otherwise the placeholder; always reserves the aspect ratio (no layout shift); on image error falls back to the placeholder; adds the soft-cloud stage.
- **Generated demo images (optional):** if the agent environment can generate images, create temporary product images under `public/demo/products/<slug>-1.webp` and banners under `public/demo/banners/`. Requirements: studio product shot on a seamless `#f5f5f5` background, soft light from the top-left, product centered with ~10% margin, 1:1, 1200px, WebP, **no text, no real brand logos, no recognizable trademarks, generic industrial design only**. Banner pairs: 16:9 and 4:5 crops of the same scene, with empty space bottom-left for the headline.
- **If image generation or internet access is unavailable:** use the placeholder SVG. Never hotlink external images, never commit large binaries (> 300 KB per image).
- **Category icons:** 24-72px line icons (1.75 stroke, `{colors.ink}`, round caps/joins), one SVG per category in `public/icons/categories/`, drawn in the same style as the placeholder. Use `lucide-react` icons first; draw custom SVG only when lucide has no suitable icon.
- **Real photo requirements (for later):** square, product centered, neutral background (backgrounds are removed and replaced by the soft-cloud stage), min 1200px, WebP/AVIF, 3-6 images per product.

## Responsive Behavior

| Name | Width | Key changes |
|---|---|---|
| mobile-small | 320-359 | 2-up grid with 4px gutters, tab labels may ellipsize |
| mobile | 360-639 | App shell, 2-up grid, 12px edge padding |
| tablet | 640-1023 | App shell, 3-up grid, 24px padding, banner 16:9 |
| desktop | 1024-1439 | Desktop shell, 4-up grid (3 with sidebar), top nav |
| desktop-large | 1440+ | Content max-width ~1440px, gutters grow to ~80px at 1920 |

### Collapsing strategy
- Primary nav: desktop row → bottom tab bar + sticky search.
- Filters: desktop sidebar → mobile bottom sheet.
- Section spacing: 48 → 32 → 24px.
- Display headline: 96 → 64 (tablet) → 40px (mobile), line height stays 0.9.
- Banners: 16:9 on ≥640, 4:5 below.
- Tables (specs): two-column key/value rows, never horizontal scroll.

### Touch targets
Minimum 44x44; pills are 48px; icon-circular 40px with extended hit area; tab bar items are full 56px height.

## Accessibility
- Text contrast ≥ 4.5:1 (`mute` on `canvas` is allowed; `stone` is not for readable text). Sale red on white passes.
- Every icon-only button has `aria-label` in the active locale; the heart toggle uses `aria-pressed`; the cart badge is announced ("Savat, 3 ta mahsulot").
- Carousels have pause on focus/touch, keyboard arrows, and visible focus.
- Forms: associated labels, `aria-describedby` for errors, correct `autocomplete` and `inputMode`.
- The document language attribute follows the active locale (`uz` or `ru`).

## Do's and Don'ts

### Do
- Keep ink pill as the single primary action per fold; pair at most with a secondary.
- Stage every product on `{colors.soft-cloud}`.
- Use `{colors.sale}` only on prices, `-NN%` and form errors.
- Use tokens from this file only; add a token here before using a new value.
- Keep cards flat; let hairlines and photography create structure.
- Keep all price strings on one line with non-breaking spaces.
- Provide skeleton, empty and error states for every data-driven view.

### Don't
- Don't add drop shadows, gradients, glassmorphism or elevated cards.
- Don't use colors for category decoration (no pink/purple/teal accents).
- Don't use red for badges, tab badges or chrome.
- Don't create square or `{rounded.sm}` buttons; pill or circular only.
- Don't pad the image stage unevenly; the contain padding is uniform 10%.
- Don't hardcode text, store name, colors, radii or durations in components.
- Don't animate layout properties (except accordion height) or run more than 2 animations at once.
- Don't show the bottom tab bar on PDP, checkout or auth screens.

## Implementation Notes
- Mirror the front matter 1:1 as CSS variables in `app/globals.css` and expose them in the Tailwind theme (`ink`, `canvas`, `soft-cloud`, `hairline`, `sale`, ...). Components must use semantic Tailwind classes (`bg-ink`, `text-mute`, `rounded-lg`), never raw hex.
- If shadcn/ui primitives are used, restyle them to this system (radius, no shadow, focus ring) before using them in screens.
- Build and verify components in the `/dev/gallery` route first (all states: default, pressed, focus, disabled, loading, error, skeleton, empty, uz/ru long text).
- Run `npx @google/design.md lint DESIGN.md` after any edit to this file (if the CLI is available in the environment).

## Iteration Guide
1. One component per task. Resolve every property from the front matter before writing code.
2. Reference tokens by name (`{colors.ink}`, `{rounded.lg}`), never paraphrase values in prose.
3. Add variants as separate entries (`-active`, `-disabled`, `-focused`, `-error`).
4. Default body to `body-md`; names to `product-name`; prices to `price-md` / `price-lg`.
5. Keep `{colors.ink}` scarce: at most one solid black pill/block per fold. Cart badge and tab states are the allowed exceptions.
6. Before adding a new component, try to express it with pill + flat card + photography-on-soft-cloud.
7. Check each screen at 360px and 1280px, in Uzbek and Russian, with the longest strings.

## Known Gaps
- Real brand identity (logo, final fonts, optional accent color) is pending; swap via `brand.ts` and tokens.
- Dark mode, RTL and a courier/driver UI are out of scope for v1.
- Map component styling for address selection is defined at implementation time (Stage 4) and must be added here afterwards.
- Installment (nasiya) legal copy is a placeholder until the store defines its partner banks and terms.
