/**
 * screens/manager/Team.tsx
 *
 * Screen 27. Team and capacity.
 *
 * Who is available, what they are qualified for, and where the week is tight.
 *
 * The useful question is not "how busy is everyone" but "where is the
 * constraint", and those have different answers. A team can be at sixty percent
 * utilisation and still unable to take a job, because the one person qualified
 * to do it is already out. This screen names the constraint rather than
 * averaging it away.
 *
 * Capacity is shown as booked against available in numbers. No progress bars.
 */

import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  byId,
  resources,
  territories,
  workOrders,
  workOrdersForResource,
} from '../../data/seedData';
import { TODAY, duration, shortDate } from '../../lib/format';
import {
  Avatar,
  Band,
  BandHead,
  Flag,
  Icon,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

/** A nominal working day, in minutes. Travel is excluded, as on dispatch. */
const DAY_MINUTES = 8 * 60;

/**
 * Qualifications. Not in seedData because it is a people-management concern
 * rather than a service record, but it is exactly the kind of field that would
 * need a home before this ships.
 */
const QUALIFIED: Record<string, string[]> = {
  'RES-001': ['Filter media replacement', 'Confined space', 'Electrical, basic'],
  'RES-002': ['Filter media replacement', 'Confined space'],
  'RES-004': ['Installation', 'Excavation'],
};

/** Known absence, for the constraint calculation. */
const AWAY: Record<string, { from: string; to: string; reason: string }> = {
  'RES-002': { from: '2026-08-17', to: '2026-08-21', reason: 'Annual leave' },
};

export const ManagerTeam = () => {
  const territory = byId(territories, GOLDEN.territoryId)!;
  const team = resources.filter((r) => r.territoryId === territory.id && r.role !== 'manager');

  const upcoming = workOrders.filter(
    (w) => w.territoryId === territory.id && w.status !== 'complete',
  );

  // The constraint: who alone holds a qualification that upcoming work needs.
  const confinedSpace = team.filter((p) => QUALIFIED[p.id]?.includes('Confined space'));
  const awayNext = confinedSpace.filter((p) => AWAY[p.id]);
  const constrained = confinedSpace.length - awayNext.length <= 1;

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={territory.name}
          subject="Team and capacity"
          lead={`${team.length} in the field. ${upcoming.length} jobs still to run.`}
        />

        <Section id="team">
          <div className="contents">
            {/* The constraint, named. Not an average. */}
            {constrained && (
              <Band kind="data" flush>
                <div className="px-gutter py-3">
                  <Flag tone="warn" icon="alert-triangle">
                    One qualification is a single point of failure
                  </Flag>
                  <p className="mt-2 max-w-reading text-body text-ink">
                    {awayNext.length > 0 && (
                      <>
                        {awayNext[0].name} is away{' '}
                        {shortDate(AWAY[awayNext[0].id].from)} to{' '}
                        {shortDate(AWAY[awayNext[0].id].to)}.{' '}
                      </>
                    )}
                    That leaves one technician qualified for confined space work. Any job needing it
                    that week has no fallback if they are sick.
                  </p>
                  <p className="mt-2 text-caption text-ink2">
                    Utilisation looks comfortable that week. The constraint is a qualification, not
                    hours.
                  </p>
                </div>
              </Band>
            )}

            {/* Each person, with load and what they can do. */}
            <Band kind="rail" flush>
              <BandHead title="The team" eyebrow="Load today, and qualifications" />
              <RowList>
                {team.map((person) => {
                  const jobs = workOrdersForResource(person.id, TODAY);
                  const load = jobs.reduce((sum, j) => sum + j.durationMin, 0);
                  const free = DAY_MINUTES - load;
                  const away = AWAY[person.id];
                  const quals = QUALIFIED[person.id] ?? [];

                  return (
                    <Row key={person.id} tone={away ? 'warn' : 'neutral'}>
                      <div className="flex items-start gap-3">
                        <Avatar
                          name={person.name}
                          initials={person.initials}
                          photo={person.photo}
                          size="lg"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-body text-ink">{person.name}</p>
                            <p className="shrink-0 text-caption text-ink2">
                              {person.role === 'installer' ? 'Installer' : 'Technician'}
                            </p>
                          </div>

                          {/* Load as numbers, never a bar. */}
                          <div className="mt-2 flex flex-wrap items-baseline gap-4">
                            <div>
                              <Micro>Booked today</Micro>
                              <p className="mt-1 text-body font-medium text-ink">{duration(load)}</p>
                            </div>
                            <div>
                              <Micro>Free</Micro>
                              <p className="mt-1 text-body font-medium text-ink">
                                {free > 0 ? duration(free) : 'None'}
                              </p>
                            </div>
                            <div>
                              <Micro>Rating</Micro>
                              <p className="mt-1 text-body font-medium text-ink">
                                {person.rating > 0 ? person.rating.toFixed(1) : 'n/a'}
                              </p>
                            </div>
                          </div>

                          {quals.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {quals.map((qual) => (
                                <span
                                  key={qual}
                                  className="rounded-pill border border-line px-2 py-1 text-caption text-ink2"
                                >
                                  {qual}
                                </span>
                              ))}
                            </div>
                          )}

                          {away && (
                            <p className="mt-2 flex items-start gap-2 text-caption text-warn">
                              <span className="mt-1 shrink-0">
                                <Icon name="calendar" />
                              </span>
                              <span>
                                {away.reason}, {shortDate(away.from)} to {shortDate(away.to)}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
            </Band>

            {/* What the absence actually costs, in committed work. */}
            <Band kind="data" flush>
              <BandHead title="Committed work at risk" eyebrow="During the absence" />
              <RowList>
                {upcoming.length === 0 ? (
                  <Row>
                    <p className="text-body text-ink2">Nothing committed in that window.</p>
                  </Row>
                ) : (
                  upcoming.map((job) => {
                    const person = byId(resources, job.resourceId);
                    const away = AWAY[job.resourceId];
                    const atRisk =
                      away && job.scheduledFor >= away.from && job.scheduledFor <= away.to;

                    return (
                      <Row key={job.id} tone={atRisk ? 'warn' : 'none'}>
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-body text-ink">
                              {shortDate(job.scheduledFor)}, {person?.name}
                            </p>
                            <p className="text-caption text-ink2">
                              {atRisk
                                ? 'Falls inside the absence. Needs reassigning.'
                                : 'Outside the absence window.'}
                            </p>
                          </div>
                          <Status tone={atRisk ? 'warn' : 'neutral'}>
                            {atRisk ? 'REASSIGN' : 'FINE'}
                          </Status>
                        </div>
                      </Row>
                    );
                  })
                )}
              </RowList>
            </Band>

            {/*
              The qualifications and absence gap moved to the `team` annotation's
              openDecision, which was null. This is the one leak in the sweep that
              was not already recorded somewhere, so it is a move rather than a
              delete.
            */}
          </div>
        </Section>
      </div>
    </>
  );
};
