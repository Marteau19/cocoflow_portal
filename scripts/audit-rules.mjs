/**
 * scripts/audit-rules.mjs
 *
 * Checks the rules added to DESIGN.md in this pass, the ones that were previously
 * enforced only by prose and therefore not at all. Section 19 lists them.
 *
 *   node scripts/audit-rules.mjs                 all 34 routes, both brands
 *   node scripts/audit-rules.mjs /route /parts   just these
 */

import { chromium } from 'playwright';

const ROUTES = process.argv.slice(2);

/** Route, role query and whether the role renders framed. */
const ALL = [
  ['/start', true], ['/request', true], ['/soil-test', true], ['/quote', true],
  ['/install', true], ['/handover', true],
  ['/home', true], ['/system', true], ['/invoices', true], ['/contract', true],
  ['/book', true], ['/parts', true], ['/messages', true], ['/system/transfer', true],
  ['/recommended', true],
  ['/day', true], ['/wo/WO-2026-0412', true], ['/route', true],
  ['/wo/WO-2026-0412/quote', true], ['/wo/WO-2026-0412/safety', true],
  ['/sp', false], ['/sp/dispatch', false], ['/sp/customers', false], ['/sp/leads', false],
  ['/sp/marcom', false], ['/sp/inventory', false], ['/sp/team', false],
  ['/flo', false],
  ['/network', false], ['/network/REG-QC', false], ['/mix', false], ['/adoption', false],
  ['/benchmarking', false], ['/readiness', false],
];

const targets = ROUTES.length ? ALL.filter(([r]) => ROUTES.includes(r)) : ALL;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let failures = 0;
let checks = 0;

for (const brand of ['legacy', 'next']) {
  for (const [route] of targets) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`http://localhost:5173${route}?brand=${brand}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const found = await page.evaluate(() => {
      const problems = [];
      const host =
        document.querySelector('[data-content-column]') ?? document.querySelector('main');
      if (!host) return [{ rule: 'shell', detail: 'no content host' }];

      const col = host.getBoundingClientRect();
      const shown = (el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        const cs = getComputedStyle(el);
        return cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05;
      };
      const opaque = (c) => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent';

      /* --- Nav has no fill ------------------------------------------------ */
      for (const nav of document.querySelectorAll('nav')) {
        for (const link of nav.querySelectorAll('a')) {
          if (!shown(link)) continue;
          const bg = getComputedStyle(link).backgroundColor;
          if (opaque(bg)) {
            problems.push({
              rule: 'nav-no-fill',
              detail: `${link.textContent.trim().slice(0, 20)} has background ${bg}`,
            });
          }
        }
      }

      /* --- Button geometry and label -------------------------------------- */
      const allowedHeights = [48, 40, 32];
      for (const btn of host.querySelectorAll('.btn-fill')) {
        if (!shown(btn)) continue;
        const cs = getComputedStyle(btn);
        // `plain` is a text action with no control box, exempt by spec.
        if (cs.paddingLeft === '0px') continue;
        const h = Math.round(btn.getBoundingClientRect().height);
        const label = btn.textContent.trim().slice(0, 18);
        if (!allowedHeights.includes(h)) {
          problems.push({ rule: 'button-height', detail: `"${label}" is ${h}px` });
        }
        if (cs.fontSize !== '15px' || cs.fontWeight !== '500') {
          problems.push({
            rule: 'button-label',
            detail: `"${label}" is ${cs.fontSize}/${cs.fontWeight}`,
          });
        }
      }

      /* --- No accent fill on a dark band ---------------------------------- */
      const lum = (c) => {
        const m = c.match(/\d+(\.\d+)?/g);
        if (!m) return 1;
        const [r, g, b] = m.slice(0, 3).map(Number);
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      };
      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim()
        .toLowerCase();
      const toRgb = (hex) => {
        const h = hex.replace('#', '');
        return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
      };
      const accentRgb = accent.startsWith('#') ? toRgb(accent) : accent;
      for (const band of host.querySelectorAll('[data-band]')) {
        if (lum(getComputedStyle(band).backgroundColor) > 0.3) continue;
        for (const btn of band.querySelectorAll('.btn-fill')) {
          if (!shown(btn)) continue;
          if (getComputedStyle(btn).backgroundColor === accentRgb) {
            problems.push({
              rule: 'no-accent-on-dark',
              detail: `"${btn.textContent.trim().slice(0, 18)}" is accent-filled on a dark band`,
            });
          }
        }
      }

      /* --- Gutter unity --------------------------------------------------- */
      const scope = host.querySelector('[data-register]') ?? host;
      const gutter = parseFloat(getComputedStyle(scope).getPropertyValue('--gutter')) || 0;
      /*
        Allowed left edges: the gutter, the icon-row offset, and one derived offset
        per leading image box actually present on the gutter.

        The derived offset is `gutter + box + 16`, per DESIGN.md section 6, so it is
        computed from what is on the page rather than hardcoded. A hardcoded 64
        assumed every leading box is a 48px thumbnail, which failed the client home,
        where the technician's face is deliberately 72px because it is the
        reassurance the whole screen is built on.
      */
      const allowed = new Set([gutter, gutter + 28]);
      for (const box of host.querySelectorAll('img, span, div')) {
        if (!shown(box)) continue;
        const r = box.getBoundingClientRect();
        if (Math.round(r.left - col.left) !== gutter) continue;
        if (r.width < 24 || r.width > 96) continue;
        /*
          A leading box is an image, or a short label in a fixed-width box: a stop
          number, a set of initials, an "N/A" placeholder. Requiring it to be square
          rejected the route's stop number, which is 48px wide by one line tall, and
          that box is exactly what makes an indexed list share a text edge with a
          thumbnail list.
        */
        const text = (box.textContent || '').trim();
        if (box.tagName !== 'IMG' && text.length > 4) continue;
        allowed.add(gutter + Math.round(r.width) + 16);
      }
      const leftEdges = new Map();
      for (const el of host.querySelectorAll('p, h1, h2, h3, dt, dd, img')) {
        if (!shown(el)) continue;
        const cs = getComputedStyle(el);
        // Skip anything positioned out of flow (the Blueprint callout) and
        // anything centred inside a box (a placeholder label).
        if (cs.position === 'absolute' || cs.textAlign === 'center') continue;
        const hasKids = [...el.children].some((c) => c.textContent?.trim());
        if (el.tagName !== 'IMG' && hasKids) continue;
        if (el.tagName !== 'IMG' && !el.textContent.trim()) continue;
        const box = el.getBoundingClientRect();
        const draws = opaque(cs.backgroundColor) || parseFloat(cs.borderLeftWidth) > 0;
        const left = Math.round(box.left + (draws ? 0 : parseFloat(cs.paddingLeft) || 0) - col.left);
        if (!leftEdges.has(left)) leftEdges.set(left, el.textContent.trim().slice(0, 22));
      }
      for (const [px, sample] of leftEdges) {
        if (!allowed.has(px)) {
          problems.push({ rule: 'gutter', detail: `left ${px} ("${sample}"), gutter ${gutter}` });
        }
      }

      /* --- Band heading step --------------------------------------------- */
      const headSizes = new Set(
        [...host.querySelectorAll('h2')].filter(shown).map((h) => getComputedStyle(h).fontSize),
      );
      if (headSizes.size > 1) {
        problems.push({ rule: 'heading-step', detail: `sizes ${[...headSizes].join(', ')}` });
      }

      /* --- Reading sizes: at most 4 outside the 11px and 15px registers --- */
      const reading = new Set();
      for (const el of host.querySelectorAll('p, h1, h2, h3, span, dt, dd, li')) {
        if (!shown(el)) continue;
        if (!el.textContent.trim()) continue;
        if ([...el.children].some((c) => c.textContent?.trim())) continue;
        const size = getComputedStyle(el).fontSize;
        if (size === '11px' || size === '15px') continue;
        reading.add(size);
      }
      if (reading.size > 4) {
        problems.push({ rule: 'reading-sizes', detail: `${reading.size}: ${[...reading].join(', ')}` });
      }

      /* --- Pill contrast against its own band ---------------------------- */
      for (const band of host.querySelectorAll('[data-band]')) {
        const bandBg = getComputedStyle(band).backgroundColor;
        for (const pill of band.querySelectorAll('span')) {
          if (!shown(pill)) continue;
          const cs = getComputedStyle(pill);
          if (cs.borderRadius === '0px' || !opaque(cs.backgroundColor)) continue;
          if (parseFloat(cs.borderLeftWidth) > 0) continue;
          if (cs.backgroundColor === bandBg) {
            problems.push({
              rule: 'pill-contrast',
              detail: `"${pill.textContent.trim().slice(0, 16)}" same ground as its band`,
            });
          }
        }
      }

      /* --- Hero rag: no orphan on the last line -------------------------- */
      /*
        Counts the words on the final visual line, by measuring a Range over each
        word and grouping by its top offset.

        The first version compared the last line's width against 45% of the box,
        which flagged a legitimately balanced two-line break: "Your system" over
        "is live" is short on the second line and is not an orphan. The rule is
        about a single stranded word, so count words.
      */
      const hero = [...host.querySelectorAll('p, h1, h2')]
        .filter(shown)
        .find(
          (e) =>
            parseFloat(getComputedStyle(e).fontSize) >= 40 && e.textContent.trim().length > 6,
        );
      if (hero && hero.firstChild && hero.firstChild.nodeType === Node.TEXT_NODE) {
        const raw = hero.firstChild.textContent;
        const tops = [];
        const re = /\S+/g;
        let m;
        while ((m = re.exec(raw))) {
          const range = document.createRange();
          range.setStart(hero.firstChild, m.index);
          range.setEnd(hero.firstChild, m.index + m[0].length);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0) tops.push(Math.round(rect.top));
        }
        if (tops.length > 1) {
          const lastTop = Math.max(...tops);
          const onLastLine = tops.filter((t) => t === lastTop).length;
          const lines = new Set(tops).size;
          if (lines > 1 && onLastLine === 1) {
            problems.push({
              rule: 'hero-rag',
              detail: `"${hero.textContent.trim()}" strands one word on line ${lines}`,
            });
          }
        }
      }

      /* --- No viewport breakpoint switching layout inside the frame ------- */
      if (document.querySelector('.device-screen')) {
        for (const el of host.querySelectorAll('[class*="lg:"], [class*="md:"]')) {
          const cls = el.className.toString();
          if (/\b(hidden|md:hidden|lg:hidden|md:block|lg:block|md:grid|lg:grid|md:flex|lg:flex)\b/.test(cls)) {
            problems.push({ rule: 'framed-breakpoint', detail: cls.slice(0, 70) });
          }
        }
      }

      return problems;
    });

    checks += 1;
    const all = [...found, ...errors.map((e) => ({ rule: 'page-error', detail: e.slice(0, 90) }))];
    if (all.length) {
      failures += all.length;
      console.log(`\nFAIL ${route} [${brand}]`);
      const seen = new Set();
      for (const p of all) {
        const key = `${p.rule}|${p.detail}`;
        if (seen.has(key)) continue;
        seen.add(key);
        console.log(`   ${p.rule.padEnd(20)} ${p.detail}`);
      }
    }
    await page.close();
  }
}

await browser.close();
console.log(
  failures === 0
    ? `\nAll ${checks} route/brand combinations pass every new rule.`
    : `\n${failures} findings across ${checks} route/brand combinations.`,
);
process.exit(failures === 0 ? 0 : 1);
