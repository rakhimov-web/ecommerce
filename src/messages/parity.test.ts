import { it, expect } from "vitest";
import uz from "./uz.json";
import ru from "./ru.json";
function flatten(value: object, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, v]) =>
      typeof v === "string"
        ? [[prefix + key, v]]
        : Object.entries(flatten(v, prefix + key + ".")),
    ),
  );
}
it("both locales have identical keys and nonempty values", () => {
  const a = flatten(uz),
    b = flatten(ru);
  expect(Object.keys(a).sort()).toEqual(Object.keys(b).sort());
  for (const text of [...Object.values(a), ...Object.values(b)])
    expect(text.trim()).not.toBe("");
});
it("Uzbek punctuation uses the required codepoints", () => {
  expect(JSON.stringify(uz)).not.toMatch(/['‘’`]/);
  expect(uz.common.sampleUz).toContain("ʻ");
  expect(uz.common.sampleUz).toContain("ʼ");
});
