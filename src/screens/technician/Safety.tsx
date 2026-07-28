/**
 * screens/technician/Safety.tsx
 *
 * Screen 20. Pre-job safety check.
 *
 * Completed before work starts. Blocking, not advisory.
 *
 * Septic systems are confined spaces containing hydrogen sulphide, which is
 * lethal at concentrations a person stops being able to smell. So this screen
 * behaves differently from every other checklist in the build: a failed check
 * stops the job rather than annotating it, and the stop is the loud state.
 *
 * The gas reading is a number the technician enters from a meter, not a box they
 * tick. A tickable safety check is a safety check that gets ticked in the truck.
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Section } from '../../blueprint/Section';
import { accounts, byId, workOrders } from '../../data/seedData';
import {
  Button,
  ButtonLink,
  Card,
  CardHeader,
  Flag,
  Icon,
  Micro,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/** Above this, in parts per million, the job does not start. */
const H2S_LIMIT_PPM = 10;

interface Check {
  id: string;
  label: string;
  detail: string;
  /** A failure here stops the job outright rather than being noted. */
  blocking: boolean;
}

const CHECKS: Check[] = [
  {
    id: 'access',
    label: 'Safe footing and clear access to the lid',
    detail: 'No ice, no soft ground at the edge of the excavation',
    blocking: true,
  },
  {
    id: 'traffic',
    label: 'Vehicle and site traffic controlled',
    detail: 'Truck positioned so nobody reverses over an open lid',
    blocking: true,
  },
  {
    id: 'ppe',
    label: 'Gloves, eye protection and boots on',
    detail: 'Before the lid comes off, not after',
    blocking: true,
  },
  {
    id: 'meter',
    label: 'Gas meter switched on and bumped',
    detail: 'Calibration in date, alarm audible',
    blocking: true,
  },
  {
    id: 'lone',
    label: 'Service Point knows you are on site',
    detail: 'Lone working check in done',
    blocking: true,
  },
  {
    id: 'bystanders',
    label: 'Children and pets accounted for',
    detail: 'An open lid on a residential property is an open hole',
    blocking: false,
  },
];

export const TechnicianSafety = () => {
  const { id } = useParams();
  const order = byId(workOrders, id ?? '') ?? byId(workOrders, 'WO-2026-0412')!;
  const account = byId(accounts, order.accountId)!;

  const [done, setDone] = useState<string[]>([]);
  const [gas, setGas] = useState('');
  const [signedOff, setSignedOff] = useState(false);

  const toggle = (checkId: string) =>
    setDone((current) =>
      current.includes(checkId) ? current.filter((c) => c !== checkId) : [...current, checkId],
    );

  const blocking = CHECKS.filter((c) => c.blocking);
  const blockingOutstanding = blocking.filter((c) => !done.includes(c.id));

  const gasValue = gas.trim() === '' ? null : Number(gas);
  const gasEntered = gasValue !== null && Number.isFinite(gasValue);
  const gasSafe = gasEntered && gasValue <= H2S_LIMIT_PPM;
  const gasUnsafe = gasEntered && gasValue > H2S_LIMIT_PPM;

  const canStart = blockingOutstanding.length === 0 && gasSafe;

  return (
    <ScreenBody>
      <Stack gap="3">
        <header>
          <Micro>{order.id}</Micro>
          <h1 className="mt-1 text-h1 text-ink">Before you start</h1>
          <p className="mt-1 text-caption text-ink2">
            {account.address}, {account.city}
          </p>
        </header>

        <Section id="safety-check">
          <Stack gap="3">
            {/* The stop state is the loud one. */}
            {gasUnsafe && (
              <Card>
                <div className="border-l-rule border-l-alert px-4 py-3">
                  <Flag tone="alert" icon="alert-triangle">
                    Do not open the lid
                  </Flag>
                  <p className="mt-2 max-w-reading text-body text-alert">
                    {gasValue} ppm is above the {H2S_LIMIT_PPM} ppm limit. Move upwind, leave the lid
                    closed, and call the Service Point. Hydrogen sulphide stops smelling of anything
                    well before it stops being dangerous.
                  </p>
                  <div className="mt-3">
                    <Button variant="quiet" icon="message-square">
                      Call the Service Point
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* The gas reading. A number off a meter, not a checkbox. */}
            <Card>
              <CardHeader
                title="Gas reading"
                eyebrow={`Hydrogen sulphide, limit ${H2S_LIMIT_PPM} ppm`}
                action={
                  gasEntered ? (
                    <Status tone={gasSafe ? 'good' : 'alert'}>{gasSafe ? 'SAFE' : 'STOP'}</Status>
                  ) : (
                    <Status tone="warn">NOT TAKEN</Status>
                  )
                }
              />
              <div className="px-4 py-3">
                <label className="block">
                  <span className="text-caption text-ink2">Reading at the lid, in ppm</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={gas}
                    onChange={(event) => setGas(event.target.value)}
                    placeholder="0"
                    className={`mt-1 min-h-tap w-full rounded-control border bg-surface px-3 text-body font-medium text-ink placeholder:text-ink3 ${
                      gasUnsafe ? 'border-alert' : 'border-line-strong'
                    }`}
                  />
                </label>
                <p className="mt-2 text-caption text-ink2">
                  Type what the meter says. There is no box to tick here on purpose.
                </p>
              </div>
            </Card>

            {/* The blocking checks. */}
            <Card>
              <CardHeader
                title="Checks"
                eyebrow={
                  blockingOutstanding.length === 0
                    ? 'All required checks done'
                    : `${blockingOutstanding.length} required outstanding`
                }
              />
              <div className="[&>*+*]:border-t [&>*+*]:border-t-line">
                {CHECKS.map((check) => {
                  const complete = done.includes(check.id);
                  return (
                    <button
                      key={check.id}
                      type="button"
                      onClick={() => toggle(check.id)}
                      aria-pressed={complete}
                      className={`flex min-h-tap w-full items-start justify-between gap-3 border-l-rule px-4 py-3 text-left transition-colors duration-state ease-ease ${
                        complete
                          ? 'border-l-ink'
                          : check.blocking
                            ? 'border-l-alert'
                            : 'border-l-line-strong'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className={`text-body text-ink ${complete ? 'font-medium' : ''}`}>
                          {check.label}
                        </p>
                        <p className="mt-1 text-caption text-ink2">{check.detail}</p>
                        {check.blocking && !complete && (
                          <p className="mt-1">
                            <Status tone="alert">STOPS THE JOB</Status>
                          </p>
                        )}
                      </div>
                      <span
                        className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-control border ${
                          complete
                            ? 'border-ink bg-ink text-canvas'
                            : 'border-line-strong text-transparent'
                        }`}
                      >
                        <Icon name="check" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Sign off, and what happens when a check fails. */}
            <Card>
              <CardHeader title="Sign off" eyebrow="Recorded against this job" />
              <div className="px-4 py-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={signedOff}
                    onChange={(event) => setSignedOff(event.target.checked)}
                    className="mt-1 h-3 w-3 shrink-0 rounded-control border border-line-strong"
                  />
                  <span className="max-w-reading text-caption text-ink2">
                    I carried out these checks myself, at this property, just now.
                  </span>
                </label>
              </div>

              <div className="border-t border-line px-4 py-3">
                {!canStart && (
                  <p className="mb-2 text-caption text-alert">
                    {!gasEntered
                      ? 'Take the gas reading before starting.'
                      : gasUnsafe
                        ? 'Gas is above the limit. This job cannot start.'
                        : `${blockingOutstanding.length} required ${
                            blockingOutstanding.length === 1 ? 'check' : 'checks'
                          } outstanding.`}
                  </p>
                )}
                <div className="flex flex-col gap-2 min-[480px]:flex-row">
                  <ButtonLink
                    to={`/wo/${order.id}`}
                    variant={canStart && signedOff ? 'primary' : 'quiet'}
                    icon="check"
                    block
                    className={canStart && signedOff ? '' : 'pointer-events-none opacity-40'}
                  >
                    Start the job
                  </ButtonLink>
                  <Button variant="quiet" block>
                    Abandon and report
                  </Button>
                </div>
                <p className="mt-2 text-caption text-ink2">
                  Abandoning is a legitimate outcome. It is recorded with your reading and nobody
                  asks you to justify it.
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
