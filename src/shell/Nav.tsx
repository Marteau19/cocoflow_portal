/**
 * shell/Nav.tsx
 *
 * Two registers of the same navigation.
 *
 * Bottom navigation for the mobile-first roles: four items maximum, icon plus
 * label, labels always visible. Icon-only navigation is both a tell and worse
 * usability, so there is no compact variant. The active item is a filled accent
 * pill, which is the one place the accent fill appears without being an action.
 *
 * A dark sidebar for the manager and global surfaces at desktop width. It is the
 * deep ground that the light workspace sits beside, and it is the primary
 * structure of every desktop screen in this direction. Below 768px it becomes a
 * sheet, because a fixed side column at phone width either crushes the table or
 * hides it.
 *
 * The sidebar stays text only. Those screens are table forward and the manager
 * owns eight destinations, which is more than the fourteen icon budget can label
 * without repeating itself. A column of near-duplicate icons beside a column of
 * words earns nothing.
 */

import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useBrand } from '../brands/useBrand';
import { Icon, Micro } from '../ui/primitives';
import type { RoleDef } from './roles';

/* ------------------------------------------------------------------ */
/* Bottom navigation, mobile-first roles                               */
/* ------------------------------------------------------------------ */

export const BottomNav = ({ role }: { role: RoleDef }) => (
  <nav
    aria-label={`${role.label} navigation`}
    className="z-nav shrink-0 border-t border-line bg-surface"
  >
    <ul className="flex items-stretch p-1">
      {role.nav.map((item) => (
        <li key={item.to} className="flex-1">
          <NavLink
            to={item.to}
            end={item.to === role.home}
            className={({ isActive }) =>
              `flex min-h-tap flex-col items-center justify-center gap-1 rounded-control px-1 py-2 transition-colors duration-state ease-ease ${
                isActive
                  ? 'bg-accent text-on-accent'
                  : 'text-ink3 hover:bg-surface-sunk hover:text-ink2'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon && (
                  <span className="text-h2 leading-none">
                    <Icon name={item.icon} />
                  </span>
                )}
                <span className={`text-caption ${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

/* ------------------------------------------------------------------ */
/* Sidebar, manager and global                                         */
/* ------------------------------------------------------------------ */

/**
 * `onDark` switches the list between the sidebar and the sheet. The sheet is a
 * light surface at phone width, so the same active pill has to work on both.
 */
const NavList = ({
  role,
  onDark,
  onNavigate,
}: {
  role: RoleDef;
  onDark: boolean;
  onNavigate?: () => void;
}) => (
  <ul className="flex flex-col gap-1">
    {role.nav.map((item) => (
      <li key={item.to}>
        <NavLink
          to={item.to}
          end={item.to === role.home}
          onClick={onNavigate}
          className={({ isActive }) => {
            const shell =
              'flex min-h-tap items-center rounded-control px-3 text-body transition-colors duration-state ease-ease';
            if (isActive) return `${shell} bg-accent font-medium text-on-accent`;
            return onDark
              ? `${shell} text-sidebar-muted hover:bg-on-sidebar-soft hover:text-on-sidebar`
              : `${shell} text-ink2 hover:bg-surface-sunk hover:text-ink`;
          }}
        >
          {item.label}
        </NavLink>
      </li>
    ))}
  </ul>
);

/**
 * The deep navigation ground.
 *
 * A rounded panel floating on the tinted canvas rather than a full-height gutter
 * flush to the viewport edge: it reads as a piece of the console rather than as
 * browser chrome, and it lets the workspace keep its own margin.
 */
export const SideNav = ({ role }: { role: RoleDef }) => {
  const { brand } = useBrand();

  return (
    <nav
      aria-label={`${role.label} navigation`}
      className="sticky top-6 hidden h-[calc(100vh-var(--space-6)-var(--space-4))] w-[236px] shrink-0 flex-col rounded-shell bg-sidebar p-3 md:flex"
    >
      <div className="flex items-center gap-2 px-2 py-2">
        <img src={brand.logo.wordmarkOnDark} alt="Ecoflo" className="h-3 w-auto" />
      </div>

      <div className="mt-3 border-t border-on-sidebar-soft px-2 pt-3">
        <Micro className="text-sidebar-muted">
          {role.key === 'ptwe-global' ? 'Network' : 'Service Point Estrie'}
        </Micro>
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
        <NavList role={role} onDark />
      </div>

      {/*
        The scope note sits at the foot of the sidebar rather than in a tooltip.
        A reviewer looking at a network-wide figure needs to know what it covers
        without asking, and the sidebar is where the scope is already stated.
      */}
      <div className="border-t border-on-sidebar-soft px-2 pt-3">
        <p className="text-caption text-sidebar-muted">
          {role.key === 'ptwe-global'
            ? 'All regions, all Service Points'
            : 'One Service Point, one team'}
        </p>
      </div>
    </nav>
  );
};

/**
 * The sheet register, below 768px.
 */
export const SheetNav = ({ role }: { role: RoleDef }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Navigating closes the sheet, including via the back button.
  useEffect(() => setOpen(false), [location.pathname]);

  const current =
    role.nav.find((item) => item.to === location.pathname)?.label ?? role.nav[0].label;

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="flex min-h-tap w-full items-center justify-between gap-2 rounded-control bg-sidebar px-4 text-body text-on-sidebar"
      >
        <span className="font-medium">{current}</span>
        <span className="text-sidebar-muted">
          <Icon name="chevron-down" />
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-sheet bg-sidebar opacity-40"
          />
          <div className="fixed inset-x-0 bottom-0 z-sheet rounded-t-shell border border-line bg-surface p-3 shadow-sheet">
            <div className="px-3 pb-2">
              <Micro>Go to</Micro>
            </div>
            <NavList role={role} onDark={false} onNavigate={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
};
