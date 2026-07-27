/**
 * App.tsx
 *
 * Phase 0 placeholder. Its only job is to prove the token pipeline end to end:
 * fonts load, `applyBrand()` has written the custom properties, the Tailwind
 * utilities resolve through them, and the brand switch works.
 *
 * Phase 1 replaces this with the real shell: top bar, role switcher, nav and
 * Blueprint mode.
 */

import { useBrand } from './brands/useBrand';
import { icons } from './ui/icons';

export const App = () => {
  const { brand, brandId, toggleBrand } = useBrand();
  const Check = icons.check;

  return (
    <main className="min-h-screen bg-canvas px-gutter py-6">
      <div className="mx-auto max-w-reading">
        <img src={brand.logo.wordmark} alt="Ecoflo" className="h-4 w-auto" />

        <p className="mt-5 text-micro text-ink3">Scaffold</p>
        <h1 className="mt-1 text-display text-ink">The token contract holds.</h1>

        <p className="mt-3 text-body text-ink2">
          Fonts, colour, spacing, radius and motion all resolve from the active brand object. No
          component in this build contains a hex value.
        </p>

        <div className="mt-5 rounded-card border border-line bg-surface">
          <div className="border-b border-line px-4 py-3">
            <p className="text-micro text-ink3">Active brand</p>
            <p className="mt-1 text-h2 text-ink">{brand.label}</p>
          </div>
          <dl className="divide-y divide-line">
            {[
              ['Identifier', brand.id],
              ['Body step', `${brand.type.body.size} / ${brand.type.body.line}`],
              ['Card radius', brand.radius.card],
              ['State duration', brand.motion.state],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between px-4 py-3">
                <dt className="text-caption text-ink2">{label}</dt>
                <dd className="font-mono text-caption text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <button
          type="button"
          onClick={toggleBrand}
          className="mt-4 inline-flex min-h-tap items-center gap-2 rounded-control bg-accent px-4 text-body font-medium text-on-accent transition-colors duration-state ease-ease hover:bg-accent-hover"
        >
          <Check size="1em" aria-hidden />
          Switch brand
        </button>

        <p className="mt-3 text-caption text-ink3">
          Or press Alt+Shift+N. Currently {brandId}, persisted for next load.
        </p>
      </div>
    </main>
  );
};
