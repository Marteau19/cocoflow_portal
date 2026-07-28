/**
 * screens/owner/Contract.tsx
 *
 * Screen 10. Maintenance contract.
 *
 * What the plan covers, when it renews, and what it has actually done.
 *
 * The used-against-included count is the part that matters. A care plan whose
 * value is asserted rather than shown is the first thing a customer cancels at
 * renewal, and renewal rate feeds the service revenue mix the whole strategy
 * turns on.
 *
 * The word entitlement never appears. Customers see cover.
 */

import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  assets,
  byId,
  contracts,
  workOrders,
} from '../../data/seedData';
import { daysFromToday, longDate, money } from '../../lib/format';
import {
  Band,
  BandHead,
  Button,
  ButtonLink,
  Icon,
  Identifier,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/** What a visit would have cost without the plan. Makes the value legible. */
const LIST_PRICE = { inspection: 145, fmr: 420 };

export const OwnerContract = () => {
  const contract = byId(contracts, GOLDEN.contractId)!;
  const asset = byId(assets, GOLDEN.assetId)!;

  const visits = workOrders.filter((w) => w.contractId === contract.id);
  const used = visits.filter((w) => w.status === 'complete').length;
  const upcoming = visits.filter((w) => w.status !== 'complete');
  const daysToRenewal = daysFromToday(contract.renewsOn);

  // What the plan has saved so far, against what the same work would list at.
  const wouldHaveCost = used * LIST_PRICE.inspection + upcoming.length * LIST_PRICE.fmr;

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow="Your care plan"
          subject={contract.name}
          lead={`For your ${asset.product}, ${asset.model}.`}
        />

        <Section id="contract">
          <div className="contents">
            <Band kind="data" flush>
              <div className="flex items-baseline justify-between gap-3 px-gutter py-4">
                <div className="min-w-0">
                  <Micro>Per year</Micro>
                  <p className="mt-1 text-display text-ink">
                    {money(contract.annualPrice_jde, contract.currency)}
                  </p>
                  <p className="mt-2 max-w-reading text-body text-ink2">
                    Renews {longDate(contract.renewsOn)}, in {daysToRenewal} days.
                    {contract.autopay ? ' Paid automatically.' : ' We will ask you to pay.'}
                  </p>
                </div>
                <Status tone={contract.status === 'active' ? 'good' : 'warn'}>
                  {contract.status.toUpperCase()}
                </Status>
              </div>

              <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">Covering since</dt>
                  <dd className="text-caption text-ink">{longDate(contract.startsOn)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">Plan reference</dt>
                  <dd>
                    <Identifier>{contract.id}</Identifier>
                  </dd>
                </div>
              </dl>
            </Band>

            {/* What is covered, in plain words. */}
            <Band kind="rail" flush>
              <BandHead icon="check" eyebrow="What you get" title="Cover" />
              <RowList>
                {contract.entitlements.map((item) => (
                  <Row gutter key={item}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-positive">
                        <Icon name="check" />
                      </span>
                      <p className="text-body text-ink">{item}</p>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                <Micro>Not covered</Micro>
                <p className="mt-1 text-caption text-ink2">
                  Damage from something outside the system, and parts you order for yourself. We tell
                  you before any work that falls outside the plan, never after.
                </p>
              </div>
            </Band>

            {/* Used against included. The value made visible, not asserted. */}
            <Band kind="data" flush>
              <BandHead eyebrow="This term" title="What the plan has done" />
              <RowList>
                {visits.length === 0 ? (
                  <Row gutter>
                    <p className="text-body text-ink2">
                      No visits yet this term. Your first is scheduled automatically when it is due.
                    </p>
                  </Row>
                ) : (
                  visits.map((visit) => {
                    const done = visit.status === 'complete';
                    return (
                      <Row gutter key={visit.id} tone={done ? 'neutral' : 'strong'}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-body text-ink">
                              {visit.type === 'FMR'
                                ? 'Filter media replacement'
                                : 'Annual inspection'}
                            </p>
                            <p className="mt-1 text-caption text-ink2">
                              {longDate(visit.scheduledFor)}
                            </p>
                            <div className="mt-1">
                              <Status tone={done ? 'neutral' : 'good'}>
                                {done ? 'DONE' : 'SCHEDULED'}
                              </Status>
                            </div>
                          </div>
                          <p className="shrink-0 text-caption text-positive">Included</p>
                        </div>
                      </Row>
                    );
                  })
                )}
              </RowList>

              <div className="flex items-baseline justify-between gap-3 border-t border-line bg-surface-sunk px-gutter py-3">
                <div className="min-w-0">
                  <Micro>Without the plan</Micro>
                  <p className="mt-1 text-caption text-ink2">
                    The same work priced individually
                  </p>
                </div>
                <p className="text-body font-medium text-ink">{money(wouldHaveCost)}</p>
              </div>
            </Band>

            {/* Changing or ending it, offered plainly rather than buried. */}
            <Band kind="rail" flush>
              <BandHead icon="info" iconTone="neutral" eyebrow="If you want to change it" title="Your options" />
              <div className="space-y-3 px-gutter py-3">
                <div>
                  <p className="text-body text-ink">Move the renewal date</p>
                  <p className="mt-1 text-caption text-ink2">
                    Useful if you would rather be billed at a different time of year.
                  </p>
                </div>
                <div>
                  <p className="text-body text-ink">End the plan</p>
                  <p className="mt-1 text-caption text-ink2">
                    You can stop at any time. Cover runs to {longDate(contract.renewsOn)} and we do
                    not charge again after that.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line px-gutter py-3">
                <ButtonLink to="/messages" variant="quiet" icon="message-square">
                  Ask about my plan
                </ButtonLink>
                <Button variant="quiet">End the plan</Button>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
