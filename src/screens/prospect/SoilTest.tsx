/**
 * screens/prospect/SoilTest.tsx
 *
 * Screen 3. Soil test and report.
 *
 * We go to the property, assess the land, and publish what we found in plain
 * language. No jargon, no PDF the homeowner has to decode.
 *
 * The findings are the reason the recommendation on the quote screen is
 * credible, so this screen has to explain them rather than list them. Each
 * measurement carries what it means, which is the part a lab report leaves out.
 */

import { Section } from '../../blueprint/Section';
import { GOLDEN, byId, leads, resources, territories } from '../../data/seedData';
import { longDate } from '../../lib/format';
import {
  Avatar,
  Band,
  BandHead,
  ButtonLink,
  Hero,
  Icon,
  Masthead,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/**
 * What was measured, the verdict, and a fragment naming the cause.
 *
 * Each `meaning` used to be a full sentence explaining the verdict: 110 words
 * across the four. The label says what was measured and the value says what was
 * found, so the sentence was restating a conclusion the reader had already drawn.
 * A fragment naming the physical cause is the only part that was load bearing.
 */
const FINDINGS = [
  { label: 'How fast the ground drains', value: 'Slowly', meaning: 'Clay layer 600mm down' },
  { label: 'How deep we can dig', value: 'Not far', meaning: 'Bedrock close to the surface' },
  { label: 'Distance to the lake', value: 'Tight', meaning: 'Setback rules leave a narrow band' },
  { label: 'The water table', value: 'High in spring', meaning: 'Rises with the thaw' },
];

export const ProspectSoilTest = () => {
  const lead = byId(leads, GOLDEN.leadId)!;
  const servicePoint = byId(territories, lead.territoryId)!;
  const technician = resources.find(
    (r) => r.territoryId === servicePoint.id && r.role === 'technician',
  )!;

  return (
    <>
      {/*
        Masthead. The hero is the finding the whole design follows from: how fast
        the ground drains. A number on its own would be a measurement, so it
        carries what it means directly beneath.
      */}
      <Section id="soil-test">
        {/*
          The eyebrow was "Your soil test" above a heading reading "What we found on
          your land", which is the same thing twice. The note said the copy was in
          plain language, which is the one thing plain language never does.

          The eyebrow now does orientation the heading cannot: when it happened.
        */}
        <Masthead
          eyebrow={`${longDate('2026-07-23')}, an hour on site`}
          subject="What we found on your land"
          hero={
            <Hero
              onBand
              label="How fast the ground drains"
              value={FINDINGS[0].value}
            />
          }
        />
      </Section>

      {/* Data. Who came, and when. A test is a visit, not a document. */}
      <Band kind="data" flush>
              <div className="flex items-center gap-3 px-gutter py-4">
                <Avatar
                  name={technician.name}
                  initials={technician.initials}
                  photo={technician.photo}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="text-body text-ink">{technician.name} tested your land</p>
                  <p className="text-caption text-ink2">No charge for the test</p>
                </div>
              </div>
              <div className="border-t border-line px-gutter py-4">
                <Status tone="good" dot>
                  REPORT READY
                </Status>
              </div>
      </Band>

      {/* Rail. Each finding with what it means. Never a number on its own. */}
      <Band kind="rail" flush>
              <div className="px-gutter">
                <BandHead title="What the ground told us" />
              </div>
              <RowList className="border-t border-line">
                {FINDINGS.map((finding) => (
                  <Row key={finding.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-body text-ink">{finding.label}</p>
                      <p className="shrink-0 text-body font-medium text-ink">{finding.value}</p>
                    </div>
                    <p className="mt-1 max-w-reading text-caption text-ink2">{finding.meaning}</p>
                  </Row>
                ))}
              </RowList>
      </Band>

      {/* Data. The conclusion, stated before the quote asks for a decision. */}
      <Band kind="data" flush>
              <div className="px-gutter">
                <BandHead title="What we can install" />
              </div>
              <div className="px-gutter pb-4">
                {/*
                  The "that is not a sales answer" paragraph is gone. Rebutting an
                  accusation the customer has not made is what plants it, and the
                  four measurements above already make the argument.
                */}
                <p className="max-w-reading text-body text-ink">
                  Your lot needs a compact system that treats the water above the clay, rather than
                  relying on the ground.
                </p>
              </div>
              <div className="border-t border-line px-gutter py-4">
                <ButtonLink to="/quote" variant="primary" icon="chevron-right">
                  See what we recommend
                </ButtonLink>
              </div>
      </Band>

      {/* Closing. The report itself, for whoever wants the underlying numbers. */}
      <Band kind="closing" flush>
              <div className="px-gutter">
                <BandHead title="The full report" />
              </div>
              <RowList className="border-t border-line">
                <Row>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 text-ink3">
                        <Icon name="file-text" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">Soil assessment, {lead.city}</p>
                        <p className="text-caption text-ink2">
                          Measurements, method and standard
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-ink3">
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </Row>
              </RowList>
              <div className="border-t border-line px-gutter py-4">
                {/* The generosity survives in nine words instead of thirty. */}
                <p className="text-caption text-ink2">Yours to keep, and to share with anyone.</p>
              </div>
      </Band>
    </>
  );
};
