/**
 * screens/owner/Recommended.tsx
 *
 * Screen 15. Recommended for your property.
 *
 * Suggestions grounded in this system, its age and its service history. Never a
 * generic upsell.
 *
 * Every item on this screen carries the record it came from and what it
 * prevents. A recommendation the customer cannot trace back to something real is
 * indistinguishable from an advert, and once one item reads that way the whole
 * screen does. Declining is offered plainly, because a suggestion you cannot
 * refuse is not a suggestion.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  accounts,
  assets,
  byId,
  contracts,
  products,
  workOrders,
} from '../../data/seedData';
import { daysFromToday, longDate, money } from '../../lib/format';
import {
  Button,
  ButtonLink,
  Card,
  CardHeader,
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

type Urgency = 'due' | 'worth-knowing';

interface Recommendation {
  id: string;
  label: string;
  why: string;
  /** The record this came from, shown so the customer can check it. */
  basedOn: string;
  prevents: string;
  price: number | null;
  urgency: Urgency;
  sku?: string;
}

export const OwnerRecommended = () => {
  const account = byId(accounts, GOLDEN.accountId)!;
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;
  const nextVisit = byId(workOrders, GOLDEN.workOrderId)!;

  const [declined, setDeclined] = useState<string[]>([]);

  const yearsInstalled = Math.abs(Math.round(daysFromToday(asset.installedOn) / 365));
  const riser = products.find((p) => p.sku === 'ACC-RISER-6');
  const seal = products.find((p) => p.sku === 'LID-SEAL-05');

  /**
   * Derived from this account's own records, not from a segment. Each entry
   * names the record so a reviewer can follow it back.
   */
  const RECOMMENDATIONS: Recommendation[] = [
    {
      id: 'winter-riser',
      label: 'A taller lid riser',
      why: `Your property is seasonal and the lid sits below the snow line. A taller riser means we can reach it in winter without you clearing the drive.`,
      basedOn: 'Your note about winter access, June 2026',
      prevents: 'A visit moved because we could not reach the lid',
      price: riser?.price_jde ?? null,
      urgency: 'worth-knowing',
      sku: riser?.sku,
    },
    {
      id: 'spare-seal',
      label: 'A spare lid seal',
      why: `The seal on your ${asset.model} is replaced during the visit on ${longDate(nextVisit.scheduledFor)}. Keeping a spare means a perished seal is never a reason to book a second visit.`,
      basedOn: `${nextVisit.id}, scheduled`,
      prevents: 'A callout for a ten dollar part',
      price: seal?.price_jde ?? null,
      urgency: 'worth-knowing',
      sku: seal?.sku,
    },
    {
      id: 'effluent-filter',
      label: 'An outlet filter check, added to your next visit',
      why: `Systems of this age start to show partial blockages at the outlet. Yours is ${yearsInstalled} years old and has not had one flagged, which is normal, but it is worth looking while we are there.`,
      basedOn: `Installed ${longDate(asset.installedOn)}`,
      prevents: 'A backup during heavy spring flow',
      price: null,
      urgency: 'due',
    },
  ];

  const shown = RECOMMENDATIONS.filter((r) => !declined.includes(r.id));
  const due = shown.filter((r) => r.urgency === 'due');
  const later = shown.filter((r) => r.urgency === 'worth-knowing');

  const decline = (id: string) => setDeclined((current) => [...current, id]);

  const Item = ({ item }: { item: Recommendation }) => (
    <Row tone={item.urgency === 'due' ? 'strong' : 'neutral'}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-body text-ink">{item.label}</p>
          <p className="shrink-0 text-body font-medium text-ink">
            {item.price === null ? 'No charge' : money(item.price)}
          </p>
        </div>

        <p className="mt-1 max-w-reading text-caption text-ink2">{item.why}</p>

        {/* The provenance. This is what separates a recommendation from an ad. */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 text-caption text-ink3">
            <Icon name="file-text" />
            Based on: {item.basedOn}
          </span>
          {item.sku && <Identifier>{item.sku}</Identifier>}
        </div>

        <p className="mt-2 text-caption text-ink2">Avoids: {item.prevents}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {item.sku ? (
            <ButtonLink to="/parts" variant="quiet" icon="package">
              See it in parts
            </ButtonLink>
          ) : (
            <ButtonLink to="/messages" variant="quiet" icon="message-square">
              Add it to my visit
            </ButtonLink>
          )}
          <Button variant="plain" onClick={() => decline(item.id)}>
            Not interested
          </Button>
        </div>
      </div>
    </Row>
  );

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="For your property"
          title="Worth knowing about"
          lead={`Based on your ${asset.model} at ${account.city}, its age, and what we have seen on site.`}
        />

        <Section id="recommended">
          <Stack gap="4">
            {shown.length === 0 ? (
              <Card>
                <div className="px-4 py-6">
                  <p className="text-body text-ink2">
                    Nothing to suggest right now. We will only put something here when your own
                    records give us a reason to.
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {due.length > 0 && (
                  <Card>
                    <CardHeader
                      eyebrow="Due now"
                      title={`${due.length} ${due.length === 1 ? 'thing' : 'things'} we would do next`}
                      action={<Status tone="good">NO CHARGE</Status>}
                    />
                    <RowList>
                      {due.map((item) => (
                        <Item key={item.id} item={item} />
                      ))}
                    </RowList>
                  </Card>
                )}

                {later.length > 0 && (
                  <Card>
                    <CardHeader
                      eyebrow="No rush"
                      title="Worth knowing about"
                    />
                    <RowList>
                      {later.map((item) => (
                        <Item key={item.id} item={item} />
                      ))}
                    </RowList>
                  </Card>
                )}
              </>
            )}

            {/* How this list is built. Said out loud rather than implied. */}
            <Card>
              <div className="px-4 py-3">
                <Micro>How we decide what to put here</Micro>
                <p className="mt-1 max-w-reading text-caption text-ink2">
                  Only your own records: the age of your system, what technicians recorded on site,
                  and what your {contract.name} already covers. We do not put something here because
                  other customers bought it.
                </p>
                {declined.length > 0 && (
                  <p className="mt-2 text-caption text-ink3">
                    {declined.length} {declined.length === 1 ? 'suggestion' : 'suggestions'} hidden.
                    We will not raise them again.
                  </p>
                )}
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
