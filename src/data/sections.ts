/**
 * sections.ts
 *
 * The annotation layer. This file is what turns the prototype into a design
 * document. One entry per annotated section.
 *
 * Two registers per entry:
 *   business  -> always visible, plain language, leadership reads this
 *   technical -> collapsed by default, IT and DEV expand this
 *
 * Do not add free-text tooltips anywhere else in the app.
 */

export type Role =
  | 'client-prospect'
  | 'client-owner'
  | 'sp-technician'
  | 'sp-manager'
  | 'ptwe-global';

export type SystemOfRecord =
  | 'Salesforce'
  | 'JDE'
  | 'Commerce (TBD)'
  | 'Entra External ID'
  | 'Knowledge base'
  | 'iPaaS'
  | 'Prototype only';

export type DataDirection = 'read' | 'read-write' | 'write-back' | 'none';

export type Phase = 'V1' | 'V2' | 'Later';

export type BF = 'BF1' | 'BF2' | 'BF3' | 'BF4' | 'BF5' | 'BF6' | 'none';

export interface Section {
  /** Stable id, used as the Blueprint callout anchor */
  id: string;
  /** Callout number shown in Blueprint mode, unique per screen */
  callout: number;
  screen: string;
  roles: Role[];
  title: string;

  /** Leadership register. One or two sentences. No system names. */
  business: string;

  primaryUser: string;
  systemOfRecord: SystemOfRecord[];
  dataDirection: DataDirection;
  /** How the data physically moves */
  integration: string;
  /** Which foundational block gates this section */
  bf: BF[];
  /** Blocking decision, if any. null when the path is clear. */
  openDecision: string | null;
  phase: Phase;
  /** Set when the section handles personal data. Drives the Law 25 flag. */
  privacy?: string;
}

export const sections: Section[] = [
  /* ---------------------------------------------------------------- */
  /* client-prospect                                                   */
  /* ---------------------------------------------------------------- */
  {
    id: 'intake-form',
    callout: 1,
    screen: '/start',
    roles: ['client-prospect'],
    title: 'Intake',
    business:
      'Where the relationship starts. The homeowner tells us where the property is and what brings them here. They design nothing, we take it from there.',
    primaryUser: 'Homeowner, first contact',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'write-back',
    integration:
      'Creates a Lead with a reason code. The reason code drives Service Point routing through Territory Management.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V1',
    privacy:
      'First collection point for personal data. Consent language and purpose statement required at submission under Law 25.',
  },
  {
    id: 'intake-identity',
    callout: 2,
    screen: '/request',
    roles: ['client-prospect'],
    title: 'Account creation',
    business:
      'The homeowner gets an account the moment they ask for help, so everything that follows lives in one place they can return to.',
    primaryUser: 'Homeowner, first contact',
    systemOfRecord: ['Entra External ID', 'Salesforce'],
    dataDirection: 'write-back',
    integration:
      'Self-service sign-up in Entra External ID. An API connector fires at registration and provisions the Salesforce Contact, linking it to the Lead. This is the join between the identity architecture and the master data model.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V1',
    privacy: 'Identity record. Erasure request must cascade to Salesforce.',
  },
  {
    id: 'team-assigned',
    callout: 3,
    screen: '/request',
    roles: ['client-prospect'],
    title: 'Your Service Point team',
    business:
      'One named team owns the whole job. The homeowner sees who they are within minutes of asking, not after three transfers.',
    primaryUser: 'Homeowner, first contact',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'Service Territory lookup on the property address returns the owning Service Point and its ServiceResource records.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'soil-test',
    callout: 1,
    screen: '/soil-test',
    roles: ['client-prospect'],
    title: 'Soil test and report',
    business:
      'We come to the property, assess the land, and publish the findings in plain language. No jargon, no PDF the homeowner has to decode.',
    primaryUser: 'Homeowner, pre-purchase',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'Upstream service delivered as a Work Order against the Lead. Report content authored by the field team, surfaced read-only.',
    bf: ['BF1', 'BF3'],
    openDecision: null,
    phase: 'V2',
  },
  {
    id: 'quote-reveal',
    callout: 1,
    screen: '/quote',
    roles: ['client-prospect'],
    title: 'Your solution and quote',
    business:
      'We present the system we designed for this property and what it costs, itemised, with nothing hidden below the line. One action approves it.',
    primaryUser: 'Homeowner, pre-purchase',
    systemOfRecord: ['Salesforce', 'JDE'],
    dataDirection: 'read-write',
    integration:
      'Quote generated from the configured solution. Pricing sourced from JDE. Approval writes back to the Opportunity and triggers installation scheduling.',
    bf: ['BF6'],
    openDecision:
      'CPQ platform is undecided. Revenue Cloud Advanced versus an alternative determines how the quote is assembled and how pricing governance works. Until this lands, the quote object shape is provisional.',
    phase: 'V1',
  },
  {
    id: 'install-tracking',
    callout: 1,
    screen: '/install',
    roles: ['client-prospect'],
    title: 'Installation and project tracking',
    business:
      'The homeowner sees the stages, the crew and the dates, and knows what is happening in their yard without calling anyone.',
    primaryUser: 'Homeowner, in project',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'Work Order chain with stage milestones. Requires the install-to-maintain handoff to be reliable end to end.',
    bf: ['BF3'],
    openDecision:
      'Installation project management tool is not selected. Bidirectional integration with field service is the main complexity.',
    phase: 'V2',
  },
  {
    id: 'handover',
    callout: 1,
    screen: '/handover',
    roles: ['client-prospect', 'client-owner'],
    title: 'Handover',
    business:
      'The moment the customer becomes an owner. System registered, warranty running, care contract active, and the portal changes shape around them.',
    primaryUser: 'Homeowner, at completion',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read-write',
    integration:
      'Work Order closure creates the Asset, activates the ServiceContract, starts warranty, and triggers the first satisfaction survey.',
    bf: ['BF2', 'BF3', 'BF4'],
    openDecision: null,
    phase: 'V2',
  },

  /* ---------------------------------------------------------------- */
  /* client-owner                                                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'next-visit',
    callout: 1,
    screen: '/home',
    roles: ['client-owner'],
    title: 'What happens next',
    business:
      'The single question every homeowner opens the portal to answer. Next visit, who is coming, and whether anything is needed from them.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'Next scheduled Work Order for the Asset, plus its status chain: booked, confirmed, on the way. Status is pushed from field service.',
    bf: ['BF3', 'BF4'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'sp-contact',
    callout: 2,
    screen: '/home',
    roles: ['client-owner'],
    title: 'Your Service Point',
    business:
      'A named local team with a direct line. The turnkey promise falls apart if the customer cannot reach a human.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration: 'ServiceTerritory and ServiceResource records for the owning Service Point.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'system-info',
    callout: 1,
    screen: '/system',
    roles: ['client-owner'],
    title: 'System details',
    business:
      'What is installed, when it went in, how long the warranty runs. The record the homeowner needs when they sell the house.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration: 'Asset record with warranty and install data.',
    bf: ['BF4'],
    openDecision:
      'France has no installed-base system today. Their asset records require a net-new field inventory exercise, not a migration, and it needs a field owner.',
    phase: 'V1',
  },
  {
    id: 'system-history',
    callout: 2,
    screen: '/system',
    roles: ['client-owner'],
    title: 'Service history',
    business:
      'Every visit, in plain language, in one timeline. Parts orders and service visits interleave, because the customer does not care which system they came from.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce', 'Commerce (TBD)'],
    dataDirection: 'read',
    integration:
      'Merges closed Work Orders with commerce order history into one chronological view. This merge is the single-login argument made visible.',
    bf: ['BF3', 'BF4'],
    openDecision: 'Commerce platform undecided. Affects how order history is retrieved.',
    phase: 'V1',
  },
  {
    id: 'system-impact',
    callout: 3,
    screen: '/system',
    roles: ['client-owner'],
    title: 'Environmental impact',
    business:
      'What a passive biofilter has quietly not done: no blower, no aerator, no power drawn to treat the water. A real difference from the systems Ecoflo competes with, and nobody is telling the customer about it.',
    primaryUser: 'System owner',
    systemOfRecord: ['Prototype only'],
    dataDirection: 'read',
    integration:
      'Estimated from the install date and an assumed household size. There is no meter on an Ecoflo and there is no plan to add one, so this is arithmetic on a calendar and is labelled as an estimate on screen.',
    bf: ['none'],
    openDecision:
      'Whether PTWE will stand behind a comparison against an aerated system in front of a customer in a regulated market, and what the per-household water and per-year energy figures actually are. All three inputs are placeholders in ASSUMPTIONS. If the answer to the comparison is no, this card comes out rather than being softened.',
    phase: 'V2',
  },
  {
    id: 'system-documents',
    callout: 4,
    screen: '/system',
    roles: ['client-owner'],
    title: 'Documents',
    business:
      'Permit, installation report, warranty and compliance certificate, all retrievable without phoning the office.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration: 'Files related to the Asset and its Work Orders. Third-party document delivery component.',
    bf: ['BF4'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'invoices',
    callout: 1,
    screen: '/invoices',
    roles: ['client-owner'],
    title: 'Invoices and payment',
    business:
      'What is owed, what is paid, and the ability to put the care contract on autopay. Recurring revenue depends on this being effortless.',
    primaryUser: 'System owner',
    systemOfRecord: ['JDE'],
    dataDirection: 'read',
    integration:
      'Invoice and balance data originates in JDE and is surfaced read-only through the integration layer. Payment execution runs through the regional payment partner.',
    bf: ['BF2', 'BF5'],
    openDecision:
      'Payment partner coverage differs by region. US coverage needs confirmation before autopay can be promised outside Canada.',
    phase: 'V2',
    privacy: 'Payment instrument data is never stored in the portal. Tokenised at the payment partner.',
  },
  {
    id: 'contract',
    callout: 1,
    screen: '/contract',
    roles: ['client-owner'],
    title: 'Care contract',
    business:
      'What the customer is covered for, what it costs, when it renews. Renewal should feel like nothing happening, not like a letter arriving.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'ServiceContract with Entitlements. Automated renewal replaces the JDE renewal letter process.',
    bf: ['BF2'],
    openDecision:
      'Service contract platform undecided. Revenue Cloud Advanced versus native Contract Management gates this section and the renewal automation behind it.',
    phase: 'V2',
  },
  {
    id: 'booking',
    callout: 1,
    screen: '/book',
    roles: ['client-owner'],
    title: 'Book a visit',
    business:
      'Three taps to a confirmed appointment. Every booking that does not become a phone call is capacity returned to the Service Point.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'write-back',
    integration:
      'Creates a Case which converts to a Work Order. Slot availability comes from field service scheduling. Post-sale queue, distinct from the pre-sale queue.',
    bf: ['BF2', 'BF3'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'parts-store',
    callout: 1,
    screen: '/parts',
    roles: ['client-owner'],
    title: 'Parts store',
    business:
      'Buy what the system needs without leaving the portal. Catalogue, cart and order history sit inside the same session as everything else.',
    primaryUser: 'System owner',
    systemOfRecord: ['Commerce (TBD)'],
    dataDirection: 'read-write',
    integration:
      'All commerce calls route through a thin adapter. Nothing in the UI is platform specific. Under a headless commerce option the storefront and account APIs are consumed directly with the customer identity federated in from Entra. Under a native CRM commerce option the identity bridge disappears but cost and iteration speed change materially. Checkout is likely to remain hosted by the commerce platform in V1 to keep card data out of scope.',
    bf: ['BF6'],
    openDecision:
      'E-commerce platform is not selected. This is one of the explicit gaps left open by the group architecture analysis and it belongs to PTWE to close.',
    phase: 'V1',
  },
  {
    id: 'account-identity',
    callout: 1,
    screen: '/account',
    roles: ['client-owner'],
    title: 'Profile and properties',
    business:
      'Who the customer is, and which properties they own. Built for more than one property from the start, because a second cottage should not need a second login.',
    primaryUser: 'System owner',
    systemOfRecord: ['Entra External ID', 'Salesforce'],
    dataDirection: 'read-write',
    integration:
      'Identity and credentials in Entra External ID; name, contact details and the property list in Salesforce. The two are joined on a federated identifier written at account creation. A person owns N Accounts, and the active one scopes every other screen.',
    bf: ['BF1'],
    openDecision:
      'Whether a second property is a second Account or an Account with several service addresses. The prototype assumes the former, which is what the current object model supports, but the answer changes what a property switcher is switching.',
    phase: 'V1',
    privacy:
      'Name, address, contact details and payment method all reachable from this screen. Access, correction and portability rights under Law 25 land here.',
  },
  {
    id: 'account-preferences',
    callout: 2,
    screen: '/account',
    roles: ['client-owner'],
    title: 'Language and notifications',
    business:
      'Language and how we get in touch, chosen by the customer rather than assumed from their postcode.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read-write',
    integration:
      'Language preference has to reach every outbound channel, not just the portal: invoices, appointment reminders, the field technician\u2019s copy of the visit summary. That makes it a customer attribute on the CRM record rather than a portal setting, and it is read by the document generator and the notification platform as well as by the interface.',
    bf: ['BF1', 'BF2'],
    openDecision:
      'Which platform owns transactional notification delivery, and whether per-channel opt-out is per-channel or per-topic. Quebec anti-spam rules constrain the answer.',
    phase: 'V1',
    privacy:
      'Consent state for commercial messages is a Law 25 record with its own retention requirement. It is not the same thing as a notification toggle and must not be stored as one.',
  },
  {
    id: 'messages',
    callout: 1,
    screen: '/messages',
    roles: ['client-owner'],
    title: 'Messages',
    business:
      'A direct line to the Service Point team, plus every notification the customer has received, in one thread.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read-write',
    integration: 'Case-backed messaging. Notification history from the marketing and service platforms.',
    bf: ['BF1', 'BF2'],
    openDecision: 'Customer marketing platform decision determines where notification history lives.',
    phase: 'V2',
  },
  {
    id: 'transfer',
    callout: 1,
    screen: '/system/transfer',
    roles: ['client-owner'],
    title: 'Transfer ownership',
    business:
      'The seller hands the system to the buyer in a few taps. Nobody else in this market does this well, and every transfer is a qualified lead.',
    primaryUser: 'System owner, selling',
    systemOfRecord: ['Salesforce', 'Entra External ID'],
    dataDirection: 'read-write',
    integration:
      'Re-parents the Asset to a new Account and Contact, closes the outgoing contract, invites the new owner to register. Also fires the time-to-transfer inspection trigger.',
    bf: ['BF1', 'BF4'],
    openDecision: null,
    phase: 'V2',
    privacy:
      'Transfers personal data between two data subjects. Service history visibility for the incoming owner needs a documented rule.',
  },
  {
    id: 'recommended',
    callout: 1,
    screen: '/recommended',
    roles: ['client-owner'],
    title: 'Recommended for your property',
    business:
      'Suggestions triggered by the age and condition of what is installed, not by a marketing calendar. Relevance is what makes this welcome rather than intrusive.',
    primaryUser: 'System owner',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'Lifecycle thresholds on the Asset generate replacement and upgrade opportunities. Thresholds are defined with operations, not by marketing.',
    bf: ['BF4'],
    openDecision: null,
    phase: 'V2',
    privacy: 'Profiling based on customer data. Requires a documented basis and an opt-out.',
  },

  /* ---------------------------------------------------------------- */
  /* sp-technician                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'my-day',
    callout: 1,
    screen: '/day',
    roles: ['sp-technician'],
    title: 'My day',
    business:
      'Everything the technician needs before the first coffee: what is booked, what is done, what is left, and where to go first.',
    primaryUser: 'Field technician',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration: 'Work Orders assigned to the ServiceResource for the current day, ordered by route.',
    bf: ['BF3'],
    openDecision:
      'Migration from the current field service platform must be formally confirmed before this surface is built for real.',
    phase: 'V1',
  },
  {
    id: 'wo-checklist',
    callout: 1,
    screen: '/wo/:id',
    roles: ['sp-technician'],
    title: 'Work order execution',
    business:
      'The job itself: what to check, what was replaced, photos, time on site, and the customer signature. If this screen is wrong, nothing downstream is right.',
    primaryUser: 'Field technician',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read-write',
    integration:
      'Work Order and Work Order Line Items. Parts consumed decrement Service Point inventory. Labour and time feed actual cost reporting. Offline capture with sync on reconnect is mandatory, field conditions are not negotiable.',
    bf: ['BF3'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'wo-summary-translation',
    callout: 2,
    screen: '/wo/:id',
    roles: ['sp-technician'],
    title: 'Visit summary for the customer',
    business:
      'What the technician records and what the homeowner reads are two different documents. The customer gets plain language, written once, at closure.',
    primaryUser: 'Field technician',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'write-back',
    integration:
      'A translation layer sits between the technical checklist and the customer-facing summary. This is a real design decision, not a formatting detail: it determines whether the customer experience holds together after the visit.',
    bf: ['BF3'],
    openDecision:
      'Whether the summary is technician-authored, template-driven, or assisted. Affects effort per job and consistency across the network.',
    phase: 'V1',
  },
  {
    id: 'route',
    callout: 1,
    screen: '/route',
    roles: ['sp-technician'],
    title: 'Route and schedule',
    business:
      'The day laid out geographically. Kilometres driven is a cost line and a satisfaction driver at the same time.',
    primaryUser: 'Field technician',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration: 'Scheduling and optimisation output. Feeds revenue per kilometre reporting upward.',
    bf: ['BF3'],
    openDecision: null,
    phase: 'V2',
  },
  {
    id: 'field-quote',
    callout: 1,
    screen: '/wo/:id/quote',
    roles: ['sp-technician'],
    title: 'Quote from the field',
    business:
      'The technician sees a failing system and can price the fix before leaving the driveway. The shortest path from problem to revenue in the whole model.',
    primaryUser: 'Field technician',
    systemOfRecord: ['Salesforce', 'JDE'],
    dataDirection: 'write-back',
    integration:
      'Creates an Opportunity and Quote from the Work Order context. Pricing must be governed, not typed from memory.',
    bf: ['BF6'],
    openDecision:
      'CPQ platform and pricing governance are both open. Ungoverned field pricing is the failure mode this section exists to prevent.',
    phase: 'V2',
  },
  {
    id: 'safety-check',
    callout: 1,
    screen: '/wo/:id/safety',
    roles: ['sp-technician'],
    title: 'Pre-job safety check',
    business:
      'A short check before work starts. Safety is a stated strategic pillar, and a pillar that lives only in a policy document is not a pillar.',
    primaryUser: 'Field technician',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'write-back',
    integration: 'Blocking checklist on the Work Order. Completion is recorded and reportable by Service Point.',
    bf: ['BF3'],
    openDecision: null,
    phase: 'V2',
  },

  /* ---------------------------------------------------------------- */
  /* sp-manager                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: 'sp-dashboard',
    callout: 1,
    screen: '/sp',
    roles: ['sp-manager'],
    title: 'Service Point dashboard',
    business:
      'How this Service Point is performing against its own targets. Local autonomy only works if the local team can see what it owns.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['Salesforce', 'JDE'],
    dataDirection: 'read',
    integration: 'Aggregates operational data from the CRM and financial actuals from the ERP.',
    bf: ['BF1', 'BF2', 'BF3'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'dispatch',
    callout: 1,
    screen: '/sp/dispatch',
    roles: ['sp-manager'],
    title: 'Dispatch board',
    business:
      'Who is doing what, and where the gaps are. Somebody assigns the work, and this is where they do it.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read-write',
    integration: 'Scheduling surface over Work Orders and ServiceResources.',
    bf: ['BF3'],
    openDecision: null,
    phase: 'V2',
  },
  {
    id: 'customers',
    callout: 1,
    screen: '/sp/customers',
    roles: ['sp-manager'],
    title: 'Customers',
    business:
      'Every account this Service Point owns, with contract status and installed equipment visible at a glance.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'Accounts filtered by Service Territory. Depends on the customer master being clean and deduplicated first.',
    bf: ['BF1', 'BF4'],
    openDecision: null,
    phase: 'V2',
    privacy: 'Customer personal data. Access scoped to the owning Service Point.',
  },
  {
    id: 'leads',
    callout: 1,
    screen: '/sp/leads',
    roles: ['sp-manager'],
    title: 'Leads',
    business:
      'New enquiries and the leads generated by pumping, inspections and transfers. The flywheel only turns if somebody works the list.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read-write',
    integration:
      'Leads routed by territory. Pre-sale queue, deliberately separate from the post-sale service queue.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'marcom-catalogue',
    callout: 1,
    screen: '/sp/marcom',
    roles: ['sp-manager'],
    title: 'MARCOM catalogue',
    business:
      'The Service Point orders door hangers, print, merchandise or a digital campaign. Marketing produces and ships it. Local teams get professional collateral without becoming marketers.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['Prototype only'],
    dataDirection: 'read-write',
    integration:
      'No system of record exists for this today. The prototype is proposing the capability, which makes this section a genuine new requirement rather than a redesign.',
    bf: ['none'],
    openDecision:
      'Where this lives. Options include the commerce platform, an internal request workflow, or a marketing tool. Needs an owner.',
    phase: 'V2',
  },
  {
    id: 'marcom-results',
    callout: 2,
    screen: '/sp/marcom',
    roles: ['sp-manager'],
    title: 'Campaign results',
    business:
      'What each order produced. Without leads attributed back, this is a merchandise store and the budget conversation gets lost.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration:
      'Campaign to Lead attribution. Closing this loop is what makes local marketing spend defensible.',
    bf: ['BF1'],
    openDecision: 'Customer marketing platform decision determines the attribution model.',
    phase: 'V2',
  },
  {
    id: 'inventory',
    callout: 1,
    screen: '/sp/inventory',
    roles: ['sp-manager'],
    title: 'Inventory',
    business:
      'What is on the shelf, what is on the truck, and what the next four weeks of booked work will consume. Running out of filter media cancels revenue.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['JDE', 'Salesforce'],
    dataDirection: 'read',
    integration:
      'Stock levels from the ERP. The consumption forecast is derived from scheduled filter media replacement work orders, which is the part that makes this section useful rather than decorative.',
    bf: ['BF3'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'team',
    callout: 1,
    screen: '/sp/team',
    roles: ['sp-manager'],
    title: 'Team and capacity',
    business:
      'A three to five person team with finite hours. Capacity is the real constraint on how fast a Service Point can grow.',
    primaryUser: 'Service Point manager',
    systemOfRecord: ['Salesforce'],
    dataDirection: 'read',
    integration: 'ServiceResource records with availability and utilisation.',
    bf: ['BF3'],
    openDecision:
      'Qualifications and absence have no home in the data model yet. Both are shown on this screen and neither has a system of record, which is a gap worth closing before this ships.',
    phase: 'V2',
  },

  /* ---------------------------------------------------------------- */
  /* shared                                                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'flo',
    callout: 1,
    screen: '/flo',
    roles: ['sp-technician', 'sp-manager'],
    title: 'Flo',
    business:
      'Anyone in the Service Point can ask a question and get an answer drawn from our own documentation, with the source shown. New technicians stop waiting for the one person who knows.',
    primaryUser: 'Any Service Point team member',
    systemOfRecord: ['Knowledge base'],
    dataDirection: 'read',
    integration:
      'Retrieval over an approved document set. Every answer cites its sources inline. Answers are never generated without a retrieved source, which is the difference between a useful tool and a liability on regulated content.',
    bf: ['none'],
    openDecision:
      'Knowledge base scope and ownership. Content authoring is the real effort here, not the retrieval layer.',
    phase: 'V1',
  },

  /* ---------------------------------------------------------------- */
  /* ptwe-global                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: 'network-map',
    callout: 1,
    screen: '/network',
    roles: ['ptwe-global'],
    title: 'Network overview',
    business:
      'The whole Service Point network on one screen, sized by revenue and coloured by how far each is from the service mix target.',
    primaryUser: 'PTWE leadership',
    systemOfRecord: ['Salesforce', 'JDE'],
    dataDirection: 'read',
    integration: 'Rollup across territories. Requires consistent territory definitions across regions.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'region-drill',
    callout: 1,
    screen: '/network/:regionId',
    roles: ['ptwe-global'],
    title: 'Region and Service Point drill',
    business:
      'Three tiers, one path: network, region, Service Point. Leadership sees the same numbers the local team sees.',
    primaryUser: 'PTWE leadership',
    systemOfRecord: ['Salesforce', 'JDE'],
    dataDirection: 'read',
    integration: 'Same aggregation as the Service Point dashboard, one level up.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V2',
  },
  {
    id: 'mix-tracker',
    callout: 1,
    screen: '/mix',
    roles: ['ptwe-global'],
    title: 'Strategic mix tracker',
    business:
      'Service revenue share against the target, at every level, over time. This is the number the whole transformation is measured by.',
    primaryUser: 'PTWE leadership',
    systemOfRecord: ['JDE', 'Salesforce'],
    dataDirection: 'read',
    integration:
      'Revenue classified by stream. Requires a governed definition of what counts as service revenue, applied identically in every region. Without that governance this chart is a debate rather than a measurement.',
    bf: ['BF1', 'BF2'],
    openDecision: 'Service revenue definition needs to be standardised across regions before this is trusted.',
    phase: 'V1',
  },
  {
    id: 'adoption',
    callout: 1,
    screen: '/adoption',
    roles: ['ptwe-global'],
    title: 'Digital adoption',
    business:
      'How many customers activated the portal, how much booking happens without a phone call, how often parts are bought online. These are the numbers that say whether the digital investment is working.',
    primaryUser: 'PTWE leadership',
    systemOfRecord: ['Entra External ID', 'Commerce (TBD)', 'Salesforce'],
    dataDirection: 'read',
    integration:
      'Activation from the identity platform, self-serve share from booking origin, attach rate from commerce. These KPIs need to be instrumented from day one, not retrofitted.',
    bf: ['none'],
    openDecision: 'Analytics and consent architecture. Measurement must be compatible with the consent model.',
    phase: 'V1',
    privacy: 'Behavioural analytics require consent under Law 25. Design measurement around that, not despite it.',
  },
  {
    id: 'flo-analytics',
    callout: 2,
    screen: '/adoption',
    roles: ['ptwe-global'],
    title: 'Flo usage and gaps',
    business:
      'What the network asks and what it could not answer. Unanswered questions are a direct list of what to document next.',
    primaryUser: 'PTWE leadership',
    systemOfRecord: ['Knowledge base'],
    dataDirection: 'read',
    integration: 'Query logs with retrieval-miss flagging.',
    bf: ['none'],
    openDecision: null,
    phase: 'V1',
  },
  {
    id: 'benchmarking',
    callout: 1,
    screen: '/benchmarking',
    roles: ['ptwe-global'],
    title: 'Benchmarking and alerts',
    business:
      'Which Service Points lead, which lag, and what needs attention this week. Comparison is how a decentralised network improves itself.',
    primaryUser: 'PTWE leadership',
    systemOfRecord: ['Salesforce', 'JDE'],
    dataDirection: 'read',
    integration: 'Cross-territory comparison on selectable metrics with threshold alerting.',
    bf: ['BF1'],
    openDecision: null,
    phase: 'V2',
  },
  {
    id: 'readiness',
    callout: 1,
    screen: '/readiness',
    roles: ['ptwe-global'],
    title: 'Service Point readiness',
    business:
      'How ready each Service Point is on systems, data and tooling. Acquisitions are the growth engine, so onboarding speed is a strategic metric.',
    primaryUser: 'PTWE leadership',
    systemOfRecord: ['Prototype only'],
    dataDirection: 'none',
    integration:
      'Proposed capability. Scores the digital onboarding playbook per site. No system of record today.',
    bf: ['BF5'],
    openDecision: 'Whether digital onboarding readiness is formally tracked, and who owns the scorecard.',
    phase: 'Later',
  },
];

/** Sections for a given screen, ordered by callout number. */
export const sectionsForScreen = (screen: string): Section[] =>
  sections.filter((s) => s.screen === screen).sort((a, b) => a.callout - b.callout);

/** Every section that is currently blocked by an unresolved decision. */
export const blockedSections = (): Section[] => sections.filter((s) => s.openDecision !== null);

/** Every section that touches personal data. Drives the privacy review list. */
export const privacySections = (): Section[] => sections.filter((s) => s.privacy !== undefined);
