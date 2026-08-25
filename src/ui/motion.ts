/**
 * ui/motion.ts
 *
 * The two pieces of motion that carry meaning, and the hook that turns both off.
 *
 * DESIGN.md section 9 allows very little movement, and that is the right budget:
 * almost all interface animation is decoration that costs a frame budget and a
 * reader's attention. What is here earns its place by saying something a static
 * render cannot.
 *
 * A figure counting up says "this was computed for you" rather than "this was
 * printed here". On the metric row that matters, because those three numbers are
 * the argument that the care plan is doing something, and a number that arrives
 * already settled reads as a label.
 *
 * Both respect `prefers-reduced-motion`, and they respect it by starting at the
 * final value rather than by animating faster. A shorter animation is still an
 * animation, and the preference is not a request for brevity.
 */

import { useEffect, useState } from 'react';

/** True when the reader has asked for less movement. */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
};

/**
 * Count from zero to `value` once, on mount.
 *
 * Eased out, so it decelerates into the final figure rather than stopping dead:
 * a linear counter reads as a slot machine coming to rest, which is the wrong
 * association for a number about money.
 *
 * `requestAnimationFrame` rather than an interval, so the count is tied to the
 * frames actually being drawn. An interval on a busy main thread produces a
 * counter that jumps, and a jumping number is worse than no animation.
 */
export const useCountUp = (value: number, durationMs = 700): number => {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / durationMs);
      // Cubic ease out. Fast at the front, settles at the end.
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, reduced]);

  return shown;
};
