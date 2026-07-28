/**
 * screens/prospect/Quote.tsx
 *
 * Screen 4. Your solution and quote.
 *
 * A recommendation reveal, not a wizard. Here is the system we designed for your
 * property, and here is why. Same technical credibility as a configurator, none
 * of the homework.
 *
 * The itemised lines matter more than the total. A septic system is an unplanned
 * five-figure purchase, and the fastest way to lose the room is a single number
 * with nothing behind it. What is already included is shown as included rather
 * than hidden, so the price reads as complete instead of as a starting point.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import { GOLDEN, byId, leads, quotes, resources, territories } from '../../data/seedData';
import { daysFromToday, longDate, money } from '../../lib/format';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Flag,
  Icon,
  Identifier,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/** Why this system, for this land. The credibility of the reveal lives here. */
const REASONS = [
  {
    label: 'Your soil drains slowly',
    detail:
      'The test showed a clay layer about 600mm down. A conventional leaching bed would saturate in spring.',
  },
  {
    label: 'The lot is tight to the lake',
    detail:
      'Setback rules leave a narrow band to build in. The compact biofilter fits it where a larger field does not.',
  },
  {
    label: 'The property is seasonal',
    detail:
      'It handles being left unused for months and coming back to full load on a long weekend.',
  },
];

export const ProspectQuote = () => {
  const lead = byId(leads, GOLDEN.leadId)!;
  const quote = quotes.find((q) => q.leadId === lead.id)!;
  const servicePoint = byId(territories, lead.territoryId)!;
  const manager = resources.find((r) => r.territoryId === servicePoint.id && r.role === 'manager')!;

  const [approved, setApproved] = useState(quote.status === 'approved');

  const included = quote.lines.filter((line) => line.included);
  const priced = quote.lines.filter((line) => !line.included);
  const expiresIn = quote.validDays - Math.abs(daysFromToday(quote.issuedOn));

  /* ------------------------------------------------------------------ */
  /* The action keeps its name through the flow: approve, then approved. */
  /* ------------------------------------------------------------------ */
  if (approved) {
    return (
      <ScreenBody>
        <Stack gap="4">
          <PageHead
            eyebrow="Quote approved"
            title="We are booking your installation"
            lead={`${manager.name} will call you within a working day to agree dates.`}
          />
          <Card>
            <RowList>
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Approved</p>
                  <p className="text-caption text-ink">{money(quote.total_jde, quote.currency)}</p>
                </div>
              </Row>
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Reference</p>
                  <Identifier>{quote.id}</Identifier>
                </div>
              </Row>
            </RowList>
            <div className="border-t border-line px-4 py-3">
              <p className="text-caption text-ink2">
                Nothing is charged yet. We file the permits first, and you will see each stage as it
                happens.
              </p>
            </div>
          </Card>
        </Stack>
      </ScreenBody>
    );
  }

  /* ------------------------------------------------------------------ */
  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Your solution"
          title="The system we designed for your property"
          lead={`Based on what we found at ${lead.city}. Here is why this one, and what it costs.`}
        />

        <Section id="quote-reveal">
          <Stack gap="4">
            {/* The recommendation, with real imagery of the thing itself. */}
            <Card className="overflow-hidden">
              <img
                src="/img/system.jpg"
                alt="An Ecoflo compact biofilter installed at a property"
                className="h-[180px] w-full border-b border-line object-cover"
              />
              <div className="px-4 py-3">
                <Micro>Recommended</Micro>
                <h2 className="mt-1 text-h1 text-ink">Ecoflo compact biofilter</h2>
                <p className="mt-2 text-body text-ink2">
                  A coconut husk filter that treats wastewater without electricity or chemicals. No
                  moving parts to fail, and it sits low enough to keep your view.
                </p>
              </div>
            </Card>

            {/* Why this one. Three reasons, tied to the soil test. */}
            <Card>
              <CardHeader eyebrow="Why this system" title="Three reasons" />
              <RowList>
                {REASONS.map((reason, index) => (
                  <Row key={reason.label}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 font-mono text-caption text-ink3">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">{reason.label}</p>
                        <p className="mt-1 text-caption text-ink2">{reason.detail}</p>
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>
            </Card>

            {/* Itemised. Included lines shown as included, not omitted. */}
            <Card>
              <CardHeader
                eyebrow="What it costs"
                title="Itemised"
                action={
                  <Status tone={expiresIn > 7 ? 'neutral' : 'warn'}>
                    {`VALID ${expiresIn} DAYS`}
                  </Status>
                }
              />

              <div className="border-b border-line bg-surface-sunk px-4 py-2">
                <Micro>Already done, at no cost</Micro>
              </div>
              <RowList>
                {included.map((line) => (
                  <Row key={line.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 text-caption text-ink">{line.label}</p>
                      <span className="shrink-0 text-caption text-accent-ink">Included</span>
                    </div>
                  </Row>
                ))}
              </RowList>

              <div className="border-y border-line bg-surface-sunk px-4 py-2">
                <Micro>To be quoted</Micro>
              </div>
              <RowList>
                {priced.map((line) => (
                  <Row key={line.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 text-caption text-ink">{line.label}</p>
                      <p className="shrink-0 text-caption text-ink">
                        {line.amount_jde === null ? 'Included' : money(line.amount_jde, quote.currency)}
                      </p>
                    </div>
                  </Row>
                ))}
              </RowList>

              <div className="flex items-baseline justify-between gap-3 border-t border-line px-4 py-4">
                <div>
                  <Micro>Total</Micro>
                  <p className="mt-1 text-caption text-ink2">Taxes calculated on the invoice</p>
                </div>
                <p className="text-display text-ink">{money(quote.total_jde, quote.currency)}</p>
              </div>
            </Card>

            {/* Who to ask. A named human, not a form. */}
            <Card>
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar
                  name={manager.name}
                  initials={manager.initials}
                  photo={manager.photo}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="text-body text-ink">Questions? Ask {manager.name.split(' ')[0]}</p>
                  <p className="text-caption text-ink2">
                    {manager.name}, {servicePoint.name}
                  </p>
                </div>
              </div>
            </Card>

            {/* One action. */}
            <Button variant="primary" icon="check" block onClick={() => setApproved(true)}>
              Approve quote
            </Button>
            <p className="text-caption text-ink3">
              Approving does not charge you. We file the permits first, and you can stop at any point
              before work starts.
            </p>

            <Card>
              <div className="px-4 py-3">
                <Flag tone="warn" icon="alert-triangle">
                  How this quote is assembled is undecided
                </Flag>
                <p className="mt-2 flex items-start gap-2 text-caption text-ink2">
                  <span className="mt-1 shrink-0">
                    <Icon name="info" />
                  </span>
                  <span>
                    Prices come from the ERP. Which quoting platform assembles them, and how pricing
                    governance works, is an open decision, so the shape of this record is provisional.
                  </span>
                </p>
                <p className="mt-2">
                  <Identifier className="text-ink3">{`${quote.id}, issued ${longDate(quote.issuedOn)}`}</Identifier>
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
