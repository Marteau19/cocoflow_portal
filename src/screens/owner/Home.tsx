/**
 * screens/owner/Home.tsx
 *
 * Screen 7. Hero.
 *
 * The dominant block answers one question: what happens next. Everything below
 * it is deliberately quiet. If a reviewer's eye goes anywhere but the forest
 * block first, this screen has failed.
 *
 * Forest is one of only two places it appears in V1. It is the colour, not a
 * photograph: the marketing site does the emotional work with imagery, and the
 * portal earns trust by not competing with it.
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
  ButtonLink,
  Card,
  Icon,
  IconChip,
  Micro,
  Row,
  RowList,
  Stack,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

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

  return (
    <ScreenBody flush>
      <Stack gap="4">
        {/* ---------------------------------------------------------------- */}
        {/* The dominant block. Nothing else on this screen competes with it. */}
        {/* ---------------------------------------------------------------- */}
        <Section id="next-visit" onDark>
          <div className="bg-forest px-gutter py-5 text-on-forest">
            <Micro className="text-on-forest opacity-70">Your next visit</Micro>

            {/*
              The date leads, the window sits under it at body weight. Two lines
              at display weight would compete with each other, and the question
              the homeowner is asking is "when", not "how long".
            */}
            <h1 className="mt-2 text-display">{when}</h1>
            <p className="mt-1 text-h2 font-normal opacity-90">
              {timeWindow(visit.windowStart, visit.windowEnd)}
            </p>

            {/*
              The face is the reassurance on this screen, so it is sized to be
              seen rather than decorated with. A named person arriving at your
              property is the whole promise the portal is making.
            */}
            <div className="border-on-forest-soft mt-4 flex items-center gap-3 border-t pt-4">
              <Avatar
                name={technician.name}
                initials={technician.initials}
                photo={technician.photo}
                size="hero"
              />
              <div className="min-w-0">
                <p className="text-h2 font-medium">{arrivalLine(visit.status, technician.name)}</p>
                <p className="mt-1 text-caption opacity-70">
                  {technician.name}, {servicePoint.name}
                </p>
                <p className="text-caption opacity-70">
                  {technician.rating.toFixed(1)} out of 5, from visits like yours
                </p>
              </div>
            </div>

            <p className="mt-4 text-body opacity-90">
              We are replacing the filter media, which your care plan covers. Nothing is needed from
              you, and you do not have to be home.
            </p>

            {/* The single action on this screen. */}
            <ButtonLink to="/messages" variant="primary" icon="message-square" className="mt-4">
              Message {technician.name.split(' ')[0]}
            </ButtonLink>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* The quiet half.                                                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="px-gutter">
          <Stack gap="4">
            {/*
              Three rows that are structurally identical: label, value, one line
              of detail, chevron. The icon chip is what makes them scannable
              without reading, which is the case DESIGN.md section 7 permits it
              for. Each one is a different icon, so the chips distinguish rather
              than decorate.
            */}
            <Card>
              <RowList>
                <Row to="/system">
                  <div className="flex items-center gap-3">
                    <IconChip name="file-text" />
                    <div className="min-w-0 flex-1">
                      <Micro>Your system</Micro>
                      <p className="mt-1 text-body text-ink">{asset.product}</p>
                      <p className="text-caption text-ink2">
                        Working as it should. Installed {longDate(asset.installedOn)}.
                      </p>
                    </div>
                    <span className="shrink-0 text-ink3">
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </Row>

                <Row to="/contract">
                  <div className="flex items-center gap-3">
                    <IconChip name="check" />
                    <div className="min-w-0 flex-1">
                      <Micro>Your care plan</Micro>
                      <p className="mt-1 text-body text-ink">{contract.name}</p>
                      <p className="text-caption text-ink2">
                        {money(contract.annualPrice_jde, contract.currency)} a year, renews{' '}
                        {longDate(contract.renewsOn)}. {contract.autopay ? 'On autopay.' : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-ink3">
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </Row>

                <Row to="/invoices">
                  <div className="flex items-center gap-3">
                    <IconChip name="package" tone="neutral" />
                    <div className="min-w-0 flex-1">
                      <Micro>Invoices</Micro>
                      <p className="mt-1 text-body text-ink">Nothing outstanding</p>
                      <p className="text-caption text-ink2">
                        Your care plan is paid to {longDate(contract.renewsOn)}.
                      </p>
                    </div>
                    <span className="shrink-0 text-ink3">
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </Row>
              </RowList>
            </Card>

            {/* Who looks after this property. A named team, not a call centre. */}
            <Section id="sp-contact">
              <Card>
                <div className="border-b border-line px-4 py-3">
                  <Micro>Your Service Point team</Micro>
                  <p className="mt-1 text-h2 text-ink">{servicePoint.name}</p>
                  <p className="mt-1 text-caption text-ink2">
                    The same team looks after every system in this area, including yours.
                  </p>
                </div>
                <RowList>
                  {resources
                    .filter((r) => r.territoryId === servicePoint.id && r.role !== 'installer')
                    .map((person) => (
                      <Row key={person.id}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={person.name}
                            initials={person.initials}
                            photo={person.photo}
                          />
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
                <div className="border-t border-line px-4 py-3">
                  <ButtonLink to="/messages" variant="quiet" icon="message-square">
                    Send a message
                  </ButtonLink>
                </div>
              </Card>
            </Section>

            <p className="text-caption text-ink3">
              Signed in as {primary.firstName} {primary.lastName}. {account.address},{' '}
              {account.city}.
            </p>
          </Stack>
        </div>
      </Stack>
    </ScreenBody>
  );
};
