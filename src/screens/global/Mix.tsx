/**
 * screens/global/Mix.tsx
 *
 * Screen 31. Hero.
 *
 * Service revenue share against the 35 percent target, at network, region and
 * Service Point level.
 *
 * The ranking is built around the target line rather than as a league table. A
 * plain descending list answers "who is biggest"; this screen has to answer "who
 * is above the line and who is behind", because that is the question the strategy
 * turns on.
 */

import { Section } from '../../blueprint/Section';
import { network, regions, servicePoints } from '../../data/seedData';
import { millions, percent } from '../../lib/format';
import { RankedRows, TrendAgainstTarget } from '../../ui/charts';
import {
  Card,
  CardHeader,
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

export const GlobalMix = () => {
  const target = network.serviceTargetPct;
  const current = network.currentServicePct;
  const gap = target - current;

  /** Service revenue share for a region, weighted by Service Point revenue. */
  const regionShare = (regionId: string): { pct: number; revenue: number } => {
    const points = servicePoints.filter((sp) => sp.regionId === regionId);
    const revenue = points.reduce((sum, sp) => sum + sp.revenue, 0);
    const weighted = points.reduce((sum, sp) => sum + sp.servicePct * sp.revenue, 0);
    return { pct: revenue > 0 ? weighted / revenue : 0, revenue };
  };

  const ranked = [...servicePoints].sort((a, b) => b.servicePct - a.servicePct);
  const leading = ranked.filter((sp) => sp.servicePct >= target);
  const lagging = ranked.filter((sp) => sp.servicePct < target);

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Strategy"
          title="Service revenue mix"
          lead={`Where the network sits against the ${target} percent service revenue target.`}
        />

        <Section id="mix-tracker">
          <Stack gap="4">
            {/* ---------------------------------------------------------- */}
            {/* The headline. One figure, and the distance still to travel. */}
            {/* ---------------------------------------------------------- */}
            <Card>
              <div className="grid gap-4 border-b border-line px-4 py-4 lg:grid-cols-[1.6fr_1fr_1fr]">
                <Kpi
                  label="Network service share"
                  value={percent(current)}
                  note={`${percent(gap)} short of the ${target}% target`}
                />
                <Kpi label="Target" value={percent(target)} note="Strategic plan" />
                <Kpi
                  label="Service Points above the line"
                  value={`${leading.length} of ${servicePoints.length}`}
                  tone={leading.length > lagging.length ? 'accent' : 'ink'}
                />
              </div>

              {/* Trend, with the target as a reference line rather than a series. */}
              <div className="px-4 py-4">
                <Micro>Four periods, against target</Micro>
                <div className="mt-3">
                  <TrendAgainstTarget
                    data={network.history.map((row) => ({ ...row }))}
                    xKey="period"
                    yKey="servicePct"
                    target={target}
                    targetLabel={`${target}%`}
                    suffix="%"
                    height={200}
                  />
                </div>
                <p className="mt-2 text-caption text-ink2">
                  Up {percent(current - network.history[0].servicePct)} since{' '}
                  {network.history[0].period}. On this trajectory the target lands within two further
                  periods.
                </p>
              </div>
            </Card>

            {/* ---------------------------------------------------------- */}
            {/* Around the target line, not a league table.                */}
            {/* ---------------------------------------------------------- */}
            <Card>
              <CardHeader
                title="Service Points, around the target"
                eyebrow="Lead and lag"
                action={<Identifier className="text-ink3">{`target ${target}%`}</Identifier>}
              />

              {leading.length > 0 && (
                <>
                  <div className="border-b border-line bg-surface-sunk px-4 py-2">
                    <Status tone="good">{`AT OR ABOVE ${target}%`}</Status>
                  </div>
                  <RankedRows
                    rows={leading.map((sp) => ({
                      key: sp.id,
                      label: sp.name,
                      value: sp.servicePct,
                      suffix: '%',
                      standing: 'lead' as const,
                      detail: (
                        <>
                          {millions(sp.revenue)} revenue,{' '}
                          {sp.activeContracts.toLocaleString('en-CA')} care plans,{' '}
                          {percent(sp.servicePct - target)} above
                        </>
                      ),
                    }))}
                  />
                </>
              )}

              {lagging.length > 0 && (
                <>
                  <div className="border-y border-line bg-surface-sunk px-4 py-2">
                    <Status tone="warn">{`BELOW ${target}%`}</Status>
                  </div>
                  <RankedRows
                    rows={lagging.map((sp) => ({
                      key: sp.id,
                      label: sp.name,
                      value: sp.servicePct,
                      suffix: '%',
                      standing: 'lag' as const,
                      detail: (
                        <>
                          {millions(sp.revenue)} revenue,{' '}
                          {sp.activeContracts.toLocaleString('en-CA')} care plans,{' '}
                          {percent(target - sp.servicePct)} to close
                        </>
                      ),
                    }))}
                  />
                </>
              )}
            </Card>

            {/* ---------------------------------------------------------- */}
            {/* Region roll up.                                            */}
            {/* ---------------------------------------------------------- */}
            <Card>
              <CardHeader title="By region" eyebrow="Weighted by revenue" />
              <RowList>
                {regions.map((region) => {
                  const share = regionShare(region.id);
                  const above = share.pct >= target;
                  return (
                    <Row
                      key={region.id}
                      rule={above ? 'strong' : 'warn'}
                      to={`/network/${region.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-body text-ink">{region.name}</p>
                          <p className="mt-1 text-caption text-ink2">
                            {region.servicePointIds.length} Service{' '}
                            {region.servicePointIds.length === 1 ? 'Point' : 'Points'},{' '}
                            {millions(share.revenue)} revenue
                          </p>
                          <div className="mt-1">
                            <Status tone={above ? 'good' : 'warn'}>
                              {above ? 'ABOVE TARGET' : 'BELOW TARGET'}
                            </Status>
                          </div>
                        </div>
                        <p className="shrink-0 text-display text-ink">{percent(share.pct)}</p>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
            </Card>

            <p className="text-caption text-ink3">
              Service revenue share is service revenue as a proportion of total revenue. All figures
              are mock.
            </p>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
