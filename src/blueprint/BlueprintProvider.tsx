/**
 * blueprint/BlueprintProvider.tsx
 *
 * Blueprint mode state, and the registry of annotated sections on the current
 * screen.
 *
 * Two demo modes from one build. Leadership reads the product; IT and DEV press
 * Alt+Shift+B and read the specification. Sections register themselves on mount
 * so the right-hand panel can list them in callout order without anyone having
 * to keep a second list in sync.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { sections, type Section } from '../data/sections';

interface BlueprintState {
  /** Whether the app is in the technical drawing register. */
  on: boolean;
  toggle: () => void;
  /** Sections present on the current screen, in callout order. */
  registered: Section[];
  register: (id: string) => void;
  unregister: (id: string) => void;
  /** The annotation currently open in the panel, if any. */
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
}

const BlueprintContext = createContext<BlueprintState | null>(null);

/** One of only two permitted localStorage keys. See CLAUDE.md constraints. */
const STORAGE_KEY = 'ecoflo.blueprint';

const initialOn = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
};

export const BlueprintProvider = ({ children }: { children: ReactNode }) => {
  const [on, setOn] = useState<boolean>(initialOn);
  const [ids, setIds] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback(() => setOn((v) => !v), []);

  const register = useCallback((id: string) => {
    setIds((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const unregister = useCallback((id: string) => {
    setIds((current) => current.filter((existing) => existing !== id));
  }, []);

  const open = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);

  // The mode drives a data attribute on <body> rather than on the root element.
  // applyBrand() writes the tokens as inline styles on :root, and an inline
  // style outranks a stylesheet rule, so the blueprint overrides have to land
  // on a descendant to take effect. See index.css.
  useEffect(() => {
    document.body.dataset.blueprint = on ? 'on' : 'off';
    try {
      window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch {
      // A mode that cannot persist still works for this session.
    }
  }, [on]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Checking `code` rather than `key`, since Alt rewrites `key` on several
      // keyboard layouts.
      if (event.altKey && event.shiftKey && event.code === 'KeyB') {
        event.preventDefault();
        toggle();
      }
      if (event.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  // Resolve registered ids to annotations, ordered by callout number so the
  // panel reads in the same order as the numbers on the screen.
  const registered = useMemo(() => {
    return ids
      .map((id) => sections.find((s) => s.id === id))
      .filter((s): s is Section => s !== undefined)
      .sort((a, b) => a.callout - b.callout);
  }, [ids]);

  const value = useMemo<BlueprintState>(
    () => ({ on, toggle, registered, register, unregister, openId, open, close }),
    [on, toggle, registered, register, unregister, openId, open, close],
  );

  return <BlueprintContext.Provider value={value}>{children}</BlueprintContext.Provider>;
};

export const useBlueprint = (): BlueprintState => {
  const context = useContext(BlueprintContext);
  if (!context) throw new Error('useBlueprint must be used inside a BlueprintProvider');
  return context;
};
