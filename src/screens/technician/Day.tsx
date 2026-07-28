/**
 * screens/technician/Day.tsx
 *
 * Screen 16. My day.
 *
 * Dense, high contrast, 48px tap targets. Designed to be read in sunlight and
 * operated with gloves, which is why nothing here depends on a hover state or a
 * small target.
 *
 * Job status is a 3px left rule plus a text label. Never a coloured dot: at
 * arm's length in a truck, a dot is a smudge.
 */

import { Section } from '../../blueprint/Section';
import {
  accounts,
  assets,
  byId,
  contracts,
  resources,
  workOrdersForResource,
  type WorkOrder,
} from '../../data/seedData';
import { TODAY, dayAndDate, duration, window as timeWindow } from '../../lib/format';
import {
  Avatar,
  Card,
  Icon,
  Identifier,
  Micro,
  Row,
  RowList,
  Stack,
  Status,
  type RuleTone,
  type StatusTone,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/** The technician signed in for this prototype. */
const ME = 'RES-001';

/** Status drives the rule and the label together, so they cannot disagree. */
const STATUS: Record<WorkOrder['status'], { rule: RuleTone; tone: StatusTone; label: string }> = {
  booked: { rule: 'neutral', tone: 'neutral', label: 'BOOKED' },
  confirmed: { rule: 'neutral', tone: 'neutral', label: 'CONFIRMED' },
  'on-the-way': { rule: 'strong', tone: 'good', label: 'ON THE WAY' },
  'in-progress': { rule: 'strong', tone: 'good', label: 'IN PROGRESS' },
  complete: { rule: 'none', tone: 'neutral', label: 'COMPLETE' },
};

const TYPE_LABEL: Record<WorkOrder['type'], string> = {
  FMR: 'Filter media replacement',
  maintenance: 'Maintenance',
  repair: 'Repair',
  inspection: 'Inspection',
  install: 'Installation',
  'soil-test': 'Soil test',
};

export const TechnicianDay = () => {
  const me = byId(resources, ME)!;
  const jobs = workOrdersForResource(ME, TODAY).sort((a, b) =>
    a.windowStart.localeCompare(b.windowStart),
  );

  const active = jobs.find((j) => j.status === 'on-the-way' || j.status === 'in-progress');
  const done = jobs.filter((j) => j.status === 'complete').length;
  const totalMinutes = jobs.reduce((sum, j) => sum + j.durationMin, 0);

  return (
    <ScreenBody>
      <Stack gap="3">
        {/* Who and when, then straight into the work. */}
        <header className="flex items-start justify-between gap-3">
          <div>
            <Micro>{dayAndDate(TODAY)}</Micro>
            <h1 className="mt-1 text-h1 text-ink">My day</h1>
            <p className="mt-1 text-caption text-ink2">
              {jobs.length} jobs, {done} done, {duration(totalMinutes)} of work
            </p>
          </div>
          <Avatar name={me.name} initials={me.initials} photo={me.photo} size="lg" />
        </header>

        {/* Offline state. The field audience checks for this first. */}
        <div className="flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-2">
          <span className="text-positive">
            <Icon name="check" />
          </span>
          <p className="text-caption text-ink2">
            Synced. Your day works offline once it has loaded.
          </p>
        </div>

        <Section id="my-day">
          <Card>
            <RowList>
              {jobs.map((job) => {
                const account = byId(accounts, job.accountId)!;
                const asset = byId(assets, job.assetId)!;
                const contract = job.contractId ? byId(contracts, job.contractId) : undefined;
                const status = STATUS[job.status];
                const isActive = active?.id === job.id;

                return (
                  <Row key={job.id} rule={status.rule} to={`/wo/${job.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {/* Time first: it is what orders the day. */}
                        <div className="flex flex-wrap items-baseline gap-2">
                          <p className="text-body font-medium text-ink">
                            {timeWindow(job.windowStart, job.windowEnd)}
                          </p>
                          <Status tone={status.tone}>{status.label}</Status>
                        </div>

                        <p
                          className={`mt-1 text-body text-ink ${isActive ? 'font-medium' : ''}`}
                        >
                          {account.name}
                        </p>
                        <p className="text-caption text-ink2">
                          {account.address}, {account.city}
                        </p>

                        <p className="mt-2 text-caption text-ink">
                          {TYPE_LABEL[job.type]}, {asset.model}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Identifier>{job.id}</Identifier>
                          <span className="text-caption text-ink3">
                            {duration(job.durationMin)}
                          </span>
                          {contract && (
                            <span className="text-caption text-ink3">{contract.name}</span>
                          )}
                        </div>

                        {job.lineItems.length > 0 && (
                          <p className="mt-2 text-caption text-ink2">
                            Bring: {job.lineItems.map((line) => line.description).join(', ')}
                          </p>
                        )}
                      </div>

                      <span className="mt-1 shrink-0 text-ink3">
                        <Icon name="chevron-right" />
                      </span>
                    </div>
                  </Row>
                );
              })}
            </RowList>
          </Card>
        </Section>

        <p className="text-caption text-ink3">
          Tap a job to open it. The active job stays at the top of the list until it is closed.
        </p>
      </Stack>
    </ScreenBody>
  );
};
