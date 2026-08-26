/**
 * data/seasons.ts
 *
 * What the Home seasonal slot says, by month.
 *
 * Content driven rather than a switch statement inside the component, because
 * the whole point of a seasonal card is that somebody who is not a developer
 * changes what it says. Adding a month's advice should be an edit to this array
 * and nothing else, and a month with nothing worth saying should render nothing
 * rather than something filler.
 *
 * Ranges are inclusive and wrap across the year end, which is how a Quebec
 * winter actually works.
 */

import type { IconName } from '../ui/icons';
import type { MessageKey } from '../i18n';

export interface SeasonalCard {
  id: string;
  /** 1 to 12, inclusive, wrapping when `from` is greater than `to`. */
  from: number;
  to: number;
  icon: IconName;
  title: MessageKey;
  body: MessageKey;
  /** Optional destination. Omitted where the card is advice, not a task. */
  action?: { label: MessageKey; to: string };
}

export const seasonalCards: SeasonalCard[] = [
  {
    id: 'freeze',
    from: 11,
    to: 3,
    icon: 'alert-triangle',
    title: 'season.freeze.title',
    body: 'season.freeze.body',
  },
  {
    id: 'spring',
    from: 4,
    to: 5,
    icon: 'calendar',
    title: 'season.spring.title',
    body: 'season.spring.body',
    action: { label: 'season.spring.action', to: '/book' },
  },
  {
    id: 'opening',
    from: 6,
    to: 8,
    icon: 'home',
    title: 'season.opening.title',
    body: 'season.opening.body',
  },
  {
    id: 'closing',
    from: 9,
    to: 10,
    icon: 'map-pin',
    title: 'season.closing.title',
    body: 'season.closing.body',
    action: { label: 'season.closing.action', to: '/book' },
  },
];

/** The card for a month, or null where the calendar has nothing to say. */
export const seasonalCardFor = (month: number): SeasonalCard | null =>
  seasonalCards.find((card) =>
    card.from <= card.to
      ? month >= card.from && month <= card.to
      : month >= card.from || month <= card.to,
  ) ?? null;
