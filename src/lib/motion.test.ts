import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { it, expect } from "vitest";
import { motionTokens } from "./motion";
it("motion constants mirror every DESIGN.md duration and easing", () => {
  const design = parse(readFileSync("DESIGN.md", "utf8").split("---")[1]);
  for (const [name, seconds] of Object.entries(motionTokens.duration))
    expect(`${seconds * 1000}ms`).toBe(design.motion[`duration-${name}`]);
  for (const [name, points] of Object.entries(motionTokens.ease)) {
    const expected = design.motion[`ease-${name}`];
    expect(
      name === "linear" ? "linear" : `cubic-bezier(${points.join(", ")})`,
    ).toBe(expected);
  }
});
