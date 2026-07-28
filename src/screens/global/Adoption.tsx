/**
 * screens/global/Adoption.tsx
 *
 * Screen 32. Digital adoption and Flo analytics.
 *
 * These are the digital measures the VP Numeric Strategy is accountable for,
 * which is why they get their own screen rather than a corner of the network
 * dashboard.
 *
 * The unanswered-questions figure is the most useful number here and the one an
 * adoption dashboard usually omits. A portal that quietly fails to answer people
 * looks healthy right up until it does not, so the gap is reported as a headline
 * rather than buried.
 */

import { Section } from '../../blueprint/Section';
import { knowledgeBase, network, servicePoints } from '../../data/seedData';
import { percent } from '../../lib/format';
import {
  Band,
  BandHead,
  Icon,
  Identifier,
  Kpi,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/** A funnel read as steps, not a progress bar. Bars are banned. */
const FUNNEL = [
  {
    key: 'activation',
    label: 'Portal activation',
    value: network.adoption.portalActivationPct,
    of: 'of customers with a system have activated an account',
  },
  {
    key: 'booking',
    label: 'Self-serve booking',
    value: network.adoption.selfServeBookingPct,
    of: 'of visits are booked by the customer rather than by phone',
  },
  {
    key: 'attach',
    label: 'E-commerce attach',
    value: network.adoption.ecommerceAttachPct,
    of: 'of activated customers have ordered a part through the portal',
  },
];

/**
 * The questions Flo could not ground. Derived from the network figure rather
 * than invented, so the count on screen matches the KPI above it.
 */
const unansweredCount = Math.round(
  (network.adoption.floQueries30d * network.adoption.floUnansweredPct) / 100,
);

const GAPS = [
  { theme: 'Pricing and trade-in allowances', share: 34 },
  { theme: 'Warranty edge cases', share: 26 },
  { theme: 'Municipal permit variation by region', share: 22 },
  { theme: 'Competitor system compatibility', share: 18 },
];

export const GlobalAdoption = () => {
  const adoption = network.adoption;

  // Readiness is the leading indicator for activation: a Service Point cannot
  // drive portal use before its own data is in order.
  const readiness = [...servicePoints].sort((a, b) => b.readiness - a.readiness);
  const averageReadiness = Math.round(
    readiness.reduce((sum, sp) => sum + sp.readiness, 0) / readiness.length,
  );

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow="Digital strategy"
          subject="Adoption and Flo"
          lead="What the portal is actually being used for, and where it is falling short."
        />

        {/* ---------------------------------------------------------------- */}
        <Section id="adoption">
          <div className="contents">
            <Band kind="data" flush>
              <div className="grid gap-4 border-b border-line px-gutter py-4 lg:grid-cols-[1.6fr_1fr_1fr]">
                <Kpi
                  label="Portal activation"
                  value={percent(adoption.portalActivationPct, 0)}
                  note="Of customers with an installed system"
                />
                <Kpi
                  label="Self-serve booking"
                  value={percent(adoption.selfServeBookingPct, 0)}
                  note="Of all visits booked"
                />
                <Kpi
                  label="Average readiness"
                  value={percent(averageReadiness, 0)}
                  note="Across Service Points"
                />
              </div>

              {/* Steps down the funnel, as rows with a numeric value. */}
              <RowList>
                {FUNNEL.map((step, index) => (
                  <Row gutter key={step.key} tone={index === 0 ? 'strong' : 'neutral'}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-body text-ink">{step.label}</p>
                        <p className="mt-1 text-caption text-ink2">{step.of}</p>
                      </div>
                      <p className="shrink-0 text-display text-ink">{percent(step.value, 0)}</p>
                    </div>
                  </Row>
                ))}
              </RowList>

              <div className="border-t border-line px-gutter py-3">
                <p className="text-caption text-ink2">
                  The drop from activation to booking is the number to move. A customer who activates
                  and then still phones has not been given a reason to return.
                </p>
              </div>
            </Band>

            {/* Readiness, because it gates everything above. */}
            <Band kind="rail" flush>
              <BandHead
                title="Readiness by Service Point"
                eyebrow="Leading indicator"
                action={<Identifier className="text-ink3">{`${readiness.length} points`}</Identifier>}
              />
              <RowList>
                {readiness.map((sp) => (
                  <Row gutter key={sp.id} tone={sp.readiness >= 80 ? 'strong' : 'warn'}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-body text-ink">{sp.name}</p>
                        <p className="mt-1">
                          <Status tone={sp.readiness >= 80 ? 'good' : 'warn'}>
                            {sp.readiness >= 80 ? 'READY' : 'NOT READY'}
                          </Status>
                        </p>
                      </div>
                      <p className="shrink-0 text-body font-medium text-ink">{percent(sp.readiness, 0)}</p>
                    </div>
                  </Row>
                ))}
              </RowList>
            </Band>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section id="flo-analytics">
          <div className="contents">
            <Band kind="data" flush>
              <div className="grid gap-4 border-b border-line px-gutter py-4 lg:grid-cols-[1.6fr_1fr_1fr]">
                <Kpi
                  label="Questions asked, 30 days"
                  value={adoption.floQueries30d.toLocaleString('en-CA')}
                  note="Across technicians and managers"
                />
                <Kpi
                  label="Could not be answered"
                  value={percent(adoption.floUnansweredPct, 0)}
                  note={`${unansweredCount} questions`}
                />
                <Kpi label="Documents indexed" value={String(knowledgeBase.length)} />
              </div>

              <div className="px-gutter py-3">
                <p className="flex items-start gap-2 text-caption text-ink2">
                  <span className="mt-1 shrink-0">
                    <Icon name="info" />
                  </span>
                  <span>
                    Flo answers only from indexed documents and cites them. An unanswered question is
                    therefore a content gap rather than a model failure, which is what makes this
                    number actionable.
                  </span>
                </p>
              </div>
            </Band>

            <Band kind="rail" flush>
              <BandHead
                title="What Flo could not answer"
                eyebrow={`${unansweredCount} questions, grouped`}
              />
              <RowList>
                {GAPS.map((gap) => (
                  <Row gutter key={gap.theme} tone="warn">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-body text-ink">{gap.theme}</p>
                        <p className="mt-1 text-caption text-ink2">
                          {Math.round((unansweredCount * gap.share) / 100)} questions
                        </p>
                      </div>
                      <p className="shrink-0 text-body font-medium text-ink">{percent(gap.share, 0)}</p>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                <Micro>What this implies</Micro>
                <p className="mt-1 text-caption text-ink2">
                  Each theme is a document that does not exist yet. Writing the top two would close
                  three fifths of the gap without touching the model.
                </p>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
