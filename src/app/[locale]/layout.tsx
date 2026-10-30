import { MotionProvider } from "@/components/ui/MotionProvider";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { inter, oswald } from "@/lib/fonts";
import { env } from "@/lib/env";
import { brand } from "@/config/brand";
import { themeColor } from "@/lib/theme";
import "../globals.css";
export const metadata: Metadata = {
  title: brand.name,
  metadataBase: new URL(env.SITE_URL),
};
export const viewport: Viewport = { viewportFit: "cover", themeColor };
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${oswald.variable}`}>
        <NextIntlClientProvider>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
