/**
 * data/readState.ts
 *
 * Which conversations the customer has opened.
 *
 * Read state is per participant and it changes while the app is running, so it
 * cannot live in `seedData.ts`, which is the static record. It is the same shape
 * of thing as the cart in `commerce/adapter.ts`: mutable session state behind a
 * seam, so that when a real messaging backend arrives this file is what changes
 * and no screen does.
 *
 * Not persisted. `CLAUDE.md` permits exactly two localStorage keys and this is
 * not one of them, so a reload restores the unread badge. For a prototype that
 * is the right behaviour anyway: a reviewer wants to see the badge again.
 */

import { cases } from './seedData';

const opened = new Set<string>();

/** Messages waiting for the customer, across every conversation on a property. */
export const unreadFor = (accountId: string): number =>
  cases
    .filter((c) => c.accountId === accountId && !opened.has(c.id))
    .reduce((n, c) => n + c.unreadForCustomer, 0);

/** Called when the thread is actually on screen, not when it is linked to. */
export const markRead = (accountId: string): void => {
  cases.filter((c) => c.accountId === accountId).forEach((c) => opened.add(c.id));
};

/** True while a conversation still holds something the customer has not seen. */
export const isUnread = (caseId: string): boolean => {
  const record = cases.find((c) => c.id === caseId);
  return record !== undefined && record.unreadForCustomer > 0 && !opened.has(caseId);
};
