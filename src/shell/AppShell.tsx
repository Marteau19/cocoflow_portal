/**
 * shell/AppShell.tsx
 *
 * One shell for five roles. The layout switches register by viewport class, not
 * by rebuilding itself per role.
 *
 * The device frame is the one piece of deliberate theatre. A mobile-first role
 * stretched across a projector reads as an unfinished web page, which is a
 * distraction the prototype cannot afford in the room it is shown in. Above
 * 900px the client and technician screens sit in a frame; the manager and global
 * surfaces render full bleed, because they are genuinely desktop screens.
 */

import type { ReactNode } from 'react';
import { BlueprintPanel } from '../blueprint/BlueprintPanel';
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
    <div className="frame:grid frame:min-h-[calc(100vh-var(--space-6))] frame:place-items-start frame:justify-center frame:px-gutter frame:py-3">
      {/*
        Height is capped to the viewport as well as to the device height, so a
        1440x900 projector shows the whole frame including the bottom nav rather
        than clipping the labels off the base.
      */}
      <div className="flex min-h-[calc(100vh-var(--space-6))] flex-col frame:h-device frame:max-h-[calc(100vh-var(--space-6)-var(--space-4))] frame:min-h-0 frame:w-device frame:overflow-hidden frame:rounded-card frame:border frame:border-line frame:bg-canvas frame:shadow-sheet">
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <BottomNav role={role} />
      </div>
    </div>
  );
};

/** Manager and global. Table forward, data dense, full bleed. */
const FullBleedRole = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-var(--space-6))] max-w-shell">
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
