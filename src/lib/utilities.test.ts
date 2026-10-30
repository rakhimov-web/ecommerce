import { describe, it, expect } from "vitest";
import { formatPrice } from "./formatPrice";
import { formatPhone, parsePhone, phoneSchema } from "./phone";
import { normalizeSearch } from "./normalizeSearch";
import { discountPercent } from "./discountPercent";
import { envSchema } from "./env";
describe("integer UZS", () => {
  it.each([
    [0, "0"],
    [12, "12"],
    [999, "999"],
    [1000, "1\u00a0000"],
    [1250000, "1\u00a0250\u00a0000"],
    [-1250000, "-1\u00a0250\u00a0000"],
    [-0, "0"],
  ])("formats %s", (value, text) =>
    expect(formatPrice(value)).toBe(text + "\u00a0soʻm"),
  );
  it.each([0.1, -1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects %s",
    (value) => expect(() => formatPrice(value)).toThrow(RangeError),
  );
});
describe("Uzbek phone numbers", () => {
  it.each([
    "+998901234567",
    "998901234567",
    "901234567",
    "90 123 45 67",
    "+998 (90) 123-45-67",
  ])("parses %s", (input) => expect(parsePhone(input)).toBe("+998901234567"));
  it.each([
    "",
    "+901234567",
    "++998901234567",
    "998+901234567",
    "+79991234567",
    "+99890123456",
    "+9989012345678",
    "90ABC1234567",
  ])("rejects %s", (input) => expect(() => parsePhone(input)).toThrow());
  it("formats storage", () =>
    expect(formatPhone("+998901234567")).toBe("+998 90 123 45 67"));
  it("round trips display", () =>
    expect(parsePhone(formatPhone("+998901234567"))).toBe("+998901234567"));
  it("schema requires E.164 storage", () => {
    expect(phoneSchema.safeParse("+998901234567").success).toBe(true);
    expect(phoneSchema.safeParse("90 123 45 67").success).toBe(false);
  });
});
describe("search normalization", () => {
  it.each(["Oʻzbek", "O'zbek", "o‘zbek", "OʼZBEK", "O’ZBEK", "o`zbek"])(
    "normalizes %s",
    (input) => expect(normalizeSearch(input)).toBe("o'zbek"),
  );
  it("normalizes whitespace", () =>
    expect(normalizeSearch("  SALOM\n  dunyo  ")).toBe("salom dunyo"));
  it("strips safe Latin accents", () =>
    expect(normalizeSearch("Café résumé")).toBe("cafe resume"));
  it("preserves Cyrillic distinctions", () =>
    expect(normalizeSearch("ЙОГУРТ ЁЛКА")).toBe("йогурт ёлка"));
  it("handles empty input", () => expect(normalizeSearch(" \t ")).toBe(""));
  it("is idempotent", () => {
    const s = normalizeSearch(" OʻZBEK  café ");
    expect(normalizeSearch(s)).toBe(s);
  });
});
describe("discount arithmetic", () => {
  it.each([
    [75, 100, 25],
    [100, 100, 0],
    [150, 100, 0],
    [0, 0, 0],
    [0, 100, 100],
    [2, 3, 33],
    [1, 3, 67],
  ])("%s / %s", (price, old, expected) =>
    expect(discountPercent(price, old)).toBe(expected),
  );
  it.each([
    [-1, 10],
    [1, -10],
    [1.5, 10],
    [1, NaN],
  ])("rejects invalid money %s / %s", (p, o) =>
    expect(() => discountPercent(p, o)).toThrow(RangeError),
  );
});
it("validates environment URL without secrets", () => {
  expect(envSchema.parse({}).SITE_URL).toBe("http://localhost:3000");
  expect(envSchema.safeParse({ SITE_URL: "bad" }).success).toBe(false);
});
