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

import type { ButtonHTMLAttributes, ReactNode } from 'react';
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

// `whitespace-nowrap` is load bearing: an action label that wraps to two lines
// inside a 48px control is the first thing a reviewer notices, and it happens at
// phone width wherever a button sits beside content.
const buttonBase =
  'inline-flex min-h-tap items-center justify-center gap-2 whitespace-nowrap rounded-control px-4 text-body font-medium transition-colors duration-state ease-ease disabled:opacity-40';

const buttonVariants: Record<ButtonVariant, string> = {
  // The accent fill. One per screen: a screen with two of these is a bug. The
  // label is dark, and hover lightens. See DESIGN.md section 2.
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  positive: 'bg-positive text-on-positive hover:opacity-90',
  negative: 'bg-negative text-on-negative hover:opacity-90',
  dark: 'bg-ink text-canvas hover:opacity-90',
  // Everything else that needs a boundary.
  quiet: 'border border-line-strong bg-surface text-ink hover:bg-surface-sunk',
  // Text action, for tertiary placement inside rows. No control height: it sits
  // in a line of copy, so it must not push the line taller than its neighbours.
  plain: 'min-h-0 px-0 text-accent-ink hover:text-ink',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: IconName;
  /** Fills the container. Used by the technician sticky action bar. */
  block?: boolean;
}

export const Button = ({
  variant = 'quiet',
  icon,
  block = false,
  children,
  className = '',
  ...rest
}: ButtonProps) => (
  <button
    type="button"
    className={`${buttonBase} ${buttonVariants[variant]} ${block ? 'w-full' : ''} ${className}`}
    {...rest}
  >
    {icon && <Icon name={icon} />}
    {children}
  </button>
);

/** Same shape as Button, but navigates. */
export const ButtonLink = ({
  to,
  variant = 'quiet',
  icon,
  block = false,
  children,
  className = '',
}: {
  to: string;
  variant?: ButtonVariant;
  icon?: IconName;
  block?: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <Link
    to={to}
    className={`${buttonBase} ${buttonVariants[variant]} ${block ? 'w-full' : ''} ${className}`}
  >
    {icon && <Icon name={icon} />}
    {children}
  </Link>
);

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
  const shell =
    'fixed bottom-6 right-gutter z-bar inline-flex min-h-tap items-center gap-2 rounded-pill bg-accent px-4 text-body font-medium text-on-accent shadow-raised transition-colors duration-state ease-ease hover:bg-accent-hover';
  if (to) {
    return (
      <Link to={to} className={shell}>
        <Icon name={icon} />
        {label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={shell}>
      <Icon name={icon} />
      {label}
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
  tone?: 'card' | 'raised' | 'flat';
  className?: string;
}) => {
  const tones = {
    card: 'bg-surface shadow-card',
    raised: 'bg-surface-raised shadow-raised',
    flat: 'bg-surface shadow-none',
  } as const;
  return (
    <div className={`overflow-hidden rounded-card border border-line ${tones[tone]} ${className}`}>
      {children}
    </div>
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
 * A 3px left rule on a row. One of the four permitted status treatments.
 *
 * Accent is still deliberately absent. It marks the one primary action on a
 * screen, and spending it on row state is how a screen ends up with two accents
 * and no primary. Where a row needs emphasis without a signal, `strong` is an
 * ink rule.
 */
export type RuleTone = 'none' | 'neutral' | 'strong' | 'positive' | 'warn' | 'alert';

const ruleTones: Record<RuleTone, string> = {
  none: 'border-l-transparent',
  neutral: 'border-l-line-strong',
  strong: 'border-l-ink',
  positive: 'border-l-positive',
  warn: 'border-l-warn',
  alert: 'border-l-alert',
};

/**
 * Bordered rows, not floating rounded rectangles. The manager and global
 * surfaces are table forward, and a list of individually floating cards reads as
 * a phone app pretending to be a console.
 */
export const Row = ({
  to,
  rule = 'none',
  children,
  className = '',
  gutter = false,
  density = 'client',
}: {
  to?: string;
  rule?: RuleTone;
  children: ReactNode;
  className?: string;
  /**
   * Aligns the row to the page gutter instead of the card inset. Used by rows
   * that sit directly on a band, which is now most of them.
   */
  gutter?: boolean;
  /** DESIGN.md section 11. Row height is set by role, not globally. */
  density?: 'client' | 'technician' | 'manager' | 'global';
}) => {
  const pad = {
    client: 'py-4',
    technician: 'py-3',
    manager: 'py-2',
    global: 'py-3',
  }[density];
  const shell = `block w-full border-l-rule ${ruleTones[rule]} ${
    gutter ? 'px-gutter' : 'px-4'
  } ${pad} text-left transition-colors duration-state ease-ease ${className}`;

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
}) => <div className={`divide-y divide-line ${className}`}>{children}</div>;

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
  <div className="flex items-baseline justify-between gap-3 px-4 py-3">
    <dt className="text-caption text-ink2">{label}</dt>
    <dd className={`text-right text-caption text-ink ${mono ? 'font-mono uppercase' : ''}`}>
      {value}
    </dd>
  </div>
);

/* ------------------------------------------------------------------ */
/* Status                                                             */
/* ------------------------------------------------------------------ */

export type StatusTone = 'neutral' | 'warn' | 'alert' | 'good' | 'accent';

/**
 * Solid signal colour on the matching tinted ground.
 *
 * `good` maps to positive rather than to accent on purpose. Accent is orange in
 * the new brand, and an orange "paid" or "passed" reads as a warning. Function
 * colours are shared across both brands for exactly this reason.
 */
const statusTones: Record<StatusTone, { pill: string; dot: string; text: string }> = {
  neutral: { pill: 'bg-surface-sunk text-ink2', dot: 'bg-ink3', text: 'text-ink2' },
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
  tone?: 'warn' | 'alert' | 'neutral' | 'good';
  icon?: IconName;
}) => {
  const tones = {
    warn: 'border-warn bg-warn-soft text-warn',
    alert: 'border-alert bg-alert-soft text-alert',
    good: 'border-positive bg-positive-soft text-positive',
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
 * A row of filter pills. The active one is filled, the rest are bordered.
 *
 * The fill defaults to `ink` rather than `accent`, because a tab strip is
 * navigation and the accent belongs to the screen's primary action. Pass
 * `fill="accent"` only on a screen that has no other accent fill.
 */
export const Tabs = <T extends string>({
  options,
  value,
  onChange,
  fill = 'ink',
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  fill?: 'ink' | 'accent';
  label: string;
}) => (
  <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
    {options.map((option) => {
      const active = option.value === value;
      const activeFill =
        fill === 'accent' ? 'bg-accent text-on-accent' : 'bg-ink text-canvas';
      return (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(option.value)}
          className={`inline-flex min-h-tap items-center whitespace-nowrap rounded-pill px-4 text-caption font-medium transition-colors duration-state ease-ease ${
            active ? activeFill : 'border border-line-strong bg-surface text-ink2 hover:bg-surface-sunk'
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
      className={`relative h-[28px] w-[48px] shrink-0 rounded-pill border transition-colors duration-state ease-ease ${
        checked ? 'border-accent bg-accent' : 'border-line-strong bg-surface-sunk'
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-[2px] block h-[22px] w-[22px] rounded-pill bg-surface shadow-card transition-transform duration-state ease-ease ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
}: {
  eyebrow?: string;
  title: string;
  /** DESIGN.md section 15: a chip is permitted in a band heading and nowhere else. */
  icon?: IconName;
  iconTone?: ChipTone;
  action?: ReactNode;
  onBand?: boolean;
}) => (
  <div className="flex items-end justify-between gap-3 pb-3 pt-4">
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
  <div className="px-4 py-6">
    <p className="text-body text-ink2">{line}</p>
    {action && (
      <ButtonLink to={action.to} variant="quiet" className="mt-3">
        {action.label}
      </ButtonLink>
    )}
  </div>
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
  const dimensions = size === 'hero' ? 'h-[72px] w-[72px]' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

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
