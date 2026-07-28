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
import { GlobalBenchmarking } from './screens/global/Benchmarking';
import { GlobalMix } from './screens/global/Mix';
import { GlobalNetwork } from './screens/global/Network';
import { GlobalReadiness } from './screens/global/Readiness';
import { GlobalRegionDrill } from './screens/global/RegionDrill';
import { ManagerCustomers } from './screens/manager/Customers';
import { ManagerDashboard } from './screens/manager/Dashboard';
import { ManagerDispatch } from './screens/manager/Dispatch';
import { ManagerInventory } from './screens/manager/Inventory';
import { ManagerLeads } from './screens/manager/Leads';
import { ManagerMarcom } from './screens/manager/Marcom';
import { ManagerTeam } from './screens/manager/Team';
import { OwnerBook } from './screens/owner/Book';
import { OwnerContract } from './screens/owner/Contract';
import { OwnerHome } from './screens/owner/Home';
import { OwnerInvoices } from './screens/owner/Invoices';
import { OwnerMessages } from './screens/owner/Messages';
import { OwnerParts } from './screens/owner/Parts';
import { OwnerRecommended } from './screens/owner/Recommended';
import { OwnerSystem } from './screens/owner/System';
import { OwnerTransfer } from './screens/owner/Transfer';
import { ProspectHandover } from './screens/prospect/Handover';
import { ProspectInstall } from './screens/prospect/Install';
import { ProspectQuote } from './screens/prospect/Quote';
import { ProspectRequest } from './screens/prospect/Request';
import { ProspectSoilTest } from './screens/prospect/SoilTest';
import { ProspectStart } from './screens/prospect/Start';
import { Flo } from './screens/shared/Flo';
import { TechnicianDay } from './screens/technician/Day';
import { TechnicianFieldQuote } from './screens/technician/FieldQuote';
import { TechnicianRoute } from './screens/technician/Route';
import { TechnicianSafety } from './screens/technician/Safety';
import { TechnicianWorkOrder } from './screens/technician/WorkOrder';
import { useRole } from './shell/useRole';

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
    <Route path="/soil-test" element={<ProspectSoilTest />} />
    <Route
      path="/quote"
      element={
        <ProspectQuote />
      }
    />
    <Route path="/install" element={<ProspectInstall />} />
    <Route path="/handover" element={<ProspectHandover />} />

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
    <Route path="/invoices" element={<OwnerInvoices />} />
    <Route path="/contract" element={<OwnerContract />} />
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
    <Route path="/messages" element={<OwnerMessages />} />
    <Route path="/system/transfer" element={<OwnerTransfer />} />
    <Route path="/recommended" element={<OwnerRecommended />} />

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
    <Route path="/route" element={<TechnicianRoute />} />
    <Route path="/wo/:id/quote" element={<TechnicianFieldQuote />} />
    <Route path="/wo/:id/safety" element={<TechnicianSafety />} />

    {/* sp-manager */}
    <Route
      path="/sp"
      element={
        <ManagerDashboard />
      }
    />
    <Route path="/sp/dispatch" element={<ManagerDispatch />} />
    <Route path="/sp/customers" element={<ManagerCustomers />} />
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
    <Route path="/sp/team" element={<ManagerTeam />} />

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
    <Route path="/network/:regionId" element={<GlobalRegionDrill />} />
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
    <Route path="/benchmarking" element={<GlobalBenchmarking />} />
    <Route path="/readiness" element={<GlobalReadiness />} />

    {/* Anything else returns to the current role's home rather than dead ending. */}
    <Route path="*" element={<RootRedirect />} />
  </Routes>
);
