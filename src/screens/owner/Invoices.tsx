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

import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  byId,
  contracts,
  orders,
  workOrders,
} from '../../data/seedData';
import { longDate, money, shortDate } from '../../lib/format';
import {
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
      label: 'Parts order',
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
      label: 'Visit, not covered by your plan',
      detail: 'Inspection',
      amount: 145,
      paid: true,
      relatesTo: { kind: 'visit' as const, id: w.id, to: '/system' },
    }));

  const fromContract = contract
    ? [
        {
          id: contract.id.replace('SC', 'INV'),
          date: contract.startsOn,
          label: `${contract.name}, annual`,
          detail: `Covers to ${longDate(contract.renewsOn)}`,
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

  const outstanding = invoices.filter((i) => !i.paid);
  const owed = outstanding.reduce((sum, i) => sum + i.amount, 0);
  const paidThisYear = invoices
    .filter((i) => i.paid && i.date.startsWith('2026'))
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Billing"
          title="Invoices and payment"
          lead="Everything you have been charged, and what it was for."
        />

        <Section id="invoices">
          <Stack gap="4">
            {/* The one question first: do I owe anything. */}
            <Card>
              <div className="px-4 py-4">
                {owed > 0 ? (
                  <Kpi
                    label="Outstanding"
                    value={money(owed)}
                    note={`${outstanding.length} unpaid`}
                  />
                ) : (
                  <>
                    <Micro>Outstanding</Micro>
                    <p className="mt-1 text-display text-ink">Nothing</p>
                    <p className="mt-2 text-body text-ink2">
                      You are up to date. Your care plan is paid to{' '}
                      {longDate(contract.renewsOn)}.
                    </p>
                  </>
                )}
              </div>

              <dl className="divide-y divide-line border-t border-line">
                <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                  <dt className="text-caption text-ink2">Paid this year</dt>
                  <dd className="text-h2 text-ink">{money(paidThisYear)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                  <dt className="text-caption text-ink2">Next charge</dt>
                  <dd className="text-right text-caption text-ink">
                    {money(contract.annualPrice_jde)} on {shortDate(contract.renewsOn)}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Payment method and autopay state. */}
            <Card>
              <CardHeader eyebrow="How you pay" title="Payment method" />
              <RowList>
                <Row>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-body text-ink">Card ending 4417</p>
                      <p className="text-caption text-ink2">Expires 09 / 2028</p>
                    </div>
                    <span className="shrink-0 text-caption text-accent-ink">Change</span>
                  </div>
                </Row>
                <Row rule={contract.autopay ? 'strong' : 'warn'}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Status tone={contract.autopay ? 'good' : 'warn'}>
                        {contract.autopay ? 'AUTOPAY ON' : 'AUTOPAY OFF'}
                      </Status>
                      <p className="mt-1 text-caption text-ink2">
                        {contract.autopay
                          ? 'Your care plan renews and pays itself. We email you a week before.'
                          : 'You will be asked to pay each renewal.'}
                      </p>
                    </div>
                    <span className="shrink-0 text-caption text-accent-ink">
                      {contract.autopay ? 'Turn off' : 'Turn on'}
                    </span>
                  </div>
                </Row>
              </RowList>
            </Card>

            {/* History, each row traceable to what caused it. */}
            <Card>
              <CardHeader
                eyebrow="Everything so far"
                title="Invoice history"
                action={<Identifier className="text-ink3">{`${invoices.length} invoices`}</Identifier>}
              />
              <RowList>
                {invoices.map((invoice) => (
                  <Row key={invoice.id} to={invoice.relatesTo.to}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <p className="text-body text-ink">{invoice.label}</p>
                          <Status tone={invoice.paid ? 'neutral' : 'warn'}>
                            {invoice.paid ? 'PAID' : 'DUE'}
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
                      <p className="shrink-0 text-h2 text-ink">{money(invoice.amount)}</p>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-4 py-3">
                <p className="text-caption text-ink2">
                  Every invoice points at the visit or the order that caused it. Tap one to see what
                  happened.
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
