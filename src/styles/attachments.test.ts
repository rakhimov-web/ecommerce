import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { it, expect } from "vitest";
it("preserves AGENTS.md", () =>
  expect(
    createHash("sha256").update(readFileSync("AGENTS.md")).digest("hex"),
  ).toBe("3176e698e9bcf2b148e3a8125e1fc7c7006302f8d74e8b5f6502010dd2d2a57b"));
it("preserves SPEC.md", () =>
  expect(
    createHash("sha256").update(readFileSync("SPEC.md")).digest("hex"),
  ).toBe("334594ce8b4f53604bb749130e0a2afc3e1f2c5f2cda3af1b9639433ea70427c"));
it("preserves DESIGN.md", () =>
  expect(
    createHash("sha256").update(readFileSync("DESIGN.md")).digest("hex"),
  ).toBe("dd6a091d410ee89c3e3fb53e012816235f963a5cfadfc4e61e49024f847eb716"));
it("preserves logo-demo.svg", () =>
  expect(
    createHash("sha256")
      .update(readFileSync("public/brand/logo-demo.svg"))
      .digest("hex"),
  ).toBe("533d13b69eb38a2bea9d529776c7c6a34e4d5f778896da7ce06ad68efbd795c6"));
it("preserves image-placeholder.svg", () =>
  expect(
    createHash("sha256")
      .update(readFileSync("public/placeholders/image-placeholder.svg"))
      .digest("hex"),
  ).toBe("3d15c263e9a6073f81920ec12b7ae1b4ef8513a395cf1e3019533edefb709613"));
