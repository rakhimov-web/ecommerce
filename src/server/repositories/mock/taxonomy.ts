import type {
  CategoryNode,
  AttributeDef,
  Localized,
} from "@/features/catalog/types";
export const roots = [
  [
    "gadgets",
    "smartphone",
    "Smartfonlar va gadjetlar",
    "Смартфоны и гаджеты",
    ["phones", "tablets", "watches"],
  ],
  [
    "computers",
    "laptop",
    "Noutbuklar va kompyuterlar",
    "Ноутбуки и компьютеры",
    ["laptops", "desktops", "monitors"],
  ],
  [
    "audio-video",
    "tv",
    "Televizorlar va audio",
    "Телевизоры и аудио",
    ["televisions", "speakers", "headphones"],
  ],
  [
    "cooling",
    "fridge",
    "Sovutgichlar va muzlatgichlar",
    "Холодильники и морозильники",
    ["fridges", "freezers", "mini-fridges"],
  ],
  [
    "laundry",
    "washer",
    "Kir yuvish va quritish",
    "Стирка и сушка",
    ["washers", "dryers", "washer-dryers"],
  ],
  [
    "climate",
    "air",
    "Konditsionerlar va isitish",
    "Кондиционеры и отопление",
    ["air-conditioners", "heaters", "air-cleaners"],
  ],
  [
    "kitchen",
    "kitchen",
    "Oshxona texnikasi",
    "Кухонная техника",
    ["kettles", "blenders", "microwaves"],
  ],
  [
    "small-home",
    "home",
    "Uy uchun kichik texnika",
    "Мелкая техника для дома",
    ["vacuums", "irons", "hair-dryers"],
  ],
] as const;
export const childNames: Record<string, Localized> = {
  phones: { uz: "Smartfonlar", ru: "Смартфоны" },
  tablets: { uz: "Planshetlar", ru: "Планшеты" },
  watches: { uz: "Aqlli soatlar", ru: "Умные часы" },
  laptops: { uz: "Noutbuklar", ru: "Ноутбуки" },
  desktops: { uz: "Kompyuterlar", ru: "Компьютеры" },
  monitors: { uz: "Monitorlar", ru: "Мониторы" },
  televisions: { uz: "Televizorlar", ru: "Телевизоры" },
  speakers: { uz: "Karnaylar", ru: "Колонки" },
  headphones: { uz: "Quloqchinlar", ru: "Наушники" },
  fridges: { uz: "Sovutgichlar", ru: "Холодильники" },
  freezers: { uz: "Muzlatgichlar", ru: "Морозильники" },
  "mini-fridges": { uz: "Ixcham sovutgichlar", ru: "Мини-холодильники" },
  washers: { uz: "Kir yuvish mashinalari", ru: "Стиральные машины" },
  dryers: { uz: "Quritish mashinalari", ru: "Сушильные машины" },
  "washer-dryers": {
    uz: "Yuvish va quritish mashinalari",
    ru: "Стирально-сушильные машины",
  },
  "air-conditioners": { uz: "Konditsionerlar", ru: "Кондиционеры" },
  heaters: { uz: "Isitgichlar", ru: "Обогреватели" },
  "air-cleaners": { uz: "Havo tozalagichlar", ru: "Очистители воздуха" },
  kettles: { uz: "Choynaklar", ru: "Чайники" },
  blenders: { uz: "Blenderlar", ru: "Блендеры" },
  microwaves: { uz: "Mikrotoʻlqinli pechlar", ru: "Микроволновые печи" },
  vacuums: { uz: "Changyutgichlar", ru: "Пылесосы" },
  irons: { uz: "Dazmollar", ru: "Утюги" },
  "hair-dryers": { uz: "Soch quritgichlar", ru: "Фены" },
};
export const categories: CategoryNode[] = roots.flatMap(
  ([slug, icon, uz, ru, children], i) => [
    { id: slug, slug, parentId: null, name: { uz, ru }, icon, sortOrder: i },
    ...children.map((child, j) => ({
      id: child,
      slug: child,
      parentId: slug,
      name: childNames[child],
      icon,
      sortOrder: j,
    })),
  ],
);
export const brands = [
  "Aurora",
  "Nordix",
  "Kelvin",
  "Vita",
  "Orbit",
  "Lumo",
].map((name) => ({ id: name.toLowerCase(), slug: name.toLowerCase(), name }));
const common = {
  power: {
    name: { uz: "Quvvat", ru: "Мощность" },
    values: [65, 100, 500, 1500],
    unit: "W",
  },
  color: {
    name: { uz: "Rang", ru: "Цвет" },
    values: ["black", "white", "silver"],
  },
  capacity: {
    name: { uz: "Sigʻim", ru: "Вместимость" },
    values: [8, 16, 32, 64],
    unit: "L",
  },
  ram: {
    name: { uz: "Tezkor xotira", ru: "Оперативная память" },
    values: [4, 8, 16, 32],
    unit: "GB",
  },
  screen: {
    name: { uz: "Ekran oʻlchami", ru: "Диагональ экрана" },
    values: [6.1, 11, 16, 55],
    unit: "inch",
  },
  storage: {
    name: { uz: "Xotira", ru: "Накопитель" },
    values: [128, 256, 512, 1024],
    unit: "GB",
  },
  energy: {
    name: { uz: "Energiya sinfi", ru: "Класс энергоэффективности" },
    values: ["A", "A+", "A++"],
  },
  weight: { name: { uz: "Vazn", ru: "Вес" }, values: [1, 2, 5, 8], unit: "kg" },
  programs: {
    name: { uz: "Dasturlar soni", ru: "Число программ" },
    values: [3, 6, 8, 12],
  },
  quiet: {
    name: { uz: "Sokin rejim", ru: "Тихий режим" },
    values: [true, false],
  },
};
const keys = [
  ["ram", "screen", "storage", "power", "color"],
  ["ram", "storage", "screen", "power", "color"],
  ["screen", "power", "energy", "weight", "color"],
  ["capacity", "energy", "power", "quiet", "color"],
  ["capacity", "power", "energy", "programs", "color"],
  ["capacity", "power", "energy", "quiet", "color"],
  ["capacity", "power", "programs", "weight", "color"],
  ["power", "capacity", "weight", "quiet", "color"],
] as const;
export const attributeDefs: AttributeDef[] = roots.flatMap(([id], group) =>
  keys[group].map((key) => {
    const data = common[key];
    return {
      id: `${id}-${key}`,
      categoryId: id,
      key,
      name: data.name,
      type:
        typeof data.values[0] === "number"
          ? "number"
          : typeof data.values[0] === "boolean"
            ? "bool"
            : "enum",
      filterable: true,
      values: [...data.values],
      ...("unit" in data ? { unit: data.unit } : {}),
    };
  }),
);
