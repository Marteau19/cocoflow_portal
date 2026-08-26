/**
 * screens/owner/Invoices.tsx
 *
 * Screen 9. Invoices and payment.
 *
 * What is owed, what is paid, and what is on autopay.
 *
 * Every invoice says what it was for and links to the visit or order that caused
 * it. A line item a customer cannot trace back to something that happened is how
 * a billing query becomes a phone call, and self-serve billing is one of the
 * measures the network is held to.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  byId,
  contracts,
  orders,
  workOrders,
} from '../../data/seedData';
import { plural, t } from '../../i18n';
import { longDate, money, shortDate } from '../../lib/format';
import {
  Band,
  BandHead,
  Icon,
  Identifier,
  Kpi,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
  Toggle,
} from '../../ui/primitives';

/**
 * Invoices are derived from the records that caused them rather than typed as a
 * separate list, so every row can point at the visit or the order behind it.
 * Real invoices are mastered in the ERP; this is the shape they arrive in.
 */
const invoicesFor = (accountId: string) => {
  const contract = contracts.find((c) => c.accountId === accountId && c.status === 'active');

  const fromOrders = orders
    .filter((o) => o.accountId === accountId)
    .map((o) => ({
      id: o.id.replace('ORD', 'INV'),
      date: o.placedOn,
      label: t('invoices.history.partsOrder'),
      detail: o.lines.map((l) => `${l.quantity} x ${l.sku}`).join(', '),
      amount: o.total_jde,
      paid: true,
      relatesTo: { kind: 'order' as const, id: o.id, to: '/parts' },
    }));

  const fromVisits = workOrders
    .filter((w) => w.accountId === accountId && w.status === 'complete' && !w.contractId)
    .map((w) => ({
      id: w.id.replace('WO', 'INV'),
      date: w.scheduledFor,
      label: t('invoices.history.visitUncovered'),
      detail: t('invoices.history.inspection'),
      amount: 145,
      paid: true,
      relatesTo: { kind: 'visit' as const, id: w.id, to: '/system' },
    }));

  const fromContract = contract
    ? [
        {
          id: contract.id.replace('SC', 'INV'),
          date: contract.startsOn,
          label: t('invoices.history.planAnnual', { plan: contract.name }),
          detail: t('invoices.history.covers', { date: longDate(contract.renewsOn) }),
          amount: contract.annualPrice_jde,
          paid: true,
          relatesTo: { kind: 'contract' as const, id: contract.id, to: '/contract' },
        },
      ]
    : [];

  return [...fromOrders, ...fromVisits, ...fromContract].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
};

export const OwnerInvoices = () => {
  const contract = byId(contracts, GOLDEN.contractId)!;
  const invoices = invoicesFor(GOLDEN.accountId);

  // Local to the screen, seeded from the contract. The prototype has no backend,
  // so a customer can flip this and see the copy and the row state follow, which
  // is the part reviewers ask about.
  const [autopay, setAutopay] = useState(contract.autopay);

  const outstanding = invoices.filter((i) => !i.paid);
  const owed = outstanding.reduce((sum, i) => sum + i.amount, 0);
  const paidThisYear = invoices
    .filter((i) => i.paid && i.date.startsWith('2026'))
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={t('invoices.eyebrow')}
          subject={t('invoices.title')}
        />

        <Section id="invoices">
          <div className="contents">
            {/* The one question first: do I owe anything. */}
            <Band kind="data" flush>
              <div className="px-gutter py-4">
                {owed > 0 ? (
                  <Kpi
                    label={t('invoices.outstanding')}
                    value={money(owed)}
                    note={plural(outstanding.length, {
                      one: 'invoices.unpaidOne',
                      other: 'invoices.unpaidOther',
                    })}
                  />
                ) : (
                  <>
                    {/*
                      "Nothing" set at display size, above "You are up to date.
                      Your care plan is paid to 14 May 2027." Two sentences and a
                      negation to say one positive thing. "All clear" states the
                      same fact as the answer to the question the reader arrived
                      with, and the line under it carries the only detail that
                      adds anything.
                    */}
                    <Micro>{t('invoices.outstanding')}</Micro>
                    <p className="mt-1 text-display text-positive">{t('invoices.allClear')}</p>
                    <p className="mt-2 text-body text-ink2">
                      {t('invoices.paidTo', { date: longDate(contract.renewsOn) })}
                    </p>
                  </>
                )}
              </div>

              <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">{t('invoices.paidThisYear')}</dt>
                  <dd className="text-body font-medium text-ink">{money(paidThisYear)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">{t('invoices.nextCharge')}</dt>
                  <dd className="text-right text-caption text-ink">
                    {t('invoices.nextChargeValue', {
                      amount: money(contract.annualPrice_jde),
                      date: shortDate(contract.renewsOn),
                    })}
                  </dd>
                </div>
              </dl>
            </Band>

            {/* Payment method and autopay state. */}
            <Band kind="rail" flush>
              <BandHead title={t('invoices.payment.title')} />
              <RowList>
                <Row>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-body text-ink">
                        {t('invoices.payment.card', { last4: '4417' })}
                      </p>
                      <p className="text-caption text-ink2">
                        {t('invoices.payment.expires', { date: '09 / 2028' })}
                      </p>
                    </div>
                    <span className="shrink-0 text-caption text-accent-ink">
                      {t('invoices.payment.change')}
                    </span>
                  </div>
                </Row>
                {/*
                  A real switch rather than a "Turn off" link. Autopay is the one
                  setting on this screen a customer changes, and a link that says
                  "Turn off" makes them read the sentence twice to work out which
                  state they are currently in. The switch shows the state and the
                  action at once.
                */}
                <Row tone={autopay ? 'positive' : 'warn'}>
                  <Toggle
                    label={
                      autopay
                        ? t('invoices.payment.autopayOn')
                        : t('invoices.payment.autopayOff')
                    }
                    checked={autopay}
                    onChange={setAutopay}
                    hint={
                      autopay
                        ? t('invoices.payment.autopayOnHint')
                        : t('invoices.payment.autopayOffHint')
                    }
                  />
                </Row>
              </RowList>
            </Band>

            {/* History, each row traceable to what caused it. */}
            <Band kind="data" flush>
              <BandHead
                title={t('invoices.history.title')}
                action={
                  <Identifier className="text-ink3">
                    {plural(invoices.length, {
                      one: 'invoices.history.countOne',
                      other: 'invoices.history.countOther',
                    })}
                  </Identifier>
                }
              />
              <RowList>
                {invoices.map((invoice) => (
                  <Row key={invoice.id} to={invoice.relatesTo.to}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <p className="text-body text-ink">{invoice.label}</p>
                          <Status tone={invoice.paid ? 'neutral' : 'warn'}>
                            {invoice.paid
                              ? t('invoices.history.paid')
                              : t('invoices.history.due')}
                          </Status>
                        </div>
                        <p className="mt-1 text-caption text-ink2">{invoice.detail}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Identifier>{invoice.id}</Identifier>
                          <span className="text-caption text-ink3">{shortDate(invoice.date)}</span>
                          {/* The traceability that keeps this off the phone. */}
                          <span className="inline-flex items-center gap-1 text-caption text-ink3">
                            <Icon name="file-text" />
                            {invoice.relatesTo.id}
                          </span>
                        </div>
                      </div>
                      <p className="shrink-0 text-body font-medium text-ink">{money(invoice.amount)}</p>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                <p className="text-caption text-ink2">{t('invoices.history.note')}</p>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
