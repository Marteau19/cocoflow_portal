# ASSETS.md

Reconciliation of `references/` against `DESIGN.md`. Read this alongside
`DESIGN.md`, which remains normative except where amended here.

**`REFERENCES.md` has been folded into this file and deleted.** It described an
expected `/reference` folder layout that does not match what landed, so
maintaining both meant maintaining one document that was wrong. Its still useful
content, the intake workflow for new reference material, is section 9 below.

**Authority, where this file and `DESIGN.md` disagree on colour.** `DESIGN.md`
section 4 wins. It was rewritten for the Broadsheet direction with every pair
computed and the ratio recorded, against surface levels that this file predates.
The specific supersessions are listed in section 8, which also records where this
file describes token values that were never actually implemented.

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
gradients. Per the intake rule in section 9, the conflict is raised rather than silently
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

---

## 7. The handset photograph, measured

**The blank iPhone landed** as `references/visual assets/photo-1695973056909-67189edc1c9e.avif`.
The Unsplash-style filename is why it was not recognised as the handset for two
rounds: nothing about the name says phone. Renaming it on copy into `/public/media/`
is the fix, and it is the reason the treatment rule in section 5 asks for
hyphenated, meaningful names.

It is a genuine iPhone 15 Pro render. The screen aspect measures **2.170** against
the true 2.168, so the geometry can be trusted rather than eyeballed.

Source is 3000x2000, heif in an `.avif` container. Backdrop is flat `#EEEEEE`.

### Measured geometry

Found by scanning luminance transitions across the midlines, not estimated.

| Feature | Pixels, in the 3000x2000 source | As a fraction of the whole image |
|---|---|---|
| Handset outer edge | x 1137 to 1869, y 252 to 1772 | 733 x 1520 |
| **Screen** | x 1166.5 to 1840.5, y 281.5 to 1743.5 | left **38.883%**, top **14.075%**, width **22.467%**, height **73.100%** |
| Screen aspect | 1462 / 674 | **2.170** |
| Dynamic Island | y 302 to 362 at screen centre | 20px into the screen, 60px tall, so top **1.37%** and height **4.10%** of screen height |
| Screen corner radius | approx 32px at 674px screen width | **4.7%** of screen width, expressed in CSS as `border-radius: 4.7% / 2.17%` so the corner stays circular on a non-square box |

Those four screen percentages are what `DEVICE.screen` in
`src/shell/DeviceFrame.tsx` takes. They are percentages rather than pixels
deliberately, so the composite holds at any rendered size.

### The backdrop has to be knocked out

The instruction was to keep the whole image including its shadow, and to drop the
off-white background. Those pull against each other: a hard threshold that removes
`#EEEEEE` also removes the soft shadow, because the shadow *is* darkened backdrop.

The approach that satisfies both:

1. Build the handset silhouette as a rounded rectangle from the measured outer
   edge, corner radius about 88px at this scale, and set alpha to opaque inside it.
2. Outside the silhouette, derive alpha from how much darker each pixel is than the
   flat backdrop, `alpha = clamp((238 - L) * 3, 0, 255)`. Flat backdrop goes fully
   transparent, and the shadow survives as a real alpha gradient.
3. Trim to the alpha bounding box and write a PNG to `/public/media/`.

Step 2 is the part a naive knockout gets wrong. It is worth doing properly, because
the shadow is the thing that makes the handset sit on the page rather than float
above it, and it is specifically what the brief asked to keep.

---

## 8. Where this file and the token files disagree

Recorded rather than silently reconciled, per the intake rule in section 9. Three
categories.

### 8.1 Values this file specifies that were never implemented

`src/brands/next.ts` on `main` does not contain these. No commit ever set them.

| This file says | Token file actually holds |
|---|---|
| next canvas `#F4F5F1` | `#F0F2EC` |
| next ink, plum `#472836` | `#1B2A27` |
| next ink2 `#6B5560` | `#4B5A54` |
| next ink3 `#7E7176` | `#7C8C88` |
| next accent text `#B03F00` | `#AC4100` |
| next on-accent `#221317` | `#1B2A27` |
| legacy ink3 "now `#737A74`" | `#828C84` |

The section 3 ratios in this file were therefore computed against a palette that
was specified but not built. They are correct arithmetic on the values named here,
and they do not describe the running app.

**Resolution: `DESIGN.md` section 4 supersedes all of the above.** Its palette is
computed against the Broadsheet surface levels, which are darker than anything this
file assumed, and every pair is recorded with its measured ratio and its floor. Two
of the failures this file flagged are genuinely fixed there: `legacy.onAccent` is
dark ink on green at 5.99:1, and `ink-3` clears its 3:1 metadata floor on all three
light grounds.

### 8.2 Two open calls this file raises that are still open

Both are yours, not mine, and neither is blocking:

1. **Next brand ink, plum or neutral.** This file argues for plum `#472836` as body
   text at 11.8:1. `DESIGN.md` uses a neutral teal-black `#17231F` at 13.66:1 and
   gives plum a different job, `--band-deep-alt`, the second dark field. Plum cannot
   be both the body text colour and a large dark ground without the page reading as
   one hue. **Pick one.** My recommendation is the `DESIGN.md` split, because a
   large dark plum band earns more than plum body text does.
2. **Next brand typeface, unspecified.** Plus Jakarta Sans is a placeholder in both
   brands. This file correctly calls it the highest-value missing item. It stays a
   placeholder until a type spec arrives, and `DESIGN.md` section 1 now bans
   substituting a serif on the strength of the Broadsheet metaphor.

### 8.3 Paths in this file that do not exist yet

| Named here | Reality |
|---|---|
| `Septic_Tank.jpg` | Actual filename is `Septic Tank.jpg`, with a space |
| `/public/media/` | Does not exist. Nothing has been copied out of `references/` yet |
| `ecoflo-teal.svg`, `ecoflo-knockout.svg` | Token files point at `/brand/next/ecoflo-wordmark.png` and `-light.png`, extracted from the artboards |
| Wordmarks as SVG | Still PNG. The soft-rendering concern in section 6 is valid and unaddressed |

### 8.4 A second portrait contact sheet landed

`references/visual assets/09214cd78a78230aef8df468788ac2f8.jpg` is a 4x4 grid of
15 headshots, better balanced than `Portaits.jpg` at 3 women to 11 men, shot
against the same hedge.

**The same flag as section 5 applies, and slightly harder.** The sixteenth tile of
the grid is another company's logo mark, which identifies the source. These are
identifiable third-party people and the file should not travel outside PTWE.

The recommendation in section 5 stands and is what the build does: initials in a
circle by default, one real portrait for Marc Bouchard where a face carries the
emotional weight, which is the client home and the work order. Fifteen more faces
does not change that, it just makes it more tempting.

---

## 9. Intake workflow for new reference material

Folded in from `REFERENCES.md`, corrected to the real folder layout.

### The actual layout

```
references/
  brandings/
    New/            five artboards, the new identity
    Old/            legacy logo plus the PDF brand guideline
  visual assets/    photography, product renders, portraits, the handset
```

Not the `/reference/{brand-legacy,brand-next,ui,content}` layout `REFERENCES.md`
described. If a future drop uses a different shape, correct this section rather
than adding a second document.

### When brand material lands

1. Copy logo assets to `/public/brand/legacy/` and `/public/brand/next/`, keeping
   the filenames the token files already reference. **If the supplied filenames
   differ, rename the assets rather than editing component code.**
2. Overwrite values in `src/brands/*.ts`. Change values only, keep every key.
3. Run the brand switch, `Alt+Shift+N`, on every screen.

**Any component that visibly breaks on the switch has a hardcoded value. That is a
bug in the component, not a brand problem.** Fix the component. This check is the
whole point of the token contract, so run it deliberately rather than assuming it
passes.

### When interface references land

Treat screenshots as **specifications to match, not moodboard inspiration**. Vague
direction is what produces generic output. For each one, write down the grid and
gutters, the type scale measured rather than estimated, how status is expressed,
and what is deliberately absent.

Then reconcile against `DESIGN.md`. **Where a reference contradicts the design
system, raise the conflict rather than silently picking one.** Do not import a
pattern from section 16 of `DESIGN.md` just because a reference uses it.

One caution learned the hard way: a compositional reference is not a styling
reference. `DESIGN.md` section 1 sets out the limit for the Broadsheet metaphor,
and the same discipline applies to any screenshot supplied later.

### When content lands

Section content in `src/data/sections.ts` is authored from the architecture context
and the strategic plan. Real source documents may correct it. Update the annotation
text, keep the schema.

**If a source document reveals a system of record, integration path or open
decision that contradicts an existing annotation, flag it rather than overwriting
it.** A contradiction between the prototype and a source document is useful
information about the state of the architecture, and it is exactly the kind of
thing this prototype exists to surface.
