import { afterEach, describe, it, expect, vi } from "vitest";
import { screen, fireEvent, cleanup } from "@testing-library/react";
import axe from "axe-core";
import { renderUI } from "@/test/render";
import { ProductCard } from "./ProductCard";
import { BottomTabBar } from "./BottomTabBar";
import { demoProducts } from "@/server/repositories/mock/products";
afterEach(cleanup);
describe("ProductCard", () => {
  it("renders its image, two-line name, rating, discount and add control", () => {
    const add = vi.fn(),
      like = vi.fn();
    const { container } = renderUI(
      <ProductCard
        product={demoProducts[0]}
        onQuantityChange={add}
        onLike={like}
      />,
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveClass(
      "line-clamp-2",
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      demoProducts[0].name.uz,
    );
    expect(container.querySelector("del")).toBeInTheDocument();
    expect(screen.getByLabelText(/Baho/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /savatga qoʻshish/ }));
    expect(add).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole("button", { name: /sevimlilar/ }));
    expect(like).toHaveBeenCalledOnce();
  });
  it("shows out-of-stock and omits buy controls", () => {
    const { container } = renderUI(<ProductCard product={demoProducts[1]} />);
    expect(screen.getByText("Sotuvda yoʻq")).toBeInTheDocument();
    expect(container.querySelector(".out-of-stock")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /savatga/ }),
    ).not.toBeInTheDocument();
  });
  it("shows low stock, selected heart and a stock-limited stepper", () => {
    renderUI(<ProductCard product={demoProducts[2]} liked quantity={2} />);
    expect(screen.getByText("Oxirgi 2 dona")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sevimlilar/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Koʻpaytirish" })).toBeDisabled();
  });
  it("hides absent ratings and supports long Russian names", () => {
    const { container } = renderUI(<ProductCard product={demoProducts[3]} />);
    expect(container.querySelector(".rating")).not.toBeInTheDocument();
    cleanup();
    renderUI(<ProductCard product={demoProducts[4]} />, "ru");
    expect(screen.getByRole("heading")).toHaveTextContent(
      demoProducts[4].name.ru,
    );
  });
  it("uses the placeholder when no image exists", () => {
    renderUI(<ProductCard product={demoProducts[0]} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("image-placeholder"),
    );
  });
});
it("BottomTabBar marks only the active tab and announces cart count", () => {
  renderUI(<BottomTabBar pathname="/uz/catalog" cartCount={3} />);
  expect(screen.getAllByRole("link")).toHaveLength(5);
  expect(screen.getByRole("link", { name: "Katalog" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    screen.getByRole("link", { name: "Savat, 3 ta mahsulot" }),
  ).toHaveAttribute("href", "/uz/cart");
  expect(screen.getByText("3")).toHaveClass("cart-count");
});
it("BottomTabBar supports Russian routes and omits itself on request", () => {
  renderUI(<BottomTabBar pathname="/ru/profile" />, "ru");
  expect(screen.getByRole("link", { name: "Профиль" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  cleanup();
  renderUI(<BottomTabBar pathname="/uz" hidden />);
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});
it("product card and tab navigation have no structural a11y violations", async () => {
  const { container } = renderUI(
    <>
      <ProductCard product={demoProducts[0]} />
      <BottomTabBar pathname="/uz" cartCount={1} />
    </>,
  );
  expect(
    (
      await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      })
    ).violations,
  ).toEqual([]);
});
