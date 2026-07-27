/**
 * screens/Placeholder.tsx
 *
 * Layout skeleton for a screen that has its route and its annotation but not yet
 * its content.
 *
 * This is what a P2 screen looks like after pass 1: the route resolves, the
 * annotation renders, the callout is in the export, and the shell around it is
 * real. It states plainly what belongs here rather than pretending to be
 * finished, because a reviewer who cannot tell the difference between a stub and
 * a decision is being misled.
 */

import { Section } from '../blueprint/Section';
import { sectionsForScreen } from '../data/sections';
import { Card, Identifier, Micro, PageHead, Stack } from '../ui/primitives';
import { ScreenBody } from './ScreenBody';

export const Placeholder = ({
  screen,
  title,
  lead,
  eyebrow,
  belongsHere,
}: {
  /** Route key, used to look up this screen's annotations. */
  screen: string;
  title: string;
  lead?: string;
  eyebrow?: string;
  /** What this screen will hold. One line per element. */
  belongsHere: readonly string[];
}) => {
  const annotations = sectionsForScreen(screen);

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead eyebrow={eyebrow} title={title} lead={lead} />

        {annotations.map((annotation) => (
          <Section key={annotation.id} id={annotation.id}>
            <Card>
              <div className="border-b border-line px-4 py-3">
                <Micro>Layout skeleton</Micro>
                <h2 className="mt-1 text-h2 text-ink">{annotation.title}</h2>
                <p className="mt-2 text-caption text-ink2">{annotation.business}</p>
              </div>
              <ul className="divide-y divide-line">
                {belongsHere.map((item) => (
                  <li key={item} className="px-4 py-3 text-caption text-ink2">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-line px-4 py-3">
                <Identifier className="text-ink3">{`phase ${annotation.phase}`}</Identifier>
              </div>
            </Card>
          </Section>
        ))}
      </Stack>
    </ScreenBody>
  );
};
