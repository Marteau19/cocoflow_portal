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
  'shop.header.title': 'Shop',
  'shop.header.guarantee': 'Guaranteed to fit your {model}',

  'shop.search.label': 'Search parts',
  'shop.search.placeholder': 'Search parts and filters',

  'shop.filter.label': 'Filter the catalogue',
  'shop.filter.fitsMyModel': 'Fits my {model}',
  'shop.filter.everything': 'Everything',

  'shop.category.label': 'Category',
  'shop.category.all': 'Everything',
  'shop.category.filter-media': 'Filter media',
  'shop.category.lid': 'Lids and seals',
  'shop.category.pump': 'Pumps',
  'shop.category.control': 'Controls',
  'shop.category.accessory': 'Accessories',

  'shop.empty': 'No parts match this filter.',
  'shop.emptySearch': 'Nothing matches {query}. Try a part number, or clear the filters.',
  'shop.clearFilters': 'Clear filters',
  'shop.countOne': '{count} part',
  'shop.countOther': '{count} parts',

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
  'book.slot.why': 'Why a window and not a time?',
  'book.slot.whyAnswer': 'We would rather arrive inside two hours than miss a promise by ten minutes.',
  'book.slot.missing': 'Pick an arrival window to continue.',

  'book.cover.flag': 'Covered by {plan}',
  'book.cover.detail': 'Your plan covers a yearly check up, so this visit is free.',

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
  'account.property.addHint': 'A second Ecoflo joins this same account.',

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
  'account.prefs.languageHint': 'Applies to the portal, your invoices and your visit summaries.',
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
  'system.transfer.detail': 'The system, its history and its plan can move to the new owner.',
  'system.transfer.action': 'Transfer to a new owner',

  'system.cta.book': 'Book a visit',

  /* ---------------------------------------------------------------- */
  /* Messages, screen 13                                               */
  /* ---------------------------------------------------------------- */
  'messages.eyebrow': 'Messages',
  'messages.lead': 'One conversation with the team who looks after your system.',
  'messages.replyTime': 'We reply within one working day. Call for anything urgent.',
  'messages.threadTitle': 'Messages',
  'messages.threadFallback': 'Your conversation',
  'messages.resolved': 'Resolved',
  'messages.new': 'New',
  'messages.you': 'You',
  'messages.about': 'About: {subject}',

  'messages.compose.label': 'Write a message',
  'messages.compose.placeholder': 'Anything about your system or a visit',
  'messages.compose.send': 'Send',
  'messages.compose.photo': 'Add a photo',
  'messages.compose.photoHint': 'A photo of what you are seeing usually saves a visit.',

  'messages.context.eyebrow': 'What we already know',
  'messages.context.title': 'Attached to this conversation',
  'messages.context.system': 'Your system',
  'messages.context.systemValue': '{product}, {model}',
  'messages.context.nextVisit': 'Next visit',
  'messages.context.access': 'Winter access',
  'messages.context.accessValue': 'Thaw weeks preferred, noted 2026',
  'messages.context.note': 'Whoever replies sees all of this. Never explain your property twice.',

  /* ---------------------------------------------------------------- */
  /* Invoices, screen 9                                                */
  /* ---------------------------------------------------------------- */
  'invoices.eyebrow': 'Billing',
  'invoices.title': 'Invoices and payment',
  'invoices.outstanding': 'Outstanding',
  'invoices.allClear': 'All clear',
  'invoices.paidTo': 'Paid to {date}.',
  'invoices.unpaidOne': '{count} unpaid',
  'invoices.unpaidOther': '{count} unpaid',
  'invoices.paidThisYear': 'Paid this year',
  'invoices.nextCharge': 'Next charge',
  'invoices.nextChargeValue': '{amount} on {date}',

  'invoices.payment.title': 'Payment method',
  'invoices.payment.card': 'Card ending {last4}',
  'invoices.payment.expires': 'Expires {date}',
  'invoices.payment.change': 'Change',
  'invoices.payment.autopayOn': 'Autopay is on',
  'invoices.payment.autopayOff': 'Autopay is off',
  'invoices.payment.autopayOnHint': 'Your plan renews and pays itself. We email you a week before.',
  'invoices.payment.autopayOffHint': 'We will ask you to pay each renewal.',

  'invoices.history.title': 'Invoice history',
  'invoices.history.countOne': '{count} invoice',
  'invoices.history.countOther': '{count} invoices',
  'invoices.history.paid': 'Paid',
  'invoices.history.due': 'Due',
  'invoices.history.note': 'Each invoice points at what caused it.',
  'invoices.history.planAnnual': '{plan}, annual',
  'invoices.history.covers': 'Covers to {date}',
  'invoices.history.partsOrder': 'Parts order',
  'invoices.history.visitUncovered': 'Visit, not covered by your plan',
  'invoices.history.inspection': 'Inspection',

  /* ---------------------------------------------------------------- */
  /* Recommended, screen 15                                            */
  /* ---------------------------------------------------------------- */
  'recommended.eyebrow': 'For your property',
  'recommended.title': 'Worth knowing about',
  'recommended.lead': 'From your own records and what technicians noted on site.',

  'recommended.empty': 'Everything is covered for now.',

  'recommended.due.title': 'We would do this next',
  'recommended.due.noCharge': 'No charge',
  'recommended.later.eyebrow': 'No rush',
  'recommended.later.title': 'Worth knowing about',

  'recommended.riser.label': 'A taller lid riser',
  'recommended.riser.why': 'Your lid sits below the snow line. A taller riser lets us reach it in winter without you clearing the drive.',
  'recommended.riser.basedOn': 'Your note about winter access, June 2026',
  'recommended.riser.prevents': 'A visit moved because we could not reach the lid',

  'recommended.seal.label': 'A spare lid seal',
  'recommended.seal.why': 'Yours is replaced on {date}. A spare means a perished seal never costs a second visit.',
  'recommended.seal.basedOn': '{id}, scheduled',
  'recommended.seal.prevents': 'A callout for a ten dollar part',

  'recommended.filter.label': 'An outlet filter check, added to your next visit',
  'recommended.filter.why': 'Outlets start to partially block around this age. Yours never has, which is normal, but it is worth a look while we are there.',
  'recommended.filter.basedOn': 'Installed {date}',
  'recommended.filter.prevents': 'A backup during heavy spring flow',

  'recommended.method.label': 'How we decide',
  'recommended.method.detail': 'Your records only. Never because other customers bought it.',
  'recommended.hiddenOne': '{count} suggestion hidden. We will not raise it again.',
  'recommended.hiddenOther': '{count} suggestions hidden. We will not raise them again.',

  /* ---------------------------------------------------------------- */
  /* Transfer ownership, screen 14                                     */
  /* ---------------------------------------------------------------- */
  'transfer.eyebrow': 'Selling the property',
  'transfer.title': 'Transfer to a new owner',
  'transfer.lead': 'The system moves with the property at {address}. Everything about you stays yours.',

  'transfer.stat.warranty': 'Warranty runs to',
  'transfer.stat.visits': 'Service visits on record',
  'transfer.moves.title': 'Goes with the property',
  'transfer.moves.system': 'The system and its serial number',
  'transfer.moves.systemWhy': 'It is bolted into the ground',
  'transfer.moves.warranty': 'Installation date and warranty',
  'transfer.moves.warrantyWhy': 'The warranty follows the system, not you',
  'transfer.moves.history': 'Service visit history',
  'transfer.moves.historyWhy': 'The next technician needs to know what was done',
  'transfer.moves.design': 'The soil test and the design',
  'transfer.moves.designWhy': 'They describe the land',

  'transfer.stays.title': 'Stays with you',
  'transfer.stays.contact': 'Your name, email and phone',
  'transfer.stays.contactWhy': 'These belong to you, not to the land',
  'transfer.stays.money': 'Your invoices and payment method',
  'transfer.stays.moneyWhy': 'Your financial records stay with you',
  'transfer.stays.messages': 'Your messages with the team',
  'transfer.stays.messagesWhy': 'A private conversation stays private',
  'transfer.stays.orders': 'Your parts orders',
  'transfer.stays.ordersWhy': 'Bought by you, billed to you',

  'transfer.plan.eyebrow': 'Your care plan',
  'transfer.plan.detail': 'Paid to {date}. The new owner can take it over or let it lapse. We refund any unused part.',

  'transfer.owner.eyebrow': 'The new owner',
  'transfer.owner.title': 'Who is taking it on',
  'transfer.owner.name': 'Their name',
  'transfer.owner.email': 'Their email',
  'transfer.owner.date': 'Completion date',
  'transfer.owner.missing': 'Add their name, email and the completion date to continue.',
  'transfer.consent.missing': 'Confirm the transfer below to continue.',

  'transfer.consent.flag': 'This shares your system history',
  'transfer.consent.text': 'I agree to transfer the system, its warranty and its service history to the person named above, and I confirm they are buying this property. My contact details, invoices and messages are not shared.',

  'transfer.cta': 'Start the transfer',
  'transfer.footer': 'Cancel any time before they accept.',

  'transfer.done.eyebrow': 'Transfer started',
  'transfer.done.title': 'We have what we need',
  'transfer.done.lead': 'We will contact {name} to set up their account before {date}.',
  'transfer.done.status': 'Waiting for the new owner',
  'transfer.done.detail': 'Your account is unchanged until they accept. Message the team to cancel.',

  /* ---------------------------------------------------------------- */
  /* Care plan, screen 10                                              */
  /* ---------------------------------------------------------------- */
  'contract.eyebrow': 'Your care plan',
  'contract.forSystem': 'For your {product}, {model}.',
  'contract.perYear': 'Per year',
  'contract.renews': 'Renews {date}, in {days} days.',
  'contract.autopayOn': 'Paid automatically.',
  'contract.autopayOff': 'We will ask you to pay.',
  'contract.active': 'Active',
  'contract.lapsed': 'Lapsed',
  'contract.pending': 'Pending',
  'contract.since': 'Covering since',
  'contract.reference': 'Plan reference',

  'contract.cover.eyebrow': 'What you get',
  'contract.cover.title': 'Cover',
  'contract.cover.notCovered': 'Not covered',
  'contract.cover.notCoveredDetail': 'Outside damage, and parts you order yourself. We tell you before such work, never after.',

  'contract.value.eyebrow': 'This term',
  'contract.value.title': 'What the plan has done',
  'contract.value.empty': 'Your first visit is scheduled when it falls due.',
  'contract.value.fmr': 'Filter media replacement',
  'contract.value.inspection': 'Annual inspection',
  'contract.value.done': 'Done',
  'contract.value.scheduled': 'Scheduled',
  'contract.value.included': 'Included',
  'contract.value.withoutPlan': 'Without the plan',
  'contract.value.withoutPlanDetail': 'The same work priced individually',
  'contract.value.covered': 'Covered this year',
  'contract.value.ahead': '{amount} more than the plan cost',

  'contract.options.eyebrow': 'If you want to change it',
  'contract.options.title': 'Your options',
  'contract.options.moveRenewal': 'Move the renewal date',
  'contract.options.moveRenewalDetail': 'For billing at a different time of year.',
  'contract.options.end': 'End the plan',
  'contract.options.endDetail': 'Stop any time. Cover runs to {date}, with no further charge.',
  'contract.options.ask': 'Ask about my plan',
} as const;
