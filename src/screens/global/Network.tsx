/**
 * screens/global/Network.tsx
 *
 * Screen 29. Network overview.
 *
 * Map as hero at desktop width. Below 1024px it degrades to the ranked list
 * rather than being crushed into a phone, which is the rule in DESIGN.md section
 * 5 and also just better: three points on a 360px map tell you nothing.
 *
 * ON THE MAP ITSELF, and this is a real open item rather than a shortcut:
 * there is no base geography in this build. The prototype makes no external
 * calls, so a coastline has to be bundled, and no province outline was supplied
 * in the reference folder. Rather than draw an invented Québec or leave the hero
 * empty, the markers are plotted at their true coordinates on a labelled
 * schematic frame. It is honest about being a schematic, and swapping a real
 * topojson in is contained to `SchematicMap` below.
 */

import { Section } from '../../blueprint/Section';
import { network, regions, servicePoints, territories } from '../../data/seedData';
import { millions, percent } from '../../lib/format';
import {
  Card,
  CardHeader,
  Flag,
  Identifier,
  Kpi,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/* ------------------------------------------------------------------ */
/* The schematic                                                       */
/* ------------------------------------------------------------------ */

/** Bounding box around the territories in the seed data, with a little air. */
const BOUNDS = (() => {
  const lats = territories.map((t) => t.coords[0]);
  const lons = territories.map((t) => t.coords[1]);
  const pad = 1.2;
  return {
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
    minLon: Math.min(...lons) - pad,
    maxLon: Math.max(...lons) + pad,
  };
})();

const VIEW = { width: 720, height: 420 };

/** Equirectangular. Fine at this scale, and it keeps the maths readable. */
const project = ([lat, lon]: [number, number]) => ({
  x: ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * VIEW.width,
  y: ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEW.height,
});

const SchematicMap = () => (
  <div className="relative">
    <svg
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Schematic of Service Point locations across Québec"
    >
      {/* Graticule. Hairlines only, no fill, so it reads as a drawing. */}
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line
          key={`v${fraction}`}
          x1={VIEW.width * fraction}
          y1={0}
          x2={VIEW.width * fraction}
          y2={VIEW.height}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
      ))}
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line
          key={`h${fraction}`}
          x1={0}
          y1={VIEW.height * fraction}
          x2={VIEW.width}
          y2={VIEW.height * fraction}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
      ))}

      {/* Region centroids, as an outlined anchor behind their Service Points. */}
      {regions.map((region) => {
        const { x, y } = project(region.coords);
        return (
          <g key={region.id}>
            <circle
              cx={x}
              cy={y}
              r={46}
              fill="none"
              stroke="var(--color-line-strong)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <text
              x={x}
              y={y - 54}
              textAnchor="middle"
              fill="var(--color-ink3)"
              fontSize={11}
              letterSpacing="1"
              fontFamily="var(--font-sans)"
            >
              {region.name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Service Points. A square marker, not a status dot. */}
      {territories.map((territory) => {
        const sp = servicePoints.find((s) => s.territoryId === territory.id);
        if (!sp) return null;
        const { x, y } = project(territory.coords);
        const above = sp.servicePct >= network.serviceTargetPct;

        return (
          <g key={territory.id}>
            <rect
              x={x - 5}
              y={y - 5}
              width={10}
              height={10}
              // Above target is a positive outcome, not the primary action, so
              // it is the positive token. Under the new brand the accent is
              // orange, and an orange marker for "doing well" reads as a warning.
              fill={above ? 'var(--color-positive)' : 'var(--color-surface)'}
              stroke={above ? 'var(--color-positive)' : 'var(--color-ink2)'}
              strokeWidth={1.5}
            />
            <text
              x={x + 12}
              y={y - 2}
              fill="var(--color-ink)"
              fontSize={14}
              fontWeight={500}
              fontFamily="var(--font-sans)"
            >
              {sp.name}
            </text>
            <text
              x={x + 12}
              y={y + 14}
              fill="var(--color-ink2)"
              fontSize={12}
              fontFamily="var(--font-sans)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {percent(sp.servicePct)} service, {millions(sp.revenue)}
            </text>
          </g>
        );
      })}
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */

export const GlobalNetwork = () => {
  const target = network.serviceTargetPct;
  const totalRevenue = servicePoints.reduce((sum, sp) => sum + sp.revenue, 0);
  const totalContracts = servicePoints.reduce((sum, sp) => sum + sp.activeContracts, 0);
  const openCases = servicePoints.reduce((sum, sp) => sum + sp.openCases, 0);
  const ranked = [...servicePoints].sort((a, b) => b.revenue - a.revenue);

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Network"
          title="Network overview"
          lead={`${servicePoints.length} Service Points across ${regions.length} regions.`}
        />

        <Section id="network-map">
          <Stack gap="4">
            <Card>
              <div className="grid gap-4 border-b border-line px-4 py-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
                <Kpi
                  label="Network revenue"
                  value={millions(totalRevenue)}
                  note="Year to date, all regions"
                />
                <Kpi label="Service share" value={percent(network.currentServicePct)} note={`Target ${target}%`} />
                <Kpi label="Care plans" value={totalContracts.toLocaleString('en-CA')} />
                <Kpi label="Open cases" value={String(openCases)} />
              </div>

              {/* Hero at desktop, hidden below 1024px. */}
              <div className="hidden px-4 py-4 lg:block">
                <div className="flex items-baseline justify-between gap-3">
                  <Micro>Where the network is</Micro>
                  <Identifier className="text-ink3">schematic</Identifier>
                </div>
                <div className="mt-3 rounded-card border border-line bg-surface p-3">
                  <SchematicMap />
                </div>
                <div className="mt-3">
                  <Flag tone="warn" icon="alert-triangle">
                    Base geography not yet supplied
                  </Flag>
                  <p className="mt-2 text-caption text-ink2">
                    Markers sit at their true coordinates, but there is no province outline behind
                    them: the prototype makes no external calls, so a boundary file has to be bundled
                    and none was supplied. Drawing an invented Québec would look finished and be
                    wrong.
                  </p>
                </div>
              </div>
            </Card>

            {/* The list is the map's replacement below 1024px, and useful above it. */}
            <Card>
              <CardHeader
                title="Service Points"
                eyebrow="By revenue"
                action={<Identifier className="text-ink3">{`${ranked.length} points`}</Identifier>}
              />
              <RowList>
                {ranked.map((sp) => {
                  const region = regions.find((r) => r.id === sp.regionId);
                  const above = sp.servicePct >= target;
                  const onTarget = sp.revenue >= sp.target;
                  return (
                    <Row key={sp.id} tone={above ? 'strong' : 'warn'} to={`/network/${sp.regionId}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <p className="text-body text-ink">{sp.name}</p>
                            {/*
                              Named explicitly. Two different targets are in play
                              on this row, service mix and revenue, and a bare
                              "above target" beside "behind" reads as a
                              contradiction rather than as two measures.
                            */}
                            <Status tone={above ? 'good' : 'warn'}>
                              {above ? 'MIX ABOVE TARGET' : 'MIX BELOW TARGET'}
                            </Status>
                          </div>
                          <p className="mt-1 text-caption text-ink2">
                            {region?.name}. {sp.activeContracts.toLocaleString('en-CA')} care plans,{' '}
                            {sp.openCases} open {sp.openCases === 1 ? 'case' : 'cases'}, rated{' '}
                            {sp.rating.toFixed(1)}.
                          </p>
                          <p className="mt-1 text-caption text-ink3">
                            Revenue {millions(sp.revenue)} of {millions(sp.target)}
                            {onTarget ? ', ahead' : ', behind'}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-body font-medium text-ink">{percent(sp.servicePct)}</p>
                          <p className="text-caption text-ink2">service</p>
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
            </Card>

            <Card>
              <CardHeader title="Regions" eyebrow="Drill in" />
              <RowList>
                {regions.map((region) => (
                  <Row key={region.id} to={`/network/${region.id}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-body text-ink">{region.name}</p>
                        <p className="text-caption text-ink2">
                          {region.group}, {region.currency}.{' '}
                          {region.servicePointIds.length} Service{' '}
                          {region.servicePointIds.length === 1 ? 'Point' : 'Points'}.
                        </p>
                      </div>
                      <Identifier className="shrink-0 text-ink3">{region.id}</Identifier>
                    </div>
                  </Row>
                ))}
              </RowList>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
