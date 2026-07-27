/**
 * routes.tsx
 *
 * All thirty-four screens from the inventory in CLAUDE.md, in journey order.
 *
 * Every route resolves from pass 1 onward. A screen marked P2 renders its layout
 * skeleton and its annotation, so the Blueprint layer and the exported spec are
 * complete even where the content is not. The route strings match the `screen`
 * keys in `data/sections.ts` exactly, which is how a screen finds its callouts.
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import { Placeholder } from './screens/Placeholder';
import { useRole } from './shell/useRole';

/**
 * Pass 2 fills these in. Each entry carries what belongs on the screen, so the
 * skeleton says something useful rather than "coming soon".
 */
const P2 = {
  soilTest: {
    screen: '/soil-test',
    title: 'Your soil test and what we found',
    eyebrow: 'Before install',
    lead: 'We assess the land and publish the findings in plain language. No jargon, no PDF to decode.',
    belongsHere: [
      'Visit date, and who came to the property',
      'What the soil test measured, in plain language',
      'What it means for the system we can install',
      'The report itself, readable on the phone',
    ],
  },
  install: {
    screen: '/install',
    title: 'Your installation',
    eyebrow: 'Before install',
    lead: 'Where the project stands, what happens next, and who is on site.',
    belongsHere: [
      'Project stage, as a sequence rather than a progress bar',
      'Permit status, filed on the customer behalf',
      'Scheduled install dates and the crew assigned',
      'Photos from site as the work proceeds',
    ],
  },
  handover: {
    screen: '/handover',
    title: 'Your system is live',
    eyebrow: 'Before install',
    lead: 'The moment the prospect becomes an owner. Everything moves into one place they can return to.',
    belongsHere: [
      'What was installed, and the warranty that now applies',
      'The care contract offer, and what it covers',
      'First maintenance visit, already scheduled',
      'Handover to the owner view of the portal',
    ],
  },
  invoices: {
    screen: '/invoices',
    title: 'Invoices and payment',
    lead: 'What is owed, what is paid, and what is on autopay.',
    belongsHere: [
      'Outstanding balance, and the single action to settle it',
      'Invoice history, each one downloadable',
      'Payment method on file, and autopay state',
      'Which visit or order each invoice relates to',
    ],
  },
  contract: {
    screen: '/contract',
    title: 'Your care contract',
    lead: 'What the contract covers, when it renews, and what it has saved.',
    belongsHere: [
      'Cover, listed as plain entitlements',
      'Renewal date and price',
      'Visits included, and visits used this term',
      'How to change or end the contract',
    ],
  },
  messages: {
    screen: '/messages',
    title: 'Messages',
    lead: 'One thread with the Service Point team. No ticket numbers, no queue names.',
    belongsHere: [
      'Conversation with the Service Point team',
      'Attachments, including photos from the property',
      'Which system or visit a thread relates to',
      'Response time the customer can expect',
    ],
  },
  transfer: {
    screen: '/system/transfer',
    title: 'Transfer ownership',
    lead: 'Selling the property. The system, its history and its contract move to the new owner.',
    belongsHere: [
      'Who the system is transferring to',
      'What history transfers, and what stays private',
      'What happens to the care contract',
      'Confirmation, and the consent this requires',
    ],
  },
  recommended: {
    screen: '/recommended',
    title: 'Recommended for your property',
    lead: 'Suggestions grounded in this system, its age and its service history. Never a generic upsell.',
    belongsHere: [
      'Why each item is recommended, tied to a real record',
      'What it costs and what it prevents',
      'Which are due now and which are worth knowing about',
      'A clear way to decline without being asked again',
    ],
  },
  route: {
    screen: '/route',
    title: 'Route and schedule',
    lead: 'The day as a sequence of stops, with travel between them.',
    belongsHere: [
      'Stops in order, with drive time between',
      'Map of the run, degrading to a list on a small screen',
      'What is fixed and what can move',
      'Offline state, since coverage is not guaranteed',
    ],
  },
  fieldQuote: {
    screen: '/wo/:id/quote',
    title: 'Field quote',
    lead: 'Quoting extra work while standing at the system, before leaving site.',
    belongsHere: [
      'What was found that is outside the contract',
      'Parts and labour, priced from the ERP',
      'Customer approval captured on site',
      'What happens if they decline',
    ],
  },
  safety: {
    screen: '/wo/:id/safety',
    title: 'Pre-job safety check',
    lead: 'Completed before work starts. Blocking, not advisory.',
    belongsHere: [
      'Site hazards specific to this property',
      'Confined space and gas checks',
      'Equipment condition confirmation',
      'Sign off, and what happens when a check fails',
    ],
  },
  dispatch: {
    screen: '/sp/dispatch',
    title: 'Dispatch board',
    lead: 'Who is going where, and what is still unassigned.',
    belongsHere: [
      'Unassigned work, and why each one is waiting',
      'Technicians against the day, as bordered rows',
      'Capacity and travel conflicts made visible',
      'Reassignment, and what the customer sees when it happens',
    ],
  },
  customers: {
    screen: '/sp/customers',
    title: 'Customers',
    lead: 'Every account this Service Point holds, searchable.',
    belongsHere: [
      'Account list with system, contract and open work',
      'Search and filter, table forward',
      'One account drill showing the unified timeline',
      'Which records are read only from the master system',
    ],
  },
  team: {
    screen: '/sp/team',
    title: 'Team and capacity',
    lead: 'Who is available, what they are qualified for, and where the week is tight.',
    belongsHere: [
      'Technicians, with qualifications and current load',
      'Capacity against booked work for the coming weeks',
      'Where the constraint actually is',
      'Absence and its effect on committed visits',
    ],
  },
  regionDrill: {
    screen: '/network/:regionId',
    title: 'Region detail',
    lead: 'One region, its Service Points, and how they compare.',
    belongsHere: [
      'Service Points ranked within the region',
      'Revenue, service mix and contract base per Service Point',
      'Which Service Points lead and which lag the target',
      'Drill into a single Service Point',
    ],
  },
  benchmarking: {
    screen: '/benchmarking',
    title: 'Benchmarking and alerts',
    lead: 'Where a Service Point is out of line with its peers, and worth a conversation.',
    belongsHere: [
      'Peer comparison on the measures that matter',
      'Alerts, as text and a left rule, never a coloured dot',
      'What good looks like, sourced from the network',
      'What action each alert implies',
    ],
  },
  readiness: {
    screen: '/readiness',
    title: 'Service Point readiness',
    lead: 'How prepared each Service Point is for the portal, before it is switched on for their customers.',
    belongsHere: [
      'Readiness by Service Point, and what is missing',
      'Data quality gates that must pass first',
      'Training and adoption state per team',
      'Sequence for rollout, and what gates each wave',
    ],
  },
} as const;

/**
 * The role determines what `/` means. A reviewer who lands on the root should
 * see the opening role's home rather than a chooser.
 */
const RootRedirect = () => {
  const { role } = useRole();
  return <Navigate to={role.home} replace />;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />

    {/* client-prospect */}
    <Route
      path="/start"
      element={
        <Placeholder
          screen="/start"
          eyebrow="Before install"
          title="Tell us about your property"
          lead="Where it is, and what brings you here. You design nothing, we take it from there."
          belongsHere={[
            'Property address, which routes to the owning Service Point',
            'What brings them here, as a reason code',
            'How to reach them',
            'Consent and purpose statement at the point of collection',
          ]}
        />
      }
    />
    <Route
      path="/request"
      element={
        <Placeholder
          screen="/request"
          eyebrow="Before install"
          title="We have your request"
          lead="One named team owns the whole job, and you can see who they are."
          belongsHere={[
            'Confirmation of what was asked for',
            'The Service Point team assigned, with names',
            'What happens next, and when',
            'The account created at the moment they asked for help',
          ]}
        />
      }
    />
    <Route path="/soil-test" element={<Placeholder {...P2.soilTest} />} />
    <Route
      path="/quote"
      element={
        <Placeholder
          screen="/quote"
          eyebrow="Before install"
          title="The system we designed for your property"
          lead="Here is what we recommend and why, itemised, with nothing hidden below the line."
          belongsHere={[
            'The recommended system, and why this one for this land',
            'What the price includes, line by line',
            'What is already covered by the work we have done',
            'One action to approve',
          ]}
        />
      }
    />
    <Route path="/install" element={<Placeholder {...P2.install} />} />
    <Route path="/handover" element={<Placeholder {...P2.handover} />} />

    {/* client-owner */}
    <Route
      path="/home"
      element={
        <Placeholder
          screen="/home"
          title="Home"
          lead="One question answered above everything else: what happens next."
          belongsHere={[
            'Next visit, on the forest block: date, technician, arrival state',
            'A single action',
            'Quiet rows beneath: system, contract, invoices',
            'Nothing that competes with the top block',
          ]}
        />
      }
    />
    <Route
      path="/system"
      element={
        <Placeholder
          screen="/system"
          title="My system"
          lead="What is installed at the property, how it is doing, and everything that has happened to it."
          belongsHere={[
            'The system, its model and when it went in',
            'Condition in plain language, not a health score',
            'Service history as one timeline, visits and orders together',
            'Warranty, and what it covers',
          ]}
        />
      }
    />
    <Route path="/invoices" element={<Placeholder {...P2.invoices} />} />
    <Route path="/contract" element={<Placeholder {...P2.contract} />} />
    <Route
      path="/book"
      element={
        <Placeholder
          screen="/book"
          title="Book a visit"
          lead="Pick a time that works. Your Service Point team confirms it."
          belongsHere={[
            'What the visit is for',
            'Real availability from the Service Point calendar',
            'Arrival window, not a promise of a time',
            'Confirmation, and how to change it later',
          ]}
        />
      }
    />
    <Route
      path="/parts"
      element={
        <Placeholder
          screen="/parts"
          title="Parts"
          lead="Parts that fit the system you actually own."
          belongsHere={[
            'Catalogue filtered to this system model',
            'Price, and the contract discount where it applies',
            'Cart and checkout, behind the commerce adapter',
            'Order history, alongside service history',
          ]}
        />
      }
    />
    <Route path="/messages" element={<Placeholder {...P2.messages} />} />
    <Route path="/system/transfer" element={<Placeholder {...P2.transfer} />} />
    <Route path="/recommended" element={<Placeholder {...P2.recommended} />} />

    {/* sp-technician */}
    <Route
      path="/day"
      element={
        <Placeholder
          screen="/day"
          title="My day"
          lead="Today's jobs, in order, readable in sunlight."
          belongsHere={[
            'Jobs as dense rows, status as a left rule and a label',
            'The active job, distinguishable at a glance',
            'What each job needs before arrival',
            'Offline state, since a basement has no signal',
          ]}
        />
      }
    />
    <Route
      path="/wo/:id"
      element={
        <Placeholder
          screen="/wo/:id"
          title="Work order"
          lead="The operational credibility screen. Everything the technician records on site."
          belongsHere={[
            'Checklist, with required items enforced',
            'Photo capture, before and after',
            'Parts consumed, against truck stock',
            'Time capture and customer signature',
            'Offline indicator, and what happens to the record',
            'The plain-language summary generated for the customer',
          ]}
        />
      }
    />
    <Route path="/route" element={<Placeholder {...P2.route} />} />
    <Route path="/wo/:id/quote" element={<Placeholder {...P2.fieldQuote} />} />
    <Route path="/wo/:id/safety" element={<Placeholder {...P2.safety} />} />

    {/* sp-manager */}
    <Route
      path="/sp"
      element={
        <Placeholder
          screen="/sp"
          title="Service Point dashboard"
          lead="How this Service Point is doing, and what needs attention today."
          belongsHere={[
            'The measures this Service Point is held to',
            'Work today, and what is at risk',
            'Service mix against the target',
            'What needs a decision, as rows not tiles',
          ]}
        />
      }
    />
    <Route path="/sp/dispatch" element={<Placeholder {...P2.dispatch} />} />
    <Route path="/sp/customers" element={<Placeholder {...P2.customers} />} />
    <Route
      path="/sp/leads"
      element={
        <Placeholder
          screen="/sp/leads"
          title="Leads"
          lead="Who has asked for help, where they came from, and what stage they are at."
          belongsHere={[
            'Leads as bordered rows, with reason and source',
            'Stage, as a text label and a left rule',
            'Which need contacting today',
            'Where each lead came from, for attribution',
          ]}
        />
      }
    />
    <Route
      path="/sp/marcom"
      element={
        <Placeholder
          screen="/sp/marcom"
          title="MARCOM catalogue"
          lead="Order local marketing, and see what it generated. Not a merch store."
          belongsHere={[
            'Catalogue, with custom fields per item',
            'Price, minimum quantity and lead time',
            'Order history and production state',
            'Campaign results: leads generated and attributed back',
          ]}
        />
      }
    />
    <Route
      path="/sp/inventory"
      element={
        <Placeholder
          screen="/sp/inventory"
          title="Inventory"
          lead="What is on the shelf, what is on the truck, and what the schedule is about to consume."
          belongsHere={[
            'Service Point stock and truck stock, kept separate',
            'On hand against reserved and reorder point',
            'Consumption forecast derived from scheduled filter media jobs',
            'What to reorder, and when',
          ]}
        />
      }
    />
    <Route path="/sp/team" element={<Placeholder {...P2.team} />} />

    {/* shared, both Service Point roles */}
    <Route
      path="/flo"
      element={
        <Placeholder
          screen="/flo"
          title="Flo"
          lead="Answers grounded in the documents we actually publish, with the source cited every time."
          belongsHere={[
            'A question, and an answer',
            'Inline citations to the source documents',
            'Scope filtered to the role asking',
            'What Flo could not answer, recorded rather than hidden',
          ]}
        />
      }
    />

    {/* ptwe-global */}
    <Route
      path="/network"
      element={
        <Placeholder
          screen="/network"
          title="Network overview"
          lead="Every region and Service Point, and how the network is performing."
          belongsHere={[
            'Map as hero, degrading to a ranked list below 1024px',
            'Regions and their Service Points',
            'The measures the network is run on',
            'Where to drill next',
          ]}
        />
      }
    />
    <Route path="/network/:regionId" element={<Placeholder {...P2.regionDrill} />} />
    <Route
      path="/mix"
      element={
        <Placeholder
          screen="/mix"
          title="Strategic mix tracker"
          lead="Service revenue share against the 35 percent target, at network, region and Service Point level."
          belongsHere={[
            'Network service share against the target',
            'Trend over the last four periods',
            'Ranking around the target line, lead against lag',
            'Region and Service Point breakdown',
          ]}
        />
      }
    />
    <Route
      path="/adoption"
      element={
        <Placeholder
          screen="/adoption"
          title="Digital adoption and Flo analytics"
          lead="The digital measures the VP Numeric Strategy is accountable for."
          belongsHere={[
            'Portal activation rate',
            'Self-serve booking share',
            'E-commerce attach rate',
            'Flo usage, and the questions it could not answer',
          ]}
        />
      }
    />
    <Route path="/benchmarking" element={<Placeholder {...P2.benchmarking} />} />
    <Route path="/readiness" element={<Placeholder {...P2.readiness} />} />

    {/* Anything else returns to the current role's home rather than dead ending. */}
    <Route path="*" element={<RootRedirect />} />
  </Routes>
);
