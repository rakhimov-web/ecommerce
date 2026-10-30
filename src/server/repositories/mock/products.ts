import { brand } from "@/config/brand";
import type { Product } from "@/features/catalog/types";
// Presentation fixtures only: no repositories, fetching or cart persistence in Stage 1B.
export const demoProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `demo-${i + 1}`,
  image: i % 3 === 0 ? undefined : brand.placeholder,
  name: {
    uz:
      i === 4
        ? "Aurora — uy uchun juda uzun nomli, ixcham va qulay simsiz qurilma"
        : "Aurora " +
          ["Smartfon", "Noutbuk", "Quloqchin", "Changyutgich"][i % 4],
    ru:
      i === 4
        ? "Aurora — компактное беспроводное устройство с очень длинным названием для дома"
        : "Aurora " + ["Смартфон", "Ноутбук", "Наушники", "Пылесос"][i % 4],
  },
  price: 1250000 + i * 150000,
  oldPrice: i % 3 === 0 ? 1900000 + i * 150000 : undefined,
  stock: i === 1 ? 0 : i === 2 ? 2 : 12,
  rating: i === 3 ? undefined : { average: 4.8, count: 124 },
  badge: i % 3 === 0 ? "sale" : i % 3 === 1 ? "new" : undefined,
}));
