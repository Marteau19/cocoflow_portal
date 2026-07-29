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
  Band,
  BandHead,
  Button,
  Identifier,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/** Why this system, for this land. The credibility of the reveal lives here. */
const REASONS = [
  {
    label: 'Your soil drains slowly',
    detail: 'Clay 600mm down. A leaching bed would saturate in spring.',
  },
  {
    label: 'The lot is tight to the lake',
    detail: 'Setbacks leave a narrow band. This fits it.',
  },
  {
    label: 'The property is seasonal',
    detail: 'Handles months unused, then a full weekend.',
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
      <>
        <div className="contents">
          <Masthead
            eyebrow={quote.id}
            subject="We are booking your installation"
            lead={`${manager.name} will call within a working day to agree dates.`}
          />
          <Band kind="data" flush>
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
            <div className="border-t border-line px-gutter py-3">
              <p className="text-caption text-ink2">Nothing is charged yet. Permits come first.</p>
            </div>
          </Band>
        </div>
      </>
    );
  }

  /* ------------------------------------------------------------------ */
  return (
    <>
      <div className="contents">
        {/*
          "Your solution" above "The system we designed for your property" is one
          idea twice, and the lead announced the page's own structure. What survives
          is the orientation the heading cannot give: which property this is about.
        */}
        <Masthead
          subject="The system we designed for your property"
          lead={`Based on what we found at ${lead.city}`}
        />

        <Section id="quote-reveal">
          <div className="contents">
            {/* The recommendation, with real imagery of the thing itself. */}
            <Band kind="data" flush>
              <img
                src="/img/system.jpg"
                alt="An Ecoflo compact biofilter installed at a property"
                className="h-[180px] w-full border-b border-line object-cover"
              />
              <div className="px-gutter py-3">
                <Micro>Recommended</Micro>
                <h2 className="mt-1 text-h1 text-ink">Ecoflo compact biofilter</h2>
                <p className="mt-2 text-body text-ink2">
                  Coconut husk filter. No electricity, no moving parts, and low enough to keep your
                  view.
                </p>
              </div>
            </Band>

            {/* Why this one. Three reasons, tied to the soil test. */}
            <Band kind="rail" flush>
              <BandHead title="Why this system" />
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
            </Band>

            {/* Itemised. Included lines shown as included, not omitted. */}
            <Band kind="data" flush>
              <BandHead
                title="What it costs"
                action={
                  <Status tone={expiresIn > 7 ? 'neutral' : 'warn'}>
                    {`VALID ${expiresIn} DAYS`}
                  </Status>
                }
              />

              <div className="border-b border-line bg-surface-sunk px-gutter py-2">
                <Micro>Already done</Micro>
              </div>
              <RowList>
                {included.map((line) => (
                  <Row key={line.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 text-caption text-ink">{line.label}</p>
                      <span className="shrink-0 text-caption text-positive">Included</span>
                    </div>
                  </Row>
                ))}
              </RowList>

              <div className="border-y border-line bg-surface-sunk px-gutter py-2">
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

              <div className="flex items-baseline justify-between gap-3 border-t border-line px-gutter py-4">
                <div>
                  <Micro>Total</Micro>
                  <p className="mt-1 text-caption text-ink2">Taxes calculated on the invoice</p>
                </div>
                <p className="text-display text-ink">{money(quote.total_jde, quote.currency)}</p>
              </div>
            </Band>

            {/* Who to ask. A named human, not a form. */}
            <Band kind="rail" flush>
              <div className="flex items-center gap-3 px-gutter py-3">
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
            </Band>

            {/* One action. */}
            <Button variant="primary" icon="check" block onClick={() => setApproved(true)}>
              Approve quote
            </Button>
            {/*
              This screen's single reassurance, and it sits next to the action rather
              than one per band. The "at no cost" strip above and the post-approval
              "nothing is charged yet" line were saying the same thing a third and
              second time.
            */}
            <p className="text-caption text-ink3">
              Approving does not charge you. You can stop any time before work starts.
            </p>

            <Band kind="data" flush>
              <div className="px-gutter py-3">
                {/*
                  The CPQ open decision used to be stated here, on the customer's
                  screen. It lives in the `quote-reveal` annotation's openDecision,
                  which is where a reviewer looks for it. A homeowner approving a
                  quote does not read about quoting platforms.
                */}
                <p>
                  <Identifier className="text-ink3">{`${quote.id}, issued ${longDate(quote.issuedOn)}`}</Identifier>
                </p>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
