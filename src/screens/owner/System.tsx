/**
 * screens/owner/System.tsx
 *
 * Screen 8. My system.
 *
 * The unified timeline is the argument this screen exists to make. Service
 * visits and parts orders arrive from different systems, and the customer does
 * not care which. Merging them into one chronological list is the single-login
 * case made visible rather than asserted.
 *
 * Condition is stated in plain language, not scored. A health percentage would
 * be a number we cannot defend.
 */

import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  accounts,
  assets,
  byId,
  contracts,
  customerTimeline,
  orders,
  workOrders,
} from '../../data/seedData';
import { longDate, money, shortDate } from '../../lib/format';
import {
  Band,
  BandHead,
  ButtonLink,
  Field,
  Icon,
  Identifier,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/** Condition in words. The status enum never reaches the customer. */
const CONDITION: Record<string, { line: string; detail: string; tone: 'good' | 'warn' | 'alert' }> = {
  healthy: {
    line: 'Working as it should',
    detail: 'Nothing needs your attention. We check it at every visit.',
    tone: 'good',
  },
  attention: {
    line: 'Worth a look',
    detail: 'We noticed something at the last visit and we are keeping an eye on it.',
    tone: 'warn',
  },
  'service-due': {
    line: 'Service is due',
    detail: 'We will be in touch to arrange a visit.',
    tone: 'alert',
  },
};

export const OwnerSystem = () => {
  const account = byId(accounts, GOLDEN.accountId)!;
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;
  const condition = CONDITION[asset.status];
  const timeline = customerTimeline(account.id);

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow="Your system"
          subject={asset.product}
          lead={`At ${account.address}, ${account.city}.`}
        />

        {/* ---------------------------------------------------------------- */}
        <Section id="system-info">
          <Band kind="rail" flush>
            {/* Real content: the property this system is installed at. */}
            <img
              src="/img/property.jpg"
              alt={`The property at ${account.address}`}
              className="h-[160px] w-full border-b border-line object-cover"
            />

            <div className="px-gutter py-3">
              <Status tone={condition.tone}>{condition.line}</Status>
              <p className="mt-2 text-body text-ink">{condition.detail}</p>
            </div>

            <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
              <Field label="Model" value={asset.model} mono />
              <Field label="Serial number" value={asset.serial} mono />
              <Field label="Installed" value={longDate(asset.installedOn)} />
              <Field label="Last visit" value={longDate(asset.lastServiceOn)} />
              <Field label="Warranty until" value={longDate(asset.warrantyEndsOn)} />
            </dl>
          </Band>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* One timeline. Visits and orders together, newest first.          */}
        {/* ---------------------------------------------------------------- */}
        <Section id="system-history">
          <Band kind="data" flush>
            <BandHead
              eyebrow="Everything that has happened"
              title="Service history"
              action={<Identifier className="text-ink3">{`${timeline.length} entries`}</Identifier>}
            />
            <RowList>
              {timeline.map((entry) => {
                const isVisit = entry.kind === 'visit';
                const order = isVisit ? undefined : byId(orders, entry.id);
                const visit = isVisit ? byId(workOrders, entry.id) : undefined;

                return (
                  <Row gutter key={entry.id} tone={isVisit ? 'neutral' : 'none'}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-ink3">
                        <Icon name={isVisit ? 'calendar' : 'package'} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-body text-ink">
                            {isVisit ? 'Maintenance visit' : 'Parts order'}
                          </p>
                          <p className="shrink-0 text-caption text-ink2">{shortDate(entry.date)}</p>
                        </div>

                        {/* The plain-language summary, not the checklist. */}
                        {visit?.customerSummary && (
                          <p className="mt-1 text-caption text-ink2">{visit.customerSummary}</p>
                        )}

                        {order && (
                          <p className="mt-1 text-caption text-ink2">
                            {order.lines
                              .map((line) => `${line.quantity} x ${line.sku}`)
                              .join(', ')}
                            . {money(order.total_jde, order.currency)}.
                          </p>
                        )}
                      </div>
                    </div>
                  </Row>
                );
              })}
            </RowList>
          </Band>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section id="system-documents">
          <Band kind="rail" flush>
            <BandHead icon="file-text" eyebrow="Yours to keep" title="Documents" />
            <RowList>
              {[
                { label: 'Installation certificate', detail: longDate(asset.installedOn) },
                { label: 'Warranty terms', detail: `Valid to ${longDate(asset.warrantyEndsOn)}` },
                { label: 'Care plan', detail: contract.name },
                { label: 'Owner guide', detail: `For the ${asset.model}` },
              ].map((document) => (
                <Row gutter key={document.label}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 text-ink3">
                        <Icon name="file-text" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">{document.label}</p>
                        <p className="text-caption text-ink2">{document.detail}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-ink3">
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </Row>
              ))}
            </RowList>
          </Band>
        </Section>

        <Band kind="data" flush>
          <div className="px-gutter py-3">
            <Micro>Moving out</Micro>
            <p className="mt-1 text-caption text-ink2">
              Selling the property? The system, its history and its care plan can move to the new
              owner.
            </p>
            <ButtonLink to="/system/transfer" variant="quiet" className="mt-3">
              Transfer to a new owner
            </ButtonLink>
          </div>
        </Band>
      </div>
    </>
  );
};
