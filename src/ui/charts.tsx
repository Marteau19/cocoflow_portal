/**
 * ui/charts.tsx
 *
 * Recharts, themed to the design system.
 *
 * Single baseline, no gridlines, no legend box, series labelled inline at the
 * end of the line, one accent plus neutrals, tabular numerals in the tooltip.
 * A sparkline appears only when the trend is the point.
 *
 * Recharts takes colours as props rather than classes, so this file resolves
 * the tokens from computed style once and hands them down. That keeps the
 * `no hex in a component` rule intact: the values still come from the active
 * brand object, just by a different route.
 */

import { useEffect, useState, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** The token names charts need, read from the cascade. */
const TOKENS = [
  'color-ink',
  'color-ink2',
  'color-ink3',
  'color-line',
  'color-line-strong',
  'color-surface',
  'color-surface-sunk',
  'color-accent',
  'color-accent-ink',
  // Available to any chart where the point is which side of a line a value
  // falls on. The series itself stays accent: it is the brand line.
  'color-positive',
  'color-negative',
  'color-warn',
  'font-mono',
  'font-sans',
] as const;

type TokenName = (typeof TOKENS)[number];
export type ChartTheme = Record<TokenName, string>;

const readTokens = (): ChartTheme => {
  const style = getComputedStyle(document.documentElement);
  return TOKENS.reduce((acc, name) => {
    acc[name] = style.getPropertyValue(`--${name}`).trim();
    return acc;
  }, {} as ChartTheme);
};

/**
 * Re-reads on brand switch. `applyBrand()` mutates inline styles, which does not
 * trigger a React render, so the observer is what keeps charts in step.
 */
export const useChartTheme = (): ChartTheme | null => {
  const [theme, setTheme] = useState<ChartTheme | null>(null);

  useEffect(() => {
    setTheme(readTokens());
    const observer = new MutationObserver(() => setTheme(readTokens()));
    observer.observe(document.documentElement, { attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  return theme;
};

const axisProps = (theme: ChartTheme) => ({
  stroke: theme['color-line-strong'],
  tick: {
    fill: theme['color-ink3'],
    fontSize: 11,
    fontFamily: theme['font-sans'],
  },
  tickLine: false,
});

/** Tabular numerals, hairline border, no shadow. */
const ChartTooltip = ({ theme, suffix }: { theme: ChartTheme; suffix?: string }) => (
  <Tooltip
    cursor={{ stroke: theme['color-line-strong'], strokeWidth: 1 }}
    contentStyle={{
      background: theme['color-surface'],
      border: `1px solid ${theme['color-line-strong']}`,
      borderRadius: 8,
      fontFamily: theme['font-sans'],
      fontSize: 13,
      fontVariantNumeric: 'tabular-nums',
      color: theme['color-ink'],
      boxShadow: 'none',
    }}
    labelStyle={{ color: theme['color-ink3'], fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}
    formatter={(value) => [`${value}${suffix ?? ''}`, '']}
    separator=""
  />
);

/**
 * A trend against a target. The target is a labelled reference line rather than
 * a second series, because the question the chart answers is "are we above the
 * line".
 */
export const TrendAgainstTarget = ({
  data,
  xKey,
  yKey,
  target,
  targetLabel,
  suffix = '',
  height = 200,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  target?: number;
  targetLabel?: string;
  suffix?: string;
  height?: number;
}) => {
  const theme = useChartTheme();
  if (!theme) return <div style={{ height }} />;

  /**
   * Domain fitted to the data and the target, not anchored at zero.
   *
   * Anchoring at zero is the honest default when a bar's length carries the
   * value. Here the question is movement against a line a few points above the
   * data, and a zero baseline squashes four periods of real change into the top
   * third of the plot. The axis labels stay visible, so the scale is never
   * hidden.
   */
  const values = data.map((row) => Number(row[yKey])).filter((n) => Number.isFinite(n));
  const lowest = Math.min(...values, target ?? Infinity);
  const highest = Math.max(...values, target ?? -Infinity);
  const pad = Math.max(2, (highest - lowest) * 0.35);
  const domain: [number, number] = [
    Math.max(0, Math.floor((lowest - pad) / 5) * 5),
    Math.ceil((highest + pad / 2) / 5) * 5,
  ];

  const lastIndex = data.length - 1;

  /**
   * Series labelled inline at the end of the line rather than in a legend box.
   * Recharts calls the renderer once per point, so it draws only at the last.
   */
  const endLabel = (props: { index?: number; x?: number | string; y?: number | string; value?: number | string }) => {
    if (props.index !== lastIndex) return <g />;
    return (
      <text
        x={Number(props.x) + 8}
        // Clear of the target rule: the final point sits just under it, and two
        // labels on the same baseline read as one string.
        y={Number(props.y) + 18}
        fill={theme['color-accent-ink']}
        fontSize={13}
        fontWeight={500}
        fontFamily={theme['font-sans']}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${props.value}${suffix}`}
      </text>
    );
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 56, bottom: 0, left: 0 }}>
          {/* No gridlines. The baseline is the only rule. */}
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis dataKey={xKey} {...axisProps(theme)} axisLine={{ stroke: theme['color-line-strong'] }} />
          <YAxis
            {...axisProps(theme)}
            axisLine={false}
            width={36}
            domain={domain}
            tickFormatter={(value: number) => `${value}`}
          />
          {target !== undefined && (
            <ReferenceLine
              y={target}
              stroke={theme['color-ink3']}
              strokeDasharray="3 3"
              label={{
                value: targetLabel ?? `${target}${suffix}`,
                position: 'right',
                fill: theme['color-ink2'],
                fontSize: 11,
                fontFamily: theme['font-sans'],
              }}
            />
          )}
          <ChartTooltip theme={theme} suffix={suffix} />
          <Line
            type="linear"
            dataKey={yKey}
            stroke={theme['color-accent']}
            strokeWidth={2}
            dot={{ r: 2.5, fill: theme['color-accent'], stroke: theme['color-accent'] }}
            activeDot={{ r: 4 }}
            label={endLabel}
            // No entrance animation. Staggered load-in is one of the strongest
            // tells of generated UI.
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Used only where the shape of the trend is itself the message. */
export const Sparkline = ({
  data,
  yKey,
  height = 40,
}: {
  data: Array<Record<string, string | number>>;
  yKey: string;
  height?: number;
}) => {
  const theme = useChartTheme();
  if (!theme) return <div style={{ height }} />;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Area
            type="linear"
            dataKey={yKey}
            stroke={theme['color-accent']}
            strokeWidth={1.5}
            fill={theme['color-surface-sunk']}
            fillOpacity={1}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * A ranked horizontal comparison, drawn as bordered rows rather than a bar
 * chart. Full-width progress bars are banned, and for three to a dozen Service
 * Points a numeric column reads faster than a chart anyway.
 */
export const RankedRows = ({
  rows,
}: {
  rows: Array<{
    key: string;
    label: string;
    value: number;
    suffix?: string;
    /** Above the target line, below it, or on it. */
    standing: 'lead' | 'lag' | 'on';
    detail?: ReactNode;
  }>;
}) => (
  <div className="divide-y divide-line">
    {rows.map((row) => {
      const tone =
        row.standing === 'lead'
          ? 'border-l-ink'
          : row.standing === 'lag'
            ? 'border-l-warn'
            : 'border-l-line-strong';
      return (
        <div key={row.key} className={`flex items-baseline justify-between gap-3 border-l-rule ${tone} px-4 py-3`}>
          <div className="min-w-0">
            <p className="text-body text-ink">{row.label}</p>
            {row.detail && <div className="mt-1 text-caption text-ink2">{row.detail}</div>}
          </div>
          <p className="shrink-0 text-h2 text-ink">
            {row.value.toFixed(1)}
            {row.suffix && <span className="text-caption text-ink2">{row.suffix}</span>}
          </p>
        </div>
      );
    })}
  </div>
);
