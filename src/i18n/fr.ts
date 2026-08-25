/**
 * i18n/fr.ts
 *
 * French, Quebec. Not written yet.
 *
 * Every key present and empty, rather than the file being absent or partial.
 * An empty value falls back to English at the call site, so the app renders
 * correctly in `?lang=fr` from the first day, and `npm run i18n:todo` can list
 * exactly what is still falling back. A missing key would fall back too, and
 * silently, which is the difference between a translation backlog you can count
 * and one you discover in review.
 *
 * Notes for whoever writes these:
 *
 *   - Quebec French, not France French. "Courriel", not "e-mail".
 *   - The plural rule differs from English: French treats zero as singular. The
 *     `plural()` helper already knows this, so the `*One` key is the one that
 *     renders at count zero.
 *   - `micro` labels are uppercased by CSS. Write them in sentence case with
 *     their accents intact and let the transform do the work; some renderers
 *     strip accents when uppercasing, and a stripped accent is a spelling error.
 *   - Verb-first buttons stay verb-first. No terminal punctuation on controls.
 *   - No em dash characters, in either language.
 *   - Seed data is not translated. Names, addresses and identifiers stay as they
 *     are in every language.
 */

import type { en } from './en';

export const fr: Partial<Record<keyof typeof en, string>> = {
  'common.undo': '',
  'common.close': '',
  'shop.masthead.eyebrow': '',
  'shop.masthead.title': '',
  'shop.masthead.lead': '',
  'shop.filter.label': '',
  'shop.filter.fitsMyModel': '',
  'shop.filter.everything': '',
  'shop.empty': '',
  'shop.item.add': '',
  'shop.item.addOne': '',
  'shop.item.removeOne': '',
  'shop.item.doesNotFit': '',
  'shop.item.noImage': '',
  'shop.cart.eyebrow': '',
  'shop.cart.itemsOne': '',
  'shop.cart.itemsOther': '',
  'shop.cart.open': '',
  'shop.cart.openOne': '',
  'shop.cart.openOther': '',
  'shop.cart.badgeOne': '',
  'shop.cart.badgeOther': '',
  'shop.cart.remove': '',
  'shop.cart.removeNamed': '',
  'shop.cart.removed': '',
  'shop.cart.parts': '',
  'shop.cart.discount': '',
  'shop.cart.tax': '',
  'shop.cart.taxValue': '',
  'shop.cart.total': '',
  'shop.cart.checkout': '',
  'shop.delivery': '',
  'book.masthead.eyebrow': '',
  'book.masthead.title': '',
  'book.masthead.lead': '',
  'book.step.one': '',
  'book.step.two': '',
  'book.reason.title': '',
  'book.reason.inspection': '',
  'book.reason.inspectionDetail': '',
  'book.reason.concern': '',
  'book.reason.concernDetail': '',
  'book.reason.advice': '',
  'book.reason.adviceDetail': '',
  'book.reason.other': '',
  'book.reason.otherDetail': '',
  'book.reason.missing': '',
  'book.slot.title': '',
  'book.slot.daysOpenOne': '',
  'book.slot.daysOpenOther': '',
  'book.slot.inDaysOne': '',
  'book.slot.inDaysOther': '',
  'book.slot.window': '',
  'book.slot.missing': '',
  'book.cover.flag': '',
  'book.cover.detail': '',
  'book.cta': '',
  'book.done.eyebrow': '',
  'book.done.title': '',
  'book.done.lead': '',
  'book.done.when': '',
  'book.done.reason': '',
  'book.done.where': '',
  'book.done.team': '',
  'book.done.change': '',
  'account.masthead.eyebrow': '',
  'account.masthead.title': '',
  'account.you.title': '',
  'account.you.email': '',
  'account.you.phone': '',
  'account.you.edit': '',
  'account.property.titleOne': '',
  'account.property.titleOther': '',
  'account.property.system': '',
  'account.property.add': '',
  'account.property.addHint': '',
  'account.plan.title': '',
  'account.plan.renews': '',
  'account.plan.autopayOn': '',
  'account.plan.autopayOff': '',
  'account.plan.manage': '',
  'account.plan.invoices': '',
  'account.plan.invoicesDetail': '',
  'account.plan.card': '',
  'account.prefs.title': '',
  'account.prefs.language': '',
  'account.prefs.languageHint': '',
  'account.prefs.notifications': '',
  'account.prefs.visitReminders': '',
  'account.prefs.visitRemindersHint': '',
  'account.prefs.visitReports': '',
  'account.prefs.visitReportsHint': '',
  'account.prefs.planNotices': '',
  'account.prefs.planNoticesHint': '',
  'account.prefs.offers': '',
  'account.prefs.offersHint': '',
  'account.help.title': '',
  'account.help.messages': '',
  'account.help.messagesDetail': '',
  'account.help.messagesUnreadOne': '',
  'account.help.messagesUnreadOther': '',
  'account.help.call': '',
  'account.help.documents': '',
  'account.help.documentsDetail': '',
  'account.signOut': '',
  'account.signedInAs': '',
};
