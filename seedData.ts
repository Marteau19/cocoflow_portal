/**
 * seedData.ts
 *
 * Single source of truth for the prototype. Do not hardcode data anywhere else.
 *
 * Entity names deliberately mirror the CRM object model so the prototype doubles
 * as a data-model specification. Fields whose real source is the ERP carry a
 * `_jde` suffix so the system boundary is visible on screen and in review.
 *
 * All figures are mock. No real financial data appears in this file.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Currency = 'CAD' | 'USD' | 'EUR';

export interface ServiceTerritory {
  id: string;
  name: string;
  regionId: string;
  radiusKm: number;
  coords: [number, number];
}

export interface ServiceResource {
  id: string;
  territoryId: string;
  name: string;
  role: 'technician' | 'manager' | 'installer';
  initials: string;
  photo: string | null;
  rating: number;
}

export interface Account {
  id: string;
  name: string;
  territoryId: string;
  propertyType: 'primary' | 'seasonal' | 'commercial';
  address: string;
  city: string;
  province: string;
  since: string | null;
}

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  /** Set once the contact exists in the identity platform */
  identityLinked: boolean;
}

export interface Asset {
  id: string;
  accountId: string;
  product: string;
  model: string;
  serial: string;
  installedOn: string;
  warrantyEndsOn: string;
  status: 'healthy' | 'attention' | 'service-due';
  lastServiceOn: string;
  nextServiceDue: string;
}

export interface ServiceContract {
  id: string;
  accountId: string;
  assetId: string;
  name: string;
  startsOn: string;
  renewsOn: string;
  status: 'active' | 'lapsed' | 'pending';
  annualPrice_jde: number;
  currency: Currency;
  autopay: boolean;
  entitlements: string[];
}

export interface WorkOrderLineItem {
  id: string;
  description: string;
  sku: string | null;
  quantity: number;
  consumesInventory: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  type: 'check' | 'measure' | 'photo' | 'note';
  required: boolean;
  value: string | boolean | null;
}

export interface WorkOrder {
  id: string;
  accountId: string;
  assetId: string;
  contractId: string | null;
  territoryId: string;
  resourceId: string;
  type: 'FMR' | 'maintenance' | 'repair' | 'inspection' | 'install' | 'soil-test';
  status: 'booked' | 'confirmed' | 'on-the-way' | 'in-progress' | 'complete';
  scheduledFor: string;
  windowStart: string;
  windowEnd: string;
  durationMin: number;
  lineItems: WorkOrderLineItem[];
  checklist: ChecklistItem[];
  /** What the technician records */
  technicianNotes: string | null;
  /** What the customer reads. Generated from the checklist at closure. */
  customerSummary: string | null;
  signedBy: string | null;
}

export interface Case {
  id: string;
  accountId: string;
  assetId: string | null;
  subject: string;
  queue: 'pre-sale' | 'post-sale';
  status: 'new' | 'in-progress' | 'resolved';
  openedOn: string;
  lastMessageOn: string;
}

export interface Lead {
  id: string;
  territoryId: string;
  name: string;
  city: string;
  reason: 'new-build' | 'replacing-failing' | 'buying-selling' | 'not-sure';
  source: 'web' | 'pumping' | 'inspection' | 'transfer' | 'referral';
  createdOn: string;
  status: 'new' | 'contacted' | 'soil-test-booked' | 'quoted' | 'won' | 'lost';
  identityLinked: boolean;
}

export interface Quote {
  id: string;
  leadId: string | null;
  accountId: string | null;
  issuedOn: string;
  validDays: number;
  currency: Currency;
  lines: { label: string; amount_jde: number | null; included: boolean }[];
  total_jde: number;
  status: 'draft' | 'sent' | 'approved' | 'expired';
}

export interface Product2 {
  id: string;
  sku: string;
  name: string;
  category: 'filter-media' | 'pump' | 'control' | 'lid' | 'accessory';
  price_jde: number;
  currency: Currency;
  fitsModels: string[];
}

export interface Order {
  id: string;
  accountId: string;
  placedOn: string;
  channel: 'portal' | 'phone';
  lines: { sku: string; quantity: number; price_jde: number }[];
  total_jde: number;
  currency: Currency;
  status: 'placed' | 'shipped' | 'delivered';
}

export interface InventoryItem {
  sku: string;
  territoryId: string;
  location: 'depot' | 'truck';
  onHand: number;
  reserved: number;
  reorderPoint: number;
  /** Derived from scheduled work orders in the next 28 days */
  forecastConsumption28d: number;
}

export interface MarcomItem {
  id: string;
  name: string;
  category: 'print' | 'signage' | 'merchandise' | 'digital';
  unitPrice: number;
  currency: Currency;
  minQuantity: number;
  leadTimeDays: number;
  customFields: { key: string; label: string; type: 'text' | 'select' }[];
}

export interface MarcomOrder {
  id: string;
  territoryId: string;
  itemId: string;
  quantity: number;
  placedOn: string;
  status: 'submitted' | 'in-production' | 'shipped' | 'live' | 'complete';
  leadsAttributed: number | null;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  section: string;
  audience: ('technician' | 'manager')[];
  updatedOn: string;
}

export interface ServicePoint {
  id: string;
  territoryId: string;
  name: string;
  regionId: string;
  revenue: number;
  target: number;
  servicePct: number;
  revenuePerKm: number;
  activeContracts: number;
  openCases: number;
  rating: number;
  readiness: number;
}

export interface Region {
  id: string;
  name: string;
  group: 'QC' | 'CAN-EN' | 'USA';
  currency: Currency;
  coords: [number, number];
  leaders: [string, string];
  servicePointIds: string[];
}

/* ------------------------------------------------------------------ */
/* The golden thread                                                   */
/*                                                                     */
/* One account, one system, one contract, one work order, visible from  */
/* all five roles. This is the most important data in the file.         */
/* ------------------------------------------------------------------ */

export const GOLDEN = {
  accountId: 'ACC-QC-004182',
  assetId: 'AST-QC-004182-1',
  contractId: 'SC-2026-00871',
  workOrderId: 'WO-2026-0412',
  territoryId: 'SP-QC-EST',
  leadId: 'LEAD-2026-1187',
} as const;

/* ------------------------------------------------------------------ */
/* Territories and people                                              */
/* ------------------------------------------------------------------ */

export const territories: ServiceTerritory[] = [
  { id: 'SP-QC-EST', name: 'Service Point Estrie', regionId: 'REG-QC-S', radiusKm: 180, coords: [45.4, -71.9] },
  { id: 'SP-QC-LAU', name: 'Service Point Laurentides', regionId: 'REG-QC-N', radiusKm: 210, coords: [46.0, -74.3] },
  { id: 'SP-QC-MON', name: 'Service Point Montérégie', regionId: 'REG-QC-S', radiusKm: 150, coords: [45.4, -73.2] },
];

export const resources: ServiceResource[] = [
  { id: 'RES-001', territoryId: 'SP-QC-EST', name: 'Marc Bouchard', role: 'technician', initials: 'MB', photo: null, rating: 4.9 },
  { id: 'RES-002', territoryId: 'SP-QC-EST', name: 'Priya Nadeau', role: 'technician', initials: 'PN', photo: null, rating: 4.8 },
  { id: 'RES-003', territoryId: 'SP-QC-EST', name: 'Louis Tremblay', role: 'manager', initials: 'LT', photo: null, rating: 0 },
  { id: 'RES-004', territoryId: 'SP-QC-EST', name: 'Amélie Roy', role: 'installer', initials: 'AR', photo: null, rating: 4.7 },
];

/* ------------------------------------------------------------------ */
/* Accounts, contacts, assets, contracts                               */
/* ------------------------------------------------------------------ */

export const accounts: Account[] = [
  {
    id: GOLDEN.accountId,
    name: 'Sarah and Julien Lavoie',
    territoryId: 'SP-QC-EST',
    propertyType: 'seasonal',
    address: '148 chemin du Lac',
    city: 'Lac-Brome',
    province: 'QC',
    since: '2019-05-14',
  },
  { id: 'ACC-QC-004201', name: 'Denis Gagnon', territoryId: 'SP-QC-EST', propertyType: 'primary', address: '9 rue des Érables', city: 'Magog', province: 'QC', since: '2021-08-02' },
  { id: 'ACC-QC-004233', name: 'Hélène Fortin', territoryId: 'SP-QC-EST', propertyType: 'primary', address: '312 route 243', city: 'Waterloo', province: 'QC', since: '2017-06-19' },
  { id: 'ACC-QC-004255', name: 'Camp Boisvert', territoryId: 'SP-QC-EST', propertyType: 'commercial', address: '1 chemin Boisvert', city: 'Sutton', province: 'QC', since: '2023-04-11' },
];

export const contacts: Contact[] = [
  { id: 'CON-008311', accountId: GOLDEN.accountId, firstName: 'Sarah', lastName: 'Lavoie', email: 'sarah.lavoie@example.com', phone: '+1 450 555 0148', isPrimary: true, identityLinked: true },
  { id: 'CON-008312', accountId: GOLDEN.accountId, firstName: 'Julien', lastName: 'Lavoie', email: 'julien.lavoie@example.com', phone: '+1 450 555 0149', isPrimary: false, identityLinked: false },
  { id: 'CON-008340', accountId: 'ACC-QC-004201', firstName: 'Denis', lastName: 'Gagnon', email: 'denis.gagnon@example.com', phone: '+1 819 555 0212', isPrimary: true, identityLinked: true },
];

export const assets: Asset[] = [
  {
    id: GOLDEN.assetId,
    accountId: GOLDEN.accountId,
    product: 'Ecoflo compact biofilter',
    model: 'EC-5',
    serial: 'EC5-19-QC-88214',
    installedOn: '2019-05-14',
    warrantyEndsOn: '2029-05-14',
    status: 'healthy',
    lastServiceOn: '2024-10-08',
    nextServiceDue: '2026-08-12',
  },
  { id: 'AST-QC-004201-1', accountId: 'ACC-QC-004201', product: 'Ecoflo compact biofilter', model: 'EC-6', serial: 'EC6-21-QC-10442', installedOn: '2021-08-02', warrantyEndsOn: '2031-08-02', status: 'service-due', lastServiceOn: '2023-09-15', nextServiceDue: '2026-07-30' },
  { id: 'AST-QC-004233-1', accountId: 'ACC-QC-004233', product: 'Ecoflo compact biofilter', model: 'EC-5', serial: 'EC5-17-QC-70118', installedOn: '2017-06-19', warrantyEndsOn: '2027-06-19', status: 'attention', lastServiceOn: '2025-11-21', nextServiceDue: '2026-08-05' },
];

export const contracts: ServiceContract[] = [
  {
    id: GOLDEN.contractId,
    accountId: GOLDEN.accountId,
    assetId: GOLDEN.assetId,
    name: 'Proactive Care',
    startsOn: '2019-05-14',
    renewsOn: '2027-05-14',
    status: 'active',
    annualPrice_jde: 320,
    currency: 'CAD',
    autopay: true,
    entitlements: ['Annual inspection', 'Filter media replacement when due', 'Priority response within 48h', 'Parts discount'],
  },
  { id: 'SC-2026-00902', accountId: 'ACC-QC-004233', assetId: 'AST-QC-004233-1', name: 'Proactive Care', startsOn: '2017-06-19', renewsOn: '2026-09-19', status: 'active', annualPrice_jde: 320, currency: 'CAD', autopay: false, entitlements: ['Annual inspection', 'Filter media replacement when due', 'Priority response within 48h'] },
];

/* ------------------------------------------------------------------ */
/* Work orders                                                         */
/* ------------------------------------------------------------------ */

export const workOrders: WorkOrder[] = [
  {
    id: GOLDEN.workOrderId,
    accountId: GOLDEN.accountId,
    assetId: GOLDEN.assetId,
    contractId: GOLDEN.contractId,
    territoryId: 'SP-QC-EST',
    resourceId: 'RES-001',
    type: 'FMR',
    status: 'on-the-way',
    scheduledFor: '2026-08-12',
    windowStart: '09:00',
    windowEnd: '11:00',
    durationMin: 90,
    lineItems: [
      { id: 'WOL-1', description: 'Filter media, coconut husk', sku: 'FM-EC5-COCO', quantity: 1, consumesInventory: true },
      { id: 'WOL-2', description: 'Inspection lid seal', sku: 'LID-SEAL-05', quantity: 1, consumesInventory: true },
    ],
    checklist: [
      { id: 'CL-1', label: 'Access and site conditions clear', type: 'check', required: true, value: true },
      { id: 'CL-2', label: 'Lid and seal condition', type: 'check', required: true, value: true },
      { id: 'CL-3', label: 'Effluent clarity', type: 'measure', required: true, value: null },
      { id: 'CL-4', label: 'Filter media replaced', type: 'check', required: true, value: null },
      { id: 'CL-5', label: 'Photo, system before', type: 'photo', required: true, value: null },
      { id: 'CL-6', label: 'Photo, system after', type: 'photo', required: true, value: null },
      { id: 'CL-7', label: 'Site left clean', type: 'check', required: true, value: null },
      { id: 'CL-8', label: 'Observations', type: 'note', required: false, value: null },
    ],
    technicianNotes: null,
    customerSummary: null,
    signedBy: null,
  },
  {
    id: 'WO-2026-0409',
    accountId: 'ACC-QC-004201',
    assetId: 'AST-QC-004201-1',
    contractId: null,
    territoryId: 'SP-QC-EST',
    resourceId: 'RES-001',
    type: 'inspection',
    status: 'complete',
    scheduledFor: '2026-08-12',
    windowStart: '07:30',
    windowEnd: '08:30',
    durationMin: 45,
    lineItems: [],
    checklist: [],
    technicianNotes: 'Media at 70 percent life. Outlet filter partially blocked, cleared on site. Recommend FMR within 6 months.',
    customerSummary:
      'Everything is working as it should. We cleared a partial blockage while we were there, and the filter has about six months of life left. We will be in touch to schedule the replacement before it is needed.',
    signedBy: 'D. Gagnon',
  },
  {
    id: 'WO-2026-0415',
    accountId: 'ACC-QC-004233',
    assetId: 'AST-QC-004233-1',
    contractId: 'SC-2026-00902',
    territoryId: 'SP-QC-EST',
    resourceId: 'RES-001',
    type: 'maintenance',
    status: 'booked',
    scheduledFor: '2026-08-12',
    windowStart: '13:00',
    windowEnd: '15:00',
    durationMin: 75,
    lineItems: [],
    checklist: [],
    technicianNotes: null,
    customerSummary: null,
    signedBy: null,
  },
];

/* ------------------------------------------------------------------ */
/* Prospect thread                                                     */
/* ------------------------------------------------------------------ */

export const leads: Lead[] = [
  { id: GOLDEN.leadId, territoryId: 'SP-QC-EST', name: 'Chloé Bergeron', city: 'Bromont', reason: 'replacing-failing', source: 'web', createdOn: '2026-07-21', status: 'quoted', identityLinked: true },
  { id: 'LEAD-2026-1192', territoryId: 'SP-QC-EST', name: 'Robert Nolet', city: 'Granby', reason: 'buying-selling', source: 'transfer', createdOn: '2026-07-23', status: 'contacted', identityLinked: true },
  { id: 'LEAD-2026-1198', territoryId: 'SP-QC-EST', name: 'Farida Haddad', city: 'Cowansville', reason: 'not-sure', source: 'pumping', createdOn: '2026-07-24', status: 'new', identityLinked: false },
  { id: 'LEAD-2026-1203', territoryId: 'SP-QC-EST', name: 'Yves Charbonneau', city: 'Sutton', reason: 'new-build', source: 'referral', createdOn: '2026-07-25', status: 'soil-test-booked', identityLinked: true },
];

export const quotes: Quote[] = [
  {
    id: 'QTE-2026-0331',
    leadId: GOLDEN.leadId,
    accountId: null,
    issuedOn: '2026-07-24',
    validDays: 30,
    currency: 'CAD',
    lines: [
      { label: 'Soil test and report', amount_jde: null, included: true },
      { label: 'System design, permits filed for you', amount_jde: null, included: true },
      { label: 'Installation, crew and equipment', amount_jde: 12400, included: false },
      { label: 'Yard restored, seeded and cleaned', amount_jde: 1150, included: false },
      { label: 'First year of care', amount_jde: 1300, included: false },
    ],
    total_jde: 14850,
    status: 'sent',
  },
];

/* ------------------------------------------------------------------ */
/* Commerce                                                            */
/* ------------------------------------------------------------------ */

export const products: Product2[] = [
  { id: 'PRD-001', sku: 'FM-EC5-COCO', name: 'Filter media, coconut husk, EC-5', category: 'filter-media', price_jde: 289, currency: 'CAD', fitsModels: ['EC-5'] },
  { id: 'PRD-002', sku: 'FM-EC6-COCO', name: 'Filter media, coconut husk, EC-6', category: 'filter-media', price_jde: 319, currency: 'CAD', fitsModels: ['EC-6'] },
  { id: 'PRD-003', sku: 'LID-SEAL-05', name: 'Inspection lid seal', category: 'lid', price_jde: 34, currency: 'CAD', fitsModels: ['EC-5', 'EC-6'] },
  { id: 'PRD-004', sku: 'PMP-EFF-12', name: 'Effluent pump, 1/2 hp', category: 'pump', price_jde: 615, currency: 'CAD', fitsModels: ['EC-5', 'EC-6'] },
  { id: 'PRD-005', sku: 'CTL-PANEL-2', name: 'Control panel, 2 stage', category: 'control', price_jde: 448, currency: 'CAD', fitsModels: ['EC-6'] },
  { id: 'PRD-006', sku: 'ACC-RISER-6', name: 'Riser extension, 6 in', category: 'accessory', price_jde: 78, currency: 'CAD', fitsModels: ['EC-5', 'EC-6'] },
];

export const orders: Order[] = [
  { id: 'ORD-2026-1188', accountId: GOLDEN.accountId, placedOn: '2026-03-02', channel: 'portal', lines: [{ sku: 'LID-SEAL-05', quantity: 2, price_jde: 34 }], total_jde: 68, currency: 'CAD', status: 'delivered' },
  { id: 'ORD-2025-0942', accountId: GOLDEN.accountId, placedOn: '2025-06-18', channel: 'phone', lines: [{ sku: 'ACC-RISER-6', quantity: 1, price_jde: 78 }], total_jde: 78, currency: 'CAD', status: 'delivered' },
];

/* ------------------------------------------------------------------ */
/* Service Point operations                                            */
/* ------------------------------------------------------------------ */

export const inventory: InventoryItem[] = [
  { sku: 'FM-EC5-COCO', territoryId: 'SP-QC-EST', location: 'depot', onHand: 34, reserved: 12, reorderPoint: 20, forecastConsumption28d: 41 },
  { sku: 'FM-EC6-COCO', territoryId: 'SP-QC-EST', location: 'depot', onHand: 22, reserved: 6, reorderPoint: 15, forecastConsumption28d: 18 },
  { sku: 'LID-SEAL-05', territoryId: 'SP-QC-EST', location: 'depot', onHand: 88, reserved: 4, reorderPoint: 30, forecastConsumption28d: 26 },
  { sku: 'PMP-EFF-12', territoryId: 'SP-QC-EST', location: 'depot', onHand: 3, reserved: 1, reorderPoint: 5, forecastConsumption28d: 4 },
  { sku: 'FM-EC5-COCO', territoryId: 'SP-QC-EST', location: 'truck', onHand: 4, reserved: 1, reorderPoint: 4, forecastConsumption28d: 9 },
  { sku: 'LID-SEAL-05', territoryId: 'SP-QC-EST', location: 'truck', onHand: 6, reserved: 1, reorderPoint: 4, forecastConsumption28d: 7 },
];

export const marcomCatalogue: MarcomItem[] = [
  { id: 'MK-001', name: 'Door hanger, septic care', category: 'print', unitPrice: 0.42, currency: 'CAD', minQuantity: 500, leadTimeDays: 10, customFields: [{ key: 'sp', label: 'Service Point name', type: 'text' }, { key: 'phone', label: 'Local phone number', type: 'text' }] },
  { id: 'MK-002', name: 'Roll-up banner', category: 'signage', unitPrice: 210, currency: 'CAD', minQuantity: 1, leadTimeDays: 14, customFields: [{ key: 'sp', label: 'Service Point name', type: 'text' }] },
  { id: 'MK-003', name: 'Vehicle magnet, pair', category: 'signage', unitPrice: 95, currency: 'CAD', minQuantity: 1, leadTimeDays: 12, customFields: [{ key: 'phone', label: 'Local phone number', type: 'text' }] },
  { id: 'MK-004', name: 'Team hoodie', category: 'merchandise', unitPrice: 48, currency: 'CAD', minQuantity: 5, leadTimeDays: 21, customFields: [{ key: 'size', label: 'Size breakdown', type: 'text' }] },
  { id: 'MK-005', name: 'Cap', category: 'merchandise', unitPrice: 22, currency: 'CAD', minQuantity: 10, leadTimeDays: 21, customFields: [] },
  { id: 'MK-006', name: 'Local search campaign, 30 days', category: 'digital', unitPrice: 1200, currency: 'CAD', minQuantity: 1, leadTimeDays: 7, customFields: [{ key: 'radius', label: 'Target radius', type: 'select' }, { key: 'focus', label: 'Campaign focus', type: 'select' }] },
  { id: 'MK-007', name: 'Social campaign, 30 days', category: 'digital', unitPrice: 900, currency: 'CAD', minQuantity: 1, leadTimeDays: 7, customFields: [{ key: 'focus', label: 'Campaign focus', type: 'select' }] },
];

export const marcomOrders: MarcomOrder[] = [
  { id: 'MKO-2026-0044', territoryId: 'SP-QC-EST', itemId: 'MK-001', quantity: 2000, placedOn: '2026-04-08', status: 'complete', leadsAttributed: 31 },
  { id: 'MKO-2026-0061', territoryId: 'SP-QC-EST', itemId: 'MK-006', quantity: 1, placedOn: '2026-06-01', status: 'live', leadsAttributed: 18 },
  { id: 'MKO-2026-0072', territoryId: 'SP-QC-EST', itemId: 'MK-004', quantity: 8, placedOn: '2026-07-14', status: 'in-production', leadsAttributed: null },
];

export const knowledgeBase: KnowledgeArticle[] = [
  { id: 'KB-101', title: 'Filter media replacement procedure, EC-5 and EC-6', section: 'Maintenance', audience: ['technician'], updatedOn: '2026-02-11' },
  { id: 'KB-118', title: 'Effluent clarity, acceptable ranges', section: 'Diagnostics', audience: ['technician'], updatedOn: '2025-11-30' },
  { id: 'KB-124', title: 'Cold weather site access', section: 'Field operations', audience: ['technician'], updatedOn: '2026-01-19' },
  { id: 'KB-203', title: 'Quebec permit requirements for replacement systems', section: 'Regulatory', audience: ['technician', 'manager'], updatedOn: '2026-05-04' },
  { id: 'KB-311', title: 'Contract renewal conversation guide', section: 'Commercial', audience: ['manager'], updatedOn: '2026-03-22' },
];

export const cases: Case[] = [
  { id: 'CAS-2026-2201', accountId: 'ACC-QC-004233', assetId: 'AST-QC-004233-1', subject: 'Odour after heavy rain', queue: 'post-sale', status: 'in-progress', openedOn: '2026-07-19', lastMessageOn: '2026-07-24' },
  { id: 'CAS-2026-2214', accountId: GOLDEN.accountId, assetId: GOLDEN.assetId, subject: 'Question about winter access', queue: 'post-sale', status: 'resolved', openedOn: '2026-06-02', lastMessageOn: '2026-06-03' },
];

/* ------------------------------------------------------------------ */
/* Network rollup                                                      */
/* ------------------------------------------------------------------ */

export const servicePoints: ServicePoint[] = [
  { id: 'SP-QC-EST', territoryId: 'SP-QC-EST', name: 'Estrie', regionId: 'REG-QC-S', revenue: 2140000, target: 2300000, servicePct: 33.4, revenuePerKm: 18.2, activeContracts: 1840, openCases: 7, rating: 4.7, readiness: 78 },
  { id: 'SP-QC-MON', territoryId: 'SP-QC-MON', name: 'Montérégie', regionId: 'REG-QC-S', revenue: 2610000, target: 2500000, servicePct: 29.1, revenuePerKm: 21.4, activeContracts: 2210, openCases: 11, rating: 4.5, readiness: 71 },
  { id: 'SP-QC-LAU', territoryId: 'SP-QC-LAU', name: 'Laurentides', regionId: 'REG-QC-N', revenue: 1880000, target: 2100000, servicePct: 38.6, revenuePerKm: 15.9, activeContracts: 1620, openCases: 4, rating: 4.8, readiness: 84 },
];

export const regions: Region[] = [
  { id: 'REG-QC-S', name: 'Québec Sud', group: 'QC', currency: 'CAD', coords: [45.4, -72.5], leaders: ['LT', 'MB'], servicePointIds: ['SP-QC-EST', 'SP-QC-MON'] },
  { id: 'REG-QC-N', name: 'Québec Nord', group: 'QC', currency: 'CAD', coords: [46.2, -74.0], leaders: ['PN', 'AR'], servicePointIds: ['SP-QC-LAU'] },
];

/** Network service mix, in transition toward the 35 percent strategic target. */
export const network = {
  serviceTargetPct: 35,
  currentServicePct: 33.1,
  history: [
    { period: 'FY24', servicePct: 21.4 },
    { period: 'FY25', servicePct: 26.8 },
    { period: 'FY26', servicePct: 30.2 },
    { period: 'FY27 YTD', servicePct: 33.1 },
  ],
  adoption: {
    portalActivationPct: 41,
    selfServeBookingPct: 27,
    ecommerceAttachPct: 12,
    floQueries30d: 1284,
    floUnansweredPct: 9,
  },
};

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

export const byId = <T extends { id: string }>(rows: T[], id: string): T | undefined =>
  rows.find((r) => r.id === id);

export const workOrdersForResource = (resourceId: string, date: string): WorkOrder[] =>
  workOrders.filter((w) => w.resourceId === resourceId && w.scheduledFor === date);

export const assetsForAccount = (accountId: string): Asset[] =>
  assets.filter((a) => a.accountId === accountId);

export const nextWorkOrderForAsset = (assetId: string): WorkOrder | undefined =>
  workOrders
    .filter((w) => w.assetId === assetId && w.status !== 'complete')
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0];

/**
 * The unified customer timeline. Merges service visits and parts orders into
 * one chronological view, because the customer does not care which system a
 * record came from. This merge is the single-login argument made visible.
 */
export const customerTimeline = (accountId: string) => {
  const visits = workOrders
    .filter((w) => w.accountId === accountId && w.status === 'complete')
    .map((w) => ({ kind: 'visit' as const, date: w.scheduledFor, id: w.id, label: w.type, summary: w.customerSummary }));
  const purchases = orders
    .filter((o) => o.accountId === accountId)
    .map((o) => ({ kind: 'order' as const, date: o.placedOn, id: o.id, label: 'Parts order', summary: null }));
  return [...visits, ...purchases].sort((a, b) => b.date.localeCompare(a.date));
};
