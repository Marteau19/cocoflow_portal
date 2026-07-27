/**
 * screens/technician/FieldQuote.tsx
 *
 * Screen 19. Field quote.
 *
 * Quoting extra work while standing at the system, before leaving site.
 *
 * The commercial case for this screen: work found on site and quoted from the
 * truck converts far better than work written on a card and quoted from the
 * office three days later. That conversion is a direct input to the service
 * revenue mix the network is measured on.
 *
 * The design case: the technician must not be able to invent a price. Parts come
 * from the ERP and labour comes from a rate card, so the figure the customer sees
 * on site is the same figure the invoice will carry.
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Section } from '../../blueprint/Section';
import {
  accounts,
  assets,
  byId,
  contacts,
  contracts,
  products,
  workOrders,
} from '../../data/seedData';
import { money } from '../../lib/format';
import {
  Button,
  Card,
  CardHeader,
  Flag,
  Icon,
  Identifier,
  Micro,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/** Labour comes off a rate card, never off the technician's judgement. */
const LABOUR_RATE_PER_HOUR = 95;

/** What a technician can find on an EC-5 that falls outside a care plan. */
const FINDINGS = [
  {
    id: 'pump',
    label: 'Effluent pump is drawing hard',
    detail: 'Running longer each cycle. It will fail, and it fails in the wet season.',
    sku: 'PMP-EFF-12',
    hours: 1.5,
  },
  {
    id: 'riser',
    label: 'Riser is below grade',
    detail: 'Water pools over the lid. Adding a 6 inch extension keeps it dry and accessible.',
    sku: 'ACC-RISER-6',
    hours: 1,
  },
  {
    id: 'panel',
    label: 'Control panel is the original',
    detail: 'Still working. A two stage panel would give an alarm before a failure, not after.',
    sku: 'CTL-PANEL-2',
    hours: 2,
  },
];

export const TechnicianFieldQuote = () => {
  const { id } = useParams();
  const order = byId(workOrders, id ?? '') ?? byId(workOrders, 'WO-2026-0412')!;
  const account = byId(accounts, order.accountId)!;
  const asset = byId(assets, order.assetId)!;
  const contract = order.contractId ? byId(contracts, order.contractId) : undefined;
  const customer = contacts.find((c) => c.accountId === account.id && c.isPrimary)!;

  const [selected, setSelected] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<'approved' | 'declined' | null>(null);

  const toggle = (findingId: string) =>
    setSelected((current) =>
      current.includes(findingId)
        ? current.filter((f) => f !== findingId)
        : [...current, findingId],
    );

  const lines = FINDINGS.filter((f) => selected.includes(f.id)).map((finding) => {
    const product = products.find((p) => p.sku === finding.sku);
    const parts = product?.price_jde ?? 0;
    const labour = Math.round(finding.hours * LABOUR_RATE_PER_HOUR);
    return { ...finding, product, parts, labour, total: parts + labour };
  });

  const total = lines.reduce((sum, line) => sum + line.total, 0);

  /* ------------------------------------------------------------------ */
  if (outcome) {
    return (
      <ScreenBody>
        <Stack gap="3">
          <header>
            <Micro>{order.id}</Micro>
            <h1 className="mt-1 text-h1 text-ink">
              {outcome === 'approved' ? 'Quote approved on site' : 'Quote declined'}
            </h1>
          </header>
          <Card>
            <div className="px-4 py-3">
              <Status tone={outcome === 'approved' ? 'good' : 'neutral'}>
                {outcome === 'approved' ? 'APPROVED' : 'DECLINED'}
              </Status>
              <p className="mt-2 max-w-reading text-body text-ink2">
                {outcome === 'approved'
                  ? `${customer.firstName} approved ${money(total)} of extra work. The Service Point will schedule it and the customer sees it in their portal now.`
                  : `Recorded as declined, with what you found. It stays on the system record so the next visit knows to look, and nobody chases ${customer.firstName} about it.`}
              </p>
            </div>
          </Card>
        </Stack>
      </ScreenBody>
    );
  }

  /* ------------------------------------------------------------------ */
  return (
    <ScreenBody>
      <Stack gap="3">
        <header>
          <Micro>{order.id}</Micro>
          <h1 className="mt-1 text-h1 text-ink">Quote extra work</h1>
          <p className="mt-1 text-caption text-ink2">
            {account.name}, {asset.model}. Priced now, while you are standing at it.
          </p>
        </header>

        <Section id="field-quote">
          <Stack gap="3">
            {/* What is already covered, so nothing gets quoted twice. */}
            {contract && (
              <Card>
                <div className="px-4 py-3">
                  <Flag tone="neutral" icon="info">
                    {`${contract.name} is active`}
                  </Flag>
                  <p className="mt-2 text-caption text-ink2">
                    Filter media and the annual check are already covered. Only quote what falls
                    outside it.
                  </p>
                </div>
              </Card>
            )}

            {/* What you found. */}
            <Card>
              <CardHeader
                title="What did you find?"
                eyebrow={selected.length === 0 ? 'Nothing selected' : `${selected.length} selected`}
              />
              <div className="divide-y divide-line">
                {FINDINGS.map((finding) => {
                  const chosen = selected.includes(finding.id);
                  const product = products.find((p) => p.sku === finding.sku);
                  return (
                    <button
                      key={finding.id}
                      type="button"
                      onClick={() => toggle(finding.id)}
                      aria-pressed={chosen}
                      className={`flex min-h-tap w-full items-start justify-between gap-3 border-l-rule px-4 py-3 text-left transition-colors duration-state ease-ease ${
                        chosen ? 'border-l-ink bg-surface-sunk' : 'border-l-line-strong'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className={`text-body text-ink ${chosen ? 'font-medium' : ''}`}>
                          {finding.label}
                        </p>
                        <p className="mt-1 text-caption text-ink2">{finding.detail}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Identifier>{finding.sku}</Identifier>
                          <span className="text-caption text-ink3">
                            {money(product?.price_jde ?? 0)} part
                          </span>
                          <span className="text-caption text-ink3">
                            {finding.hours} h labour
                          </span>
                        </div>
                      </div>
                      <span
                        className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-control border ${
                          chosen ? 'border-ink bg-ink text-canvas' : 'border-line-strong text-transparent'
                        }`}
                      >
                        <Icon name="check" />
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-line px-4 py-3">
                <Button variant="quiet" icon="camera">
                  Photograph what you found
                </Button>
                <p className="mt-2 text-caption text-ink2">
                  A photo of the fault is what makes the quote easy to say yes to.
                </p>
              </div>
            </Card>

            {/* The price. Parts from the ERP, labour from the rate card. */}
            {lines.length > 0 && (
              <Card>
                <CardHeader title="The quote" eyebrow="Parts from the ERP, labour from the rate card" />
                <RowList>
                  {lines.map((line) => (
                    <Row key={line.id}>
                      <div className="min-w-0">
                        <p className="text-body text-ink">{line.product?.name ?? line.label}</p>
                        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-caption text-ink2">
                            {money(line.parts)} part, {money(line.labour)} labour
                          </span>
                          <span className="text-h2 text-ink">{money(line.total)}</span>
                        </div>
                      </div>
                    </Row>
                  ))}
                </RowList>

                <div className="flex items-baseline justify-between gap-3 border-t border-line bg-surface-sunk px-4 py-3">
                  <div>
                    <Micro>Total</Micro>
                    <p className="mt-1 text-caption text-ink2">Taxes on the invoice</p>
                  </div>
                  <p className="text-display text-ink">{money(total)}</p>
                </div>

                <div className="border-t border-line px-4 py-3">
                  <p className="text-caption text-ink2">
                    You cannot change these figures on the device. That is deliberate: what{' '}
                    {customer.firstName} agrees to here is exactly what the invoice will say.
                  </p>
                </div>
              </Card>
            )}

            {/* Customer decision, captured on site. */}
            <Card>
              <CardHeader
                title={`Show ${customer.firstName}`}
                eyebrow="Their decision, on your device"
              />
              <div className="px-4 py-3">
                <p className="text-caption text-ink2">
                  Hand them the device. Declining is a normal outcome and is recorded properly, so
                  nobody chases them about it afterwards.
                </p>
              </div>
              <div className="flex flex-col gap-2 border-t border-line px-4 py-3 min-[480px]:flex-row">
                <Button
                  variant="primary"
                  icon="check"
                  block
                  disabled={lines.length === 0}
                  onClick={() => setOutcome('approved')}
                >
                  Approve
                </Button>
                <Button
                  variant="quiet"
                  block
                  disabled={lines.length === 0}
                  onClick={() => setOutcome('declined')}
                >
                  Not today
                </Button>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
