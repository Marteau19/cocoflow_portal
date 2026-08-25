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

  'book.step.one': 'Step one',
  'book.step.two': 'Step two',
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
  'book.slot.inDaysOne': 'in {count} day',
  'book.slot.inDaysOther': 'in {count} days',
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

  /* ---------------------------------------------------------------- */
  /* Account, screen 35                                                */
  /* ---------------------------------------------------------------- */
  'account.masthead.eyebrow': 'Account',
  'account.masthead.title': 'Your account',

  'account.you.title': 'You',
  'account.you.email': 'Email',
  'account.you.phone': 'Phone',
  'account.you.edit': 'Edit your details',

  'account.property.titleOne': 'Your property',
  'account.property.titleOther': 'Your properties',
  'account.property.system': '{product}, installed {date}',
  'account.property.add': 'Add a property',
  'account.property.addHint': 'Own more than one Ecoflo? Add it here and it joins this account.',

  'account.plan.title': 'Care plan',
  'account.plan.renews': 'Renews {date}',
  'account.plan.autopayOn': 'Autopay is on',
  'account.plan.autopayOff': 'Autopay is off',
  'account.plan.manage': 'Manage your plan',
  'account.plan.invoices': 'Invoices and payment',
  'account.plan.invoicesDetail': 'All clear',
  'account.plan.card': 'Card ending {last4}',

  'account.prefs.title': 'Preferences',
  'account.prefs.language': 'Language',
  'account.prefs.languageHint': 'Applies to the portal, your invoices and what your technician brings to the door.',
  'account.prefs.notifications': 'Tell me about',
  'account.prefs.visitReminders': 'Visit reminders',
  'account.prefs.visitRemindersHint': 'Two days before, and on the morning.',
  'account.prefs.visitReports': 'Visit summaries',
  'account.prefs.visitReportsHint': 'What we did, after each visit.',
  'account.prefs.planNotices': 'Plan and billing',
  'account.prefs.planNoticesHint': 'Renewals, receipts and anything that needs a decision.',
  'account.prefs.offers': 'Offers and advice',
  'account.prefs.offersHint': 'Seasonal advice and occasional offers. Off by default.',

  'account.help.title': 'Help',
  'account.help.messages': 'Message your Service Point',
  'account.help.messagesDetail': 'We reply within one working day.',
  'account.help.messagesUnreadOne': '{count} unread',
  'account.help.messagesUnreadOther': '{count} unread',
  'account.help.call': 'Call {servicePoint}',
  'account.help.documents': 'Your documents',
  'account.help.documentsDetail': 'Certificate, warranty, plan and owner guide.',

  'account.signOut': 'Sign out',
  'account.signedInAs': 'Signed in as {name}.',

  /* ---------------------------------------------------------------- */
  /* Home, screen 7                                                    */
  /* ---------------------------------------------------------------- */
  'home.header.property': 'Property',
  'home.header.switchProperty': 'Switch property',
  'home.header.messages': 'Messages',
  'home.header.messagesUnreadOne': 'Messages, {count} unread',
  'home.header.messagesUnreadOther': 'Messages, {count} unread',
  'home.header.cart': 'Your order',
  'home.header.cartCountOne': 'Your order, {count} item',
  'home.header.cartCountOther': 'Your order, {count} items',

  'home.visit.liveEyebrow': 'Happening now',
  'home.visit.liveTitle': '{minutes} min away',
  'home.visit.liveArriving': 'Arriving now',
  'home.visit.liveWorking': 'Work in progress',
  'home.visit.liveFrom': '{name} is on the way from {servicePoint}.',
  'home.visit.liveWorkingDetail': '{name} is working on your system now.',
  'home.visit.track': 'Track',
  'home.visit.message': 'Message {name}',

  'home.visit.nextEyebrow': 'Next visit',
  'home.visit.today': 'Today',
  'home.visit.window': 'Arriving between {window}',
  'home.visit.who': '{name}, {servicePoint}',
  'home.visit.reschedule': 'Change this visit',

  'home.visit.doing': 'We are replacing your filter media.',
  'home.visit.factWork': 'Filter media replacement',
  'home.visit.factCovered': 'Covered by your plan',
  'home.visit.factAccess': 'No access needed',
  'home.visit.factBeHome': 'Please be home',

  'home.visit.noneTitle': 'No visit booked',
  'home.visit.noneLead': 'Your next check up is due {date}. Book it when it suits you.',

  'home.metric.mediaLife': 'Media life',
  'home.metric.mediaLifeNote': 'Until {date}',
  'home.metric.mediaLifeDue': 'Replacement booked',
  'home.metric.planValue': 'Plan value',
  'home.metric.planValueNote': 'Covered this year',
  'home.metric.visits': 'Visits',
  'home.metric.visitsNote': 'Since install',

  'home.system.eyebrow': 'Your system',
  'home.system.healthy': 'System healthy',
  'home.system.attention': 'Worth a look',
  'home.system.due': 'Service is due',
  'home.system.plan': '{plan}, renews {date}',

  'home.cta.book': 'Book a visit',
  'home.cta.shop': 'Order parts',

  /* ---------------------------------------------------------------- */
  /* System, screen 8                                                  */
  /* ---------------------------------------------------------------- */
  'system.eyebrow': 'Your system',
  'system.at': 'At {address}, {city}.',
  'system.healthy': 'System healthy',
  'system.healthyDetail': 'We check it at every visit.',
  'system.attention': 'Worth a look',
  'system.attentionDetail': 'We noticed something last visit and we are keeping an eye on it.',
  'system.due': 'Service is due',
  'system.dueDetail': 'We will be in touch to arrange a visit.',

  'system.media.title': 'Filter media',
  'system.media.remaining': '{percent}% of its life left',
  'system.media.due': 'Due for replacement',
  'system.media.dueOn': 'Due {date}',
  'system.media.booked': '{name} is replacing it on {date}.',
  'system.media.since': 'Last replaced {date}.',
  'system.media.original': 'Fitted with the system in {date}.',
  'system.media.estimate': 'Estimated from the last replacement, not measured.',

  'system.facts.title': 'The details',
  'system.facts.model': 'Model',
  'system.facts.serial': 'Serial number',
  'system.facts.installed': 'Installed',
  'system.facts.lastVisit': 'Last visit',
  'system.facts.warranty': 'Warranty until',

  'system.history.title': 'Service history',
  'system.history.countOne': '{count} entry',
  'system.history.countOther': '{count} entries',
  'system.history.visit': 'Maintenance visit',
  'system.history.install': 'Installation',
  'system.history.mediaReplacement': 'Filter media replacement',
  'system.history.repair': 'Repair',
  'system.history.order': 'Parts order',
  'system.history.by': 'By {name}',
  'system.history.photo': 'Photo taken on the visit',
  'system.history.empty': 'Your visits will appear here after the first one.',

  'system.documents.title': 'Documents',
  'system.documents.certificate': 'Installation certificate',
  'system.documents.warranty': 'Warranty terms',
  'system.documents.plan': 'Care plan',
  'system.documents.guide': 'Owner guide',
  'system.documents.validTo': 'Valid to {date}',
  'system.documents.forModel': 'For the {model}',

  'system.transfer.title': 'Moving out',
  'system.transfer.detail': 'Selling the property? The system, its history and its care plan can move to the new owner.',
  'system.transfer.action': 'Transfer to a new owner',

  'system.cta.book': 'Book a visit',
} as const;
