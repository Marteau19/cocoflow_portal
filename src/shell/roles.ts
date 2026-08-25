/**
 * shell/roles.ts
 *
 * The five roles, and the navigation each one sees.
 *
 * This is a role switcher, not an app switcher. One shell, one nav pattern, one
 * design system, navigation scoped by role. That is the architectural argument
 * the prototype exists to make: a single converged authenticated surface, not
 * three separate portals. Switching role re-renders the same seed data from a
 * different angle. It never reloads it.
 *
 * Bottom navigation is capped at four items with labels always visible. Where a
 * role owns more screens than that, the remainder are reached from within the
 * screens that own them, which is how the cap stays honest rather than becoming
 * a "More" tab.
 */

import type { IconName } from '../ui/icons';

export type RoleKey =
  | 'client-prospect'
  | 'client-owner'
  | 'sp-technician'
  | 'sp-manager'
  | 'ptwe-global';

export interface NavItem {
  label: string;
  to: string;
  /** Bottom navigation carries an icon. The left nav is text only. */
  icon?: IconName;
}

export interface RoleDef {
  key: RoleKey;
  /** Label in the switcher. */
  label: string;
  /** Who this is, in one line, for the switcher menu. */
  who: string;
  /**
   * Drives layout, not just width. `mobile` roles render inside a device frame
   * above 900px; `desktop` and `responsive` roles render full bleed.
   */
  viewport: 'mobile' | 'responsive' | 'desktop';
  /** Where switching into this role lands. */
  home: string;
  nav: NavItem[];
}

export const roles: Record<RoleKey, RoleDef> = {
  'client-prospect': {
    key: 'client-prospect',
    label: 'Client, before install',
    who: 'Chloé Bergeron, replacing a failing system in Bromont',
    viewport: 'mobile',
    home: '/start',
    nav: [
      { label: 'Start', to: '/start', icon: 'home' },
      { label: 'Request', to: '/request', icon: 'calendar' },
      { label: 'Quote', to: '/quote', icon: 'file-text' },
      { label: 'Project', to: '/install', icon: 'map-pin' },
    ],
  },

  'client-owner': {
    key: 'client-owner',
    label: 'Client, system owner',
    who: 'Sarah and Julien Lavoie, lakeside property in the Eastern Townships',
    viewport: 'mobile',
    home: '/home',
    /*
      Four nouns. Home, System, Shop, Account.

      Book left the bar. Booking is a task with a start and an end, done once or
      twice a year, and a tab is for a place you return to. It is now a primary
      action on Home and on System, and the "something seems wrong" route deep
      links into it, so it is reachable in fewer taps than it was while occupying
      none of the four slots a customer navigates by.

      Parts became Shop, because the tab sat directly under a masthead reading
      "Parts and filters" and a nav label should not be the third statement of the
      same word on one screen.

      Account is new. It did not exist at all: "Signed in as Sarah Lavoie" was
      grey text at the foot of an infinite scroll, and the language toggle a
      Quebec product needs had nowhere to live.
    */
    nav: [
      { label: 'Home', to: '/home', icon: 'home' },
      { label: 'System', to: '/system', icon: 'file-text' },
      { label: 'Shop', to: '/parts', icon: 'package' },
      { label: 'Account', to: '/account', icon: 'user' },
    ],
  },

  'sp-technician': {
    key: 'sp-technician',
    label: 'Service Point, technician',
    who: 'Marc Bouchard, Service Point Estrie',
    viewport: 'mobile',
    home: '/day',
    nav: [
      { label: 'My day', to: '/day', icon: 'calendar' },
      { label: 'Route', to: '/route', icon: 'map-pin' },
      { label: 'Flo', to: '/flo', icon: 'message-square' },
    ],
  },

  'sp-manager': {
    key: 'sp-manager',
    label: 'Service Point, manager',
    who: 'Louis Tremblay, Service Point Estrie',
    viewport: 'responsive',
    home: '/sp',
    nav: [
      { label: 'Dashboard', to: '/sp' },
      { label: 'Dispatch', to: '/sp/dispatch' },
      { label: 'Customers', to: '/sp/customers' },
      { label: 'Leads', to: '/sp/leads' },
      { label: 'MARCOM', to: '/sp/marcom' },
      { label: 'Inventory', to: '/sp/inventory' },
      { label: 'Team', to: '/sp/team' },
      { label: 'Flo', to: '/flo' },
    ],
  },

  'ptwe-global': {
    key: 'ptwe-global',
    label: 'PTWE Global',
    who: 'Network view, all regions and Service Points',
    viewport: 'desktop',
    home: '/network',
    nav: [
      { label: 'Network', to: '/network' },
      { label: 'Mix tracker', to: '/mix' },
      { label: 'Adoption', to: '/adoption' },
      { label: 'Benchmarking', to: '/benchmarking' },
      { label: 'Readiness', to: '/readiness' },
    ],
  },
};

/** Switcher order. Follows the customer journey, then the operator, then PTWE. */
export const roleOrder: RoleKey[] = [
  'client-prospect',
  'client-owner',
  'sp-technician',
  'sp-manager',
  'ptwe-global',
];

export const isRoleKey = (value: string | null): value is RoleKey =>
  value !== null && value in roles;

/**
 * Which role owns which route.
 *
 * The URL is the source of truth for the current role, so a shared or reloaded
 * link lands in the right register instead of rendering a manager table inside a
 * phone frame. Role is therefore derived, not stored, which also keeps it out of
 * localStorage where only the brand and Blueprint preference are permitted.
 *
 * Order matters: the first pattern that matches wins, so `/system/transfer`
 * precedes `/system`. `/flo` is genuinely shared by both Service Point roles and
 * is the one entry with two owners.
 */
export const routeOwners: Array<{ pattern: string; owners: RoleKey[] }> = [
  { pattern: '/start', owners: ['client-prospect'] },
  { pattern: '/request', owners: ['client-prospect'] },
  { pattern: '/soil-test', owners: ['client-prospect'] },
  { pattern: '/quote', owners: ['client-prospect'] },
  { pattern: '/install', owners: ['client-prospect'] },
  { pattern: '/handover', owners: ['client-prospect'] },

  { pattern: '/home', owners: ['client-owner'] },
  { pattern: '/system/transfer', owners: ['client-owner'] },
  { pattern: '/system', owners: ['client-owner'] },
  { pattern: '/invoices', owners: ['client-owner'] },
  { pattern: '/contract', owners: ['client-owner'] },
  { pattern: '/book', owners: ['client-owner'] },
  { pattern: '/parts', owners: ['client-owner'] },
  { pattern: '/messages', owners: ['client-owner'] },
  { pattern: '/account', owners: ['client-owner'] },
  { pattern: '/recommended', owners: ['client-owner'] },

  { pattern: '/day', owners: ['sp-technician'] },
  { pattern: '/route', owners: ['sp-technician'] },
  { pattern: '/wo/:id/quote', owners: ['sp-technician'] },
  { pattern: '/wo/:id/safety', owners: ['sp-technician'] },
  { pattern: '/wo/:id', owners: ['sp-technician'] },

  { pattern: '/sp/dispatch', owners: ['sp-manager'] },
  { pattern: '/sp/customers', owners: ['sp-manager'] },
  { pattern: '/sp/leads', owners: ['sp-manager'] },
  { pattern: '/sp/marcom', owners: ['sp-manager'] },
  { pattern: '/sp/inventory', owners: ['sp-manager'] },
  { pattern: '/sp/team', owners: ['sp-manager'] },
  { pattern: '/sp', owners: ['sp-manager'] },

  // Shared surface. One Flo instance, scope filtered by whoever is asking.
  { pattern: '/flo', owners: ['sp-technician', 'sp-manager'] },

  { pattern: '/network/:regionId', owners: ['ptwe-global'] },
  { pattern: '/network', owners: ['ptwe-global'] },
  { pattern: '/mix', owners: ['ptwe-global'] },
  { pattern: '/adoption', owners: ['ptwe-global'] },
  { pattern: '/benchmarking', owners: ['ptwe-global'] },
  { pattern: '/readiness', owners: ['ptwe-global'] },
];

/**
 * Customers never see internal vocabulary. This flag is what screens check
 * before showing a word like work order, entitlement, asset, case or lead.
 */
export const isCustomerRole = (role: RoleKey): boolean =>
  role === 'client-prospect' || role === 'client-owner';
