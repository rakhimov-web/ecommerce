"""Optional browser verification; requires host Python Playwright and Chromium.

Start `pnpm dev --hostname 127.0.0.1 --port 3040` before running this file.
No browser tooling is added to the app's dependency graph before Stage 3.
"""

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = os.environ.get("STAGE2_BASE_URL", "http://127.0.0.1:3040").rstrip("/")
EVIDENCE = Path("docs/reviews/evidence/stage2-home-browser.json")
report = {"cases": [], "screenshots": [], "errors": [], "externalRequests": []}

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path="/usr/bin/chromium",
        headless=True,
        args=["--no-sandbox"],
    )
    report["chromium"] = browser.version
    page = browser.new_page()
    # Suppress observer delivery at 320px to exercise the fallback independently.
    # Next's router also uses this API, so keep its constructor contract intact.
    page.add_init_script("""if (innerWidth === 320) {
      window.IntersectionObserver = class {
        root = null; rootMargin = '0px'; thresholds = [0];
        observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
      };
    }""")
    page.on("pageerror", lambda error: report["errors"].append(str(error)))

    def record_request(request):
        if request.url.startswith("http") and not request.url.startswith(BASE + "/"):
            report["externalRequests"].append(request.url)

    page.on("request", record_request)
    for locale in ["uz", "ru"]:
        for width in [320, 360, 1280]:
            page.set_viewport_size({"width": width, "height": 900})
            response = page.goto(f"{BASE}/{locale}", wait_until="networkidle")
            assert response.status == 200
            assert page.locator("html").get_attribute("lang") == locale, (locale, width, page.url, page.locator("html").get_attribute("lang"))
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
            assert page.locator(".category-grid a").count() == 8
            rails = page.locator(".product-rail")
            assert rails.count() == 3
            for rail in rails.all():
                assert rail.locator(".product-card").count() == 8

            ratio = page.locator(".product-stage-banner").first.evaluate(
                "element => getComputedStyle(element).aspectRatio"
            )
            assert ratio == ("4 / 5" if width < 640 else "16 / 9")
            organization = json.loads(
                page.locator('script[type="application/ld+json"]').inner_text()
            )
            assert organization["@type"] == "Organization"

            # The development toolbar's shadow tree is supplied by Next, not the app.
            small_targets = page.locator("a,button:not([disabled]),input").evaluate_all(
                """elements => elements
                  .filter(e => e.getRootNode() === document && !e.closest('[inert]')
                    && e.getBoundingClientRect().width > 0)
                  .map(e => ({tag: e.tagName, name: e.getAttribute('aria-label')
                    || e.textContent, width: e.getBoundingClientRect().width,
                    height: e.getBoundingClientRect().height}))
                  .filter(e => e.width < 43.9 || e.height < 43.9)"""
            )
            assert not small_targets, small_targets

            grid = page.locator("#home-for-you").locator("..").locator(".product-card")
            for _ in range(8):
                button = page.locator(".load-more button")
                if not button.count():
                    break
                if not button.is_enabled():
                    page.wait_for_timeout(400)
                    continue
                before = grid.count()
                if width == 320:
                    button.click()
                else:
                    # Scrolling the button into view fires the nearby sentinel. Avoid
                    # clicking a control that may move/disappear as the fetch completes.
                    page.evaluate("document.querySelector('.load-more').scrollIntoView({block: 'end'})")
                page.wait_for_function(
                    """before => document.querySelectorAll(
                      '#home-for-you + .product-grid .product-card').length > before
                      || document.querySelector('#home-for-you').parentElement
                        .querySelector('[role=alert]')""",
                    arg=before,
                )
            assert grid.count() == 30
            ids = grid.locator(".product-title-link").evaluate_all(
                "elements => elements.map(e => e.getAttribute('href'))"
            )
            assert len(set(ids)) == 30

            page.add_script_tag(path="node_modules/axe-core/axe.min.js")
            result = page.evaluate(
                """async () => await axe.run(document, {runOnly: {type: 'tag',
                  values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']}})"""
            )
            assert not result["violations"], result["violations"]
            report["axe"] = page.evaluate("axe.version")
            report["cases"].append({
                "locale": locale, "width": width, "height": 900,
                "horizontalOverflow": False, "smallTargets": small_targets,
                "gridProducts": grid.count(), "duplicateProducts": False,
                "bannerRatio": ratio, "axeViolations": [],
                "loadingMode": "fallback button" if width == 320 else "intersection observer",
            })

            if locale == "uz" and width in [360, 1280]:
                page.emulate_media(reduced_motion="reduce")
                page.add_style_tag(content="nextjs-portal{display:none!important;}")
                page.evaluate("scrollTo(0, 0)")
                page.wait_for_timeout(300)
                path = Path(f"docs/screenshots/stage2-home-{width}.jpg")
                page.screenshot(path=str(path), full_page=True, type="jpeg", quality=18)
                size = path.stat().st_size
                assert size < 300_000, size
                report["screenshots"].append({"path": str(path), "bytes": size})
                page.emulate_media(reduced_motion="no-preference")

    assert not report["errors"], report["errors"]
    assert not report["externalRequests"], report["externalRequests"]
    assert page.request.get(f"{BASE}/api/catalog/products?limit=49").status == 400
    result = page.request.get(f"{BASE}/api/catalog/products?limit=8").json()
    assert result["data"]["total"] == 30
    product = result["data"]["items"][0]
    page.goto(f"{BASE}/uz/p/{product['slug']}", wait_until="networkidle")
    assert page.locator(".bottom-tab-bar").count() == 0
    report["apiLimitAndProductPlaceholder"] = "pass"
    browser.close()

EVIDENCE.parent.mkdir(parents=True, exist_ok=True)
EVIDENCE.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(f"PASS: 6 responsive/locale cases; pagination, targets, axe, JSON-LD, API. {EVIDENCE}")
