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
import { GlobalAdoption } from './screens/global/Adoption';
import { GlobalMix } from './screens/global/Mix';
import { GlobalNetwork } from './screens/global/Network';
import { ManagerDashboard } from './screens/manager/Dashboard';
import { ManagerInventory } from './screens/manager/Inventory';
import { ManagerLeads } from './screens/manager/Leads';
import { ManagerMarcom } from './screens/manager/Marcom';
import { OwnerBook } from './screens/owner/Book';
import { OwnerHome } from './screens/owner/Home';
import { OwnerParts } from './screens/owner/Parts';
import { OwnerSystem } from './screens/owner/System';
import { Placeholder } from './screens/Placeholder';
import { ProspectQuote } from './screens/prospect/Quote';
import { ProspectRequest } from './screens/prospect/Request';
import { ProspectStart } from './screens/prospect/Start';
import { Flo } from './screens/shared/Flo';
import { TechnicianDay } from './screens/technician/Day';
import { TechnicianWorkOrder } from './screens/technician/WorkOrder';
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
        <ProspectStart />
      }
    />
    <Route
      path="/request"
      element={
        <ProspectRequest />
      }
    />
    <Route path="/soil-test" element={<Placeholder {...P2.soilTest} />} />
    <Route
      path="/quote"
      element={
        <ProspectQuote />
      }
    />
    <Route path="/install" element={<Placeholder {...P2.install} />} />
    <Route path="/handover" element={<Placeholder {...P2.handover} />} />

    {/* client-owner */}
    <Route
      path="/home"
      element={
        <OwnerHome />
      }
    />
    <Route
      path="/system"
      element={
        <OwnerSystem />
      }
    />
    <Route path="/invoices" element={<Placeholder {...P2.invoices} />} />
    <Route path="/contract" element={<Placeholder {...P2.contract} />} />
    <Route
      path="/book"
      element={
        <OwnerBook />
      }
    />
    <Route
      path="/parts"
      element={
        <OwnerParts />
      }
    />
    <Route path="/messages" element={<Placeholder {...P2.messages} />} />
    <Route path="/system/transfer" element={<Placeholder {...P2.transfer} />} />
    <Route path="/recommended" element={<Placeholder {...P2.recommended} />} />

    {/* sp-technician */}
    <Route
      path="/day"
      element={
        <TechnicianDay />
      }
    />
    <Route
      path="/wo/:id"
      element={
        <TechnicianWorkOrder />
      }
    />
    <Route path="/route" element={<Placeholder {...P2.route} />} />
    <Route path="/wo/:id/quote" element={<Placeholder {...P2.fieldQuote} />} />
    <Route path="/wo/:id/safety" element={<Placeholder {...P2.safety} />} />

    {/* sp-manager */}
    <Route
      path="/sp"
      element={
        <ManagerDashboard />
      }
    />
    <Route path="/sp/dispatch" element={<Placeholder {...P2.dispatch} />} />
    <Route path="/sp/customers" element={<Placeholder {...P2.customers} />} />
    <Route
      path="/sp/leads"
      element={
        <ManagerLeads />
      }
    />
    <Route
      path="/sp/marcom"
      element={
        <ManagerMarcom />
      }
    />
    <Route
      path="/sp/inventory"
      element={
        <ManagerInventory />
      }
    />
    <Route path="/sp/team" element={<Placeholder {...P2.team} />} />

    {/* shared, both Service Point roles */}
    <Route
      path="/flo"
      element={
        <Flo />
      }
    />

    {/* ptwe-global */}
    <Route
      path="/network"
      element={
        <GlobalNetwork />
      }
    />
    <Route path="/network/:regionId" element={<Placeholder {...P2.regionDrill} />} />
    <Route
      path="/mix"
      element={
        <GlobalMix />
      }
    />
    <Route
      path="/adoption"
      element={
        <GlobalAdoption />
      }
    />
    <Route path="/benchmarking" element={<Placeholder {...P2.benchmarking} />} />
    <Route path="/readiness" element={<Placeholder {...P2.readiness} />} />

    {/* Anything else returns to the current role's home rather than dead ending. */}
    <Route path="*" element={<RootRedirect />} />
  </Routes>
);
