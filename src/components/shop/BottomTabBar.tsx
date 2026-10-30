"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { House, LayoutGrid, ShoppingBag, Heart, UserRound } from "lucide-react";
export const tabs = [
  { key: "home", path: "", icon: House },
  { key: "catalog", path: "/catalog", icon: LayoutGrid },
  { key: "cart", path: "/cart", icon: ShoppingBag },
  { key: "favorites", path: "/favorites", icon: Heart },
  { key: "profile", path: "/profile", icon: UserRound },
] as const;
export function BottomTabBar({
  pathname,
  cartCount = 0,
  hidden = false,
}: {
  pathname: string;
  cartCount?: number;
  hidden?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("tabs");
  const ui = useTranslations("ui");
  if (hidden) return null;
  return (
    <nav aria-label={ui("navigation")} className="bottom-tab-bar">
      {tabs.map(({ key, path, icon: Icon }) => {
        const href = `/${locale}${path}`;
        const active = pathname === href;
        return (
          <Link
            href={href}
            key={key}
            aria-current={active ? "page" : undefined}
            className={active ? "tab-active" : ""}
            aria-label={
              key === "cart" ? ui("cartCount", { count: cartCount }) : t(key)
            }
          >
            <span className="tab-icon">
              <Icon
                size={24}
                strokeWidth={1.75}
                fill={active ? "currentColor" : "none"}
                aria-hidden="true"
              />
              {key === "cart" && cartCount > 0 && (
                <span className="cart-count" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="type-tab-label">{t(key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
