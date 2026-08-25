/**
 * screens/owner/Account.tsx
 *
 * Screen 35. Account.
 *
 * This did not exist. "Signed in as Sarah Lavoie" was grey text at the foot of
 * an infinite scroll on the home screen, and everything a person does to their
 * own account, change a card, stop the emails, read the warranty, was either
 * buried inside another screen or absent. A portal without an account
 * destination is a brochure that knows your name.
 *
 * It is a hub, not a new pile of screens. Invoices, the care plan, the transfer
 * flow and messages all already existed and were reachable only by scrolling
 * into a row on another screen; this gives them a front door. The only genuinely
 * new controls are the language toggle and the notification preferences.
 *
 * The language toggle is not optional. This is a Quebec market product, and a
 * language choice that lives in a browser setting rather than on the customer
 * record cannot reach the invoice, the appointment reminder, or the summary the
 * technician leaves behind. See the `account-preferences` annotation.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  SESSION,
  byId,
  contacts,
  contracts,
  propertiesForContact,
  systemsForProperty,
  territories,
} from '../../data/seedData';
import { getLocale, plural, setLocale, t, type Locale } from '../../i18n';
import { longDate } from '../../lib/format';
import {
  Band,
  BandHead,
  ButtonLink,
  Icon,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
  Tabs,
  Toggle,
} from '../../ui/primitives';

/** Unread messages from the team. One thread, so this is a count on it. */
const UNREAD = 1;

/**
 * Notification topics.
 *
 * Topics rather than channels. A person knows what they want to hear about; they
 * do not have an opinion about whether it arrives by email or push until one of
 * the two annoys them, and asking them to fill in a grid of both is how a
 * preference screen becomes a screen nobody finishes. Channel routing is a
 * platform decision, recorded in the annotation.
 *
 * Offers is off by default and the other three are on. That is not a UI nicety:
 * commercial messages need express consent under Quebec law and service messages
 * do not, so the default state of this one control is a legal position.
 */
const TOPICS = [
  { key: 'visitReminders', on: true },
  { key: 'visitReports', on: true },
  { key: 'planNotices', on: true },
  { key: 'offers', on: false },
] as const;

export const OwnerAccount = () => {
  const person = byId(contacts, SESSION.contactId)!;
  const properties = propertiesForContact(SESSION.contactId);
  const property = properties[0];
  const contract = contracts.find((c) => c.accountId === property.id && c.status === 'active');
  const servicePoint = byId(territories, property.territoryId)!;

  const [topics, setTopics] = useState<Record<string, boolean>>(
    Object.fromEntries(TOPICS.map((topic) => [topic.key, topic.on])),
  );

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={t('account.masthead.eyebrow')}
          subject={`${person.firstName} ${person.lastName}`}
        />

        {/* ---------------------------------------------------------------- */}
        <Section id="account-identity">
          <div className="contents">
            <Band kind="data" flush>
              <BandHead icon="user" title={t('account.you.title')} />
              <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">{t('account.you.email')}</dt>
                  <dd className="min-w-0 truncate text-caption text-ink">{person.email}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                  <dt className="text-caption text-ink2">{t('account.you.phone')}</dt>
                  <dd className="text-caption text-ink">{person.phone}</dd>
                </div>
              </dl>
            </Band>

            {/*
              Properties, plural in the model even where it is singular on screen.

              Sarah owns one. The list is read from the record rather than from
              the golden constant, so a second one is a data change: the heading
              pluralises, the row renders, and nothing here is rewritten. That is
              the whole of the multi-property scaffolding on this screen, and it
              is deliberately not a switcher yet.
            */}
            <Band kind="rail" flush>
              <BandHead
                icon="map-pin"
                iconTone="neutral"
                title={plural(properties.length, {
                  one: 'account.property.titleOne',
                  other: 'account.property.titleOther',
                })}
              />
              <RowList>
                {properties.map((owned) => {
                  const system = systemsForProperty(owned.id)[0];
                  return (
                    <Row key={owned.id} to="/system">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-section text-ink">{owned.address}</p>
                          <p className="text-caption text-ink2">
                            {owned.city}, {owned.province}
                          </p>
                          {system && (
                            <p className="mt-1 text-caption text-ink3">
                              {t('account.property.system', {
                                product: system.model,
                                date: longDate(system.installedOn),
                              })}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-ink3">
                          <Icon name="chevron-right" />
                        </span>
                      </div>
                    </Row>
                  );
                })}
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                <p className="max-w-reading text-caption text-ink2">
                  {t('account.property.addHint')}
                </p>
              </div>
            </Band>

            {/* Plan and money. Two existing screens, given a front door. */}
            {contract && (
              <Band kind="data" flush>
                <BandHead icon="file-text" title={t('account.plan.title')} />
                <RowList>
                  <Row to="/contract">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-section text-ink">{contract.name}</p>
                        <p className="text-caption text-ink2">
                          {t('account.plan.renews', { date: longDate(contract.renewsOn) })}
                        </p>
                      </div>
                      <Status tone={contract.autopay ? 'good' : 'warn'}>
                        {contract.autopay
                          ? t('account.plan.autopayOn')
                          : t('account.plan.autopayOff')}
                      </Status>
                    </div>
                  </Row>
                  <Row to="/invoices">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-body text-ink">{t('account.plan.invoices')}</p>
                        <p className="text-caption text-ink2">{t('account.plan.invoicesDetail')}</p>
                      </div>
                      <span className="shrink-0 text-ink3">
                        <Icon name="chevron-right" />
                      </span>
                    </div>
                  </Row>
                </RowList>
              </Band>
            )}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section id="account-preferences">
          <div className="contents">
            <Band kind="rail" flush>
              <BandHead icon="info" iconTone="neutral" title={t('account.prefs.title')} />

              {/*
                Language. A tab strip rather than a dropdown, because there are
                two options and a control that hides one of two choices behind a
                tap is a control that has made the screen worse to save 40px.
              */}
              <div className="border-t border-line px-gutter py-3">
                <Micro>{t('account.prefs.language')}</Micro>
                <div className="mt-2">
                  <Tabs
                    label={t('account.prefs.language')}
                    value={getLocale()}
                    onChange={(value) => setLocale(value as Locale)}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'fr', label: 'Français' },
                    ]}
                  />
                </div>
                <p className="mt-3 max-w-reading text-caption text-ink2">
                  {t('account.prefs.languageHint')}
                </p>
              </div>

              <div className="border-t border-line px-gutter pt-3">
                <Micro>{t('account.prefs.notifications')}</Micro>
              </div>
              <RowList>
                {TOPICS.map((topic) => (
                  <Row key={topic.key}>
                    <Toggle
                      label={t(`account.prefs.${topic.key}` as Parameters<typeof t>[0])}
                      hint={t(`account.prefs.${topic.key}Hint` as Parameters<typeof t>[0])}
                      checked={topics[topic.key]}
                      onChange={(next) =>
                        setTopics((current) => ({ ...current, [topic.key]: next }))
                      }
                    />
                  </Row>
                ))}
              </RowList>
            </Band>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Band kind="data" flush>
          <BandHead icon="message-square" title={t('account.help.title')} />
          <RowList>
            <Row to="/messages">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-body text-ink">{t('account.help.messages')}</p>
                  <p className="text-caption text-ink2">{t('account.help.messagesDetail')}</p>
                </div>
                {UNREAD > 0 && (
                  <Status tone="info">
                    {plural(UNREAD, {
                      one: 'account.help.messagesUnreadOne',
                      other: 'account.help.messagesUnreadOther',
                    })}
                  </Status>
                )}
              </div>
            </Row>
            <Row to="/system">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-body text-ink">{t('account.help.documents')}</p>
                  <p className="text-caption text-ink2">{t('account.help.documentsDetail')}</p>
                </div>
                <span className="shrink-0 text-ink3">
                  <Icon name="chevron-right" />
                </span>
              </div>
            </Row>
          </RowList>
          <div className="border-t border-line px-gutter py-3">
            <ButtonLink to="/messages" variant="quiet" icon="message-square">
              {t('account.help.call', { servicePoint: servicePoint.name })}
            </ButtonLink>
          </div>
        </Band>

        {/*
          Sign out, on the closing ground and not dressed as a danger.

          It is reversible in one tap, so the alert treatment some products give
          it is theatre. What it does need is to be findable, which on this screen
          means the last thing, where a person looks for it.
        */}
        <Band kind="closing">
          <ButtonLink to="/home" variant="quiet" icon="user">
            {t('account.signOut')}
          </ButtonLink>
          <p className="mt-2 text-caption text-ink3">
            {t('account.signedInAs', { name: `${person.firstName} ${person.lastName}` })}
          </p>
        </Band>
      </div>
    </>
  );
};
