/**
 * screens/owner/Home.tsx
 *
 * Screen 7. Hero.
 *
 * Recomposed for Broadsheet. This screen was already the only one in the build
 * that read as a product, because it was the only one with a real figure and
 * ground moment. What was an exception is now the system.
 *
 * Four bands, per DESIGN.md section 2:
 *
 *   Masthead   dark, the hero: when the next visit is, and who is coming
 *   Reading    canvas, the three quiet rows directly on the ground, no container
 *   Data       surface, the Service Point team
 *   Closing    sunk, who is signed in and where
 *
 * No two adjacent bands share a ground, which is what does the work the hairline
 * borders were failing to do. Zero cards: nothing on this screen is an object a
 * reader would lift out of the page, so nothing gets a box.
 *
 * Hero type is a dark field, per the table in DESIGN.md section 7. The date sits
 * at the `hero` step, which is 48px inside the handset at every browser width.
 *
 * Customer vocabulary only. No work order, no asset, no entitlement.
 */

import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  accounts,
  assets,
  byId,
  contacts,
  contracts,
  resources,
  territories,
  workOrders,
} from '../../data/seedData';
import { isToday, longDate, money, relativeDay, window as timeWindow } from '../../lib/format';
import {
  Avatar,
  Band,
  BandHead,
  ButtonLink,
  Icon,
  Micro,
  Row,
  RowList,
} from '../../ui/primitives';

/** Arrival state, in the words a homeowner would use. */
const arrivalLine = (status: string, name: string): string => {
  const first = name.split(' ')[0];
  switch (status) {
    case 'on-the-way':
      return `${first} is on the way`;
    case 'in-progress':
      return `${first} is working on your system now`;
    case 'confirmed':
      return `${first} is confirmed for this visit`;
    case 'complete':
      return `${first} has finished this visit`;
    default:
      return `${first} is booked for this visit`;
  }
};

export const OwnerHome = () => {
  const account = byId(accounts, GOLDEN.accountId)!;
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;
  const visit = byId(workOrders, GOLDEN.workOrderId)!;
  const technician = byId(resources, visit.resourceId)!;
  const servicePoint = byId(territories, GOLDEN.territoryId)!;
  const primary = contacts.find((c) => c.accountId === account.id && c.isPrimary)!;

  const when = isToday(visit.scheduledFor)
    ? 'Today'
    : (relativeDay(visit.scheduledFor) ?? longDate(visit.scheduledFor));

  /**
   * The quiet rows. Structurally identical, which is exactly why they are one
   * group of rules on a single ground rather than three boxes.
   */
  const rows = [
    {
      to: '/system',
      label: 'Your system',
      value: asset.product,
      detail: `Working as it should. Installed ${longDate(asset.installedOn)}.`,
    },
    {
      to: '/contract',
      label: 'Your care plan',
      value: contract.name,
      detail: `${money(contract.annualPrice_jde, contract.currency)} a year, renews ${longDate(
        contract.renewsOn,
      )}.${contract.autopay ? ' On autopay.' : ''}`,
    },
    {
      to: '/invoices',
      label: 'Invoices',
      value: 'Nothing outstanding',
      detail: `Your care plan is paid to ${longDate(contract.renewsOn)}.`,
    },
  ];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Masthead. The hero, and the only dark band on this screen.         */}
      {/* ------------------------------------------------------------------ */}
      <Section id="next-visit" onDark>
        <Band kind="masthead">
          <Micro className="text-on-band-muted">Your next visit</Micro>

          {/*
            The date is the hero. The window sits under it at body weight,
            because the question a homeowner is asking is "when", not "how long",
            and two figures at hero size would mean neither is the hero.
          */}
          <p className="mt-2 text-hero">{when}</p>
          <p className="mt-1 text-body text-on-band opacity-80">
            {timeWindow(visit.windowStart, visit.windowEnd)}
          </p>

          {/*
            The face is the reassurance on this screen, so it is sized to be seen
            rather than decorated with. A named person arriving at your property
            is the whole promise the portal is making.
          */}
          <div className="border-on-band-soft mt-4 flex items-center gap-3 border-t pt-4">
            <Avatar
              name={technician.name}
              initials={technician.initials}
              photo={technician.photo}
              size="hero"
            />
            <div className="min-w-0">
              <p className="text-body font-medium">{arrivalLine(visit.status, technician.name)}</p>
              <p className="mt-1 text-caption text-on-band opacity-80">
                {technician.name}, {servicePoint.name}
              </p>
              <p className="text-caption text-on-band opacity-80">
                {technician.rating.toFixed(1)} out of 5, from visits like yours
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-reading text-body text-on-band opacity-90">
            We are replacing the filter media, which your care plan covers. Nothing is needed from
            you, and you do not have to be home.
          </p>

          {/* The one accent fill on this screen. */}
          <ButtonLink to="/messages" variant="primary" icon="message-square" className="mt-4">
            Message {technician.name.split(' ')[0]}
          </ButtonLink>
        </Band>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Reading. Three rows directly on the canvas. No container.          */}
      {/* ------------------------------------------------------------------ */}
      <Band kind="reading" flush className="py-0">
        <RowList>
          {rows.map((row) => (
            <Row key={row.to} to={row.to} gutter>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <Micro>{row.label}</Micro>
                  <p className="mt-1 text-body font-medium text-ink">{row.value}</p>
                  <p className="mt-1 text-caption text-ink2">{row.detail}</p>
                </div>
                <span className="shrink-0 text-ink3">
                  <Icon name="chevron-right" />
                </span>
              </div>
            </Row>
          ))}
        </RowList>
      </Band>

      {/* ------------------------------------------------------------------ */}
      {/* Data. Who looks after this property. A named team, not a number.   */}
      {/* ------------------------------------------------------------------ */}
      <Section id="sp-contact">
        <Band kind="data" flush>
          <div className="px-gutter">
            <BandHead eyebrow="Your Service Point team" title={servicePoint.name} />
            <p className="max-w-reading pb-4 text-body text-ink2">
              The same team looks after every system in this area, including yours.
            </p>
          </div>
          <RowList className="border-t border-line">
            {resources
              .filter((r) => r.territoryId === servicePoint.id && r.role !== 'installer')
              .map((person) => (
                <Row key={person.id} gutter>
                  <div className="flex items-center gap-3">
                    <Avatar name={person.name} initials={person.initials} photo={person.photo} />
                    <div className="min-w-0">
                      <p className="text-body text-ink">{person.name}</p>
                      <p className="text-caption text-ink2">
                        {person.role === 'manager' ? 'Service Point manager' : 'Technician'}
                      </p>
                    </div>
                  </div>
                </Row>
              ))}
          </RowList>
          <div className="border-t border-line px-gutter py-4">
            <ButtonLink to="/messages" variant="quiet" icon="message-square">
              Send a message
            </ButtonLink>
          </div>
        </Band>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Closing. Provenance, on a sunk ground rather than orphaned.        */}
      {/* ------------------------------------------------------------------ */}
      <Band kind="closing">
        <Micro>Signed in as</Micro>
        <p className="mt-1 text-caption text-ink2">
          {primary.firstName} {primary.lastName}. {account.address}, {account.city}.
        </p>
      </Band>
    </>
  );
};
