import { z } from "zod";
export const envSchema = z.object({
  SITE_URL: z.url().default("http://localhost:3000"),
});
export const env = envSchema.parse({ SITE_URL: process.env.SITE_URL });
