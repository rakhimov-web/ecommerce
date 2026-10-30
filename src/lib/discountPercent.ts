export function discountPercent(price: number, oldPrice: number): number {
  if (
    !Number.isSafeInteger(price) ||
    !Number.isSafeInteger(oldPrice) ||
    price < 0 ||
    oldPrice < 0
  )
    throw new RangeError("Prices must be nonnegative safe integers");
  return oldPrice <= price
    ? 0
    : Math.round(((oldPrice - price) / oldPrice) * 100);
}
