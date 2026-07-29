/**
 * shell/Nav.tsx
 *
 * Two registers of the same navigation.
 *
 * Bottom navigation for the mobile-first roles: four items maximum, icon plus
 * label, labels always visible. Icon-only navigation is both a tell and worse
 * usability, so there is no compact variant.
 *
 * The active state is a 2px accent rule above the item plus a weight change, with
 * no fill anywhere. DESIGN.md section 14 specified this in the Broadsheet rewrite
 * and it was never implemented: the filled accent pill survived every pass after
 * it, which left the loudest element on every screen being the navigation.
 *
 * Why a rule and not a fill. A filled control in a navigation bar reads as a
 * button that is somehow already pressed, and at accent saturation it outranks
 * every real action on the screen. A rule says "you are here" without claiming to
 * be pressable.
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
  /*
    The bar sits on the sunk ground with a `--line-strong` hairline above it.
    On `--surface` with a hairline it read as an unattached white slab floating
    below the content, because the band above it was often also `--surface` and
    there was nothing to say the bar was chrome rather than one more band.
  */
  <nav
    aria-label={`${role.label} navigation`}
    className="z-nav shrink-0 border-t border-line-strong bg-surface-sunk"
  >
    {/*
      No padding on the list, so the 2px active rule can sit flush against the
      bar's own top hairline. Inset by even 4px it reads as a floating dash.
    */}
    <ul className="flex items-stretch">
      {role.nav.map((item) => (
        <li key={item.to} className="flex-1">
          <NavLink
            to={item.to}
            end={item.to === role.home}
            className={({ isActive }) =>
              `flex min-h-tap flex-col items-center justify-center gap-1 border-t-nav px-1 py-2 transition-colors duration-state ease-ease ${
                isActive
                  ? 'border-t-accent text-ink'
                  : 'border-t-transparent text-ink2 hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon && (
                  <span className="leading-none">
                    <Icon name={item.icon} />
                  </span>
                )}
                {/*
                  Weight 500 on the active label, 400 on the rest, and the ink step
                  changes with it.

                  Inactive is `--ink-2`, not `--ink-3`. The bar sits on the sunk
                  ground now, and `ink-3` on `surface-sunk` measures 3.19:1 legacy
                  and 3.29:1 next. That clears the 3:1 metadata floor but a nav
                  label is text a person reads in order to navigate, so it owes
                  4.5:1. `ink-2` on sunk is 5.09:1 and 5.32:1.

                  The active state still separates clearly: 12.14:1 against 5.09:1,
                  plus the weight change, plus the 2px rule above.
                */}
                <span className={`text-caption ${isActive ? 'font-medium' : 'font-normal'}`}>
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
 * light surface at phone width, so the same active treatment has to work on both.
 *
 * The sidebar is a vertical list, so its active marker is a 3px rule on the
 * leading edge rather than a 2px rule above: in a column, "above" belongs to the
 * previous item. DESIGN.md section 14.
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
  <ul className="flex flex-col">
    {role.nav.map((item) => (
      <li key={item.to}>
        <NavLink
          to={item.to}
          end={item.to === role.home}
          onClick={onNavigate}
          className={({ isActive }) => {
            // `border-l-rule` on every state, transparent when inactive, so the
            // label never shifts horizontally as the active item changes.
            const shell =
              'flex min-h-tap items-center border-l-rule px-3 text-body transition-colors duration-state ease-ease';
            if (isActive) {
              return onDark
                ? `${shell} border-l-accent-on-band font-medium text-on-sidebar`
                : `${shell} border-l-accent font-medium text-ink`;
            }
            return onDark
              ? `${shell} border-l-transparent font-normal text-sidebar-muted hover:text-on-sidebar`
              : `${shell} border-l-transparent font-normal text-ink2 hover:text-ink`;
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
    /*
      Sticky, for the same reason the bottom nav is pinned: navigation you have to
      scroll back up to find is navigation that is missing.

      `top-6` rather than `top-0` because the top bar is fixed at that height, so a
      sticky element at 0 would come to rest underneath it. The negative top margin
      and matching padding let the sunk ground run edge to edge behind the trigger
      as it sticks, so content does not appear through the gap above it.
    */
    <div className="sticky top-6 z-nav -mt-3 bg-canvas pb-3 pt-3 md:hidden">
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
