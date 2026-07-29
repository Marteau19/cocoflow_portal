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
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/**
 * What was measured, and what each measurement means for this property. The
 * second half is the whole point: a percolation rate is meaningless to a
 * homeowner until someone says what it rules out.
 */
const FINDINGS = [
  {
    label: 'How fast the ground drains',
    value: 'Slowly',
    meaning:
      'There is a clay layer about 600mm down. Water sits on it rather than soaking away, which is why a conventional leaching bed would flood in spring.',
  },
  {
    label: 'How deep we can dig',
    value: 'Not far',
    meaning:
      'Bedrock sits close to the surface on the lake side of the lot. A deep system is not an option here.',
  },
  {
    label: 'Distance to the lake',
    value: 'Tight',
    meaning:
      'Provincial setback rules leave a narrow band we are allowed to build in, closer to the house than you might expect.',
  },
  {
    label: 'The water table',
    value: 'High in spring',
    meaning:
      'It rises with the thaw. Whatever we install has to keep working when the ground is saturated.',
  },
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
      <Section id="soil-test" onDark>
        <Masthead
          eyebrow="Your soil test"
          subject="What we found on your land"
          hero={
            <Hero
              onBand
              label="How fast the ground drains"
              value={FINDINGS[0].value}
              delta={{ text: 'Rules out a conventional leaching bed', tone: 'warn' }}
              note="We spent an hour on the property. Here is what the ground told us, in plain language."
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
                  <p className="text-caption text-ink2">
                    {longDate('2026-07-23')}, about an hour on site
                  </p>
                </div>
              </div>
              <div className="border-t border-line px-gutter py-4">
                <Status tone="good" dot>
                  REPORT READY
                </Status>
                <p className="mt-2 max-w-reading text-caption text-ink2">
                  There is nothing to pay for the test. It is part of how we work out what your
                  property needs.
                </p>
              </div>
      </Band>

      {/* Rail. Each finding with what it means. Never a number on its own. */}
      <Band kind="rail" flush>
              <div className="px-gutter">
                <BandHead eyebrow="Four things we measured" title="What the ground told us" />
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
                <BandHead eyebrow="What this means" title="What we can install" />
              </div>
              <div className="px-gutter pb-4">
                <p className="max-w-reading text-body text-ink">
                  Your lot rules out a conventional leaching bed. What it suits is a compact system
                  that treats the water above the problem layer rather than relying on the ground to
                  do the work.
                </p>
                <p className="mt-3 max-w-reading text-caption text-ink2">
                  That is not a sales answer. If your soil drained well and the lot were larger, a
                  simpler and cheaper system would be the right call, and we would have said so.
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
                <BandHead eyebrow="For your records" title="The full report" />
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
                          The measurements, the method, and the standard they are read against
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
                <Micro>If you are getting other quotes</Micro>
                <p className="mt-1 text-caption text-ink2">
                  This report is yours. You are welcome to share it with anyone else you are talking
                  to, and you do not need our permission.
                </p>
              </div>
      </Band>
    </>
  );
};
