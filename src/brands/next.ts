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
    canvas: '#F0F2EC',
    canvasBlueprint: '#ECEFEC',
    surface: '#FFFFFF',
    surfaceSunk: '#F2F4EE',
    surfaceRaised: '#FFFFFF',

    // Teal. The dark frame around the light workspace.
    sidebar: '#294D4A',
    onSidebar: '#F1F5F2',
    sidebarMuted: '#93AAA6',

    ink: '#1B2A27',
    ink2: '#4E605C',
    ink3: '#7C8C88',
    line: '#DFE4DA',
    // Sage, used at full strength. It is a structural colour in this identity,
    // not a decorative one.
    lineStrong: '#A3B19B',

    // Plum, not teal. The feature panel has to separate from the sidebar, and
    // giving it the fourth brand colour is what stops the two dark grounds
    // reading as the same surface interrupted by content.
    forest: '#472836',
    onForest: '#F7EFF1',

    accent: '#F85E00',
    // Lightens on hover, for the reason given in legacy.ts: the fill carries
    // dark text, so the hover state has to move away from it.
    accentHover: '#FF7A28',
    onAccent: '#1B2A27',
    accentInk: '#AC4100',
    accentSoft: '#FFEBDD',

    positive: '#1B6E45',
    onPositive: '#FFFFFF',
    positiveSoft: '#E2F0E9',
    negative: '#B3261E',
    onNegative: '#FFFFFF',
    negativeSoft: '#FBE7E5',

    warn: '#8A6210',
    warnSoft: '#F9EFD9',
    alert: '#A33122',
    alertSoft: '#FAE6E3',
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
    display: { size: '30px', line: '32px', tracking: '-0.02em', weight: 700 },
    h1: { size: '22px', line: '28px', tracking: '-0.01em', weight: 700 },
    h2: { size: '17px', line: '24px', tracking: '0', weight: 500 },
    body: { size: '15px', line: '22px', tracking: '0', weight: 400 },
    caption: { size: '13px', line: '18px', tracking: '0', weight: 400 },
    micro: { size: '11px', line: '14px', tracking: '0.08em', weight: 500, transform: 'uppercase' },
    displayLg: { size: '38px', line: '40px', tracking: '-0.02em', weight: 700 },
    h1Lg: { size: '26px', line: '32px', tracking: '-0.01em', weight: 700 },
  },

  // The new mark is built on a squared, softly rounded counter, so this brand
  // runs slightly tighter corners than legacy.
  radius: {
    card: '16px',
    control: '10px',
    pill: '999px',
    shell: '22px',
  },

  space: [8, 12, 16, 24, 32, 48],

  shadow: {
    card: '0 1px 2px rgba(27, 42, 39, 0.04), 0 10px 24px -8px rgba(27, 42, 39, 0.10)',
    raised: '0 2px 4px rgba(27, 42, 39, 0.05), 0 18px 36px -10px rgba(27, 42, 39, 0.16)',
    sheet: '0 4px 8px rgba(27, 42, 39, 0.06), 0 28px 72px -16px rgba(27, 42, 39, 0.28)',
  },

  motion: {
    state: '150ms',
    sheet: '220ms',
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
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
