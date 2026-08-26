/**
 * screens/owner/Transfer.tsx
 *
 * Screen 14. Transfer ownership.
 *
 * The property is selling. The system, its history and its care plan move to the
 * new owner.
 *
 * This screen exists because septic systems outlive their owners' tenancy, and a
 * transferred system with no history is a system nobody can service properly.
 * It is also the most privacy-sensitive flow in the build: some of what is on
 * this account is about the property, and some is about the person. Only the
 * first should move, and the screen has to say which is which before anyone
 * agrees to anything.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  accounts,
  assets,
  byId,
  contacts,
  contracts,
  customerTimeline,
} from '../../data/seedData';
import { t } from '../../i18n';
import { longDate } from '../../lib/format';
import {
  Band,
  BandHead,
  Button,
  Flag,
  Icon,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/**
 * The privacy split, stated before consent is asked for. What belongs to the
 * property transfers; what belongs to the person does not.
 */
const MOVES = ['system', 'warranty', 'history', 'design'] as const;
const STAYS = ['contact', 'money', 'messages', 'orders'] as const;

export const OwnerTransfer = () => {
  const account = byId(accounts, GOLDEN.accountId)!;
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;
  const primary = contacts.find((c) => c.accountId === account.id && c.isPrimary)!;
  const history = customerTimeline(account.id).filter((entry) => entry.kind === 'visit');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* Split, so the error can name which half is missing rather than both. */
  const details = name.trim().length > 2 && email.includes('@') && date.length > 0;
  const ready = details && consent;

  /* Errors appear on the attempt, never before it. */
  const [attempted, setAttempted] = useState(false);

  if (submitted) {
    return (
      <>
        <div className="contents">
          <Masthead
            eyebrow={t('transfer.done.eyebrow')}
            subject={t('transfer.done.title')}
            lead={t('transfer.done.lead', { name: name.trim(), date: longDate(date) })}
          />
          <Band kind="data" flush>
            <div className="px-gutter py-3">
              <Status tone="info">{t('transfer.done.status')}</Status>
              <p className="mt-2 max-w-reading text-body text-ink2">{t('transfer.done.detail')}</p>
            </div>
          </Band>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow="Selling the property"
          subject="Transfer to a new owner"
          lead={`The system at ${account.address} moves to whoever buys the property. You keep everything that is about you.`}
        />

        <Section id="transfer">
          <div className="contents">
            {/* What is being transferred, as a thing not a record. */}
            <Band kind="rail" flush>
              <BandHead eyebrow="What is moving" title={asset.product} />
              <RowList>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">At</p>
                    <p className="text-right text-caption text-ink">
                      {account.address}, {account.city}
                    </p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">Installed</p>
                    <p className="text-caption text-ink">{longDate(asset.installedOn)}</p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">{t('transfer.stat.warranty')}</p>
                    <p className="text-caption text-ink">{longDate(asset.warrantyEndsOn)}</p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">{t('transfer.stat.visits')}</p>
                    <p className="text-caption text-ink">{history.length}</p>
                  </div>
                </Row>
              </RowList>
            </Band>

            {/* The privacy split. Before consent, not after. */}
            <Band kind="data" flush>
              <div className="border-b border-line bg-surface-sunk px-gutter py-2">
                <Micro>{t('transfer.moves.title')}</Micro>
              </div>
              <RowList>
                {MOVES.map((key) => (
                  <Row key={key}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-ink3">
                        <Icon name="chevron-right" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">
                          {t(`transfer.moves.${key}` as Parameters<typeof t>[0])}
                        </p>
                        <p className="text-caption text-ink2">
                          {t(`transfer.moves.${key}Why` as Parameters<typeof t>[0])}
                        </p>
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>

              <div className="border-y border-line bg-surface-sunk px-gutter py-2">
                <Micro>{t('transfer.stays.title')}</Micro>
              </div>
              <RowList>
                {STAYS.map((key) => (
                  <Row key={key}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-positive">
                        <Icon name="check" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">
                          {t(`transfer.stays.${key}` as Parameters<typeof t>[0])}
                        </p>
                        <p className="text-caption text-ink2">
                          {t(`transfer.stays.${key}Why` as Parameters<typeof t>[0])}
                        </p>
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>
            </Band>

            {/* What happens to the plan. A real question, answered up front. */}
            <Band kind="rail" flush>
              <BandHead eyebrow={t('transfer.plan.eyebrow')} title={contract.name} />
              <div className="px-gutter py-3">
                <p className="max-w-reading text-body text-ink2">
                  {t('transfer.plan.detail', { date: longDate(contract.renewsOn) })}
                </p>
              </div>
            </Band>

            {/* Who it is going to. */}
            <Band kind="data" flush>
              <BandHead eyebrow={t('transfer.owner.eyebrow')} title={t('transfer.owner.title')} />
              <div className="space-y-3 px-gutter py-3">
                <label className="block">
                  <span className="text-caption text-ink2">{t('transfer.owner.name')}</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-caption text-ink2">{t('transfer.owner.email')}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-caption text-ink2">{t('transfer.owner.date')}</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
              </div>
            </Band>

            {/* Consent, explicit, at the point it is needed. */}
            <Band kind="rail" flush>
              <div className="px-gutter py-3">
                <Flag tone="warn" icon="alert-triangle">
                  {t('transfer.consent.flag')}
                </Flag>
                <label className="mt-3 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1 h-3 w-3 shrink-0 rounded-control border border-line-strong"
                  />
                  <span className="max-w-reading text-caption text-ink2">
                    {t('transfer.consent.text')}
                  </span>
                </label>
              </div>
            </Band>

            {/*
              The same fix the booking form got, for the same defect.

              This was a disabled button sitting as a bare sibling of the bands,
              so it took no gutter and rendered as a full-bleed slab, with the
              reason it was disabled in 13px grey underneath. A disabled control
              cannot be tapped, so it cannot explain itself, and on a form this
              long the explanation was well below the fold. The tap always lands
              now, and if something is missing it says which, above the button
              that would not have worked.
            */}
            <Band kind="data">
              <div className="py-3">
                {attempted && !ready && (
                  <div className="mb-3" role="alert">
                    <Flag tone="alert" icon="alert-triangle">
                      {details ? t('transfer.consent.missing') : t('transfer.owner.missing')}
                    </Flag>
                  </div>
                )}
                <Button
                  variant="primary"
                  icon="check"
                  block
                  onClick={() => {
                    if (!ready) {
                      setAttempted(true);
                      return;
                    }
                    setSubmitted(true);
                  }}
                >
                  {t('transfer.cta')}
                </Button>
                <p className="mt-2 text-caption text-ink3">
                  {t('transfer.footer', {
                    name: `${primary.firstName} ${primary.lastName}`,
                  })}
                </p>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
