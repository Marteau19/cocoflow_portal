/**
 * screens/global/Readiness.tsx
 *
 * Screen 34. Service Point readiness.
 *
 * The worst offender in the audit, and the reason several rules exist. Before this
 * pass it spent 1164px conveying twelve booleans, its largest type was 26px
 * carrying 23 characters against 1251 characters at 13px, and a passing gate and a
 * failing gate were the same row differing by one 13px icon colour. The single
 * thing the screen exists to communicate read weakest.
 *
 * Five bands. Readiness is expressed as gates rather than a score, because a score
 * of 78 invites somebody to round it up and launch, and four named gates with one
 * failing does not.
 *
 * Global is comparative, not dense: three Service Points is a ranking, so the
 * figure sits at `display` on every row rather than as a 13px caption, and a
 * failing gate takes `--warn-soft` as its ground. Ground carries state here, not
 * iconography. DESIGN.md section 11.
 */

import { Section } from '../../blueprint/Section';
import { network, regions, servicePoints } from '../../data/seedData';
import { percent } from '../../lib/format';
import {
  Band,
  BandHead,
  Flag,
  Hero,
  Icon,
  Identifier,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

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
  return { label: 'WAVE 3', when: 'After the gates above are closed' };
};

export const GlobalReadiness = () => {
  const ordered = [...servicePoints].sort((a, b) => b.readiness - a.readiness);
  const ready = ordered.filter((sp) => GATES.every((gate) => gate.passes(sp)));

  // Which gate fails most often across the network. That is where central effort
  // should go, rather than into the lowest-scoring Service Point.
  const failuresByGate = GATES.map((gate) => ({
    gate,
    failing: servicePoints.filter((sp) => !gate.passes(sp)),
  })).sort((a, b) => b.failing.length - a.failing.length);

  const worstGate = failuresByGate[0];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Masthead. The hero is how many could be switched on today.         */}
      {/* ------------------------------------------------------------------ */}
      <Section id="readiness" onDark>
        <Band kind="masthead">
          <Micro className="text-on-band-muted">Rollout</Micro>
          <p className="mt-1 text-h1 text-on-band">Service Point readiness</p>

          <div className="mt-5">
            <Hero
              onBand
              label="Could be switched on today"
              value={`${ready.length} of ${servicePoints.length}`}
              delta={
                ready.length === servicePoints.length
                  ? { text: 'Every gate passes network wide', tone: 'positive' }
                  : {
                      text: `${servicePoints.length - ready.length} blocked on at least one gate`,
                      tone: 'warn',
                    }
              }
              note="All four gates must pass before customers are let in."
            />
          </div>
        </Band>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Rail. Where the central effort should go.                          */}
      {/* ------------------------------------------------------------------ */}
      {worstGate.failing.length > 0 && (
        <Band kind="rail">
          <Flag tone="warn" icon="alert-triangle">
            {`${worstGate.failing.length} of ${servicePoints.length} blocked on the same gate`}
          </Flag>
          <p className="mt-3 max-w-reading text-body text-ink">
            {worstGate.gate.label} is the gate failing most often, at{' '}
            {worstGate.failing.map((sp) => sp.name).join(' and ')}.
          </p>
          <p className="mt-2 max-w-reading text-body text-ink2">
            That makes it a central problem rather than a local one. Fixing it once unblocks more of
            the network than working through the lowest scoring Service Point.
          </p>
        </Band>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Data. Gates per Service Point. A ranking, so it is ranked.          */}
      {/* ------------------------------------------------------------------ */}
      <Band kind="data" flush>
        <div className="px-gutter">
          <BandHead
            eyebrow="Three Service Points, ranked"
            title="Gates"
            action={<Identifier className="text-ink3">{`${GATES.length} gates each`}</Identifier>}
          />
        </div>

        <div className="border-t border-line">
          {ordered.map((sp, index) => {
            const region = regions.find((r) => r.id === sp.regionId);
            const passed = GATES.filter((gate) => gate.passes(sp));
            const allPass = passed.length === GATES.length;
            const wave = waveOf(index);

            return (
              <div key={sp.id} className="border-b border-line last:border-b-0">
                {/*
                  The readiness figure is the content of this screen, so it sits at
                  `display` rather than as a 13px caption on the right, which is
                  where it was.
                */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-surface-sunk px-gutter py-3">
                  <div className="flex min-w-0 items-baseline gap-3">
                    <span className="font-mono text-caption text-ink3">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="text-body font-medium text-ink">{sp.name}</p>
                      <p className="text-caption text-ink2">
                        {region?.name}. {wave.when}.
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-4">
                    <Status tone={allPass ? 'good' : 'warn'} dot>
                      {allPass ? 'READY' : `${GATES.length - passed.length} BLOCKING`}
                    </Status>
                    <Identifier className="text-ink3">{wave.label}</Identifier>
                    <p className="text-display text-ink">{percent(sp.readiness, 0)}</p>
                  </div>
                </div>

                <RowList>
                  {GATES.map((gate) => {
                    const pass = gate.passes(sp);
                    return (
                      <Row
                        key={gate.key}
                        gutter
                        density="global"
                        rule={pass ? 'none' : 'warn'}
                        // Ground carries state. A failing gate and a passing gate
                        // differing only by a 13px icon colour is what made the one
                        // thing this screen exists to say read weakest.
                        className={pass ? '' : 'bg-warn-soft'}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-1 shrink-0 ${pass ? 'text-positive' : 'text-warn'}`}>
                            <Icon name={pass ? 'check' : 'alert-triangle'} />
                          </span>
                          <div className="min-w-0">
                            <p className={`text-body text-ink ${pass ? '' : 'font-medium'}`}>
                              {gate.label}
                            </p>
                            {!pass && (
                              <p className="mt-1 max-w-reading text-caption text-warn">{gate.why}</p>
                            )}
                          </div>
                        </div>
                      </Row>
                    );
                  })}
                </RowList>
              </div>
            );
          })}
        </div>
      </Band>

      {/* ------------------------------------------------------------------ */}
      {/* Closing, dark. Why gates and not a score.                          */}
      {/* ------------------------------------------------------------------ */}
      <Band kind="closing" alt>
        <Micro className="text-on-band-muted">Why gates and not a score</Micro>
        <p className="mt-2 max-w-reading text-body text-on-band opacity-90">
          A readiness score of {percent(ordered[0]?.readiness ?? 0, 0)} invites somebody to round it
          up and launch. Four named gates, one of which is failing, does not. The score is shown
          because it is useful for tracking, not for deciding.
        </p>
        <p className="mt-3 max-w-reading text-caption text-on-band opacity-70">
          Network portal activation is currently {percent(network.adoption.portalActivationPct, 0)},
          which is a ceiling set by the Service Points already switched on rather than by customer
          appetite.
        </p>
      </Band>
    </>
  );
};
