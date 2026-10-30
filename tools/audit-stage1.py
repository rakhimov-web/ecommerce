"""Browser acceptance audit. Requires Python Playwright and Chromium on the host.
Run against `pnpm dev -- --port 3040`; no package/runtime feature is added.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='http://127.0.0.1:3040')
parser.add_argument('--output', default='docs/reviews/evidence/browser.json')
args = parser.parse_args()
report = {'routes': [], 'gallery': [], 'errors': [], 'external_requests': []}
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    report['chromium'] = browser.version
    page = browser.new_page()
    page.on('pageerror', lambda error: report['errors'].append(str(error)))
    page.on('request', lambda req: report['external_requests'].append(req.url) if req.url.startswith('http') and not req.url.startswith(args.base) else None)
    for width in [320, 360, 640, 1023, 1024, 1280]:
        page.set_viewport_size({'width': width, 'height': 900})
        for locale in ['uz', 'ru']:
            for path in ['', '/catalog', '/cart', '/favorites', '/profile']:
                url = f'/{locale}{path}'
                assert page.goto(args.base + url, wait_until='networkidle').status == 200
                assert page.locator('html').get_attribute('lang') == locale
                assert page.locator('.bottom-tab-bar').is_visible() == (width < 1024)
                assert page.locator('.desktop-header').is_visible() == (width >= 1024)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                assert page.locator('.bottom-tab-bar [aria-current="page"]').count() == 1
                if width < 1024:
                    assert page.locator('.mobile-logo-row a').bounding_box()['height'] >= 44
                if width == 360 and locale == 'uz' and not path:
                    page.locator('main').evaluate('(e)=>e.style.minHeight="1800px"')
                    page.evaluate('scrollTo(0,400)')
                    page.wait_for_function('document.querySelector(".mobile-search").classList.contains("header-scrolled")')
                    assert abs(page.locator('.mobile-search').bounding_box()['y']) < 1
                    assert page.locator('.mobile-logo-row').bounding_box()['y'] < 0
                report['routes'].append({'path': url, 'width': width, 'status': 'pass'})
    page.goto(args.base + '/', wait_until='networkidle')
    assert page.url.endswith('/uz')
    page.goto(args.base + '/uz/info/demo', wait_until='networkidle')
    assert page.locator('.bottom-tab-bar').count() == 0
    for width in [320, 360, 768, 1280]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.goto(args.base + '/dev/gallery', wait_until='networkidle')
        page.add_script_tag(path='node_modules/axe-core/axe.min.js')
        for locale in ['uz', 'ru']:
            page.locator('.gallery-nav button').nth(0 if locale == 'uz' else 1).click()
            assert page.locator('html').get_attribute('lang') == locale
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            # Scope product targets to main; Next's shadow-root debugger is not shipped UI.
            small = page.locator('main').locator('button:not(:disabled),input:not(:disabled),a[href]').evaluate_all('''nodes => nodes.filter(e => e.getBoundingClientRect().height > 0 && !e.closest('[inert]')).filter(e => {const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9;}).map(e=>({html:e.outerHTML,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))''')
            assert not small, small
            columns = page.locator('.product-grid').evaluate('(e)=>getComputedStyle(e).gridTemplateColumns.split(" ").length')
            assert columns == (2 if width < 640 else 3 if width < 1024 else 4)
            size = page.locator('.type-display-campaign').first.evaluate('(e)=>getComputedStyle(e).fontSize')
            assert size == ('40px' if width < 640 else '64px' if width < 1024 else '96px')
            assert page.locator('.product-card .price-current').first.evaluate('(e)=>getComputedStyle(e).fontSize') == '16px'
            for font in ['inter', 'oswald']:
                samples = page.locator(f'.font-{font} p[lang="uz"]').first.inner_text()
                assert all(char in samples for char in ['ʻ', 'ʼ'])
                assert 'русский' in page.locator(f'.font-{font} p[lang="ru"]').first.inner_text().lower()
            assert page.locator('.product-card h3').nth(4).evaluate('(e)=>getComputedStyle(e).webkitLineClamp') == '2'
            assert page.locator('.button-label').evaluate_all('nodes=>nodes.filter(e=>e.getBoundingClientRect().height>0).every(e=>e.scrollWidth<=e.clientWidth+1)')
            padding = page.locator('.chip-row .chip').first.evaluate('(e)=>getComputedStyle(e).paddingLeft')
            assert padding == '16px'
            assert page.locator('.field>input').first.evaluate('(e)=>getComputedStyle(e).paddingLeft') == '16px'
            assert page.locator('.search-pill').first.evaluate('(e)=>getComputedStyle(e).paddingLeft') == '16px'
            # Run all axe rules, including WCAG 2.1 label-in-name (unweighted by Lighthouse).
            result = page.evaluate('async()=>await axe.run(document)')
            violations = [{'id': v['id'], 'nodes': [n['html'] for n in v['nodes']]} for v in result['violations']]
            assert not violations, violations
            report['gallery'].append({'width': width, 'locale': locale, 'axe_version': result['testEngine']['version'], 'axe_violations': 0, 'axe_passes': len(result['passes']), 'columns': columns, 'display_size': size, 'minimum_targets': '44px', 'glyph_samples': 'pass'})
        # Exercise controlled middle-slot editing in the gallery.
        otp = page.locator('.otp-row').first.locator('input')
        for i, digit in enumerate('123'): otp.nth(i).fill(digit)
        otp.nth(1).fill('')
        assert otp.evaluate_all('(nodes)=>nodes.map(e=>e.value)') == ['1', '', '3', '', '', '']
        otp.nth(1).fill('9')
        assert otp.evaluate_all('(nodes)=>nodes.map(e=>e.value)') == ['1', '9', '3', '', '', '']
        # Reset to Uzbek so action labels are deterministic.
        page.locator('.gallery-nav button').nth(0).click()
        trigger = page.get_by_role('button', name='Pastki panelni ochish', exact=True)
        trigger.click()
        dialog = page.get_by_role('dialog')
        assert dialog.evaluate('(e)=>e.contains(document.activeElement)')
        page.keyboard.press('Shift+Tab')
        assert page.get_by_role('button', name='Tushunarli', exact=True).evaluate('(e)=>e===document.activeElement')
        page.keyboard.press('Escape')
        if dialog.count():
            assert dialog.evaluate('(e)=>e.contains(document.activeElement)')
            assert page.evaluate('document.body.style.overflow') == 'hidden'
        dialog.wait_for(state='detached')
        assert trigger.evaluate('(e)=>e===document.activeElement')
    page.emulate_media(reduced_motion='reduce')
    page.reload(wait_until='networkidle')
    assert page.locator('.skeleton').first.evaluate('(e)=>getComputedStyle(e,"::after").animationName') == 'none'
    page.locator('[data-state="pressed"]').first.evaluate('(e)=>{if(getComputedStyle(e).transform!=="none")throw Error("Pressed transform remained");}')
    report['reduced_motion'] = 'pass'
    report['component_spacing_and_long_strings'] = 'pass'
    report['sticky_header'] = 'pass'
    report['modal_exit_isolation'] = 'pass'
    report['root_redirect_and_no_tab_bar'] = 'pass'
    report['otp_slot_editing'] = 'pass'
    assert not report['errors'], report['errors']
    assert not report['external_requests'], report['external_requests']
    browser.close()
Path(args.output).parent.mkdir(parents=True, exist_ok=True)
Path(args.output).write_text(json.dumps(report, indent=2) + '\n')
print(f"PASS: {len(report['routes'])} shell cases, {len(report['gallery'])} full axe/locale/typography cases; evidence saved to {args.output}")
