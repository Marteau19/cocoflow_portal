/**
 * brands/next.ts
 *
 * The new Ecoflo identity. Reachable with Alt+Shift+N or ?brand=next.
 *
 * The palette is read off the artboards in `references/brandings/New`:
 *
 *   orange  #F85E00   the accent
 *   teal    #294D4A   the navigation ground
 *   plum    #472836   the inverted feature panel
 *   sage    #A3B19B   structural lines and muted grounds
 *
 * Those four are the whole identity. Everything else in this file is derived
 * from them: the canvas is sage taken almost to white, the ink is teal taken
 * almost to black, `accentInk` is the orange pushed dark enough to clear 4.5:1
 * as text, and each `-soft` value is its parent lifted to a tint.
 *
 * Positive, negative, warn and alert are not in the brand palette. They are
 * function rather than identity, so both brands share them: an approval must
 * read as an approval in either skin.
 *
 * Keep every key. A missing key breaks the switch at runtime by design.
 */

import type { Brand } from './legacy';

export const next: Brand = {
  id: 'next',
  label: 'Ecoflo, new',

  color: {
    // Canvas is sage taken almost to white, ink is teal taken almost to black.
    surface: '#FFFFFF',
    canvas: '#E9EDE5',
    surfaceSunk: '#D7DFD1',
    surfaceRaised: '#FFFFFF',
    canvasBlueprint: '#C7D2D9',

    // Teal is the Masthead. Plum is the second dark field, which is why it is
    // not also the body ink: one hue cannot be both a large ground and the text
    // on it without the page collapsing to a single colour. See ASSETS.md 8.2,
    // where this is recorded as an open call.
    bandDeep: '#294D4A',
    bandDeepAlt: '#472836',
    onBand: '#EFF4F1',
    onBandMuted: '#A6BAB6',

    sidebar: '#294D4A',
    onSidebar: '#EFF4F1',
    sidebarMuted: '#A6BAB6',

    ink: '#17231F',
    ink2: '#4B5A54',
    ink3: '#6C7A74',
    line: '#CFD8C8',
    // Sage at full strength. It is a structural colour in this identity.
    lineStrong: '#A3B19B',
    fieldLine: '#73817C',

    accent: '#F85E00',
    accentHover: '#FF7A28',
    onAccent: '#1B2A27',
    accentInk: '#9A3A00',
    accentSoft: '#FCE6D8',
    // 3.97:1 on teal. Graphics only, never a label. DESIGN.md section 4 rule 3.
    accentOnBand: '#FF8A3D',

    data1: '#AC4100',
    data2: '#294D4A',
    data3: '#472836',

    positive: '#1B6E45',
    onPositive: '#FFFFFF',
    positiveSoft: '#DCEDE3',
    negative: '#B3261E',
    onNegative: '#FFFFFF',
    negativeSoft: '#F8E4E2',

    warn: '#7A5610',
    warnSoft: '#F4EAD2',
    alert: '#96301D',
    alertSoft: '#F6E3DE',

    // Pulled a step toward the teal so it sits inside this identity rather than
    // beside it. Same role and same contrast behaviour as the legacy value.
    info: '#2A5668',
    onInfo: '#FFFFFF',
    infoSoft: '#DCE8ED',
  },

  font: {
    // The artboards are set in a grotesque close enough to Plus Jakarta Sans
    // that changing typeface would be a guess rather than a reading. The
    // typeface stays until the brand guide names one.
    sans: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
    webfonts: ['Plus+Jakarta+Sans:wght@400;500;700', 'IBM+Plex+Mono:wght@400;500'],
  },

  type: {
    hero: { size: '48px', line: '46px', tracking: '-0.035em', weight: 700 },
    display: { size: '32px', line: '34px', tracking: '-0.02em', weight: 700 },
    h1: { size: '24px', line: '30px', tracking: '-0.015em', weight: 700 },
    section: { size: '19px', line: '26px', tracking: '-0.01em', weight: 500 },
    body: { size: '16px', line: '25px', tracking: '0', weight: 400 },
    caption: { size: '13px', line: '19px', tracking: '0', weight: 400 },
    micro: { size: '11px', line: '14px', tracking: '0.08em', weight: 500 },
    heroLg: { size: '72px', line: '68px', tracking: '-0.035em', weight: 700 },
    displayLg: { size: '42px', line: '44px', tracking: '-0.02em', weight: 700 },
    h1Lg: { size: '28px', line: '34px', tracking: '-0.015em', weight: 700 },
  },

  // Both brands now share the card and control radii. The new mark is built on a
  // squared, softly rounded counter, so the tighter corner was always closer to
  // this identity than to legacy; legacy came down to meet it rather than the
  // other way round. Shell stays per brand, because that is the device and the
  // sidebar rather than content.
  radius: {
    card: '12px',
    control: '8px',
    pill: '999px',
    shell: '22px',
  },

  space: [8, 12, 16, 24, 32, 48, 64, 96],

  shadow: {
    card: '0 1px 2px rgba(27, 42, 39, 0.04), 0 10px 24px -8px rgba(27, 42, 39, 0.10)',
    raised: '0 2px 4px rgba(27, 42, 39, 0.05), 0 18px 36px -10px rgba(27, 42, 39, 0.16)',
    sheet: '0 4px 8px rgba(27, 42, 39, 0.06), 0 28px 72px -16px rgba(27, 42, 39, 0.28)',
  },

  motion: {
    state: '150ms',
    sheet: '220ms',
    /** Route change. Content fades and rises 12px. */
    route: '180ms',
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
    // Extracted from the artboards: the gradient wordmark for light grounds,
    // the reversed white wordmark for dark ones, and the leading letter as a
    // standalone mark. The gradient lives inside the asset, which is why
    // DESIGN.md bans gradients in chrome but not here.
    wordmark: '/brand/next/ecoflo-wordmark.png',
    wordmarkOnDark: '/brand/next/ecoflo-wordmark-light.png',
    mark: '/brand/next/ecoflo-mark.png',
  },
};
