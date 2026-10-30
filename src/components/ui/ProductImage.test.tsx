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
