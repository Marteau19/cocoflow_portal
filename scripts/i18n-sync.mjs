/**
 * scripts/i18n-sync.mjs
 *
 * Brings `fr.ts` back into line with `en.ts`: every English key present, in the
 * same order, with any French already written preserved.
 *
 *   npm run i18n:sync
 *
 * It exists because the alternative is doing it by hand every time a string is
 * added, and the failure mode of doing it by hand is a key that quietly falls
 * back to English forever because nobody noticed it was missing from the
 * manifest. `en.ts` is the source of truth for which keys exist; this file makes
 * that true mechanically rather than by discipline.
 *
 * Keys that exist only in `fr.ts` are dropped, and named on the way out, because
 * they are a rename somebody stopped halfway through.
 */

import { readFile, writeFile } from 'node:fs/promises';

const EN = 'src/i18n/en.ts';
const FR = 'src/i18n/fr.ts';

const keysOf = (source) => [...source.matchAll(/^ {2}'([^']+)':/gm)].map((m) => m[1]);
const entriesOf = (source) =>
  new Map(
    [...source.matchAll(/^ {2}'([^']+)': '((?:[^'\\]|\\.)*)'/gm)].map((m) => [m[1], m[2]]),
  );

const en = await readFile(EN, 'utf8');
const fr = await readFile(FR, 'utf8');

const wanted = keysOf(en);
const written = entriesOf(fr);

const orphaned = [...written.keys()].filter((key) => !wanted.includes(key));
const added = wanted.filter((key) => !written.has(key));

const [head] = fr.split('= {\n');
const body = wanted.map((key) => `  '${key}': '${written.get(key) ?? ''}',`).join('\n');
await writeFile(FR, `${head}= {\n${body}\n};\n`);

const kept = wanted.filter((key) => (written.get(key) ?? '') !== '').length;
console.log(
  `fr.ts: ${wanted.length} keys, ${added.length} added, ${orphaned.length} dropped, ${kept} translations kept` +
    (orphaned.length ? `\n  dropped: ${orphaned.join(', ')}` : ''),
);
