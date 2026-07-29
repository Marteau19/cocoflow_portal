/**
 * screens/technician/Route.tsx
 *
 * Screen 18. Route and schedule.
 *
 * The day as a sequence of stops with travel between them.
 *
 * The list is the only register. There is no map, at any width.
 *
 * It used to switch on a `lg:` breakpoint, which resolves against the browser
 * window rather than the device frame, so the "desktop only" band rendered inside
 * the handset anyway. The role is mobile only, so there was no desktop register
 * for it to belong to either. See DESIGN.md section 5.
 *
 * That is also the right default on its own merits. What a technician needs at the
 * wheel is the next address and the drive time, not a picture of the county. There
 * is no base geography bundled in this build, and the closing band says so.
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
  Band,
  BandHead,
  Hero,
  Icon,
  Identifier,
  Masthead,
  Note,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

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
    <>
      <div className="contents">
        {/* Masthead. The hero is the day, in the terms a technician plans it in. */}
        <Masthead
          eyebrow={dayAndDate(TODAY)}
          subject="Route"
          hero={
            <Hero
              onBand
              label="Stops today"
              value={String(jobs.length)}
              delta={{ text: `${duration(totalTravel)} of driving between them`, tone: 'neutral' }}
              note={`${duration(totalWork)} of work. The order is fixed by the windows, not by distance.`}
            />
          }
        />

        {/*
          Offline first, as on every technician screen.

          It is a Rail band rather than a bare bordered strip between bands. As a
          sibling it had a 12px inset of its own, so it sat 20px inside the gutter
          and became one more left edge on a screen that already had thirteen.
        */}
        <Band kind="rail" flush>
          <div className="px-gutter py-2">
            <Note icon="check" tone="text-positive">
              Your route is on the device. It stays readable with no signal.
            </Note>
          </div>
        </Band>

        <Section id="route">
          <div className="contents">
            {/* The list is the primary register here, not a fallback. */}
            <Band kind="data" flush>
              <BandHead title="Stops in order" eyebrow="Earliest first" />
              <div>
                {jobs.map((job, index) => {
                  const account = byId(accounts, job.accountId)!;
                  const travel = index === 0 ? null : minutesBetween(jobs[index - 1], job);
                  const active = job.status === 'on-the-way' || job.status === 'in-progress';

                  return (
                    <div key={job.id}>
                      {/* Travel sits between stops, where it happens. */}
                      {travel !== null && (
                        <div className="border-y border-line bg-surface-sunk px-gutter py-2">
                          <Note icon="map-pin">{duration(travel)} to the next stop</Note>
                        </div>
                      )}

                      <Row
                        tone={active ? 'strong' : job.status === 'complete' ? 'none' : 'neutral'}
                        to={`/wo/${job.id}`}
                      >
                        <div className="flex items-start gap-3">
                          {/*
                            The stop number occupies the same 48px box a thumbnail
                            would, so the text edge is `gutter + 48 + 16` here and
                            on `/parts`. Left to size itself it was about 14px wide
                            and put this screen's body text on a third left edge
                            that matched nothing else in the build.
                          */}
                          <span className="mt-1 w-6 shrink-0 font-mono text-caption text-ink3">
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
            </Band>

            {/* What can move, and what cannot. */}
            <Band kind="rail" flush>
              <BandHead title="What is fixed" eyebrow="If the day slips" />
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
            </Band>

            {/*
              Honest about itself, and now shown at every width.

              This was `hidden lg:block` with a "Desktop only" eyebrow, which was
              wrong twice. Tailwind's `lg:` resolves against the browser window, so
              inside a 420px device frame at a 1440px window the band rendered
              anyway, eyebrow and all, on what is meant to be a phone. And the
              technician role is mobile only, so it has no desktop register for a
              "desktop only" band to belong to. See DESIGN.md section 5.

              The content was never desktop specific: it says the drawn map does not
              exist yet. That is worth saying on a phone too.
            */}
            <Band kind="data" flush>
              <BandHead title="The run" eyebrow="Not drawn yet" />
              <div className="px-gutter py-3">
                <p className="text-caption text-ink2">
                  All {jobs.length} stops today are inside{' '}
                  {byId(territories, jobs[0]?.territoryId ?? '')?.name}. A drawn route needs base
                  geography, which is not bundled in this build, so the ordered list above is the
                  route until it is.
                </p>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
