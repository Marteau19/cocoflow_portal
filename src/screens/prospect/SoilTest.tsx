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
  ButtonLink,
  Card,
  CardHeader,
  Icon,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

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
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Your soil test"
          title="What we found on your land"
          lead="We spent an hour on the property. Here is what the ground told us, in plain language."
        />

        <Section id="soil-test">
          <Stack gap="4">
            {/* Who came, and when. A test is a visit, not a document. */}
            <Card>
              <div className="flex items-center gap-3 px-4 py-3">
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
              <div className="border-t border-line px-4 py-3">
                <Status tone="good">REPORT READY</Status>
                <p className="mt-2 text-caption text-ink2">
                  There is nothing to pay for the test. It is part of how we work out what your
                  property needs.
                </p>
              </div>
            </Card>

            {/* Each finding with what it means. Never a number on its own. */}
            <Card>
              <CardHeader eyebrow="Four things we measured" title="What the ground told us" />
              <RowList>
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
            </Card>

            {/* The conclusion, stated before the quote asks for a decision. */}
            <Card>
              <CardHeader eyebrow="What this means" title="What we can install" />
              <div className="px-4 py-3">
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
              <div className="border-t border-line px-4 py-3">
                <ButtonLink to="/quote" variant="primary" icon="chevron-right">
                  See what we recommend
                </ButtonLink>
              </div>
            </Card>

            {/* The report itself, for whoever wants the underlying numbers. */}
            <Card>
              <CardHeader eyebrow="For your records" title="The full report" />
              <RowList>
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
              <div className="border-t border-line px-4 py-3">
                <Micro>If you are getting other quotes</Micro>
                <p className="mt-1 text-caption text-ink2">
                  This report is yours. You are welcome to share it with anyone else you are talking
                  to, and you do not need our permission.
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
