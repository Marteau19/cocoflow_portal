/**
 * shell/DeviceFrame.tsx
 *
 * The device frame for the three mobile-first roles, above 900px.
 *
 * This is the one piece of deliberate theatre in the build. It is not decorative:
 * without it, a client screen projected at 1440px reads as a broken desktop page,
 * and the first question in the room becomes "why is it so wide" instead of
 * anything about the product.
 *
 * ## The photographic frame
 *
 * The intended frame is a supplied photograph of a blank handset, complete with
 * its own shadow, with the app composited into the screen area. That is why
 * `DEVICE.image` exists rather than the image being inlined: the asset is
 * measured once, here, and no other file knows the frame is a picture.
 *
 * `DEVICE.image` is currently `null`, so the CSS frame below renders instead.
 * The photograph has not reached the repository yet. Setting `image` to its path
 * and filling in `screen` with the measured insets is the whole swap, and the
 * insets are percentages so the frame stays correct at any rendered size.
 *
 * The percentages must be measured off the actual file. Guessing them produces a
 * frame where the app is a few pixels adrift inside the bezel, which is more
 * noticeable than no photograph at all.
 */

import type { CSSProperties, ReactNode } from 'react';

interface DeviceConfig {
  /** Path under /public to the handset photograph, including its own shadow. */
  image: string | null;
  /** Where the screen sits inside the image, as percentages of the image box. */
  screen: { top: number; left: number; width: number; height: number };
  /** The screen's corner radius. A device dimension, not a brand radius. */
  screenRadius: string;
}

const DEVICE: DeviceConfig = {
  image: null,
  screen: { top: 0, left: 0, width: 100, height: 100 },
  screenRadius: '0px',
};

/** The app viewport, in both registers. Children are a flex column. */
const Screen = ({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => (
  <div className={`flex flex-col overflow-hidden bg-canvas ${className}`} style={style}>
    {children}
  </div>
);

/**
 * The CSS frame. A bezel rather than an illustration of a phone: it makes the
 * point that this is a handheld surface without pretending to be a photograph of
 * a specific device.
 */
const CssFrame = ({ children }: { children: ReactNode }) => (
  <div className="frame:grid frame:min-h-[calc(100vh-var(--space-6))] frame:place-items-start frame:justify-center frame:px-gutter frame:py-3">
    {/*
      Height is capped to the viewport as well as to the device height, so a
      1440x900 projector shows the whole frame including the bottom nav rather
      than clipping the labels off the base.
    */}
    <div className="frame:rounded-bezel frame:bg-ink frame:p-2 frame:shadow-sheet">
      <Screen className="min-h-[calc(100vh-var(--space-6))] frame:h-device frame:max-h-[calc(100vh-var(--space-6)-var(--space-5))] frame:min-h-0 frame:w-device frame:rounded-screen">
        {children}
      </Screen>
    </div>
  </div>
);

/**
 * The photographic frame. The image is a plain `<img>` in normal flow, so its
 * intrinsic aspect ratio sets the size of the whole composition and the screen
 * is positioned against it as a percentage. Nothing is hard coded to a pixel
 * dimension, which is what lets the same insets hold at any rendered width.
 */
const PhotoFrame = ({ image, children }: { image: string; children: ReactNode }) => (
  <div className="frame:grid frame:min-h-[calc(100vh-var(--space-6))] frame:place-items-start frame:justify-center frame:px-gutter frame:py-3">
    <div className="relative">
      <img
        src={image}
        alt=""
        aria-hidden
        // Capped to the viewport so the whole handset, and its shadow, stay on
        // screen on a 900px-tall projector.
        className="hidden h-auto max-h-[calc(100vh-var(--space-6)-var(--space-4))] w-auto frame:block"
      />
      <Screen
        className="min-h-[calc(100vh-var(--space-6))] frame:absolute frame:min-h-0"
        style={{
          top: `${DEVICE.screen.top}%`,
          left: `${DEVICE.screen.left}%`,
          width: `${DEVICE.screen.width}%`,
          height: `${DEVICE.screen.height}%`,
          borderRadius: DEVICE.screenRadius,
        }}
      >
        {children}
      </Screen>
    </div>
  </div>
);

export const DeviceFrame = ({ children }: { children: ReactNode }) =>
  DEVICE.image ? (
    <PhotoFrame image={DEVICE.image}>{children}</PhotoFrame>
  ) : (
    <CssFrame>{children}</CssFrame>
  );
