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

import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BlueprintPanel } from '../blueprint/BlueprintPanel';
import { GutterOverlay } from '../dev/GutterOverlay';
import { DeviceFrame } from './DeviceFrame';
import { BottomNav, SheetNav, SideNav } from './Nav';
import { TopBar } from './TopBar';
import { useLocale } from '../i18n';
import { isCustomerRole } from './roles';
import { useRole } from './useRole';

/**
 * Mobile-first roles. Below 900px this is the whole viewport; above it, a framed
 * device centred on the canvas, with the bottom nav inside the frame where it
 * belongs.
 */
const FramedRole = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();
  const { pathname } = useLocation();

  return (
    <DeviceFrame>
      <div className="min-h-0 flex-1 overflow-y-auto" data-content-column>
        {/*
          `key` on the pathname is what replays the entry animation on every
          route change: without it React reuses the element and the animation
          runs once, on the first screen the reader ever sees, and never again.
        */}
        <div key={pathname} className="route-enter">
          {children}
        </div>
      </div>
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
      {/*
        `data-content-column` marks where the gutter is measured from. Without it
        the alignment instruments measured full-bleed roles from <main>, which
        includes the sidebar, and reported every heading as sitting 300px off the
        gutter. An instrument that cannot find the column cannot check it.
      */}
      <div className="min-w-0 flex-1" data-content-column>
        <SheetNav role={role} />
        {children}
      </div>
    </div>
  );
};

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();
  const locale = useLocale();
  const framed = role.viewport === 'mobile';

  /*
    The register, on <body>, so the page ground behind the device frame can be
    styled from CSS.

    It is on the body rather than on <main> because the ground in question is
    the body's own background and the top bar is a sibling of <main>, so a
    selector rooted at <main> cannot reach either of them. Same mechanism
    Blueprint mode already uses for the same reason.
  */
  useEffect(() => {
    document.body.dataset.register = framed ? 'framed' : 'full';
  }, [framed]);

  return (
    <>
      <TopBar />
      {/*
        `data-register` decides the type register, and it is an attribute rather
        than a media query on purpose. A framed role keeps the framed column at
        every browser width, so a 72px hero cannot land inside a 420px handset.
        See DESIGN.md section 5 and the `[data-register='full']` rule in
        index.css. It sits on a descendant of <html> because `applyBrand()`
        writes --type-* inline on the root, and an inline style outranks a
        stylesheet rule.

        `key` on the register wrapper is what gives the role switch its
        transition: changing role remounts the subtree, so the Masthead ground
        cross fades and the hero re-counts. That transition is the architectural
        argument made visible, which is why it is the longest in the app.
      */}
      {/*
        `data-persona` caps the type scale for the two customer roles.

        Their `hero` step was never a figure. It was the screen's own name set at
        48px, three of four tabs opened with one, and on an iPhone SE `/system`
        spent an entire viewport on the words "Ecoflo compact biofilter". Above
        the fold has to carry state, not a title card.

        It is an attribute remap in index.css rather than an edit to every
        customer screen, for the same reason `data-register` is: one rule, both
        brands, zero component changes, and a screen cannot opt out of it by
        accident. `hero` stays available to the Global surfaces, where it sets a
        real number against a target, which is the job DESIGN.md section 7
        describes.
      */}
      <main
        className="pt-6"
        data-register={framed ? 'framed' : 'full'}
        data-persona={isCustomerRole(role.key) ? 'customer' : 'operator'}
        // Locale is in the key for the same reason role is: `t()` is a plain
        // function with no subscription, so the language control changes module
        // state and this remount is what makes the app read it.
        key={`${role.key}-${locale}`}
      >
        {framed ? <FramedRole>{children}</FramedRole> : <FullBleedRole>{children}</FullBleedRole>}
      </main>
      <BlueprintPanel />
      {/*
        The gutter overlay, Alt+Shift+G. `import.meta.env.DEV` is replaced with a
        literal at build time, so this branch and the module behind it are dropped
        from the production bundle rather than shipped and never shown.
      */}
      {import.meta.env.DEV && <GutterOverlay />}
    </>
  );
};
