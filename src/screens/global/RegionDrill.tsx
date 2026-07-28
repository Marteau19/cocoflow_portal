/**
 * screens/global/RegionDrill.tsx
 *
 * Screen 30. Region and Service Point drill.
 *
 * One region, its Service Points, and how they compare.
 *
 * Comparison is the whole job of this screen, so every figure carries the
 * region average beside it. A Service Point at 33.4 percent means nothing on its
 * own; 33.4 against a region running 31.0 is a conversation.
 */

import { useParams } from 'react-router-dom';
import { Section } from '../../blueprint/Section';
import { byId, network, regions, resources, servicePoints, territories } from '../../data/seedData';
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
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/** A measure, with the region average to read it against. */
const Compare = ({
  label,
  value,
  average,
  suffix = '',
  higherIsBetter = true,
}: {
  label: string;
  value: number;
  average: number;
  suffix?: string;
  higherIsBetter?: boolean;
}) => {
  const delta = value - average;
  const good = higherIsBetter ? delta >= 0 : delta <= 0;
  const meaningful = Math.abs(delta) >= 0.05;

  return (
    <div>
      <Micro>{label}</Micro>
      <p className="mt-1 text-body font-medium text-ink">
        {value.toFixed(1)}
        {suffix}
      </p>
      <p className={`mt-1 text-caption ${meaningful ? (good ? 'text-positive' : 'text-warn') : 'text-ink3'}`}>
        {meaningful
          ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}${suffix} against region`
          : 'At the region average'}
      </p>
    </div>
  );
};

export const GlobalRegionDrill = () => {
  const { regionId } = useParams();
  const region = byId(regions, regionId ?? '') ?? regions[0];

  const points = servicePoints.filter((sp) => sp.regionId === region.id);
  const target = network.serviceTargetPct;

  const revenue = points.reduce((sum, sp) => sum + sp.revenue, 0);
  const revenueTarget = points.reduce((sum, sp) => sum + sp.target, 0);
  const contracts = points.reduce((sum, sp) => sum + sp.activeContracts, 0);

  // Region service share, weighted by revenue rather than averaged flat.
  const share = revenue > 0 ? points.reduce((s, sp) => s + sp.servicePct * sp.revenue, 0) / revenue : 0;

  const avg = (pick: (sp: (typeof points)[number]) => number) =>
    points.length > 0 ? points.reduce((s, sp) => s + pick(sp), 0) / points.length : 0;

  const avgRating = avg((sp) => sp.rating);
  const avgPerKm = avg((sp) => sp.revenuePerKm);
  const avgReadiness = avg((sp) => sp.readiness);

  const ranked = [...points].sort((a, b) => b.servicePct - a.servicePct);

  return (
    <ScreenBody>
      <Stack gap="4">
        <div>
          <ButtonLink to="/network" variant="plain" icon="chevron-right">
            Back to the network
          </ButtonLink>
          <div className="mt-2">
            <PageHead
              eyebrow={`${region.group}, ${region.currency}`}
              title={region.name}
              lead={`${points.length} Service ${points.length === 1 ? 'Point' : 'Points'}, ${millions(revenue)} revenue.`}
            />
          </div>
        </div>

        <Section id="region-drill">
          <Stack gap="4">
            <Card>
              <div className="grid gap-5 border-b border-line px-4 py-5 lg:grid-cols-[1.8fr_1fr]">
                <div>
                  <Micro>Region service revenue share</Micro>
                  <p className="mt-2 text-display text-ink">{percent(share)}</p>
                  <p className="mt-2 max-w-reading text-body text-ink2">
                    {share >= target
                      ? `${percent(share - target)} above the ${target} percent target.`
                      : `${percent(target - share)} short of the ${target} percent target.`}{' '}
                    Weighted by revenue, so the larger Service Points count for more.
                  </p>
                </div>
                <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line lg:border-l lg:border-t-0 lg:pl-4">
                  <div className="flex items-baseline justify-between gap-3 py-3 lg:pt-0">
                    <dt className="text-caption text-ink2">Revenue</dt>
                    <dd className="text-body font-medium text-ink">{millions(revenue)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 py-3">
                    <dt className="text-caption text-ink2">Against target</dt>
                    <dd className="text-body font-medium text-ink">{millions(revenueTarget)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 py-3 lg:pb-0">
                    <dt className="text-caption text-ink2">Care plans</dt>
                    <dd className="text-body font-medium text-ink">{contracts.toLocaleString('en-CA')}</dd>
                  </div>
                </dl>
              </div>

              <div className="px-4 py-3">
                <p className="text-caption text-ink2">
                  Led by {region.leaders.join(' and ')}.
                </p>
              </div>
            </Card>

            {/* Each Service Point, always against the region average. */}
            <Card>
              <CardHeader
                title="Service Points"
                eyebrow="Each figure against the region average"
                action={<Identifier className="text-ink3">{`region ${percent(share)}`}</Identifier>}
              />
              <RowList>
                {ranked.map((sp) => {
                  const territory = byId(territories, sp.territoryId);
                  const team = resources.filter((r) => r.territoryId === sp.territoryId);
                  const above = sp.servicePct >= target;

                  return (
                    <Row key={sp.id} tone={above ? 'strong' : 'warn'}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-body text-ink">{sp.name}</p>
                          <p className="text-caption text-ink2">
                            {territory?.name}, {territory?.radiusKm} km radius, {team.length} in the
                            field
                          </p>
                        </div>
                        <Status tone={above ? 'good' : 'warn'}>
                          {above ? 'MIX ABOVE TARGET' : 'MIX BELOW TARGET'}
                        </Status>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Compare
                          label="Service share"
                          value={sp.servicePct}
                          average={share}
                          suffix="%"
                        />
                        <Compare
                          label="Revenue per km"
                          value={sp.revenuePerKm}
                          average={avgPerKm}
                        />
                        <Compare label="Rating" value={sp.rating} average={avgRating} />
                        <Compare
                          label="Readiness"
                          value={sp.readiness}
                          average={avgReadiness}
                          suffix="%"
                        />
                      </div>

                      <p className="mt-3 text-caption text-ink3">
                        {millions(sp.revenue)} of {millions(sp.target)} revenue target,{' '}
                        {sp.activeContracts.toLocaleString('en-CA')} care plans, {sp.openCases} open{' '}
                        {sp.openCases === 1 ? 'case' : 'cases'}
                      </p>
                    </Row>
                  );
                })}
              </RowList>
            </Card>

            <Card>
              <CardHeader title="Where to look next" eyebrow="From these figures" />
              <RowList>
                {ranked
                  .filter((sp) => sp.servicePct < target)
                  .map((sp) => (
                    <Row key={sp.id} tone="warn">
                      <p className="text-body text-ink">{sp.name}</p>
                      <p className="mt-1 max-w-reading text-caption text-ink2">
                        {percent(target - sp.servicePct)} of service share to find.{' '}
                        {sp.activeContracts.toLocaleString('en-CA')} care plans on{' '}
                        {millions(sp.revenue)} of revenue suggests the contract base is there and the
                        attach rate is not.
                      </p>
                    </Row>
                  ))}
                {ranked.every((sp) => sp.servicePct >= target) && (
                  <Row>
                    <p className="text-body text-ink2">
                      Every Service Point in this region is at or above the target.
                    </p>
                  </Row>
                )}
              </RowList>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
