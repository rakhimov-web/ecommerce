# Offline fonts

Source: Google's official `google/fonts` repository, `ofl/inter/Inter[opsz,wght].ttf` and `ofl/oswald/Oswald[wght].ttf`. The accompanying OFL licenses are committed next to the fonts.

To reproduce the bundled WOFF2 files with FontTools and Brotli installed, download the originals from `raw.githubusercontent.com/google/fonts/main/ofl/` and run for each font:

```sh
pyftsubset input.ttf --output-file=output.woff2 --flavor=woff2 --unicodes=U+0000-052F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF --layout-features='*'
```

The variable Inter file retains the requested 400/500/600/700 weights; Oswald is loaded at 500. Both use `display: swap`. All app assets are served locally.
