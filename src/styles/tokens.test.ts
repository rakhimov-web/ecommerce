import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { describe, it, expect } from "vitest";
import tokens from "./tokens.json";
const design = parse(readFileSync("DESIGN.md", "utf8").split("---")[1]);
const css = readFileSync("src/app/globals.css", "utf8");
describe("design contract", () => {
  for (const group of [
    "colors",
    "rounded",
    "spacing",
    "motion",
    "typography",
  ]) {
    it(`${group} generated data matches the source`, () =>
      expect(tokens[group as keyof typeof tokens]).toEqual(design[group]));
    for (const [key, value] of Object.entries(design[group])) {
      if (typeof value === "object" && value !== null) {
        for (const [prop, v] of Object.entries(value))
          it(`${key}.${prop}`, () =>
            expect(css).toContain(`--${group}-${key}-${prop}: ${v};`));
      } else
        it(`${group}.${key}`, () =>
          expect(css).toContain(`--${group}-${key}: ${value};`));
    }
  }
  it("has no raw hex, shadow or gradient in application styles/components", () => {
    function scan(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) scan(p);
        else if (
          /\.(tsx?|css)$/.test(p) &&
          !p.endsWith("globals.css") &&
          !p.includes(".test.")
        )
          expect(readFileSync(p, "utf8")).not.toMatch(
            /#[0-9a-f]{3,8}\b|box-shadow|drop-shadow|linear-gradient/i,
          );
      }
    }
    scan("src/app");
    scan("src/components");
  });
});

it("exposes every token group to Tailwind", () => {
  for (const [group, prefix] of [
    ["colors", "color"],
    ["rounded", "radius"],
    ["spacing", "spacing"],
  ]) {
    for (const key of Object.keys(design[group]))
      expect(css).toContain(`--${prefix}-${key}: var(--${group}-${key})`);
  }
  for (const key of Object.keys(design.motion))
    expect(css).toContain(`--${key}: var(--motion-${key})`);
  for (const key of Object.keys(design.typography))
    expect(css).toContain(`--text-${key}: var(--typography-${key}-fontSize)`);
});
