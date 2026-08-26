/**
 * scripts/shoot.mjs
 *
 * Screenshots the client-owner screens in both brands at both handset widths,
 * so a phase can be reviewed as pictures rather than as a diff.
 *
 *   node scripts/shoot.mjs                     both brands, both widths
 *   node scripts/shoot.mjs --out docs/shots    somewhere other than the default
 *   node scripts/shoot.mjs --routes /home,/system
 *   node scripts/shoot.mjs --full              whole scroll height, not one viewport
 *
 * Why both widths. iPhone 15 is the width the screens are designed at; the SE is
 * where a 48px heading turns into three lines and a fixed-height block starts
 * eating the fold. Almost every composition fault in this build showed up at the
 * narrow width first, so reviewing only the wide one is reviewing the easy case.
 *
 * Why both brands, every time. The brand switch is a zero-component-edit
 * operation only for as long as nobody hardcodes a value, and the cheapest way to
 * catch the day somebody does is to look at the two side by side.
 *
 * Deliberately below the 900px frame breakpoint: this shoots the app as a phone
 * renders it, not as the projector device frame presents it.
 */

import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : process.argv[i + 1];
};

const BASE = arg('--base', 'http://localhost:5173');
const OUT = arg('--out', 'docs/shots');
const FULL = process.argv.includes('--full');
const ROUTES = arg('--routes', '/home,/system,/book,/parts').split(',');

/** The two widths that matter. Height is the visible fold, not the page. */
const WIDTHS = [
  { tag: 'ip15', width: 393, height: 852 },
  { tag: 'se', width: 375, height: 667 },
];

const BRANDS = ['legacy', 'next'];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let shots = 0;

for (const brand of BRANDS) {
  for (const { tag, width, height } of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 2,
    });

    for (const route of ROUTES) {
      await page.goto(`${BASE}${route}?brand=${brand}`, { waitUntil: 'networkidle' });
      // Long enough for the webfonts to swap in and any mount transition to
      // settle. A screenshot taken mid-transition is a screenshot of nothing.
      await page.waitForTimeout(400);

      const name = route.replace(/^\//, '').replace(/\//g, '-') || 'root';
      await page.screenshot({
        path: `${OUT}/${name}-${brand}-${tag}.png`,
        fullPage: FULL,
      });
      shots += 1;
    }

    await page.close();
  }
}

await browser.close();
console.log(`${shots} screenshots in ${OUT}`);
