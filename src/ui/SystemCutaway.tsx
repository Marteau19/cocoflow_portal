/**
 * ui/SystemCutaway.tsx
 *
 * The Ecoflo, drawn.
 *
 * A homeowner has never seen the thing they own. It went into the ground before
 * they moved in, or on a day they were at work, and from that moment it is a
 * green lid in the lawn. Every other screen in this product talks about filter
 * media, an effluent pump and an inspection lid as though the reader has a
 * picture of them, and until now the reader had nothing.
 *
 * Drawn rather than photographed, for the same reasons the device frame is: it
 * is resolution independent, it carries no asset weight, and it can be themed.
 * A photograph of a septic tank is also a photograph of somebody else's septic
 * tank, and the whole point here is that this is theirs.
 *
 * Schematic rather than realistic. The design language is hairlines and flat
 * grounds with no gradients, and a rendered 3D tank would be the loudest thing
 * in the product by a wide margin. What a reader needs is which part is where
 * and what each one does, and a diagram answers that better than a render.
 *
 * Colour comes through `var(--color-*)` on the SVG attributes rather than
 * through Tailwind, because Tailwind's fill and stroke utilities are not in this
 * config and adding them to paint one illustration would be a wider change than
 * the illustration. It is still tokens, it still switches with the brand, and
 * there is still no hex in this file.
 */

import { useEffect, useState } from 'react';
import { t } from '../i18n';
import { usePrefersReducedMotion } from './motion';

export type CutawayLayer = 'lid' | 'media' | 'pump';

const LAYERS: CutawayLayer[] = ['lid', 'media', 'pump'];

/**
 * The media life ring.
 *
 * A ring rather than a bar because it sits beside a figure and reads as a dial
 * around it, and because a bar at zero is an empty rectangle that looks like a
 * component that failed to load. At zero this still draws its full track, so the
 * shape is always legible as a gauge.
 *
 * `strokeDasharray` on a circle, offset animated by a CSS transition rather than
 * by a frame loop: it is one property on one element and the compositor can do
 * it without touching the main thread. It fills once, on mount, and not at all
 * when the reader has asked for less movement.
 */
const Ring = ({ percent, label }: { percent: number; label: string }) => {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? percent : 0);

  useEffect(() => {
    if (reduced) {
      setShown(percent);
      return;
    }
    // One frame late, so the transition has a from-value to animate out of.
    const frame = requestAnimationFrame(() => setShown(percent));
    return () => cancelAnimationFrame(frame);
  }, [percent, reduced]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      viewBox="0 0 72 72"
      className="h-avatar-hero w-avatar-hero shrink-0"
      role="img"
      aria-label={label}
    >
      {/*
        The track is a hairline colour, not a sunk fill.

        Drawn in `--surface-sunk` it was exactly the ground of the Rail band it
        sits on, so at zero remaining, where the arc has no length to draw, the
        whole ring was invisible and the figure beside it had nothing to belong
        to. That is the third instance of this same mistake in this build, after
        the neutral status pill and the neutral icon chip: a tinted ground is
        only a ground if something behind it is a different one.
      */}
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="var(--color-line-strong)"
        strokeWidth="6"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - shown / 100)}
        // Rotated so it starts at twelve o'clock rather than at three.
        transform="rotate(-90 36 36)"
        style={{
          transition: reduced ? 'none' : 'stroke-dashoffset var(--motion-count) var(--motion-ease-out)',
        }}
      />
    </svg>
  );
};

/**
 * The cross section.
 *
 * One `<button>` per named layer, so the diagram is operable by keyboard and
 * announces itself, rather than being an image with click handlers bolted on.
 * The selected layer is drawn in the accent and the rest step back, which is the
 * whole interaction: tap a part, read what it does.
 */
export const SystemCutaway = ({
  selected,
  onSelect,
}: {
  selected: CutawayLayer | null;
  onSelect: (layer: CutawayLayer) => void;
}) => {
  const fill = (layer: CutawayLayer, base: string) =>
    selected === layer ? 'var(--color-accent-soft)' : base;
  const stroke = (layer: CutawayLayer) =>
    selected === layer ? 'var(--color-accent-ink)' : 'var(--color-line-strong)';

  return (
    <svg
      viewBox="0 0 320 210"
      className="h-auto w-full"
      role="group"
      aria-label={t('system.cutaway.title')}
    >
      {/* Ground above the tank shoulders, and the grade line. */}
      <rect x="0" y="0" width="320" height="46" fill="var(--color-surface-sunk)" />
      <line x1="0" y1="46" x2="320" y2="46" stroke="var(--color-line-strong)" strokeWidth="1" />

      {/* The inlet, from the house. */}
      <line x1="0" y1="70" x2="62" y2="70" stroke="var(--color-line-strong)" strokeWidth="4" />

      {/* The tank shell. */}
      <rect
        x="60"
        y="46"
        width="200"
        height="150"
        rx="10"
        fill="var(--color-surface)"
        stroke="var(--color-line-strong)"
        strokeWidth="1.5"
      />

      {/* The outlet, to the field. */}
      <line x1="258" y1="176" x2="320" y2="176" stroke="var(--color-line-strong)" strokeWidth="4" />

      {/* ---------------------------------------------------------------- */}
      {/* Filter media. The bed of coconut husk, and the reason for a plan. */}
      {/* ---------------------------------------------------------------- */}
      <g onClick={() => onSelect('media')} style={{ cursor: 'pointer' }}>
        <rect
          x="72"
          y="92"
          width="176"
          height="66"
          rx="4"
          fill={fill('media', 'var(--color-canvas)')}
          stroke={stroke('media')}
          strokeWidth="1.5"
        />
        {/*
          The husk, as short strokes rather than a texture fill or a pattern.
          A pattern would need an id, and two of these on one page would collide;
          eighteen line elements cost less than that problem.
        */}
        {Array.from({ length: 18 }, (_, i) => {
          const x = 82 + (i % 9) * 20;
          const y = 106 + Math.floor(i / 9) * 26;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + 10}
              y2={y + 7}
              stroke={selected === 'media' ? 'var(--color-accent-ink)' : 'var(--color-line-strong)'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Inspection lid. The only part of this a homeowner ever sees.     */}
      {/* ---------------------------------------------------------------- */}
      <g onClick={() => onSelect('lid')} style={{ cursor: 'pointer' }}>
        <rect
          x="134"
          y="30"
          width="52"
          height="18"
          rx="4"
          fill={fill('lid', 'var(--color-band-deep)')}
          stroke={stroke('lid')}
          strokeWidth="1.5"
        />
        <line
          x1="146"
          y1="39"
          x2="174"
          y2="39"
          stroke={selected === 'lid' ? 'var(--color-accent-ink)' : 'var(--color-on-band)'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Effluent pump. What moves treated water out to the field.        */}
      {/* ---------------------------------------------------------------- */}
      <g onClick={() => onSelect('pump')} style={{ cursor: 'pointer' }}>
        <rect
          x="140"
          y="164"
          width="40"
          height="24"
          rx="4"
          fill={fill('pump', 'var(--color-surface-sunk)')}
          stroke={stroke('pump')}
          strokeWidth="1.5"
        />
        <circle
          cx="160"
          cy="176"
          r="6"
          fill="none"
          stroke={selected === 'pump' ? 'var(--color-accent-ink)' : 'var(--color-ink3)'}
          strokeWidth="1.5"
        />
      </g>

      {/*
        The hit targets, last so they sit above everything, and transparent so
        they change nothing visually. Each is at least 44px tall in the rendered
        size at the widths this is used at, which is what the drawn shapes
        themselves cannot promise: the lid is 18 units tall.
      */}
      {LAYERS.map((layer) => {
        const box = {
          lid: { x: 120, y: 20, width: 80, height: 32 },
          media: { x: 66, y: 86, width: 188, height: 78 },
          pump: { x: 128, y: 160, width: 64, height: 36 },
        }[layer];
        return (
          <rect
            key={layer}
            {...box}
            fill="transparent"
            role="button"
            tabIndex={0}
            aria-pressed={selected === layer}
            aria-label={t(`system.cutaway.${layer}` as Parameters<typeof t>[0])}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(layer)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(layer);
              }
            }}
          />
        );
      })}
    </svg>
  );
};

export { Ring as MediaLifeRing };
