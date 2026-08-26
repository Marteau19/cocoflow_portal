/**
 * blueprint/Section.tsx
 *
 * Wraps an annotated region of a screen.
 *
 * Default state: nothing. The section renders its children and no marker.
 *
 * It used to render a small numbered marker at the header baseline, on the
 * argument that it was low contrast and easy to ignore. It was not. On a
 * customer screen a sequence reading 01, 02, 03 down the page is read as step
 * numbering by anyone who does not already know what Blueprint mode is, which
 * is every customer and most of the room in a leadership review. A marker that
 * has to be explained before it can be ignored is not low contrast, it is a
 * question the screen keeps asking.
 *
 * Blueprint mode: the marker is a numbered callout in IBM Plex Mono, the section
 * boundary is drawn, and a hairline leader line connects the two. The numbers are
 * an index into the exported spec, not decoration, which is what earns them their
 * place in that mode and only in that mode. Every annotation stays reachable
 * there and from the Blueprint panel, so nothing is lost from the spec layer: the
 * callouts are now revealed by the mode built to reveal them, rather than half
 * revealed all the time.
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
}: {
  id: string;
  children: ReactNode;
  className?: string;
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
      // Read by scripts/audit-design.mjs to assert that every screen carries at
      // least one annotation. A screen without one leaves a hole in the exported
      // spec, which is the failure this layer exists to prevent.
      data-section-id={id}
      className={`relative ${on ? 'border-l border-dashed border-line-strong pl-5' : ''} ${className}`}
    >
      {on ? (
        <>
          {/* Leader line, from the boundary to the callout. */}
          <span aria-hidden className="absolute left-0 top-4 h-px w-1 bg-line-strong" />
          {/*
            Inset from both edges rather than straddling the boundary at y=0. A
            section that runs flush to the top of the screen, which is every
            screen opening with an inverted panel, would otherwise have its
            callout clipped by the rounded corner of the device frame. The
            resulting indent reads as a drawing margin, which is the register
            Blueprint mode is in anyway.
          */}
          <button
            type="button"
            onClick={() => open(id)}
            aria-label={`Callout ${number}, ${annotation.title}`}
            aria-expanded={isOpen}
            className={`absolute left-1 top-3 z-frame rounded-control border px-1 font-mono text-micro transition-colors duration-state ease-ease ${
              isOpen
                ? 'border-accent-ink bg-accent text-on-accent'
                : 'border-line-strong bg-surface text-ink2 hover:border-ink2 hover:text-ink'
            }`}
          >
            {number}
          </button>
        </>
      ) : null}

      {children}
    </section>
  );
};
