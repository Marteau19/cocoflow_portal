/**
 * scripts/measure-align.mjs
 *
 * Reports where things actually sit, so alignment is measured rather than
 * eyeballed. For each route it prints the left edge of every text-bearing or
 * control element inside the content column, grouped by distinct edge, plus the
 * computed font size of every heading.
 *
 * Run against a dev server: node scripts/measure-align.mjs /route /parts
 */

import { chromium } from 'playwright';

const ROUTES = process.argv.slice(2);
if (ROUTES.length === 0) {
  console.error('usage: node scripts/measure-align.mjs /route /parts');
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);

  const report = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return { error: 'no main' };
    const mainBox = main.getBoundingClientRect();

    // The content column, marked by the shell. On a full-bleed role it is the
    // workspace beside the sidebar, not <main>, which would include the sidebar.
    const screen = document.querySelector('[data-content-column]');
    const col = screen ? screen.getBoundingClientRect() : mainBox;

    const edges = new Map();
    const rights = new Map();
    const fonts = [];

    const visible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
    };

    // Leaf-ish elements that carry a visible left edge the eye can line up on.
    const candidates = [
      ...(screen || main).querySelectorAll('p, h1, h2, h3, span, button, a, img, input, select, dt, dd'),
    ].filter((el) => {
      if (!visible(el)) return false;
      // Skip wrappers whose text lives in a child; keep real leaves.
      const hasElementChildWithText = [...el.children].some(
        (c) => c.textContent && c.textContent.trim().length > 0,
      );
      if (el.tagName !== 'IMG' && el.tagName !== 'INPUT' && hasElementChildWithText) return false;
      const t = (el.textContent || '').trim();
      return el.tagName === 'IMG' || el.tagName === 'INPUT' || t.length > 0;
    });

    for (const el of candidates) {
      const r = el.getBoundingClientRect();
      const cs0 = getComputedStyle(el);
      /*
        Report the edge the eye actually lines up on, which depends on whether the
        element draws a box.

        A paragraph carrying its own `px-gutter` has a border box at 0 and text at
        the gutter, so for it the text edge is what matters and the padding has to
        be added. A status pill or a filled button is the opposite: it draws a
        visible rectangle, and what aligns is that rectangle's edge, not the label
        inside it.

        Getting this wrong in either direction produces false readings. Reporting
        the border box everywhere made padded paragraphs look misaligned; adding
        padding everywhere made every pill and button look inset by its own
        padding.
      */
      const drawsBox =
        (cs0.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs0.backgroundColor !== 'transparent') ||
        parseFloat(cs0.borderLeftWidth) > 0 ||
        parseFloat(cs0.borderTopWidth) > 0;
      const padL = drawsBox ? 0 : parseFloat(cs0.paddingLeft) || 0;
      const padR = drawsBox ? 0 : parseFloat(cs0.paddingRight) || 0;
      const left = Math.round(r.left + padL - col.left);
      const right = Math.round(col.right - (r.right - padR));
      const label = ((el.textContent || el.getAttribute('alt') || el.tagName).trim() || el.tagName)
        .slice(0, 34)
        .replace(/\s+/g, ' ');

      if (!edges.has(left)) edges.set(left, []);
      edges.get(left).push(label);

      if (!rights.has(right)) rights.set(right, []);
      rights.get(right).push(label);

      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      if (el.tagName !== 'IMG' && el.tagName !== 'INPUT') {
        fonts.push({ size, weight: cs.fontWeight, label });
      }
    }

    // Distinct font sizes visible on the screen.
    const bySize = new Map();
    for (const f of fonts) {
      if (!bySize.has(f.size)) bySize.set(f.size, []);
      bySize.get(f.size).push(f.label);
    }

    // Band headings specifically: the h2 inside each BandHead.
    const headings = [...(screen || main).querySelectorAll('h2')]
      .filter(visible)
      .map((h) => ({
        text: (h.textContent || '').trim().slice(0, 30),
        size: parseFloat(getComputedStyle(h).fontSize),
        left: Math.round(h.getBoundingClientRect().left - col.left),
      }));

    // Any element that overflows the content column horizontally.
    const gutterVar = getComputedStyle(document.documentElement).getPropertyValue('--gutter');

    return {
      columnWidth: Math.round(col.width),
      framed: Boolean(screen),
      gutterToken: gutterVar.trim(),
      leftEdges: [...edges.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([px, labels]) => ({ px, count: labels.length, sample: labels.slice(0, 4) })),
      rightEdges: [...rights.entries()]
        .sort((a, b) => a[0] - b[0])
        .filter(([, labels]) => labels.length > 1)
        .slice(0, 8)
        .map(([px, labels]) => ({ px, count: labels.length, sample: labels.slice(0, 3) })),
      distinctFontSizes: [...bySize.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([size, labels]) => ({ size, count: labels.length, sample: labels.slice(0, 3) })),
      bandHeadings: headings,
    };
  });

  console.log('\n================ ' + route + ' ================');
  console.log(
    `column ${report.columnWidth}px, framed ${report.framed}, --gutter ${report.gutterToken}`,
  );

  console.log('\n-- distinct left edges (px from content column left) --');
  for (const e of report.leftEdges) {
    console.log(`  ${String(e.px).padStart(4)}  x${String(e.count).padStart(3)}  ${e.sample.join(' | ')}`);
  }

  console.log('\n-- shared right edges --');
  for (const e of report.rightEdges) {
    console.log(`  ${String(e.px).padStart(4)}  x${String(e.count).padStart(3)}  ${e.sample.join(' | ')}`);
  }

  console.log(`\n-- distinct font sizes: ${report.distinctFontSizes.length} --`);
  for (const f of report.distinctFontSizes) {
    console.log(`  ${String(f.size).padStart(5)}px x${String(f.count).padStart(3)}  ${f.sample.join(' | ')}`);
  }

  console.log('\n-- band headings --');
  for (const h of report.bandHeadings) {
    console.log(`  ${String(h.size).padStart(5)}px  left ${String(h.left).padStart(4)}  ${h.text}`);
  }

  await page.close();
}

await browser.close();
