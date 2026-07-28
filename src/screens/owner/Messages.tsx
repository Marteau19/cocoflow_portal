/**
 * screens/owner/Messages.tsx
 *
 * Screen 13. Messages.
 *
 * One thread with the Service Point team. No ticket numbers, no queue names, no
 * "your case has been assigned to agent 4".
 *
 * Internally these are cases with a queue and a status. The customer sees a
 * conversation with people who have names. That translation is the point, and it
 * is the same discipline as the work order's visit summary: the internal record
 * is real, it is just not what gets shown.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  byId,
  cases,
  contacts,
  resources,
  territories,
  workOrders,
} from '../../data/seedData';
import { longDate, shortDate } from '../../lib/format';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Icon,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

interface Message {
  from: 'you' | 'team';
  authorId?: string;
  at: string;
  body: string;
  /** What this message is about, shown as context rather than a ticket id. */
  about?: string;
}

/**
 * The thread, grounded in the cases that exist in seedData. The customer-facing
 * subject comes from the case; the queue and status never surface.
 */
const THREAD: Message[] = [
  {
    from: 'you',
    at: '2026-06-02',
    body: 'Quick question. The driveway is not ploughed in winter and the lid is under snow. Is that a problem for the visit?',
    about: 'Question about winter access',
  },
  {
    from: 'team',
    authorId: 'RES-003',
    at: '2026-06-02',
    body: 'Good question, and thanks for flagging it early. We need a clear path to the lid on the day. If the drive is not ploughed we can either shift the visit to a thaw week or you can clear a path the day before. We will call you two days ahead either way so it is never a surprise.',
  },
  {
    from: 'you',
    at: '2026-06-03',
    body: 'A thaw week works better for us. Thank you.',
  },
  {
    from: 'team',
    authorId: 'RES-003',
    at: '2026-06-03',
    body: 'Noted on your property record, so whoever is scheduling next winter will see it without you having to explain again.',
  },
];

export const OwnerMessages = () => {
  const servicePoint = byId(territories, GOLDEN.territoryId)!;
  const primary = contacts.find((c) => c.accountId === GOLDEN.accountId && c.isPrimary)!;
  const visit = byId(workOrders, GOLDEN.workOrderId)!;
  const openCase = cases.find((c) => c.accountId === GOLDEN.accountId);

  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Message[]>([]);

  const messages = [...THREAD, ...sent];

  const send = () => {
    if (draft.trim().length === 0) return;
    setSent((current) => [
      ...current,
      { from: 'you', at: visit.scheduledFor, body: draft.trim() },
    ]);
    setDraft('');
  };

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Messages"
          title={servicePoint.name}
          lead="One conversation with the team who looks after your system."
        />

        <Section id="messages">
          <Stack gap="4">
            {/* What they can expect, before they have to ask. */}
            <Card>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-ink3">
                    <Icon name="message-square" />
                  </span>
                  <p className="text-caption text-ink2">
                    We reply within one working day. For anything urgent, call the Service Point.
                  </p>
                </div>
              </div>
            </Card>

            {/* The thread. */}
            <Card>
              <CardHeader
                eyebrow={openCase ? openCase.subject : 'Your conversation'}
                title="Messages"
                action={
                  openCase?.status === 'resolved' ? <Status tone="neutral">RESOLVED</Status> : undefined
                }
              />

              <div className="divide-y divide-line">
                {messages.map((message, index) => {
                  const author =
                    message.from === 'team' && message.authorId
                      ? byId(resources, message.authorId)
                      : undefined;
                  const mine = message.from === 'you';

                  return (
                    <div key={`${message.at}-${index}`} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        {mine ? (
                          <Avatar
                            name={`${primary.firstName} ${primary.lastName}`}
                            initials={`${primary.firstName.charAt(0)}${primary.lastName.charAt(0)}`}
                            photo={null}
                          />
                        ) : (
                          <Avatar
                            name={author?.name ?? servicePoint.name}
                            initials={author?.initials ?? 'SP'}
                            photo={author?.photo ?? null}
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <p className="text-caption font-medium text-ink">
                              {mine ? 'You' : (author?.name ?? servicePoint.name)}
                            </p>
                            <span className="text-caption text-ink3">{shortDate(message.at)}</span>
                          </div>

                          {message.about && (
                            <p className="mt-1 text-caption text-ink3">About: {message.about}</p>
                          )}

                          <p className="mt-1 max-w-reading text-body text-ink">{message.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compose. */}
              <div className="border-t border-line px-4 py-3">
                <label className="block">
                  <Micro>Write a message</Micro>
                  <textarea
                    rows={3}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Anything about your system or a visit"
                    className="mt-2 w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-body text-ink placeholder:text-ink3"
                  />
                </label>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    variant="primary"
                    icon="message-square"
                    disabled={draft.trim().length === 0}
                    onClick={send}
                  >
                    Send
                  </Button>
                  <Button variant="quiet" icon="camera">
                    Add a photo
                  </Button>
                </div>
                <p className="mt-2 text-caption text-ink3">
                  A photo of what you are seeing usually saves a visit.
                </p>
              </div>
            </Card>

            {/* Context the team already has, so the customer need not repeat it. */}
            <Card>
              <CardHeader eyebrow="What we already know" title="Attached to this conversation" />
              <RowList>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">Your system</p>
                    <p className="text-caption text-ink">Ecoflo compact biofilter, EC-5</p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">Next visit</p>
                    <p className="text-caption text-ink">{longDate(visit.scheduledFor)}</p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">Winter access</p>
                    <p className="text-right text-caption text-ink">
                      Thaw weeks preferred, noted 2026
                    </p>
                  </div>
                </Row>
              </RowList>
              <div className="border-t border-line px-4 py-3">
                <p className="text-caption text-ink2">
                  Whoever replies can see all of this. You should never have to explain your property
                  twice.
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
