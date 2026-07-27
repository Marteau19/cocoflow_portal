/**
 * shell/TopBar.tsx
 *
 * One bar across all five roles. The role switcher, the brand switch and the
 * Blueprint toggle live here, and nothing else does.
 *
 * The switcher is the architectural argument in miniature: same shell, same
 * design system, navigation scoped by who you are.
 */

import { useEffect, useRef, useState } from 'react';
import { useBrand } from '../brands/useBrand';
import { BlueprintToggle } from '../blueprint/BlueprintPanel';
import { Icon, Micro } from '../ui/primitives';
import { roleOrder, roles } from './roles';
import { useRole } from './useRole';

const RoleSwitcher = () => {
  const { roleKey, role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape, so the menu never traps a demo.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex min-h-tap items-center gap-2 rounded-control border border-line-strong bg-surface px-3 text-caption text-ink transition-colors duration-state ease-ease hover:bg-surface-sunk"
      >
        <Icon name="user" />
        <span className="hidden sm:inline">{role.label}</span>
        <span className="sm:hidden">Role</span>
        <Icon name="chevron-down" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-bar mt-2 w-full min-w-[280px] max-w-device overflow-hidden rounded-card border border-line bg-surface shadow-sheet"
        >
          <div className="border-b border-line px-4 py-3">
            <Micro>Viewing as</Micro>
            <p className="mt-1 text-caption text-ink2">
              One shell, one design system, navigation scoped by role. Switching re-renders the same
              records from a different angle.
            </p>
          </div>
          {roleOrder.map((key) => {
            const item = roles[key];
            const active = key === roleKey;
            return (
              <button
                key={key}
                type="button"
                role="menuitem"
                onClick={() => {
                  setRole(key);
                  setOpen(false);
                }}
                className={`block w-full border-b border-line px-4 py-3 text-left transition-colors duration-state ease-ease last:border-b-0 hover:bg-surface-sunk ${
                  active ? 'bg-surface-sunk' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-body ${active ? 'font-medium text-ink' : 'text-ink'}`}>
                    {item.label}
                  </span>
                  {active && (
                    <span className="text-accent-ink">
                      <Icon name="check" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-caption text-ink2">{item.who}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TopBar = () => {
  const { brand, brandId, toggleBrand } = useBrand();

  return (
    <header className="fixed inset-x-0 top-0 z-bar h-6 border-b border-line bg-canvas">
      <div className="mx-auto flex h-full max-w-shell items-center justify-between gap-3 px-gutter">
        <div className="flex items-center gap-3">
          <img src={brand.logo.wordmark} alt="Ecoflo" className="h-2 w-auto" />
          <span className="hidden text-caption text-ink3 sm:inline">Portal</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleBrand}
            title="Switch brand, Alt+Shift+N"
            className="hidden min-h-tap items-center rounded-control border border-line-strong bg-surface px-3 text-caption text-ink2 transition-colors duration-state ease-ease hover:text-ink sm:inline-flex"
          >
            {brandId === 'legacy' ? 'Current brand' : 'New brand'}
          </button>
          <BlueprintToggle />
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
};
