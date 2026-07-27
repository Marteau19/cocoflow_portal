/**
 * brands/useBrand.ts
 *
 * Brand switching. Legacy is default. `Alt+Shift+N` toggles, `?brand=next`
 * forces, and the choice persists in localStorage.
 *
 * The only job here is to call `applyBrand()` with the right token object.
 * Components never read this state to pick a value: they read CSS custom
 * properties, which is why a brand switch requires zero component edits.
 */

import { useCallback, useEffect, useState } from 'react';
import { applyBrand, legacy, type Brand } from './legacy';
import { next } from './next';

export type BrandId = 'legacy' | 'next';

const BRANDS: Record<BrandId, Brand> = { legacy, next };

/** One of only two permitted localStorage keys. See CLAUDE.md constraints. */
const STORAGE_KEY = 'ecoflo.brand';

const isBrandId = (value: string | null): value is BrandId =>
  value === 'legacy' || value === 'next';

/**
 * URL parameter wins over the stored preference, so a demo link can pin the
 * brand regardless of what the machine last had selected.
 */
const initialBrand = (): BrandId => {
  const fromUrl = new URLSearchParams(window.location.search).get('brand');
  if (isBrandId(fromUrl)) return fromUrl;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isBrandId(stored)) return stored;
  } catch {
    // Private browsing can throw on access. Falling back to the default is
    // the correct outcome, so there is nothing to report.
  }

  return 'legacy';
};

export const useBrand = () => {
  const [brandId, setBrandId] = useState<BrandId>(initialBrand);

  // Write the token object to :root as custom properties, once at mount and
  // again on every switch.
  useEffect(() => {
    applyBrand(BRANDS[brandId]);
    try {
      window.localStorage.setItem(STORAGE_KEY, brandId);
    } catch {
      // A brand that cannot persist still renders correctly this session.
    }
  }, [brandId]);

  const toggleBrand = useCallback(() => {
    setBrandId((current) => (current === 'legacy' ? 'next' : 'legacy'));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Alt+Shift+N. Checking `code` rather than `key` because Alt rewrites
      // `key` on several keyboard layouts.
      if (event.altKey && event.shiftKey && event.code === 'KeyN') {
        event.preventDefault();
        toggleBrand();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleBrand]);

  return { brandId, brand: BRANDS[brandId], toggleBrand };
};
