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
import { useCountUp } from '../../ui/motion';
import {
  ASSUMPTIONS,
  GOLDEN,
  planValue,
  assets,
  byId,
  contracts,
  workOrders,
} from '../../data/seedData';
import { t } from '../../i18n';
import { PLAN_YEAR, daysFromToday, longDate, money } from '../../lib/format';
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

export const OwnerContract = () => {
  const contract = byId(contracts, GOLDEN.contractId)!;
  const asset = byId(assets, GOLDEN.assetId)!;

  const visits = workOrders.filter((w) => w.contractId === contract.id);
  const daysToRenewal = daysFromToday(contract.renewsOn);

  /*
    What the plan has saved so far, against what the same work would list at.

    The list prices used to be a literal in this file. They are an assumption
    about what PTWE charges a customer with no plan, they are the input to the
    renewal argument on two screens now, and a pricing assumption living inside
    one component is how the same figure ends up different in two places. They
    are in `ASSUMPTIONS` in seedData with the rest.
  */
  const wouldHaveCost = visits.reduce((sum, w) => sum + ASSUMPTIONS.listPrice[w.type], 0);

  const value = planValue(contract.accountId, PLAN_YEAR);
  const shownCovered = useCountUp(value?.covered ?? 0);

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={t('contract.eyebrow')}
          subject={contract.name}
          lead={t('contract.forSystem', { product: asset.product, model: asset.model })}
        />

        <Section id="contract">
          <div className="contents">
            <Band kind="data" flush>
              <div className="flex items-baseline justify-between gap-3 px-gutter py-4">
                <div className="min-w-0">
                  <Micro>{t('contract.perYear')}</Micro>
                  <p className="mt-1 text-display text-ink">
                    {money(contract.annualPrice_jde, contract.currency)}
                  </p>
                  <p className="mt-2 max-w-reading text-body text-ink2">
                    {t('contract.renews', {
                      date: longDate(contract.renewsOn),
                      days: daysToRenewal,
                    })}{' '}
                    {contract.autopay ? t('contract.autopayOn') : t('contract.autopayOff')}
                  </p>
                </div>
                <Status tone={contract.status === 'active' ? 'good' : 'warn'}>
                  {t(`contract.${contract.status}` as Parameters<typeof t>[0])}
                </Status>
              </div>

              <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">{t('contract.since')}</dt>
                  <dd className="text-caption text-ink">{longDate(contract.startsOn)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">{t('contract.reference')}</dt>
                  <dd>
                    <Identifier>{contract.id}</Identifier>
                  </dd>
                </div>
              </dl>
            </Band>

            {/* What is covered, in plain words. */}
            <Band kind="rail" flush>
              <BandHead icon="check" eyebrow={t('contract.cover.eyebrow')} title={t('contract.cover.title')} />
              <RowList>
                {contract.entitlements.map((item) => (
                  <Row key={item}>
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
                <Micro>{t('contract.cover.notCovered')}</Micro>
                <p className="mt-1 text-caption text-ink2">
                  {t('contract.cover.notCoveredDetail')}
                </p>
              </div>
            </Band>

            {/* Used against included. The value made visible, not asserted. */}
            <Band kind="data" flush>
              <BandHead eyebrow={t('contract.value.eyebrow')} title={t('contract.value.title')} />
              <RowList>
                {visits.length === 0 ? (
                  <Row>
                    <p className="max-w-reading text-body text-ink2">{t('contract.value.empty')}</p>
                  </Row>
                ) : (
                  visits.map((visit) => {
                    const done = visit.status === 'complete';
                    return (
                      <Row key={visit.id} tone={done ? 'neutral' : 'strong'}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-body text-ink">
                              {visit.type === 'FMR'
                                ? t('contract.value.fmr')
                                : t('contract.value.inspection')}
                            </p>
                            <p className="mt-1 text-caption text-ink2">
                              {longDate(visit.scheduledFor)}
                            </p>
                            <div className="mt-1">
                              {/*
                                Done is positive and scheduled is information.

                                It used to be neutral against good, and neutral
                                fills with `--surface`, which is also the ground
                                of the Data band these rows sit on, so the pill
                                disappeared into the band and only its label
                                showed. That was invisible until this account
                                gained a service history and the state actually
                                occurred. Neither of these is a null state
                                anyway: a completed covered visit is the plan
                                doing its job.
                              */}
                              <Status tone={done ? 'good' : 'info'}>
                                {done
                                  ? t('contract.value.done')
                                  : t('contract.value.scheduled')}
                              </Status>
                            </div>
                          </div>
                          <p className="shrink-0 text-caption text-positive">
                            {t('contract.value.included')}
                          </p>
                        </div>
                      </Row>
                    );
                  })
                )}
              </RowList>

              {/*
                The renewal defence, stated as a figure rather than asserted.

                Nowhere did this product say what the plan had returned. A
                customer deciding whether to renew was being asked to remember
                two years of visits and price them himself. Both inputs are
                assumptions and both are in ASSUMPTIONS in seedData with a TODO
                on them; the figure is computed from committed covered work, so
                a replacement booked for next week counts, because it is value
                the plan has already delivered.
              */}
              {value && (
                <div className="border-t border-line bg-surface-sunk px-gutter py-4">
                  <Micro>{t('contract.value.covered')}</Micro>
                  <p className="mt-1 text-display text-positive">
                    {money(shownCovered, value.currency)}
                  </p>
                  {value.ahead > 0 && (
                    <p className="mt-1 text-body text-ink2">
                      {t('contract.value.ahead', {
                        amount: money(value.ahead, value.currency),
                      })}
                    </p>
                  )}
                  <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3">
                    <div className="min-w-0">
                      <Micro>{t('contract.value.withoutPlan')}</Micro>
                      <p className="mt-1 text-caption text-ink2">
                        {t('contract.value.withoutPlanDetail')}
                      </p>
                    </div>
                    <p className="text-body font-medium text-ink">{money(wouldHaveCost)}</p>
                  </div>
                </div>
              )}
            </Band>

            {/* Changing or ending it, offered plainly rather than buried. */}
            <Band kind="rail" flush>
              <BandHead
                icon="info"
                iconTone="neutral"
                eyebrow={t('contract.options.eyebrow')}
                title={t('contract.options.title')}
              />
              <div className="space-y-3 px-gutter py-3">
                <div>
                  <p className="text-body text-ink">{t('contract.options.moveRenewal')}</p>
                  <p className="mt-1 text-caption text-ink2">
                    {t('contract.options.moveRenewalDetail')}
                  </p>
                </div>
                <div>
                  <p className="text-body text-ink">{t('contract.options.end')}</p>
                  <p className="mt-1 text-caption text-ink2">
                    {t('contract.options.endDetail', { date: longDate(contract.renewsOn) })}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line px-gutter py-3">
                <ButtonLink to="/messages" variant="quiet" icon="message-square">
                  {t('contract.options.ask')}
                </ButtonLink>
                <Button variant="quiet">{t('contract.options.end')}</Button>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
