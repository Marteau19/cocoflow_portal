/**
 * screens/manager/Marcom.tsx
 *
 * Screen 25. MARCOM catalogue.
 *
 * Not a merch store. Without the campaign results tab this screen reads as
 * shopping, so the closed loop is the point: what was ordered, and what it
 * generated, attributed back through the lead source.
 *
 * Custom fields per item are part of the order flow rather than a detail. A door
 * hanger without the local phone number on it is waste.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  byId,
  leads,
  marcomCatalogue,
  marcomOrders,
  territories,
  type MarcomItem,
} from '../../data/seedData';
import { money, shortDate } from '../../lib/format';
import {
  Button,
  Card,
  CardHeader,
  Icon,
  Identifier,
  Kpi,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

const CATEGORY: Record<MarcomItem['category'], string> = {
  print: 'Print',
  signage: 'Signage',
  merchandise: 'Merchandise',
  digital: 'Digital',
};

const ORDER_STATUS: Record<string, { label: string; tone: 'neutral' | 'good' | 'warn' }> = {
  submitted: { label: 'SUBMITTED', tone: 'neutral' },
  'in-production': { label: 'IN PRODUCTION', tone: 'warn' },
  shipped: { label: 'SHIPPED', tone: 'neutral' },
  live: { label: 'LIVE', tone: 'good' },
  complete: { label: 'COMPLETE', tone: 'neutral' },
};

export const ManagerMarcom = () => {
  const territory = byId(territories, GOLDEN.territoryId)!;
  const [tab, setTab] = useState<'catalogue' | 'results'>('catalogue');
  const [selected, setSelected] = useState<string | null>(null);

  const orders = marcomOrders.filter((o) => o.territoryId === territory.id);
  const attributed = orders.reduce((sum, o) => sum + (o.leadsAttributed ?? 0), 0);
  const spend = orders.reduce((sum, o) => {
    const item = byId(marcomCatalogue, o.itemId);
    return sum + (item ? item.unitPrice * o.quantity : 0);
  }, 0);

  // Leads whose source is a channel MARCOM can influence.
  const attributableLeads = leads.filter(
    (l) => l.territoryId === territory.id && (l.source === 'web' || l.source === 'referral'),
  );

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow={territory.name}
          title="MARCOM catalogue"
          lead="Order local marketing, then see what it generated."
        />

        {/* Two registers of the same subject. Tabs, not separate screens. */}
        <div className="flex items-center gap-2 border-b border-line">
          {[
            { key: 'catalogue' as const, label: 'Catalogue' },
            { key: 'results' as const, label: 'Campaign results' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              aria-selected={tab === item.key}
              className={`min-h-tap border-b-2 px-1 text-body transition-colors duration-state ease-ease ${
                tab === item.key
                  ? 'border-b-accent font-medium text-ink'
                  : 'border-b-transparent text-ink2 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'catalogue' ? (
          <Section id="marcom-catalogue">
            <Stack gap="4">
              <Card>
                <CardHeader title="Available to order" eyebrow={`${marcomCatalogue.length} items`} />
                <RowList>
                  {marcomCatalogue.map((item) => {
                    const open = selected === item.id;
                    return (
                      <div key={item.id}>
                        <Row>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <p className="text-body text-ink">{item.name}</p>
                                <Status>{CATEGORY[item.category].toUpperCase()}</Status>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-3">
                                <span className="text-caption text-ink">
                                  {money(item.unitPrice, item.currency)} each
                                </span>
                                <span className="text-caption text-ink3">
                                  Minimum {item.minQuantity}
                                </span>
                                <span className="text-caption text-ink3">
                                  {item.leadTimeDays} day lead time
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="quiet"
                              onClick={() => setSelected(open ? null : item.id)}
                            >
                              {open ? 'Close' : 'Order'}
                            </Button>
                          </div>
                        </Row>

                        {/* Custom fields. What makes a generic asset local. */}
                        {open && (
                          <div className="border-t border-line bg-surface-sunk px-4 py-3">
                            <Micro>Personalise this order</Micro>
                            {item.customFields.length === 0 ? (
                              <p className="mt-2 text-caption text-ink2">
                                Nothing to personalise on this item.
                              </p>
                            ) : (
                              <div className="mt-2 space-y-3">
                                {item.customFields.map((field) => (
                                  <label key={field.key} className="block">
                                    <span className="text-caption text-ink2">{field.label}</span>
                                    {field.type === 'select' ? (
                                      <select className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink">
                                        <option>Choose</option>
                                        <option>Within 25 km</option>
                                        <option>Within 50 km</option>
                                      </select>
                                    ) : (
                                      <input
                                        type="text"
                                        defaultValue={
                                          field.key === 'sp'
                                            ? territory.name
                                            : field.key === 'phone'
                                              ? '+1 819 555 0100'
                                              : ''
                                        }
                                        className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                                      />
                                    )}
                                  </label>
                                ))}
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-2">
                              <label className="flex-1">
                                <span className="text-caption text-ink2">Quantity</span>
                                <input
                                  type="number"
                                  defaultValue={item.minQuantity}
                                  min={item.minQuantity}
                                  className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                                />
                              </label>
                              <Button variant="primary" className="mt-4">
                                Submit order
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </RowList>
              </Card>
            </Stack>
          </Section>
        ) : (
          <Section id="marcom-results">
            <Stack gap="4">
              {/* The closed loop, stated as numbers first. */}
              <Card>
                <div className="grid gap-4 border-b border-line px-4 py-4 md:grid-cols-[1.4fr_1fr_1fr]">
                  <Kpi
                    label="Leads attributed"
                    value={String(attributed)}
                    note="From campaigns run by this Service Point"
                    tone="accent"
                  />
                  <Kpi label="Spend" value={money(spend)} note="Across all campaigns" />
                  <Kpi
                    label="Cost per lead"
                    value={attributed > 0 ? money(spend / attributed) : 'n/a'}
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-caption text-ink2">
                    Attribution comes from the source recorded on each lead. Without that link this
                    screen would only show what was ordered, which is shopping rather than marketing.
                  </p>
                </div>
              </Card>

              <Card>
                <CardHeader title="Campaigns" eyebrow="Ordered by this Service Point" />
                <RowList>
                  {orders.map((order) => {
                    const item = byId(marcomCatalogue, order.itemId)!;
                    const status = ORDER_STATUS[order.status];
                    const cost = item.unitPrice * order.quantity;
                    return (
                      <Row
                        key={order.id}
                        rule={order.leadsAttributed ? 'strong' : 'neutral'}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <p className="text-body text-ink">{item.name}</p>
                              <Status tone={status.tone}>{status.label}</Status>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3">
                              <Identifier>{order.id}</Identifier>
                              <span className="text-caption text-ink3">
                                {order.quantity.toLocaleString('en-CA')} units
                              </span>
                              <span className="text-caption text-ink3">{money(cost)}</span>
                              <span className="text-caption text-ink3">
                                {shortDate(order.placedOn)}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            {order.leadsAttributed === null ? (
                              <p className="text-caption text-ink3">Not live yet</p>
                            ) : (
                              <>
                                <p className="text-h2 text-ink">{order.leadsAttributed}</p>
                                <p className="text-caption text-ink2">leads</p>
                              </>
                            )}
                          </div>
                        </div>
                      </Row>
                    );
                  })}
                </RowList>
              </Card>

              <Card>
                <CardHeader title="Leads from these channels" eyebrow="Traced back" />
                <RowList>
                  {attributableLeads.map((lead) => (
                    <Row key={lead.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-body text-ink">{lead.name}</p>
                          <p className="text-caption text-ink2">
                            {lead.city}, from {lead.source === 'web' ? 'the website' : 'a referral'}
                          </p>
                        </div>
                        <Identifier className="shrink-0 text-ink3">{lead.id}</Identifier>
                      </div>
                    </Row>
                  ))}
                </RowList>
                <div className="border-t border-line px-4 py-3">
                  <p className="flex items-start gap-2 text-caption text-ink2">
                    <span className="mt-1 shrink-0">
                      <Icon name="info" />
                    </span>
                    <span>
                      Attribution here is by channel. Attributing a lead to a specific campaign
                      needs a tracked number or a landing page per campaign, which is not yet decided.
                    </span>
                  </p>
                </div>
              </Card>
            </Stack>
          </Section>
        )}
      </Stack>
    </ScreenBody>
  );
};
