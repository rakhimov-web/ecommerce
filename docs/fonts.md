# Local font provenance

The files were fetched from Google's official `google/fonts` repository:

- `ofl/inter/Inter[opsz,wght].ttf`
- `ofl/oswald/Oswald[wght].ttf`

Their OFL licenses are in `src/assets/fonts/`. Inter retains its variable weights for 400/500/600/700; Oswald is loaded at 500. Both use swap rendering.

To reproduce each WOFF2 subset, install FontTools with Brotli and run against the official source:

```sh
pyftsubset input.ttf --output-file=output.woff2 --flavor=woff2 --unicodes=U+0000-052F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF --layout-features='*'
```

Glyph coverage was checked for Uzbek modifier apostrophes and Russian Cyrillic, including Й/Ё. The gallery shows both languages in both fonts.
