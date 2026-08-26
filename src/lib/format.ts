/**
 * lib/format.ts
 *
 * Dates, money and plain-language helpers.
 *
 * All of it English copy for Québec addresses, so dates read day-then-month and
 * money is CAD. Nothing here invents a value: every input comes from seedData.
 */

import { GOLDEN, workOrders } from '../data/seedData';

/**
 * The prototype's today.
 *
 * Pinned rather than read from the clock, and pinned to the golden thread's work
 * order date on purpose. On 12 August 2026 the technician has a real day with
 * three jobs, WO-2026-0412 is genuinely on the way, and the client home shows an
 * arrival state instead of a date two weeks out. A live clock would drift out of
 * that alignment the day after this was written and quietly break the demo.
 */
export const TODAY: string =
  workOrders.find((w) => w.id === GOLDEN.workOrderId)?.scheduledFor ?? '2026-08-12';

/**
 * The prototype's clock, pinned for the same reason the date is.
 *
 * 08:48 on the pinned day, which puts Marc twelve minutes from a nine o'clock
 * arrival with eighteen minutes of a thirty minute journey behind him. Every
 * live state on the home screen falls out of that one value, so the arrival
 * countdown, the progress bar and the "on the way" copy are the same on every
 * machine that opens the demo, at any hour, in any timezone.
 *
 * A real clock would make the hero screen show a different thing in the morning
 * than in the afternoon, and show nothing at all after eleven.
 */
export const NOW = '08:48';

/**
 * The plan year every "this year" figure is computed against.
 *
 * Derived from the pinned day rather than from the clock, for the same reason:
 * on 1 January the plan value figure would otherwise drop to zero on every
 * machine showing the demo, and the number it is meant to make is the opposite
 * of zero.
 */
export const PLAN_YEAR = Number(TODAY.slice(0, 4));

/** Minutes past midnight, for arithmetic on the pinned clock. */
const minutesInto = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Parses an ISO date as local rather than UTC, so the day never shifts back. */
const parse = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** `12 August 2026` */
export const longDate = (iso: string): string => {
  const d = parse(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** `12 August` for dates inside the current year. */
export const shortDate = (iso: string): string => {
  const d = parse(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** `Wednesday 12 August` */
export const dayAndDate = (iso: string): string => {
  const d = parse(iso);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** `August 2026` */
export const monthAndYear = (iso: string): string => {
  const d = parse(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** Whole days from TODAY. Negative for the past. */
export const daysFromToday = (iso: string): number => {
  const ms = parse(iso).getTime() - parse(TODAY).getTime();
  return Math.round(ms / 86_400_000);
};

/**
 * How a customer would say it. Returns null past a fortnight, where a date reads
 * better than a count.
 */
export const relativeDay = (iso: string): string | null => {
  const days = daysFromToday(iso);
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  if (days > 1 && days <= 14) return `in ${days} days`;
  if (days < -1 && days >= -14) return `${Math.abs(days)} days ago`;
  return null;
};

export const isToday = (iso: string): boolean => iso === TODAY;

/**
 * Where a travelling technician has got to, against the pinned clock.
 *
 * Returns null when nobody is travelling, which is every visit but the live one.
 * `progress` is the fraction of the journey behind them, clamped, so a technician
 * who is running late shows a full bar and a countdown of zero rather than a bar
 * that overflows its track and a negative number of minutes.
 */
export const arrival = (
  enRouteSince: string | null,
  etaAt: string | null,
): { minutesAway: number; progress: number } | null => {
  if (!enRouteSince || !etaAt) return null;
  const start = minutesInto(enRouteSince);
  const eta = minutesInto(etaAt);
  const now = minutesInto(NOW);
  const journey = eta - start;
  if (journey <= 0) return null;
  return {
    minutesAway: Math.max(0, eta - now),
    progress: Math.min(1, Math.max(0, (now - start) / journey)),
  };
};

/** `9:00 to 11:00`, from the two window fields on a work order. */
export const window = (start: string, end: string): string => `${start} to ${end}`;

/** `$320` and `$14,850`. No cents: none of the mock figures carry them. */
export const money = (amount: number, currency = 'CAD'): string => {
  const rounded = Math.round(amount);
  const grouped = rounded.toLocaleString('en-CA');
  return currency === 'CAD' ? `$${grouped}` : `${grouped} ${currency}`;
};

/**
 * `1.4 million`, `812,000`, `9,400`.
 *
 * Large counts a person reads rather than audits. Litres treated since 2019 is
 * roughly five million, and five million rendered as 5,110,000 invites somebody
 * to check the last three digits of an estimate that is not accurate to the last
 * three thousand.
 */
export const approxCount = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} million`;
  if (value >= 10_000) return `${Math.round(value / 1000).toLocaleString('en-CA')},000`;
  return Math.round(value).toLocaleString('en-CA');
};

/** `$2.1M`, for network figures where the exact dollar is noise. */
export const millions = (amount: number): string => `$${(amount / 1_000_000).toFixed(1)}M`;

/** `33.4%`, one decimal, tabular by inheritance. */
export const percent = (value: number, decimals = 1): string => `${value.toFixed(decimals)}%`;

/** `90 minutes`, `2 hours`, `1 hour 30` */
export const duration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return hours === 1 ? '1 hour' : `${hours} hours`;
  return `${hours} hour${hours === 1 ? '' : 's'} ${rest}`;
};

/** Sentence case for an enum value: `on-the-way` becomes `On the way`. */
export const humanise = (value: string): string => {
  const spaced = value.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};
