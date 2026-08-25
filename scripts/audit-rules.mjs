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
      /*
        Two passes.

        First the origins: every x a block of content is legitimately allowed to
        start at. That is the band gutter, plus the content edge of every card,
        because DESIGN.md section 6 says bands are full bleed with no corners and
        radius belongs to objects inside them, so a card is an object and its
        contents sit on the card's own edge. Cards are found by looking for a real
        corner radius rather than by class name, so the check does not go stale
        when a component is renamed.

        Then the derived edges: for each origin, any leading box that starts there
        gives the text beside it an edge of `origin + box + gap`. Doing this per
        origin rather than only at the gutter is what fixes an avatar row inside a
        card, where both offsets compound and neither alone is the answer.
      */
      /*
        Origins are computed to a fixpoint rather than in one pass.

        A block that starts on an allowed origin and carries left padding
        establishes a new one, and those nest: a band opens at the gutter, a card
        inside it opens at the gutter, and the padded div inside the card opens
        16px further in. A single pass found the card and missed the div inside
        it, which is where the content actually sits, so a seasonal card's text
        was reported as a gutter violation. Three rounds is past the point this
        stops changing on any screen in the build; the loop exits early anyway.
      */
      const origins = new Set([gutter]);
      for (let round = 0; round < 3; round += 1) {
        const before = origins.size;
        for (const box of host.querySelectorAll('*')) {
          const cs = getComputedStyle(box);
          const r = box.getBoundingClientRect();
          if (r.width < 80) continue;
          const start = Math.round(r.left - col.left);
          /*
            Border first, then padding. A card carries a 1px hairline, so its
            content box opens one pixel inside its own left edge, and everything
            nested below inherits that offset. Counting only the padding put every
            derived edge one pixel short and reported the whole chain as a
            violation for the sake of a hairline.
          */
          const pad = Math.round(
            (Number.parseFloat(cs.borderLeftWidth) || 0) + (Number.parseFloat(cs.paddingLeft) || 0),
          );

          /*
            A card is an object inside a band, per DESIGN.md section 6, so it
            establishes an edge wherever it sits. That matters for a row of
            cards: the second and third metric card do not start on any edge
            inherited from the band, and their contents are still correct.
          */
          const isCard = Number.parseFloat(cs.borderTopLeftRadius) >= 4;
          if (isCard) {
            origins.add(start);
            if (pad > 0) origins.add(start + pad);
            continue;
          }

          // Everything else only opens a new edge if it already sits on one.
          if (origins.has(start) && pad > 0) origins.add(start + pad);
        }
        if (origins.size === before) break;
      }

      const allowed = new Set([...origins, gutter + 28]);
      // `svg` is in the list because a leading mark is not always a box with a
      // background: the media life ring is a bare 72px svg at the head of a row.
      for (const box of host.querySelectorAll('img, span, div, svg')) {
        if (!shown(box)) continue;
        const r = box.getBoundingClientRect();
        const start = Math.round(r.left - col.left);
        if (!origins.has(start)) continue;
        /*
          Lower bound 16, not 24.

          A row that leads with a bare icon puts it in a 16px box, and DESIGN.md
          section 6 states that the text beside it sits on its own edge. At a 24px
          floor those rows were invisible to this loop, so every document row and
          every timeline entry in the build was reported as a gutter violation.
        */
        if (r.width < 16 || r.width > 96) continue;
        /*
          A leading box is an image, or a short label in a fixed-width box: a stop
          number, a set of initials, a part number placeholder. Requiring it to be
          square rejected the route's stop number, which is 48px wide by one line
          tall, and that box is exactly what makes an indexed list share a text
          edge with a thumbnail list. An icon is an <svg> with no text, which the
          length test passes.
        */
        const text = (box.textContent || '').trim();
        if (box.tagName !== 'IMG' && text.length > 4) continue;
        /*
          The gap is read off the row rather than assumed. Rows are laid out with
          `gap-3`, which is a token and has been 12px and 16px at different points
          in this build's history; hardcoding either is how this check goes stale
          the next time the token moves.
        */
        const parentGap = Number.parseFloat(getComputedStyle(box.parentElement).columnGap);
        const gap = Number.isFinite(parentGap) ? parentGap : 16;
        allowed.add(start + Math.round(r.width) + Math.round(gap));
      }

      const leftEdges = new Map();
      for (const el of host.querySelectorAll('p, h1, h2, h3, dt, dd, img')) {
        if (!shown(el)) continue;
        const cs = getComputedStyle(el);
        /*
          Skip anything positioned out of flow (the Blueprint callout), anything
          centred inside a box (a placeholder label), and anything right aligned.

          A right aligned value's left edge is a consequence of how long the value
          is, not of a layout decision: "8 October 2024" and "5 July" in the same
          column start at different x by design, and reporting both as distinct
          gutter violations says nothing. What matters for a right aligned cell is
          its right edge, which the column already guarantees.
        */
        if (cs.position === 'absolute') continue;
        if (cs.textAlign === 'center' || cs.textAlign === 'right') continue;
        const hasKids = [...el.children].some((c) => c.textContent?.trim());
        if (el.tagName !== 'IMG' && hasKids) continue;
        if (el.tagName !== 'IMG' && !el.textContent.trim()) continue;
        const box = el.getBoundingClientRect();

        /*
          Skip the right hand cell of a two column row.

          `text-align: right` is only one of the two ways a value ends up on the
          right. The commoner one in this build is a flex row with
          `justify-between`, where the value is left aligned text that has been
          pushed across, so its computed text-align is `start` and the test above
          does not catch it. What both have in common is that the element's right
          edge is the row's right edge, and that its left edge is a consequence of
          the value's own length: "8 October 2024" and "5 July" in one column
          start at different x by design.
        */
        const parent = el.parentElement;
        if (parent) {
          const parentStyle = getComputedStyle(parent);
          const parentBox = parent.getBoundingClientRect();
          const contentRight = parentBox.right - (Number.parseFloat(parentStyle.paddingRight) || 0);
          const contentLeft = parentBox.left + (Number.parseFloat(parentStyle.paddingLeft) || 0);
          const laidOut = parentStyle.display.includes('flex') || parentStyle.display.includes('grid');
          const siblings = [...parent.children].filter((c) => c.textContent?.trim());
          /*
            All four conditions, and the last two are what a first attempt got
            wrong. Requiring only "its right edge is the row's right edge" also
            skipped every full width paragraph, because a paragraph fills its
            container and therefore ends where the container ends. A negative
            test caught it: a deliberately misaligned line of body copy went
            unreported. A right hand cell is a laid out row, with something to
            its left, that does not itself start at the row's leading edge.
          */
          if (
            laidOut &&
            siblings.length > 1 &&
            Math.abs(contentRight - box.right) <= 1 &&
            box.left - contentLeft > 1
          ) {
            continue;
          }
        }

        /*
          Skip a full bleed element. A photograph or a chart that runs edge to
          edge is at left 0 because a `flush` Band dropped the gutter for it,
          which is the documented way to do exactly that.
        */
        if (Math.round(box.width) >= Math.round(col.width) - 1) continue;

        const draws = opaque(cs.backgroundColor) || parseFloat(cs.borderLeftWidth) > 0;
        let left = Math.round(box.left + (draws ? 0 : parseFloat(cs.paddingLeft) || 0) - col.left);
        /*
          A selectable row carries a 3px rule on its leading edge, transparent
          until it is chosen, so that the label never shifts sideways as the
          selection moves. That rule pushes the text 3px in, which is the point of
          it, so it is subtracted rather than reported.
        */
        for (let node = el.parentElement; node && node !== host; node = node.parentElement) {
          const width = Number.parseFloat(getComputedStyle(node).borderLeftWidth);
          if (width > 0) {
            left -= Math.round(width);
            break;
          }
        }
        if (!leftEdges.has(left)) leftEdges.set(left, el.textContent.trim().slice(0, 22));
      }
      /*
        One pixel of tolerance, because layout is fractional and this check is
        not about fractions.

        Three metric cards sharing a row with `flex-1` and a gap land on
        fractional left edges, so a card's content box can compute to 32.5 and
        round one way while the text inside it rounds the other. Reporting that
        as a gutter violation is reporting a rounding mode. The tolerance is 1:
        the deliberate 7px misalignment used to test this rule is still caught,
        and so is anything a person could see.
      */
      const nearAllowed = (px) => [...allowed].some((edge) => Math.abs(edge - px) <= 1);

      for (const [px, sample] of leftEdges) {
        if (!nearAllowed(px)) {
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

      /*
        Reading sizes: at most 5 outside the 11px and 15px registers, and at
        most one of them above 19px.

        Was 4, written when the scale ran 48 / 32 / 24 / 16 / 13 with nothing
        between 24 and 16. The client-owner pass added `section` at 19 because
        that gap was forcing every sub-heading onto body or caption, which is
        what made the screens read as one large word above an undifferentiated
        field. A screen that uses a band heading and a heading inside it now
        legitimately needs five.

        The count is raised and the discipline it was carrying moves to the check
        below, which is the one that was actually meant: exactly one element on a
        screen may sit at the hero step. That is DESIGN.md section 5 rule 2, and
        until now nothing enforced it, so the total was standing in for it badly.
        Counting steps above `section` instead was tried and was wrong: a 32px
        subject over 24px band headings is hierarchy, not competition.
      */
      const reading = new Set();
      reading.elements = [];
      for (const el of host.querySelectorAll('p, h1, h2, h3, span, dt, dd, li')) {
        if (!shown(el)) continue;
        if (!el.textContent.trim()) continue;
        if ([...el.children].some((c) => c.textContent?.trim())) continue;
        const size = getComputedStyle(el).fontSize;
        if (size === '11px' || size === '15px') continue;
        reading.add(size);
        reading.elements.push(el);
      }
      if (reading.size > 5) {
        problems.push({ rule: 'reading-sizes', detail: `${reading.size}: ${[...reading].join(', ')}` });
      }
      /*
        One hero per screen. DESIGN.md section 5 rule 2 and section 7.

        Resolved from the live custom property rather than hardcoded, so it is
        correct in the framed register, in the full-bleed register, and under the
        customer persona cap, all three of which give the step a different value.
      */
      const heroSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--step-hero-size')
        .trim();
      const heroes = [...reading.elements].filter(
        (el) => getComputedStyle(el).fontSize === heroSize,
      );
      if (heroSize && heroes.length > 1) {
        problems.push({
          rule: 'one-hero',
          detail: `${heroes.length} at the hero step (${heroSize}): ${heroes
            .map((el) => `"${el.textContent.trim().slice(0, 20)}"`)
            .join(', ')}`,
        });
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
