/**
 * shell/DeviceFrame.tsx
 *
 * The device frame for the three mobile-first roles, above 900px.
 *
 * This is the one piece of deliberate theatre in the build, and it is not
 * decorative: a client screen projected at 1440px reads as a broken desktop
 * page, and the first question in the room becomes "why is it so wide" rather
 * than anything about the product.
 *
 * The handset is drawn, not photographed. It is modelled on the reference the
 * owner supplied, down to the rail colour, the bezel weight, the corner radii,
 * the four side buttons and the long soft shadow underneath. Drawing it wins on
 * three counts: it is resolution independent, it costs no asset weight, and the
 * screen corner is a real clipping boundary rather than a rectangle positioned
 * over a picture in the hope that the insets were measured correctly.
 *
 * Everything visual lives in the `.device-*` block in index.css. That is where
 * the only literal colours in the codebase are, and the comment there explains
 * why a titanium rail is not a brand token.
 *
 * Two things worth knowing:
 *
 *  - The camera sits *over* the app, as hardware does. It is a sibling of the
 *    screen, so the screen keeps its overflow clip and the island is never cut
 *    by it, and it is `pointer-events: none` so it cannot eat a tap.
 *  - Because the camera is in the way, content is inset from the top of the
 *    display by `--safe-top`. A full-bleed panel still runs to the very top of
 *    the screen, which is what a real app does; it is the panel's own top
 *    padding that clears the island.
 *
 * Below 900px none of this renders. The app is the whole viewport, `--safe-top`
 * is zero, and there is no frame to inset from.
 */

import type { ReactNode } from 'react';

/**
 * Side buttons, as a fraction of the shell height so they hold their place when
 * the shell is capped to a short viewport. Taken off the reference: the action
 * button and the two volume keys on the left, the side button on the right.
 */
const BUTTONS = [
  { side: 'left', top: '20.5%', height: '4%' },
  { side: 'left', top: '27.6%', height: '6.4%' },
  { side: 'left', top: '35.4%', height: '6.4%' },
  { side: 'right', top: '32.5%', height: '10.6%' },
] as const;

export const DeviceFrame = ({ children }: { children: ReactNode }) => (
  <div className="device-stage">
    <div className="device-shell">
      <div className="device-bezel">
        <div className="device-screen">{children}</div>

        {/* The camera, on top of the design. */}
        <span aria-hidden className="device-island">
          <span className="device-lens" />
        </span>
      </div>

      {BUTTONS.map((button, index) => (
        <span
          key={index}
          aria-hidden
          className={`device-button device-button--${button.side}`}
          style={{ top: button.top, height: button.height }}
        />
      ))}
    </div>
  </div>
);
