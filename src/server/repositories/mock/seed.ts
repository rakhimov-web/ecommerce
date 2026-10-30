import type { CatalogData, Product } from "@/features/catalog/types";
import {
  productSchema,
  bannerSchema,
  infoPageSchema,
  categoryNodeSchema,
  brandSchema,
  attributeDefSchema,
} from "@/features/catalog/schemas";
import { brand as store } from "@/config/brand";
import {
  roots,
  childNames,
  categories,
  brands,
  attributeDefs,
} from "./taxonomy";
const products: Product[] = Array.from({ length: 30 }, (_, i) => {
  const group = i % 8;
  const parent = roots[group];
  const categoryId = parent[4][Math.floor(i / 8) % 3];
  const maker = brands[i % 6];
  const model = `D${String(i + 1).padStart(3, "0")}`;
  const price = i === 29 ? 25000000 : 150000 + i * 550000;
  const oldPrice = i % 3 === 0 ? Math.round(price * 1.25) : undefined;
  const stock = [0, 10, 20].includes(i)
    ? 0
    : [1, 7, 17, 27].includes(i)
      ? (i % 3) + 1
      : ((i * 7) % 37) + 4;
  const attributes = Object.fromEntries(
    attributeDefs
      .filter((def) => def.categoryId === parent[0])
      .map((def) => [
        def.key,
        (def.values ?? [])[
          (def.key === "color" ? i : Math.floor(i / 8)) %
            (def.values?.length ?? 1)
        ],
      ]),
  );
  const name = {
    uz: `${maker.name} ${childNames[categoryId].uz} ${model}${i === 4 ? " — uy uchun qulay, ixcham va koʻp funksiyali namuna" : ""}`,
    ru: `${maker.name} ${childNames[categoryId].ru} ${model}${i === 4 ? " — удобная компактная многофункциональная модель для дома" : ""}`,
  };
  const timestamp = `2026-09-${String((i % 28) + 1).padStart(2, "0")}T08:00:00.000Z`;
  return {
    id: `product-${String(i + 1).padStart(2, "0")}`,
    slug: `${maker.slug}-${categoryId}-${model.toLowerCase()}`,
    sku: `DEMO-${model}`,
    model,
    categoryId,
    brandId: maker.id,
    name,
    description: {
      uz: `${name.uz}. Oʻzbek xonadoni uchun kundalik foydalanishga mos demo mahsulot. Ishonchli yigʻilish va qulay boshqaruv.`,
      ru: `${name.ru}. Демонстрационный товар для ежедневного использования дома. Надёжная сборка и удобное управление.`,
    },
    price,
    oldPrice,
    stock,
    attributes,
    images:
      i % 4 === 0 ? [] : [{ path: store.placeholder, alt: name, sortOrder: 0 }],
    variants:
      group < 2 && i < 17
        ? [
            {
              id: `variant-${i}-black`,
              sku: `DEMO-${model}-B`,
              name: { uz: "Qora rang", ru: "Чёрный цвет" },
              price,
              stock,
              attributes: { color: "black", storage: 128 },
            },
            {
              id: `variant-${i}-white`,
              sku: `DEMO-${model}-W`,
              name: { uz: "Oq rang", ru: "Белый цвет" },
              price: price + 50000,
              stock: Math.min(stock, 5),
              attributes: { color: "white", storage: 256 },
            },
          ]
        : [],
    badges: oldPrice ? ["sale"] : i % 4 === 1 ? ["new"] : [],
    badge: oldPrice ? "sale" : i % 4 === 1 ? "new" : undefined,
    rating:
      i % 6 === 0
        ? undefined
        : { average: 4 + (i % 10) / 10, count: 5 + i * 7 },
    salesCount: 1000 - i * 13 + (i % 3) * 5,
    createdAt: timestamp,
    updatedAt: timestamp,
    warrantyMonths: 12,
    isActive: true,
  };
});
const banners = [
  {
    title: { uz: "YANGI IMKONIYATLAR", ru: "НОВЫЕ ВОЗМОЖНОСТИ" },
    href: "/catalog?sort=newest",
  },
  {
    title: { uz: "UY UCHUN QULAYLIK", ru: "КОМФОРТ ДЛЯ ДОМА" },
    href: "/c/small-home",
  },
  {
    title: { uz: "FOYDALI TANLOV", ru: "ВЫГОДНЫЙ ВЫБОР" },
    href: "/catalog?discounted=true",
  },
  {
    title: { uz: "KUNLIK YORDAMCHILAR", ru: "ПОВСЕДНЕВНЫЕ ПОМОЩНИКИ" },
    href: "/c/kitchen",
  },
].map((b, i) => ({
  ...b,
  id: `banner-${i + 1}`,
  sortOrder: i,
  isActive: true,
}));
const pageCopy = [
  [
    "about",
    "Biz haqimizda",
    "О нас",
    "Bu namoyish doʻkoni. Mahsulotlar va xizmatlar sinov uchun berilgan.",
    "Это демонстрационный магазин. Товары и услуги приведены для тестирования.",
  ],
  [
    "delivery",
    "Yetkazib berish",
    "Доставка",
    "Yetkazib berish shartlari demo sozlamalarida berilgan. Manzilingizni buyurtma oldidan tekshiring.",
    "Условия доставки заданы демонстрационными настройками. Проверьте адрес перед заказом.",
  ],
  [
    "returns",
    "Qaytarish",
    "Возврат",
    "Qaytarish shartlarini doʻkon bilan aniqlashtiring. Ushbu matn demo uchun.",
    "Уточните условия возврата в магазине. Это демонстрационный текст.",
  ],
  [
    "warranty",
    "Kafolat",
    "Гарантия",
    "Kafolat muddati mahsulot xususiyatlarida koʻrsatilgan. Ushbu matn demo uchun.",
    "Гарантийный срок указан в характеристиках товара. Это демонстрационный текст.",
  ],
  [
    "contacts",
    "Aloqa",
    "Контакты",
    `${store.phone}

${store.address}

${store.hours}`,
    `${store.phone}

${store.address}

${store.hours}`,
  ],
];
const pages = pageCopy.map(([slug, uz, ru, bodyUz, bodyRu]) => ({
  slug,
  title: { uz, ru },
  body: {
    uz: `# ${uz}

${bodyUz}`,
    ru: `# ${ru}

${bodyRu}`,
  },
}));
// Parse at the data-source boundary so malformed fixtures fail early in tests/builds.
export const catalogSeed: CatalogData = {
  categories: categories.map((c) => categoryNodeSchema.parse(c)),
  brands: brands.map((b) => brandSchema.parse(b)),
  attributeDefs: attributeDefs.map((a) => attributeDefSchema.parse(a)),
  products: products.map((p) => productSchema.parse(p)),
  banners: banners.map((b) => bannerSchema.parse(b)),
  pages: pages.map((p) => infoPageSchema.parse(p)),
};
