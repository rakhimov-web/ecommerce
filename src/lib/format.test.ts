import { describe, it, expect } from "vitest";
import {
  formatPrice,
  parsePhone,
  formatPhone,
  phoneSchema,
  normalizeSearch,
  discountPercent,
} from "./format";
describe("UZS integers", () => {
  it.each([
    [0, "0"],
    [1, "1"],
    [1000, "1\u00a0000"],
    [1250000, "1\u00a0250\u00a0000"],
    [-1000, "-1\u00a0000"],
  ])("formats %s", (n, s) =>
    expect(formatPrice(n)).toBe(
      s.replaceAll("\\u00a0", "\u00a0") + "\u00a0soʻm",
    ),
  );
  it.each([1.1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects %s",
    (n) => expect(() => formatPrice(n)).toThrow(),
  );
});
describe("phone", () => {
  it.each(["+998901234567", "90 123 45 67", "+998 (90) 123-45-67"])(
    "parses %s",
    (s) => expect(parsePhone(s)).toBe("+998901234567"),
  );
  it("formats", () =>
    expect(formatPhone("+998901234567")).toBe("+998 90 123 45 67"));
  it.each([
    "",
    "abc",
    "+79991234567",
    "+99890123456",
    "+9989012345678",
    "+99890abc1234567",
  ])("rejects %s", (s) => expect(() => parsePhone(s)).toThrow());
  it("schema rejects display storage", () =>
    expect(phoneSchema.safeParse("+998 90 123 45 67").success).toBe(false));
});
describe("search", () => {
  it.each(["Oʻzbek", "O'zbek", "o‘zbek", "OʼZBEK", "o`zbek", "o’zbek"])(
    "normalizes %s",
    (s) => expect(normalizeSearch(s)).toBe("o'zbek"),
  );
  it("collapses whitespace", () =>
    expect(normalizeSearch("  SALOM   dunyo ")).toBe("salom dunyo"));
  it("strips Latin accents", () =>
    expect(normalizeSearch("Café")).toBe("cafe"));
  it("preserves Cyrillic", () =>
    expect(normalizeSearch(" ЙОГУРТ ЁЛКА ")).toBe("йогурт ёлка"));
  it("handles empty", () => expect(normalizeSearch(" ")).toBe(""));
});
describe("discount", () => {
  it.each([
    [80, 100, 20],
    [100, 100, 0],
    [200, 100, 0],
    [0, 0, 0],
    [0, 100, 100],
    [66, 100, 34],
    [2, 3, 33],
  ])("%s / %s", (p, o, d) => expect(discountPercent(p, o)).toBe(d));
  it("rejects negative money", () =>
    expect(() => discountPercent(-1, 100)).toThrow());
});
