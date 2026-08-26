# scripts

Two audits and a camera. None of them is part of the build, and none replaces
looking at the screens. They exist because the rules in DESIGN.md that are easy to state and
tedious to verify by eye are exactly the ones that drift, and a reviewer who
spots one drifted rule stops trusting the rest of the document.

## `audit-contrast.mjs`

```
npm run audit:contrast
```

Checks every foreground and background token pair either brand can put on
screen against the accessible floor in DESIGN.md section 2: 4.5:1 for anything a
user reads to act, 3:1 for the two tokens that are metadata only. Dependency
free, so it runs anywhere. Run it after touching a file in `src/brands`.

It is what caught that white on the brand accent clears only 3:1 in both
palettes, which is why the accent fill carries dark text and `--accent-hover`
lightens rather than darkens.

## `audit-design.mjs`

```
npm run dev                       # in one shell
npm run audit:design              # in another
npm run audit:design -- --shots out/
```

Walks all thirty-four routes in both brands and checks: weight 600, gradients in
the interface, em-dashes, emoji, more than one accent fill outside the nav, a
coloured dot with no label, a wrapped action label, cards with no resting
shadow, horizontal overflow, a screen with no annotated section, console errors,
and failed requests.

Needs Playwright and a Chromium. Where the environment ships its own browser,
point at it:

```
CHROMIUM_PATH=/opt/pw-browsers/chromium npm run audit:design
```

A rule is in this script only if a violation is unambiguous. Judgement calls
stay with the eye, which is why `--shots` exists.

## `shoot.mjs`

```
npm run dev                       # in one shell
npm run shots                     # in another
npm run shots -- --full --routes /home,/system
```

Screenshots the client-owner screens in both brands at iPhone 15 and iPhone SE
widths, into `docs/shots` (gitignored). Run it after every phase and look at the
eight pictures before calling the phase done.

Both widths, because almost every composition fault in this build appeared at
the narrow width first: a 48px heading becomes three lines and a fixed-height
block starts eating the fold. Reviewing only the wide one reviews the easy case.

Both brands, every time, because the brand switch stays a zero-component-edit
operation only for as long as nobody hardcodes a value, and two pictures side by
side is the cheapest way to catch the day somebody does.
