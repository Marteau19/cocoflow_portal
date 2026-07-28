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
  Band,
  BandHead,
  Hero,
  Identifier,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

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
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Masthead. The hero: one figure, and the distance still to travel.  */}
      {/* ------------------------------------------------------------------ */}
      <Section id="mix-tracker" onDark>
        <Band kind="masthead">
          <Micro className="text-on-band-muted">Strategy</Micro>
          <p className="mt-1 text-h1 text-on-band">Service revenue mix</p>

          {/*
            The hero is the figure, not the page title. At the full-bleed register
            this is 72px, and it is the only thing on the screen at that step.
            The distance from target sits directly beneath it, signed, because
            "33.1%" alone does not answer the question anyone opened this to ask.
          */}
          <div className="mt-5">
            <Hero
              onBand
              label={`Network share against the ${target} percent target`}
              value={percent(current)}
              delta={{
                text: `${percent(gap)} short of target`,
                tone: current >= target ? 'positive' : 'warn',
              }}
              note="Service revenue as a proportion of everything the network earns."
            />
          </div>

        </Band>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Lead. The chart, full bleed on canvas, no container.               */}
      {/* ------------------------------------------------------------------ */}
      <Band kind="lead">
        <BandHead eyebrow="Four periods" title="Distance from target" />
        {/*
          The target is drawn solid and the wedge between the series and the
          target is filled, so the gap is legible as a quantity with the numbers
          covered. That is the reframe in DESIGN.md section 12: the target is the
          chart, and the series is the distance from it.
        */}
        <TrendAgainstTarget
          data={network.history.map((row) => ({ ...row }))}
          xKey="period"
          yKey="servicePct"
          target={target}
          targetLabel={`Target ${target}%`}
          suffix="%"
          goodSide="above"
        />
        <p className="mt-3 max-w-reading text-body text-ink2">
          Up {percent(current - network.history[0].servicePct)} since{' '}
          {network.history[0].period}. On this trajectory the target lands within two further
          periods.
        </p>
        <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-line pt-4 sm:grid-cols-3">
          <div>
            <Micro>Target</Micro>
            <dd className="mt-1 text-body font-medium text-ink">{percent(target)}</dd>
          </div>
          <div>
            <Micro>Above the line</Micro>
            <dd className="mt-1 text-body font-medium text-ink">
              {leading.length} of {servicePoints.length}
            </dd>
          </div>
          <div>
            <Micro>{`Gained since ${network.history[0].period}`}</Micro>
            <dd className="mt-1 text-body font-medium text-positive">
              {percent(current - network.history[0].servicePct)}
            </dd>
          </div>
        </dl>
      </Band>

            {/* ---------------------------------------------------------- */}
            {/* Around the target line, not a league table.                */}
            {/* ---------------------------------------------------------- */}
            <Band kind="data" flush>
              <BandHead
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
            </Band>

            {/* ---------------------------------------------------------- */}
            {/* Region roll up.                                            */}
            {/* ---------------------------------------------------------- */}
            <Band kind="rail" flush>
              <BandHead title="By region" eyebrow="Weighted by revenue" />
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
            </Band>

      {/*
        Closing, dark. It follows a Rail band, and two consecutive bands may not
        share a ground, so this takes the second dark that section 8 allows.
      */}
      <Band kind="closing" alt>
        <Micro className="text-on-band-muted">How this is measured</Micro>
        <p className="mt-1 max-w-reading text-caption text-on-band opacity-80">
          Service revenue share is service revenue as a proportion of total revenue. All figures are
          mock.
        </p>
      </Band>
    </>
  );
};
