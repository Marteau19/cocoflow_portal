/**
 * brands/legacy.ts
 *
 * The current Ecoflo identity, expressed in the Console direction. Default brand.
 *
 * This object is the complete token contract. Every visual value in the app
 * resolves from here to a CSS custom property. No component file contains a
 * hex value, a font stack, a radius or a duration.
 *
 * To add a brand: copy this file, change the values, keep every key.
 * If a key is missing, the brand switch will break at runtime rather than
 * silently falling back, which is deliberate.
 */

export interface Brand {
  id: string;
  label: string;

  color: {
    /** Page ground behind the cards. Tinted, so a white card lifts off it. */
    canvas: string;
    canvasBlueprint: string;
    /** Card and row ground. */
    surface: string;
    /** Table headers, inert zones, disabled fields. */
    surfaceSunk: string;
    /**
     * A card sitting on another card. The pattern is a sunk ground holding a
     * raised surface, which is why this is usually the same value as `surface`:
     * the separation comes from the shadow and the ground beneath, not from a
     * third shade of white.
     */
    surfaceRaised: string;

    /** The deep navigation ground. Chrome, not content. */
    sidebar: string;
    onSidebar: string;
    /** Inactive sidebar labels. */
    sidebarMuted: string;

    ink: string;
    ink2: string;
    ink3: string;
    line: string;
    lineStrong: string;

    /** The one inverted feature panel. Two places in V1. See DESIGN.md 2.3. */
    forest: string;
    onForest: string;

    accent: string;
    accentHover: string;
    onAccent: string;
    /** Accent as text on a light ground. Clears 4.5:1 where the fill does not. */
    accentInk: string;
    /** Tinted ground for icon chips and highlighted rows. */
    accentSoft: string;

    /**
     * Paired opposite outcomes: approve against decline, gained against lost.
     * Both are dark enough to work as a fill with `on-*` text and as text on a
     * light ground, so there is no separate ink variant.
     */
    positive: string;
    onPositive: string;
    positiveSoft: string;
    negative: string;
    onNegative: string;
    negativeSoft: string;

    warn: string;
    warnSoft: string;
    alert: string;
    alertSoft: string;
  };

  font: {
    sans: string;
    mono: string;
    /** Google Fonts families to load, in `Family:wght@...` form */
    webfonts: string[];
  };

  type: {
    display: TypeStep;
    h1: TypeStep;
    h2: TypeStep;
    body: TypeStep;
    caption: TypeStep;
    micro: TypeStep;
    /** Desktop overrides. Only these two steps change. */
    displayLg: TypeStep;
    h1Lg: TypeStep;
  };

  radius: {
    card: string;
    control: string;
    pill: string;
    /** The outer app shell and the sidebar. */
    shell: string;
  };

  space: number[];

  shadow: {
    /** Every card. The default resting state. */
    card: string;
    /** Hover, and a card on a card. */
    raised: string;
    /** Bottom sheets, modals, the device frame. */
    sheet: string;
  };

  motion: {
    state: string;
    sheet: string;
    ease: string;
  };

  logo: {
    /** Paths relative to /public. */
    wordmark: string;
    wordmarkOnDark: string;
    mark: string;
  };
}

export interface TypeStep {
  size: string;
  line: string;
  tracking: string;
  weight: 400 | 500 | 700;
  transform?: 'uppercase';
}

export const legacy: Brand = {
  id: 'legacy',
  label: 'Ecoflo, current',

  color: {
    // Deeper than the previous warm paper. The canvas is now a ground that
    // cards sit above rather than a page they are drawn on.
    canvas: '#F1EEE5',
    canvasBlueprint: '#EDEDE8',
    surface: '#FFFFFF',
    surfaceSunk: '#F4F1E9',
    surfaceRaised: '#FFFFFF',

    sidebar: '#16281C',
    onSidebar: '#F2F5F0',
    sidebarMuted: '#8FA396',

    ink: '#111A13',
    ink2: '#556057',
    ink3: '#828C84',
    line: '#E4E0D6',
    lineStrong: '#CFC9BC',

    forest: '#16281C',
    onForest: '#F2F5F0',

    accent: '#64A70B',
    // Hover lightens rather than darkens. The accent fill carries dark text,
    // because white on a saturated mid-tone brand colour cannot clear 4.5:1
    // without dulling the colour itself, so darkening on hover would walk the
    // label towards the ground instead of away from it.
    accentHover: '#74BD0D',
    onAccent: '#111A13',
    accentInk: '#3F6B07',
    accentSoft: '#EBF4DC',

    // A deeper, bluer green than the lime accent, on purpose: a positive
    // outcome must not be mistaken for the primary action.
    positive: '#1B6E45',
    onPositive: '#FFFFFF',
    positiveSoft: '#E1F0E8',
    negative: '#B3261E',
    onNegative: '#FFFFFF',
    negativeSoft: '#FBE7E5',

    warn: '#8A6210',
    warnSoft: '#FAF0DB',
    alert: '#96301D',
    alertSoft: '#FAE6E2',
  },

  font: {
    sans: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
    webfonts: ['Plus+Jakarta+Sans:wght@400;500;700', 'IBM+Plex+Mono:wght@400;500'],
  },

  type: {
    display: { size: '30px', line: '32px', tracking: '-0.02em', weight: 700 },
    h1: { size: '22px', line: '28px', tracking: '-0.01em', weight: 700 },
    h2: { size: '17px', line: '24px', tracking: '0', weight: 500 },
    body: { size: '15px', line: '22px', tracking: '0', weight: 400 },
    caption: { size: '13px', line: '18px', tracking: '0', weight: 400 },
    micro: { size: '11px', line: '14px', tracking: '0.08em', weight: 500, transform: 'uppercase' },
    displayLg: { size: '38px', line: '40px', tracking: '-0.02em', weight: 700 },
    h1Lg: { size: '26px', line: '32px', tracking: '-0.01em', weight: 700 },
  },

  radius: {
    card: '18px',
    control: '12px',
    pill: '999px',
    shell: '24px',
  },

  space: [8, 12, 16, 24, 32, 48],

  // Two layers each: a tight contact shadow that keeps the edge honest, and a
  // wide soft one that does the lifting. Tinted with the ink hue rather than
  // neutral black, so elevation reads as part of the palette.
  shadow: {
    card: '0 1px 2px rgba(17, 26, 19, 0.04), 0 10px 24px -8px rgba(17, 26, 19, 0.10)',
    raised: '0 2px 4px rgba(17, 26, 19, 0.05), 0 18px 36px -10px rgba(17, 26, 19, 0.16)',
    sheet: '0 4px 8px rgba(17, 26, 19, 0.06), 0 28px 72px -16px rgba(17, 26, 19, 0.28)',
  },

  motion: {
    state: '150ms',
    sheet: '220ms',
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
  },

  logo: {
    // PNG rather than SVG: the supplied asset in the reference folder is a
    // raster logo. The extension changes here, in the token file, so no
    // component has to know. Swap these values if a vector version lands.
    wordmark: '/brand/legacy/ecoflo-wordmark.png',
    wordmarkOnDark: '/brand/legacy/ecoflo-wordmark-light.png',
    mark: '/brand/legacy/ecoflo-mark.png',
  },
};

/**
 * Flattens a Brand into CSS custom properties on :root.
 * Called once at mount and again on every brand switch.
 */
export const applyBrand = (brand: Brand): void => {
  const r = document.documentElement.style;

  Object.entries(brand.color).forEach(([k, v]) => {
    r.setProperty(`--color-${kebab(k)}`, v);
  });

  r.setProperty('--font-sans', brand.font.sans);
  r.setProperty('--font-mono', brand.font.mono);

  Object.entries(brand.type).forEach(([k, step]) => {
    const n = kebab(k);
    r.setProperty(`--type-${n}-size`, step.size);
    r.setProperty(`--type-${n}-line`, step.line);
    r.setProperty(`--type-${n}-tracking`, step.tracking);
    r.setProperty(`--type-${n}-weight`, String(step.weight));
  });

  Object.entries(brand.radius).forEach(([k, v]) => r.setProperty(`--radius-${kebab(k)}`, v));
  brand.space.forEach((v, i) => r.setProperty(`--space-${i + 1}`, `${v}px`));
  Object.entries(brand.shadow).forEach(([k, v]) => r.setProperty(`--shadow-${kebab(k)}`, v));

  r.setProperty('--motion-state', brand.motion.state);
  r.setProperty('--motion-sheet', brand.motion.sheet);
  r.setProperty('--motion-ease', brand.motion.ease);
};

const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
