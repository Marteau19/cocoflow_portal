/**
 * ui/primitives.tsx
 *
 * The component vocabulary. DESIGN.md is normative; this file is where it is
 * enforced, so a screen that reaches for a primitive gets the rules for free.
 *
 * This file was rebuilt for the Console direction. The previous version enforced
 * the opposite of several rules here: no card shadow, no coloured status fill, no
 * status dot, no icon in a tinted square. Those reversals are listed in DESIGN.md
 * section 9 under "No longer banned", and the enforcement that remains is what
 * still holds: one accent fill per screen, no gradient, no emoji, no dot without
 * a label, no weight 600, no hex value anywhere below this line.
 */

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icons, type IconName } from './icons';

/* ------------------------------------------------------------------ */
/* Icon                                                                */
/* ------------------------------------------------------------------ */

/** Inline, at text size, in `currentColor`. The default everywhere in prose. */
export const Icon = ({ name, className }: { name: IconName; className?: string }) => {
  const Glyph = icons[name];
  return <Glyph size="1em" strokeWidth={1.75} aria-hidden className={className} />;
};

export type ChipTone = 'accent' | 'neutral' | 'positive' | 'warn' | 'alert' | 'on-dark';

const chipTones: Record<ChipTone, string> = {
  accent: 'bg-accent-soft text-accent-ink',
  neutral: 'bg-surface-sunk text-ink2',
  positive: 'bg-positive-soft text-positive',
  warn: 'bg-warn-soft text-warn',
  alert: 'bg-alert-soft text-alert',
  // On the sidebar and the inverted feature panel, where no light tint reads.
  // `.bg-on-band-soft` is a component class in index.css: Tailwind cannot append
  // an alpha channel to a hex-valued custom property, so the tint is mixed.
  'on-dark': 'bg-on-band-soft text-on-band',
};

/**
 * An icon in a rounded square on a tinted ground.
 *
 * Permitted in card headers and in nav, and nowhere else. It is a grouping
 * device: it tells you which card you are looking at before you read the title.
 * Inline in prose it would be decoration, which is what the old ban was about.
 */
export const IconChip = ({
  name,
  tone = 'accent',
  size = 'md',
}: {
  name: IconName;
  tone?: ChipTone;
  size?: 'sm' | 'md';
}) => (
  <span
    aria-hidden
    className={`grid shrink-0 place-items-center rounded-control ${chipTones[tone]} ${
      size === 'sm' ? 'h-4 w-4 text-caption' : 'h-5 w-5 text-body'
    }`}
  >
    <Icon name={name} />
  </span>
);

/* ------------------------------------------------------------------ */
/* Typography helpers                                                  */
/* ------------------------------------------------------------------ */

/**
 * Eyebrow and field labels. Never longer than four words, which is why the
 * prop is a string rather than children.
 */
export const Micro = ({
  children,
  className = 'text-ink3',
}: {
  children: string;
  className?: string;
}) => <p className={`text-micro ${className}`}>{children}</p>;

/**
 * Identifiers: work order numbers, invoice numbers, SKUs, asset ids, quote
 * references. Always mono, always uppercase, never truncated below the point of
 * uniqueness, which is why there is no ellipsis option.
 */
export const Identifier = ({
  children,
  className = 'text-ink2',
}: {
  children: string;
  className?: string;
}) => <span className={`font-mono text-caption uppercase ${className}`}>{children}</span>;

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

/**
 * `primary` is the one accent fill on the screen.
 *
 * `positive` and `negative` are a pair, for opposite outcomes on the same
 * decision: approve against decline, accept against reject. Using one of them
 * alone, as a second primary, is the misuse this pair invites and DESIGN.md
 * section 2 forbids.
 *
 * `dark` is the neutral-but-prominent action. It is how a third button sits
 * beside a pair without claiming to be a fourth outcome.
 */
type ButtonVariant = 'primary' | 'positive' | 'negative' | 'dark' | 'quiet' | 'plain';

/**
 * Three sizes, DESIGN.md section 6. Height is a fixed value, never a consequence
 * of padding plus line height, because a control that derives its height from its
 * label changes height when the copy changes.
 */
export type ButtonSize = 'primary' | 'secondary' | 'compact';

const buttonSizes: Record<ButtonSize, string> = {
  primary: 'h-control-primary px-control-primary',
  secondary: 'h-control-secondary px-control-secondary',
  compact: 'h-control-compact px-control-compact',
};

/**
 * `whitespace-nowrap` is load bearing: an action label that wraps to two lines
 * inside a fixed-height control is the first thing a reviewer notices, and it
 * happens at phone width wherever a button sits beside content.
 *
 * The label is `text-control`, which is 15px weight 500 and is the only size a
 * button label is ever set at. It is a control register rather than a step in the
 * reading scale, so it does not count toward the four reading sizes a screen is
 * allowed. See DESIGN.md section 5.
 */
const buttonBase =
  'btn-fill inline-flex shrink-0 items-center justify-center gap-control whitespace-nowrap rounded-control text-control transition-colors duration-state ease-ease';

/**
 * Fill and label per variant.
 *
 * `--btn-fill` is what the three `.btn-fill` state rules in `index.css` read, so
 * hover at 6% darker, pressed at 12% darker and the disabled ground come from one
 * place and cannot be forgotten when a variant is added.
 */
const buttonVariants: Record<ButtonVariant, { className: string; fill?: string }> = {
  // The accent fill. One per screen on a light ground. See `onBand` below for
  // what happens on a dark one.
  primary: { className: 'text-on-accent', fill: 'var(--color-accent)' },
  positive: { className: 'text-on-positive', fill: 'var(--color-positive)' },
  negative: { className: 'text-on-negative', fill: 'var(--color-negative)' },
  dark: { className: 'text-canvas', fill: 'var(--color-ink)' },
  // A boundary rather than a fill. Secondary by definition: DESIGN.md section 6
  // forbids an outlined control as a screen's primary action.
  quiet: {
    className: 'border border-line-strong text-ink',
    fill: 'var(--color-surface)',
  },
  // Text action, for tertiary placement inside a row. No control height, because
  // it sits in a line of copy and must not push that line taller.
  plain: { className: 'h-auto px-0 text-accent-ink hover:text-ink', fill: 'transparent' },
};

/**
 * The dark-band override, DESIGN.md section 6.
 *
 * A saturated accent against `--band-deep` vibrates at the edge and reads as a
 * default control rather than a considered one, and it spends the screen's one
 * accent on a surface that does not need it. So on a dark band the primary action
 * is a `--surface` fill with an `--ink` label, and the secondary is an on-band
 * hairline.
 */
const onBandVariants: Partial<Record<ButtonVariant, { className: string; fill: string }>> = {
  primary: { className: 'text-ink', fill: 'var(--color-surface)' },
  quiet: {
    className: 'border border-on-band-soft text-on-band',
    fill: 'transparent',
  },
  plain: { className: 'h-auto px-0 text-on-band underline', fill: 'transparent' },
};

/**
 * A 16px spinner. Replaces the label while loading, with the button's width
 * locked so nothing around it reflows.
 *
 * `motion-reduce:animate-none` leaves a static ring, which still reads as "busy"
 * because the label is gone, so the state is not lost for those users.
 */
const Spinner = () => (
  <span
    aria-hidden
    className="h-icon w-icon shrink-0 animate-spin rounded-pill border-2 border-current border-t-transparent opacity-70 motion-reduce:animate-none"
  />
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  /** Fills the container. Used by the technician sticky action bar. */
  block?: boolean;
  /** Sits on a dark band, so primary becomes a surface fill. */
  onBand?: boolean;
  /** Swaps the label for a spinner and locks the width. */
  loading?: boolean;
}

/**
 * Resolves the class list and the `--btn-fill` value for a variant, size and
 * ground. Shared by Button and ButtonLink so the two cannot drift.
 */
const buttonStyle = (
  variant: ButtonVariant,
  size: ButtonSize,
  onBand: boolean,
  block: boolean,
  className: string,
) => {
  const resolved = (onBand && onBandVariants[variant]) || buttonVariants[variant];
  return {
    className: `${buttonBase} ${variant === 'plain' ? '' : buttonSizes[size]} ${
      resolved.className
    } ${block ? 'w-full' : ''} ${className}`,
    style: { '--btn-fill': resolved.fill } as CSSProperties,
  };
};

export const Button = ({
  variant = 'quiet',
  size = 'secondary',
  icon,
  block = false,
  onBand = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) => {
  const { className: cls, style } = buttonStyle(variant, size, onBand, block, className);
  return (
    <button
      type="button"
      className={cls}
      style={style}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          {/*
            The label stays in the flow but invisible, so the control keeps the
            exact width it had at rest. Locking the width with a measured pixel
            value would be a second source of truth for the same number.
          */}
          <span className="sr-only">{children}</span>
          <span aria-hidden className="invisible">
            {children}
          </span>
        </>
      ) : (
        <>
          {/* Optically centred to the cap height rather than to the line box:
              a 16px glyph on a 15px label sits low without the nudge. */}
          {icon && (
            <span className="-mt-px flex h-icon w-icon shrink-0 items-center justify-center">
              <Icon name={icon} />
            </span>
          )}
          {children}
        </>
      )}
    </button>
  );
};

/** Same shape as Button, but navigates. */
export const ButtonLink = ({
  to,
  variant = 'quiet',
  size = 'secondary',
  icon,
  block = false,
  onBand = false,
  children,
  className = '',
}: {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  block?: boolean;
  onBand?: boolean;
  children: ReactNode;
  className?: string;
}) => {
  const { className: cls, style } = buttonStyle(variant, size, onBand, block, className);
  return (
    <Link to={to} className={cls} style={style}>
      {icon && (
        <span className="-mt-px flex h-icon w-icon shrink-0 items-center justify-center">
          <Icon name={icon} />
        </span>
      )}
      {children}
    </Link>
  );
};

/**
 * The floating action button.
 *
 * One per screen at most, and only where the screen has a single obvious verb
 * that should stay reachable while the user scrolls: booking a visit, starting a
 * job. Anywhere else it is a shortcut nobody asked for that covers content.
 */
export const Fab = ({
  label,
  icon,
  to,
  onClick,
}: {
  label: string;
  icon: IconName;
  to?: string;
  onClick?: () => void;
}) => {
  // Primary geometry and the shared state fills, on a pill instead of a control
  // radius. It is a primary action, so it takes the 48px height and 20px padding.
  const shell =
    'btn-fill fixed bottom-6 right-gutter z-bar inline-flex h-control-primary items-center gap-control rounded-pill px-control-primary text-control text-on-accent shadow-raised transition-colors duration-state ease-ease';
  const style = { '--btn-fill': 'var(--color-accent)' } as CSSProperties;
  const inner = (
    <>
      <span className="-mt-px flex h-icon w-icon shrink-0 items-center justify-center">
        <Icon name={icon} />
      </span>
      {label}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={shell} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={shell} style={style}>
      {inner}
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

/**
 * A bounded object: surface ground, 1px line, card radius, and a resting shadow.
 *
 * The border and the shadow do different jobs and both are needed. The shadow
 * separates the card from the canvas; the border is what keeps the edge crisp
 * where the shadow is too soft to define one.
 *
 * `tone="raised"` is for a card on a card, which pairs with a `surface-sunk`
 * ground on the container. `tone="flat"` drops the elevation, for a card that is
 * already inside another one and only needs a boundary.
 */
export const Card = ({
  children,
  tone = 'card',
  className = '',
}: {
  children: ReactNode;
  /**
   * `brand` is the deep ground as a card rather than as a full-bleed band.
   *
   * The deep colour was previously reachable only as a Masthead, so the only way
   * to give a block the weight of the brand was to run it edge to edge and give
   * it the top of a screen. That is why every tab opened with a dark title card:
   * the composition had one loud register and one quiet one, and anything that
   * mattered had to claim the loud one. As a card it can carry a single block
   * partway down a screen, which is what the live-visit state needs.
   *
   * It carries no border: a hairline tuned for paper is invisible on it, and the
   * ground change is already the boundary.
   */
  tone?: 'card' | 'raised' | 'flat' | 'brand';
  className?: string;
}) => {
  const tones = {
    card: 'bg-surface shadow-card border border-line',
    raised: 'bg-surface-raised shadow-raised border border-line',
    flat: 'bg-surface shadow-none border border-line',
    brand: 'bg-band-deep text-on-band shadow-card border-0',
  } as const;
  return (
    <div className={`overflow-hidden rounded-card ${tones[tone]} ${className}`}>{children}</div>
  );
};

/**
 * Section heading inside a card or a column.
 *
 * The optional icon chip is the grouping device from DESIGN.md section 7: at a
 * glance it says what kind of card this is before the title is read.
 */
export const CardHeader = ({
  title,
  eyebrow,
  icon,
  iconTone = 'accent',
  action,
}: {
  title: string;
  eyebrow?: string;
  icon?: IconName;
  iconTone?: ChipTone;
  action?: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
    <div className="flex min-w-0 items-center gap-3">
      {icon && <IconChip name={icon} tone={iconTone} />}
      <div className="min-w-0">
        {eyebrow && <Micro>{eyebrow}</Micro>}
        <h2 className={`text-body font-medium text-ink ${eyebrow ? 'mt-1' : ''}`}>{title}</h2>
      </div>
    </div>
    {action}
  </div>
);

/* ------------------------------------------------------------------ */
/* Rows                                                               */
/* ------------------------------------------------------------------ */

/**
 * Row state, carried by the row's ground.
 *
 * This used to be a 3px left rule. Two things were wrong with it.
 *
 * First, it was broken: `RowList` used `divide-y divide-line`, and Tailwind's
 * `divide-{color}` sets `border-color` on all four sides of every child after the
 * first, through a selector that outranks a plain `border-l-transparent` utility.
 * So every row except the first grew a 3px vertical stub in the hairline colour
 * whether it had a state or not. There was no logic to those marks because they
 * were an accident.
 *
 * Second, even working correctly it was the weakest of the four status treatments.
 * The audit finding on `/readiness` was that a passing gate and a failing gate
 * read as identical because the only difference was a thin marker. Ground carries
 * state; a 3px edge does not.
 *
 * So state is now a tinted ground. `none` is the common case and paints nothing.
 */
export type RowTone = 'none' | 'neutral' | 'strong' | 'positive' | 'warn' | 'alert';

const rowTones: Record<RowTone, string> = {
  none: '',
  // `neutral` and `strong` were emphasis rather than signal, and emphasis on a row
  // is the job of its type weight. They paint nothing, deliberately, so the call
  // sites that pass them keep working without adding noise back.
  neutral: '',
  strong: '',
  positive: 'bg-positive-soft',
  warn: 'bg-warn-soft',
  alert: 'bg-alert-soft',
};

/**
 * Bordered rows, not floating rounded rectangles. The manager and global
 * surfaces are table forward, and a list of individually floating cards reads as
 * a phone app pretending to be a console.
 */
export const Row = ({
  to,
  tone = 'none',
  children,
  className = '',
  density = 'client',
}: {
  to?: string;
  tone?: RowTone;
  children: ReactNode;
  className?: string;
  /** DESIGN.md section 11. Row height is set by role, not globally. */
  density?: 'client' | 'technician' | 'manager' | 'global';
}) => {
  const pad = {
    client: 'py-4',
    technician: 'py-3',
    manager: 'py-2',
    global: 'py-3',
  }[density];
  /*
    A row always sits on the gutter. There used to be a `gutter` boolean that
    chose between `px-gutter` and a 16px card inset, defaulting to the inset, and
    87 of the 155 rows in the build never passed it. That is where the second and
    third left edges on a screen came from.

    The prop is gone rather than defaulted, because a default that is wrong at 87
    call sites is not a default, and leaving it accepted would let the misalignment
    back in. There are no cards left in any screen for the inset to serve.
  */
  const shell = `block w-full ${rowTones[tone]} px-gutter ${pad} text-left transition-colors duration-state ease-ease ${className}`;

  if (to) {
    return (
      <Link to={to} className={`${shell} hover:bg-surface-sunk`}>
        {children}
      </Link>
    );
  }
  return <div className={shell}>{children}</div>;
};

/** A list of rows separated by hairlines. */
export const RowList = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  /*
    Not `divide-y divide-line`. That utility pair sets `border-color` on all four
    sides of every child after the first, through a selector specific enough to
    beat a plain per-side colour utility on the child itself. Setting only
    `border-top-color` keeps the divider and leaves the child's own borders alone.
  */
  <div className={`[&>*+*]:border-t [&>*+*]:border-t-line ${className}`}>{children}</div>
);

/** Label and value on one line. The workhorse of the quiet lower half. */
export const Field = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) => (
  <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
    <dt className="text-caption text-ink2">{label}</dt>
    <dd className={`text-right text-caption text-ink ${mono ? 'font-mono uppercase' : ''}`}>
      {value}
    </dd>
  </div>
);

/* ------------------------------------------------------------------ */
/* Status                                                             */
/* ------------------------------------------------------------------ */

export type StatusTone = 'neutral' | 'info' | 'warn' | 'alert' | 'good' | 'accent';

/**
 * Solid signal colour on the matching tinted ground.
 *
 * `good` maps to positive rather than to accent on purpose. Accent is orange in
 * the new brand, and an orange "paid" or "passed" reads as a warning. Function
 * colours are shared across both brands for exactly this reason.
 */
const statusTones: Record<StatusTone, { pill: string; dot: string; text: string }> = {
  /*
    Neutral is a `--surface` fill with a hairline, not a `--surface-sunk` fill.

    It was sunk, which is also the ground of every Rail and Closing band, so a
    neutral pill on those bands was the same colour as the band and only its label
    showed. That is why `/route` looked like it had two status systems in one list:
    "FIXED" is a warn pill on a soft ground and "CAN MOVE" is a neutral pill, and
    the neutral one was invisible, so it read as bare text.

    Surface plus a hairline is visible on every band level in DESIGN.md section 3:
    the fill separates it on Rail and Closing, the hairline on Data.
  */
  neutral: { pill: 'border border-line-strong bg-surface text-ink2', dot: 'bg-ink3', text: 'text-ink2' },
  /*
    Information, as distinct from neutral.

    `neutral` says "no signal here"; `info` says "read this, it is not a problem".
    The build had no way to say the second, so covered-by-your-plan and
    this-is-an-estimate were both being drawn as `neutral` on a sunk ground and
    vanishing into the Rail bands they sat on.
  */
  info: { pill: 'bg-info-soft text-info', dot: 'bg-info', text: 'text-info' },
  warn: { pill: 'bg-warn-soft text-warn', dot: 'bg-warn', text: 'text-warn' },
  alert: { pill: 'bg-alert-soft text-alert', dot: 'bg-alert', text: 'text-alert' },
  good: { pill: 'bg-positive-soft text-positive', dot: 'bg-positive', text: 'text-positive' },
  accent: { pill: 'bg-accent-soft text-accent-ink', dot: 'bg-accent', text: 'text-accent-ink' },
};

/**
 * A status pill: micro label on a tinted ground.
 *
 * `dot` adds a filled circle before the label. The label is not optional and
 * there is no prop to remove it, because a dot on its own is colour as the only
 * signal, which is the one thing in this area that is still banned.
 */
export const Status = ({
  children,
  tone = 'neutral',
  dot = false,
}: {
  children: string;
  tone?: StatusTone;
  dot?: boolean;
}) => (
  <span
    className={`inline-flex shrink-0 items-center gap-2 rounded-pill px-2 py-1 text-micro ${statusTones[tone].pill}`}
  >
    {dot && <span aria-hidden className={`h-1 w-1 rounded-pill ${statusTones[tone].dot}`} />}
    {children}
  </span>
);

/**
 * A status dot with its label as ordinary text, for use inside a row of prose or
 * a table cell where a filled pill would be too loud.
 *
 * The label is a required prop for the same reason as above.
 */
export const StatusDot = ({ label, tone = 'neutral' }: { label: string; tone?: StatusTone }) => (
  <span className="inline-flex items-center gap-2">
    <span aria-hidden className={`h-1 w-1 shrink-0 rounded-pill ${statusTones[tone].dot}`} />
    <span className={`text-caption ${statusTones[tone].text}`}>{label}</span>
  </span>
);

/**
 * A louder callout than a pill: a bordered, tinted band with an optional icon.
 * For the one thing on a screen that must be read before anything else.
 */
export const Flag = ({
  children,
  tone = 'warn',
  icon,
}: {
  children: string;
  tone?: 'warn' | 'alert' | 'neutral' | 'good' | 'info';
  icon?: IconName;
}) => {
  const tones = {
    warn: 'border-warn bg-warn-soft text-warn',
    alert: 'border-alert bg-alert-soft text-alert',
    good: 'border-positive bg-positive-soft text-positive',
    info: 'border-info bg-info-soft text-info',
    neutral: 'border-line-strong bg-surface-sunk text-ink2',
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-control border px-2 py-1 text-caption font-medium ${tones[tone]}`}
    >
      {icon && <Icon name={icon} />}
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Controls                                                           */
/* ------------------------------------------------------------------ */

/**
 * A row of filter tabs. DESIGN.md section 14: active is `--ink` text at weight
 * 500 with a 2px `--ink` rule beneath, and there is no fill on either state.
 *
 * This used to fill the active tab, which made a filter look like the screen's
 * primary action. A filter is navigation: it changes what you are looking at, it
 * does not commit anything, so it should not carry the weight of a button.
 *
 * The strip aligns to the gutter and its own baseline rule runs full width, so it
 * reads as one control rather than as a scatter of chips. It is a tablist, so the
 * `fill` prop is gone rather than deprecated: leaving it would let a caller put
 * the fill back.
 */
export const Tabs = <T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) => (
  <div role="tablist" aria-label={label} className="flex items-stretch gap-5 border-b border-line">
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(option.value)}
          // The 2px rule sits on the strip's own hairline, so the active tab
          // overprints it rather than floating above it.
          className={`-mb-px inline-flex min-h-tap items-center whitespace-nowrap border-b-nav text-body transition-colors duration-state ease-ease ${
            active
              ? 'border-b-ink font-medium text-ink'
              : 'border-b-transparent font-normal text-ink3 hover:text-ink2'
          }`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

/** A pill track that fills with accent when on, with a white knob. */
export const Toggle = ({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) => (
  <label className="flex min-h-tap items-center justify-between gap-3">
    <span className="min-w-0">
      <span className="block text-body text-ink">{label}</span>
      {hint && <span className="mt-1 block text-caption text-ink2">{hint}</span>}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-toggle-track w-toggle-track shrink-0 rounded-pill border transition-colors duration-state ease-ease ${
        checked ? 'border-accent bg-accent' : 'border-line-strong bg-surface-sunk'
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-toggle-inset block h-toggle-knob w-toggle-knob rounded-pill bg-surface shadow-card transition-transform duration-state ease-ease ${
          checked ? 'translate-x-toggle-throw' : 'translate-x-toggle-inset'
        }`}
      />
    </button>
  </label>
);

/* ------------------------------------------------------------------ */
/* Bands                                                              */
/* ------------------------------------------------------------------ */

/**
 * A band. DESIGN.md section 2.
 *
 * The page is a vertical sequence of three to six of these, at deliberately
 * unequal weight. A band runs the full width of the content column, edge to
 * edge, with no radius of its own. Content sits inside its padding, not inside a
 * box drawn on it.
 *
 * This primitive exists so the rhythm rules are checkable rather than aspirational:
 * `data-band` is what `scripts/audit-design.mjs` counts, and what it uses to
 * assert that no two adjacent bands share a ground.
 *
 * What is deliberately absent: any prop that would let a caller draw a border
 * around a band, nest one inside another, or round its corners. Those are the
 * three ways the old card stack would come back.
 */
export type BandKind = 'masthead' | 'lead' | 'reading' | 'data' | 'rail' | 'closing';

const bandGrounds: Record<BandKind, string> = {
  // Two dark grounds. `alt` is available via the `alt` prop on masthead only.
  masthead: 'bg-band-deep text-on-band',
  lead: 'bg-canvas',
  reading: 'bg-canvas',
  data: 'bg-surface',
  rail: 'bg-surface-sunk',
  closing: 'bg-surface-sunk',
};

/**
 * Vertical padding by band and register. A Masthead is the only band that gets
 * the 64px step, and the technician register runs everything tighter because that
 * surface is read one-handed in a basement.
 */
const bandPadding: Record<BandKind, string> = {
  masthead: 'pb-5 pt-[calc(var(--safe-top)+var(--space-4))]',
  lead: 'py-5',
  reading: 'py-5',
  data: 'py-0',
  rail: 'py-4',
  closing: 'py-4',
};

export const Band = ({
  kind,
  alt = false,
  children,
  className = '',
  flush = false,
}: {
  kind: BandKind;
  /**
   * The dark variant.
   *
   * On a Masthead it is `band-deep-alt`, the second dark ground, for a hero field
   * that has to separate from the Masthead above it. On a Closing band it is
   * `band-deep`, which DESIGN.md section 2 permits and section 8 counts as the
   * one allowed second dark band on a screen. It is also the way out of the
   * rhythm rule when a Rail band would otherwise be followed by a Closing band on
   * the same ground.
   */
  alt?: boolean;
  children: ReactNode;
  className?: string;
  /** Drops the horizontal gutter, for a photograph or a chart that runs edge to edge. */
  flush?: boolean;
}) => (
  <section
    data-band={kind}
    className={`${
      alt && kind === 'masthead'
        ? 'bg-band-deep-alt text-on-band'
        : alt && kind === 'closing'
          ? 'bg-band-deep text-on-band'
          : bandGrounds[kind]
    } ${
      bandPadding[kind]
    } ${flush ? '' : 'px-gutter'} ${className}`}
  >
    {children}
  </section>
);

/**
 * The hero. One per screen, DESIGN.md section 7.
 *
 * A number, with its `micro` label above and at most one line of `body` beneath.
 * The `hero` step is register-scoped, so this is 48px inside the handset and 72px
 * on a full-bleed surface, at every browser width.
 *
 * `delta` is the distance from a target, which is the subject of almost every
 * figure in this product. It renders signed and toned, because "33.1%" alone does
 * not answer the question anyone opened the screen to ask.
 */
export const Hero = ({
  label,
  value,
  unit,
  note,
  delta,
  onBand = false,
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  delta?: { text: string; tone: 'positive' | 'warn' | 'neutral' };
  onBand?: boolean;
}) => {
  const deltaTones = {
    positive: onBand ? 'text-on-band' : 'text-positive',
    warn: onBand ? 'text-on-band' : 'text-warn',
    neutral: onBand ? 'text-on-band-muted' : 'text-ink2',
  } as const;

  return (
    <div>
      <Micro className={onBand ? 'text-on-band-muted' : 'text-ink3'}>{label}</Micro>
      <p className={`mt-2 text-hero ${onBand ? 'text-on-band' : 'text-ink'}`}>
        {value}
        {unit && <span className="ml-1 text-display">{unit}</span>}
      </p>
      {delta && (
        <p className={`mt-2 text-body font-medium ${deltaTones[delta.tone]}`}>{delta.text}</p>
      )}
      {note && (
        <p
          className={`mt-1 max-w-reading text-body ${
            onBand ? 'text-on-band opacity-80' : 'text-ink2'
          }`}
        >
          {note}
        </p>
      )}
    </div>
  );
};

/**
 * The standard Masthead contents.
 *
 * Every screen's dark band is the same three parts: an eyebrow, the screen's
 * subject, and the hero. Writing that out thirty-four times is how thirty-four
 * slightly different mastheads happen, so it lives here once.
 *
 * `hero` is a `Hero` element for a number, or omitted when the subject itself is
 * the hero, in which case the subject renders at the hero step. That is the "dark
 * field" hero type in the table in DESIGN.md section 7.
 */
export const Masthead = ({
  eyebrow,
  subject,
  hero,
  lead,
  alt = false,
  children,
}: {
  /**
   * Optional, and this is a copy rule expressed as a type.
   *
   * A Masthead gets an eyebrow or a heading, not both, unless the eyebrow does
   * orientation work the heading cannot: naming a step, a date or a count. It was
   * required, so every screen supplied one, and most of them restated the heading.
   * "Your soil test" above "What we found on your land" is one idea twice.
   */
  eyebrow?: string;
  subject: string;
  hero?: ReactNode;
  lead?: string;
  alt?: boolean;
  children?: ReactNode;
}) => (
  <Band kind="masthead" alt={alt}>
    {eyebrow && <Micro className="text-on-band-muted">{eyebrow}</Micro>}
    {hero ? (
      <>
        <p className={`text-h1 text-on-band ${eyebrow ? 'mt-1' : ''}`}>{subject}</p>
        <div className="mt-5">{hero}</div>
      </>
    ) : (
      /* The subject is the hero. No second figure competes with it. */
      <p className={`text-hero text-on-band ${eyebrow ? 'mt-2' : ''}`}>{subject}</p>
    )}
    {lead && (
      <p className="mt-3 max-w-reading text-body text-on-band opacity-90">{lead}</p>
    )}
    {children}
  </Band>
);

/**
 * A band heading. Sits at the top of a Data or Rail band, on the band's own
 * ground, with no box around it.
 *
 * This replaces most of what `CardHeader` was doing. The difference is that a
 * CardHeader draws a bordered strip at the top of a container, and this does not:
 * the band already provides the separation, so a rule here would be the second
 * boundary in the same place.
 */
export const BandHead = ({
  eyebrow,
  title,
  icon,
  iconTone = 'accent',
  action,
  onBand = false,
  gutter = true,
}: {
  eyebrow?: string;
  title: string;
  /** DESIGN.md section 15: a chip is permitted in a band heading and nowhere else. */
  icon?: IconName;
  iconTone?: ChipTone;
  action?: ReactNode;
  onBand?: boolean;
  /**
   * On by default, and this is the fix for the worst alignment defect in the build.
   *
   * A `flush` Band drops its own `px-gutter` so a chart or a photograph can run
   * edge to edge, and almost every Data and Rail band is flush because its rows
   * carry their own gutter. BandHead had no horizontal padding at all, so on those
   * bands every eyebrow and heading rendered at left 0 while the rows beneath sat
   * at the gutter. Measured on `/route`: headings at 0, rows at 32.
   *
   * Pass `gutter={false}` only inside a band that is not flush, where the band has
   * already applied it and a second would double the indent.
   */
  gutter?: boolean;
}) => (
  <div
    className={`flex items-end justify-between gap-3 pb-3 pt-4 ${gutter ? 'px-gutter' : ''}`}
  >
    <div className="flex min-w-0 items-center gap-3">
      {icon && <IconChip name={icon} tone={onBand ? 'on-dark' : iconTone} />}
      <div className="min-w-0">
        {eyebrow && <Micro className={onBand ? 'text-on-band-muted' : 'text-ink3'}>{eyebrow}</Micro>}
        <h2 className={`text-h1 ${onBand ? 'text-on-band' : 'text-ink'} ${eyebrow ? 'mt-1' : ''}`}>
          {title}
        </h2>
      </div>
    </div>
    {action}
  </div>
);

/* ------------------------------------------------------------------ */
/* Numbers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Large figures are a brand asset: display weight, tabular, with a micro label
 * above. Units sit outside the figure so the numerals stay aligned in a row.
 */
export const Kpi = ({
  label,
  value,
  unit,
  note,
  tone = 'ink',
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  tone?: 'ink' | 'accent' | 'positive' | 'negative' | 'on-band';
}) => {
  const tones = {
    ink: 'text-ink',
    accent: 'text-accent-ink',
    positive: 'text-positive',
    negative: 'text-negative',
    'on-band': 'text-on-band',
  } as const;
  const onDark = tone === 'on-band';
  return (
    <div>
      <Micro className={onDark ? 'text-on-band opacity-70' : 'text-ink3'}>{label}</Micro>
      <p className={`mt-1 text-display ${tones[tone]}`}>
        {value}
        {unit && <span className="ml-1 text-body font-medium">{unit}</span>}
      </p>
      {note && (
        <p className={`mt-1 text-caption ${onDark ? 'text-on-band opacity-70' : 'text-ink2'}`}>
          {note}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Empty state                                                        */
/* ------------------------------------------------------------------ */

/** One line stating what belongs here, one action. No illustration, no apology. */
export const Empty = ({
  line,
  action,
}: {
  line: string;
  action?: { label: string; to: string };
}) => (
  <div className="px-gutter py-6">
    <p className="text-body text-ink2">{line}</p>
    {action && (
      <ButtonLink to={action.to} variant="quiet" className="mt-3">
        {action.label}
      </ButtonLink>
    )}
  </div>
);

/**
 * An icon beside a line of explanation: the offline strip, the travel gap between
 * stops, the "behind this screen" note.
 *
 * The icon sits in a fixed 16px box with a 12px gap, so the text edge is always
 * `gutter + 28` regardless of the row's font size. Written inline, the icon
 * inherited `1em` from its context, so the same pattern landed at 48px in a `body`
 * row and 45px in a `caption` row. Three pixels is invisible on its own and is
 * exactly how a build accumulates twelve left edges.
 */
export const Note = ({
  icon,
  tone = 'text-ink3',
  children,
  onBand = false,
}: {
  icon: IconName;
  /** The icon's colour. The text is always secondary ink. */
  tone?: string;
  children: ReactNode;
  onBand?: boolean;
}) => (
  <div className="flex items-start gap-2">
    <span className={`mt-px flex h-icon w-icon shrink-0 items-center justify-center ${tone}`}>
      <Icon name={icon} />
    </span>
    <p
      className={`max-w-reading text-caption ${onBand ? 'text-on-band opacity-80' : 'text-ink2'}`}
    >
      {children}
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Objects                                                            */
/* ------------------------------------------------------------------ */

/**
 * A 48px product thumbnail, and the gutter anchor for any row that leads with
 * one.
 *
 * The size is fixed at 48 for two reasons. It is the tap target, so the image and
 * the row's minimum height agree. And it makes the text edge of the row a
 * calculable constant: `gutter + 48 + 16`, which is the `pl-thumb` utility and the
 * only second left edge DESIGN.md section 6 permits.
 *
 * 48px is what `/parts` already rendered, since `h-6` resolves to `--space-6`. The
 * value of putting it here is that the number is now stated once and the text edge
 * is derived from it, rather than both being open-coded per row and agreeing by
 * luck.
 *
 * `src` may be null. Where there is no photograph of a thing, this renders a
 * labelled placeholder rather than a stand-in from a neighbouring category,
 * because a confidently wrong picture is worse than an admitted gap.
 */
export const Thumb = ({ src, alt }: { src: string | null; alt: string }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      className="h-6 w-6 shrink-0 rounded-control border border-line bg-surface object-contain"
    />
  ) : (
    <span
      className="grid h-6 w-6 shrink-0 place-items-center rounded-control border border-line bg-surface-sunk"
      title="No photograph on file for this part"
    >
      {/* `micro` rather than an icon: the icon budget has no "no image" glyph, and
          spending one on an absence would be the wrong trade. */}
      <span className="text-micro text-ink3">N/A</span>
    </span>
  );

/* ------------------------------------------------------------------ */
/* People                                                             */
/* ------------------------------------------------------------------ */

/**
 * Real photography where we have it, initials where we do not. The fallback is
 * not a placeholder to be replaced later: several resources genuinely have no
 * portrait on file, and inventing one would be decorative stock imagery.
 */
export const Avatar = ({
  name,
  initials,
  photo,
  size = 'md',
}: {
  name: string;
  initials: string;
  photo: string | null;
  /** `hero` is for the client home only, where the face is the reassurance. */
  size?: 'md' | 'lg' | 'hero';
}) => {
  const dimensions =
    size === 'hero' ? 'h-avatar-hero w-avatar-hero' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${dimensions} shrink-0 rounded-pill border border-line object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`${dimensions} grid shrink-0 place-items-center rounded-pill border border-line bg-surface-sunk text-caption font-medium text-ink2`}
    >
      {initials}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Page scaffolding                                                   */
/* ------------------------------------------------------------------ */

/** Page title block. Client surfaces stay calm; the eyebrow carries context. */
export const PageHead = ({
  title,
  eyebrow,
  lead,
}: {
  title: string;
  eyebrow?: string;
  lead?: string;
}) => (
  <header>
    {eyebrow && <Micro>{eyebrow}</Micro>}
    <h1 className={`text-h1 text-ink ${eyebrow ? 'mt-1' : ''}`}>{title}</h1>
    {lead && <p className="mt-2 max-w-reading text-body text-ink2">{lead}</p>}
  </header>
);

/** Vertical rhythm for a single column screen. */
export const Stack = ({
  children,
  gap = '4',
  className = '',
}: {
  children: ReactNode;
  gap?: '2' | '3' | '4' | '5';
  className?: string;
}) => {
  const gaps = { '2': 'gap-2', '3': 'gap-3', '4': 'gap-4', '5': 'gap-5' } as const;
  return <div className={`flex flex-col ${gaps[gap]} ${className}`}>{children}</div>;
};
