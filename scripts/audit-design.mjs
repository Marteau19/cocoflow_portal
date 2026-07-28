/**
 * scripts/audit-design.mjs
 *
 * Walks every route in both brands and checks the rules from DESIGN.md that can
 * be checked mechanically.
 *
 *   node scripts/audit-design.mjs                      # against the dev server
 *   node scripts/audit-design.mjs --base http://... --shots out/
 *
 * The point is not to replace looking at the screens. It is that the rules which
 * are easy to state and tedious to verify by eye, weight 600 and em-dashes and a
 * second accent fill, are exactly the ones that drift, and a reviewer who spots
 * one stops trusting the rest of the document.
 *
 * A rule appears here only if a violation is unambiguous. Judgement calls stay
 * with the eye.
 */

import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : process.argv[i + 1];
};

const BASE = arg('--base', 'http://localhost:5173');
const SHOTS = arg('--shots', null);

/** Every route, with the viewport its role is designed for. */
const ROUTES = [
  ['/start', 'mobile'],
  ['/request', 'mobile'],
  ['/soil-test', 'mobile'],
  ['/quote', 'mobile'],
  ['/install', 'mobile'],
  ['/handover', 'mobile'],
  ['/home', 'mobile'],
  ['/system', 'mobile'],
  ['/invoices', 'mobile'],
  ['/contract', 'mobile'],
  ['/book', 'mobile'],
  ['/parts', 'mobile'],
  ['/messages', 'mobile'],
  ['/system/transfer', 'mobile'],
  ['/recommended', 'mobile'],
  ['/day', 'mobile'],
  ['/wo/WO-2026-0412', 'mobile'],
  ['/route', 'mobile'],
  ['/wo/WO-2026-0412/quote', 'mobile'],
  ['/wo/WO-2026-0412/safety', 'mobile'],
  ['/sp', 'desktop'],
  ['/sp/dispatch', 'desktop'],
  ['/sp/customers', 'desktop'],
  ['/sp/leads', 'desktop'],
  ['/sp/marcom', 'desktop'],
  ['/sp/inventory', 'desktop'],
  ['/sp/team', 'desktop'],
  ['/flo', 'desktop'],
  ['/network', 'desktop'],
  ['/network/REG-QC-S', 'desktop'],
  ['/mix', 'desktop'],
  ['/adoption', 'desktop'],
  ['/benchmarking', 'desktop'],
  ['/readiness', 'desktop'],
];

const VIEWPORTS = {
  // Wide enough to trigger the device frame, so the framed register is what gets
  // audited: that is what a projector shows.
  mobile: { width: 1280, height: 900 },
  desktop: { width: 1440, height: 900 },
};

/**
 * Runs in the page. Returns findings as plain strings so the report stays
 * readable in a terminal.
 */
const inspect = () => {
  const findings = [];
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const all = [...document.querySelectorAll('body *')].filter(visible);

  const styles = new Map(all.map((el) => [el, getComputedStyle(el)]));

  // Weight 600 is not in the scale. DESIGN.md section 3.
  for (const el of all) {
    if (styles.get(el).fontWeight === '600') {
      findings.push(`weight 600 on <${el.tagName.toLowerCase()}> "${el.textContent?.trim().slice(0, 40)}"`);
      break;
    }
  }

  // No gradients in the interface. The brand wordmark is an <img>, not chrome.
  for (const el of all) {
    const s = styles.get(el);
    if (/gradient/.test(s.backgroundImage) || /gradient/.test(s.background)) {
      findings.push(`gradient on <${el.tagName.toLowerCase()}> class="${el.className}"`);
      break;
    }
  }

  const text = document.body.innerText;

  // No em-dashes anywhere in UI copy.
  if (text.includes('—')) {
    const line = text.split('\n').find((l) => l.includes('—'));
    findings.push(`em-dash: "${line?.trim().slice(0, 70)}"`);
  }

  // No emoji, including in data.
  const emoji = text.match(/\p{Extended_Pictographic}/u);
  if (emoji) findings.push(`emoji: ${emoji[0]}`);

  /**
   * One accent fill per screen.
   *
   * Counted by resolved background colour rather than by class, so an element
   * that reaches the accent by any route is caught. The active nav pill is an
   * expected second occurrence and is excluded by ancestry.
   */
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-accent')
    .trim();
  const toRgb = (hex) =>
    `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
  const accentRgb = accent.startsWith('#') ? toRgb(accent) : accent;
  const accentFills = all.filter(
    (el) => styles.get(el).backgroundColor === accentRgb && !el.closest('nav'),
  );
  if (accentFills.length > 1) {
    findings.push(
      `${accentFills.length} accent fills outside nav: ${accentFills
        .map((el) => `"${el.textContent?.trim().slice(0, 24)}"`)
        .join(', ')}`,
    );
  }

  /**
   * A coloured dot with no label.
   *
   * A dot is a small, empty, fully rounded element with a signal background.
   * "No label" means no text in its parent, which is the shape the ban is about.
   */
  for (const el of all) {
    const s = styles.get(el);
    const r = el.getBoundingClientRect();
    const round = parseFloat(s.borderRadius) >= r.width / 2 && r.width <= 12 && r.width > 2;
    if (!round || el.textContent?.trim()) continue;
    const opaque = s.backgroundColor !== 'rgba(0, 0, 0, 0)';
    if (opaque && !el.parentElement?.textContent?.trim()) {
      findings.push(`dot with no label: class="${el.className}"`);
      break;
    }
  }

  /**
   * A wrapped action label.
   *
   * Measured on the text node with a Range and counted by client rects, because
   * measuring element height flags every button that happens to have two
   * children and reports nothing useful.
   */
  for (const el of document.querySelectorAll('button, a')) {
    if (!visible(el)) continue;
    for (const node of el.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
      // Only action labels. A verb-first label is at most four words, so
      // anything longer is prose in a button, such as a suggested question put
      // to Flo, and prose is supposed to wrap.
      if (node.textContent.trim().split(/\s+/).length > 4) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      if (range.getClientRects().length > 1) {
        findings.push(`wrapped label: "${node.textContent.trim().slice(0, 40)}"`);
      }
    }
  }

  // Cards carry a resting shadow. DESIGN.md section 7, reversed from the
  // previous direction, so worth asserting rather than assuming.
  const cards = all.filter((el) => /rounded-card/.test(el.className || ''));
  const flat = cards.filter((el) => styles.get(el).boxShadow === 'none');
  if (cards.length > 0 && flat.length === cards.length) {
    findings.push(`${cards.length} cards, none with a shadow`);
  }

  // The page must not scroll sideways at any width.
  if (document.documentElement.scrollWidth > window.innerWidth + 1) {
    findings.push(
      `horizontal overflow: ${document.documentElement.scrollWidth} > ${window.innerWidth}`,
    );
  }

  // Every screen carries at least one annotation. The Blueprint layer and the
  // exported spec are only complete if this holds everywhere.
  if (!document.querySelector('[data-section-id]')) {
    findings.push('no annotated section');
  }

  return { findings, cards: cards.length, accentFills: accentFills.length };
};

if (SHOTS) await mkdir(SHOTS, { recursive: true });

// The environment ships a Chromium that may not match the version this
// Playwright build expects. Pointing at it directly is the difference between
// running the audit and being told to download a browser we already have.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
let total = 0;

for (const brand of ['legacy', 'next']) {
  console.log(`\n=== brand: ${brand} ===`);

  for (const [route, kind] of ROUTES) {
    const page = await browser.newPage({ viewport: VIEWPORTS[kind] });
    const problems = [];
    page.on('console', (m) => {
      if (m.type() === 'error') problems.push(`console: ${m.text().slice(0, 100)}`);
    });
    page.on('requestfailed', (r) => problems.push(`failed request: ${r.url().slice(0, 80)}`));

    await page.goto(`${BASE}${route}?brand=${brand}`, { waitUntil: 'networkidle' });
    // Charts and the map mount after paint.
    await page.waitForTimeout(350);

    const result = await page.evaluate(inspect);
    const findings = [...result.findings, ...problems];
    total += findings.length;

    const label = `${route.padEnd(24)} ${String(result.cards).padStart(2)} cards`;
    if (findings.length === 0) {
      console.log(`  ok   ${label}`);
    } else {
      console.log(`  FAIL ${label}`);
      findings.forEach((f) => console.log(`         ${f}`));
    }

    if (SHOTS) {
      const name = route.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'root';
      await page.screenshot({ path: `${SHOTS}/${brand}${name ? `-${name}` : ''}.png` });
    }

    await page.close();
  }
}

await browser.close();
console.log(total === 0 ? '\nClean across both brands.' : `\n${total} findings.`);
process.exit(total === 0 ? 0 : 1);
