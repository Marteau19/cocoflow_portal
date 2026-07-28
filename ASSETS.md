# ASSETS.md

Reconciliation of `references/` against `DESIGN.md`. Written after the reference
folder landed. Read this alongside `DESIGN.md`, which remains normative except
where amended here.

Repository: `cocoflow_portal`. Reference paths are `references/brandings` and
`references/visual assets`. **The second folder name contains a space.** Quote it
in any shell command and prefer a build step that copies assets into
`/public/brand/` and `/public/media/` with hyphenated names rather than
referencing the space-bearing path directly.

---

## 1. The headline finding

The new brand is not a variation on the current one. It is a different system.

| | Legacy | Next |
|---|---|---|
| Wordmark | `ECOFLO`, all caps, geometric slab-ish sans | `ecoflo`, lowercase, geometric, linked `co` ligature |
| Primary | Green `#64A70B` (Pantone 369 C) | Orange `#F85E00` |
| Deep | Navy, from the Premier Tech system | Teal `#294D4A` |
| Light | none | Sage `#A3B19B` |
| Dark | none | Plum `#472836` |

The token architecture absorbed this without a structural change, which is the
outcome the contract was designed for. Every value below sits inside
`brands/next.ts`. No component needs editing.

---

## 2. Two bugs this surfaced in what was already shipped

Both are contrast failures that were shipped in the first pass. Both are fixed.

**`legacy.onAccent` was white on the Ecoflo green.** That measures **2.97:1**,
which fails AA at every threshold including large text. Now `#111A13` on green,
which measures **5.99:1**. The brand guide's white-on-green lockup is a logo
treatment at display size, not a rule for 15px button labels.

**`legacy.ink3` was `#8A928B`.** That measures **3.01:1** on canvas. It is the
token used for timestamps and metadata, which people do read. Now `#737A74` at
**4.15:1**.

---

## 3. Measured contrast, new palette

Every token in `next.ts` was verified before being written.

| Pair | Ratio | Verdict |
|---|---|---|
| White text on orange `#F85E00` | 3.19 | **fails body text** |
| Near-black `#221317` on orange | 5.62 | passes |
| Ink plum `#472836` on canvas `#F4F5F1` | 11.80 | passes |
| Secondary `#6B5560` on canvas | 6.20 | passes |
| Metadata `#7E7176` on canvas | 4.25 | passes |
| Accent text `#B03F00` on canvas | 5.39 | passes |
| `#EDF0EA` on teal `#294D4A` | 8.10 | passes |
| Sage `#A3B19B` on white | 2.25 | **line and surface only, never text** |

**The consequential one:** the primary button under the new brand is dark text on
orange, not white on orange. White fails. This is not a stylistic preference.

---

## 4. Amendments to DESIGN.md

### 4.1 The no-gradient rule

`DESIGN.md` section 9 bans gradients. Two of the four supplied wordmarks are
gradients. Per `REFERENCES.md`, the conflict is raised rather than silently
resolved. The resolution:

**The gradient is permitted inside the logo asset and nowhere else.** It is a
fixed brand artefact rendered from a supplied file. It does not license gradient
backgrounds, gradient buttons, gradient charts or gradient cards. The ban on
gradients as a *UI surface treatment* stands unchanged.

Portal chrome uses the **solid teal** wordmark on light surfaces and the
**knockout** on teal or orange. The gradient versions stay on marketing surfaces.
Rationale: a gradient wordmark in a persistent top bar competes with content on
every screen, and it renders badly at small sizes.

### 4.2 Canvas colour under the new brand

Legacy canvas is warm cream `#FAF8F3`. The new brand canvas is **sage-derived
`#F4F5F1`**, cooler and slightly green.

This is a deliberate divergence. Warm cream paired with a warm orange accent is
one of the most common palettes in generated interface output right now.
Pulling the canvas toward the sage in the supplied palette keeps the pairing
specific to this brand rather than to a default.

### 4.3 Ink colour under the new brand

Body text is the **plum `#472836`**, not a neutral near-black. It is the darkest
supplied colour, it measures 11.8:1, and warm dark text against sage and teal
reads as an identity rather than a default. Flagged `OPEN CALL 1` in `next.ts`
with a one-line reversal if you want neutral text instead.

### 4.4 Typeface under the new brand, unresolved

The wordmark is geometric with circular bowls and a linked `co`, closer to a
Futura or Poppins lineage than to Plus Jakarta Sans. **No UI typeface has been
specified for the new brand.** Plus Jakarta Sans is held as a placeholder and is
the only guessed token in the file. If the new brand carries a type spec, this is
the highest-value thing still missing.

---

## 5. Photography and product assets

### Available

| Asset | Use |
|---|---|
| `Septic_Tank.jpg` | Real installed Ecoflo lid, Premier Tech moulded mark visible. The single best asset in the set. Use on client `My system` and on the technician work order header. |
| `Nature_1.png`, `Nature_3.jpg` | Lakeside properties. Use once, on the prospect intake screen. Not as recurring chrome. |
| `part_1/2/3.png` | Product renders: green access lid, black vent cap, bolt assembly. Parts store and work order line items. |
| `Portaits.jpg` | Nine technician headshots, contact sheet. |

### Treatment rules

**Product renders sit on pure white.** On a cream or sage canvas that reads as a
visible white rectangle. Either knock the background out to transparent at build
time, or place each render on an explicit white tile with a 1px `--color-line`
border so the white is intentional rather than accidental. Do not drop them
straight onto the canvas.

**Photography stays scarce.** `DESIGN.md` section 7 permits real content only and
bans decorative imagery. Landscape photography is the marketing site's device.
In the portal it appears on the prospect intake screen and nowhere else. The
owner-state screens use the real system photo, not scenery.

### One flag on the portraits

`Portaits.jpg` shows nine identifiable people wearing shirts branded to what
appears to be a different company. For an internal prototype shown to leadership
that is a low risk, but it is not zero, and these images should not travel into
anything shared outside PTWE. Safer default for the prototype: use initials in a
circle for technician identity, and reserve one real portrait for Marc Bouchard
on the hero screens where a human face carries the emotional weight. That keeps
the demo effective without seeding a set of third-party faces through 34 screens.

---

## 6. What to do next in the repo

1. Export both wordmarks to SVG. The supplied files are PNG at 1550px wide, which
   will render soft in a 32px-high top bar. Filenames expected by the token files:
   - `/public/brand/legacy/ecoflo-wordmark.svg`
   - `/public/brand/legacy/ecoflo-wordmark-light.svg`
   - `/public/brand/next/ecoflo-teal.svg`
   - `/public/brand/next/ecoflo-knockout.svg`
2. Copy photography to `/public/media/` with hyphenated names.
3. Knock out the product render backgrounds, or accept the white-tile treatment.
4. Run the brand switch on every screen once pass 1 lands. Under the new brand
   the accent is loud, so anything that was quietly leaning on the green being
   soft will announce itself immediately. That is the point of running it.
