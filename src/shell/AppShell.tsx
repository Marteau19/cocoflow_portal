/**
 * shell/AppShell.tsx
 *
 * One shell for five roles. The layout switches register by viewport class, not
 * by rebuilding itself per role.
 *
 * Two registers:
 *
 *  - Mobile-first roles sit inside a device frame above 900px. A phone screen
 *    stretched across a projector reads as an unfinished web page, which is a
 *    distraction the prototype cannot afford in the room it is shown in.
 *  - Manager and global render as a dark sidebar beside a light workspace. That
 *    contrast is the primary structure of every desktop screen in this
 *    direction, per DESIGN.md section 5.
 */

import type { ReactNode } from 'react';
import { BlueprintPanel } from '../blueprint/BlueprintPanel';
import { DeviceFrame } from './DeviceFrame';
import { BottomNav, SheetNav, SideNav } from './Nav';
import { TopBar } from './TopBar';
import { useRole } from './useRole';

/**
 * Mobile-first roles. Below 900px this is the whole viewport; above it, a framed
 * device centred on the canvas, with the bottom nav inside the frame where it
 * belongs.
 */
const FramedRole = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();

  return (
    <DeviceFrame>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      <BottomNav role={role} />
    </DeviceFrame>
  );
};

/** Manager and global. Dark sidebar, light workspace, table forward. */
const FullBleedRole = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();

  return (
    <div className="mx-auto flex max-w-shell gap-3 px-gutter py-3">
      <SideNav role={role} />
      <div className="min-w-0 flex-1">
        <SheetNav role={role} />
        {children}
      </div>
    </div>
  );
};

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();
  const framed = role.viewport === 'mobile';

  return (
    <>
      <TopBar />
      {/* Offset for the fixed top bar. */}
      <main className="pt-6">
        {framed ? <FramedRole>{children}</FramedRole> : <FullBleedRole>{children}</FullBleedRole>}
      </main>
      <BlueprintPanel />
    </>
  );
};
