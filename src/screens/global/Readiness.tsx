/**
 * screens/global/Readiness.tsx
 *
 * Screen 34. Service Point readiness.
 *
 * How prepared each Service Point is before the portal is switched on for their
 * customers.
 *
 * This screen exists because the fastest way to kill a portal rollout is to
 * launch it somewhere whose data is not ready. A customer who logs in and sees
 * the wrong system, or no service history, does not log in again, and you only
 * get one first impression per household.
 *
 * So readiness is expressed as gates rather than a score. A score of 78 invites
 * a launch decision; four gates with one failing does not.
 */

import { Section } from '../../blueprint/Section';
import { network, regions, servicePoints } from '../../data/seedData';
import { percent } from '../../lib/format';
import {
  Card,
  CardHeader,
  Flag,
  Icon,
  Identifier,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/**
 * The gates. Each one is a thing that must be true before customers are let in,
 * and each derives from the Service Point's own figures rather than a survey.
 */
const GATES = [
  {
    key: 'data',
    label: 'Customer and system records complete',
    why: 'A customer who logs in to find the wrong system does not come back',
    passes: (sp: (typeof servicePoints)[number]) => sp.readiness >= 75,
  },
  {
    key: 'history',
    label: 'Service history migrated',
    why: 'An empty timeline makes the portal look like a form, not a record',
    passes: (sp: (typeof servicePoints)[number]) => sp.readiness >= 70,
  },
  {
    key: 'team',
    label: 'Team trained on the technician app',
    why: 'Visit summaries only exist if the field team closes jobs in the tool',
    passes: (sp: (typeof servicePoints)[number]) => sp.readiness >= 80,
  },
  {
    key: 'response',
    label: 'Message response under one working day',
    why: 'A portal that invites messages and does not answer them is worse than no portal',
    passes: (sp: (typeof servicePoints)[number]) => sp.openCases <= 8,
  },
];

/** Waves are ordered by readiness, so the rollout sequence falls out of it. */
const waveOf = (index: number): { label: string; when: string } => {
  if (index === 0) return { label: 'WAVE 1', when: 'First, as the pilot' };
  if (index === 1) return { label: 'WAVE 2', when: 'Once wave 1 has run a full service cycle' };
  return { label: 'WAVE 3', when: 'After the gates below are closed' };
};

export const GlobalReadiness = () => {
  const ordered = [...servicePoints].sort((a, b) => b.readiness - a.readiness);

  const ready = ordered.filter((sp) => GATES.every((gate) => gate.passes(sp)));

  // Which gate is failing most often across the network. That is where the
  // central effort should go rather than into the lowest-scoring Service Point.
  const failuresByGate = GATES.map((gate) => ({
    gate,
    failing: servicePoints.filter((sp) => !gate.passes(sp)),
  })).sort((a, b) => b.failing.length - a.failing.length);

  const worstGate = failuresByGate[0];

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Rollout"
          title="Service Point readiness"
          lead={`${ready.length} of ${servicePoints.length} Service Points could be switched on today.`}
        />

        <Section id="readiness">
          <Stack gap="4">
            {/* Where the central effort should go. */}
            {worstGate.failing.length > 0 && (
              <Card>
                <div className="px-4 py-3">
                  <Flag tone="warn" icon="alert-triangle">
                    {`${worstGate.failing.length} of ${servicePoints.length} blocked on the same gate`}
                  </Flag>
                  <p className="mt-2 max-w-reading text-body text-ink">
                    {worstGate.gate.label} is the gate failing most often, at{' '}
                    {worstGate.failing.map((sp) => sp.name).join(' and ')}.
                  </p>
                  <p className="mt-2 max-w-reading text-caption text-ink2">
                    That makes it a central problem rather than a local one. Fixing it once unblocks
                    more of the network than working through the lowest scoring Service Point.
                  </p>
                </div>
              </Card>
            )}

            {/* Gates per Service Point. Not a score. */}
            <Card>
              <CardHeader
                title="Gates"
                eyebrow="All four must pass before customers are let in"
                action={<Identifier className="text-ink3">{`${GATES.length} gates`}</Identifier>}
              />
              <div className="divide-y divide-line">
                {ordered.map((sp, index) => {
                  const region = regions.find((r) => r.id === sp.regionId);
                  const passed = GATES.filter((gate) => gate.passes(sp));
                  const allPass = passed.length === GATES.length;
                  const wave = waveOf(index);

                  return (
                    <div key={sp.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 bg-surface-sunk px-4 py-2">
                        <div className="flex min-w-0 flex-wrap items-baseline gap-2">
                          <p className="text-body font-medium text-ink">{sp.name}</p>
                          <span className="text-caption text-ink2">{region?.name}</span>
                        </div>
                        <div className="flex shrink-0 items-baseline gap-3">
                          <Status tone={allPass ? 'good' : 'warn'}>
                            {allPass ? 'READY' : `${GATES.length - passed.length} BLOCKING`}
                          </Status>
                          <Identifier className="text-ink3">{wave.label}</Identifier>
                        </div>
                      </div>

                      <RowList>
                        {GATES.map((gate) => {
                          const pass = gate.passes(sp);
                          return (
                            <Row key={gate.key} rule={pass ? 'none' : 'warn'}>
                              <div className="flex items-start gap-3">
                                <span
                                  className={`mt-1 shrink-0 ${pass ? 'text-positive' : 'text-warn'}`}
                                >
                                  <Icon name={pass ? 'check' : 'alert-triangle'} />
                                </span>
                                <div className="min-w-0">
                                  <p className="text-body text-ink">{gate.label}</p>
                                  {!pass && (
                                    <p className="mt-1 max-w-reading text-caption text-ink2">
                                      {gate.why}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Row>
                          );
                        })}
                      </RowList>

                      <div className="px-4 py-3">
                        <p className="text-caption text-ink3">{wave.when}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* The sequence, stated as a plan rather than left to be inferred. */}
            <Card>
              <CardHeader title="Rollout sequence" eyebrow="Falls out of the gates above" />
              <RowList>
                {ordered.map((sp, index) => {
                  const allPass = GATES.every((gate) => gate.passes(sp));
                  return (
                    <Row key={sp.id} rule={allPass ? 'strong' : 'warn'}>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 shrink-0 font-mono text-caption text-ink3">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-body text-ink">{sp.name}</p>
                            <p className="shrink-0 text-caption text-ink2">
                              {percent(sp.readiness, 0)} ready
                            </p>
                          </div>
                          <p className="mt-1 text-caption text-ink2">
                            {allPass
                              ? 'Every gate passes. Can be switched on when you choose.'
                              : `Blocked on ${GATES.filter((g) => !g.passes(sp))
                                  .map((g) => g.label.toLowerCase())
                                  .join(' and ')}.`}
                          </p>
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
              <div className="border-t border-line px-4 py-3">
                <Micro>Why gates and not a score</Micro>
                <p className="mt-1 max-w-reading text-caption text-ink2">
                  A readiness score of {percent(ordered[0]?.readiness ?? 0, 0)} invites somebody to
                  round it up and launch. Four named gates, one of which is failing, does not. The
                  score is shown because it is useful for tracking, not for deciding.
                </p>
              </div>
            </Card>

            <p className="text-caption text-ink3">
              Network portal activation is currently{' '}
              {percent(network.adoption.portalActivationPct, 0)}, which is a ceiling set by the
              Service Points already switched on rather than by customer appetite.
            </p>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
