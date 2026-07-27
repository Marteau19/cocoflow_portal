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
import { longDate } from '../../lib/format';
import {
  Button,
  Card,
  CardHeader,
  Flag,
  Icon,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/**
 * The privacy split, stated before consent is asked for. What belongs to the
 * property transfers; what belongs to the person does not.
 */
const MOVES = [
  { label: 'The system and its serial number', why: 'It is bolted into the ground' },
  { label: 'Installation date and warranty', why: 'The warranty follows the system, not you' },
  { label: 'Service visit history', why: 'The next technician needs to know what was done' },
  { label: 'The soil test and the design', why: 'They describe the land' },
];

const STAYS = [
  { label: 'Your name, email and phone', why: 'These belong to you, not to the land' },
  { label: 'Your invoices and payment method', why: 'Your financial records stay with you' },
  { label: 'Your messages with the team', why: 'A private conversation stays private' },
  { label: 'Your parts orders', why: 'Bought by you, billed to you' },
];

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

  const ready = name.trim().length > 2 && email.includes('@') && date.length > 0 && consent;

  if (submitted) {
    return (
      <ScreenBody>
        <Stack gap="4">
          <PageHead
            eyebrow="Transfer started"
            title="We have what we need"
            lead={`We will contact ${name.trim()} to set up their account before ${longDate(date)}.`}
          />
          <Card>
            <div className="px-4 py-3">
              <Status tone="good">PENDING THE NEW OWNER</Status>
              <p className="mt-2 max-w-reading text-body text-ink2">
                Nothing moves until they accept. Until then your account is unchanged and you can
                cancel the transfer by messaging the team.
              </p>
            </div>
          </Card>
        </Stack>
      </ScreenBody>
    );
  }

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Selling the property"
          title="Transfer to a new owner"
          lead={`The system at ${account.address} moves to whoever buys the property. You keep everything that is about you.`}
        />

        <Section id="transfer">
          <Stack gap="4">
            {/* What is being transferred, as a thing not a record. */}
            <Card>
              <CardHeader eyebrow="What is moving" title={asset.product} />
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
                    <p className="text-caption text-ink2">Warranty runs to</p>
                    <p className="text-caption text-ink">{longDate(asset.warrantyEndsOn)}</p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">Service visits on record</p>
                    <p className="text-caption text-ink">{history.length}</p>
                  </div>
                </Row>
              </RowList>
            </Card>

            {/* The privacy split. Before consent, not after. */}
            <Card>
              <CardHeader eyebrow="Read this part" title="What transfers, and what does not" />

              <div className="border-b border-line bg-surface-sunk px-4 py-2">
                <Micro>Goes with the property</Micro>
              </div>
              <RowList>
                {MOVES.map((item) => (
                  <Row key={item.label}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-ink3">
                        <Icon name="chevron-right" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">{item.label}</p>
                        <p className="text-caption text-ink2">{item.why}</p>
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>

              <div className="border-y border-line bg-surface-sunk px-4 py-2">
                <Micro>Stays with you</Micro>
              </div>
              <RowList>
                {STAYS.map((item) => (
                  <Row key={item.label}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 text-accent-ink">
                        <Icon name="check" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-body text-ink">{item.label}</p>
                        <p className="text-caption text-ink2">{item.why}</p>
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>
            </Card>

            {/* What happens to the plan. A real question, answered up front. */}
            <Card>
              <CardHeader eyebrow="Your care plan" title={contract.name} />
              <div className="px-4 py-3">
                <p className="max-w-reading text-body text-ink2">
                  Your plan is paid to {longDate(contract.renewsOn)}. The new owner can take it over
                  from the transfer date, or let it lapse and decide for themselves. If they take it
                  over, we refund you the unused part.
                </p>
              </div>
            </Card>

            {/* Who it is going to. */}
            <Card>
              <CardHeader eyebrow="The new owner" title="Who is taking it on" />
              <div className="space-y-3 px-4 py-3">
                <label className="block">
                  <span className="text-caption text-ink2">Their name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-caption text-ink2">Their email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-caption text-ink2">Completion date</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
              </div>
            </Card>

            {/* Consent, explicit, at the point it is needed. */}
            <Card>
              <div className="px-4 py-3">
                <Flag tone="warn" icon="alert-triangle">
                  This shares your system history
                </Flag>
                <label className="mt-3 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1 h-3 w-3 shrink-0 rounded-control border border-line-strong"
                  />
                  <span className="max-w-reading text-caption text-ink2">
                    I agree to transfer the system, its warranty and its service history to the
                    person named above, and I confirm they are buying this property. My contact
                    details, invoices and messages are not shared.
                  </span>
                </label>
              </div>
            </Card>

            <Button
              variant="primary"
              icon="check"
              block
              disabled={!ready}
              onClick={() => setSubmitted(true)}
            >
              Start the transfer
            </Button>
            <p className="text-caption text-ink3">
              Signed in as {primary.firstName} {primary.lastName}. Nothing moves until the new owner
              accepts, and you can cancel before then.
            </p>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
