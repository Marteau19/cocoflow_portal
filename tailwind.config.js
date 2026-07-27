/**
 * tailwind.config.js
 *
 * Every utility resolves to a CSS custom property written by `applyBrand()`.
 * Nothing here is a literal colour, size or duration, which is what makes the
 * brand switch a zero-edit operation. See DESIGN.md sections 2 to 4.
 *
 * The two display steps read `--step-*` rather than `--type-*`. Those aliases
 * are declared in index.css so a media query can promote them to the desktop
 * step, which the inline custom properties written by `applyBrand()` cannot do
 * on their own.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Replaced, not extended: the palette is closed. An unlisted colour is a
    // bug, and Tailwind's default palette is the fastest route to one.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      canvas: 'var(--color-canvas)',
      'canvas-blueprint': 'var(--color-canvas-blueprint)',
      surface: 'var(--color-surface)',
      'surface-sunk': 'var(--color-surface-sunk)',
      ink: 'var(--color-ink)',
      ink2: 'var(--color-ink2)',
      ink3: 'var(--color-ink3)',
      line: 'var(--color-line)',
      'line-strong': 'var(--color-line-strong)',
      forest: 'var(--color-forest)',
      'on-forest': 'var(--color-on-forest)',
      accent: 'var(--color-accent)',
      'accent-hover': 'var(--color-accent-hover)',
      'on-accent': 'var(--color-on-accent)',
      'accent-ink': 'var(--color-accent-ink)',
      warn: 'var(--color-warn)',
      alert: 'var(--color-alert)',
    },

    // The six-step scale from DESIGN.md section 4, plus the page gutter, which
    // is a layout constant rather than a brand value.
    spacing: {
      0: '0px',
      px: '1px',
      1: 'var(--space-1)',
      2: 'var(--space-2)',
      3: 'var(--space-3)',
      4: 'var(--space-4)',
      5: 'var(--space-5)',
      6: 'var(--space-6)',
      gutter: 'var(--gutter)',
      full: '100%',
    },

    borderRadius: {
      none: '0px',
      card: 'var(--radius-card)',
      control: 'var(--radius-control)',
      pill: 'var(--radius-pill)',
    },

    // One shadow, for sheets, modals and the device frame. Nothing else.
    boxShadow: {
      none: 'none',
      sheet: 'var(--shadow-sheet)',
    },

    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },

    // Each step carries its own line height, tracking and weight, so one
    // utility sets the whole role and the scale cannot be recombined by hand.
    fontSize: {
      display: [
        'var(--step-display-size)',
        {
          lineHeight: 'var(--step-display-line)',
          letterSpacing: 'var(--step-display-tracking)',
          fontWeight: 'var(--step-display-weight)',
        },
      ],
      h1: [
        'var(--step-h1-size)',
        {
          lineHeight: 'var(--step-h1-line)',
          letterSpacing: 'var(--step-h1-tracking)',
          fontWeight: 'var(--step-h1-weight)',
        },
      ],
      h2: [
        'var(--type-h2-size)',
        {
          lineHeight: 'var(--type-h2-line)',
          letterSpacing: 'var(--type-h2-tracking)',
          fontWeight: 'var(--type-h2-weight)',
        },
      ],
      body: [
        'var(--type-body-size)',
        {
          lineHeight: 'var(--type-body-line)',
          letterSpacing: 'var(--type-body-tracking)',
          fontWeight: 'var(--type-body-weight)',
        },
      ],
      caption: [
        'var(--type-caption-size)',
        {
          lineHeight: 'var(--type-caption-line)',
          letterSpacing: 'var(--type-caption-tracking)',
          fontWeight: 'var(--type-caption-weight)',
        },
      ],
      micro: [
        'var(--type-micro-size)',
        {
          lineHeight: 'var(--type-micro-line)',
          letterSpacing: 'var(--type-micro-tracking)',
          fontWeight: 'var(--type-micro-weight)',
        },
      ],
    },

    // 400, 500, 700. Six hundred is not available, by design.
    fontWeight: {
      normal: '400',
      medium: '500',
      bold: '700',
    },

    transitionDuration: {
      state: 'var(--motion-state)',
      sheet: 'var(--motion-sheet)',
    },

    transitionTimingFunction: {
      ease: 'var(--motion-ease)',
    },

    // Emptied rather than disabled: this removes every `bg-gradient-*` utility
    // while leaving real background images (the forest block) reachable.
    backgroundImage: {},

    extend: {
      // Mobile-first roles render inside a device frame above this width.
      // Without it, a projected demo looks like a stretched phone app.
      screens: {
        frame: '900px',
      },
      borderWidth: {
        rule: '3px',
      },
      width: {
        device: '420px',
      },
      height: {
        device: '860px',
      },
      maxWidth: {
        device: '420px',
        reading: '68ch',
        shell: '1440px',
      },
      minHeight: {
        tap: '48px',
      },
      minWidth: {
        tap: '48px',
      },
      zIndex: {
        nav: '20',
        frame: '10',
        panel: '30',
        sheet: '40',
        bar: '50',
      },
    },
  },
  plugins: [],
};
