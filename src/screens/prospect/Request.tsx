/**
 * screens/prospect/Request.tsx
 *
 * Screen 2. Request received, team assigned.
 *
 * The homeowner gets an account the moment they ask for help, and they see who
 * owns the job within minutes rather than after three transfers. One named team,
 * with faces.
 *
 * This screen is where the identity architecture and the master data model meet,
 * which the annotation records. On screen it is simply: you are in, here is who
 * is looking after you.
 */

import { Section } from '../../blueprint/Section';
import { GOLDEN, byId, leads, resources, territories } from '../../data/seedData';
import { longDate } from '../../lib/format';
import {
  Avatar,
  ButtonLink,
  Card,
  CardHeader,
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

/** What happens next, as a sequence. Not a progress bar. */
const STEPS = [
  {
    label: 'We call you',
    detail: 'Within one working day, to understand the property',
    state: 'next' as const,
  },
  {
    label: 'We visit and test the soil',
    detail: 'About an hour on site, no cost to you',
    state: 'later' as const,
  },
  {
    label: 'We design your system and quote it',
    detail: 'You approve or you do not. No pressure either way',
    state: 'later' as const,
  },
  {
    label: 'We install, and file the permits',
    detail: 'We handle the municipality',
    state: 'later' as const,
  },
];

export const ProspectRequest = () => {
  const lead = byId(leads, GOLDEN.leadId)!;
  const servicePoint = byId(territories, lead.territoryId)!;
  const team = resources.filter((r) => r.territoryId === servicePoint.id);

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Request received"
          title={`Thanks, ${lead.name.split(' ')[0]}`}
          lead="We have your request and a team is assigned. Here is what happens next."
        />

        {/* ---------------------------------------------------------------- */}
        {/* The account, created at the moment they asked for help.          */}
        {/* ---------------------------------------------------------------- */}
        <Section id="intake-identity">
          <Card>
            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 shrink-0 text-positive">
                  <Icon name="check" />
                </span>
                <div className="min-w-0">
                  <p className="text-body text-ink">Your account is ready</p>
                  <p className="mt-1 text-caption text-ink2">
                    Everything from here, the soil test, the quote, the install and the paperwork,
                    lives in this one place. You will not have to explain yourself twice.
                  </p>
                </div>
              </div>
            </div>
            <RowList className="border-t border-line">
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Property</p>
                  <p className="text-right text-caption text-ink">{lead.city}, Québec</p>
                </div>
              </Row>
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Requested</p>
                  <p className="text-caption text-ink">{longDate(lead.createdOn)}</p>
                </div>
              </Row>
              <Row>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-caption text-ink2">Your reference</p>
                  <Identifier>{lead.id}</Identifier>
                </div>
              </Row>
            </RowList>
          </Card>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* The team. Named, with faces, before anyone has spoken to them.    */}
        {/* ---------------------------------------------------------------- */}
        <Section id="team-assigned">
          <Card>
            <CardHeader
              eyebrow="Looking after you"
              title={servicePoint.name}
              action={<Status tone="good">ASSIGNED</Status>}
            />
            <div className="px-4 py-3">
              <p className="text-caption text-ink2">
                One team owns your whole job, from the first visit to the last. They cover a{' '}
                {servicePoint.radiusKm} km area around {lead.city}.
              </p>
            </div>
            <RowList className="border-t border-line">
              {team.map((person) => (
                <Row key={person.id}>
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={person.name}
                      initials={person.initials}
                      photo={person.photo}
                      size="lg"
                    />
                    <div className="min-w-0">
                      <p className="text-body text-ink">{person.name}</p>
                      <p className="text-caption text-ink2">
                        {person.role === 'manager'
                          ? 'Service Point manager'
                          : person.role === 'installer'
                            ? 'Installer'
                            : 'Technician'}
                      </p>
                    </div>
                  </div>
                </Row>
              ))}
            </RowList>
          </Card>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Card>
          <CardHeader eyebrow="What happens next" title="Four steps" />
          <RowList>
            {STEPS.map((step, index) => (
              <Row key={step.label} tone={step.state === 'next' ? 'strong' : 'neutral'}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 shrink-0 font-mono text-caption text-ink3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p
                        className={`text-body text-ink ${step.state === 'next' ? 'font-medium' : ''}`}
                      >
                        {step.label}
                      </p>
                      {step.state === 'next' && <Status tone="good">NEXT</Status>}
                    </div>
                    <p className="mt-1 text-caption text-ink2">{step.detail}</p>
                  </div>
                </div>
              </Row>
            ))}
          </RowList>
        </Card>

        <Card>
          <div className="px-4 py-3">
            <Micro>Already had your soil test?</Micro>
            <p className="mt-1 text-caption text-ink2">
              If we have been out to the property, your findings and your quote are waiting.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ButtonLink to="/soil-test" variant="quiet">
                See the soil test
              </ButtonLink>
              <ButtonLink to="/quote" variant="quiet">
                See the quote
              </ButtonLink>
            </div>
          </div>
        </Card>
      </Stack>
    </ScreenBody>
  );
};
