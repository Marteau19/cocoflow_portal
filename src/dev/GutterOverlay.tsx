/**
 * dev/GutterOverlay.tsx
 *
 * A dev-only overlay that draws the content gutters over the running app.
 * Alt+Shift+G toggles it. DESIGN.md sections 6 and 19.
 *
 * Why this exists. Alignment is the one class of defect that is invisible to
 * whoever built the screen, because they already know where the edges are meant to
 * be, and immediately obvious to everyone else. The build shipped with thirteen
 * distinct left edges on `/route` and twelve on `/parts` while passing every
 * automated check, because nothing was measuring horizontal position.
 *
 * `scripts/measure-align.mjs` reports the same information as numbers in CI. This
 * is the version you can look at, which is what you want while moving an element
 * rather than after.
 *
 * Gated on `import.meta.env.DEV`, and the module is only imported behind that
 * check in AppShell, so Rollup drops it from the production bundle entirely.
 */

import { useEffect, useState } from 'react';

/** The measured geometry of one content column. */
interface Column {
  left: number;
  width: number;
  gutter: number;
  /** Band edges, as offsets from the top of the document. */
  bands: { top: number; height: number; kind: string }[];
}

const read = (): Column | null => {
  // Inside a framed role the content column is the device screen, not the
  // viewport. Measuring against the window is what produced the bug this overlay
  // is here to catch, so the overlay must not repeat it.
  const host =
    document.querySelector<HTMLElement>('[data-content-column]') ??
    document.querySelector<HTMLElement>('main');
  if (!host) return null;

  const box = host.getBoundingClientRect();
  // The gutter is register-scoped, so read it from an element inside the register
  // rather than from :root.
  const scope = host.querySelector<HTMLElement>('[data-register]') ?? host;
  const gutter = parseFloat(getComputedStyle(scope).getPropertyValue('--gutter')) || 0;

  const bands = [...host.querySelectorAll<HTMLElement>('[data-band]')].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top - box.top,
      height: r.height,
      kind: el.dataset.band ?? '',
    };
  });

  return { left: box.left, width: box.width, gutter, bands };
};

export const GutterOverlay = () => {
  const [on, setOn] = useState(false);
  const [col, setCol] = useState<Column | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.code === 'KeyG') {
        event.preventDefault();
        setOn((previous) => !previous);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Re-measure while visible. Bands move as content loads and as the window
  // resizes, and a stale overlay is worse than none: it would show alignment that
  // is not there.
  useEffect(() => {
    if (!on) return;
    const tick = () => setCol(read());
    tick();
    const id = window.setInterval(tick, 250);
    window.addEventListener('resize', tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('resize', tick);
    };
  }, [on]);

  if (!on || !col) return null;

  const { left, width, gutter } = col;
  // The text edge of a row that leads with a 48px thumbnail: gutter + 48 + 16.
  const thumb = gutter + 64;

  const line = (x: number, colour: string, label: string, fromRight = false) => (
    <div
      key={`${label}-${x}`}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [fromRight ? 'right' : 'left']: x,
        width: 1,
        background: colour,
      }}
    >
      <span
        style={{
          position: 'sticky',
          top: 4,
          display: 'block',
          marginLeft: fromRight ? -46 : 3,
          font: '500 9px/1.2 ui-monospace, monospace',
          letterSpacing: '0.06em',
          color: colour,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        left,
        width,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      {/* The gutter pair. Left and right must be equal: DESIGN.md section 6. */}
      {line(gutter, 'rgba(220, 40, 90, 0.75)', `L ${gutter}`)}
      {line(gutter, 'rgba(220, 40, 90, 0.75)', `R ${gutter}`, true)}

      {/* The thumbnail text edge, the only other left edge a row may use. */}
      {line(thumb, 'rgba(30, 120, 220, 0.55)', `thumb ${thumb}`)}

      {/* Band boundaries, so the vertical rhythm is visible at the same time. */}
      {col.bands.map((band, index) => (
        <div
          key={`${band.kind}-${index}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: band.top,
            height: band.height,
            borderTop: '1px dashed rgba(20, 160, 90, 0.55)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: 2,
              top: 2,
              font: '500 9px/1.2 ui-monospace, monospace',
              letterSpacing: '0.06em',
              color: 'rgba(20, 140, 80, 0.9)',
            }}
          >
            {band.kind}
          </span>
        </div>
      ))}

      <div
        style={{
          position: 'fixed',
          left: 8,
          bottom: 8,
          padding: '4px 8px',
          background: 'rgba(20, 20, 20, 0.85)',
          color: '#fff',
          borderRadius: 4,
          font: '500 10px/1.3 ui-monospace, monospace',
        }}
      >
        gutter {gutter}px, column {Math.round(width)}px, {col.bands.length} bands. Alt+Shift+G
      </div>
    </div>
  );
};
