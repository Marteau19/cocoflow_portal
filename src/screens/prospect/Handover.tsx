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
import { useRole } from '../../shell/useRole';
import { Button } from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

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
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Handover"
          title="Your system is live"
          lead={`Commissioned and running. ${servicePoint.name} looks after it from here.`}
        />

        <Section id="handover">
          <Stack gap="4">
            <Card>
              <div className="px-4 py-3">
                <Status tone="good">COMMISSIONED</Status>
                <p className="mt-2 max-w-reading text-body text-ink">
                  We ran the system, checked the flow and confirmed the treatment is working. The
                  yard is levelled and seeded, and the permit is closed with the municipality.
                </p>
              </div>
              <RowList className="border-t border-line">
                {WHAT_YOU_HAVE.map((item) => (
                  <Row key={item.label}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-accent-ink">
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
            </Card>

            {/* The care plan offer, stated as cover rather than as a product. */}
            <Card>
              <CardHeader eyebrow="Keeping it that way" title={contract.name} />
              <div className="px-4 py-3">
                <p className="max-w-reading text-body text-ink2">
                  A system like yours needs the filter media replaced every few years and a check up
                  once a year. The care plan covers both, and it means we come to you before
                  something goes wrong rather than after.
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
              <div className="flex items-baseline justify-between gap-3 border-t border-line px-4 py-3">
                <div>
                  <Micro>Per year</Micro>
                  <p className="mt-1 text-caption text-ink2">Cancel whenever you like</p>
                </div>
                <p className="text-h1 text-ink">
                  {money(contract.annualPrice_jde, contract.currency)}
                </p>
              </div>
            </Card>

            {/* First visit already booked. The promise made concrete. */}
            <Card>
              <CardHeader eyebrow="Already booked" title="Your first check up" />
              <RowList>
                <Row rule="strong">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-body text-ink">Annual inspection</p>
                      <p className="mt-1 text-caption text-ink2">
                        We will confirm a window with you nearer the time
                      </p>
                    </div>
                    <p className="shrink-0 text-caption text-ink">{longDate('2027-08-10')}</p>
                  </div>
                </Row>
              </RowList>
            </Card>

            {/* The handover itself. One login, nothing re-entered. */}
            <Card>
              <CardHeader eyebrow="What changes for you" title="Same login, new view" />
              <div className="px-4 py-3">
                <p className="max-w-reading text-body text-ink2">
                  Nothing to sign up for and nothing to re-enter. The account you have been using to
                  follow the project becomes the account you use to run the system. Your soil test,
                  your design and your permit stay with it.
                </p>
              </div>
              <div className="border-t border-line px-4 py-3">
                <Button
                  variant="primary"
                  icon="home"
                  block
                  onClick={() => setRole('client-owner')}
                >
                  Go to my system
                </Button>
                <p className="mt-2 text-caption text-ink3">
                  In the prototype this switches the role. For a real customer it is the same screen
                  they were already on.
                </p>
              </div>
            </Card>

            <p className="text-caption text-ink3">
              Installed against {quote.id}. Warranty and documents live under My system.
            </p>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
