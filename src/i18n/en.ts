/**
 * i18n/en.ts
 *
 * English, the source locale. Every value here is written first and translated
 * from; nothing is translated back into it.
 *
 * Populated screen by screen as each screen is rebuilt, rather than in one sweep.
 * A sweep would have extracted several hundred strings that the information
 * architecture pass is about to delete, and translating a sentence twice is the
 * one cost that compounds.
 *
 * The copy rules from the brief apply to every value in this file:
 *
 *   - Sentence case. No Title Case, no ALL CAPS, no exclamation marks.
 *     A `micro` label renders uppercase through CSS, so the value stays sentence
 *     case here and the transform is presentation. That matters for French,
 *     where uppercasing strips accents in some renderers.
 *   - Verb-first buttons, one to three words, no terminal punctuation.
 *   - Body copy and helper text do take a period.
 *   - No "please", no "successfully".
 *   - Errors say what happened, then what to do, in one sentence, with no
 *     "Error:" prefix.
 *   - No em dash characters.
 *
 * Seed data is not here. Customer names, addresses, part numbers and figures
 * come from `seedData.ts` and must not be translated: `WO-2026-0412` and
 * "Sarah and Julien Lavoie" are the same in every language.
 */

export const en = {
  /* ---------------------------------------------------------------- */
  /* Shared                                                            */
  /* ---------------------------------------------------------------- */
  'common.undo': 'Undo',
  'common.close': 'Close',

  /* ---------------------------------------------------------------- */
  /* Shop, screen 12                                                   */
  /* ---------------------------------------------------------------- */
  'shop.masthead.eyebrow': 'Parts',
  'shop.masthead.title': 'Parts and filters',
  'shop.masthead.lead': 'Filtered to the {model}, so nothing here will arrive and not fit.',

  'shop.filter.label': 'Filter the catalogue',
  'shop.filter.fitsMyModel': 'Fits my {model}',
  'shop.filter.everything': 'Everything',
  'shop.empty': 'No parts match this filter.',

  'shop.item.add': 'Add',
  'shop.item.addOne': 'Add one {name}',
  'shop.item.removeOne': 'Remove one {name}',
  'shop.item.doesNotFit': 'Not for the {model}',
  'shop.item.noImage': 'No photograph on file for this part',

  'shop.cart.eyebrow': 'Your order',
  'shop.cart.itemsOne': '{count} item',
  'shop.cart.itemsOther': '{count} items',
  'shop.cart.open': 'View order',
  'shop.cart.openOne': 'View order, {count} item, {total}',
  'shop.cart.openOther': 'View order, {count} items, {total}',
  'shop.cart.badgeOne': 'Your order, {count} item',
  'shop.cart.badgeOther': 'Your order, {count} items',
  'shop.cart.remove': 'Remove',
  'shop.cart.removeNamed': 'Remove {name} from your order',
  'shop.cart.removed': '{name} removed from your order.',
  'shop.cart.parts': 'Parts',
  'shop.cart.discount': '{plan} discount',
  'shop.cart.tax': 'Tax',
  'shop.cart.taxValue': 'Calculated at checkout',
  'shop.cart.total': 'Total',
  'shop.cart.checkout': 'Go to checkout',

  'shop.delivery': 'Delivered to {model} owners in the Eastern Townships within a week.',

  /* ---------------------------------------------------------------- */
  /* Book a visit, screen 11                                           */
  /* ---------------------------------------------------------------- */
  'book.masthead.eyebrow': 'Book a visit',
  'book.masthead.title': 'When suits you?',
  'book.masthead.lead': 'Pick a window and {servicePoint} will confirm it.',

  'book.reason.title': 'What is it about?',
  'book.reason.inspection': 'A check up',
  'book.reason.inspectionDetail': 'Included in your care plan',
  'book.reason.concern': 'Something seems wrong',
  'book.reason.concernDetail': 'Smell, noise or a wet patch',
  'book.reason.advice': 'I have a question',
  'book.reason.adviceDetail': 'About the system or the property',
  'book.reason.other': 'Something else',
  'book.reason.otherDetail': 'Tell us when we confirm',
  'book.reason.missing': 'Choose what the visit is about to continue.',

  'book.slot.title': 'Choose an arrival window',
  'book.slot.daysOpenOne': '{count} day open',
  'book.slot.daysOpenOther': '{count} days open',
  'book.slot.inDays': 'in {count} days',
  'book.slot.window': 'A window, not a time. We would rather arrive inside two hours than miss a promise by ten minutes.',
  'book.slot.missing': 'Pick an arrival window to continue.',

  'book.cover.flag': 'Covered by {plan}',
  'book.cover.detail': 'Your care plan covers a check up on the {model} each year, so there is nothing to pay for this visit.',

  'book.cta': 'Book a visit',

  'book.done.eyebrow': 'Visit booked',
  'book.done.title': 'You are booked in',
  'book.done.lead': 'We will confirm who is coming closer to the day.',
  'book.done.when': 'When',
  'book.done.reason': 'Reason',
  'book.done.where': 'Where',
  'book.done.team': 'Team',
  'book.done.change': 'Need to change it? Message your team and we will move it.',
} as const;
