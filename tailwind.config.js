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
      'surface-raised': 'var(--color-surface-raised)',
      sidebar: 'var(--color-sidebar)',
      'on-sidebar': 'var(--color-on-sidebar)',
      'sidebar-muted': 'var(--color-sidebar-muted)',
      ink: 'var(--color-ink)',
      ink2: 'var(--color-ink2)',
      ink3: 'var(--color-ink3)',
      line: 'var(--color-line)',
      'line-strong': 'var(--color-line-strong)',
      'field-line': 'var(--color-field-line)',
      'band-deep': 'var(--color-band-deep)',
      'band-deep-alt': 'var(--color-band-deep-alt)',
      'on-band': 'var(--color-on-band)',
      'on-band-muted': 'var(--color-on-band-muted)',
      accent: 'var(--color-accent)',
      'accent-hover': 'var(--color-accent-hover)',
      'on-accent': 'var(--color-on-accent)',
      'accent-ink': 'var(--color-accent-ink)',
      'accent-soft': 'var(--color-accent-soft)',
      'accent-on-band': 'var(--color-accent-on-band)',
      'data-1': 'var(--color-data-1)',
      'data-2': 'var(--color-data-2)',
      'data-3': 'var(--color-data-3)',
      positive: 'var(--color-positive)',
      'on-positive': 'var(--color-on-positive)',
      'positive-soft': 'var(--color-positive-soft)',
      negative: 'var(--color-negative)',
      'on-negative': 'var(--color-on-negative)',
      'negative-soft': 'var(--color-negative-soft)',
      warn: 'var(--color-warn)',
      'warn-soft': 'var(--color-warn-soft)',
      alert: 'var(--color-alert)',
      'alert-soft': 'var(--color-alert-soft)',
      info: 'var(--color-info)',
      'on-info': 'var(--color-on-info)',
      'info-soft': 'var(--color-info-soft)',
    },

    // The spacing scale from DESIGN.md section 4, plus the 4px base step and the
    // page gutter, which are layout constants rather than brand values.
    spacing: {
      0: '0px',
      px: '1px',
      // The 4px base step. A layout constant rather than a brand value, for the
      // same reason as the gutter: both identities agree on it, and prepending it
      // to the brand array would renumber every --space-N in the build.
      0.5: 'var(--space-half)',
      1: 'var(--space-1)',
      2: 'var(--space-2)',
      3: 'var(--space-3)',
      4: 'var(--space-4)',
      5: 'var(--space-5)',
      6: 'var(--space-6)',
      7: 'var(--space-7)',
      8: 'var(--space-8)',
      gutter: 'var(--gutter)',
      /* The status bar inset. Zero outside the device frame. */
      safe: 'var(--safe-top)',
      full: '100%',
    },

    borderRadius: {
      none: '0px',
      card: 'var(--radius-card)',
      control: 'var(--radius-control)',
      pill: 'var(--radius-pill)',
      shell: 'var(--radius-shell)',
    },

    // Three steps, per DESIGN.md section 4. `card` is the resting state of every
    // card, `raised` is hover and card-on-card, `sheet` is sheets and modals.
    boxShadow: {
      none: 'none',
      card: 'var(--shadow-card)',
      raised: 'var(--shadow-raised)',
      sheet: 'var(--shadow-sheet)',
    },

    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },

    // Each step carries its own line height, tracking and weight, so one
    // utility sets the whole role and the scale cannot be recombined by hand.
    fontSize: {
      hero: [
        'var(--step-hero-size)',
        {
          lineHeight: 'var(--step-hero-line)',
          letterSpacing: 'var(--step-hero-tracking)',
          fontWeight: 'var(--step-hero-weight)',
        },
      ],
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
      // Card and band headers. Register independent: see the note on the token.
      section: [
        'var(--type-section-size)',
        {
          lineHeight: 'var(--type-section-line)',
          letterSpacing: 'var(--type-section-tracking)',
          fontWeight: 'var(--type-section-weight)',
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
      // The control register, DESIGN.md section 6. Not a step in the reading
      // scale, which is why it carries a fixed weight and no tracking: every
      // button label in the app is this and nothing else.
      control: [
        'var(--control-label-size)',
        { lineHeight: '1', letterSpacing: '0', fontWeight: '500' },
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
      route: 'var(--motion-route)',
      role: 'var(--motion-role)',
      count: 'var(--motion-count)',
    },

    transitionTimingFunction: {
      ease: 'var(--motion-ease)',
      out: 'var(--motion-ease-out)',
    },

    // Emptied rather than disabled: this removes every `bg-gradient-*` utility
    // while leaving real background images (the forest block) reachable.
    backgroundImage: {},

    // Tailwind's animation utilities were dropped with the rest of the default
    // theme when `theme` was replaced rather than extended. `pulse` is the only
    // one this build wants: it is the skeleton loader, and DESIGN.md section 9
    // permits no other looping animation.
    keyframes: {
      pulse: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.45' },
      },
    },
    animation: {
      pulse: 'pulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },

    extend: {
      // Mobile-first roles render inside a device frame above this width.
      // Without it, a projected demo looks like a stretched phone app.
      screens: {
        frame: '900px',
      },
      borderWidth: {
        rule: '3px',
        // The nav active marker. Two pixels, above the item, no fill.
        nav: '2px',
      },
      // Control geometry, DESIGN.md section 6. Height is fixed per size rather
      // than derived from padding, so `h-control-primary` is the whole rule.
      height: {
        'control-primary': 'var(--control-h-primary)',
        'control-secondary': 'var(--control-h-secondary)',
        'control-compact': 'var(--control-h-compact)',
        'toggle-track': 'var(--control-toggle-h)',
        'toggle-knob': 'var(--control-toggle-knob)',
        icon: 'var(--control-icon)',
        'avatar-hero': 'var(--avatar-hero)',
        // The two fixed photograph heights. See index.css.
        'media-sm': 'var(--media-sm)',
        'media-md': 'var(--media-md)',
      },
      width: {
        icon: 'var(--control-icon)',
        'toggle-track': 'var(--control-toggle-w)',
        'toggle-knob': 'var(--control-toggle-knob)',
        'avatar-hero': 'var(--avatar-hero)',
      },
      inset: {
        'toggle-inset': 'var(--control-toggle-inset)',
      },
      translate: {
        'toggle-inset': 'var(--control-toggle-inset)',
        'toggle-throw': 'var(--control-toggle-throw)',
      },
      padding: {
        'control-primary': 'var(--control-px-primary)',
        'control-secondary': 'var(--control-px-secondary)',
        'control-compact': 'var(--control-px-compact)',
        // The text edge of a row that leads with a 48px thumbnail:
        // gutter + thumbnail + 16. See DESIGN.md section 6.
        thumb: 'calc(var(--gutter) + 64px)',
      },
      gap: {
        control: 'var(--control-gap)',
      },
      maxWidth: {
        // The width of the device screen. Panels that mirror the phone, the role
        // menu and the Blueprint sheet, are held to it so they line up with the
        // frame. The frame's own dimensions live in the `.device-*` block in
        // index.css, with the rest of its physical measurements.
        device: '420px',
        reading: '68ch',
        shell: '1440px',
      },
      minHeight: {
        tap: '48px',
        'cutaway-note': 'var(--cutaway-note)',
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
