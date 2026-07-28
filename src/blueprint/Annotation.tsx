/**
 * blueprint/Annotation.tsx
 *
 * One annotation, rendered in two registers.
 *
 * The business line is always visible: one or two sentences, plain language, no
 * system names. That is what leadership reads. The technical block is collapsed
 * by default: system of record, data direction, integration path, foundational
 * block dependency, open decision, phase, privacy. That is what IT and DEV
 * expand.
 *
 * Both come from the same record in `data/sections.ts`. There are no free-text
 * tooltips anywhere else in the build.
 */

import { useState } from 'react';
import type { Section } from '../data/sections';
import { Icon, Identifier, Micro } from '../ui/primitives';

const TechRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="border-t border-line px-4 py-3">
    <Micro>{label}</Micro>
    <div className="mt-1 text-caption text-ink">{children}</div>
  </div>
);

export const Annotation = ({
  section,
  defaultExpanded = false,
}: {
  section: Section;
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const number = String(section.callout).padStart(2, '0');

  return (
    <article className="border-b border-line last:border-b-0">
      <div className="px-4 py-3">
        <div className="flex items-baseline gap-2">
          <Identifier className="text-ink3">{number}</Identifier>
          <h3 className="text-body font-medium text-ink">{section.title}</h3>
        </div>

        {/* The business register. Always visible. */}
        <p className="mt-2 text-body text-ink2">{section.business}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Identifier className="text-ink3">{`phase ${section.phase}`}</Identifier>
          {section.openDecision && (
            <span className="inline-flex items-center gap-1 text-caption text-warn">
              <Icon name="alert-triangle" />
              Open decision
            </span>
          )}
          {section.privacy && (
            <span className="inline-flex items-center gap-1 text-caption text-ink2">
              <Icon name="info" />
              Personal data
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 inline-flex min-h-tap items-center gap-1 text-caption text-accent-ink transition-colors duration-state ease-ease hover:text-ink"
        >
          {expanded ? 'Hide the technical detail' : 'Show the technical detail'}
          <Icon name={expanded ? 'chevron-down' : 'chevron-right'} />
        </button>
      </div>

      {/* The technical register. Collapsed by default. */}
      {expanded && (
        <div className="bg-surface-sunk">
          <TechRow label="Primary user">{section.primaryUser}</TechRow>
          <TechRow label="System of record">
            <span className="font-mono uppercase">{section.systemOfRecord.join(', ')}</span>
          </TechRow>
          <TechRow label="Data direction">
            <span className="font-mono uppercase">{section.dataDirection}</span>
          </TechRow>
          <TechRow label="Integration path">{section.integration}</TechRow>
          <TechRow label="Foundational block">
            <span className="font-mono uppercase">{section.bf.join(', ')}</span>
          </TechRow>
          <TechRow label="Open decision">
            {section.openDecision ? (
              <span className="text-warn">{section.openDecision}</span>
            ) : (
              'None. The path for this section is clear.'
            )}
          </TechRow>
          {section.privacy && (
            <TechRow label="Privacy, Law 25">
              <span className="text-ink">{section.privacy}</span>
            </TechRow>
          )}
        </div>
      )}
    </article>
  );
};
