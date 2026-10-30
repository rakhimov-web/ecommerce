export function normalizeSearch(input: string): string {
  return input
    .toLowerCase()
    .replace(/['ʻʼ‘’`]/g, "'")
    .normalize("NFD")
    .replace(/([a-z])\p{M}+/gu, "$1")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ");
}
