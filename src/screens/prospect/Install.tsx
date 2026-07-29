/**
 * screens/prospect/Install.tsx
 *
 * Screen 5. Installation and project tracking.
 *
 * Where the project stands, what happens next, and who is on site.
 *
 * Stage is a sequence of rows, not a progress bar. A bar tells a homeowner they
 * are "sixty percent done", which is both meaningless and impossible to defend
 * when a permit sits with the municipality for three weeks. Named stages with
 * dates say the same thing honestly.
 */

import { Section } from '../../blueprint/Section';
import { GOLDEN, byId, leads, quotes, resources, territories } from '../../data/seedData';
import { longDate, money, shortDate } from '../../lib/format';
import {
  Avatar,
  Band,
  BandHead,
  Flag,
  Identifier,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
  type RowTone,
  type StatusTone,
} from '../../ui/primitives';

type StageState = 'done' | 'active' | 'waiting' | 'later';

const STATE: Record<StageState, { label: string; rule: RowTone; tone: StatusTone }> = {
  done: { label: 'DONE', rule: 'neutral', tone: 'neutral' },
  active: { label: 'HAPPENING NOW', rule: 'strong', tone: 'good' },
  waiting: { label: 'WAITING ON THE TOWN', rule: 'warn', tone: 'warn' },
  later: { label: 'TO COME', rule: 'none', tone: 'neutral' },
};

const STAGES: Array<{ label: string; detail: string; when: string | null; state: StageState }> = [
  {
    label: 'Quote approved',
    detail: 'You gave us the go ahead',
    when: '2026-07-26',
    state: 'done',
  },
  {
    label: 'System designed',
    detail: 'Checked against your soil test',
    when: '2026-07-29',
    state: 'done',
  },
  {
    label: 'Permit filed',
    detail: 'Lodged with the municipality. We chase it, you do not have to.',
    when: '2026-08-04',
    state: 'waiting',
  },
  {
    label: 'Installation',
    detail: 'Two days on site, dates once the permit clears',
    when: null,
    state: 'later',
  },
  {
    label: 'Yard restored',
    detail: 'Levelled, seeded and cleaned',
    when: null,
    state: 'later',
  },
  {
    label: 'Handover',
    detail: 'We walk you through it, and your care plan starts',
    when: null,
    state: 'later',
  },
];

export const ProspectInstall = () => {
  const lead = byId(leads, GOLDEN.leadId)!;
  const quote = quotes.find((q) => q.leadId === lead.id)!;
  const servicePoint = byId(territories, lead.territoryId)!;
  const crew = resources.filter(
    (r) => r.territoryId === servicePoint.id && r.role !== 'manager',
  );

  const waiting = STAGES.find((s) => s.state === 'waiting');
  const done = STAGES.filter((s) => s.state === 'done').length;

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={`${done} of ${STAGES.length} stages done`}
          subject="Where your project is"

        />

        <Section id="install-tracking">
          <div className="contents">
            {/* The honest headline: what is actually holding things up. */}
            {waiting && (
              <Band kind="data" flush>
                <div className="px-gutter py-3">
                  <Flag tone="warn" icon="alert-triangle">
                    Waiting on the municipality
                  </Flag>
                  {/*
                    Two paragraphs became one. The filing date and the two to four
                    week range are facts a customer cannot infer. "We chase it
                    weekly" repeats the stage row, which already says "We chase it,
                    you do not have to", and that is the better version of it.
                  */}
                  <p className="mt-2 max-w-reading text-body text-ink">
                    Filed {longDate(waiting.when ?? '')}. Towns here take two to four weeks. Nothing
                    is needed from you.
                  </p>
                </div>
              </Band>
            )}

            {/* Stages as a sequence. Never a bar. */}
            <Band kind="rail" flush>
              <BandHead title="What happens, and when" />
              <RowList>
                {STAGES.map((stage, index) => {
                  const state = STATE[stage.state];
                  return (
                    <Row key={stage.label} tone={state.rule}>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 shrink-0 font-mono text-caption text-ink3">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p
                              className={`text-body text-ink ${
                                stage.state === 'waiting' || stage.state === 'active'
                                  ? 'font-medium'
                                  : ''
                              }`}
                            >
                              {stage.label}
                            </p>
                            <Status tone={state.tone}>{state.label}</Status>
                          </div>
                          <p className="mt-1 max-w-reading text-caption text-ink2">
                            {stage.detail}
                          </p>
                          {stage.when && (
                            <p className="mt-1 text-caption text-ink3">{shortDate(stage.when)}</p>
                          )}
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
            </Band>

            {/* Who will be on the property. */}
            <Band kind="data" flush>
              <BandHead eyebrow="Who is coming" title="Your crew" />
              <RowList>
                {crew.map((person) => (
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
                          {person.role === 'installer' ? 'Installer' : 'Technician'},{' '}
                          {servicePoint.name}
                        </p>
                      </div>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                <p className="text-caption text-ink2">
                  You do not need to be home for the installation, but someone should be reachable by
                  phone.
                </p>
              </div>
            </Band>

            {/* Photos from site, when there are any. Real content only. */}
            <Band kind="rail" flush>
              <BandHead title="Photos" />
              <div className="px-gutter py-6">
                {/* An honest missing-data line, kept. */}
                <p className="text-body text-ink2">Photos appear here once work starts.</p>
              </div>
            </Band>

            {/* What was agreed, so it stays visible through the project. */}
            <Band kind="data" flush>
              <BandHead title="What you approved" />
              <RowList>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">Agreed price</p>
                    <p className="text-caption text-ink">
                      {money(quote.total_jde, quote.currency)}
                    </p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">Reference</p>
                    <Identifier>{quote.id}</Identifier>
                  </div>
                </Row>
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                {/* The screen's one reassurance, and it sits with the figure it is about. */}
                <Micro>Nothing charged yet</Micro>
                <p className="mt-1 text-caption text-ink2">
                  You are invoiced after the work is finished, not before.
                </p>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
