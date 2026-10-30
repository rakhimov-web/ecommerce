"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Banner } from "@/features/catalog/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { IconButton } from "@/components/ui/IconButton";
import { motionTokens } from "@/lib/motion";
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const slides = banners.slice(0, 5);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const locale = useLocale();
  const t = useTranslations("home");
  const paused = userPaused || touched;
  function goTo(index: number) {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    const el = track.current;
    if (el) {
      const left = next * el.clientWidth;
      if (el.scrollTo)
        el.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
      else el.scrollLeft = left;
    }
  }
  useEffect(() => {
    if (reduced || hovered || focused || paused || slides.length < 2) return;
    const timer = setInterval(() => {
      const el = track.current;
      const next = (active + 1) % slides.length;
      setActive(next);
      if (el?.scrollTo)
        el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(timer);
  }, [active, reduced, hovered, focused, paused, slides.length]);
  if (!slides.length) return null;
  return (
    <section
      className="banner-carousel"
      role="region"
      aria-roledescription={t("carousel")}
      aria-label={t("campaigns")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setTouched(true)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const next =
            (active + (event.key === "ArrowRight" ? 1 : -1) + slides.length) %
            slides.length;
          // Keep keyboard focus outside the slide that is about to become inert.
          event.currentTarget
            .querySelectorAll<HTMLButtonElement>(".banner-dots button")
            [next]?.focus();
          goTo(next);
        }
      }}
    >
      <div
        ref={track}
        className="banner-track"
        aria-live={paused || focused || hovered || reduced ? "polite" : "off"}
        onScroll={() => {
          const el = track.current;
          if (el?.clientWidth)
            setActive(
              Math.min(
                slides.length - 1,
                Math.round(el.scrollLeft / el.clientWidth),
              ),
            );
        }}
      >
        {slides.map((banner, index) => {
          const title = banner.title[locale === "ru" ? "ru" : "uz"];
          return (
            <article
              className="banner-slide"
              key={banner.id}
              role="group"
              aria-roledescription={t("slide")}
              aria-label={t("slideNumber", {
                number: index + 1,
                total: slides.length,
              })}
              aria-hidden={index !== active}
              inert={index !== active}
            >
              <Link href={`/${locale}${banner.href}`}>
                <ProductImage
                  src={banner.imageDesktop}
                  mobileSrc={banner.imageMobile}
                  alt=""
                  fit="cover"
                  aspect="banner"
                  priority={index === 0}
                />
                <div className="banner-copy">
                  <h2 className="type-display-campaign line-clamp-3">
                    {title}
                  </h2>
                  <span className="banner-cta type-button-md">
                    {t("explore")}
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <div className="banner-controls">
        <div className="banner-dots">
          {slides.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              aria-label={t("slideNumber", {
                number: index + 1,
                total: slides.length,
              })}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
            >
              <motion.span
                className="banner-dot"
                initial={false}
                animate={{
                  scaleX: index === active ? 1 : 1 / 3,
                  opacity: index === active ? 1 : 0.4,
                }}
                transition={{
                  duration: reduced ? 0 : motionTokens.duration.fast,
                }}
              />
            </button>
          ))}
        </div>
        {!reduced && slides.length > 1 && (
          <IconButton
            aria-label={t(paused ? "play" : "pause")}
            onClick={() => {
              setUserPaused(!paused);
              setTouched(false);
            }}
          >
            {paused ? <Play size={20} /> : <Pause size={20} />}
          </IconButton>
        )}
      </div>
    </section>
  );
}
