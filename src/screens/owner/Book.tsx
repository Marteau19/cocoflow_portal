/**
 * screens/owner/Book.tsx
 *
 * Screen 11. Book a visit.
 *
 * Self-serve booking is one of the digital measures the network is held to, so
 * this flow has to be genuinely usable rather than a form that ends in "we will
 * call you".
 *
 * Two deliberate choices. The customer picks an arrival window, not a time,
 * because a Service Point cannot honour a time and promising one manufactures a
 * complaint. And the reason for the visit is chosen from a short list, because
 * free text cannot be routed.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import { GOLDEN, accounts, assets, byId, contracts, territories } from '../../data/seedData';
import { dayAndDate, daysFromToday, TODAY } from '../../lib/format';
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

/** Reasons map to a routable code. Free text cannot be dispatched. */
const REASONS = [
  { code: 'inspection', label: 'A check up', detail: 'Included in your care plan' },
  { code: 'concern', label: 'Something seems wrong', detail: 'Smell, noise or a wet patch' },
  { code: 'advice', label: 'I have a question', detail: 'About the system or the property' },
  { code: 'other', label: 'Something else', detail: 'Tell us when we confirm' },
] as const;

/**
 * Availability. Derived from a fixed offset off the pinned demo date rather than
 * invented per render, so the screen shows the same slots every time it is
 * demonstrated.
 */
const nextDate = (offsetDays: number): string => {
  const [y, m, d] = TODAY.split('-').map(Number);
  const date = new Date(y, m - 1, d + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

const SLOTS = [
  { date: nextDate(6), windows: ['08:00 to 10:00', '13:00 to 15:00'] },
  { date: nextDate(7), windows: ['10:00 to 12:00'] },
  { date: nextDate(11), windows: ['08:00 to 10:00', '10:00 to 12:00', '15:00 to 17:00'] },
  { date: nextDate(13), windows: ['13:00 to 15:00'] },
];

export const OwnerBook = () => {
  const account = byId(accounts, GOLDEN.accountId)!;
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;
  const servicePoint = byId(territories, GOLDEN.territoryId)!;

  const [reason, setReason] = useState<string | null>(null);
  const [slot, setSlot] = useState<{ date: string; window: string } | null>(null);
  const [booked, setBooked] = useState(false);

  const ready = reason !== null && slot !== null;

  /* ------------------------------------------------------------------ */
  /* Confirmation. The action keeps its name: Book a visit, visit booked. */
  /* ------------------------------------------------------------------ */
  if (booked && slot) {
    return (
      <>
        <div className="contents">
          <Masthead
            eyebrow="Visit booked"
            subject="You are booked in"
            lead={`We will confirm who is coming closer to the day.`}
          />
          <Band kind="data" flush>
            <div className="px-gutter py-3">
              <Micro>When</Micro>
              <p className="mt-1 text-h1 text-ink">{dayAndDate(slot.date)}</p>
              <p className="mt-1 text-body text-ink2">{slot.window}</p>
            </div>
            <RowList className="border-t border-line">
              <Row gutter>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Reason</p>
                  <p className="text-caption text-ink">
                    {REASONS.find((r) => r.code === reason)?.label}
                  </p>
                </div>
              </Row>
              <Row gutter>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Where</p>
                  <p className="text-right text-caption text-ink">
                    {account.address}, {account.city}
                  </p>
                </div>
              </Row>
              <Row gutter>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Team</p>
                  <p className="text-caption text-ink">{servicePoint.name}</p>
                </div>
              </Row>
            </RowList>
            <div className="border-t border-line px-gutter py-3">
              <p className="text-caption text-ink2">
                Need to change it? Message your team and we will move it.
              </p>
            </div>
          </Band>
        </div>
      </>
    );
  }

  /* ------------------------------------------------------------------ */
  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow="Book a visit"
          subject="When suits you?"
          lead={`Pick a window and ${servicePoint.name} will confirm it.`}
        />

        <Section id="booking">
          <div className="contents">
            {/* What the visit is for. */}
            <Band kind="rail" flush>
              <BandHead icon="message-square" eyebrow="Step one" title="What is it about?" />
              <RowList>
                {REASONS.map((item) => {
                  const selected = reason === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setReason(item.code)}
                      className={`block w-full border-l-rule px-gutter py-3 text-left transition-colors duration-state ease-ease ${
                        selected ? 'border-l-ink bg-surface-sunk' : 'border-l-transparent hover:bg-surface-sunk'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`text-body text-ink ${selected ? 'font-medium' : ''}`}>
                            {item.label}
                          </p>
                          <p className="text-caption text-ink2">{item.detail}</p>
                        </div>
                        {selected && (
                          <span className="shrink-0 text-accent-ink">
                            <Icon name="check" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </RowList>
            </Band>

            {/* Real availability, and an arrival window rather than a time. */}
            <Band kind="data" flush>
              <BandHead
                icon="calendar"
                eyebrow="Step two"
                title="Choose an arrival window"
                action={<Status tone="neutral">{`${SLOTS.length} days open`}</Status>}
              />
              <div className="[&>*+*]:border-t [&>*+*]:border-t-line">
                {SLOTS.map((day) => (
                  <div key={day.date} className="px-gutter py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-body text-ink">{dayAndDate(day.date)}</p>
                      <p className="text-caption text-ink3">{`in ${daysFromToday(day.date)} days`}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {day.windows.map((w) => {
                        const selected = slot?.date === day.date && slot?.window === w;
                        return (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setSlot({ date: day.date, window: w })}
                            className={`min-h-tap rounded-pill border px-3 text-caption transition-colors duration-state ease-ease ${
                              selected
                                ? 'border-accent-ink bg-accent text-on-accent'
                                : 'border-line-strong bg-surface text-ink hover:bg-surface-sunk'
                            }`}
                          >
                            {w}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-line px-gutter py-3">
                <p className="text-caption text-ink2">
                  A window, not a time. We would rather arrive inside two hours than miss a promise
                  by ten minutes.
                </p>
              </div>
            </Band>

            {/* What this visit costs, answered before they have to ask. */}
            <Band kind="rail" flush>
              <div className="px-gutter py-3">
                <Flag tone="neutral" icon="info">
                  {`Covered by ${contract.name}`}
                </Flag>
                <p className="mt-2 text-caption text-ink2">
                  Your care plan covers a check up on the {asset.model} each year, so there is
                  nothing to pay for this visit.
                </p>
              </div>
            </Band>

            <Button
              variant="primary"
              icon="calendar"
              block
              disabled={!ready}
              onClick={() => setBooked(true)}
            >
              Book a visit
            </Button>
            {!ready && (
              <p className="text-caption text-ink3">
                Choose what it is about and pick a window to continue.
              </p>
            )}
          </div>
        </Section>
      </div>
    </>
  );
};
