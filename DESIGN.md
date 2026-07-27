# DESIGN.md — Instrument

The design system for the Ecoflo Portal prototype. This file is normative. If a
component contradicts this document, the document wins.

---

## 1. The direction

**The portal is a well-made instrument, not a brochure.**

The Ecoflo marketing site does the emotional work: full-bleed photography, deep
forest sections, large claims, marker highlights. The portal does the opposite
job. It earns trust through precision, legibility and restraint. Same family,
different register. The site is the promise. The portal is the proof.

Three anchors, in priority order:

1. **Warm paper, not white.** Canvas is warm off-white. Surfaces are white with
   hairline borders. Never white cards floating on grey with soft shadows.
2. **Typography carries hierarchy.** Few weights, sharp size jumps, tabular
   numerals everywhere. Colour does almost nothing except mark one action.
3. **Borders over shadows, labels over dots.** No elevation by default. Status is
   typographic or a left rule. Never a coloured circle.

Density adapts to the surface. Client screens are calm and airy. Technician
screens are dense and high contrast. Global screens are data dense.

---

## 2. Colour

All colour lives in `src/brands/*.ts` as tokens and is consumed as CSS custom
properties. **No hex value appears in any component file. Ever.**

### Legacy brand (default)

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#FAF8F3` | Page background. Every screen. |
| `--surface` | `#FFFFFF` | Cards, rows, panels, sheets |
| `--surface-sunk` | `#F2EFE7` | Table headers, inert zones, disabled fields |
| `--ink` | `#111A13` | Primary text. Near-black with a green cast. |
| `--ink-2` | `#5B655D` | Secondary text, labels |
| `--ink-3` | `#8A928B` | Metadata, captions, timestamps |
| `--line` | `#E4E0D6` | All hairlines. 1px. |
| `--line-strong` | `#CFC9BC` | Dividers that carry structural weight |
| `--forest` | `#16281C` | Inverted panels. Two places only. See 2.2. |
| `--on-forest` | `#F2F5F0` | Text on forest |
| `--accent` | `#64A70B` | Primary action fill. One per screen. |
| `--accent-ink` | `#3F6B07` | Accent-coloured text on light surfaces |
| `--warn` | `#9A6B12` | Text and border only |
| `--alert` | `#96301D` | Text and border only |

### Colour rules

1. **One accent per screen.** The single primary action. A screen with two green
   buttons is a bug.
2. **Signal colours are never fills.** `--warn` and `--alert` appear as text plus
   a 1px border of the same hue at 30% mix. No filled pills, no coloured chips.
3. **No purple, no indigo, no gradients, anywhere.** These are the default palette
   of generated interfaces.
4. **Forest is rationed.** It appears in exactly two places in V1:
   - The client home "next visit" block
   - The technician active job header

   It does not become a section-background rhythm the way it does on the
   marketing site. That rhythm is a marketing device and it does not survive
   contact with a utility surface.
5. Contrast floor: body text against canvas must clear 4.5:1. `--ink-3` is for
   metadata only and never for anything a user must read to act.

---

## 3. Typography

**Plus Jakarta Sans** throughout. It is already the Ecoflo brand face.

**IBM Plex Mono** for identifiers only: work order numbers, invoice numbers,
part SKUs, asset IDs, quote references. Never for body copy, never for headings,
never for prices. This is a deliberate, narrow use that signals "real system"
without turning the portal into a terminal.

```
font-variant-numeric: tabular-nums;
```
Applied globally. Every numeral in the app is tabular. Numbers in a column must
align.

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

**Weights: 400, 500, 700 only. Never 600.** Six hundred is the weight of
indecision and it muddies every geometric sans.

`micro` is for labels above values and for eyebrow text. It is never used for
anything longer than four words.

---

## 4. Space, shape, elevation, motion

**Spacing** on a 4px base: 8, 12, 16, 24, 32, 48. Nothing else. Mobile gutters
are 20px, desktop 32px.

**Radius**: 10px cards, 8px controls and inputs, pill (999px) for the nav and
filter chips only.

**Elevation**: zero by default. Every bounded object is defined by a 1px
`--line` border on `--surface`. One shadow token exists:

```
--shadow-sheet: 0 8px 32px rgba(17, 26, 19, 0.10);
```

It is used for exactly three things: bottom sheets, modals, and the demo device
frame. Nowhere else.

**Motion**: 150ms `ease-out` for state changes, 220ms for sheets and panels.
Nothing else animates. **No staggered load-in animation.** Everything appearing
in sequence on page load is one of the strongest tells of generated UI. Respect
`prefers-reduced-motion` by disabling all transitions.

---

## 5. Layout per surface

### Client (mobile first)
Single column, 20px gutters. One dominant block at the top that answers "what
happens next," then a quiet list beneath it. Bottom nav, **four items maximum,
labels always visible**. Icon-only navigation is both a tell and worse usability.

### SP Technician (mobile first)
Dense, high contrast, minimum 48px tap targets. Designed to be read in sunlight
and operated with gloves. Job status is a 3px left rule plus a text label. The
work order has a sticky action bar pinned to the bottom of the viewport.

### SP Manager (responsive)
Table forward. **Bordered rows, not rounded-rect cards.** Left nav appears at
desktop width, becomes a sheet below 768px.

### PTWE Global (desktop first)
12 column grid, data dense. Map as hero. Below 1024px the map degrades to a
ranked list rather than being crushed into a phone.

---

## 6. Signature: Blueprint mode

This is the one place the prototype spends its boldness. Everything else stays
quiet.

**Default state.** Each annotated section carries a small hairline-outlined
marker at the header baseline, in `--ink-3`, low contrast. Easy to ignore while
demoing the product. Click opens the annotation panel.

**Blueprint mode** (toggle in the top bar, keyboard `Alt+Shift+B`) flips the app
into a technical-drawing register:

- Every annotated section gets a numbered callout in IBM Plex Mono: `01`, `02`,
  `03`. The numbers are an index into the exported spec, not decoration, which is
  what earns them their place.
- Hairline leader lines connect each callout to its section boundary.
- The canvas shifts a half step cooler (`#F7F7F4`) and `--line` gains 15% opacity.
- A right-hand panel lists every callout on the current screen.
- An **Export spec** action dumps every annotation on every screen to markdown.

Two demo modes from one build: leadership sees the product, IT and DEV toggle
Blueprint and see the specification.

---

## 7. Component rules

**Status.** Never a coloured dot. Use one of:
- A text label in `micro` (`SCHEDULED`, `IN PROGRESS`, `COMPLETE`)
- A 3px left rule on the row, in `--line-strong`, `--warn` or `--alert`
- Weight change on the row title

**Numbers.** Large figures are a brand asset. KPI values are `display` weight
700, tabular, with a `micro` label above. No units inside the figure. No
sparkline unless the trend is the point.

**Charts.** Recharts, themed: single baseline, no gridlines, no legend box,
series labelled inline at the end of the line. One accent plus neutrals. Tooltips
use tabular numerals.

**Empty states.** One line of text stating what belongs here, one action. No
illustration, no apology, no "Nothing here yet."

**Photography.** Real content only: technician portrait, property photo, part
image. Zero decorative stock imagery inside the portal.

**Identifiers.** Always mono, always uppercase, never truncated below the point
of uniqueness. `WO-2026-0412`, not `WO-...412`.

---

## 8. Icon budget: 14

Declared in `src/ui/icons.ts`. Adding a fifteenth icon requires removing one.
Icon overload is a symptom of not deciding what matters, and it is the fastest
route to the generated look.

```
home  calendar  file-text  package  message-square  user
map-pin  camera  check  chevron-right  chevron-down
search  alert-triangle  info
```

Icons render inline at text size, in `currentColor`. **Never inside a tinted
rounded square.** That badge pattern is the single most recognisable AI tell in
current dashboard output.

---

## 9. Banned, with replacements

| Banned | Instead |
|---|---|
| Emoji, anywhere, including in data | Nothing, or a budgeted icon |
| Icon in a tinted rounded square badge | Inline icon at text size, or omit |
| Coloured status dots | Text label, or left rule |
| Full-width progress bars | Numeric value, or a thin inline rule |
| Three equal-weight cards in a row | Asymmetric layout, one dominant element |
| Gradients, glassmorphism, blur panels | Flat fills |
| Drop shadows on cards | 1px border |
| Centred body copy | Left aligned, ragged right |
| Decorative stock photography | Real content only |
| Illustrated empty states | One line, one action |
| Staggered load-in animation | No entrance animation |
| Badging every AI touchpoint | Flo is present when useful, quiet otherwise |
| `600` font weight | 500 or 700 |
| Em-dashes in any UI copy | Comma, colon or full stop |

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
