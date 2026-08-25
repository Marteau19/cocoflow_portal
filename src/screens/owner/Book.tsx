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
 *
 * The action is always tappable. It used to disable itself until both steps were
 * answered, with the explanation in 13px grey underneath it, which on an iPhone
 * SE was below the fold: the control said no and the reason why was off screen.
 * A disabled control cannot be tapped, so it cannot tell you anything, so the one
 * moment a person needs an explanation is the one moment the interface has no way
 * to give them one. Now the tap always lands, and if something is missing it
 * takes you to the thing that is missing and says so there.
 */

import { useRef, useState } from 'react';
import { Section } from '../../blueprint/Section';
import { GOLDEN, accounts, assets, byId, contracts, territories } from '../../data/seedData';
import { plural, t } from '../../i18n';
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
  { code: 'inspection', label: 'book.reason.inspection', detail: 'book.reason.inspectionDetail' },
  { code: 'concern', label: 'book.reason.concern', detail: 'book.reason.concernDetail' },
  { code: 'advice', label: 'book.reason.advice', detail: 'book.reason.adviceDetail' },
  { code: 'other', label: 'book.reason.other', detail: 'book.reason.otherDetail' },
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

/**
 * Take the reader to a step, honouring the reduced-motion preference.
 *
 * A smooth scroll is the one piece of motion here that carries meaning: it shows
 * the reader where on the page they were sent, which an instant jump does not.
 * For someone who has asked for less of it, arriving is what matters and the
 * journey is what causes the problem, so the jump is the right answer rather than
 * a degraded one.
 */
const goTo = (element: HTMLElement | null) => {
  if (!element) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
};

export const OwnerBook = () => {
  const account = byId(accounts, GOLDEN.accountId)!;
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;
  const servicePoint = byId(territories, GOLDEN.territoryId)!;

  const [reason, setReason] = useState<string | null>(null);
  const [slot, setSlot] = useState<{ date: string; window: string } | null>(null);
  const [booked, setBooked] = useState(false);

  /**
   * Whether the reader has asked to book yet.
   *
   * Errors appear on the attempt, never before it. Marking a field wrong before
   * anyone has tried to submit is telling someone off for not having finished
   * reading the form.
   */
  const [attempted, setAttempted] = useState(false);

  const reasonRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  const missingReason = reason === null;
  const missingSlot = slot === null;

  const submit = () => {
    if (missingReason || missingSlot) {
      setAttempted(true);
      // The first missing step in reading order, not the first one checked.
      goTo(missingReason ? reasonRef.current : slotRef.current);
      return;
    }
    setBooked(true);
  };

  /* ------------------------------------------------------------------ */
  /* Confirmation. The action keeps its name: Book a visit, visit booked. */
  /* ------------------------------------------------------------------ */
  if (booked && slot) {
    return (
      <>
        <div className="contents">
          <Masthead
            eyebrow={t('book.done.eyebrow')}
            subject={t('book.done.title')}
            lead={t('book.done.lead')}
          />
          <Band kind="data" flush>
            <div className="px-gutter py-3">
              <Micro>{t('book.done.when')}</Micro>
              <p className="mt-1 text-h1 text-ink">{dayAndDate(slot.date)}</p>
              <p className="mt-1 text-body text-ink2">{slot.window}</p>
            </div>
            <RowList className="border-t border-line">
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">{t('book.done.reason')}</p>
                  <p className="text-caption text-ink">
                    {t(REASONS.find((r) => r.code === reason)!.label)}
                  </p>
                </div>
              </Row>
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">{t('book.done.where')}</p>
                  <p className="text-right text-caption text-ink">
                    {account.address}, {account.city}
                  </p>
                </div>
              </Row>
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">{t('book.done.team')}</p>
                  <p className="text-caption text-ink">{servicePoint.name}</p>
                </div>
              </Row>
            </RowList>
            <div className="border-t border-line px-gutter py-3">
              <p className="text-caption text-ink2">{t('book.done.change')}</p>
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
          eyebrow={t('book.masthead.eyebrow')}
          subject={t('book.masthead.title')}
          lead={t('book.masthead.lead', { servicePoint: servicePoint.name })}
        />

        <Section id="booking">
          <div className="contents">
            {/* What the visit is for. */}
            <div ref={reasonRef}>
              <Band kind="rail" flush>
                <BandHead
                  icon="message-square"
                  eyebrow={t('book.step.one')}
                  title={t('book.reason.title')}
                />
                {/*
                  The error sits with the thing it is about, above the choices
                  rather than beside the button that reported it. `role="alert"`
                  so a screen reader hears it on the attempt, which is the same
                  moment the scroll delivers a sighted reader to it.
                */}
                {attempted && missingReason && (
                  <div className="px-gutter pb-3" role="alert">
                    <Flag tone="alert" icon="alert-triangle">
                      {t('book.reason.missing')}
                    </Flag>
                  </div>
                )}
                <RowList>
                  {REASONS.map((item) => {
                    const selected = reason === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setReason(item.code)}
                        className={`block w-full border-l-rule px-gutter py-3 text-left transition-colors duration-state ease-ease ${
                          selected
                            ? 'border-l-ink bg-surface-sunk'
                            : 'border-l-transparent hover:bg-surface-sunk'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className={`text-body text-ink ${selected ? 'font-medium' : ''}`}>
                              {t(item.label)}
                            </p>
                            <p className="text-caption text-ink2">{t(item.detail)}</p>
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
            </div>

            {/* Real availability, and an arrival window rather than a time. */}
            <div ref={slotRef}>
              <Band kind="data" flush>
                <BandHead
                  icon="calendar"
                  eyebrow={t('book.step.two')}
                  title={t('book.slot.title')}
                  action={
                    <Status tone="neutral">
                      {plural(SLOTS.length, {
                        one: 'book.slot.daysOpenOne',
                        other: 'book.slot.daysOpenOther',
                      })}
                    </Status>
                  }
                />
                {attempted && missingSlot && (
                  <div className="px-gutter pb-3" role="alert">
                    <Flag tone="alert" icon="alert-triangle">
                      {t('book.slot.missing')}
                    </Flag>
                  </div>
                )}
                <div className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
                  {SLOTS.map((day) => (
                    <div key={day.date} className="px-gutter py-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-body text-ink">{dayAndDate(day.date)}</p>
                        <p className="text-caption text-ink3">
                          {plural(daysFromToday(day.date), {
                            one: 'book.slot.inDaysOne',
                            other: 'book.slot.inDaysOther',
                          })}
                        </p>
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
                  <p className="text-caption text-ink2">{t('book.slot.window')}</p>
                </div>
              </Band>
            </div>

            {/* What this visit costs, answered before they have to ask. */}
            <Band kind="rail" flush>
              <div className="px-gutter py-3">
                <Flag tone="info" icon="info">
                  {t('book.cover.flag', { plan: contract.name })}
                </Flag>
                <p className="mt-2 text-caption text-ink2">
                  {t('book.cover.detail', { model: asset.model })}
                </p>
              </div>
            </Band>

            {/*
              The action, inside a band.

              It used to be a bare sibling of the bands, so it took no gutter at
              all and rendered as a full-bleed slab whose edges were the screen
              edges while everything above it started 20px in.
            */}
            <Band kind="data">
              <div className="py-3">
                <Button variant="primary" icon="calendar" block onClick={submit}>
                  {t('book.cta')}
                </Button>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
