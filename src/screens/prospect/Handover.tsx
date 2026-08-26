/**
 * screens/prospect/Handover.tsx
 *
 * Screen 6. Handover to owner.
 *
 * The hinge of the whole prototype. A prospect becomes an owner, and everything
 * that happened during the project stays with them rather than being archived in
 * a system they cannot see.
 *
 * This is where the single converged surface earns its keep: nothing is
 * re-entered, no second account is created, and the same login that tracked the
 * installation now runs the system. The role switch on this screen is the
 * argument made literal.
 */

import { Section } from '../../blueprint/Section';
import { GOLDEN, byId, contracts, leads, quotes, territories } from '../../data/seedData';
import { longDate, money } from '../../lib/format';
import {
  Band,
  BandHead,
  Icon,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';
import { useRole } from '../../shell/useRole';
import { Button } from '../../ui/primitives';

/** What the customer now owns, stated as things rather than records. */
const WHAT_YOU_HAVE = [
  { label: 'Your system', detail: 'Installed, tested and signed off' },
  { label: 'A ten year warranty', detail: 'On the tank and the filter media' },
  { label: 'Your full history', detail: 'The soil test, the design, the permit and the install' },
  { label: 'One place to reach us', detail: 'The same team, the same login' },
];

export const ProspectHandover = () => {
  const lead = byId(leads, GOLDEN.leadId)!;
  const quote = quotes.find((q) => q.leadId === lead.id)!;
  const contract = byId(contracts, GOLDEN.contractId)!;
  const servicePoint = byId(territories, lead.territoryId)!;
  const { setRole } = useRole();

  return (
    <>
      {/* Masthead. The hero is a dark field: the statement itself. */}
      <Section id="handover">
        {/*
          "Handover" above "Your system is live" is the same idea twice, so the
          eyebrow is gone.

          The non-breaking space binds "is live", so the line breaks after "system"
          and the hero sets as two balanced lines instead of stranding "live" on its
          own. DESIGN.md section 5 permits an explicit break. It does not permit
          shrinking the hero to avoid one.
        */}
        <Masthead
          subject={'Your system is\u00A0live'}
          lead={`${servicePoint.name} looks after it from here.`}
        >
          <div className="mt-4">
            <Status tone="good" dot>
              COMMISSIONED
            </Status>
          </div>
        </Masthead>
      </Section>

      {/* Data. What the customer now owns, stated as things rather than records. */}
      <Band kind="data" flush>
            <div className="px-gutter">
              <p className="max-w-reading py-4 text-body text-ink2">
                We ran the system, checked the flow and confirmed the treatment is working. The yard
                is levelled and seeded, and the permit is closed with the municipality.
              </p>
            </div>
              <RowList className="border-t border-line">
                {WHAT_YOU_HAVE.map((item) => (
                  <Row key={item.label}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-positive">
                        <Icon name="check" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">{item.label}</p>
                        <p className="text-caption text-ink2">{item.detail}</p>
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>

      </Band>

      {/* Rail. The care plan offer, stated as cover rather than as a product. */}
      <Band kind="rail" flush>
            <div className="px-gutter">
              <BandHead eyebrow="Keeping it that way" title={contract.name} />
            </div>
            <div className="px-gutter pb-4">
              {/*
                The entitlement rows below already list what is covered, so the
                paragraph only has to say the one thing they do not: that we come
                before something goes wrong rather than after.
              */}
              <p className="max-w-reading text-body text-ink2">
                We come to you before something goes wrong, not after.
              </p>
            </div>
              <RowList className="border-t border-line">
                {contract.entitlements.map((entitlement) => (
                  <Row key={entitlement}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-ink3">
                        <Icon name="check" />
                      </span>
                      <p className="text-caption text-ink">{entitlement}</p>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="flex items-baseline justify-between gap-3 border-t border-line px-gutter py-4">
                <div>
                  <Micro>Per year</Micro>
                  <p className="mt-1 text-caption text-ink2">Cancel whenever you like</p>
                </div>
                <p className="text-display text-ink">
                  {money(contract.annualPrice_jde, contract.currency)}
                </p>
              </div>

      </Band>

      {/* Data. First visit already booked. The promise made concrete. */}
      <Band kind="data" flush>
            <div className="px-gutter">
              <BandHead icon="calendar" eyebrow="Already booked" title="Your first check up" />
            </div>
              <RowList className="border-t border-line">
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-body text-ink">Annual inspection</p>
                      <p className="mt-1 text-caption text-ink2">
                        We confirm a window nearer the time
                      </p>
                    </div>
                    <p className="shrink-0 text-caption text-ink">{longDate('2027-08-10')}</p>
                  </div>
                </Row>
              </RowList>

      </Band>

      {/*
        Closing, dark. The handover itself, and the hinge of the whole prototype:
        one login, nothing re-entered. It takes the second dark band because it is
        the argument the screen exists to make.
      */}
      <Band kind="closing" alt>
              <Micro className="text-on-band-muted">What changes for you</Micro>
              <p className="mt-1 text-h1 text-on-band">Same login, new view</p>
              <div className="mt-3">
                {/*
                  Three sentences became two. "Nothing to sign up for and nothing to
                  re-enter" and "the account you have been using becomes the account
                  you use" are the same claim, so the concrete one survives.
                */}
                <p className="max-w-reading text-body text-on-band opacity-90">
                  The account you used to follow the project is the one you use to run the system.
                  Your soil test, your design and your permit stay with it.
                </p>
              </div>
              <div className="mt-4">
                <Button variant="primary" size="primary" onBand icon="home" onClick={() => setRole('client-owner')}>
                  Go to my system
                </Button>
                {/*
                  "In the prototype this switches the role" was demo mechanics on a
                  customer screen. Deleted rather than moved: it describes this
                  build's role switcher, not a system decision, so it has no home in
                  sections.ts either.
                */}
                <p className="mt-3 max-w-reading text-caption text-on-band opacity-70">
                  Installed against {quote.id}. Warranty and documents live under My system.
                </p>
              </div>
      </Band>
    </>
  );
};
