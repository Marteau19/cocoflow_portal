# DESIGN.md, Broadsheet

The design system for the Ecoflo Portal prototype. This file is normative. If a
component contradicts this document, the document wins.

**Revision note.** This is the third direction. "Instrument" was too quiet.
"Console" was louder but failed the same way, because both described a mood and
neither described a **composition**. A document made almost entirely of
prohibitions and a token table produces exactly what shipped: correct, quiet, and
dead. Section 2 is the section that was missing, and it is the most important one
here. Where a rule below reverses an earlier one, the reversal is deliberate and
is called out.

---

## 0. What the audit found

Measured on the running build, legacy brand, before this rewrite. These numbers
are the evidence the rest of the document answers to.

| Finding | Measured |
|---|---|
| Canvas against surface | **1.16:1**, invisible. Hairline against canvas **1.14:1** |
| `--surface-sunk` was **lighter** than `--canvas` | L\* **95.2** against **94.1**, so it floated instead of sinking |
| Every container the same width | `/sp` and `/readiness`: **one** distinct card width, 1060px, for every card |
| Type scale collapsed | `/readiness`: **93% of all characters** render at 13px or 15px |
| No dominant element | `/readiness` largest type 26px carrying 23 characters, against 1251 characters at 13px |
| Top step barely a step | Largest to second largest: **1.46x** on `/sp`, **1.53x** on `/readiness` |
| Dark absent from content | Only dark field on `/sp` and `/readiness` is the sidebar, which is chrome |
| Blueprint mode invisible | Canvas shift measured **1.007:1**. Callout is a 20x14px pill |
| Data band under-dense | `/readiness` Gates card **1164px tall** to convey 12 booleans |
| Charts unanchored | `/mix` plot: one 1px line, no fill, no baseline emphasis, in roughly 1000x160px of white |

Three findings the brief did not name, added here because they change the fix:

1. **The floating sidebar strands the page.** It is 236px wide and roughly 790px
   tall, but `/readiness` is 2122px tall. Below the sidebar sits about 1280px of
   empty canvas in a column nothing uses. The rounded floating panel was my call
   and it is wrong on any page longer than one viewport.
2. **Pass and fail look identical.** On `/readiness` a passing gate and a failing
   gate are the same row, same height, same ground, differing by the colour of one
   13px icon. The single thing that screen exists to communicate reads weakest.
3. **The numbers are the smallest thing on their row.** "84% ready", "78% ready",
   "71% ready" render as 13px right-aligned captions. On a readiness screen the
   readiness figure is the content.

### Correction to the first draft of this section

The first draft reported `--surface-sunk` at "L\* 88.0 against 85.5". **Those were
relative luminance figures multiplied by 100, not L\*.** The audit script printed
`Y`, and I transcribed `Y × 100` into a column headed L\* without applying the
cube-root transform. The correct values for the same two colours are L\* 95.2 and
94.1. The table above is fixed.

The conclusion did not change, and the sign did not change: sunk was lighter than
canvas, which is the wrong direction for a token named "sunk". But the units were
wrong and anything built on them would have been built on a wrong number, so here
is the full reconciliation, computed from the files rather than remembered.

| Palette | canvas | sunk | sunk minus canvas | canvas / surface |
|---|---|---|---|---|
| **Committed legacy**, `#F1EEE5` / `#F4F1E9` | L\* 94.1 | L\* 95.2 | **+1.1, sunk lighter** | ΔL\* 5.9 |
| **Committed next**, `#F0F2EC` / `#F2F4EE` | L\* 95.2 | L\* 95.9 | **+0.7, sunk lighter** | ΔL\* 4.8 |
| **Pre-Console legacy**, `#FAF8F3` / `#F2EFE7` | L\* 97.6 | L\* 94.5 | -3.1, sunk darker | ΔL\* 2.4 |

**Yes, the tokens changed during the Console round.** Commit `37513b6`, which is
PR #6, moved legacy canvas from `#FAF8F3` to `#F1EEE5` and sunk from `#F2EFE7` to
`#F4F1E9`. Before that change sunk was correctly darker than canvas, by ΔL\* 3.1.
**I inverted it in that commit**, then described the inversion correctly in the
audit while getting its units wrong, and did not notice I had caused it.

The reviewer's figures, legacy 94.5 against 97.6 with ΔL\* 3.1 and next canvas
96.4, are the **pre-Console** legacy palette and the `ASSETS.md` canvas proposal
`#F4F5F1` respectively. Both are correct readings of those sources. They do not
match `src/brands/*.ts` on `main`, which is the discrepancy recorded in
`ASSETS.md` section 8.

Every other number in this document was computed by script in the units it claims,
and `scripts/audit-contrast.mjs` now prints both `Y` and `L\*` with the column
headed by the metric, so this class of transcription error cannot recur silently.

---

## 1. Direction

**A broadsheet, not a dashboard.**

A newspaper solves this product's exact problem: it serves two audiences in one
object, with one type system, and nobody has to be told which audience they are.
The front page has a masthead, one lead item that dominates without argument, and
photography used large and rarely. The back has dense tables that reward
attention. Same paper, same ink, different weight.

That is the Ecoflo Portal. Leadership reads the front page. IT and DEV turn to the
appendix, which is Blueprint mode. The golden thread, `WO-2026-0412` seen from
five roles, is the same story run at five different weights: a reassurance to a
homeowner, a job to a technician, a slot to a manager, a unit to the network.

Why not the previous two. **"Instrument"** treated restraint as the goal, so every
rule removed something and nothing was left to look at. **"Console"** added colour
and elevation but kept the underlying page model, a stack of equal cards, which is
the actual defect. Broadsheet names a *structure*: bands of unequal weight in
vertical sequence. That is a rule you can be wrong about, which is what makes it
useful.

Dark is a compositional device, not a theme. Dark bands, dark chrome, dark hero
fields. **The reading surface stays light.** No dark mode, no toggle, no inverted
content areas. If a whole screen has gone dark, it is wrong.

### The limit of the metaphor

**Broadsheet is a compositional metaphor, not a visual style.** It is borrowed for
four things and nothing else:

- bands of unequal weight in vertical sequence
- one lead item that dominates without argument
- photography large and rare
- a front page and an appendix in one object

It does **not** license the visual vocabulary of newsprint. Specifically banned as
misreadings of this section:

| Not licensed | Because |
|---|---|
| Serif or slab display type | The brand is geometric sans. Plus Jakarta Sans stays for both brands |
| Zero border radius | The radius tokens stay. Bands are full bleed so they have no corners to round, but every object inside a band keeps `--radius-card`, `--radius-control` and `--radius-pill` |
| Hairline rules as decoration | A rule separates two things that need separating. Section 3 sets a ΔL\* floor precisely so rules stop being wallpaper |
| Multi-column body text | Single column, measure capped at 68ch. Newspaper columns exist because paper is wide and fixed, and a phone is neither |
| Ink-on-newsprint colour | The palette is a saturated brand palette, green or orange. Nothing here is desaturated toward grey |
| Rules, dividers and ornament between every element | Ground separation does this job. See section 3 |

That combination, serif display plus zero radius plus hairlines plus columns, is a
recognisable generic look in its own right, and adopting it would fight the brand
rather than serve it. If a section of this document reads as newspaper *styling*
rather than newspaper *structure*, the section is wrong and the styling loses.

---

## 2. Composition: the page is a sequence of bands

**This is the rule the build was missing. A screen is not a column of cards. It
is three to six full-width horizontal bands of deliberately unequal weight,
stacked.**

A band runs the full width of the content column, edge to edge, with no gutter of
its own and no rounded corner. It is defined by its ground, its height and its
density. Content sits inside a band's padding, not inside a box drawn on the band.

### The six band types

| Band | Ground | Height | Holds |
|---|---|---|---|
| **Masthead** | `--band-deep` | 200px min mobile, 260px min desktop | Eyebrow, subject, and the hero when the hero is a number or a state. Required as the top band of every primary screen. |
| **Lead** | `--canvas` | 240px min | The hero when it is a photograph or a chart. Full bleed. No container. |
| **Reading** | `--canvas` | Content | Prose and quiet rows, measure capped at 68ch. **No container.** |
| **Data** | `--surface` | Content | Tables and lists. Rows run edge to edge and are separated by `--line`. This is where density lives. |
| **Rail** | `--surface-sunk` | Content | Supporting, inert or provisional material. Never white. |
| **Closing** | `--surface-sunk` or `--band-deep` | 96px min | Scope statements, provenance, footnotes, the honest missing-data note. |

### Rhythm rules

1. **No two adjacent bands share a ground.** If two consecutive bands would both
   be `--canvas`, they are one band.
2. **Every screen has at least one Masthead and at least one light band.** The
   Masthead is the top band. See section 7.
3. **Three bands minimum, six maximum.** Fewer than three is a fragment. More than
   six is a stack of cards wearing a new name.
4. **Bands alternate weight, they do not escalate.** Heavy, light, dense, quiet.
   Not heavy, heavier, heaviest.
5. **A band is never nested inside a band.** Nesting is what produced
   card-inside-card. If content needs a sub-group, it gets a `--line` rule and a
   `micro` label, not a box.

### Cards, demoted

**Cards are now rare and meaningful, not the default wrapper.** Most content sits
directly on its band with no container at all.

A card is permitted only when an object is genuinely liftable out of the page: a
single work order in a list of work orders, a single part in a catalogue, a single
message. If everything on a screen is in a card, nothing is.

Concretely, the ceiling is **two cards per screen**, and a screen with zero is
normal. Reversal: the previous direction said "the page is a set of cards on a
tinted canvas". That sentence is the bug.

Cards keep their shadow and their `--line` border. What changes is how seldom one
appears.

### Grouping inside a band

Removing cards removes the grouping they were doing, and on the manager and Global
screens that grouping was load bearing. It has to come back somewhere. It comes
back as **ground variation inside a single band**, which is the one place a band
may hold more than one surface level:

1. **A header strip on `--surface-sunk`.** Column heads for a table, or a
   `BandHead` over a long list. It reads as a table head rather than as a second
   band because it is one row tall and carries only `micro` labels.
2. **A tone on an individual row.** `--positive-soft`, `--warn-soft`,
   `--alert-soft`, applied by `Row tone`, always alongside a text label. This is
   what makes an exception findable in a 20 row list without a coloured dot.
3. **A `--line` rule plus a `micro` label**, per rule 5 above, for a sub group
   inside otherwise uniform rows.

Nothing else. A band may not carry a second full-height ground, because that is a
band nested inside a band under another name.

This was tested at step 6 across `/sp`, `/sp/dispatch`, `/sp/inventory`,
`/network` and `/mix`, the screens where a wall of rules was the risk. The two card
ceiling held on all of them, but only because these three devices were available.
Without them the ceiling would not be survivable on a dense screen, so treat this
subsection as part of the ceiling rather than as an allowance beside it.

---

## 3. Surface hierarchy

Five levels, ordered dark to light. Adjacent levels must be **visibly** different.

### Why L\* and not contrast ratio

WCAG contrast ratio is built for text legibility and is dominated by the darker of
the two colours, so it compresses badly at the light end. Canvas against surface
measured 1.16:1, which sounds close to 1.0 and is, but so would any pair of usable
paper whites. Ratio cannot tell "invisible" from "fine" up there.

Perceptual lightness, **CIE L\***, can. A ΔL\* of about 2 is the threshold of
noticing in a large flat field. This system requires **ΔL\* ≥ 4 between adjacent
surface levels**, and **ΔL\* ≥ 6 between a hairline and the ground it sits on**,
which is what the old 1.14:1 hairline failed.

Text keeps WCAG ratio, at 4.5:1. Two metrics, each used for what it measures.

### The levels

| Level | Token | Role |
|---|---|---|
| 0 | `--band-deep`, `--band-deep-alt` | Masthead, chrome, hero fields |
| 1 | `--surface-sunk` | Rail band, table headers, inert zones |
| 2 | `--canvas` | The page. Reading and Lead bands. Most content sits here |
| 3 | `--surface` | Data bands and the rare card |
| 4 | `--surface-raised` | A card on a Data band. Same value as `--surface`, separated by shadow |

Note the order. **Canvas is darker than surface, and sunk is darker than canvas.**
That was inverted in the shipped build.

### Measured separation

| Pair | Legacy ΔL\* | Next ΔL\* | Floor |
|---|---|---|---|
| `surface` / `canvas` | **7.5** | **6.7** | 4.0 |
| `canvas` / `surface-sunk` | **6.0** | **5.4** | 4.0 |
| `surface` / `surface-sunk` | **13.6** | **12.1** | 4.0 |
| `canvas` / `line` | **8.8** | **8.0** | 6.0 |
| `surface` / `line` | **16.4** | **14.7** | 6.0 |
| `canvas` / `line-strong` | **19.4** | **22.7** | 6.0 |
| `canvas` / `canvas-blueprint` | **8.5** | **9.7** | 6.0 |

---

## 4. Colour

All colour lives in `src/brands/*.ts` as tokens and is consumed as CSS custom
properties. **No hex value appears in any component file.** The one exemption,
the drawn handset, is stated in section 6.

### Semantic roles

Five roles. A token belongs to exactly one.

| Role | Tokens | Rule |
|---|---|---|
| **Band** | `--band-deep`, `--band-deep-alt`, `--on-band`, `--on-band-muted` | Grounds for Masthead and hero fields. Never a text colour on light. |
| **Accent** | `--accent`, `--accent-hover`, `--on-accent`, `--accent-ink`, `--accent-soft`, `--accent-on-band` | **The primary action, and only that.** |
| **Data** | `--data-1`, `--data-2`, `--data-3` | Chart series, map marks, sparklines. Deliberately *not* the accent: the accent is an invitation to click, and a chart line is not clickable. |
| **Status** | `--positive`, `--negative`, `--warn`, `--alert`, `--info` and their `-soft` grounds | Outcome and state. Shared across brands: an approval reads as an approval in either skin. |
| **Structural** | `--ink`, `--ink-2`, `--ink-3`, `--line`, `--line-strong`, `--field-line` | Text and division. |

### Rules

1. **One primary action per screen, and buying.** Revised from "one accent per
   screen", which was too blunt and is what starved the build of colour. Exactly
   one control carries `--accent` as a fill, plus commerce. Colour is free to work
   structurally everywhere else: in bands, in data, in status, in tinted grounds.

   Commerce is an exception because a catalogue's whole job is to offer the same
   buying action once per row. A shop list with one Add button in accent and five
   in grey is not a screen obeying the rule, it is a screen with one product for
   sale. The accent is reserved for the primary action **and for buying**: add,
   the order bar, checkout. Mark those subtrees `data-commerce` so
   `audit-design.mjs` can tell the exception from the drift, and so that an
   unmarked second accent fill on a shop screen still fails the audit.
2. **`--field-line` is a separate token** because an input outline must clear
   3:1 as a meaningful non-text control, while a structural hairline only has to
   be perceptible. Conflating them is why inputs read as unbordered.
3. **`--accent-on-band` is non-text only.** In the new brand the orange reaches
   3.97:1 on teal: fine for a rule, a dot or a chart line, short of the 4.5:1 a
   label needs. Text on a dark band is `--on-band`. A primary action on a dark
   band is an `--accent` fill carrying `--on-accent`.
4. **`--accent-hover` lightens rather than darkens.** The accent fill carries dark
   text, because white on a saturated mid-tone brand colour cannot clear 4.5:1
   without dulling the colour. Darkening on hover would walk the label toward its
   own ground.
5. **No gradients in the interface.** Unchanged. Gradients are not what was
   missing. Dark colour fields are. The brand wordmark contains one and that is
   fine, because it is a supplied asset rather than chrome.
6. **No purple, no indigo** unless a brand ships them. Neither does.
7. `--ink-3` is metadata only, held to 3:1. Never used for anything a person must
   read in order to act.
8. **`--info` is the fourth status, added in the client-owner pass.** `neutral`
   says "no signal here"; `info` says "read this, it is not a problem". The build
   had no way to say the second, so covered-by-your-plan and this-is-an-estimate
   were both drawn as neutral pills on `--surface-sunk`, which is also the ground
   of every Rail and Closing band, and vanished into the band they sat on. It is a
   desaturated slate in both brands rather than a saturated blue: neither identity
   owns a blue, and a bright one would read as a fifth brand colour instead of as
   a function colour.

### The semantic names, mapped

The token names in this system are older than the semantic vocabulary a reviewer
is likely to arrive with. They are not renamed, because renaming them would touch
all thirty-four screens for zero pixels of change. This table is the dictionary.

| Semantic role | Token here |
|---|---|
| `surface.page` | `--canvas` |
| `surface.card` | `--surface` |
| `surface.raised` | `--surface-raised` |
| `surface.sunk` | `--surface-sunk` |
| `surface.brand` | `--band-deep`, reachable as a card through `<Card tone="brand">` as well as as a band |
| `text.primary` | `--ink` |
| `text.secondary` | `--ink-2` |
| `text.muted` | `--ink-3` |
| `text.onBrand` | `--on-band` |
| `border.hairline` | `--line` |
| `border.strong` | `--line-strong` |
| `action.primary` | `--accent` |
| `action.primaryText` | `--on-accent` |
| `action.secondary` | The `secondary` Button variant: `--surface` fill, `--line-strong` outline, `--ink` label. Not a colour token, because a secondary action is defined by carrying no fill colour |
| `status.healthy` | `--positive` / `--positive-soft` |
| `status.attention` | `--warn` / `--warn-soft` |
| `status.critical` | `--alert` / `--alert-soft`, or `--negative` / `--negative-soft` where the pair is an outcome rather than a state |
| `status.info` | `--info` / `--info-soft` |

### How status is shown

**One system, not a menu.** The previous version of this section listed four
permitted treatments and let the call site pick, which is how `/route` ended up
looking like it had two systems in a single list.

The system:

1. **A discrete state of an object is a pill.** `micro` label on a ground that
   contrasts with the band beneath it.
2. **Within one list, every row carries a pill, including the unremarkable state.**
   Pills on the exceptions only is what makes the remaining rows read as unlabelled
   rather than as normal.
3. **A tinted row ground is additive and never a substitute.** It marks a row that
   needs acting on. The pill still says what the state is.
4. **Bare text is not a status treatment.** Neither is a dot alone. Colour alone is
   not an accessible signal.
5. **A pill must contrast with its own band.** This is the rule that was missing.

Rule 5 has a measured cause. `/route` was reported as showing "FIXED as a pill and
CAN MOVE as bare text in the same list". Both are pills in the source. The `neutral`
pill ground was `--surface-sunk` and the Rail band it sits on is also
`--surface-sunk`, so the neutral pill was the same colour as its ground and only its
label was visible. It read as bare text because it was, visually, bare text.

So the neutral pill is now `--surface` fill with a `--line-strong` hairline. On a
Rail or Closing band the fill separates it; on a Data band the hairline does. The
signal pills keep their `-soft` grounds, which contrast with every band level in
section 3.

A pill never sits on a Masthead. On a dark band a state is `--on-band` text at
weight 500 with an `--on-band-muted` label above it, because a `-soft` tint on
`--band-deep` is a grey smudge.

**The 3px left rule is banned.** It was a status treatment in both previous
directions, and it is out for two reasons found in the build.

It never actually worked. `RowList` used `divide-y divide-line`, and Tailwind's
`divide-{color}` sets `border-color` on **all four sides** of every child after the
first, through a selector specific enough to beat a plain `border-l-transparent`
utility on the child. So a row asked for a transparent 3px left border and got one
in the hairline colour, on every row except the first, whether or not it carried a
state. Those marks appeared on nearly every screen and had no logic, because they
were an accident rather than a rule.

And working correctly it would still have been the weakest of the treatments. The
audit finding on `/readiness` was that a passing gate and a failing gate read as
identical, because the only difference was a thin marker at the row edge. Ground
carries state. A 3px edge does not.

`neutral` and `strong` row tones paint nothing. They were emphasis rather than
signal, and emphasis on a row is the job of its type weight.

**Never use Tailwind `divide-{color}`.** Use
`[&>*+*]:border-t [&>*+*]:border-t-line`, which sets only the top colour and leaves
a child's own borders alone. The whole codebase is on that form.

### Palette, legacy

Legacy is the default and the demo brand, and it has green plus a dark green.
**Every composition must hold here first.** If a screen only works because it has
four brand colours, the composition is doing no work and the colour is carrying
it.

| Token | Value | Token | Value |
|---|---|---|---|
| `band-deep` | `#16281C` | `accent` | `#64A70B` |
| `band-deep-alt` | `#0B1710` | `accent-hover` | `#74BD0D` |
| `on-band` | `#F2F5F0` | `on-accent` | `#111A13` |
| `on-band-muted` | `#A9BBAE` | `accent-ink` | `#3F6B07` |
| `surface` | `#FFFFFF` | `accent-soft` | `#E6F0D2` |
| `canvas` | `#EFE9DB` | `accent-on-band` | `#8FCF23` |
| `surface-sunk` | `#DFD8C6` | `data-1` | `#3F6B07` |
| `canvas-blueprint` | `#C9D3D9` | `data-2` | `#16281C` |
| `ink` | `#141D16` | `data-3` | `#7A5610` |
| `ink-2` | `#4E5A50` | `positive` / `-soft` | `#1B6E45` / `#DCEDE3` |
| `ink-3` | `#6E7970` | `negative` / `-soft` | `#B3261E` / `#F8E4E2` |
| `line` | `#D8D0BD` | `warn` / `-soft` | `#7A5610` / `#F4EAD2` |
| `line-strong` | `#BCB39C` | `alert` / `-soft` | `#96301D` / `#F6E3DE` |
| `field-line` | `#847C68` | | |

### Palette, next

Four brand colours: orange `#F85E00`, teal `#294D4A`, plum `#472836`, sage
`#A3B19B`. Orange is the accent, teal is the Masthead, plum is `band-deep-alt`
and takes hero fields, sage is `line-strong`.

| Token | Value | Token | Value |
|---|---|---|---|
| `band-deep` | `#294D4A` | `accent` | `#F85E00` |
| `band-deep-alt` | `#472836` | `accent-hover` | `#FF7A28` |
| `on-band` | `#EFF4F1` | `on-accent` | `#1B2A27` |
| `on-band-muted` | `#A6BAB6` | `accent-ink` | `#AC4100` |
| `surface` | `#FFFFFF` | `accent-soft` | `#FCE6D8` |
| `canvas` | `#E9EDE5` | `accent-on-band` | `#FF8A3D` |
| `surface-sunk` | `#D7DFD1` | `data-1` | `#AC4100` |
| `canvas-blueprint` | `#C7D2D9` | `data-2` | `#294D4A` |
| `ink` | `#17231F` | `data-3` | `#472836` |
| `ink-2` | `#4B5A54` | Status tokens | as legacy |
| `ink-3` | `#6C7A74` | | |
| `line` | `#CFD8C8` | | |
| `line-strong` | `#A3B19B` | | |
| `field-line` | `#73817C` | | |

### Measured contrast

Computed, not estimated. Two AA failures shipped last time by assuming.
`scripts/audit-contrast.mjs` is the gate and must be extended to cover this table.

| Pair | Legacy | Next | Floor |
|---|---|---|---|
| `ink` on `surface` | 17.25 | 16.20 | 4.5 |
| `ink` on `canvas` | 14.25 | 13.66 | 4.5 |
| `ink` on `surface-sunk` | 12.14 | 11.85 | 4.5 |
| `ink` on `canvas-blueprint` | 11.34 | 10.53 | 4.5 |
| `ink-2` on `surface` | 7.24 | 7.27 | 4.5 |
| `ink-2` on `canvas` | 5.98 | 6.13 | 4.5 |
| `ink-2` on `surface-sunk` | 5.09 | 5.32 | 4.5 |
| `ink-2` on `canvas-blueprint` | 4.76 | 4.72 | 4.5 |
| `ink-3` on `surface` | 4.53 | 4.49 | 3.0 |
| `ink-3` on `canvas` | 3.75 | 3.79 | 3.0 |
| `ink-3` on `surface-sunk` | 3.19 | 3.29 | 3.0 |
| `on-band` on `band-deep` | 14.10 | 8.37 | 4.5 |
| `on-band` on `band-deep-alt` | 16.69 | 11.62 | 4.5 |
| `on-band-muted` on `band-deep` | 7.68 | 4.58 | 3.0 |
| `on-band-muted` on `band-deep-alt` | 9.09 | 6.35 | 3.0 |
| `accent-ink` on `surface` | 7.69 | 7.05 | 4.5 |
| `accent-ink` on `canvas` | 6.35 | 5.94 | 4.5 |
| `accent-ink` on `surface-sunk` | **5.41** | **5.16** | 4.5 |
| `accent-ink` on `accent-soft` | 6.50 | 5.86 | 4.5 |
| `on-accent` on `accent` | 5.99 | 4.69 | 4.5 |
| `on-accent` on `accent-hover` | 7.64 | 5.73 | 4.5 |
| `accent-on-band` on `band-deep` | 8.21 | **3.97** | 3.0, non-text only |
| `accent-on-band` on `band-deep-alt` | 9.72 | 5.51 | 3.0 |
| `data-1` on `surface` / `canvas` | 6.33 / 5.23 | 5.98 / 5.05 | 3.0 |
| `data-2` on `surface` / `canvas` | 15.51 / 12.81 | 9.31 / 7.85 | 3.0 |
| `data-3` on `surface` / `canvas` | 6.63 / 5.48 | 12.93 / 10.90 | 3.0 |
| `positive` on `surface` / `canvas` / `-soft` | 6.24 / 5.16 / 5.13 | 6.24 / 5.27 / 5.13 | 4.5 |
| `negative` on `surface` / `canvas` / `-soft` | 6.54 / 5.40 / 5.35 | 6.54 / 5.51 / 5.35 | 4.5 |
| `warn` on `surface` / `canvas` / `-soft` | 6.63 / 5.48 / 5.54 | 6.63 / 5.59 / 5.54 | 4.5 |
| `alert` on `surface` / `canvas` / `-soft` | 7.67 / 6.34 / 6.20 | 7.67 / 6.47 / 6.20 | 4.5 |
| `field-line` on `surface` / `canvas` | 4.15 / 3.43 | 4.07 / 3.43 | 3.0 |

Three fixes carried in these numbers. `warn` moved from `#8A6210` to `#7A5610`
because it measured 4.36:1 on the new darker canvas. `ink-3` moved from `#828C84`
to `#6E7970` because it measured 2.71:1 on the corrected sunk level. And
`accent-ink` darkened from `#3F6B07` to `#375D06` in legacy and `#AC4100` to
`#9A3A00` in next, because it measured **4.45:1 and 4.38:1 on `--surface-sunk`**, a
pair the first table never checked. It was missed because Rail bands did not exist
when that table was written, so accent text had never sat on the sunk level before.
`scripts/audit-contrast.mjs` now covers the pair.

**A fourth, from the navigation rebuild.** Moving the bottom bar to the sunk ground
put the inactive nav label on `ink-3` over `surface-sunk`, which the table above
records at **3.19 legacy and 3.29 next**. That clears the 3:1 metadata floor, and
`ink-3` is listed as metadata, so the audit passed it. It is still wrong: a nav
label is text a person reads in order to navigate, not metadata beside a value, so
it owes 4.5:1. The inactive state is `ink-2`, at 5.09 and 5.32, and section 14 is
updated to say so.

The general lesson, which is the third time this pass has produced it: **a token's
contrast floor is a property of the job the text is doing, not of the token.**
`ink-3` is metadata in a row and body text in a nav bar, and no per-token table can
express that. The audit checks the floor a token is usually held to, so it will
keep passing cases like this one. Whoever moves text onto a new ground has to ask
what that text is for.

---

## 5. Type

**Plus Jakarta Sans** throughout. **IBM Plex Mono** for identifiers only: work
order numbers, invoice numbers, part SKUs, asset IDs, quote references. Never body,
never headings, never prices. `font-variant-numeric: tabular-nums` globally.

### The problem being fixed

The old scale was 30 / 22 / 17 / 15 / 13 / 11. On screen, 93% of characters landed
on 13 and 15, the top step was 1.46x the second, and 17px carried 30 characters on
a whole screen. Six steps, two doing work.

### The scale

Seven steps. Two registers, and **which register applies is decided by the frame,
not by the browser window.** See below.

| Role | Framed | Full bleed | Tracking | Weight | Job |
|---|---|---|---|---|---|
| **hero** | 48 / 46 | 72 / 68 | -0.035em | 700 | One per screen. Section 7. Not available to the client-owner screens: see below |
| display | 32 / 34 | 42 / 44 | -0.02em | 700 | Secondary figures, band subjects. The client-owner ceiling |
| h1 | 24 / 30 | 28 / 34 | -0.015em | 700 | Band headings |
| **section** | 19 / 26 | 19 / 26 | -0.01em | 500 | Card headers, and the heading level inside a band |
| body | 16 / 25 | 16 / 25 | 0 | 400 | All prose. 500 for emphasis |
| caption | 13 / 19 | 13 / 19 | 0 | 400 | Metadata, secondary row detail |
| micro | 11 / 14 | 11 / 14 | +0.08em | 500 | Eyebrows and labels above values. Sentence case. Four words maximum |

Framed steps: 48, 32, 24, 19, 16, 13, 11.

**Why `section` was added.** The measured usage across the whole build was
`caption` 286 times against `body` 160, `display` 10 and `h1` 6. The scale had
seven notional steps and the screens used two. The gap that caused it is the one
between 24 and 16: any heading subordinate to a band title had nowhere to go and
collapsed onto `body` or `caption`, so a screen read as one large word above an
undifferentiated field. 19 is the step that was missing, and it is register
independent on purpose: it is right in the handset and right on a console, and
promoting it at desktop width would reopen the gap it exists to close.

**Why the client-owner screens stop at `display`.** Their `hero` was never a
figure. It was the screen's own name set at 48px, three of the four tabs opened
with one, and on an iPhone SE `/system` spent an entire viewport on the words
"Ecoflo compact biofilter". Above the fold has to carry state, not a title card.
So on `client-prospect` and `client-owner` the ceiling is `display`; `hero` stays
available to the Global screens, where it sets a real number against a target,
which is the job section 7 describes.

### How many sizes may appear on one screen

Having a scale is not the same as using it sparingly. The rules:

1. **All band headings on a screen use one step, `h1`.** A screen with two band
   headings at different sizes has no heading level, it has two accidents.
2. **Only the screen hero uses the `hero` step.** Section 7 already says this; it
   is repeated here because it is a type rule as much as a composition one.
3. **`display` is permitted at most once per screen**, for the single secondary
   figure, and not at all on a screen whose hero is a number.
4. **Five sizes carry the reading hierarchy on any one screen, and only one of
   them may be larger than `section`.** Raised from four in the client-owner
   pass, when `section` was added. Four was written against a scale that ran
   48 / 32 / 24 / 16 / 13 with nothing between 24 and 16, and the missing step is
   what forced every sub-heading onto `body` or `caption`. A screen that carries a
   band heading and a heading inside it legitimately needs five.

   Raising a count without replacing the discipline it carried is how a rule
   becomes a formality, so rule 2 above, one element per screen at the `hero`
   step, is now enforced by `audit-rules.mjs` rather than merely written down. It
   is the check the total was standing in for. Counting steps above `section`
   instead was tried first and was wrong: a 32px subject over 24px band headings
   is hierarchy, not competition.

Two registers sit outside that count, and this is a deliberate reading of the rule
rather than a loophole:

- **`micro` at 11px** is a label register. It names a value, it is never read as
  prose, and removing it would push eyebrows onto `caption` where they would stop
  being distinguishable from row metadata.

  It is **sentence case**, not uppercase. The token carried an `uppercase`
  transform that `applyBrand()` never wrote to a custom property, so nothing in
  the build was ever uppercased by it and every eyebrow has always rendered
  sentence case with the tracking doing the separating. The dead field is removed
  rather than implemented, for two reasons: a token that silently does nothing is
  worse than no token, because this document then says the opposite of what the
  screen shows; and uppercasing strips accents in some renderers, which in a
  French Quebec product turns a label into a spelling mistake.
- **The control label at 15px** is a control register, specified in section 6.

So a fully loaded screen shows six physical sizes: four reading, two functional.
Counting only the reading hierarchy is what makes "four" achievable at all, because
hero, `h1`, `body` and `caption` already fill it before a single button or eyebrow
is placed. **This is worth an explicit decision rather than an assumption.** If the
intent is a literal four including labels and controls, the way to get there is to
delete `caption` and set all secondary row detail in `body`, which costs roughly
20% more vertical space on the technician and manager screens. That trade has not
been made here.

Measured before this rule existed: `/route` showed **five** reading sizes
(48, 24, 16, 13, 11) and `/parts` showed four (48, 16, 13, 11).

One note on a finding I could not reproduce. The report was that "What is fixed"
and "The run" render at different sizes on `/route`. Measured at 1440px and 500px,
in both registers, all three band headings on that screen compute to **24px**. What
is real on `/route` is the size count above and the fact that "The run" renders at
all on a phone, which section 6 of this document and the breakpoint rule below now
forbid. If a size difference is still visible after this pass, it is a different
defect and I have not found it yet.

### Rag: no hero ends on an orphan

**No hero may break to leave a single word on its last line.** Measured on
`/parts`: "Parts for your system" at 48px in a 356px column sets to two lines as
"Parts for your / system", one orphan.

The fix is never to shrink the hero. Either the copy changes to a length that rags
cleanly at the framed column width, or the intended break is set explicitly. A hero
is four words at most in the framed register.

### Breakpoints key off the register too

The same fault as type size, in a second place. `md:` and `lg:` utilities resolve
against the **browser window**, so inside a 420px device frame at a 1440px window
every `lg:` rule is true. That is why the `/route` map band, marked `hidden lg:block`
and captioned "Desktop only", rendered inside the handset with its eyebrow visible.

**A framed role may not use a viewport breakpoint to switch layout.** Either the
layout is the same at all widths, because the framed column is one width, or the
switch is driven by the register attribute. Viewport breakpoints remain correct on
`sp-manager` and `ptwe-global`, which are genuinely responsive.

### Type size keys off the frame, never off the viewport

**This is a correctness rule, not a preference.** Client and technician are
mobile-first roles rendered inside a device frame with a 420px screen. The shipped
build promotes `--step-display` and `--step-h1` at `@media (min-width: 1024px)` on
`:root`, which means a framed client screen in a 1440px browser gets the desktop
step inside a 420px box. With `display` at 38px that was merely loose. **With
`hero` at 72px it breaks out of the handset in exactly the projected demo this is
built for.**

So the promotion is scoped to the register, not to the window:

- The base `--step-*` values in `index.css` are the **framed** column.
- The **full bleed** column is applied by a selector on the shell,
  `[data-register='full']`, and only additionally gated on viewport width.
- `AppShell` sets `data-register="framed"` for `client-prospect`, `client-owner`
  and `sp-technician`, and `data-register="full"` for `sp-manager` and
  `ptwe-global`.
- A framed role therefore renders the framed column at every width, from a 390px
  phone to a 1920px projector. The frame is the viewport as far as type is
  concerned.

The override lands on a descendant of `<html>` rather than on `:root` because
`applyBrand()` writes `--type-*` as inline styles on the root element, and an
inline style outranks any stylesheet rule. This is the same constraint that made
the `--step-*` aliases necessary in the first place.

**A framed hero must fit two lines at 420px.** At 48px that is roughly 11
characters per line. "Today", "3 jobs", "$2.1M" and "12 ppm" fit on one. A hero
that needs three lines is not a hero, it is a heading, and it belongs at `h1`.

**`h2` is deleted.** At 17px between 22 and 15 it was doing no distinct work. Its
current call sites re-point: a card or group heading becomes `body` at weight 500
above a `micro` eyebrow, and a band heading becomes `h1`. If a heading needs to be
bigger than `body` and smaller than `h1`, the real problem is that it is not a
heading.

**Weights: 400, 500, 700. Never 600.**

Body moves from 15 to 16 with leading from 22 to 25. The extra leading is doing as
much as the extra size: 15/22 is a dense ratio that reads as a form field.

---

## 6. Space, shape, controls

**Spacing** on a 4px base: 8, 12, 16, 24, 32, 48, plus **64** and **96** for band
padding, which the old scale topped out too low to express.

Band vertical padding: 32px mobile, 48px desktop, and 64px for a Masthead.

### The gutter

**There is exactly one content gutter, and every horizontal edge on the screen
resolves to it.** This was the largest unspecified thing in the system and it is
why the build read as misaligned rather than as merely plain.

Measured on `/route` and `/parts` before writing this, as distinct left edges in
px from the content column, framed register at a 1440px window:

```
/route   0, 32, 45, 54, 60, 64, 169, 185, 192, 298, 329, 335, 393
/parts   0, 32, 40, 64, 89, 96, 127, 139, 244, 306, 346, 393
```

Thirteen and twelve distinct left edges on two screens. The gutter was 32px, so
the only two edges that were correct were `32` and `96`, and `96` only by accident.

Three separate faults produced that:

1. **`--gutter` was keyed to the window, not to the register.** It was declared on
   `:root` and promoted from 20px to 32px at `min-width: 1024px`, so a 420px phone
   column inside the device frame was given the 32px desktop gutter. This is the
   same fault section 5 fixes for type, in the same file, missed because the gutter
   was treated as a layout constant rather than as a register-scoped one.
2. **`Band flush` dropped the gutter and nothing put it back.** `BandHead` had no
   horizontal padding of its own, so every band eyebrow and heading rendered at
   **left 0** while the rows inside the same band sat at 32. That is the specific
   defect visible on `/route`.
3. **Content outside a band had no gutter at all.** The `/parts` filter chips and
   the technician offline strip were rendered as bare siblings between bands, so
   they took whatever padding they happened to carry.

The rules:

- **One token, `--gutter`, scoped to `[data-register]`.** 20px framed at every
  window width. 24px full bleed, 32px at 1024px, 40px at 1440px. A framed role
  never reads the full-bleed value, at any window size.
- **Everything aligns to it**: band eyebrows, band headings, rows, chips, controls,
  captions, flags, empty states, annotations. There is no "nearly the gutter".
- **Rules and dividers run full bleed or inset to the gutter on both sides.**
  Inset on one edge only is banned. It reads as a mistake because it is one.
- **Rows with a leading box** put the box on the gutter and start text at
  `gutter + box + 16`. Every text line in that row starts on that edge, including
  the price and the metadata line, not just the title. Two box sizes are in use and
  no others: **48px** for list thumbnails, avatars and the route's stop number, and
  **72px** for the technician's portrait on the client home, where the face is the
  reassurance the screen is built on. A row's stop number gets the same 48px box a
  thumbnail would, so an indexed list and a thumbnail list share one text edge.
- **Rows with a leading icon** put the icon in a fixed 16px box with a 12px gap, so
  the text edge is `gutter + 28` whatever the row's font size. Written inline, the
  icon inherits `1em`, which put the same pattern at `gutter + 28` in a `body` row
  and `gutter + 25` in a `caption` row. Three pixels is invisible alone and is how
  a build accumulates twelve left edges. The `Note` primitive is the only way to
  write one.
- **Right-aligned elements share one right gutter**, equal to the left. A trailing
  chevron, a status pill and an action all end on the same edge.
- **A flush band owns no padding, so its children each carry the gutter.** A
  non-flush band already has it, and a child that adds `px-gutter` again produces
  the 64px double indent seen on `/parts`.

Enforcement is `scripts/measure-align.mjs`, which prints every distinct left and
right edge per route, and the dev-only gutter overlay described in section 19. The
target is **two left edges on a screen without thumbnails** (the gutter, and
`gutter + 64` where a row is indexed) and three where there are.

### Buttons

The previous document specified no control geometry at all, so height came from
padding plus line-height and drifted with the label. This is the specification.

| Size | Height | Horizontal padding | Use |
|---|---|---|---|
| Primary | 48px | 20px | The one main action on a screen |
| Secondary | 40px | 16px | Supporting actions |
| Compact | 32px | 12px | Inside a row, or beside a field |

**Height is fixed, never derived from padding.** A control whose height depends on
its label is a control that changes height when the copy changes.

- **Label is always 15px, weight 500.** Never 400, never 700. 15px is a control
  register, not a step in the reading scale, which is why it does not appear in
  section 5.
- **Icon is 16px** at every button size, optically centred to the cap height rather
  than to the line box, with an **8px gap** to the label.
- **On a dark band the primary button is `--surface` fill with `--ink` label.** Not
  accent. A saturated accent against `--band-deep` vibrates at the edge and reads
  as a default control rather than as a considered one, and it also spends the one
  accent the screen is allowed on a surface that does not need it.
- **A ghost outline is never a screen's primary action.** An outlined control is a
  secondary by definition. Where the primary action was outlined, it becomes a
  filled control at the size the placement allows: the `/parts` row Add button
  becomes a compact filled control, not a bordered one.

Five states, all defined, none optional:

| State | Treatment |
|---|---|
| Rest | The variant fill and label |
| Hover | Fill 6% darker, via `color-mix` against black. Label unchanged |
| Pressed | Fill 12% darker. **No transform**, no scale, no lift |
| Disabled | `--surface-sunk` fill, `--ink-3` label, no border. Not the rest fill at reduced opacity |
| Loading | Label replaced by a 16px spinner, **width locked** to the rest width so nothing reflows |

Disabled is a fill change rather than an opacity change because opacity on a
coloured fill produces a tint of the canvas that reads as a different variant, and
because 40% opacity on a dark label fails contrast while `--ink-3` on
`--surface-sunk` clears 3:1 as metadata.

Pressed carries no transform because a button that moves under the finger on a
touch surface is a shift the user has to re-target, and because the reduced-motion
rule in section 9 would have to disable it anyway, leaving pressed undefined.

**Radius.** Bands have **no radius**: they are full bleed and their edges are the
content column edges. Radius belongs to objects inside bands.

| Token | Value | Use |
|---|---|---|
| `--radius-card` | 12px | The rare card |
| `--radius-control` | 8px | Buttons, inputs, icon chips |
| `--radius-pill` | 999px | Chips, toggles, avatars |
| `--radius-shell` | 24px legacy, 22px next | The app shell and the sidebar |

Card and control came down from 18/12 legacy and 16/10 next, and both brands now
share them. At 18px a card corner competes with the pill radius and the whole
surface starts to read as a phone widget rather than as paper. `--radius-shell`
stays per brand, because that is the device and the sidebar rather than content.

**Elevation.** `--shadow-card` for a card at rest, `--shadow-raised` for hover and
card-on-band, `--shadow-sheet` for sheets, modals and the handset. Bands carry no
shadow; they are separated by ground, which is the whole point of section 3.

**The handset frame** is unchanged and remains the one exemption to the no-hex
rule. Its rail, bezel and lens are photographic properties of a physical object,
not brand values: a titanium rail is the same grey in both brands, and a brand
switch that tinted the phone would be a bug. They live in the `.device-*` block in
`index.css` beside the device dimensions, which are literals for the same reason.

---

## 7. The hero rule

**Every screen nominates exactly one dominant element. Nothing else on that screen
may compete with it.**

A hero is one of three things, and only these three:

- **A number**, at `hero` size, tabular, with a `micro` label above and at most one
  line of `body` beneath.
- **A photograph**, full bleed across its band, 240px minimum height.
- **A dark field**, a Masthead carrying a state or a date as its subject.

**The hero renders at the `hero` step of its register**, framed or full bleed, per
section 5. On a framed role that is 48px at every browser width. A hero is never
sized from the window.

Competing means: no other element on the screen uses the `hero` step, and at most
one other uses `display`. A screen with two 38px figures side by side, which is
what `/sp` shipped, has no hero.

The old document listed "asymmetric layout, one dominant element" in the banned
patterns table as a *replacement* for something else, and enforced it nowhere.
This section is where it becomes a rule with a per-screen answer.

### Hero per screen

| # | Screen | Route | Hero type | Hero content |
|---|---|---|---|---|
| 1 | Intake | `/start` | Dark field | The opening question, at `hero` on the Masthead |
| 2 | Request received | `/request` | Dark field | The named Service Point team assigned |
| 3 | Soil test | `/soil-test` | Number | Percolation rate, the figure the design follows from |
| 4 | Your solution and quote | `/quote` | Photograph | The recommended system. The reveal screen |
| 5 | Installation tracking | `/install` | Dark field | Current stage, "2 of 4", as the Masthead subject |
| 6 | Handover | `/handover` | Dark field | "Your system is live" |
| 7 | Client home | `/home` | Dark field | Next visit date. Already the strongest screen in the build |
| 8 | My system | `/system` | Photograph | The installed system on this property |
| 9 | Invoices | `/invoices` | Number | Amount outstanding. Zero is a good answer, shown large |
| 10 | Maintenance contract | `/contract` | Number | Visits the plan has covered this term |
| 11 | Book an appointment | `/book` | Dark field | The chosen arrival window |
| 12 | Parts store | `/parts` | Photograph | The part that fits this system |
| 13 | Messages | `/messages` | Dark field | The Service Point team, and the latest reply |
| 14 | Transfer ownership | `/system/transfer` | Dark field | What transfers with the property |
| 15 | Recommended | `/recommended` | Photograph | The recommended product |
| 16 | My day | `/day` | Number | Jobs today |
| 17 | Work order | `/wo/:id` | Dark field | Customer and arrival window |
| 18 | Route and schedule | `/route` | Number | Total distance for the day |
| 19 | Field quote | `/wo/:id/quote` | Number | Quote total |
| 20 | Pre-job safety check | `/wo/:id/safety` | Number | The gas reading. The one screen where a number must dominate absolutely |
| 21 | Service Point dashboard | `/sp` | Number | Service revenue share against target |
| 22 | Dispatch board | `/sp/dispatch` | Number | Jobs not yet confirmed with the customer |
| 23 | Customers | `/sp/customers` | Number | Accounts under this Service Point |
| 24 | Leads | `/sp/leads` | Number | Leads waiting on a first call |
| 25 | MARCOM catalogue | `/sp/marcom` | Number | Leads generated and attributed. The closed loop, not the merch |
| 26 | Inventory | `/sp/inventory` | Number | Weeks of cover on filter media |
| 27 | Team and capacity | `/sp/team` | Number | Capacity committed this week |
| 28 | Flo | `/flo` | Dark field | The question input. The ask is the hero |
| 29 | Network overview | `/network` | Dark field | The map, on `band-deep` |
| 30 | Region drill | `/network/:regionId` | Number | Region service share |
| 31 | Mix tracker | `/mix` | Number | Network service share against the 35% target |
| 32 | Adoption | `/adoption` | Number | Portal activation rate |
| 33 | Benchmarking | `/benchmarking` | Number | The spread: best against worst |
| 34 | Readiness | `/readiness` | Number | Service Points that could be switched on today |

---

## 8. Dark usage

| Rule | Value |
|---|---|
| Minimum per screen | One dark band, the Masthead |
| Masthead minimum height | 200px mobile, 260px desktop |
| Maximum dark share of the first viewport | **65% framed, 40% full bleed.** See the note below |
| Dark on every role's main screen | `/home`, `/day`, `/sp`, `/network`, `/start`. Non negotiable |
| Second dark band per screen | Permitted once, as a Closing band |
| Inverted content areas | Banned. Tables, prose and forms stay on light |

**Corrected while building the client home.** The first draft of this table set a
single 40% ceiling. Building the screen showed that is wrong for the framed
register: on a 790px handset screen, 40% is 316px, and a Masthead that carries the
hero, the technician's face, the arrival sentence and the one action legitimately
wants more than that. A phone is one column and the Masthead is the entire answer
to "what happens next". The ceiling is now 65% framed and stays 40% full bleed,
where the viewport is wide enough that a dark half-screen really is the reading
surface losing.

`--band-deep-alt` is the second dark, for a hero field that must separate from the
Masthead. In legacy it is a deeper green, because legacy has one dark hue and the
composition has to work with that. In next it is plum. Reversal: the old rule
rationed the dark field to "exactly two places in V1", and that rationing is the
single biggest cause of the wireframe read. It is lifted.

---

## 9. Motion

Replaces "no staggered load-in animation", which was too blunt and left the app
inert.

**This app is driven by a presenter talking over it, projected, in a meeting
room.** That is the constraint that sets the motion policy, and it is not the same
constraint as a product someone uses alone at a desk. Three consequences:

- **Motion has to survive projection.** A projector drops frames and crushes
  subtlety. A 6px translate at 40% opacity, which reads as refinement on a laptop,
  reads as nothing at all on a wall. Motion is either clearly visible or absent.
- **Motion must not fire while the presenter is mid-sentence.** Anything that
  animates on scroll, on hover, or on a timer will go off at the wrong moment and
  pull the room's attention off the speaker. Motion fires on **deliberate input
  only**: a click, a route change, a mode change.
- **The role switch is the architectural argument and it currently has no
  motion at all.** Switching role re-renders the same records from a different
  angle. That is the single most important claim the prototype makes and it
  presently happens instantly and invisibly, so the room does not register that
  the data did not reload. This is the one place motion carries an argument rather
  than polish.

**Policy: no decorative animation on static content. No motion on scroll, hover
position or timers. Purposeful motion on deliberate input, mode change, and data
arrival.**

| Event | Motion | Duration | Easing |
|---|---|---|---|
| Hover, focus, toggle, checkbox | Colour and border only | 150ms | `ease-out` |
| Sheet, modal, Blueprint panel | Transform and opacity | 220ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Route change | Content fades and rises 12px | 180ms | `ease-out` |
| **Role switch** | Masthead ground cross fades, content rises 16px, hero re-counts | 320ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Hero number, first mount only | Counts from 0 to value | 700ms | `ease-out` |
| List arrival | Stagger, 40ms per row, first 6 rows only | 200ms each | `ease-out` |
| Skeleton to content | Cross fade | 180ms | `ease-out` |
| Blueprint entering | Canvas shift, then leader lines draw | 240ms, then 240ms | `ease-out` |

Rules that keep this from becoming decoration:

1. **The role switch is deliberately the longest transition in the app**, at
   320ms, and the Masthead ground is what moves. The band changing colour under an
   unchanged customer name is the argument made visible: same record, new register.
2. **Count-up runs once per mount, on the hero only.** Never on a re-render, never
   on a figure the user just changed by typing. A number that animates every time
   you touch the screen reads as a toy.
3. **Stagger caps at 6 rows.** A 40 row table does not stagger. The cap separates
   "the list arrived" from "watch my list arrive".
4. **Skeletons replace blank states wherever data is fetched.** The commerce
   adapter in `src/commerce/adapter.ts` is genuinely async, so `/parts` shows an
   empty card while it resolves. It is the only real loading state in the build,
   and because the commerce platform is an open decision it is also a screen
   reviewers will look at hard.
5. **`prefers-reduced-motion` disables all of it**, including count-up and
   stagger, which then render at final value immediately.

**Changed in the self-critique.** The first draft of this section was a durations
table I would have written for any project. It now starts from the fact that this
build is demo software shown on a projector, which rules out the subtle motion I
had specified, rules out scroll and hover triggers entirely, and surfaces the role
switch as the one transition that carries an argument. That transition was missing
from the draft.

---

## 10. Blueprint mode, the signature

**It must be legible as a mode change from across a meeting room.** It currently
is not: the canvas shift measures 1.007:1 and the callout is a 20x14px pill. That
is the largest single gap between intent and build in the whole project.

| Element | Default | Blueprint |
|---|---|---|
| Canvas | `--canvas` | `--canvas-blueprint`, a real blue grey. ΔL\* **8.5** legacy, **9.7** next |
| Callout | **Nothing** | **28px square**, `--ink` fill, `--on-band` mono numeral, at the band's left edge |
| Leader line | 3px stub | Full rule from the callout to the band's right edge, 1px `--field-line`, **drawn in over 240ms** |
| Band boundary | Nothing | 1px dashed `--field-line` at top and bottom of every annotated band |
| Index panel | List of callouts | Same, plus the count as a `display` figure and Export spec as the primary action |
| Masthead | Brand | Gains `SPECIFICATION` in `micro` mono beside the wordmark |

The numbers stay an index into the exported spec rather than decoration, which is
what earns them the size. Spend the boldness here: this is the mechanism that lets
one build serve leadership and DEV, and it is the thing no competing prototype
will have.

### The default state shows no callout at all

Changed in the client-owner pass. The default state used to be a small
hairline-outlined marker at the header baseline, on the argument that it was low
contrast and therefore easy to ignore while demoing the product.

It was not ignorable. A sequence reading 01, 02, 03 down the right edge of a page
is read as step numbering by anyone who does not already know what Blueprint mode
is, and that is every customer and most of the room in a leadership review. On
`/system` it numbered three unrelated blocks as though they were stages of a task.
A marker that has to be explained before it can be ignored is not low contrast; it
is a question the screen keeps asking.

Nothing is lost from the spec layer. Every annotation is still reachable in
Blueprint mode and from the Blueprint panel, which lists all of them and is where
Export spec already lives. The callouts are now revealed by the mode built to
reveal them, instead of being half revealed all of the time. That also sharpens
the mode change this section opens by demanding: going from no callouts to
twenty-eight numbered ones is legible from across a room in a way that going from
small grey to large black never was.

---

## 11. Density by role

One global density setting was wrong. Client screens need fewer things larger.
Manager and Global screens shipped under-dense in an unhelpful way, large
containers holding little: `/readiness` spent 1164px on 12 booleans.

| | Client | Technician | Manager | Global |
|---|---|---|---|---|
| Data row height | 72px | **56px min tap 48** | 40px | 36px |
| Row content | Label, value, one detail line | Label, value, status | Label plus up to 4 columns | Label plus up to 6 columns |
| Band padding, vertical | 48px | 24px | 24px | 20px |
| Body step | 16 | 16 | 16 | 16 |
| Secondary step | `caption` 13 | `caption` 13 | `caption` 13 | `caption` 13 |
| Table header | Not used | Not used | `micro` on `surface-sunk`, sticky | `micro` on `surface-sunk`, sticky |
| Items visible per viewport | 4 to 6 | 5 to 7 | 12 to 16 | 16 to 22 |

The technician row is the outlier and stays large: gloves, sunlight, a basement,
one hand. 48px tap minimum is an accessibility floor, not a density preference.

Manager tables gain a sticky `micro` header on `--surface-sunk`, alignment by
column, and numbers right aligned and tabular. The manager has real volume to be
dense with: work orders, customers, leads, stock lines.

### Global is comparative, not dense

**Global cannot be dense, and pretending otherwise is what broke it.** The seed
data has 3 Service Points and 2 regions. That is the correct scale for a
believable prototype, and it means a Global "table" is three rows. Three rows in a
1060px container with a sticky header is not a data table, it is a comparison
wearing the costume of one, and that costume is most of why `/readiness` and
`/network` read as unfinished.

So Global screens optimise for **comparison against a target**, not for volume:

- **Three rows is a ranking, so rank it.** Ordered, numbered, with the figure at
  `display` size on every row rather than as a 13px caption. On `/readiness` the
  readiness percentage is the content and must be the largest thing on its row.
- **Show the spread, not the list.** The distance between best and worst is the
  Global insight. `/benchmarking` and `/mix` should state that gap as a figure
  before they list the members.
- **Difference must be visible without reading.** On `/readiness` a passing gate
  and a failing gate are currently the same row differing by one 13px icon colour.
  A failing row gets `--warn-soft` as its ground and a 3px `--warn` leading rule.
  Ground, not iconography, carries state at this density.
- **Per-row height goes up, not down.** 56px for a Global comparison row, not the
  36px a real table would use, because there are only three of them and each one
  now carries a `display` figure.

The 36px row and 6 column figures in the table above therefore apply only where
Global genuinely lists many things: the all-measures view on `/benchmarking` and
the Service Point roll-up on `/network/:regionId`.

**Changed in the self-critique.** The first draft gave Global the tightest rows and
most columns, which is what you would write for a network operations dashboard and
is wrong here: with 3 Service Points in the seed data there is nothing to be dense
with, and I had specified density that the content cannot fill. That mismatch,
large containers holding little, is one of the audit findings, so the draft was
prescribing the defect. Global is now specified as comparative, with larger rows
carrying larger figures.

---

## 12. Charts

The shipped chart is one 1px line with no fill, no gridlines and no anchoring, in
roughly 1000x160px of white. Technically compliant with the old rules and visually
empty.

**Every chart in this product has the same subject: distance from a target.**
Service revenue share against 35%. Portal activation against a rollout plan.
Revenue against a regional number. Readiness against a gate. There is not one
exploratory chart in the build, because nobody opens this to discover a trend, they
open it to see how far off they are.

So the target is not an annotation on the chart. **The target is the chart, and the
series is the distance from it.** That reframing is what fixes `/mix`, where the
1.9 point gap between 33.1% and 35% is the entire subject of the screen and is
currently a dotted hairline with an 11px label.

Required:

1. **The reference line is drawn first and drawn strongest.** Solid 2px
   `--field-line`, full plot width, with the target value in a `micro` chip pinned
   at the right end on `--surface-sunk`. It is not dashed and not faint. Every
   chart in this app has one, and a chart with no target does not belong here.
2. **The gap is filled.** The area between the series and the reference line
   carries a 14% fill in the **series colour**, `--data-1`. The size of that shaded
   wedge is the answer the viewer came for, and it should be readable with the
   numbers covered.

   **Revised after building it.** This rule first said to tone the wedge
   `--positive` or `--warn` by which side of the target the series sits on. In
   practice `--warn` is a brown, and a brown at low opacity over a warm canvas is a
   muddy wash that reads as a rendering artefact rather than a signal. The verdict
   is carried by the signed endpoint label in rule 5 instead, which states it in
   words and cannot be misread.
3. **A ground.** Plot area on `--surface` inside a Data band, or on `--band-deep`
   when the chart is the hero. Never floating on canvas.
4. **A baseline.** 1px `--line-strong`, full plot width, always drawn.
5. **Endpoint emphasis.** Final point as a 5px filled dot, its value inline at
   `display` size in the series colour, and the distance from target beneath it in
   `caption`, signed: "1.9 below target".
6. **At most 3 y ticks, or none.** Fitted values like "40, 29, 22, 15" read as
   debug output. Prefer none, plus the endpoint and target labels.
7. **Minimum plot height 240px.** Below that a line has no room to have a shape,
   and the gap to the target has no room to be a visible quantity.
8. **Headroom above the target.** The domain extends past the reference line by at
   least half the data spread, so the target rule sits inside the plot rather than
   on its top edge where it reads as a border. Verified at 34% from the top.

   Implementation note, because it cost an hour: give the y axis `width={1}` with
   `tick={false}`. Both `hide` and `width={0}` drop the axis from Recharts' axis
   map and take the explicit domain with it, silently falling back to the auto
   domain. The symptom is a target line flush to the plot top and a wedge that
   fills the whole plot.
9. **Series colours from the Data role**, never `--accent`. Inline labels at the
   line end, no legend box. The target label sits at the **left**, because the
   right end is where the endpoint value and its signed distance already are.

Sparklines are exempt and are permitted only where the direction of travel, not
the distance from target, is the point.

**Changed in the self-critique.** The first draft was a generic anchoring checklist:
add a fill, add a baseline, emphasise the endpoint. All true and all things I would
say about any chart. It now starts from the fact that every chart in this product
measures distance from a target, which promotes the reference line from decoration
to subject and gives the shaded gap a job. The `35%` mix target is the strategic
spine of the whole product and the chart spec should be built on it.

---

## 13. Photography

**Larger and rarer.** The septic tank photograph is the strongest asset available
and appears once, small. It should appear on a handful of screens, full bleed
across a Lead band, at 240px minimum height and up to 400px.

Rules:

- **Real content only.** Technician portrait, property photo, installed system,
  part image. Zero decorative stock imagery.
- **A photograph is a hero or it is a thumbnail.** Nothing in between. The
  in-between size is what made it read as clip art.
- Full bleed to the band edges, never inset in a card with a border.
- Photograph heroes belong to screens 4, 8, 12 and 15 in the table in section 7.
- A portrait stays circular and stays small: a face is identification, not a hero.
  The one exception is the client home, where the technician's face at 72px is the
  reassurance the screen exists to give.

---

## 14. Navigation

**Navigation must recede.** It shipped as the most saturated element on every
screen: a filled accent pill behind the active tab, competing with content and
reading as a framework default.

**This section was written in the Broadsheet rewrite and then never implemented.**
The accent pill survived every pass after it, in `BottomNav` and in the sidebar
`NavList`, so it stayed the loudest element in the build while the document said it
was gone. A rule that lives only in prose is not a rule, which is why section 19
now checks this one.

The active state is solved without a fill:

| Surface | Inactive | Active |
|---|---|---|
| Bottom nav | `--ink-2` icon and label, weight 400 | `--ink` icon and label, weight 500, plus a 2px `--accent` rule directly above the icon |
| Sidebar | `--sidebar-muted` | `--on-band`, weight 500, plus a 3px `--accent-on-band` rule on the leading edge |
| Tabs and filters | Bordered `--surface` | `--ink` text, weight 500, plus a 2px `--ink` rule beneath. No fill |

A 2px rule and a weight change is enough. It reads as "you are here" rather than
as a button that is somehow already pressed.

### Navigation is always reachable, and a new screen starts at its top

Two behaviours, not styling, and both were wrong on a real phone.

**Navigation never scrolls away.** The bottom bar is pinned to the bottom of the
viewport and the content scrolls behind it. This requires the shell to have a
`height`, not a `min-height`: with `min-height` it grew to fit its content, the
screen element grew with it as a flex child, its `overflow: hidden` had nothing to
clip, and the inner column never became a scroller. The page scrolled instead and
the bar, a flex sibling below the column, went with it. It was at the bottom of the
document rather than the bottom of the screen.

The height is `dvh`, not `vh`. On mobile Safari and Chrome `100vh` is the viewport
with the browser chrome retracted, which is taller than what you can see, so even a
correctly sized shell put the bar below the fold. A `vh` line stays as the fallback
for browsers without `dvh`.

The manager's sheet trigger is sticky for the same reason, offset by the fixed top
bar's height rather than to 0, so it does not come to rest underneath it.

**A route change starts at the top of the new screen.** A single page app keeps
scroll position, which is right for a back button and wrong for a nav tap: arriving
halfway down a list, past the Masthead, reads as a screen that failed to load.
`ScrollToTop` resets both scroll containers, because which one is live depends on
the register: framed roles scroll the content column and the window never moves,
full-bleed roles scroll the window. The jump is instant and never smoothed. A
smooth scroll on a route change animates content that is already gone, and
`prefers-reduced-motion` needs no case here because there is no motion to reduce.

**The sidebar stops floating.** It runs full height, flush to the left edge of the
shell, `--band-deep`, no radius on the outer edge. The floating rounded panel left
1280px of dead canvas below itself on long pages. It is chrome, so it should behave
like chrome.

The sidebar stays text only. The manager owns eight destinations, more than a
14 icon budget can label without repeating itself, and a column of near duplicate
icons beside a column of words earns nothing.

---

## 15. Icon budget: 14

Declared in `src/ui/icons.ts`. A fifteenth requires removing one.

```
home  calendar  file-text  package  message-square  user
map-pin  camera  check  chevron-right  chevron-down
search  alert-triangle  info
```

Inline icons render at text size in `currentColor`. An icon may sit in a rounded
chip on `--accent-soft` or `--surface-sunk`, in a band heading only, never inline
in prose.

---

## 16. Banned, trimmed to what still earns its place

| Banned | Instead |
|---|---|
| Emoji, anywhere, including in data | Nothing, or a budgeted icon |
| A 3px left rule as a status device | A tinted row ground. Section 4 |
| Tailwind `divide-{color}` | `[&>*+*]:border-t [&>*+*]:border-t-line`. Section 4 |
| A coloured dot with no label | Dot plus label, or a pill |
| Gradients in the interface | Flat fills. The wordmark is an asset, not chrome |
| Glassmorphism, blur panels | Flat fills |
| Centred body copy | Left aligned, ragged right |
| Decorative stock photography | Real content only |
| Illustrated empty states | One line, one action |
| Inverted content areas, dark mode | Dark bands around a light reading surface |
| A band nested inside a band | A `--line` rule and a `micro` label |
| More than two cards on a screen | Content directly on its band |
| Two elements at `hero` size | One hero, section 7 |
| A chart with no fill and no baseline | Section 12 |
| `600` font weight | 500 or 700 |
| Em-dashes in any UI copy | Comma, colon or full stop |
| A filled pill behind the active nav item | 2px rule above, weight 500. Section 14 |
| A button height derived from padding | The three fixed heights. Section 6 |
| An accent fill on a dark band | `--surface` fill, `--ink` label. Section 6 |
| A ghost outline as a screen's primary action | A filled control. Section 6 |
| A pressed state that transforms or lifts | Fill 12% darker, no movement. Section 6 |
| Disabled as reduced opacity | `--surface-sunk` fill, `--ink-3` label. Section 6 |
| A rule or divider inset on one edge only | Full bleed, or inset both sides to the gutter. Section 6 |
| A second left edge that is not the gutter | One gutter, section 6 |
| A status pill on the same ground as its band | A pill that contrasts. Section 4 |
| Pills on the exceptions only, bare text on the rest | Every row in the list gets one. Section 4 |
| A viewport breakpoint inside the device frame | Register-scoped, or no switch. Section 5 |
| A hero that rags to a single orphan word | Shorter copy, or an explicit break. Section 5 |
| Band headings at two different sizes | One step, `h1`. Section 5 |

Dropped from the old list, because the new rules cover them better or they were
never the problem: "full-width progress bars" (a numeric value is already the
rule), "three equal-weight cards in a row" (superseded by the two card ceiling and
the hero rule), "staggered load-in animation" (replaced by the motion policy in
section 9), "badging every AI touchpoint" (moved to copy rules, where it belongs).

---

## 17. Copy rules

Unchanged. These are working. "Nothing is needed from you, and you do not have to
be home" is real product writing and the voice should not move.

- Sentence case everywhere. Never Title Case, never ALL CAPS outside `micro`.
- Verb-first buttons: "Book a visit", not "Submit".
- An action keeps its name through the flow. "Approve quote" produces "Quote
  approved".
- Customers see plain language. Work order, entitlement, asset, case, lead and
  opportunity stay on internal surfaces.
- No filler: cut "simply", "just", "easily", "seamless", "unlock".
- Errors say what happened and what to do. No apology, no exception strings.
- Flo is never badged, never given a sparkle, and always cites its sources inline.
- Missing data is stated, never invented. The "Base geography not yet supplied"
  panel instead of a fabricated Québec outline is the standard everywhere.
- **No em-dashes.**

---

## 18. Per-brand notes

The token contract in `src/brands/` is unchanged in architecture: `applyBrand()`
flattens a `Brand` object to CSS custom properties, every component reads the
properties, and a brand switch requires zero component edits. Values change in
this rewrite. Keys are added, not removed, except `type.h2`.

Keys added: `bandDeep`, `bandDeepAlt`, `onBand`, `onBandMuted`, `accentOnBand`,
`fieldLine`, `data1`, `data2`, `data3`, `type.hero`, `type.heroLg`, `space` gains
64 and 96.

Keys removed: `type.h2`, `type.h2Lg` if present. `forest` and `onForest` are
renamed to `bandDeep` and `onBand`, which is a rename rather than a removal: the
forest block was always the Masthead, it just had no name for what it was.

**Run `Alt+Shift+N` on every screen touched.** Any component that visibly breaks
on the switch has a hardcoded value, and that is a bug in the component, not in the
brand. This check is the whole point of the contract, so run it deliberately.

### Reconciliation with `ASSETS.md`

`ASSETS.md` now exists and `REFERENCES.md` has been folded into it and deleted, so
there is one asset document rather than two, one of which described a folder layout
that never landed.

**Where the two documents disagree on colour, this one wins.** `ASSETS.md` section
8 records every disagreement individually. The summary: it specifies a next-brand
palette that was never implemented in `src/brands/next.ts`, including canvas
`#F4F5F1` and plum `#472836` as body ink, and its ratios are correct arithmetic on
values the running app does not hold. Section 4 here is computed against the
Broadsheet surface levels, which are darker than anything `ASSETS.md` assumed.

Two questions `ASSETS.md` raises are genuinely open and are the owner's call, not
mine:

1. **Plum as body ink, or plum as the second dark field.** It cannot be both
   without the page reading as a single hue. This document gives plum to
   `--band-deep-alt` and uses a neutral teal-black for ink. A large dark plum band
   earns more than plum body text does, but the call is yours.
2. **The next brand typeface is unspecified.** Plus Jakarta Sans is a placeholder
   in both brands and is the highest-value missing asset. Section 1 of this
   document explicitly bans substituting a serif on the strength of the Broadsheet
   metaphor, so the placeholder is safe until a type spec arrives.

What `ASSETS.md` contributes that this document defers to entirely: the handset
photograph geometry, measured in its section 7, the product-render-on-white
treatment rule, the photography scarcity rule, and the flag on the two portrait
contact sheets showing identifiable third-party people in another company's
branded shirts. That last one is a judgement to keep, not a constraint to work
around.

---

## 19. Enforcement

`scripts/audit-design.mjs` walks all 34 routes in both brands. It must be extended
for this direction, because the current checks would pass a wireframe:

| New check | Fails when |
|---|---|
| Hero present | No element renders at the `hero` step |
| Hero unique | More than one element at `hero`, or more than one other at `display` |
| Band count | Fewer than 3 or more than 6 bands |
| Adjacent grounds differ | Two consecutive bands share a background colour |
| Dark present | No element with ΔL\* below 30 covering 15% or more of the first viewport |
| Card ceiling | More than 2 cards |
| Surface separation | Any adjacent pair of painted grounds below ΔL\* 4 |
| Type distribution | More than 85% of characters at a single step |
| Chart anchoring | A line series with no area fill, or a plot under 240px tall |
| Blueprint delta | Canvas shift below ΔL\* 6 with Blueprint on |
| Nav has no fill | Any nav item has a background colour in its active state |
| Button geometry | A control whose height is not 48, 40 or 32, or whose label is not 15px/500 |
| No accent on dark | An accent-filled control inside a band with ΔL\* below 30 |
| Gutter unity | More than 3 distinct left edges, or a right edge not equal to the left gutter |
| One-sided inset | A border-bottom or border-top whose width is neither full bleed nor gutter-inset both sides |
| Band heading step | Two `h2` elements on a screen at different computed sizes |
| Reading sizes | More than 4 distinct sizes outside the 11px and 15px functional registers |
| Pill contrast | A status pill whose background equals its band's background |
| Hero rag | The hero's last line contains one word and the hero wraps |
| Framed breakpoints | A `md:` or `lg:` class inside a framed role that changes layout |

`scripts/audit-contrast.mjs` gains the L\* metric and every pair in section 4.

`scripts/measure-align.mjs` is the gutter instrument: given routes, it prints every
distinct left edge, every shared right edge, the distinct font sizes with counts, and
the computed size of every band heading. It is what turned "the alignment feels off"
into thirteen numbers, and it is how the gutter rule in section 6 is checked.

`scripts/export-copy.mjs` writes `docs/COPY.md` and `docs/COPY-strings.csv`: every
string the portal renders, by role, screen and band, plus a unique-strings list for
translation. It reads the running app rather than the source, because much of the
copy is assembled at render time (dates, counts, durations, the arrival line chosen
by work order status) and grepping JSX would export templates instead of sentences.
The CSV marks strings that come from `seedData.ts` as mock content, since a customer
name and a work order number are the same in every language.

**The dev-only gutter overlay.** `Alt+Shift+G` draws the left and right gutter
lines, the `gutter + 64` thumbnail text edge, and the band boundaries over the
running app, in both registers. It is gated on `import.meta.env.DEV` so it cannot
reach a production bundle. Reason it exists: alignment is the one class of defect
that is invisible when you already know what the layout is supposed to be, and
obvious to everyone else.
