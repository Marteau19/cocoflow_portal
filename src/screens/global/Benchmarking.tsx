/**
 * screens/global/Benchmarking.tsx
 *
 * Screen 33. Benchmarking and alerts.
 *
 * Where a Service Point is out of line with its peers, and worth a conversation.
 *
 * An alert here is not a threshold breach. It is a gap against what the network
 * has already shown is achievable, which is why every alert names the Service
 * Point that is doing it better. "You are below target" starts an argument;
 * "Laurentides is eight points ahead of you on the same size contract base"
 * starts a phone call.
 *
 * Alerts are text and a left rule. Never a coloured dot.
 */

import { Section } from '../../blueprint/Section';
import { network, regions, servicePoints } from '../../data/seedData';
import { millions, percent } from '../../lib/format';
import {
  ButtonLink,
  Card,
  CardHeader,
  Identifier,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
  type RuleTone,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

interface Measure {
  key: string;
  label: string;
  unit: string;
  pick: (sp: (typeof servicePoints)[number]) => number;
  higherIsBetter: boolean;
  /** How far from best-in-network before it is worth a conversation. */
  tolerance: number;
}

const MEASURES: Measure[] = [
  {
    key: 'service',
    label: 'Service revenue share',
    unit: '%',
    pick: (sp) => sp.servicePct,
    higherIsBetter: true,
    tolerance: 4,
  },
  {
    key: 'perkm',
    label: 'Revenue per km',
    unit: '',
    pick: (sp) => sp.revenuePerKm,
    higherIsBetter: true,
    tolerance: 3,
  },
  {
    key: 'rating',
    label: 'Customer rating',
    unit: '',
    pick: (sp) => sp.rating,
    higherIsBetter: true,
    tolerance: 0.25,
  },
  {
    key: 'cases',
    label: 'Open cases',
    unit: '',
    pick: (sp) => sp.openCases,
    higherIsBetter: false,
    tolerance: 4,
  },
  {
    key: 'readiness',
    label: 'Portal readiness',
    unit: '%',
    pick: (sp) => sp.readiness,
    higherIsBetter: true,
    tolerance: 10,
  },
];

export const GlobalBenchmarking = () => {
  /** Best in network for a measure, and who holds it. */
  const bestFor = (measure: Measure) =>
    [...servicePoints].sort((a, b) =>
      measure.higherIsBetter
        ? measure.pick(b) - measure.pick(a)
        : measure.pick(a) - measure.pick(b),
    )[0];

  /**
   * An alert is a gap against what a peer is already achieving, not a threshold
   * breach. Every one names who is doing it better.
   */
  const alerts = MEASURES.flatMap((measure) => {
    const best = bestFor(measure);
    return servicePoints
      .filter((sp) => sp.id !== best.id)
      .map((sp) => {
        const gap = measure.higherIsBetter
          ? measure.pick(best) - measure.pick(sp)
          : measure.pick(sp) - measure.pick(best);
        return { measure, sp, best, gap };
      })
      .filter((alert) => alert.gap >= alert.measure.tolerance);
  }).sort((a, b) => b.gap / b.measure.tolerance - a.gap / a.measure.tolerance);

  const severity = (ratio: number): { tone: 'warn' | 'alert' | 'neutral'; rule: RuleTone; label: string } =>
    ratio >= 2
      ? { tone: 'alert', rule: 'alert', label: 'WORTH A CALL' }
      : { tone: 'warn', rule: 'warn', label: 'WORTH A LOOK' };

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Benchmarking"
          title="Where the network disagrees with itself"
          lead="Every alert below is a gap against something another Service Point is already doing."
        />

        <Section id="benchmarking">
          <Stack gap="4">
            {/* What good looks like, sourced from the network itself. */}
            <Card>
              <CardHeader title="What good looks like" eyebrow="Best in network, per measure" />
              <RowList>
                {MEASURES.map((measure) => {
                  const best = bestFor(measure);
                  const region = regions.find((r) => r.id === best.regionId);
                  return (
                    <Row key={measure.key}>
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-body text-ink">{measure.label}</p>
                          <p className="text-caption text-ink2">
                            {best.name}, {region?.name}
                          </p>
                        </div>
                        <p className="shrink-0 text-h2 text-ink">
                          {measure.pick(best).toFixed(1)}
                          {measure.unit && (
                            <span className="text-caption text-ink2">{measure.unit}</span>
                          )}
                        </p>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
              <div className="border-t border-line px-4 py-3">
                <p className="text-caption text-ink2">
                  These are not targets set centrally. They are what a Service Point in this network
                  is achieving right now, which is what makes them hard to argue with.
                </p>
              </div>
            </Card>

            {/* The alerts. Text and a left rule. */}
            <Card>
              <CardHeader
                title="Alerts"
                eyebrow={alerts.length === 0 ? 'Nothing out of line' : `${alerts.length} worth raising`}
                action={<Identifier className="text-ink3">{`${servicePoints.length} points`}</Identifier>}
              />

              {alerts.length === 0 ? (
                <div className="px-4 py-6">
                  <p className="text-body text-ink2">
                    No Service Point is far enough from its peers to be worth a conversation.
                  </p>
                </div>
              ) : (
                <RowList>
                  {alerts.map((alert) => {
                    const ratio = alert.gap / alert.measure.tolerance;
                    const level = severity(ratio);
                    return (
                      <Row
                        key={`${alert.measure.key}-${alert.sp.id}`}
                        rule={level.rule}
                        to={`/network/${alert.sp.regionId}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <p className="text-body text-ink">{alert.sp.name}</p>
                              <Status tone={level.tone}>{level.label}</Status>
                            </div>

                            <p className="mt-1 max-w-reading text-caption text-ink2">
                              {alert.measure.label} is{' '}
                              {alert.gap.toFixed(1)}
                              {alert.measure.unit} {alert.measure.higherIsBetter ? 'behind' : 'above'}{' '}
                              {alert.best.name}, on{' '}
                              {millions(alert.sp.revenue)} of revenue against{' '}
                              {millions(alert.best.revenue)}.
                            </p>

                            {/* What the alert implies, not just that it fired. */}
                            <p className="mt-2 max-w-reading text-caption text-ink">
                              {alert.measure.key === 'service' &&
                                'The contract base is comparable, so this is an attach rate question rather than a demand one.'}
                              {alert.measure.key === 'perkm' &&
                                'Either the territory is being covered inefficiently or the job mix skews to low value work.'}
                              {alert.measure.key === 'rating' &&
                                'Worth reading the recent cases before assuming it is a scheduling problem.'}
                              {alert.measure.key === 'cases' &&
                                'Open cases at this level usually mean response time, not volume.'}
                              {alert.measure.key === 'readiness' &&
                                'Portal adoption cannot move here until the underlying data is cleaned up.'}
                            </p>
                          </div>
                        </div>
                      </Row>
                    );
                  })}
                </RowList>
              )}
            </Card>

            {/* The comparison table behind the alerts. */}
            <Card>
              <CardHeader title="All measures" eyebrow="Every Service Point" />
              <div className="hidden border-b border-line bg-surface-sunk px-4 py-2 md:grid md:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))] md:gap-3">
                <Micro>Service Point</Micro>
                {MEASURES.map((m) => (
                  <div key={m.key} className="text-right">
                    <Micro>{m.label}</Micro>
                  </div>
                ))}
              </div>
              <RowList>
                {servicePoints.map((sp) => (
                  <Row key={sp.id}>
                    <div className="md:grid md:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))] md:items-baseline md:gap-3">
                      <p className="text-body text-ink">{sp.name}</p>
                      <div className="mt-2 grid grid-cols-3 gap-3 md:contents">
                        {MEASURES.map((m) => {
                          const best = bestFor(m);
                          const isBest = best.id === sp.id;
                          return (
                            <div key={m.key} className="md:text-right">
                              <div className="md:hidden">
                                <Micro>{m.label}</Micro>
                              </div>
                              <p
                                className={`text-h2 ${isBest ? 'text-accent-ink' : 'text-ink'}`}
                              >
                                {m.pick(sp).toFixed(1)}
                                {m.unit && <span className="text-caption text-ink2">{m.unit}</span>}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-4 py-3">
                <p className="text-caption text-ink2">
                  Best in network shown in the accent colour. Network service share is currently{' '}
                  {percent(network.currentServicePct)} against a {network.serviceTargetPct} percent
                  target.
                </p>
              </div>
            </Card>

            <ButtonLink to="/mix" variant="quiet" icon="chevron-right">
              See the mix tracker
            </ButtonLink>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
