/**
 * screens/ScreenBody.tsx
 *
 * The padding and rhythm every screen sits in.
 *
 * Density adapts to the surface: client screens are calm and airy, technician
 * screens dense and high contrast, global screens data dense. That difference is
 * expressed here rather than repeated in thirty-four files.
 */

import type { ReactNode } from 'react';
import { useRole } from '../shell/useRole';

export const ScreenBody = ({
  children,
  /** Full bleed screens manage their own gutters, e.g. the forest block. */
  flush = false,
}: {
  children: ReactNode;
  flush?: boolean;
}) => {
  const { role } = useRole();

  /**
   * The technician works one-handed in a basement; the global surface is read
   * across a boardroom. Neither wants the client's airiness.
   *
   * `--safe-top` is added on top of the density step. It is zero everywhere
   * except inside the device frame, where it is the height that clears the
   * camera. Adding it here rather than on an ancestor is what lets a full-bleed
   * panel still run to the very top of the display.
   */
  const density =
    role.key === 'sp-technician'
      ? 'pt-[calc(var(--safe-top)+var(--space-2))]'
      : role.viewport === 'desktop'
        ? 'pt-[calc(var(--safe-top)+var(--space-3))]'
        : 'pt-[calc(var(--safe-top)+var(--space-4))]';

  // A flush screen opens with a full-bleed inverted panel, so it gets no top
  // padding at all: the panel owns its own, including the camera inset. A strip
  // of canvas above the panel reads as a rendering fault rather than as
  // breathing room, and it is the first thing the eye lands on.
  return (
    <div className={`${flush ? '' : `px-gutter ${density}`} pb-6`}>
      <div className={role.viewport === 'desktop' ? 'mx-auto max-w-shell' : ''}>{children}</div>
    </div>
  );
};
