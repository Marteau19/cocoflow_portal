# REFERENCES.md

The reference folder is not in the repository yet. The prototype is built to
absorb it without a rebuild. This file states exactly what to do when it arrives.

---

## Expected structure

```
/reference
  /brand-legacy      logo files, palette, typography for the current identity
  /brand-next        same, for the new identity
  /ui                screenshots of interfaces to match
  /content           any source documents for section content
```

Nothing here blocks the build. If the folder is absent, the prototype runs on the
legacy tokens already defined in `src/brands/legacy.ts`.

---

## When `/brand-*` lands

1. Copy logo assets to `/public/brand/legacy/` and `/public/brand/next/`, keeping
   the filenames already referenced in the brand token files. If the supplied
   filenames differ, rename the assets rather than editing component code.
2. Overwrite the values in `src/brands/next.ts`. Change values only. Keep every
   key.
3. Run the brand switch (`Alt+Shift+N`) on every screen.

**Any component that visibly breaks on the switch has a hardcoded value. That is
a bug, not a brand problem.** Fix the component, not the token file. This check
is the whole point of the token contract, so run it deliberately rather than
assuming it passes.

If the new brand changes more than colour and typography, the affected token
groups are `radius`, `space` and `motion`. They already exist as keys, so the
change stays inside `next.ts`.

---

## When `/ui` lands

Treat the screenshots as **specifications to match, not moodboard inspiration**.
Vague design direction is what produces generic output.

For each screenshot, extract and write down:
- the grid and gutter widths
- the type scale actually used, measured, not estimated
- how status and state are expressed
- what is deliberately absent

Then reconcile against `DESIGN.md`. Where a reference contradicts the design
system, **raise the conflict rather than silently picking one**. The design
system was set deliberately and a reference may have been supplied for a
different reason than the one assumed.

Do not import a pattern that appears on the banned list in DESIGN.md section 9
just because a reference screenshot uses it.

---

## When `/content` lands

Section content in `src/data/sections.ts` is currently authored from the
architecture context and the strategic plan. Real source documents may correct
it. Update the annotation text, keep the schema unchanged.

If a source document reveals a system of record, integration path or open
decision that contradicts an existing annotation, **flag it rather than
overwriting it**. A contradiction between the prototype and a source document is
useful information about the state of the architecture, and it is exactly the
kind of thing this prototype exists to surface.
