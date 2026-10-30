/* eslint-disable @next/next/no-img-element -- Deliberate native image mock to exercise error events. */
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
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
it("reserves a square placeholder stage", () => {
  const { container } = render(<ProductImage alt="test" />);
  expect(screen.getByRole("img")).toHaveAttribute("src", brand.placeholder);
  expect(container.firstChild).toHaveClass("aspect-square");
});
it("falls back after image failure", () => {
  render(<ProductImage src="/missing.webp" alt="missing" />);
  fireEvent.error(screen.getByAltText("missing"));
  expect(screen.getByAltText("missing")).toHaveAttribute(
    "src",
    brand.placeholder,
  );
});
