"use client";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { Heart, ShoppingBag, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SearchPill } from "@/components/ui/SearchPill";
export function PrimaryNav({ cartCount = 0 }: { cartCount?: number }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("tabs");
  const ui = useTranslations("ui");
  return (
    <nav className="primary-nav" aria-label={ui("desktopNavigation")}>
      <Link href={`/${locale}`}>
        <BrandLogo />
      </Link>
      <Link
        href={`/${locale}/catalog`}
        aria-current={pathname === `/${locale}/catalog` ? "page" : undefined}
        className="type-body-strong"
      >
        {t("catalog")}
      </Link>
      <div className="desktop-search">
        <SearchPill />
      </div>
      <Link
        className="icon-link"
        aria-label={t("favorites")}
        href={`/${locale}/favorites`}
      >
        <Heart size={24} />
      </Link>
      <Link
        className="icon-link"
        aria-label={ui("cartCount", { count: cartCount })}
        href={`/${locale}/cart`}
      >
        <ShoppingBag size={24} />
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </Link>
      <Link
        className="icon-link"
        aria-label={t("profile")}
        href={`/${locale}/profile`}
      >
        <UserRound size={24} />
      </Link>
    </nav>
  );
}
