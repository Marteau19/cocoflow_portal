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

import { useEffect, useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  assets,
  byId,
  cases,
  messagesForAccount,
  type CaseMessage,
  contacts,
  resources,
  territories,
  workOrders,
} from '../../data/seedData';
import { isUnread, markRead } from '../../data/readState';
import { t } from '../../i18n';
import { longDate, shortDate } from '../../lib/format';
import {
  Avatar,
  Band,
  BandHead,
  Button,
  Icon,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

export const OwnerMessages = () => {
  const servicePoint = byId(territories, GOLDEN.territoryId)!;
  const asset = byId(assets, GOLDEN.assetId)!;
  const primary = contacts.find((c) => c.accountId === GOLDEN.accountId && c.isPrimary)!;
  const visit = byId(workOrders, GOLDEN.workOrderId)!;
  const openCase = cases.find((c) => c.accountId === GOLDEN.accountId);

  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<CaseMessage[]>([]);

  /*
    Unread is captured once, on mount, and then cleared.

    Reading the live value would make the "New" divider vanish the instant the
    screen painted, which is the one moment it exists to be seen. Capturing it in
    state and marking the conversation read in the same effect means the divider
    stays for this visit and the badge is gone the next time Home renders.
  */
  const [hadUnread] = useState(() => (openCase ? isUnread(openCase.id) : false));

  useEffect(() => {
    markRead(GOLDEN.accountId);
  }, []);

  const messages = [...messagesForAccount(GOLDEN.accountId), ...sent];

  const send = () => {
    if (draft.trim().length === 0) return;
    setSent((current) => [
      ...current,
      {
        caseId: openCase?.id ?? '',
        from: 'customer',
        authorId: null,
        at: visit.scheduledFor,
        body: draft.trim(),
      },
    ]);
    setDraft('');
  };

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={t('messages.eyebrow')}
          subject={servicePoint.name}
          lead={t('messages.lead')}
        />

        <Section id="messages">
          <div className="contents">
            {/* What they can expect, before they have to ask. */}
            <Band kind="data" flush>
              <div className="flex items-center justify-between gap-3 px-gutter py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-ink3">
                    <Icon name="message-square" />
                  </span>
                  <p className="text-caption text-ink2">{t('messages.replyTime')}</p>
                </div>
              </div>
            </Band>

            {/* The thread. */}
            <Band kind="rail" flush>
              <BandHead
                eyebrow={openCase ? openCase.subject : t('messages.threadFallback')}
                title={t('messages.threadTitle')}
                action={
                  openCase?.status === 'resolved' ? (
                    <Status tone="neutral">{t('messages.resolved')}</Status>
                  ) : undefined
                }
              />

              <div className="[&>*+*]:border-t [&>*+*]:border-t-line">
                {messages.map((message, index) => {
                  const author =
                    message.from === 'team' && message.authorId
                      ? byId(resources, message.authorId)
                      : undefined;
                  const mine = message.from === 'customer';

                  /*
                    The divider marks where the reader left off, above the first
                    message they have not seen. With one unread that is the last
                    team message; the rule generalises to N without changing.
                  */
                  const firstUnread =
                    hadUnread &&
                    index ===
                      messages.reduce(
                        (found, candidate, i) => (candidate.from === 'team' ? i : found),
                        -1,
                      );

                  return (
                    <div key={`${message.at}-${index}`} className="px-gutter py-3">
                      {firstUnread && (
                        <div className="mb-3 flex items-center gap-3">
                          <span className="text-micro font-medium uppercase text-info">
                            {t('messages.new')}
                          </span>
                          <span aria-hidden className="h-px flex-1 bg-info" />
                        </div>
                      )}
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
                              {mine ? t('messages.you') : (author?.name ?? servicePoint.name)}
                            </p>
                            <span className="text-caption text-ink3">{shortDate(message.at)}</span>
                          </div>

                          <p className="mt-1 max-w-reading text-body text-ink">{message.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compose. */}
              <div className="border-t border-line px-gutter py-3">
                <label className="block">
                  <Micro>{t('messages.compose.label')}</Micro>
                  <textarea
                    rows={3}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={t('messages.compose.placeholder')}
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
                    {t('messages.compose.send')}
                  </Button>
                  <Button variant="quiet" icon="camera">
                    {t('messages.compose.photo')}
                  </Button>
                </div>
                <p className="mt-2 text-caption text-ink3">{t('messages.compose.photoHint')}</p>
              </div>
            </Band>

            {/* Context the team already has, so the customer need not repeat it. */}
            <Band kind="data" flush>
              <BandHead
                icon="file-text"
                iconTone="neutral"
                eyebrow={t('messages.context.eyebrow')}
                title={t('messages.context.title')}
              />
              <RowList>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">{t('messages.context.system')}</p>
                    <p className="text-caption text-ink">
                      {t('messages.context.systemValue', {
                        product: asset.product,
                        model: asset.model,
                      })}
                    </p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">{t('messages.context.nextVisit')}</p>
                    <p className="text-caption text-ink">{longDate(visit.scheduledFor)}</p>
                  </div>
                </Row>
                <Row>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-caption text-ink2">{t('messages.context.access')}</p>
                    <p className="text-right text-caption text-ink">
                      {t('messages.context.accessValue')}
                    </p>
                  </div>
                </Row>
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                <p className="text-caption text-ink2">{t('messages.context.note')}</p>
              </div>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
