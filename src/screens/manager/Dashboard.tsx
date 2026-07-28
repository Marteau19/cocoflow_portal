/**
 * screens/manager/Dashboard.tsx
 *
 * Screen 21. Service Point dashboard.
 *
 * Table forward and bordered rows, not a wall of tiles. The manager is asking
 * two questions: how are we doing against what we are held to, and what needs me
 * today. Everything on this screen answers one of the two.
 *
 * Three equal-weight cards in a row are banned, so the KPI band is deliberately
 * asymmetric: service mix leads, because that is the strategic measure.
 */

import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  accounts,
  byId,
  cases,
  leads,
  network,
  resources,
  servicePoints,
  territories,
  workOrdersForResource,
  workOrders,
} from '../../data/seedData';
import { TODAY, dayAndDate, millions, money, percent, window as timeWindow } from '../../lib/format';
import {
  Avatar,
  Band,
  BandHead,
  ButtonLink,
  Hero,
  Icon,
  Identifier,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

export const ManagerDashboard = () => {
  const territory = byId(territories, GOLDEN.territoryId)!;
  const sp = servicePoints.find((s) => s.territoryId === territory.id)!;

  const today = workOrders.filter((w) => w.scheduledFor === TODAY);
  const unstarted = today.filter((w) => w.status === 'booked');
  const openCases = cases.filter((c) => c.status !== 'resolved');
  const newLeads = leads.filter((l) => l.status === 'new' || l.status === 'contacted');

  const technicians = resources.filter(
    (r) => r.territoryId === territory.id && r.role === 'technician',
  );

  const aboveTarget = sp.servicePct >= network.serviceTargetPct;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Masthead. The hero is the measure the Service Point is held to.    */}
      {/* ------------------------------------------------------------------ */}
      <Section id="sp-dashboard" onDark>
        <Band kind="masthead">
          <Micro className="text-on-band-muted">{territory.name}</Micro>
          <p className="mt-1 text-h1 text-on-band">Service Point dashboard</p>

          {/*
            One hero, not two figures side by side. The shipped version put
            service share and revenue at the same 38px, which meant neither was
            the hero. Revenue drops to the supporting row below.
          */}
          <div className="mt-5">
            <Hero
              onBand
              label="Service revenue share"
              value={percent(sp.servicePct)}
              delta={{
                text: aboveTarget
                  ? `Above the ${network.serviceTargetPct}% target`
                  : `${percent(network.serviceTargetPct - sp.servicePct)} below the ${network.serviceTargetPct}% target`,
                tone: aboveTarget ? 'positive' : 'warn',
              }}
              note={`${dayAndDate(TODAY)}. ${today.length} ${today.length === 1 ? 'job' : 'jobs'} booked today.`}
            />
          </div>

        </Band>
      </Section>

      {/* Rail. The supporting figures, off the dark ground. */}
      <Band kind="rail">
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: 'Revenue, year to date', value: millions(sp.revenue) },
            { label: 'Active care plans', value: sp.activeContracts.toLocaleString('en-CA') },
            { label: 'Revenue per km', value: sp.revenuePerKm.toFixed(1) },
            { label: 'Customer rating', value: sp.rating.toFixed(1) },
            { label: 'Portal readiness', value: `${sp.readiness}%` },
          ].map((item) => (
            <div key={item.label}>
              <Micro>{item.label}</Micro>
              <dd className="mt-1 text-body font-medium text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Band>

            {/* ---------------------------------------------------------- */}
            {/* What needs a decision. Rows, with a left rule for urgency. */}
            {/* ---------------------------------------------------------- */}
            <Band kind="data" flush>
              <div className="px-gutter">
              <BandHead
                icon="alert-triangle"
                iconTone="warn"
                title="Needs you today"
                eyebrow="Decisions, not notifications"
              />
              <RowList>
                {unstarted.length > 0 && (
                  <Row rule="warn" to="/sp/dispatch">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <Status tone="warn">UNCONFIRMED</Status>
                        <p className="mt-1 text-body text-ink">
                          {unstarted.length} {unstarted.length === 1 ? 'job' : 'jobs'} today not yet
                          confirmed with the customer
                        </p>
                        <p className="text-caption text-ink2">
                          {unstarted
                            .map((job) => byId(accounts, job.accountId)?.name)
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                      <span className="shrink-0 text-ink3">
                        <Icon name="chevron-right" />
                      </span>
                    </div>
                  </Row>
                )}

                {openCases.map((item) => {
                  const account = byId(accounts, item.accountId);
                  return (
                    <Row key={item.id} rule="warn" to="/sp/customers">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <Status tone="warn">OPEN</Status>
                          <p className="mt-1 text-body text-ink">{item.subject}</p>
                          <p className="text-caption text-ink2">
                            {account?.name}, last message {item.lastMessageOn}
                          </p>
                        </div>
                        <span className="shrink-0 text-ink3">
                          <Icon name="chevron-right" />
                        </span>
                      </div>
                    </Row>
                  );
                })}

                <Row rule="neutral" to="/sp/leads">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Status>TO CONTACT</Status>
                      <p className="mt-1 text-body text-ink">
                        {newLeads.length} leads waiting on a first call
                      </p>
                      <p className="text-caption text-ink2">
                        Oldest from {newLeads[0]?.createdOn}
                      </p>
                    </div>
                    <span className="shrink-0 text-ink3">
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </Row>

                <Row rule="neutral" to="/sp/inventory">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Status>REORDER</Status>
                      <p className="mt-1 text-body text-ink">
                        Effluent pumps below the reorder point
                      </p>
                      <p className="text-caption text-ink2">
                        Three on hand, forecast needs four in the next four weeks
                      </p>
                    </div>
                    <span className="shrink-0 text-ink3">
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </Row>
              </RowList>
            </div>
            </Band>

            {/* ---------------------------------------------------------- */}
            {/* Today, by technician.                                      */}
            {/* ---------------------------------------------------------- */}
            <Band kind="rail" flush>
              <div className="px-gutter">
              <BandHead
                title="Today"
                eyebrow="By technician"
                action={
                  <ButtonLink to="/sp/dispatch" variant="plain">
                    Dispatch board
                  </ButtonLink>
                }
              />
              <RowList>
                {technicians.map((person) => {
                  const jobs = workOrdersForResource(person.id, TODAY).sort((a, b) =>
                    a.windowStart.localeCompare(b.windowStart),
                  );
                  return (
                    <Row key={person.id} rule={jobs.length === 0 ? 'none' : 'neutral'}>
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
                            <p className="text-caption text-ink2">
                              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
                            </p>
                          </div>

                          {jobs.length === 0 ? (
                            <p className="mt-1 text-caption text-ink3">
                              Nothing booked. Available for overflow.
                            </p>
                          ) : (
                            <ul className="mt-1 space-y-1">
                              {jobs.map((job) => (
                                <li key={job.id} className="flex items-baseline gap-2">
                                  <span className="font-mono text-caption text-ink2">
                                    {timeWindow(job.windowStart, job.windowEnd)}
                                  </span>
                                  <span className="min-w-0 truncate text-caption text-ink">
                                    {byId(accounts, job.accountId)?.name}
                                  </span>
                                  <Identifier className="shrink-0 text-ink3">{job.id}</Identifier>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
            </div>
            </Band>

            <p className="text-caption text-ink3">
              {territory.name}, {money(sp.revenue)} of {money(sp.target)} against target. Figures are
              mock.
            </p>
    </>
  );
};
