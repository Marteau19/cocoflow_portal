/**
 * screens/technician/Route.tsx
 *
 * Screen 18. Route and schedule.
 *
 * The day as a sequence of stops with travel between them.
 *
 * The map degrades to a list below 1024px, which on this screen means it is
 * almost always a list: the technician is on a phone. That is the right default
 * anyway. What a technician needs at the wheel is the next address and the drive
 * time, not a picture of the county.
 *
 * As on the network overview, there is no base geography bundled, so the map
 * that does appear at desktop width is a labelled schematic and says so.
 */

import { Section } from '../../blueprint/Section';
import {
  accounts,
  byId,
  territories,
  workOrdersForResource,
  type WorkOrder,
} from '../../data/seedData';
import { TODAY, dayAndDate, duration, window as timeWindow } from '../../lib/format';
import {
  Card,
  CardHeader,
  Icon,
  Identifier,
  Micro,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

const ME = 'RES-001';

/**
 * Drive time between stops. Derived from the gap between the end of one window
 * and the start of the next, so it moves when the schedule moves rather than
 * being a stored guess.
 */
const minutesBetween = (a: WorkOrder, b: WorkOrder): number => {
  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  return Math.max(0, toMinutes(b.windowStart) - toMinutes(a.windowEnd));
};

const STATUS_LABEL: Record<WorkOrder['status'], string> = {
  booked: 'BOOKED',
  confirmed: 'CONFIRMED',
  'on-the-way': 'ON THE WAY',
  'in-progress': 'IN PROGRESS',
  complete: 'COMPLETE',
};

export const TechnicianRoute = () => {
  const jobs = workOrdersForResource(ME, TODAY).sort((a, b) =>
    a.windowStart.localeCompare(b.windowStart),
  );

  const totalWork = jobs.reduce((sum, j) => sum + j.durationMin, 0);
  const totalTravel = jobs.reduce(
    (sum, job, index) => (index === 0 ? sum : sum + minutesBetween(jobs[index - 1], job)),
    0,
  );

  return (
    <ScreenBody>
      <Stack gap="3">
        <header>
          <Micro>{dayAndDate(TODAY)}</Micro>
          <h1 className="mt-1 text-h1 text-ink">Route</h1>
          <p className="mt-1 text-caption text-ink2">
            {jobs.length} stops, {duration(totalWork)} of work, {duration(totalTravel)} between
          </p>
        </header>

        {/* Offline first, as on every technician screen. */}
        <div className="flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-2">
          <span className="text-positive">
            <Icon name="check" />
          </span>
          <p className="text-caption text-ink2">
            Your route is on the device. It stays readable with no signal.
          </p>
        </div>

        <Section id="route">
          <Stack gap="3">
            {/* The list is the primary register here, not a fallback. */}
            <Card>
              <CardHeader title="Stops in order" eyebrow="Earliest first" />
              <div>
                {jobs.map((job, index) => {
                  const account = byId(accounts, job.accountId)!;
                  const travel = index === 0 ? null : minutesBetween(jobs[index - 1], job);
                  const active = job.status === 'on-the-way' || job.status === 'in-progress';

                  return (
                    <div key={job.id}>
                      {/* Travel sits between stops, where it happens. */}
                      {travel !== null && (
                        <div className="flex items-center gap-2 border-y border-line bg-surface-sunk px-4 py-2">
                          <span className="text-ink3">
                            <Icon name="map-pin" />
                          </span>
                          <p className="text-caption text-ink2">
                            {duration(travel)} to the next stop
                          </p>
                        </div>
                      )}

                      <Row
                        tone={active ? 'strong' : job.status === 'complete' ? 'none' : 'neutral'}
                        to={`/wo/${job.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-1 shrink-0 font-mono text-caption text-ink3">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <p className="text-body font-medium text-ink">
                                {timeWindow(job.windowStart, job.windowEnd)}
                              </p>
                              <Status tone={active ? 'good' : 'neutral'}>
                                {STATUS_LABEL[job.status]}
                              </Status>
                            </div>

                            <p className={`mt-1 text-body text-ink ${active ? 'font-medium' : ''}`}>
                              {account.name}
                            </p>
                            <p className="text-caption text-ink2">
                              {account.address}, {account.city}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Identifier>{job.id}</Identifier>
                              <span className="text-caption text-ink3">
                                {duration(job.durationMin)} on site
                              </span>
                            </div>
                          </div>

                          <span className="mt-1 shrink-0 text-ink3">
                            <Icon name="chevron-right" />
                          </span>
                        </div>
                      </Row>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* What can move, and what cannot. */}
            <Card>
              <CardHeader title="What is fixed" eyebrow="If the day slips" />
              <RowList>
                {jobs.map((job) => {
                  const account = byId(accounts, job.accountId)!;
                  // A confirmed customer window is a promise; a booked one is not.
                  const fixed = job.status !== 'booked';
                  return (
                    <Row key={job.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-body text-ink">{account.name}</p>
                          <p className="text-caption text-ink2">
                            {fixed
                              ? 'Confirmed with the customer. Call the Service Point before moving it.'
                              : 'Not yet confirmed. Can be moved without a call.'}
                          </p>
                        </div>
                        <Status tone={fixed ? 'warn' : 'neutral'}>
                          {fixed ? 'FIXED' : 'CAN MOVE'}
                        </Status>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
            </Card>

            {/* The map, at desktop width only, and honest about itself. */}
            <Card className="hidden lg:block">
              <CardHeader title="The run" eyebrow="Desktop only" />
              <div className="px-4 py-3">
                <p className="text-caption text-ink2">
                  All {jobs.length} stops today are inside{' '}
                  {byId(territories, jobs[0]?.territoryId ?? '')?.name}. A drawn route needs base
                  geography, which is not bundled in this build, so the ordered list above is the
                  route until it is.
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
