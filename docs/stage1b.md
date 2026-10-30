# Stage 1B: components and shell

## Verify

```sh
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm dev
```

Browse `/uz`, `/uz/catalog`, `/uz/cart`, `/uz/favorites`, `/uz/profile` (and their `/ru` equivalents). Below 1024px the logo scrolls away, search sticks, and five bottom tabs navigate. At 1024px desktop utility/navigation/footer replace the mobile chrome. `/uz/info/demo` demonstrates the `(no-tabs)` route group and BackBar. Keyboard viewport shrink hides the bottom tabs when an input is being edited.

`/dev/gallery` is excluded from production route discovery. It contains the control states, long Uzbek/Russian button examples, locale switcher, interactive forms, sheet and toast triggers, token samples and a twelve-item product grid at 2/3/4 columns. Screenshots of gallery and all five pages at 360/1280 are in `docs/screenshots/stage1b-*`, each below 300 KB.

## Component contracts

- Button supports variants, sizes, disabled/loading semantics and `href`. Its original label reserves width during loading and a separate screen-reader label stays accessible.
- IconButton requires `aria-label`. Chip is a pressed-state button; ChipRow scrolls without edge fades.
- SearchPill, PhoneField and OtpInput support `value`/`onValueChange` or local `defaultValue`. PhoneField emits an E.164-shaped partial string during editing; validate complete submissions with the existing `phoneSchema`. OtpInput supports paste and directional keyboard navigation.
- TextField associates labels, help and errors. PriceBlock handles integer UZS, discounts and the brand installment flag. ProductImage reserves square geometry and supports contain/cover with fallback/reset on source changes.
- BottomSheet is controlled by `open`/`onClose`. It traps/restores focus, marks background siblings inert, locks scrolling and handles Escape/backdrop dismissal. Its portal has matching server/client hydration behavior.
- Toast announces status, offers dismissal, and defaults to three seconds. Render conditional Toast instances inside AnimatePresence for exit motion.
- ProductCard receives a typed Product view model, quantity, liked state and callbacks. It fetches and persists nothing. Fixtures in `src/server/repositories/mock/products.ts` exercise stock, discount, missing image/rating and long-name cases.
- ShopShell accepts `noTabBar` and an optional cart count; no real cart is implemented. A route-group layout sets the tab policy. MotionProvider applies reduced-motion preferences to all app children. CSS handles simple transitions; motion handles accordion height, sheet and toast.

## Validation and assumptions

All Stage 1A tests remain in place. Additional tests exercise interaction, validation semantics, product states, navigation, toast timers and accessibility in both locales. Motion constants are checked against DESIGN.md. Unit axe checks exclude contrast because jsdom has no visual layout/canvas; Chromium axe checks include contrast and found no WCAG 2A/AA violations in the gallery at 320/360/1280 in both locales. These checks are not a full manual accessibility or cross-browser certification.

The pages are intentionally placeholders. The demo gallery owns transient quantity/favorite state solely to show controlled component behavior; there is no cart domain logic, fetching, storage, auth or database. Installment rendering stays behind the default-off brand flag. Search accepts text but does not fetch results.

The supplied SVG references Oswald internally, but standalone SVG image documents cannot inherit next/font and its fallback wordmark clips. BrandLogo uses the unchanged supplied square mark and renders the configured store name with local Oswald. Supplied spec files and SVGs remain byte-identical.

No network assets or new state/form/styling libraries were added. New dependencies: motion for the specified animations, lucide-react for the specified icons, axe-core for accessibility assertions (it includes its own TypeScript definitions).

Next: Stage 2 mock catalog flows, using these components and repository interfaces.
