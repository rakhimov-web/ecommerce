import {
  fireEvent,
  screen,
  within,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import axe from "axe-core";
import { renderUI } from "@/test/render";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { Chip, ChipRow } from "./Chip";
import { TextField } from "./TextField";
import { PhoneField } from "./PhoneField";
import { OtpInput } from "./OtpInput";
import { QuantityStepper } from "./QuantityStepper";
import { SearchPill } from "./SearchPill";
import { BottomSheet } from "./BottomSheet";
import { PriceBlock } from "./PriceBlock";
import { Accordion } from "./Accordion";
afterEach(cleanup);
describe("Button", () => {
  it.each(["primary", "secondary", "outline-on-image"] as const)(
    "renders %s",
    (variant) => {
      renderUI(<Button variant={variant}>Continue</Button>);
      expect(screen.getByRole("button")).toHaveClass(`button-${variant}`);
    },
  );
  it("blocks disabled and loading interactions, retaining label width", () => {
    const click = vi.fn();
    renderUI(
      <>
        <Button disabled onClick={click}>
          Disabled
        </Button>
        <Button loading onClick={click}>
          Loading
        </Button>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
    const loading = screen.getByRole("button", { name: "Loading" });
    fireEvent.click(loading);
    expect(click).not.toHaveBeenCalled();
    expect(loading).toBeDisabled();
    expect(loading).toHaveAttribute("aria-busy", "true");
    expect(loading.querySelector(".button-label")).toHaveClass("invisible");
  });
  it("renders a link and blocks disabled navigation", () => {
    renderUI(
      <Button href="/uz" disabled>
        Link
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(fireEvent.click(link)).toBe(false);
  });
});
it("Chip exposes active state and row is labelled", () => {
  const click = vi.fn();
  renderUI(
    <ChipRow label="Filters">
      <Chip active onClick={click}>
        New
      </Chip>
    </ChipRow>,
  );
  fireEvent.click(screen.getByRole("button"));
  expect(click).toHaveBeenCalledOnce();
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("group")).toHaveAccessibleName("Filters");
});
it("TextField labels input, associates help and errors", () => {
  renderUI(
    <>
      <TextField label="Name" helper="Optional" />
      <TextField label="Email" error="Required" />
    </>,
  );
  expect(screen.getByLabelText("Name")).toHaveAccessibleDescription("Optional");
  expect(screen.getByLabelText("Email")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
    "Required",
  );
});
it("PhoneField masks typing and paste into E.164 output", () => {
  const change = vi.fn();
  renderUI(<PhoneField label="Phone" onValueChange={change} />);
  const input = screen.getByLabelText("Phone");
  fireEvent.change(input, { target: { value: "+998901234567" } });
  expect(input).toHaveValue("90 123 45 67");
  expect(change).toHaveBeenLastCalledWith("+998901234567");
  expect(input).toHaveAttribute("inputmode", "numeric");
  expect(input).toHaveAttribute("autocomplete", "tel-national");
});
it("PhoneField supports controlled values and errors", () => {
  renderUI(<PhoneField label="Phone" value="+998901234567" error="Invalid" />);
  expect(screen.getByLabelText("Phone")).toHaveValue("90 123 45 67");
  expect(screen.getByLabelText("Phone")).toHaveAccessibleDescription("Invalid");
});
it("OTP advances, pastes six digits and navigates backwards", () => {
  const onChange = vi.fn();
  renderUI(<OtpInput label="Code" onValueChange={onChange} />);
  const inputs = screen.getAllByRole("textbox");
  fireEvent.change(inputs[0], { target: { value: "4" } });
  expect(inputs[1]).toHaveFocus();
  fireEvent.keyDown(inputs[1], { key: "Backspace" });
  expect(inputs[0]).toHaveFocus();
  fireEvent.paste(inputs[0], { clipboardData: { getData: () => "123456" } });
  expect(onChange).toHaveBeenLastCalledWith("123456");
  inputs.forEach((input, i) => expect(input).toHaveValue(String(i + 1)));
  expect(inputs[5]).toHaveFocus();
  expect(inputs[0]).toHaveAttribute("autocomplete", "one-time-code");
});
it("OTP strips non-numeric paste and honours disabled", () => {
  renderUI(<OtpInput label="Code" defaultValue="" disabled />);
  expect(screen.getAllByRole("textbox")[0]).toBeDisabled();
});
it("QuantityStepper enforces min/max and announces changes", () => {
  const change = vi.fn();
  const { rerender } = renderUI(
    <QuantityStepper value={1} min={1} max={2} onChange={change} />,
  );
  expect(screen.getByRole("button", { name: "Kamaytirish" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Koʻpaytirish" }));
  expect(change).toHaveBeenLastCalledWith(2);
  void rerender;
  cleanup();
  renderUI(<QuantityStepper value={2} min={1} max={2} onChange={change} />);
  expect(screen.getByRole("button", { name: "Koʻpaytirish" })).toBeDisabled();
  expect(screen.getByText("2")).toHaveAttribute("aria-live", "polite");
});
it("SearchPill supports controlled and uncontrolled clearing", () => {
  const change = vi.fn();
  function Controlled() {
    const [value, setValue] = useState("query");
    return (
      <SearchPill
        value={value}
        onValueChange={(v) => {
          setValue(v);
          change(v);
        }}
      />
    );
  }
  renderUI(<Controlled />);
  fireEvent.click(screen.getByRole("button", { name: "Tozalash" }));
  expect(screen.getByRole("searchbox")).toHaveValue("");
  expect(screen.getByRole("searchbox")).toHaveFocus();
  expect(change).toHaveBeenLastCalledWith("");
  cleanup();
  renderUI(<SearchPill defaultValue="abc" />);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "new" } });
  expect(screen.getByRole("searchbox")).toHaveValue("new");
});
it("Accordion toggles semantics and removes closed content from interaction", () => {
  renderUI(
    <Accordion title="Details">
      <Button>Inside</Button>
    </Accordion>,
  );
  const trigger = screen.getByRole("button", { name: "Details" });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});
describe("BottomSheet", () => {
  it("traps focus, handles Escape/backdrop, restores focus and scroll", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <BottomSheet open={open} title="Sheet" onClose={() => setOpen(false)}>
            <Button>Last</Button>
          </BottomSheet>
        </>
      );
    }
    renderUI(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Sheet");
    const close = within(dialog).getByRole("button", { name: "Yopish" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(within(dialog).getByRole("button", { name: "Last" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Escape" });
    // Presence removal can precede React's passive isolation cleanup.
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
      expect(document.body.style.overflow).toBe("");
    });
    fireEvent.click(trigger);
    const backdrop = screen.getByRole("dialog").parentElement;
    if (!backdrop) throw new Error("Missing scrim");
    fireEvent.click(backdrop);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
      expect(document.body.style.overflow).toBe("");
    });
  });
  it("does not close on panel clicks", () => {
    const close = vi.fn();
    renderUI(
      <BottomSheet open title="Sheet" onClose={close}>
        <p>Content</p>
      </BottomSheet>,
    );
    fireEvent.click(screen.getByText("Content"));
    expect(close).not.toHaveBeenCalled();
  });
});
it("PriceBlock renders current and old NBSP prices with a discount", () => {
  const { container } = renderUI(
    <PriceBlock
      price={1250000}
      oldPrice={2500000}
      size="lg"
      installment={{ monthly: 100000, months: 12 }}
    />,
  );
  expect(container.querySelector(".price-current")?.textContent).toBe(
    "1\u00a0250\u00a0000\u00a0soʻm",
  );
  expect(container.querySelector("del")).toBeInTheDocument();
  expect(screen.getByText("−50%")).toBeInTheDocument();
  expect(container.querySelector(".price-current")).toHaveClass("text-sale");
  expect(screen.queryByText(/Oyiga/)).not.toBeInTheDocument();
});
it("PriceBlock hides old prices when there is no discount", () => {
  const { container } = renderUI(<PriceBlock price={200} oldPrice={100} />);
  expect(container.querySelector("del")).not.toBeInTheDocument();
});
it.each(["uz", "ru"] as const)(
  "primitives have no detectable structural a11y violations in %s",
  async (locale) => {
    const { container } = renderUI(
      <>
        <Button>Continue</Button>
        <IconButton aria-label="Favorite">
          <span aria-hidden="true">+</span>
        </IconButton>
        <Chip active>New</Chip>
        <TextField label="Name" error="Required" />
        <PhoneField label="Phone" />
        <OtpInput label="Code" />
        <SearchPill />
        <QuantityStepper value={1} onChange={() => {}} />
        <PriceBlock price={1250000} />
      </>,
      locale,
    );
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  },
);
it("loading buttons keep exactly one accessible label", () => {
  renderUI(<Button loading>Loading</Button>);
  expect(screen.getByRole("button", { name: "Loading" })).toHaveAccessibleName(
    "Loading",
  );
});
it.each([false, true])(
  "OTP keeps empty middle slots and supports replacement (controlled=%s)",
  (controlled) => {
    const change = vi.fn();
    function Harness() {
      const [value, setValue] = useState("123456");
      return (
        <OtpInput
          label="Code"
          defaultValue="123456"
          value={controlled ? value : undefined}
          onValueChange={(v) => {
            change(v);
            setValue(v);
          }}
        />
      );
    }
    renderUI(<Harness />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[1], { target: { value: "" } });
    expect(inputs.map((x) => (x as HTMLInputElement).value)).toEqual([
      "1",
      "",
      "3",
      "4",
      "5",
      "6",
    ]);
    expect(change).toHaveBeenLastCalledWith("13456");
    fireEvent.change(inputs[1], { target: { value: "9" } });
    expect(inputs.map((x) => (x as HTMLInputElement).value)).toEqual([
      "1",
      "9",
      "3",
      "4",
      "5",
      "6",
    ]);
    expect(change).toHaveBeenLastCalledWith("193456");
    fireEvent.paste(inputs[2], { clipboardData: { getData: () => "a!" } });
    expect(change).toHaveBeenLastCalledWith("193456");
    fireEvent.paste(inputs[2], { clipboardData: { getData: () => "87" } });
    expect(inputs.map((x) => (x as HTMLInputElement).value)).toEqual([
      "1",
      "9",
      "8",
      "7",
      "5",
      "6",
    ]);
  },
);
it("OTP accepts a controlled external reset after partial editing", () => {
  function Harness() {
    const [value, setValue] = useState("123456");
    return (
      <>
        <OtpInput label="Code" value={value} onValueChange={setValue} />
        <button onClick={() => setValue("")}>Reset</button>
      </>
    );
  }
  renderUI(<Harness />);
  fireEvent.change(screen.getAllByRole("textbox")[2], {
    target: { value: "" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  screen
    .getAllByRole("textbox")
    .forEach((input) => expect(input).toHaveValue(""));
});
it("BottomSheet keeps background inert and focus isolated until exit completes", async () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        <BottomSheet open={open} title="Sheet" onClose={() => setOpen(false)}>
          <Button>Last</Button>
        </BottomSheet>
      </>
    );
  }
  const { container } = renderUI(<Harness />);
  const trigger = screen.getByRole("button", { name: "Open" });
  trigger.focus();
  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: "Escape" });
  const dialog = screen.getByRole("dialog");
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
  expect(document.body.style.overflow).toBe("hidden");
  expect(container.inert).toBe(true);
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(container.inert).not.toBe(true);
  expect(trigger).toHaveFocus();
});
