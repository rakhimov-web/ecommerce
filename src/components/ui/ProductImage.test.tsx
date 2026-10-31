/* eslint-disable @next/next/no-img-element -- Native DOM mock exposes image error events. */
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { ProductImage } from "./ProductImage";
import { brand } from "@/config/brand";
vi.mock("next/image", () => ({
  default: ({
    fill,
    sizes,
    ...props
  }: {
    fill?: boolean;
    sizes?: string;
    src: string;
    alt: string;
  }) => {
    void fill;
    void sizes;
    return <img {...props} alt={props.alt} />;
  },
}));
it("keeps the placeholder stage square", () => {
  const { container } = render(<ProductImage alt="empty" />);
  expect(screen.getByAltText("empty")).toHaveAttribute(
    "src",
    brand.placeholder,
  );
  expect(container.firstChild).toHaveClass("product-stage");
});
it("uses the same placeholder geometry for an explicit placeholder path and an empty source", () => {
  render(<ProductImage src={brand.placeholder} alt="explicit placeholder" />);
  expect(screen.getByAltText("explicit placeholder")).toHaveClass(
    "product-placeholder",
  );
});
it("falls back on errors and recovers when source changes", () => {
  const { rerender } = render(
    <ProductImage src="/missing.webp" alt="product" />,
  );
  fireEvent.error(screen.getByAltText("product"));
  expect(screen.getByAltText("product")).toHaveAttribute(
    "src",
    brand.placeholder,
  );
  rerender(<ProductImage src="/replacement.webp" alt="product" />);
  expect(screen.getByAltText("product")).toHaveAttribute(
    "src",
    "/replacement.webp",
  );
});
it("art-directs banner sources, removes a failed mobile source and recovers on a new pair", () => {
  const { container, rerender } = render(
    <ProductImage
      src="/wide.webp"
      mobileSrc="/portrait.webp"
      alt="campaign"
      aspect="banner"
      fit="cover"
    />,
  );
  expect(container.firstChild).toHaveClass("product-stage-banner");
  expect(container.querySelector("source")).toHaveAttribute(
    "media",
    "(max-width:639px)",
  );
  expect(container.querySelector("source")).toHaveAttribute(
    "srcset",
    "/portrait.webp",
  );
  expect(screen.getByAltText("campaign")).toHaveClass("product-cover");
  fireEvent.error(screen.getByAltText("campaign"));
  expect(container.querySelector("source")).toBeNull();
  expect(screen.getByAltText("campaign")).toHaveAttribute(
    "src",
    brand.placeholder,
  );
  rerender(
    <ProductImage
      src="/wide.webp"
      mobileSrc="/portrait-new.webp"
      alt="campaign"
      aspect="banner"
      fit="cover"
    />,
  );
  expect(container.querySelector("source")).toHaveAttribute(
    "srcset",
    "/portrait-new.webp",
  );
  expect(screen.getByAltText("campaign")).toHaveAttribute("src", "/wide.webp");
});
