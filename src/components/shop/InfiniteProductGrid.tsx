"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ListResult } from "@/features/catalog/types";
import { fetchProductPage } from "@/features/catalog/queries";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
export function InfiniteProductGrid({ initial }: { initial: ListResult }) {
  const t = useTranslations("home");
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const sentinel = useRef<HTMLDivElement>(null);
  const flight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const load = useCallback(async () => {
    if (!cursor || flight.current) return;
    flight.current = true;
    const request = new AbortController();
    controller.current = request;
    setStatus("loading");
    try {
      const page = await fetchProductPage(cursor, request.signal);
      if (request.signal.aborted) return;
      if (page.nextCursor === cursor) throw new Error("Repeated cursor");
      setItems((previous) => [
        ...new Map(
          [...previous, ...page.items].map((item) => [item.id, item]),
        ).values(),
      ]);
      setCursor(page.nextCursor);
      setStatus("idle");
    } catch {
      if (!request.signal.aborted) setStatus("error");
    } finally {
      flight.current = false;
    }
  }, [cursor]);
  useEffect(
    () => () => {
      controller.current?.abort();
    },
    [],
  );
  useEffect(() => {
    if (
      !cursor ||
      status !== "idle" ||
      !sentinel.current ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void load();
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [cursor, status, load]);
  return (
    <section className="home-section" aria-labelledby="home-for-you">
      <h2 id="home-for-you" className="type-heading-xl mb-xl">
        {t("forYou")}
      </h2>
      {items.length ? (
        <div className="product-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-mute">{t("empty")}</p>
      )}
      {status === "loading" && (
        <div className="mt-xl">
          <ProductGridSkeleton />
        </div>
      )}
      {status === "error" && (
        <p className="text-sale mt-xl" role="alert">
          {t("loadError")}
        </p>
      )}
      <div ref={sentinel} aria-hidden="true" />
      {cursor ? (
        <div className="load-more">
          <Button
            variant="secondary"
            loading={status === "loading"}
            onClick={() => void load()}
          >
            {t(status === "error" ? "retry" : "loadMore")}
          </Button>
        </div>
      ) : items.length > 0 ? (
        <p className="type-caption-sm text-mute mt-xl" role="status">
          {t("end")}
        </p>
      ) : null}
    </section>
  );
}
