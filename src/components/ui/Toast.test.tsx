import { it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, screen, act } from "@testing-library/react";
import { renderUI } from "@/test/render";
import { Toast } from "./Toast";
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it("announces a message and dismisses after three seconds", () => {
  vi.useFakeTimers();
  const close = vi.fn();
  renderUI(<Toast message="Saved" onClose={close} />);
  expect(screen.getByRole("status")).toHaveTextContent("Saved");
  act(() => vi.advanceTimersByTime(2999));
  expect(close).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(1));
  expect(close).toHaveBeenCalledOnce();
});
it("allows explicit dismissal", () => {
  const close = vi.fn();
  renderUI(<Toast message="Saved" onClose={close} />);
  fireEvent.click(screen.getByRole("button", { name: "Yopish" }));
  expect(close).toHaveBeenCalledOnce();
});
