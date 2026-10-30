import { z } from "zod";
export function formatPrice(amount: number) {
  if (!Number.isSafeInteger(amount))
    throw new RangeError("Expected safe integer UZS");
  return `${amount.toLocaleString("en-US").replaceAll(",", "\u00a0")}\u00a0soʻm`;
}
export const phoneSchema = z.string().regex(/^\+998\d{9}$/);
export function parsePhone(input: string) {
  if (!/^[+\d\s()-]+$/.test(input)) throw new Error("Invalid phone");
  const digits = input.replace(/\D/g, "");
  return phoneSchema.parse(
    digits.length === 9 ? `+998${digits}` : `+${digits}`,
  );
}
export function formatPhone(input: string) {
  const p = parsePhone(input);
  return `${p.slice(0, 4)} ${p.slice(4, 6)} ${p.slice(6, 9)} ${p.slice(9, 11)} ${p.slice(11)}`;
}
export function normalizeSearch(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/(?<=[a-z])\p{M}/gu, "")
    .normalize("NFC")
    .replace(/['ʻʼ‘’`]/g, "'")
    .trim()
    .replace(/\s+/g, " ");
}
export function discountPercent(price: number, oldPrice: number) {
  if (
    !Number.isSafeInteger(price) ||
    !Number.isSafeInteger(oldPrice) ||
    price < 0 ||
    oldPrice < 0
  )
    throw new RangeError("Expected nonnegative integer UZS");
  return oldPrice <= price
    ? 0
    : Math.round(((oldPrice - price) / oldPrice) * 100);
}
