import { it, expect } from "vitest";
import uz from "./uz.json";
import ru from "./ru.json";
function flatten(value: object, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([k, v]) =>
      typeof v === "string"
        ? [[`${prefix}${k}`, v]]
        : Object.entries(flatten(v, `${prefix}${k}.`)),
    ),
  );
}
it("locales have identical nonempty key sets", () => {
  const a = flatten(uz),
    b = flatten(ru);
  expect(Object.keys(a).sort()).toEqual(Object.keys(b).sort());
  for (const value of [...Object.values(a), ...Object.values(b)])
    expect(value.trim().length).toBeGreaterThan(0);
});
it("Uzbek punctuation is canonical", () => {
  expect(JSON.stringify(uz)).not.toMatch(/[‘’`']/);
  expect(uz.common.language).toContain("ʻ");
});
