import { afterEach, describe, it, expect, vi } from "vitest";
import {
  fireEvent,
  screen,
  cleanup,
  waitFor,
  act,
} from "@testing-library/react";
import { renderUI } from "@/test/render";
import { BannerCarousel } from "./BannerCarousel";
import { CategoryGrid } from "./CategoryGrid";
import { ProductRail } from "./ProductRail";
import { InfiniteProductGrid } from "./InfiniteProductGrid";
import { catalogSeed } from "@/server/repositories/mock/seed";
import { categoryTree, listCatalog } from "@/server/services/catalog";
const { reduced } = vi.hoisted(() => ({ reduced: { value: false } }));
vi.mock("motion/react", async (original) => {
  const actual = await original<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => reduced.value };
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  reduced.value = false;
});
describe("BannerCarousel", () => {
  it("autoplays every 5 seconds, pauses on hover/focus/touch and allows keyboard arrows", () => {
    vi.useFakeTimers();
    renderUI(<BannerCarousel banners={catalogSeed.banners} />);
    const first = screen.getByRole("button", { name: "1 / 4 slayd" });
    const second = screen.getByRole("button", { name: "2 / 4 slayd" });
    expect(first).toHaveAttribute("aria-current", "true");
    act(() => vi.advanceTimersByTime(5000));
    expect(second).toHaveAttribute("aria-current", "true");
    const region = screen.getByRole("region");
    fireEvent.mouseEnter(region);
    act(() => vi.advanceTimersByTime(5000));
    expect(second).toHaveAttribute("aria-current", "true");
    fireEvent.mouseLeave(region);
    fireEvent.focus(second);
    act(() => vi.advanceTimersByTime(5000));
    expect(second).toHaveAttribute("aria-current", "true");
    fireEvent.blur(second, { relatedTarget: null });
    fireEvent.touchStart(region);
    act(() => vi.advanceTimersByTime(5000));
    expect(second).toHaveAttribute("aria-current", "true");
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "3 / 4 slayd" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "3 / 4 slayd" })).toHaveFocus();
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(second).toHaveAttribute("aria-current", "true");
  });
  it("disables autoplay under reduced motion and handles empty/max-five inputs", () => {
    vi.useFakeTimers();
    reduced.value = true;
    const { unmount } = renderUI(
      <BannerCarousel
        banners={[...catalogSeed.banners, ...catalogSeed.banners].map(
          (banner, i) => ({ ...banner, id: `banner-${i}` }),
        )}
      />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(
      screen.getByRole("region").querySelector(".banner-track"),
    ).toHaveAttribute("aria-live", "polite");
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByRole("button", { name: "1 / 5 slayd" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    unmount();
    renderUI(<BannerCarousel banners={[]} />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
  it("provides pause/resume, slide links and current-dot semantics", () => {
    vi.useFakeTimers();
    renderUI(<BannerCarousel banners={catalogSeed.banners} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Avtomatik aylantirishni toʻxtatish",
      }),
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("button", { name: "1 / 4 slayd" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "YANGI IMKONIYATLAR Koʻrish" }),
    ).toHaveAttribute("href", "/uz/catalog?sort=newest");
    fireEvent.click(
      screen.getByRole("button", { name: "Avtomatik aylantirishni yoqish" }),
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("button", { name: "2 / 4 slayd" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
it("CategoryGrid renders seven roots and All in two mobile rows with localized links", () => {
  renderUI(<CategoryGrid categories={categoryTree(catalogSeed)} />, "ru");
  expect(screen.getAllByRole("link")).toHaveLength(8);
  expect(screen.getByRole("link", { name: "Все категории" })).toHaveAttribute(
    "href",
    "/ru/catalog",
  );
  expect(
    screen.getByRole("link", { name: "Смартфоны и гаджеты" }),
  ).toHaveAttribute("href", "/ru/c/gadgets");
});
it("ProductRail links to its prefiltered listing and product placeholders", () => {
  const items = listCatalog(catalogSeed, { discounted: true, limit: 8 }).items;
  const { container } = renderUI(
    <ProductRail
      title="Offers"
      products={items}
      href="/catalog?discounted=true"
    />,
  );
  expect(container.querySelectorAll(".product-card")).toHaveLength(8);
  expect(screen.getByRole("link", { name: "Hammasi" })).toHaveAttribute(
    "href",
    "/uz/catalog?discounted=true",
  );
  expect(container.querySelector('a[href^="/uz/p/"]')).toBeInTheDocument();
});
describe("InfiniteProductGrid", () => {
  it("loads a validated page, merges without duplicates and stops at end", async () => {
    const initial = listCatalog(catalogSeed, { limit: 24 });
    const page = listCatalog(catalogSeed, {
      limit: 8,
      cursor: initial.nextCursor ?? undefined,
    });
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, data: page }),
    });
    vi.stubGlobal("fetch", fetch);
    const { container } = renderUI(<InfiniteProductGrid initial={initial} />);
    fireEvent.click(screen.getByRole("button", { name: "Yana yuklash" }));
    await waitFor(() =>
      expect(
        screen.getByText("Barcha mahsulotlar koʻrsatildi."),
      ).toBeInTheDocument(),
    );
    expect(container.querySelectorAll(".product-card")).toHaveLength(30);
    expect(
      screen.queryByRole("button", { name: "Yana yuklash" }),
    ).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledOnce();
  });
  it("shows loading rows, then an error and permits retry without losing items", async () => {
    const initial = listCatalog(catalogSeed, { limit: 24 });
    const page = listCatalog(catalogSeed, {
      cursor: initial.nextCursor ?? undefined,
    });
    let reject: (error: Error) => void = () => {};
    const fetch = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((_, r) => {
            reject = r;
          }),
      )
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, data: page }),
      });
    vi.stubGlobal("fetch", fetch);
    const { container } = renderUI(<InfiniteProductGrid initial={initial} />);
    fireEvent.click(screen.getByRole("button", { name: "Yana yuklash" }));
    expect(container.querySelector(".skeleton-grid")).toBeInTheDocument();
    await act(async () => reject(new Error("offline")));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Mahsulotlarni yuklab boʻlmadi",
    );
    expect(container.querySelectorAll(".product-card")).toHaveLength(24);
    fireEvent.click(screen.getByRole("button", { name: "Qayta urinish" }));
    await waitFor(() =>
      expect(container.querySelectorAll(".product-card")).toHaveLength(30),
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("loads on intersection, rejects malformed responses and shows empty/end states", async () => {
    let intersect: IntersectionObserverCallback = () => {};
    class Observer {
      constructor(callback: IntersectionObserverCallback) {
        intersect = callback;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = "";
      thresholds = [];
    }
    vi.stubGlobal("IntersectionObserver", Observer);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, data: {} }),
      }),
    );
    const initial = listCatalog(catalogSeed, { limit: 8 });
    const { unmount } = renderUI(<InfiniteProductGrid initial={initial} />);
    act(() =>
      intersect(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    unmount();
    renderUI(
      <InfiniteProductGrid
        initial={listCatalog(catalogSeed, { q: "missing" })}
      />,
    );
    expect(
      screen.getByText("Hozircha mahsulot topilmadi."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
