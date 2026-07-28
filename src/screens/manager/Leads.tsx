/**
 * screens/manager/Leads.tsx
 *
 * Screen 24. Leads.
 *
 * Bordered rows, stage as a text label and a tinted ground. Source matters as much
 * as stage here: attribution is what makes the MARCOM screen's closed loop
 * possible, so it is a column rather than a detail.
 *
 * Lead, stage and source are internal words. They never appear on a customer
 * surface.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import { GOLDEN, byId, leads, quotes, territories, type Lead } from '../../data/seedData';
import { money, shortDate } from '../../lib/format';
import {
  Card,
  CardHeader,
  Empty,
  Icon,
  Identifier,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
  Tabs,
  type RowTone,
  type StatusTone,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

const STAGE: Record<Lead['status'], { label: string; rule: RowTone; tone: StatusTone }> = {
  new: { label: 'NEW', rule: 'warn', tone: 'warn' },
  contacted: { label: 'CONTACTED', rule: 'neutral', tone: 'neutral' },
  'soil-test-booked': { label: 'SOIL TEST BOOKED', rule: 'neutral', tone: 'neutral' },
  quoted: { label: 'QUOTED', rule: 'strong', tone: 'good' },
  won: { label: 'WON', rule: 'strong', tone: 'good' },
  lost: { label: 'LOST', rule: 'none', tone: 'neutral' },
};

const REASON: Record<Lead['reason'], string> = {
  'new-build': 'New build',
  'replacing-failing': 'Replacing a failing system',
  'buying-selling': 'Buying or selling',
  'not-sure': 'Not sure yet',
};

const SOURCE: Record<Lead['source'], string> = {
  web: 'Website',
  pumping: 'Pumping visit',
  inspection: 'Inspection',
  transfer: 'Ownership transfer',
  referral: 'Referral',
};

type Filter = 'all' | 'needs-contact' | 'in-progress';

export const ManagerLeads = () => {
  const territory = byId(territories, GOLDEN.territoryId)!;
  const [filter, setFilter] = useState<Filter>('all');

  const mine = leads.filter((l) => l.territoryId === territory.id);
  const shown = mine.filter((lead) => {
    if (filter === 'needs-contact') return lead.status === 'new';
    if (filter === 'in-progress')
      return lead.status === 'contacted' || lead.status === 'soil-test-booked' || lead.status === 'quoted';
    return true;
  });

  const filters: Array<{ key: Filter; label: string; count: number }> = [
    { key: 'all', label: 'All', count: mine.length },
    {
      key: 'needs-contact',
      label: 'Needs a call',
      count: mine.filter((l) => l.status === 'new').length,
    },
    {
      key: 'in-progress',
      label: 'In progress',
      count: mine.filter((l) =>
        ['contacted', 'soil-test-booked', 'quoted'].includes(l.status),
      ).length,
    },
  ];

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow={territory.name}
          title="Leads"
          lead="Who has asked for help, where they came from, and what stage they are at."
        />

        <Section id="leads">
          <Stack gap="4">
            <Tabs
              label="Filter leads"
              value={filter}
              onChange={setFilter}
              options={filters.map((chip) => ({
                value: chip.key,
                label: `${chip.label} ${chip.count}`,
              }))}
            />

            <Card>
              <CardHeader
                title={`${shown.length} ${shown.length === 1 ? 'lead' : 'leads'}`}
                eyebrow="Newest first"
              />

              {shown.length === 0 ? (
                <Empty line="No leads match this filter." />
              ) : (
                <RowList>
                  {[...shown]
                    .sort((a, b) => b.createdOn.localeCompare(a.createdOn))
                    .map((lead) => {
                      const stage = STAGE[lead.status];
                      const quote = quotes.find((q) => q.leadId === lead.id);
                      const isGolden = lead.id === GOLDEN.leadId;

                      return (
                        <Row key={lead.id} tone={stage.rule}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <p
                                  className={`text-body text-ink ${isGolden ? 'font-medium' : ''}`}
                                >
                                  {lead.name}
                                </p>
                                <Status tone={stage.tone}>{stage.label}</Status>
                              </div>

                              <p className="mt-1 text-caption text-ink2">
                                {lead.city}. {REASON[lead.reason]}.
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                <Identifier>{lead.id}</Identifier>
                                <span className="text-caption text-ink3">
                                  From {SOURCE[lead.source]}
                                </span>
                                <span className="text-caption text-ink3">
                                  {shortDate(lead.createdOn)}
                                </span>
                                {!lead.identityLinked && (
                                  <span className="inline-flex items-center gap-1 text-caption text-warn">
                                    <Icon name="alert-triangle" />
                                    No portal account yet
                                  </span>
                                )}
                              </div>

                              {quote && (
                                <p className="mt-2 text-caption text-ink">
                                  Quoted {money(quote.total_jde, quote.currency)}, valid{' '}
                                  {quote.validDays} days from {shortDate(quote.issuedOn)}
                                </p>
                              )}
                            </div>
                          </div>
                        </Row>
                      );
                    })}
                </RowList>
              )}
            </Card>

            <Card>
              <div className="px-4 py-3">
                <Micro>Why source matters</Micro>
                <p className="mt-1 text-caption text-ink2">
                  Every lead carries where it came from. That is what lets the MARCOM screen show
                  leads generated per campaign rather than just what was ordered.
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
