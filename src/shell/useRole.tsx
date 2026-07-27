/**
 * shell/useRole.tsx
 *
 * The current role, derived from the URL.
 *
 * Role is not stored. The route determines who is looking, which means a shared
 * or reloaded link opens in the right register rather than rendering a manager
 * table inside a phone frame. It also keeps role out of localStorage, where only
 * the brand and the Blueprint preference are permitted.
 *
 * One route has two owners: `/flo` is shared by the technician and the manager.
 * A single piece of state remembers which of them arrived there, so the nav and
 * the frame stay consistent while Flo is open. That is the only thing remembered.
 *
 * Switching role navigates to that role's home and re-renders the same seed
 * data. It never reloads it, which is the point the switcher exists to make.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { roles, routeOwners, type RoleDef, type RoleKey } from './roles';

interface RoleState {
  roleKey: RoleKey;
  role: RoleDef;
  setRole: (key: RoleKey) => void;
}

const RoleContext = createContext<RoleState | null>(null);

/**
 * Opens on the system owner. That is where the golden thread sits, and the
 * client home is the strongest first screen in a demo.
 */
const DEFAULT_ROLE: RoleKey = 'client-owner';

/** Owners of a path, or an empty list when nothing matches. First match wins. */
const ownersOf = (pathname: string): RoleKey[] => {
  for (const { pattern, owners } of routeOwners) {
    if (matchPath({ path: pattern, end: true }, pathname)) return owners;
  }
  return [];
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Disambiguates shared routes only. Holds the last unambiguous role seen.
  const [lastSole, setLastSole] = useState<RoleKey>(DEFAULT_ROLE);
  // Set when the switcher is used, so choosing a role for a shared route sticks.
  const intended = useRef<RoleKey | null>(null);

  const owners = ownersOf(pathname);

  const roleKey: RoleKey = useMemo(() => {
    if (owners.length === 1) return owners[0];

    if (owners.length > 1) {
      // A shared route. Prefer the role the reviewer arrived from, then the one
      // the switcher asked for, then the first owner listed.
      if (owners.includes(lastSole)) return lastSole;
      if (intended.current && owners.includes(intended.current)) return intended.current;
      return owners[0];
    }

    // Unrouted paths, including the root redirect before it resolves.
    return intended.current ?? lastSole;
  }, [owners, lastSole]);

  useEffect(() => {
    if (owners.length === 1 && owners[0] !== lastSole) setLastSole(owners[0]);
  }, [owners, lastSole]);

  const setRole = useCallback(
    (key: RoleKey) => {
      intended.current = key;
      setLastSole(key);
      navigate(roles[key].home);
    },
    [navigate],
  );

  const value = useMemo<RoleState>(
    () => ({ roleKey, role: roles[roleKey], setRole }),
    [roleKey, setRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = (): RoleState => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used inside a RoleProvider');
  return context;
};
