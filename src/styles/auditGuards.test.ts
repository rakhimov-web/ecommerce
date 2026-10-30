import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { parse } from "yaml";
import { it, expect } from "vitest";
const production: string[] = [];
function collect(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (
      /\.(tsx?|css)$/.test(path) &&
      !path.includes(".test.") &&
      !path.startsWith("src/test/")
    )
      production.push(path);
  }
}
collect("src");
it("scans all runtime source for raw hex, arbitrary geometry utilities, any and hardcoded JSX copy", () => {
  for (const path of production) {
    const text = readFileSync(path, "utf8");
    if (path !== "src/app/globals.css")
      expect(text, path).not.toMatch(/#[\da-f]{3,8}\b/i);
    expect(text, path).not.toMatch(
      /\b(?:rounded(?:-[\w]+)?|[mp][xytrblse]?|gap(?:-[xy])?|space-[xy]|duration|delay)-\[/,
    );
    if (!/\.tsx?$/.test(path)) continue;
    const source = ts.createSourceFile(
      path,
      text,
      ts.ScriptTarget.Latest,
      true,
      path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    function visit(node: ts.Node) {
      expect(
        node.kind === ts.SyntaxKind.AnyKeyword,
        `${path}: explicit any`,
      ).toBe(false);
      if (ts.isJsxText(node))
        expect(node.text.trim(), `${path}: untranslated JSX text`).not.toMatch(
          /\p{L}/u,
        );
      if (
        ts.isJsxAttribute(node) &&
        ["alt", "title", "placeholder", "aria-label"].includes(
          node.name.getText(source),
        ) &&
        node.initializer &&
        ts.isStringLiteral(node.initializer)
      )
        expect(
          node.initializer.text,
          `${path}: untranslated attribute`,
        ).not.toMatch(/\p{L}/u);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
});
it("guards stylesheet sources, permitting only documented inset hairlines and skeleton shimmer", () => {
  for (const path of production.filter(
    (p) => p.endsWith(".css") && p !== "src/app/globals.css",
  )) {
    const text = readFileSync(path, "utf8");
    expect(text, path).not.toMatch(/drop-shadow|radial-gradient/i);
    for (const match of text.matchAll(/box-shadow:\s*([^;]+);/g))
      expect(match[1].replace(/\s+/g, " "), path).toMatch(
        /^inset 0 -?1px 0 var\(--colors-hairline-soft\)$/,
      );
    for (const match of text.matchAll(/(?:[.\w:#*-]+\s*)\{([^{}]*)\}/g)) {
      if (match[1].includes("linear-gradient"))
        expect(match[0], path).toMatch(/^\.skeleton::after\s*\{/);
    }
    for (const keyframe of text.matchAll(
      /@keyframes\s+[\w-]+\s*\{([\s\S]*?)\n\}/g,
    ))
      for (const declaration of keyframe[1].matchAll(/([a-z-]+)\s*:/g))
        expect(["opacity", "transform"], path).toContain(declaration[1]);
  }
});
it("derives component padding from the design and pins every direct dependency exactly", () => {
  const design = parse(readFileSync("DESIGN.md", "utf8").split("---")[1]) as {
    components: Record<string, { padding?: string }>;
  };
  const css = readFileSync("src/app/globals.css", "utf8");
  for (const [name, component] of Object.entries(design.components))
    if (component.padding)
      expect(css.replace(/\s/g, ""), name).toContain(
        `--component-${name}-padding:${component.padding.replace(/\s/g, "")};`,
      );
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  for (const [name, version] of Object.entries({
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }))
    expect(version, name).toMatch(/^\d+\.\d+\.\d+$/);
});
