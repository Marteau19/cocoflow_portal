/**
 * scripts/export-copy.mjs
 *
 * Exports every string the portal renders, organised by role, screen and band.
 *
 *   node scripts/export-copy.mjs            writes docs/COPY.md and docs/COPY-strings.csv
 *
 * Why it walks the running app rather than grepping the source. A lot of the copy
 * is assembled at render time: dates through `lib/format`, counts and durations
 * interpolated into sentences, arrival lines chosen by work order status, plural
 * forms. Grepping JSX would export the templates and miss what a reader actually
 * sees. Rendering it and reading the DOM exports the finished sentences.
 *
 * Two outputs, because two audiences want different things:
 *
 *   COPY.md           every screen in reading order, for a copy review
 *   COPY-strings.csv  unique strings with where they appear, for translation
 *
 * The CSV marks whether a string came from `seedData.ts`, because those are mock
 * customer names, addresses and identifiers. They are content, not interface copy,
 * and translating them would be wrong: `WO-2026-0412` and "Sarah and Julien Lavoie"
 * stay as they are in every language.
 */

import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'http://localhost:5173';

/** Role, then its screens in the order the inventory in CLAUDE.md lists them. */
const ROLES = [
  {
    key: 'client-prospect',
    nav: ['Start', 'Request', 'Quote', 'Project'],
    label: 'Client, before install',
    viewport: 'mobile',
    screens: [
      ['/start', 'Intake'],
      ['/request', 'Request received, team assigned'],
      ['/soil-test', 'Soil test and report'],
      ['/quote', 'Your solution and quote'],
      ['/install', 'Installation and project tracking'],
      ['/handover', 'Handover to owner'],
    ],
  },
  {
    key: 'client-owner',
    nav: ['Home', 'My system', 'Book', 'Parts'],
    label: 'Client, system owner',
    viewport: 'mobile',
    screens: [
      ['/home', 'Home'],
      ['/system', 'My system'],
      ['/invoices', 'Invoices and payment'],
      ['/contract', 'Maintenance contract'],
      ['/book', 'Book an appointment'],
      ['/parts', 'Parts store'],
      ['/messages', 'Messages'],
      ['/system/transfer', 'Transfer ownership'],
      ['/recommended', 'Recommended for your property'],
    ],
  },
  {
    key: 'sp-technician',
    nav: ['My day', 'Route', 'Flo'],
    label: 'Service Point, technician',
    viewport: 'mobile',
    screens: [
      ['/day', 'My day'],
      ['/wo/WO-2026-0412', 'Work order detail'],
      ['/route', 'Route and schedule'],
      ['/wo/WO-2026-0412/quote', 'Field quote'],
      ['/wo/WO-2026-0412/safety', 'Pre-job safety check'],
    ],
  },
  {
    key: 'sp-manager',
    nav: ['Dashboard', 'Dispatch', 'Customers', 'Leads', 'MARCOM', 'Inventory', 'Team', 'Flo'],
    label: 'Service Point, manager',
    viewport: 'responsive',
    screens: [
      ['/sp', 'Service Point dashboard'],
      ['/sp/dispatch', 'Dispatch board'],
      ['/sp/customers', 'Customers'],
      ['/sp/leads', 'Leads'],
      ['/sp/marcom', 'MARCOM catalogue'],
      ['/sp/inventory', 'Inventory'],
      ['/sp/team', 'Team and capacity'],
      ['/flo', 'Flo'],
    ],
  },
  {
    key: 'ptwe-global',
    nav: ['Network', 'Mix tracker', 'Adoption', 'Benchmarking', 'Readiness'],
    label: 'PTWE Global',
    viewport: 'desktop',
    screens: [
      ['/network', 'Network overview'],
      ['/network/REG-QC', 'Region and Service Point drill'],
      ['/mix', 'Strategic mix tracker'],
      ['/adoption', 'Digital adoption and Flo analytics'],
      ['/benchmarking', 'Benchmarking and alerts'],
      ['/readiness', 'Service Point readiness'],
    ],
  },
];

/**
 * Strings that live in `seedData.ts`. Used to mark mock content in the CSV so a
 * translator does not try to translate a customer's name or a work order number.
 *
 * Matched against quoted literals in the seed file rather than parsed, because the
 * file is a TypeScript module and this script has no build step. A quoted literal
 * that happens to also be interface copy will be marked as data, which is the safe
 * direction to be wrong in: it means a reviewer looks at it.
 */
const seedLiterals = new Set(
  [...readFileSync('src/data/seedData.ts', 'utf8').matchAll(/'([^'\n]{3,})'/g)].map((m) => m[1]),
);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

/** Extracts the visible text of one route, grouped by band, in reading order. */
const readRoute = async (page, route) => {
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  return page.evaluate(() => {
    const host =
      document.querySelector('[data-content-column]') ?? document.querySelector('main');
    if (!host) return { bands: [], loose: [] };

    const seen = new Set();
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
    };

    /*
      Report the element that owns each run of text, using `textContent` rather
      than stitching its own text nodes together.

      The first version joined an element's text nodes with a space, which turned
      `{name}, {servicePoint}` into "Marc Bouchard , Service Point Estrie". The
      comma is its own text node, so the join inserted a space in front of it. For a
      copy review that is worse than useless: it reports punctuation the product
      does not have.

      Walking in document order, an element is reported when it is a leaf as far as
      text goes, or when it has mixed content (its own text plus child elements), in
      which case the whole sentence belongs to it and its descendants are marked
      covered. A pure container is skipped and its children speak for themselves.
    */
    const textOf = (root) => {
      const out = [];
      const covered = new Set();
      for (const el of root.querySelectorAll('*')) {
        if (covered.has(el) || !visible(el)) continue;
        // Blueprint callouts are annotation chrome, not product copy.
        if (el.closest('[aria-label^="Callout "], [aria-label^="About this section"]')) continue;
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) continue;

        const childrenWithText = [...el.children].filter(
          (c) => c.textContent && c.textContent.trim(),
        );
        const hasOwnText = [...el.childNodes].some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
        );

        if (childrenWithText.length === 0 || hasOwnText) {
          if (!seen.has(text)) {
            seen.add(text);
            out.push({ text, tag: el.tagName.toLowerCase() });
          }
          for (const d of el.querySelectorAll('*')) covered.add(d);
        }
      }
      for (const img of root.querySelectorAll('img')) {
        if (!visible(img)) continue;
        const alt = (img.getAttribute('alt') || '').trim();
        if (alt && !seen.has('alt:' + alt)) {
          seen.add('alt:' + alt);
          out.push({ text: alt, tag: 'img-alt' });
        }
      }
      return out;
    };

    const bands = [...host.querySelectorAll('[data-band]')].map((band) => ({
      kind: band.dataset.band,
      lines: textOf(band),
    }));

    // Anything outside a band: sticky triggers, loading states, the offline strip
    // on screens not yet converted.
    const inBand = new Set();
    for (const band of host.querySelectorAll('[data-band]')) {
      for (const el of band.querySelectorAll('*')) inBand.add(el);
    }
    const loose = [];
    const looseCovered = new Set();
    for (const el of host.querySelectorAll('*')) {
      if (inBand.has(el) || el.closest('[data-band]')) continue;
      if (looseCovered.has(el) || !visible(el)) continue;
      if (el.closest('[aria-label^="Callout "], [aria-label^="About this section"]')) continue;
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      const childrenWithText = [...el.children].filter((c) => c.textContent && c.textContent.trim());
      const hasOwnText = [...el.childNodes].some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (childrenWithText.length === 0 || hasOwnText) {
        if (!seen.has(text)) {
          seen.add(text);
          loose.push({ text, tag: el.tagName.toLowerCase() });
        }
        for (const d of el.querySelectorAll('*')) looseCovered.add(d);
      }
    }

    return { bands, loose };
  });
};

/** The shell: top bar, role switcher, navigation. Reported once, not per screen. */
const readShell = async (page) => {
  await page.goto(BASE + '/home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  return page.evaluate(() => {
    const grab = (root) =>
      [...root.querySelectorAll('*')]
        .map((el) =>
          [...el.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent.replace(/\s+/g, ' ').trim())
            .filter(Boolean)
            .join(' '),
        )
        .filter(Boolean);
    const uniq = (a) => [...new Set(a)];
    return {
      topBar: uniq(grab(document.querySelector('header'))),
      nav: uniq(grab(document.querySelector('nav'))),
    };
  });
};

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const shell = await readShell(page);

const md = [];
const rows = [];
let stringCount = 0;

md.push('# Ecoflo Portal, all interface copy');
md.push('');
md.push(
  'Generated by `scripts/export-copy.mjs` from the running app, so every date, count',
);
md.push('and interpolated sentence appears as a reader sees it rather than as a template.');
md.push('');
md.push('Organised by role, then by screen, then by band in reading order. Band kinds are');
md.push('the composition types from `DESIGN.md` section 2: `masthead` is the dark opening');
md.push('field, `data` and `rail` carry the rows, `closing` is the note at the foot.');
md.push('');
md.push('Mock content from `seedData.ts` (customer names, addresses, identifiers, figures)');
md.push('is included because it is on screen, but it is marked as data in');
md.push('`COPY-strings.csv` and must not be translated.');
md.push('');

md.push('## Shell, on every screen');
md.push('');
md.push('### Top bar');
md.push('');
for (const line of shell.topBar) {
  md.push(`- ${line}`);
  rows.push({ text: line, where: 'shell / top bar' });
}
md.push('');
md.push('### Navigation labels');
md.push('');
md.push('Mirrored from `src/shell/roles.ts`. These are the only words in the shell that');
md.push('change per role, and they are what a customer taps, so they carry more weight per');
md.push('character than anything else in the product.');
md.push('');
for (const role of ROLES) {
  md.push(`- **${role.label}**: ${role.nav.join(', ')}`);
  for (const label of role.nav) {
    rows.push({ text: label, where: `shell / nav, ${role.label}` });
  }
}
md.push('');

for (const role of ROLES) {
  md.push(`## ${role.label}`);
  md.push('');
  md.push(`Role key \`${role.key}\`, ${role.viewport} viewport.`);
  md.push('');

  for (const [route, name] of role.screens) {
    const { bands, loose } = await readRoute(page, route);
    md.push(`### ${name}`);
    md.push('');
    md.push(`Route \`${route}\``);
    md.push('');

    if (loose.length) {
      md.push('**Outside any band**');
      md.push('');
      for (const line of loose) {
        md.push(`- ${line.text}`);
        rows.push({ text: line.text, where: `${role.label} / ${name}` });
        stringCount += 1;
      }
      md.push('');
    }

    for (const band of bands) {
      md.push(`**Band: ${band.kind}**`);
      md.push('');
      if (band.lines.length === 0) {
        md.push('_No text._');
      }
      for (const line of band.lines) {
        const prefix = line.tag === 'img-alt' ? 'Image alt text: ' : '';
        md.push(`- ${prefix}${line.text}`);
        rows.push({ text: line.text, where: `${role.label} / ${name}` });
        stringCount += 1;
      }
      md.push('');
    }
  }
}

await browser.close();

/* --- COPY-strings.csv: unique strings, where they appear, data or interface --- */

const byText = new Map();
for (const row of rows) {
  if (!byText.has(row.text)) byText.set(row.text, new Set());
  byText.get(row.text).add(row.where);
}

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
const csv = ['string,occurrences,appears_on,kind'];
for (const [text, wheres] of [...byText.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], 'en'),
)) {
  const isData = seedLiterals.has(text) || /^[A-Z]{2,4}-[A-Z0-9-]+$/.test(text);
  csv.push(
    [
      csvCell(text),
      wheres.size,
      csvCell([...wheres].join('; ')),
      // Quoted: the value contains a comma, and an unquoted one splits the column.
      csvCell(isData ? 'mock data, do not translate' : 'interface copy'),
    ].join(','),
  );
}

mkdirSync('docs', { recursive: true });
writeFileSync('docs/COPY.md', md.join('\n') + '\n');
writeFileSync('docs/COPY-strings.csv', csv.join('\n') + '\n');

const dataCount = csv.filter((l) => l.includes('mock data')).length;
console.log(`docs/COPY.md              ${stringCount} strings across 34 screens`);
console.log(
  `docs/COPY-strings.csv     ${byText.size} unique, ${byText.size - dataCount} interface copy, ${dataCount} mock data`,
);
