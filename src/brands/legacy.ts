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
    /**
     * Input and control outlines, held to 3:1 as a meaningful non-text control.
     * Separate from `line`, which is structural and only has to be perceptible.
     * Conflating them is why inputs read as unbordered.
     */
    fieldLine: string;

    /**
     * The dark grounds. Masthead, chrome, hero fields.
     *
     * Renamed from `forest`. The forest block was always the Masthead, it just
     * had no name for what it was, which is part of why it stayed rationed to
     * two screens instead of becoming the structure.
     */
    bandDeep: string;
    bandDeepAlt: string;
    onBand: string;
    onBandMuted: string;

    accent: string;
    accentHover: string;
    onAccent: string;
    /** Accent as text on a light ground. Clears 4.5:1 where the fill does not. */
    accentInk: string;
    /** Tinted ground for icon chips and highlighted rows. */
    accentSoft: string;
    /**
     * The accent on a dark band. Non-text only: in the new brand it reaches
     * 3.97:1 on teal, which clears the 3:1 graphic floor and not the 4.5:1 a
     * label needs. See DESIGN.md section 4.
     */
    accentOnBand: string;

    /**
     * Chart series, map marks, sparklines. Deliberately not the accent: the
     * accent is an invitation to click and a chart line is not clickable.
     */
    data1: string;
    data2: string;
    data3: string;

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

    /**
     * The fourth status. Neutral information: what a plan covers, what happens
     * next, what a figure is an estimate of.
     *
     * It exists because the build had three status colours and kept expressing
     * "this is information" as a `neutral` pill on the sunk ground, which is the
     * same ground as the Rail and Closing bands, so it disappeared. A status the
     * reader cannot see is not a status.
     *
     * A desaturated slate rather than a saturated blue. Neither identity owns a
     * blue, and a bright one would read as a fifth brand colour rather than as a
     * function colour.
     */
    info: string;
    onInfo: string;
    infoSoft: string;
  };

  font: {
    sans: string;
    mono: string;
    /** Google Fonts families to load, in `Family:wght@...` form */
    webfonts: string[];
  };

  type: {
    /** One per screen. See DESIGN.md section 7. */
    hero: TypeStep;
    display: TypeStep;
    h1: TypeStep;
    /**
     * Card and band headers. The step the scale was missing.
     *
     * Without it the reading scale ran 24 to 16 with nothing between, so every
     * heading below a band title collapsed onto `body` or `caption` and a screen
     * read as one large word above an undifferentiated field. It is register
     * independent by design: 19px is right in the handset and right on a console,
     * and promoting it would reopen the gap it exists to close.
     */
    section: TypeStep;
    body: TypeStep;
    caption: TypeStep;
    micro: TypeStep;
    /**
     * The full-bleed register. Applied by `[data-register='full']`, never by a
     * viewport media query: a framed role must keep the framed column at every
     * width or a 72px hero lands inside a 420px handset.
     */
    heroLg: TypeStep;
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
    route: string;
    role: string;
    count: string;
    ease: string;
    easeOut: string;
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
}

/*
  `transform: 'uppercase'` used to sit on this interface and on the `micro` step,
  and `applyBrand()` never wrote it to a custom property, so no element in the
  build was ever uppercased by it. Every eyebrow has always rendered sentence
  case with the wide tracking doing the work of separating it from body copy.

  It is removed rather than implemented. A token that silently does nothing is
  worse than no token, because a reader of this file believes the opposite of
  what the screen shows. And the direction is sentence case: uppercasing strips
  accents in some renderers, which in a French Quebec product turns a label into
  a spelling mistake.
*/

export const legacy: Brand = {
  id: 'legacy',
  label: 'Ecoflo, current',

  color: {
    // Surfaces are separated by CIE L* rather than by contrast ratio, because
    // ratio is dominated by the darker colour and cannot tell invisible from
    // fine between two paper whites. Floors: dL* 4 between adjacent levels,
    // dL* 6 for a hairline against its ground. Measured values in DESIGN.md 3.
    //
    // Note the order: surface is lightest, canvas sits below it, sunk below
    // that. The shipped build had sunk lighter than canvas, so the token named
    // sunk floated.
    surface: '#FFFFFF',
    canvas: '#EFE9DB',
    surfaceSunk: '#DFD8C6',
    surfaceRaised: '#FFFFFF',
    canvasBlueprint: '#C9D3D9',

    // The dark grounds. Legacy has one dark hue, so alt is a deeper green
    // rather than a second colour, and every composition has to work with that.
    bandDeep: '#16281C',
    bandDeepAlt: '#0B1710',
    onBand: '#F2F5F0',
    onBandMuted: '#A9BBAE',

    // Sidebar is chrome and shares the Masthead ground.
    sidebar: '#16281C',
    onSidebar: '#F2F5F0',
    sidebarMuted: '#A9BBAE',

    ink: '#141D16',
    ink2: '#4E5A50',
    // Metadata only, held to 3:1. Was #828C84, which measured 2.71:1 on the
    // corrected sunk level.
    ink3: '#6E7970',
    line: '#D8D0BD',
    lineStrong: '#BCB39C',
    fieldLine: '#847C68',

    accent: '#64A70B',
    // Hover lightens rather than darkens. The accent fill carries dark text,
    // because white on a saturated mid-tone brand colour cannot clear 4.5:1
    // without dulling the colour, so darkening would walk the label toward its
    // own ground.
    accentHover: '#74BD0D',
    onAccent: '#111A13',
    accentInk: '#375D06',
    accentSoft: '#E6F0D2',
    accentOnBand: '#8FCF23',

    data1: '#3F6B07',
    data2: '#16281C',
    data3: '#7A5610',

    // Function rather than identity, so both brands share these: an approval
    // has to read as an approval in either skin.
    positive: '#1B6E45',
    onPositive: '#FFFFFF',
    positiveSoft: '#DCEDE3',
    negative: '#B3261E',
    onNegative: '#FFFFFF',
    negativeSoft: '#F8E4E2',

    // Was #8A6210, which measured 4.36:1 on the new darker canvas.
    warn: '#7A5610',
    warnSoft: '#F4EAD2',
    alert: '#96301D',
    alertSoft: '#F6E3DE',

    info: '#2C5A73',
    onInfo: '#FFFFFF',
    infoSoft: '#DEE9EE',
  },

  font: {
    sans: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
    webfonts: ['Plus+Jakarta+Sans:wght@400;500;700', 'IBM+Plex+Mono:wght@400;500'],
  },

  type: {
    // The framed register: client and technician, inside the handset. These are
    // the base values, and they apply at every viewport width.
    hero: { size: '48px', line: '46px', tracking: '-0.035em', weight: 700 },
    display: { size: '32px', line: '34px', tracking: '-0.02em', weight: 700 },
    h1: { size: '24px', line: '30px', tracking: '-0.015em', weight: 700 },
    section: { size: '19px', line: '26px', tracking: '-0.01em', weight: 500 },
    body: { size: '16px', line: '25px', tracking: '0', weight: 400 },
    caption: { size: '13px', line: '19px', tracking: '0', weight: 400 },
    micro: { size: '11px', line: '14px', tracking: '0.08em', weight: 500 },
    // The full-bleed register: manager and global. Applied by attribute, not by
    // media query. See the interface comment.
    heroLg: { size: '72px', line: '68px', tracking: '-0.035em', weight: 700 },
    displayLg: { size: '42px', line: '44px', tracking: '-0.02em', weight: 700 },
    h1Lg: { size: '28px', line: '34px', tracking: '-0.015em', weight: 700 },
  },

  radius: {
    card: '12px',
    control: '8px',
    pill: '999px',
    shell: '24px',
  },

  // Gains 64 and 96: the old scale topped out too low to express band padding.
  space: [8, 12, 16, 24, 32, 48, 64, 96],

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
    /** Route change. Content fades and rises 12px. */
    route: '220ms',
    /**
     * The role switch, deliberately the longest transition in the app. It is the
     * one that carries an argument: the Masthead ground changing under an
     * unchanged customer name is "same record, new register" made visible.
     */
    role: '320ms',
    /** Hero count-up, first mount only. */
    count: '700ms',
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
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

  Object.entries(brand.motion).forEach(([k, v]) => r.setProperty(`--motion-${kebab(k)}`, v));
};

const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
