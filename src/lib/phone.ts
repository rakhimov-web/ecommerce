import { z } from "zod";
export const phoneSchema = z.string().regex(/^\+998\d{9}$/);
export function parsePhone(input: string): string {
  if (!/^\+?[\d ()-]+$/.test(input)) throw new Error("Invalid phone format");
  const digits = input.replace(/\D/g, "");
  return phoneSchema.parse(
    digits.length === 9 && !input.startsWith("+")
      ? `+998${digits}`
      : `+${digits}`,
  );
}
export function formatPhone(input: string): string {
  const p = parsePhone(input);
  return `${p.slice(0, 4)} ${p.slice(4, 6)} ${p.slice(6, 9)} ${p.slice(9, 11)} ${p.slice(11)}`;
}
