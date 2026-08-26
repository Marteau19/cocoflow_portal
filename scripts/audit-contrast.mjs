/**
 * scripts/audit-contrast.mjs
 *
 * Checks every foreground/background token pair the design system actually
 * puts on screen against the accessible floor in DESIGN.md section 2.
 *
 *   node scripts/audit-contrast.mjs
 *
 * Run it after touching a brand file. The floor is 4.5:1 for anything a user
 * reads to act, and 3:1 for the two tokens that are metadata only. A brand that
 * fails here is a brand that ships an unreadable screen, and the failure is
 * cheaper to find in a terminal than in review.
 *
 * The brand files are parsed rather than imported, because they are TypeScript
 * and this script is deliberately dependency free.
 */

import { readFile } from 'node:fs/promises';

const BRANDS = ['src/brands/legacy.ts', 'src/brands/next.ts'];

/**
 * Pairs that appear in the build. Not every combination: only the ones a
 * component can actually produce, which is what makes a failure here real.
 */
const PAIRS = [
  ['ink', 'canvas'],
  ['ink', 'surface'],
  ['ink', 'surfaceSunk'],
  ['ink2', 'canvas'],
  ['ink2', 'surface'],
  ['ink2', 'surfaceSunk'],
  ['onSidebar', 'sidebar'],
  ['sidebarMuted', 'sidebar'],
  ['onBand', 'bandDeep'],
  ['onBand', 'bandDeepAlt'],
  ['onBandMuted', 'bandDeep'],
  ['onBandMuted', 'bandDeepAlt'],
  ['accentOnBand', 'bandDeep'],
  ['onAccent', 'accent'],
  ['onAccent', 'accentHover'],
  ['accentInk', 'surface'],
  ['accentInk', 'canvas'],
  // Rail bands put accent text on the sunk level, which the first pass missed.
  ['accentInk', 'surfaceSunk'],
  ['accentInk', 'accentSoft'],
  ['onPositive', 'positive'],
  ['positive', 'surface'],
  ['positive', 'positiveSoft'],
  ['onNegative', 'negative'],
  // The fourth status. Same three pairs every other status tone is held to.
  ['onInfo', 'info'],
  ['info', 'surface'],
  ['info', 'infoSoft'],
  ['info', 'canvas'],
  ['info', 'surfaceSunk'],
  ['negative', 'surface'],
  ['negative', 'negativeSoft'],
  ['warn', 'surface'],
  ['warn', 'canvas'],
  ['warn', 'warnSoft'],
  ['alert', 'surface'],
  ['alert', 'canvas'],
  ['alert', 'alertSoft'],
  ['ink3', 'surface'],
  ['ink3', 'canvas'],
  /*
    The bottom navigation bar moved to the sunk ground so it stops reading as an
    unattached white slab, which put the inactive nav label and the disabled button
    label on a pair that had never been measured. Both are `ink3` on
    `surfaceSunk`. Same lesson as the `accentInk` row above: a new ground means a
    new pair, and the pair has to be added the moment the ground is.
  */
  ['ink3', 'surfaceSunk'],
  // The active nav label, and the label on an `onBand` primary button.
  ['ink', 'surface'],
  ['ink2', 'surface'],
];

/** Metadata only, never load bearing, so held to the non-text floor. */
/**
 * Metadata only, never load bearing, so held to the non-text floor.
 *
 * `accentOnBand` is here because DESIGN.md section 4 rule 3 sanctions it as a
 * graphic and never as a label: in the new brand the orange reaches 3.97:1 on
 * teal, which clears 3:1 and not 4.5:1.
 */
const METADATA = new Set(['ink3', 'sidebarMuted', 'onBandMuted', 'accentOnBand']);

const colorsFrom = async (path) => {
  const source = await readFile(path, 'utf8');
  // The interface declares the same key names, so read from the last
  // occurrence: that is the value object rather than the type.
  const start = source.lastIndexOf('color: {');
  const block = source.slice(start, source.indexOf('font: {', start));
  const colors = {};
  for (const match of block.matchAll(/(\w+):\s*'(#[0-9A-Fa-f]{6})'/g)) {
    colors[match[1]] = match[2];
  }
  return colors;
};

const relativeLuminance = (hex) => {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrast = (a, b) => {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

let failures = 0;

for (const path of BRANDS) {
  const colors = await colorsFrom(path);
  console.log(`\n${path}  ${Object.keys(colors).length} colour tokens`);

  for (const [fg, bg] of PAIRS) {
    if (!colors[fg] || !colors[bg]) {
      console.log(`  MISSING  ${fg} on ${bg}`);
      failures += 1;
      continue;
    }
    const floor = METADATA.has(fg) ? 3 : 4.5;
    const ratio = contrast(colors[fg], colors[bg]);
    const pass = ratio >= floor;
    if (!pass) failures += 1;
    console.log(
      `  ${pass ? 'ok  ' : 'FAIL'} ${ratio.toFixed(2).padStart(5)}:1  ${fg} on ${bg}  floor ${floor}`,
    );
  }
}

console.log(failures === 0 ? '\nEvery pair clears its floor.' : `\n${failures} failing.`);
process.exit(failures === 0 ? 0 : 1);
