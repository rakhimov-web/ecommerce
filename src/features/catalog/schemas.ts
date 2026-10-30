import { z } from "zod";
export const localizedSchema = z.object({
  uz: z.string().trim().min(1),
  ru: z.string().trim().min(1),
});
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
const money = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const categoryNodeSchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  parentId: slugSchema.nullable(),
  name: localizedSchema,
  icon: z.enum([
    "smartphone",
    "laptop",
    "tv",
    "fridge",
    "washer",
    "air",
    "kitchen",
    "home",
  ]),
  sortOrder: z.number().int().nonnegative(),
});
export const categorySchema = categoryNodeSchema.extend({
  get children() {
    return z.array(categorySchema);
  },
});
export const brandSchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: z.string().min(1),
});
export const attributeValueSchema = z.union([
  z.string().min(1).max(100),
  z.number().finite(),
  z.boolean(),
]);
export const attributeDefSchema = z.object({
  id: slugSchema,
  categoryId: slugSchema,
  key: slugSchema,
  name: localizedSchema,
  type: z.enum(["text", "number", "enum", "bool"]),
  unit: z.string().optional(),
  filterable: z.boolean(),
  values: z.array(attributeValueSchema).optional(),
});
export const productImageSchema = z.object({
  path: z.string().startsWith("/"),
  alt: localizedSchema,
  sortOrder: z.number().int().nonnegative(),
});
export const variantSchema = z.object({
  id: slugSchema,
  sku: z.string().min(1),
  name: localizedSchema,
  price: money,
  stock: z.number().int().nonnegative(),
  attributes: z.record(slugSchema, attributeValueSchema),
});
export const productSummarySchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: localizedSchema,
  image: z.string().startsWith("/").optional(),
  price: money,
  oldPrice: money.optional(),
  stock: z.number().int().nonnegative(),
  rating: z
    .object({
      average: z.number().min(0).max(5),
      count: z.number().int().positive(),
    })
    .optional(),
  badge: z.enum(["new", "sale"]).optional(),
  installment: z
    .object({ monthly: money, months: z.number().int().positive() })
    .optional(),
});
export const productSchema = productSummarySchema.omit({ image: true }).extend({
  sku: z.string().min(1),
  model: z.string().min(1),
  categoryId: slugSchema,
  brandId: slugSchema,
  description: localizedSchema,
  images: z.array(productImageSchema).max(12),
  attributes: z.record(slugSchema, attributeValueSchema),
  variants: z.array(variantSchema).max(20),
  badges: z.array(z.enum(["new", "sale"])),
  salesCount: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  warrantyMonths: z.number().int().nonnegative(),
  isActive: z.boolean(),
});
export const bannerSchema = z.object({
  id: slugSchema,
  title: localizedSchema,
  imageDesktop: z.string().startsWith("/").optional(),
  imageMobile: z.string().startsWith("/").optional(),
  href: z.string().regex(/^\/(?!\/)/),
  sortOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
});
export const infoPageSchema = z.object({
  slug: slugSchema,
  title: localizedSchema,
  body: localizedSchema,
});
export const sortSchema = z.enum([
  "popular",
  "priceAsc",
  "priceDesc",
  "newest",
  "discount",
]);
export const listQuerySchema = z
  .object({
    categorySlug: slugSchema.optional(),
    q: z.string().trim().max(100).default(""),
    brandSlugs: z.array(slugSchema).max(20).default([]),
    priceMin: z.coerce
      .number()
      .int()
      .nonnegative()
      .max(Number.MAX_SAFE_INTEGER)
      .optional(),
    priceMax: z.coerce
      .number()
      .int()
      .nonnegative()
      .max(Number.MAX_SAFE_INTEGER)
      .optional(),
    inStock: z.boolean().default(false),
    discounted: z.boolean().default(false),
    attributes: z
      .record(slugSchema, z.array(attributeValueSchema).min(1).max(20))
      .refine((v) => Object.keys(v).length <= 20)
      .default({}),
    sort: sortSchema.default("popular"),
    cursor: z.string().max(2048).optional(),
    limit: z.coerce.number().int().min(1).max(48).default(24),
  })
  .refine(
    (q) =>
      q.priceMin === undefined ||
      q.priceMax === undefined ||
      q.priceMin <= q.priceMax,
    { message: "Invalid price range", path: ["priceMax"] },
  );
export const facetsSchema = z.object({
  brands: z.array(
    z.object({
      slug: slugSchema,
      name: z.string(),
      count: z.number().int().nonnegative(),
    }),
  ),
  price: z.object({ min: money.nullable(), max: money.nullable() }),
  attributes: z.record(
    slugSchema,
    z.array(
      z.object({
        value: attributeValueSchema,
        count: z.number().int().nonnegative(),
      }),
    ),
  ),
  inStock: z.number().int().nonnegative(),
  discounted: z.number().int().nonnegative(),
});
export const listResultSchema = z.object({
  items: z.array(productSummarySchema).max(48),
  nextCursor: z.string().nullable(),
  total: z.number().int().nonnegative(),
  facets: facetsSchema,
});
export const boundedLimitSchema = z.number().int().min(1).max(48);
