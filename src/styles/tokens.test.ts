import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { it, expect, describe } from "vitest";
import { tokenNames } from "./tokenNames";
const design = parse(
  readFileSync("DESIGN.md", "utf8").split("---")[1],
) as Record<
  string,
  Record<string, string | number | Record<string, string | number>>
>;
const css = readFileSync("src/app/globals.css", "utf8");
for (const group of [
  "colors",
  "rounded",
  "spacing",
  "motion",
  "typography",
] as const) {
  describe(group, () => {
    it("gallery contains every token name", () =>
      expect([...tokenNames[group]].sort()).toEqual(
        Object.keys(design[group]).sort(),
      ));
    for (const [name, value] of Object.entries(design[group])) {
      if (typeof value === "object")
        for (const [prop, v] of Object.entries(value))
          it(`${name}.${prop}`, () =>
            contains(`--${group}-${name}-${prop}: ${v};`));
      else it(name, () => contains(`--${group}-${name}: ${value};`));
    }
  });
}
it("exposes semantic Tailwind aliases", () => {
  for (const [group, prefix] of [
    ["colors", "color"],
    ["rounded", "radius"],
    ["spacing", "spacing"],
  ])
    for (const name of Object.keys(design[group]))
      contains(`--${prefix}-${name}: var(--${group}-${name});`);
  for (const name of Object.keys(design.motion))
    contains(`--${name}: var(--motion-${name});`);
  for (const name of Object.keys(design.typography)) {
    contains(
      `--text-${name}: var(--size-${name}, var(--typography-${name}-fontSize));`,
    );
    contains(
      `--text-${name}--font-weight: var(--typography-${name}-fontWeight);`,
    );
  }
});
it("rejects raw hex, shadows and gradients in app/components", () => {
  function scan(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) scan(path);
      else if (
        /\.(tsx?|css)$/.test(path) &&
        !path.endsWith("globals.css") &&
        !path.includes(".test.")
      )
        expect(readFileSync(path, "utf8"), path).not.toMatch(
          /#[0-9a-f]{3,8}\b|box-shadow|drop-shadow|(?:linear|radial)-gradient/i,
        );
    }
  }
  scan("src/app");
  scan("src/components");
});

function contains(value: string) {
  expect(css.replace(/\s/g, "")).toContain(value.replace(/\s/g, ""));
}
