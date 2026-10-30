"use client";
import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SearchPill } from "@/components/ui/SearchPill";
export function Header({ locale }: { locale: string }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div className="mobile-only mobile-logo-row">
        <Link href={`/${locale}`}>
          <BrandLogo />
        </Link>
      </div>
      <div ref={sentinel} aria-hidden="true" />
      <div
        className={`mobile-only mobile-search ${scrolled ? "header-scrolled" : ""}`}
      >
        <SearchPill />
      </div>
    </>
  );
}
