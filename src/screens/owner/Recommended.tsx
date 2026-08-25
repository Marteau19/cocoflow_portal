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
  assets,
  byId,
  products,
  workOrders,
} from '../../data/seedData';
import { plural, t } from '../../i18n';
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
  const asset = byId(assets, GOLDEN.assetId)!;
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
      label: t('recommended.riser.label'),
      why: t('recommended.riser.why'),
      basedOn: t('recommended.riser.basedOn'),
      prevents: t('recommended.riser.prevents'),
      price: riser?.price_jde ?? null,
      urgency: 'worth-knowing',
      sku: riser?.sku,
    },
    {
      id: 'spare-seal',
      label: t('recommended.seal.label'),
      why: t('recommended.seal.why', { date: longDate(nextVisit.scheduledFor) }),
      basedOn: t('recommended.seal.basedOn', { id: nextVisit.id }),
      prevents: t('recommended.seal.prevents'),
      price: seal?.price_jde ?? null,
      urgency: 'worth-knowing',
      sku: seal?.sku,
    },
    {
      id: 'effluent-filter',
      label: t('recommended.filter.label'),
      why: t('recommended.filter.why', { years: yearsInstalled }),
      basedOn: t('recommended.filter.basedOn', { date: longDate(asset.installedOn) }),
      prevents: t('recommended.filter.prevents'),
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
    <>
      <div className="contents">
        <Masthead
          eyebrow={t('recommended.eyebrow')}
          subject={t('recommended.title')}
          lead={t('recommended.lead', { model: asset.model })}
        />

        <Section id="recommended">
          <div className="contents">
            {shown.length === 0 ? (
              <Band kind="data" flush>
                <div className="px-gutter py-6">
                  {/*
                    An empty state is an invitation, not an apology. "Nothing to
                    suggest right now" opens by naming an absence; the fact worth
                    leading with is that the system is covered.
                  */}
                  <p className="max-w-reading text-body text-ink2">{t('recommended.empty')}</p>
                </div>
              </Band>
            ) : (
              <>
                {due.length > 0 && (
                  <Band kind="rail" flush>
                    <BandHead
                      eyebrow="Due now"
                      title={t('recommended.due.title')}
                      action={<Status tone="good">{t('recommended.due.noCharge')}</Status>}
                    />
                    <RowList>
                      {due.map((item) => (
                        <Item key={item.id} item={item} />
                      ))}
                    </RowList>
                  </Band>
                )}

                {later.length > 0 && (
                  <Band kind="data" flush>
                    <BandHead
                      eyebrow={t('recommended.later.eyebrow')}
                      title={t('recommended.later.title')}
                    />
                    <RowList>
                      {later.map((item) => (
                        <Item key={item.id} item={item} />
                      ))}
                    </RowList>
                  </Band>
                )}
              </>
            )}

            {/* How this list is built. Said out loud rather than implied. */}
            <Band kind="rail" flush>
              <div className="px-gutter py-3">
                <Micro>{t('recommended.method.label')}</Micro>
                <p className="mt-1 max-w-reading text-caption text-ink2">
                  {t('recommended.method.detail')}
                </p>
                {declined.length > 0 && (
                  <p className="mt-2 text-caption text-ink3">
                    {plural(declined.length, {
                      one: 'recommended.hiddenOne',
                      other: 'recommended.hiddenOther',
                    })}
                  </p>
                )}
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
