import { format } from "prettier";
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";
const design = parse(readFileSync("DESIGN.md", "utf8").split("---")[1]);
let css =
  '/* Generated from DESIGN.md by pnpm tokens. */\n@import "tailwindcss";\n:root {\n';
for (const group of ["colors", "rounded", "spacing", "motion", "typography"]) {
  for (const [name, value] of Object.entries(design[group])) {
    if (typeof value === "object")
      for (const [prop, v] of Object.entries(value))
        css += `--${group}-${name}-${prop}: ${v};\n`;
    else css += `--${group}-${name}: ${value};\n`;
  }
}
for (const [name, props] of Object.entries(design.components)) {
  if (props.padding) css += `--component-${name}-padding: ${props.padding};\n`;
}
css += "}\n@theme inline {\n";
for (const [group, prefix] of [
  ["colors", "color"],
  ["rounded", "radius"],
  ["spacing", "spacing"],
])
  for (const name of Object.keys(design[group]))
    css += `--${prefix}-${name}: var(--${group}-${name});\n`;
for (const name of Object.keys(design.motion))
  css += `--${name}: var(--motion-${name});\n`;
for (const name of Object.keys(design.typography)) {
  css += `--text-${name}: var(--size-${name}, var(--typography-${name}-fontSize));\n--text-${name}--line-height: var(--typography-${name}-lineHeight);\n--text-${name}--font-weight: var(--typography-${name}-fontWeight);\n`;
}
css +=
  "--font-ui: var(--font-inter);\n--font-display: var(--font-oswald);\n}\n";
for (const [name, props] of Object.entries(design.typography))
  css += `.type-${name}{font-family:var(--font-${props.fontFamily.toLowerCase()}),sans-serif;font-size:var(--size-${name},var(--typography-${name}-fontSize));font-weight:var(--typography-${name}-fontWeight);line-height:var(--typography-${name}-lineHeight);${props.textTransform ? "text-transform:var(--typography-" + name + "-textTransform);letter-spacing:var(--typography-" + name + "-letterSpacing);" : ""}}\n`;
for (const name of Object.keys(design.motion).filter((n) =>
  n.startsWith("duration-"),
))
  css += `@utility ${name}{transition-duration:var(--motion-${name});}\n`;
css += readFileSync("src/styles/base.css", "utf8");
css += readFileSync("src/styles/components.css", "utf8");
css += readFileSync("src/styles/home.css", "utf8");
writeFileSync("src/app/globals.css", await format(css, { parser: "css" }));
writeFileSync(
  "src/styles/tokenNames.ts",
  "// Generated from DESIGN.md.\nexport const tokenNames = " +
    JSON.stringify(
      Object.fromEntries(
        ["colors", "typography", "rounded", "spacing", "motion"].map((g) => [
          g,
          Object.keys(design[g]),
        ]),
      ),
      null,
      2,
    ) +
    " as const;\n",
);
const channels = design.colors.canvas
  .slice(1)
  .match(/../g)
  .map((hex) => Number.parseInt(hex, 16));
writeFileSync(
  "src/lib/theme.ts",
  `// Generated from the canvas token in DESIGN.md.\nexport const themeColor = 'rgb(${channels.join(" ")})';\n`,
);
