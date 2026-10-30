export function formatPrice(amount: number): string {
  if (!Number.isSafeInteger(amount))
    throw new RangeError("Price must be a safe integer");
  const grouped = String(Math.abs(amount)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "\u00a0",
  );
  return `${amount < 0 ? "-" : ""}${grouped}\u00a0soʻm`;
}
