/**
 * ui/primitives.tsx
 *
 * The component vocabulary. DESIGN.md is normative; this file is where it is
 * enforced, so a screen that reaches for a primitive gets the rules for free.
 *
 * What is deliberately absent is as important as what is here: no card shadow,
 * no coloured status dot, no progress bar, no icon in a tinted square, no
 * gradient. Section 9 of DESIGN.md is the list, and it is treated as a lint
 * rule rather than a style suggestion.
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icons, type IconName } from './icons';

/* ------------------------------------------------------------------ */
/* Icon                                                                */
/* ------------------------------------------------------------------ */

/**
 * Renders inline at text size in `currentColor`, always. Never inside a tinted
 * rounded square: that badge pattern is the single most recognisable tell in
 * current dashboard output.
 */
export const Icon = ({ name, className }: { name: IconName; className?: string }) => {
  const Glyph = icons[name];
  return <Glyph size="1em" strokeWidth={1.75} aria-hidden className={className} />;
};

/* ------------------------------------------------------------------ */
/* Typography helpers                                                  */
/* ------------------------------------------------------------------ */

/**
 * Eyebrow and field labels. Never longer than four words, which is why the
 * prop is a string rather than children.
 */
export const Micro = ({ children, className = 'text-ink3' }: { children: string; className?: string }) => (
  <p className={`text-micro ${className}`}>{children}</p>
);

/**
 * Identifiers: work order numbers, invoice numbers, SKUs, asset ids, quote
 * references. Always mono, always uppercase, never truncated below the point of
 * uniqueness, which is why there is no ellipsis option.
 */
export const Identifier = ({ children, className = 'text-ink2' }: { children: string; className?: string }) => (
  <span className={`font-mono text-caption uppercase ${className}`}>{children}</span>
);

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'quiet' | 'plain';

// `whitespace-nowrap` is load bearing: an action label that wraps to two lines
// inside a 48px control is the first thing a reviewer notices, and it happens at
// phone width wherever a button sits beside content.
const buttonBase =
  'inline-flex min-h-tap items-center justify-center gap-2 whitespace-nowrap rounded-control px-4 text-body font-medium transition-colors duration-state ease-ease disabled:opacity-40';

const buttonVariants: Record<ButtonVariant, string> = {
  // The accent fill. One per screen: a screen with two of these is a bug.
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  // Everything else that needs a boundary.
  quiet: 'border border-line-strong bg-surface text-ink hover:bg-surface-sunk',
  // Text action, for tertiary placement inside rows.
  plain: 'px-0 text-accent-ink hover:text-ink',
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

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

/**
 * A bounded object: 1px line on surface, 10px radius, no elevation. The only
 * shadow in the system is reserved for sheets, modals and the device frame.
 */
export const Card = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`rounded-card border border-line bg-surface ${className}`}>{children}</div>
);

/** Section heading inside a card or a column. */
export const CardHeader = ({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) => (
  <div className="flex items-end justify-between gap-3 border-b border-line px-4 py-3">
    <div>
      {eyebrow && <Micro>{eyebrow}</Micro>}
      <h2 className={`text-h2 text-ink ${eyebrow ? 'mt-1' : ''}`}>{title}</h2>
    </div>
    {action}
  </div>
);

/* ------------------------------------------------------------------ */
/* Rows                                                               */
/* ------------------------------------------------------------------ */

/**
 * Status is a left rule, never a coloured circle.
 *
 * DESIGN.md section 7 sanctions --line-strong, --warn and --alert here, and
 * nothing else. Accent is deliberately absent: it marks the one primary action
 * on a screen, and spending it on row state is how a screen ends up with two
 * greens. Where a row needs emphasis without a signal, `strong` is an ink rule.
 */
export type RuleTone = 'none' | 'neutral' | 'strong' | 'warn' | 'alert';

const ruleTones: Record<RuleTone, string> = {
  none: 'border-l-transparent',
  neutral: 'border-l-line-strong',
  strong: 'border-l-ink',
  warn: 'border-l-warn',
  alert: 'border-l-alert',
};

/**
 * Bordered rows, not rounded-rect cards. The manager and global surfaces are
 * table forward, and a list of floating cards reads as a phone app pretending
 * to be a console.
 */
export const Row = ({
  to,
  rule = 'none',
  children,
  className = '',
}: {
  to?: string;
  rule?: RuleTone;
  children: ReactNode;
  className?: string;
}) => {
  const shell = `block w-full border-l-rule ${ruleTones[rule]} px-4 py-3 text-left transition-colors duration-state ease-ease ${className}`;

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

export type StatusTone = 'neutral' | 'warn' | 'alert' | 'good';

const statusTones: Record<StatusTone, string> = {
  neutral: 'text-ink2',
  warn: 'text-warn',
  alert: 'text-alert',
  good: 'text-accent-ink',
};

/**
 * A text label in the micro step. Never a dot, never a filled pill. Signal
 * colours are text only, which is why there is no background here.
 */
export const Status = ({ children, tone = 'neutral' }: { children: string; tone?: StatusTone }) => (
  <span className={`text-micro ${statusTones[tone]}`}>{children}</span>
);

/**
 * Signal colours may also carry a 1px border of the same hue, for the rare case
 * where a boundary is needed. Still no fill.
 */
export const Flag = ({
  children,
  tone = 'warn',
  icon,
}: {
  children: string;
  tone?: 'warn' | 'alert' | 'neutral';
  icon?: IconName;
}) => {
  const tones = {
    warn: 'border-warn text-warn',
    alert: 'border-alert text-alert',
    neutral: 'border-line-strong text-ink2',
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-control border px-2 py-1 text-caption ${tones[tone]}`}
    >
      {icon && <Icon name={icon} />}
      {children}
    </span>
  );
};

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
  tone?: 'ink' | 'accent' | 'on-forest';
}) => {
  const tones = { ink: 'text-ink', accent: 'text-accent-ink', 'on-forest': 'text-on-forest' } as const;
  return (
    <div>
      <Micro className={tone === 'on-forest' ? 'text-on-forest opacity-70' : 'text-ink3'}>
        {label}
      </Micro>
      <p className={`mt-1 text-display ${tones[tone]}`}>
        {value}
        {unit && <span className="ml-1 text-h2 font-medium">{unit}</span>}
      </p>
      {note && (
        <p className={`mt-1 text-caption ${tone === 'on-forest' ? 'text-on-forest opacity-70' : 'text-ink2'}`}>
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
  const dimensions =
    size === 'hero' ? 'h-[72px] w-[72px]' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

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
      className={`${dimensions} shrink-0 grid place-items-center rounded-pill border border-line bg-surface-sunk text-caption font-medium text-ink2`}
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
