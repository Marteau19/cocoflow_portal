/**
 * blueprint/Section.tsx
 *
 * Wraps an annotated region of a screen.
 *
 * Default state: a small hairline-outlined marker sits at the header baseline in
 * --ink-3, low contrast, easy to ignore while demoing the product. Clicking it
 * opens the annotation.
 *
 * Blueprint mode: the marker becomes a numbered callout in IBM Plex Mono, the
 * section boundary is drawn, and a hairline leader line connects the two. The
 * numbers are an index into the exported spec, not decoration, which is what
 * earns them their place.
 *
 * The `id` must exist in `data/sections.ts`. In development an unknown id logs
 * once rather than failing silently, because a section that quietly loses its
 * annotation is the failure mode this layer exists to prevent.
 */

import { useEffect, type ReactNode } from 'react';
import { sections } from '../data/sections';
import { useBlueprint } from './BlueprintProvider';

export const Section = ({
  id,
  children,
  className = '',
  onDark = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  /** Set on the forest blocks, where the default marker would be invisible. */
  onDark?: boolean;
}) => {
  const { on, register, unregister, open, openId } = useBlueprint();
  const annotation = sections.find((s) => s.id === id);

  useEffect(() => {
    if (!annotation) {
      if (import.meta.env.DEV) {
        console.warn(`Section "${id}" has no annotation in data/sections.ts`);
      }
      return;
    }
    register(id);
    return () => unregister(id);
  }, [id, annotation, register, unregister]);

  if (!annotation) return <div className={className}>{children}</div>;

  const number = String(annotation.callout).padStart(2, '0');
  const isOpen = openId === id;

  return (
    <section
      className={`relative ${on ? 'border-l border-dashed border-line-strong pl-3' : ''} ${className}`}
    >
      {on ? (
        <>
          {/* Leader line, from the boundary into the content. */}
          <span aria-hidden className="absolute left-0 top-2 h-px w-3 bg-line-strong" />
          <button
            type="button"
            onClick={() => open(id)}
            aria-label={`Callout ${number}, ${annotation.title}`}
            aria-expanded={isOpen}
            className={`absolute left-0 top-0 z-frame -translate-x-1/2 rounded-control border px-1 font-mono text-micro transition-colors duration-state ease-ease ${
              isOpen
                ? 'border-accent-ink bg-accent text-on-accent'
                : 'border-line-strong bg-surface text-ink2 hover:border-ink2 hover:text-ink'
            }`}
          >
            {number}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => open(id)}
          aria-label={`About this section: ${annotation.title}`}
          aria-expanded={isOpen}
          className={`absolute right-2 top-2 z-frame grid h-3 w-3 place-items-center rounded-control border text-micro transition-colors duration-state ease-ease ${
            onDark
              ? 'border-on-forest text-on-forest opacity-50 hover:opacity-100'
              : isOpen
                ? 'border-ink2 text-ink'
                : 'border-line text-ink3 hover:border-ink3 hover:text-ink2'
          }`}
        >
          <span className="font-mono leading-none">{number}</span>
        </button>
      )}

      {children}
    </section>
  );
};
