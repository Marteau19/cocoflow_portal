/**
 * shell/Nav.tsx
 *
 * Two registers of the same navigation.
 *
 * Bottom navigation for the mobile-first roles: four items maximum, icon plus
 * label, labels always visible. Icon-only navigation is both a tell and worse
 * usability, so there is no compact variant.
 *
 * Left navigation for the manager and global surfaces at desktop width, text
 * only. Those screens are table forward and data dense, and a column of icons
 * next to a column of labels earns nothing. Below 768px the left nav becomes a
 * sheet.
 */

import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    <ul className="flex items-stretch">
      {role.nav.map((item) => (
        <li key={item.to} className="flex-1">
          <NavLink
            to={item.to}
            end={item.to === role.home}
            className={({ isActive }) =>
              `flex min-h-tap flex-col items-center justify-center gap-1 px-1 py-2 transition-colors duration-state ease-ease ${
                isActive ? 'text-ink' : 'text-ink3 hover:text-ink2'
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
/* Left navigation, manager and global                                 */
/* ------------------------------------------------------------------ */

const NavList = ({ role, onNavigate }: { role: RoleDef; onNavigate?: () => void }) => (
  <ul>
    {role.nav.map((item) => (
      <li key={item.to}>
        <NavLink
          to={item.to}
          end={item.to === role.home}
          onClick={onNavigate}
          className={({ isActive }) =>
            // Active state is a left rule plus a weight change, never a fill.
            `block border-l-rule px-4 py-2 text-body transition-colors duration-state ease-ease ${
              isActive
                ? 'border-l-ink font-medium text-ink'
                : 'border-l-transparent text-ink2 hover:border-l-line-strong hover:text-ink'
            }`
          }
        >
          {item.label}
        </NavLink>
      </li>
    ))}
  </ul>
);

export const SideNav = ({ role }: { role: RoleDef }) => (
  <nav
    aria-label={`${role.label} navigation`}
    className="hidden w-[220px] shrink-0 border-r border-line bg-canvas pt-4 md:block"
  >
    <div className="px-4">
      <Micro>{role.key === 'ptwe-global' ? 'Network' : 'Service Point Estrie'}</Micro>
    </div>
    <div className="mt-3">
      <NavList role={role} />
    </div>
  </nav>
);

/**
 * The sheet register, below 768px. A fixed side column at phone width would
 * either crush the table or hide it.
 */
export const SheetNav = ({ role }: { role: RoleDef }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Navigating closes the sheet, including via the back button.
  useEffect(() => setOpen(false), [location.pathname]);

  const current = role.nav.find((item) => item.to === location.pathname)?.label ?? role.nav[0].label;

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="flex min-h-tap w-full items-center justify-between border-b border-line bg-surface px-gutter text-body text-ink"
      >
        <span className="font-medium">{current}</span>
        <span className="text-ink3">
          <Icon name="chevron-down" />
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-sheet bg-forest opacity-20"
          />
          <div className="fixed inset-x-0 bottom-0 z-sheet rounded-card border border-line bg-surface pb-2 pt-3 shadow-sheet">
            <div className="px-4">
              <Micro>Go to</Micro>
            </div>
            <div className="mt-2">
              <NavList role={role} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
