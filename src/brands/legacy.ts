/**
 * brands/legacy.ts
 *
 * The current Ecoflo identity. Default brand.
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
    canvas: string;
    canvasBlueprint: string;
    surface: string;
    surfaceSunk: string;
    ink: string;
    ink2: string;
    ink3: string;
    line: string;
    lineStrong: string;
    forest: string;
    onForest: string;
    accent: string;
    accentHover: string;
    onAccent: string;
    accentInk: string;
    warn: string;
    alert: string;
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
  };

  space: number[];

  shadow: {
    /** The only shadow in the system. Sheets, modals, device frame. */
    sheet: string;
  };

  motion: {
    state: string;
    sheet: string;
    ease: string;
  };

  logo: {
    /** Paths relative to /public. Overwritten when the brand folder lands. */
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
    canvas: '#FAF8F3',
    canvasBlueprint: '#F7F7F4',
    surface: '#FFFFFF',
    surfaceSunk: '#F2EFE7',
    ink: '#111A13',
    ink2: '#5B655D',
    ink3: '#8A928B',
    line: '#E4E0D6',
    lineStrong: '#CFC9BC',
    forest: '#16281C',
    onForest: '#F2F5F0',
    accent: '#64A70B',
    accentHover: '#588F0A',
    onAccent: '#FFFFFF',
    accentInk: '#3F6B07',
    warn: '#9A6B12',
    alert: '#96301D',
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
    card: '10px',
    control: '8px',
    pill: '999px',
  },

  space: [8, 12, 16, 24, 32, 48],

  shadow: {
    sheet: '0 8px 32px rgba(17, 26, 19, 0.10)',
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
  r.setProperty('--shadow-sheet', brand.shadow.sheet);
  r.setProperty('--motion-state', brand.motion.state);
  r.setProperty('--motion-sheet', brand.motion.sheet);
  r.setProperty('--motion-ease', brand.motion.ease);
};

const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
