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

  // The technician works one-handed in a basement; the global surface is read
  // across a boardroom. Neither wants the client's airiness.
  const density =
    role.key === 'sp-technician' ? 'py-3' : role.viewport === 'desktop' ? 'py-4' : 'py-5';

  return (
    <div className={`${flush ? '' : 'px-gutter'} ${density} pb-6`}>
      <div className={role.viewport === 'desktop' ? 'mx-auto max-w-shell' : ''}>{children}</div>
    </div>
  );
};
