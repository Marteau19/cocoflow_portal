# DESIGN.md — Console

The design system for the Ecoflo Portal prototype. This file is normative. If a
component contradicts this document, the document wins.

**Revision note.** This replaces the earlier "Instrument" direction, which was
deliberately restrained: warm paper, hairlines, no shadows, one accent per
screen. That version read as bland in review. The direction below is the one the
owner chose after seeing a reference, and it is louder on purpose. Where a rule
here reverses an earlier one, the reversal is intentional and is called out.

---

## 1. The direction

**The portal is a confident operating console, not a document.**

Someone opens this to run something: their property, their day, their Service
Point, their network. It should feel like a tool that is switched on. Colour does
real work here, elevation separates layers, and the interface is comfortable
being seen.

Three anchors, in priority order:

1. **A dark frame around a light workspace.** Navigation lives on a deep
   ground. Content sits on a light canvas in raised white cards. That contrast is
   the primary structure of every screen.
2. **Colour carries meaning, and there is enough of it.** Accent for the primary
   action, distinct colours for opposite outcomes, tinted grounds for grouping.
   A screen with one colour on it is under-built.
3. **Elevation and radius are real.** Cards are lifted off the canvas and
   generously rounded. This is a reversal: the previous direction forbade card
   shadows.

Density still adapts to the surface. Client screens are calm and airy, technician
screens dense and high contrast, global screens data dense.

---

## 2. Colour

All colour lives in `src/brands/*.ts` as tokens and is consumed as CSS custom
properties. **No hex value appears in any component file. Ever.** That rule is
unchanged and non-negotiable, because it is what makes the brand switch free.

### Token roles

| Token | Role |
|---|---|
| `--canvas` | Page background behind the cards |
| `--canvas-blueprint` | Blueprint mode canvas, a half step cooler |
| `--surface` | Card and row background |
| `--surface-sunk` | Table headers, inert zones, disabled fields |
| `--surface-raised` | A card sitting on another card |
| `--sidebar` | The deep navigation ground |
| `--on-sidebar` | Text and icons on the sidebar |
| `--sidebar-muted` | Inactive sidebar text |
| `--ink`, `--ink-2`, `--ink-3` | Primary, secondary, metadata text |
| `--line`, `--line-strong` | Hairlines and structural dividers |
| `--forest`, `--on-forest` | The inverted feature panel. See 2.3. |
| `--accent`, `--accent-hover`, `--on-accent` | The primary action |
| `--accent-ink` | Accent-coloured text on light surfaces |
| `--accent-soft` | Tinted ground for icon chips and highlighted rows |
| `--positive`, `--on-positive` | One side of a paired outcome |
| `--negative`, `--on-negative` | The other side |
| `--positive-soft`, `--negative-soft` | Tinted grounds for the pair |
| `--warn`, `--alert` | Caution and failure |
| `--warn-soft`, `--alert-soft` | Tinted grounds for the same |

`--positive` and `--negative` are dark enough to work both as a fill carrying
`--on-*` text and as text on a light ground, so there is no separate ink variant.
`--accent` is not: it is a saturated brand colour, so text-on-light uses
`--accent-ink` and the accent fill carries `--on-accent`, which is dark. That is
why **`--accent-hover` lightens rather than darkens**: the label on an accent fill
is dark, so the hover state has to move away from it.

Both brands share the same four functional colours. Positive, negative, warn and
alert are function rather than identity: an approval has to read as an approval in
either skin.

### Colour rules

1. **One accent action per screen.** Unchanged in spirit: exactly one control
   carries `--accent` as a fill and it is the primary action. What has changed is
   that `--positive` and `--negative` are now available alongside it for **paired
   opposite outcomes** in the same row, such as buy against sell, or approve
   against decline. A pair is not two primary actions, it is one decision.
2. **Signal colours may now be fills.** Previously text and border only. A status
   pill on a tinted ground is permitted, using the `-soft` tokens for the ground
   and the solid token for the text. Contrast still has to clear 4.5:1.
3. **Status dots are permitted**, alongside a label. Previously banned. A dot on
   its own, with no label, is still banned: colour alone is not an accessible
   signal.
4. **No purple and no indigo unless the brand ships them.** These are the default
   palette of generated interfaces. The current brands ship neither.
5. **No gradients in the interface.** The new brand wordmark contains one, and
   that is fine because it is a supplied asset. Chrome, buttons, cards and
   backgrounds stay flat fills.
6. Contrast floor: body text against its ground clears 4.5:1. `--ink-3` is for
   metadata only, never for anything a user must read to act.

### 2.2 The two brands

Legacy is the current identity: warm paper canvas, forest green sidebar, the lime
`#64A70B` accent. New is the identity in `references/brandings/New`, which ships
four colours and nothing else:

| Brand colour | Value | Where it goes |
|---|---|---|
| Orange | `#F85E00` | `--accent` |
| Teal | `#294D4A` | `--sidebar` |
| Plum | `#472836` | `--forest`, the inverted feature panel |
| Sage | `#A3B19B` | `--line-strong`, and the canvas tint it is lifted from |

Everything else in `next.ts` is derived from those four: the canvas is sage taken
almost to white, the ink is teal taken almost to black, `--accent-ink` is the
orange pushed dark enough to clear 4.5:1 as text, and each `-soft` value is its
parent lifted to a tint.

Plum rather than teal for the feature panel is a deliberate call. The panel has to
separate from the sidebar, and giving it the fourth brand colour is what stops the
two dark grounds reading as one surface interrupted by content.

`scripts/audit-contrast.mjs` checks every pair either brand can put on screen.
Run it after touching a brand file.

### 2.3 The inverted feature panel

`--forest` is the one full-bleed inverted block. It appears in exactly two places
in V1:

- The client home "next visit" block
- The technician active job header

It does not become a section-background rhythm. The sidebar is a separate token
and does not count against this budget.

---

## 3. Typography

**Plus Jakarta Sans** throughout.

**IBM Plex Mono** for identifiers only: work order numbers, invoice numbers, part
SKUs, asset IDs, quote references. Never for body copy, never for headings, never
for prices.

```
font-variant-numeric: tabular-nums;
```
Applied globally. Every numeral in the app is tabular.

### Scale (mobile first)

| Role | Size / line | Tracking | Weight |
|---|---|---|---|
| display | 30 / 32 | -0.02em | 700 |
| h1 | 22 / 28 | -0.01em | 700 |
| h2 | 17 / 24 | 0 | 500 |
| body | 15 / 22 | 0 | 400 |
| caption | 13 / 18 | 0 | 400 |
| micro | 11 / 14 | +0.08em | 500, uppercase |

Desktop steps display and h1 up one notch (38/40 and 26/32). Nothing else changes.

**Weights: 400, 500, 700 only. Never 600.**

`micro` is for labels above values and for eyebrow text. Never longer than four
words.

---

## 4. Space, shape, elevation, motion

**Spacing** on a 4px base: 8, 12, 16, 24, 32, 48. Mobile gutters 20px, desktop
32px.

**Radius**, increased from the previous direction:

| Token | Value | Use |
|---|---|---|
| `--radius-card` | 18px | Cards and panels |
| `--radius-control` | 12px | Buttons, inputs, icon chips |
| `--radius-pill` | 999px | Pills, chips, toggles, avatars |
| `--radius-shell` | 24px | The outer app shell and the sidebar |

**Elevation.** Cards are lifted. Three shadow tokens:

| Token | Use |
|---|---|
| `--shadow-card` | Every card. The default resting state. |
| `--shadow-raised` | Hover, and a card on a card |
| `--shadow-sheet` | Bottom sheets, modals, the device frame |

A bounded object still carries a 1px `--line` border **as well as** its shadow.
The border is what keeps edges crisp at low contrast; the shadow is what
separates layers.

**Motion**: 150ms `ease-out` for state changes, 220ms for sheets and panels.
Nothing else animates. **No staggered load-in animation.** Respect
`prefers-reduced-motion` by disabling all transitions.

---

## 5. Layout per surface

### The shell
Above 900px the manager and global roles render as a rounded dark sidebar panel
floating on the tinted canvas, with the workspace beside it. Flush to the viewport
edge it would read as browser chrome; floating, it reads as a piece of the
console, and the workspace keeps its own margin.

The sidebar is text only. Those screens are table forward and the manager owns
eight destinations, which is more than the fourteen icon budget can label without
repeating itself, and a column of near-duplicate icons beside a column of words
earns nothing.

Below 768px the sidebar collapses to a dark bar that opens a sheet. The
mobile-first roles use a bottom bar at every width, inside the device frame above
900px.

### The device frame
Above 900px the three mobile-first roles render inside a handset. Below 900px
there is no frame and the app is the whole viewport.

The handset is **drawn, not photographed**: resolution independent, no asset
weight, and the screen corner is a real clipping boundary rather than a rectangle
positioned over a picture. It lives entirely in the `.device-*` block in
`index.css`.

Two rules follow from it:

- **The camera sits over the app**, as hardware does. It is a sibling of the
  screen, so the screen keeps its overflow clip, and it takes no pointer events.
- **Content is inset from the top of the display by `--safe-top`**, because the
  camera is in the way. A full-bleed panel still runs to the very top of the
  screen, which is what a real app does; it is the panel's own top padding that
  clears the island. `--safe-top` is `0` below 900px, where there is no camera.

**The one exception to the no-hex rule.** The rail, the bezel and the lens are
literal colours. They are photographic properties of a physical object, not brand
values: a titanium rail is the same grey in both brands, and a brand switch that
tinted the phone would be a bug. They sit in `index.css` beside the device
dimensions, which are literals for the same reason. Nothing else in the codebase
gets this exemption.

### Client (mobile first)
Single column, 20px gutters. One dominant block at the top that answers "what
happens next", then a quiet list beneath. Bottom nav, **four items maximum,
labels always visible**. The active item is a filled accent pill.

### SP Technician (mobile first)
Dense, high contrast, minimum 48px tap targets. Readable in sunlight, operable
with gloves. Job status is a coloured pill plus a text label. The work order has
a sticky action bar pinned to the bottom of the viewport.

### SP Manager (responsive)
Table forward. Bordered rows inside a raised card, with a tinted header row. Dark
sidebar at desktop width, sheet below 768px.

### PTWE Global (desktop first)
12 column grid, data dense. Map as hero. Below 1024px the map degrades to a
ranked list rather than being crushed into a phone.

---

## 6. Signature: Blueprint mode

**Default state.** Each annotated section carries a small numbered marker at the
section corner, low contrast, easy to ignore while demoing. Click opens the
annotation panel.

**Blueprint mode** (toggle in the top bar, keyboard `Alt+Shift+B`) flips the app
into a technical-drawing register:

- Every annotated section gets a numbered callout in IBM Plex Mono: `01`, `02`.
  The numbers are an index into the exported spec, not decoration.
- Hairline leader lines connect each callout to its section boundary.
- The canvas shifts a half step cooler and hairlines gain weight.
- A right-hand panel lists every callout on the current screen.
- An **Export spec** action dumps every annotation on every screen to markdown.

Two demo modes from one build: leadership sees the product, IT and DEV toggle
Blueprint and see the specification.

---

## 7. Component rules

**Cards.** White surface, 1px line, 18px radius, `--shadow-card`. Grouped content
lives in cards; the page is a set of cards on a tinted canvas.

**Status.** Any of, and at least one that is not colour:
- A pill: solid text colour on the matching `-soft` ground
- A dot plus a label
- A 3px left rule on the row
- A text label in `micro`

A dot with no label is banned. Colour alone is not a signal.

**Actions.** One `--accent` fill per screen for the primary action.
`--positive` and `--negative` are for paired opposite outcomes. A dark `--ink`
fill is available for a neutral-but-prominent action such as Modify. Everything
else is a bordered `--surface` button.

**Icon chips.** An icon may now sit in a rounded square on an `--accent-soft` or
`--surface-sunk` ground, at the head of a card. Previously banned. It is a
grouping device and is limited to card headers and nav, never inline in prose.
Inline icons still render at text size in `currentColor`.

**Numbers.** Large figures are a brand asset. KPI values are `display` weight
700, tabular, with a `micro` label above. No units inside the figure. No
sparkline unless the trend is the point.

**Charts.** Recharts, themed: single baseline, no gridlines, no legend box,
series labelled inline at the end of the line. Accent plus the paired outcome
colours. Tooltips use tabular numerals.

**Tabs and filters.** A row of pills. The active one is a filled `--accent` or
`--ink` pill; the rest are bordered.

**Toggles.** A pill track that fills with `--accent` when on, with a white knob.

**Empty states.** One line of text stating what belongs here, one action. No
illustration, no apology.

**Photography.** Real content only: technician portrait, property photo, part
image. Zero decorative stock imagery inside the portal.

**Identifiers.** Always mono, always uppercase, never truncated below the point of
uniqueness. `WO-2026-0412`, not `WO-...412`.

---

## 8. Icon budget: 14

Declared in `src/ui/icons.ts`. Adding a fifteenth requires removing one.

```
home  calendar  file-text  package  message-square  user
map-pin  camera  check  chevron-right  chevron-down
search  alert-triangle  info
```

Icons render at text size in `currentColor` when inline. In a card header or the
nav they may sit in a rounded chip. See section 7.

---

## 9. Banned, with replacements

| Banned | Instead |
|---|---|
| Emoji, anywhere, including in data | Nothing, or a budgeted icon |
| A coloured dot with no label | Dot plus label, or a pill |
| Full-width progress bars | Numeric value, or a thin inline rule |
| Three equal-weight cards in a row | Asymmetric layout, one dominant element |
| Gradients in the interface | Flat fills. The brand wordmark is an asset, not chrome. |
| Glassmorphism, blur panels | Flat fills |
| Centred body copy | Left aligned, ragged right |
| Decorative stock photography | Real content only |
| Illustrated empty states | One line, one action |
| Staggered load-in animation | No entrance animation |
| Badging every AI touchpoint | Flo is present when useful, quiet otherwise |
| `600` font weight | 500 or 700 |
| Em-dashes in any UI copy | Comma, colon or full stop |

### No longer banned

Reversed from the previous direction, deliberately:

- **Card shadows.** Now required, via `--shadow-card`.
- **Coloured status fills.** Now permitted on `-soft` grounds.
- **Status dots.** Now permitted alongside a label.
- **Icons in rounded chips.** Now permitted in card headers and nav.
- **More than one saturated colour per screen.** Accent plus a paired
  positive and negative is the expected case, not an exception.

---

## 10. Copy rules

- Sentence case everywhere. Never Title Case, never ALL CAPS outside `micro`.
- Verb-first buttons: "Book a visit", not "Submit".
- An action keeps its name through the flow. "Approve quote" produces "Quote
  approved".
- Customers see plain language. Internal vocabulary (work order, entitlement,
  asset) stays on internal surfaces.
- No filler: cut "simply", "just", "easily", "seamless", "unlock".
- Errors say what happened and what to do. No apology, no exception strings.
- **No em-dashes.**
