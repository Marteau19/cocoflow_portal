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
  ComposedChart,
  Line,
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
  // The Data role. Chart series never use the accent: the accent is an
  // invitation to click and a chart line is not clickable. DESIGN.md section 4.
  'color-data-1',
  'color-data-2',
  'color-data-3',
  'color-field-line',
  // Which side of the target a value falls on tones the wedge.
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
/**
 * A figure against a target, over time.
 *
 * Every chart in this product has the same subject: distance from a target.
 * Service revenue share against 35 percent. Portal activation against a rollout
 * plan. Readiness against a gate. Nobody opens this to discover a trend, they open
 * it to see how far off they are.
 *
 * So the target is not an annotation here. **The target is the chart and the
 * series is the distance from it.** DESIGN.md section 12. Concretely:
 *
 *  - the reference line is drawn solid at 2px, not dashed and faint
 *  - the wedge between the series and the target is filled and toned, so the
 *    answer is readable with the numbers covered
 *  - the endpoint carries its value at `display` size and the signed distance
 *    beneath it
 *  - no y ticks: fitted values like "40, 29, 22, 15" read as debug output
 */
export const TrendAgainstTarget = ({
  data,
  xKey,
  yKey,
  target,
  targetLabel,
  suffix = '',
  /** Floor is 240. Below that the wedge has no room to be a visible quantity. */
  height = 260,
  /** Which side of the target is the good side. Sets the wedge colour. */
  goodSide = 'above',
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  target?: number;
  targetLabel?: string;
  suffix?: string;
  height?: number;
  goodSide?: 'above' | 'below';
}) => {
  const theme = useChartTheme();
  if (!theme) return <div style={{ height: Math.max(height, 240) }} />;

  const plotHeight = Math.max(height, 240);

  /**
   * Domain fitted to the data and the target, not anchored at zero.
   *
   * Anchoring at zero is the honest default when a bar's length carries the
   * value. Here the question is movement against a line a few points above the
   * data, and a zero baseline squashes four periods of real change into the top
   * third of the plot.
   */
  const values = data.map((row) => Number(row[yKey])).filter((n) => Number.isFinite(n));
  const lowest = Math.min(...values, target ?? Infinity);
  const highest = Math.max(...values, target ?? -Infinity);
  const spread = Math.max(highest - lowest, 1);
  const domain: [number, number] = [
    Math.max(0, Math.floor((lowest - spread * 0.25) / 5) * 5),
    // Real headroom above the target. With the target at the top of the domain it
    // renders flush to the plot edge and reads as a border rather than a line.
    Math.ceil((highest + spread * 0.55) / 5) * 5,
  ];

  const lastIndex = data.length - 1;
  const last = values[lastIndex];
  const gap = target === undefined ? 0 : last - target;
  const onGoodSide = goodSide === 'above' ? gap >= 0 : gap <= 0;

  /**
   * The wedge takes the series colour, not the verdict colour.
   *
   * Revised after building it. DESIGN.md section 12 originally said to tone the
   * wedge positive or warn by which side of the target the series sits. In
   * practice `--warn` is a brown, and a brown at 12 percent over a warm canvas is
   * a muddy wash that reads as a rendering artefact rather than as a signal. The
   * verdict is carried by the signed endpoint label instead, which states it in
   * words and cannot be misread. The wedge's job is to make the gap legible as a
   * quantity, and the series colour does that without staining the plot.
   */
  const wedge = theme['color-data-1'];

  /**
   * The endpoint. Value at display size, signed distance beneath it.
   *
   * Recharts calls a label renderer once per point, so this draws only at the
   * last one. The distance is the sentence the viewer came for, which is why it
   * is rendered rather than left to be worked out from two numbers.
   */
  const endLabel = (props: {
    index?: number;
    x?: number | string;
    y?: number | string;
    value?: number | string;
  }) => {
    if (props.index !== lastIndex) return <g />;
    const x = Number(props.x) + 10;
    const y = Number(props.y);
    return (
      <g>
        <text
          x={x}
          y={y + 2}
          fill={theme['color-ink']}
          fontSize={26}
          fontWeight={700}
          fontFamily={theme['font-sans']}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {`${props.value}${suffix}`}
        </text>
        {target !== undefined && (
          <text
            x={x}
            y={y + 22}
            fill={onGoodSide ? theme['color-positive'] : theme['color-warn']}
            fontSize={13}
            fontWeight={500}
            fontFamily={theme['font-sans']}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {`${Math.abs(gap).toFixed(1)}${suffix} ${gap >= 0 ? 'above' : 'below'} target`}
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ height: plotHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 16, right: 132, bottom: 0, left: 0 }}>
          {/* No gridlines. The baseline and the target rule are the only rules. */}
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis
            dataKey={xKey}
            {...axisProps(theme)}
            axisLine={{ stroke: theme['color-line-strong'] }}
          />
          {/*
            No ticks: fitted values read as debug output. `hide` rather than
            `width={0}`, because a zero-width axis is dropped entirely and takes
            the domain with it, which leaves the target rule flush to the plot
            edge where it reads as a border.
          */}
          {/*
            A 1px-wide axis rather than `hide` or `width={0}`. Both of those drop
            the axis from the chart's axis map, and the explicit domain goes with
            it, which is what left the target rule flush to the plot top reading
            as a border. No ticks: fitted values read as debug output.
          */}
          <YAxis width={1} tick={false} axisLine={false} domain={domain} />

          {/*
            The wedge. `baseValue` is the target, so the fill measures the gap
            rather than the absolute quantity, which is the whole point.
          */}
          {target !== undefined && (
            <Area
              type="linear"
              dataKey={yKey}
              baseValue={target}
              stroke="none"
              fill={wedge}
              fillOpacity={0.16}
              isAnimationActive={false}
            />
          )}

          {target !== undefined && (
            <ReferenceLine
              y={target}
              stroke={theme['color-field-line']}
              strokeWidth={2}
              // Left, not right: the right end is where the endpoint value and
              // its signed distance sit, and two labels on one baseline read as
              // a single string.
              label={{
                value: targetLabel ?? `Target ${target}${suffix}`,
                position: 'insideTopLeft',
                fill: theme['color-ink2'],
                fontSize: 11,
                fontWeight: 500,
                fontFamily: theme['font-sans'],
              }}
            />
          )}

          <ChartTooltip theme={theme} suffix={suffix} />
          <Line
            type="linear"
            dataKey={yKey}
            stroke={theme['color-data-1']}
            strokeWidth={2.5}
            dot={{ r: 3, fill: theme['color-data-1'], stroke: theme['color-data-1'] }}
            activeDot={{ r: 5 }}
            label={endLabel}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

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
  <div className="[&>*+*]:border-t [&>*+*]:border-t-line">
    {rows.map((row) => {
      // Standing is carried by the row's ground, not by a left rule. Same change
      // as `Row`: a 3px edge is the weakest of the status treatments, and mixed in
      // with the accidental ones it read as noise.
      const ground = row.standing === 'lag' ? 'bg-warn-soft' : '';
      return (
        <div
          key={row.key}
          className={`flex items-baseline justify-between gap-3 ${ground} px-4 py-3`}
        >
          <div className="min-w-0">
            <p className={`text-body text-ink ${row.standing === 'lead' ? 'font-medium' : ''}`}>
              {row.label}
            </p>
            {row.detail && <div className="mt-1 text-caption text-ink2">{row.detail}</div>}
          </div>
          {/* Global is comparative: the figure sits at `display`, not at body. */}
          <p className="shrink-0 text-display text-ink">
            {row.value.toFixed(1)}
            {row.suffix && <span className="ml-1 text-body font-medium text-ink2">{row.suffix}</span>}
          </p>
        </div>
      );
    })}
  </div>
);
