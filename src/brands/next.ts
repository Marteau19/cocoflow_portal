/**
 * brands/next.ts
 *
 * The new Ecoflo identity. Reachable with Alt+Shift+N or ?brand=next.
 *
 * PLACEHOLDER. Every value below currently mirrors the legacy brand, with the
 * exceptions marked TODO. When the brand guide lands in the reference folder,
 * overwrite the values in this file and nothing else. If overwriting this file
 * requires touching a component, that component has a hardcoded value and it is
 * a bug. See REFERENCES.md.
 *
 * Keep every key. A missing key breaks the switch at runtime by design.
 */

import type { Brand } from './legacy';

export const next: Brand = {
  id: 'next',
  label: 'Ecoflo, new',

  color: {
    // TODO overwrite from brand guide
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
    // TODO overwrite if the new brand changes the typeface
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
    // TODO the new brand may run tighter or softer corners
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
    // TODO point at the new brand assets once they land.
    //
    // Deliberately borrowing the legacy files until then. The new identity in
    // the reference folder is a set of artboards, not an extracted wordmark, so
    // choosing one would be a guess. Pointing at assets that do not exist would
    // break the logo on brand switch and read as a component bug, which is the
    // one signal this contract exists to give us honestly.
    wordmark: '/brand/legacy/ecoflo-wordmark.png',
    wordmarkOnDark: '/brand/legacy/ecoflo-wordmark-light.png',
    mark: '/brand/legacy/ecoflo-mark.png',
  },
};
