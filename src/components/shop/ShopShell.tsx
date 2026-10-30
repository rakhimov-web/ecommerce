"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { UtilityBar } from "./UtilityBar";
import { PrimaryNav } from "./PrimaryNav";
import { Footer } from "./Footer";
import { BottomTabBar } from "./BottomTabBar";
export function ShopShell({
  children,
  noTabBar = false,
  cartCount = 0,
}: {
  children: ReactNode;
  noTabBar?: boolean;
  cartCount?: number;
}) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    function update() {
      const editing = document.activeElement?.matches(
        'input,textarea,[contenteditable="true"]',
      );
      setKeyboardOpen(
        !!editing && !!viewport && viewport.height < window.innerHeight * 0.75,
      );
    }
    viewport.addEventListener("resize", update);
    document.addEventListener("focusout", update);
    return () => {
      viewport.removeEventListener("resize", update);
      document.removeEventListener("focusout", update);
    };
  }, []);
  const pathname = usePathname();
  const locale = useLocale();
  return (
    <div className={`shop-shell ${noTabBar ? "without-tabs" : ""}`}>
      <div className="desktop-only desktop-header">
        <UtilityBar />
        <PrimaryNav cartCount={cartCount} />
      </div>
      <Header locale={locale} />
      {children}
      <Footer />
      <BottomTabBar
        pathname={pathname}
        cartCount={cartCount}
        hidden={noTabBar || keyboardOpen}
      />
    </div>
  );
}
