/**
 * screens/manager/Dispatch.tsx
 *
 * Screen 22. Dispatch board.
 *
 * Who is going where, and what is still unassigned.
 *
 * Technicians against the day as bordered rows rather than a drag-and-drop
 * timeline. A timeline looks impressive in a demo and is unusable at phone
 * width, which is where a manager actually reassigns work: standing up, holding a
 * phone, after someone has called in sick.
 *
 * The column that matters most is the one most dispatch tools omit: what the
 * customer sees when a job moves.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  accounts,
  assets,
  byId,
  resources,
  territories,
  workOrders,
  workOrdersForResource,
  type WorkOrder,
} from '../../data/seedData';
import { TODAY, dayAndDate, duration, window as timeWindow } from '../../lib/format';
import {
  Avatar,
  Band,
  BandHead,
  Button,
  Icon,
  Identifier,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

const STATUS_LABEL: Record<WorkOrder['status'], string> = {
  booked: 'NOT CONFIRMED',
  confirmed: 'CONFIRMED',
  'on-the-way': 'ON THE WAY',
  'in-progress': 'IN PROGRESS',
  complete: 'COMPLETE',
};

export const ManagerDispatch = () => {
  const territory = byId(territories, GOLDEN.territoryId)!;
  const [moving, setMoving] = useState<string | null>(null);

  const technicians = resources.filter(
    (r) => r.territoryId === territory.id && r.role === 'technician',
  );

  const today = workOrders.filter(
    (w) => w.scheduledFor === TODAY && w.territoryId === territory.id,
  );
  const assignedIds = new Set(today.map((w) => w.resourceId));
  const unconfirmed = today.filter((w) => w.status === 'booked');

  /** Capacity, in minutes, against a nominal working day. */
  const DAY_MINUTES = 8 * 60;

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={territory.name}
          subject="Dispatch"
          lead={`${dayAndDate(TODAY)}. ${today.length} ${today.length === 1 ? 'job' : 'jobs'} across ${assignedIds.size} ${assignedIds.size === 1 ? 'technician' : 'technicians'}.`}
        />

        <Section id="dispatch">
          <div className="contents">
            {/* What is waiting, and why. Never just a count. */}
            <Band kind="data" flush>
              <BandHead
                title="Needs attention"
                eyebrow={unconfirmed.length === 0 ? 'Nothing waiting' : `${unconfirmed.length} waiting`}
              />
              {unconfirmed.length === 0 ? (
                <div className="px-gutter py-6">
                  <p className="text-body text-ink2">
                    Every job today is confirmed with its customer.
                  </p>
                </div>
              ) : (
                <RowList>
                  {unconfirmed.map((job) => {
                    const account = byId(accounts, job.accountId)!;
                    return (
                      <Row key={job.id} tone="warn">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Status tone="warn">NOT CONFIRMED</Status>
                            <p className="mt-1 text-body text-ink">{account.name}</p>
                            <p className="text-caption text-ink2">
                              {timeWindow(job.windowStart, job.windowEnd)}, {account.city}. The
                              customer has not been told a window yet.
                            </p>
                            <div className="mt-1">
                              <Identifier>{job.id}</Identifier>
                            </div>
                          </div>
                          {/*
                            The one accent fill on this screen. Confirming a
                            window with the customer is the action the board
                            exists to prompt, and every other control here moves
                            work around rather than resolving anything.
                          */}
                          <Button variant="primary">Confirm</Button>
                        </div>
                      </Row>
                    );
                  })}
                </RowList>
              )}
            </Band>

            {/* Technicians against the day. */}
            <Band kind="rail" flush>
              <BandHead title="Today" eyebrow="By technician" />
              <div className="[&>*+*]:border-t [&>*+*]:border-t-line">
                {technicians.map((person) => {
                  const jobs = workOrdersForResource(person.id, TODAY).sort((a, b) =>
                    a.windowStart.localeCompare(b.windowStart),
                  );
                  const load = jobs.reduce((sum, j) => sum + j.durationMin, 0);
                  const free = DAY_MINUTES - load;

                  return (
                    <div key={person.id}>
                      <div className="flex items-center justify-between gap-3 bg-surface-sunk px-gutter py-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <Avatar
                            name={person.name}
                            initials={person.initials}
                            photo={person.photo}
                          />
                          <p className="text-body font-medium text-ink">{person.name}</p>
                        </div>
                        <p className="shrink-0 text-caption text-ink2">
                          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'},{' '}
                          {free > 0 ? `${duration(free)} free` : 'full'}
                        </p>
                      </div>

                      {jobs.length === 0 ? (
                        <div className="px-gutter py-3">
                          <p className="text-caption text-ink2">
                            Nothing booked. Available for anything that needs moving.
                          </p>
                        </div>
                      ) : (
                        <RowList>
                          {jobs.map((job) => {
                            const account = byId(accounts, job.accountId)!;
                            const asset = byId(assets, job.assetId)!;
                            const active =
                              job.status === 'on-the-way' || job.status === 'in-progress';
                            const isMoving = moving === job.id;

                            return (
                              <Row
                                key={job.id}
                                tone={
                                  job.status === 'booked'
                                    ? 'warn'
                                    : active
                                      ? 'strong'
                                      : job.status === 'complete'
                                        ? 'none'
                                        : 'neutral'
                                }
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-baseline gap-2">
                                      <span className="font-mono text-caption text-ink2">
                                        {timeWindow(job.windowStart, job.windowEnd)}
                                      </span>
                                      <Status tone={active ? 'good' : 'neutral'}>
                                        {STATUS_LABEL[job.status]}
                                      </Status>
                                    </div>
                                    <p className="mt-1 text-body text-ink">{account.name}</p>
                                    <p className="text-caption text-ink2">
                                      {account.city}, {asset.model}, {duration(job.durationMin)}
                                    </p>
                                    <div className="mt-1">
                                      <Identifier>{job.id}</Identifier>
                                    </div>
                                  </div>

                                  {job.status !== 'complete' && (
                                    <Button
                                      variant="quiet"
                                      onClick={() => setMoving(isMoving ? null : job.id)}
                                    >
                                      {isMoving ? 'Cancel' : 'Move'}
                                    </Button>
                                  )}
                                </div>

                                {/* The consequence of moving, before it is moved. */}
                                {isMoving && (
                                  <div className="mt-3 rounded-control border border-line bg-surface-sunk px-3 py-3">
                                    <Micro>What the customer sees</Micro>
                                    <p className="mt-1 flex items-start gap-2 text-caption text-ink2">
                                      <span className="mt-1 shrink-0">
                                        <Icon name="info" />
                                      </span>
                                      <span>
                                        {job.status === 'booked'
                                          ? `${account.name} has not been given a window yet, so moving this is invisible to them.`
                                          : `${account.name} was told ${timeWindow(job.windowStart, job.windowEnd)}. Moving it sends them a new window and a short note. Their portal updates immediately.`}
                                      </span>
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {technicians
                                        .filter((t) => t.id !== person.id)
                                        .map((t) => (
                                          <Button
                                            key={t.id}
                                            variant="quiet"
                                            onClick={() => setMoving(null)}
                                          >
                                            Give to {t.name.split(' ')[0]}
                                          </Button>
                                        ))}
                                      <Button variant="quiet" onClick={() => setMoving(null)}>
                                        Move to another day
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Row>
                            );
                          })}
                        </RowList>
                      )}
                    </div>
                  );
                })}
              </div>
            </Band>

            <p className="text-caption text-ink3">
              Capacity is measured against an eight hour day and does not include travel. Travel sits
              on the technician route screen, where it belongs.
            </p>
          </div>
        </Section>
      </div>
    </>
  );
};
