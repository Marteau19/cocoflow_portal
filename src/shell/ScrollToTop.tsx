/**
 * shell/ScrollToTop.tsx
 *
 * Navigating to a new screen starts you at the top of it.
 *
 * A single page app keeps the scroll position across a route change, which is
 * correct for a back button and wrong for everything else: tapping "Parts" from
 * halfway down "My system" landed you halfway down the parts list, past the
 * masthead, which on a phone looks like the screen failed to load.
 *
 * There are two scroll containers in this build and which one is live depends on
 * the register, so both are reset:
 *
 *  - Framed roles scroll `[data-content-column]`, the element inside the handset.
 *    The window does not move at all there.
 *  - Full-bleed roles scroll the window, and the content column is not a scroller.
 *
 * Resetting both is cheaper than working out which applies, and it stays correct
 * if a register changes later.
 *
 * The jump is instant, never smoothed. A smooth scroll on a route change animates
 * content that is already gone, so you watch the new screen slide past its own
 * masthead. `prefers-reduced-motion` needs no special case for the same reason:
 * there is no motion here to reduce.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const column = document.querySelector<HTMLElement>('[data-content-column]');
    if (column) column.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
