/**
 * screens/owner/Home.tsx
 *
 * Screen 7. Hero.
 *
 * Home answers one question: what is happening, and what needs me. Everything
 * that is a record rather than an event moved to the System tab.
 *
 * The two screens used to be around sixty percent the same content. Home carried
 * the system, the care plan and the invoices as quiet rows, and System carried
 * all three again with more detail, so a customer reading down Home learned
 * nothing they would not learn on System and had no way to tell which one they
 * were supposed to be on. Splitting them by responsibility rather than by topic
 * is the fix: Home is now, System is the record.
 *
 * The dominant block carries state, not a title. It has two genuinely different
 * appearances, and the difference is the point. Before this, "Marc is on the way"
 * sat as a line of body text under a date, in the same treatment the screen used
 * for "Marc is confirmed for this visit", so the one moment that is actually
 * urgent looked exactly like the eleven months that are not.
 *
 * Nothing on this screen invents a number. The arrival countdown comes off the
 * field app's route fields, media life off the last replacement, plan value off
 * committed covered work. Where a figure rests on an assumption, the assumption
 * is in ASSUMPTIONS in seedData with a TODO on it.
 */

import { Link } from 'react-router-dom';
import { Section } from '../../blueprint/Section';
import {
  SESSION,
  byId,
  contracts,
  customerTimeline,
  mediaLife,
  planValue,
  propertiesForContact,
  resources,
  systemsForProperty,
  territories,
  unreadMessages,
  workOrders,
} from '../../data/seedData';
import { plural, t } from '../../i18n';
import { arrival, isToday, longDate, money, relativeDay, shortDate, window as timeWindow } from '../../lib/format';
import { useCountUp } from '../../ui/motion';
import {
  Avatar,
  Band,
  Button,
  ButtonLink,
  Card,
  Fact,
  Icon,
  Metric,
  Micro,
  Status,
  Track,
} from '../../ui/primitives';

/** Condition in words. The status enum never reaches the customer. */
const CONDITION = {
  healthy: { key: 'home.system.healthy', tone: 'good' },
  attention: { key: 'home.system.attention', tone: 'warn' },
  'service-due': { key: 'home.system.due', tone: 'alert' },
} as const;

export const OwnerHome = () => {
  /* The property this session is looking at. One today; the model allows N. */
  const property = propertiesForContact(SESSION.contactId)[0];
  const asset = systemsForProperty(property.id)[0];
  const contract = contracts.find((c) => c.accountId === property.id && c.status === 'active');
  const servicePoint = byId(territories, property.territoryId)!;

  const visit = workOrders
    .filter((w) => w.accountId === property.id && w.status !== 'complete')
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0];
  const technician = visit ? byId(resources, visit.resourceId) : undefined;

  const live = visit ? arrival(visit.enRouteSince, visit.etaAt) : null;
  const working = visit?.status === 'in-progress';

  const media = mediaLife(asset.id);
  const value = planValue(property.id, Number(new Date().getFullYear()) || 2026);
  const visitCount = customerTimeline(property.id).filter((e) => e.kind === 'visit').length;

  const condition = CONDITION[asset.status];
  const unread = unreadMessages(property.id);

  /* Counters run once on mount, and not at all under reduced motion. */
  const shownMedia = useCountUp(media?.remaining ?? 0);
  const shownValue = useCountUp(value?.covered ?? 0);
  const shownVisits = useCountUp(visitCount);

  const firstName = technician?.name.split(' ')[0] ?? '';

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Header. Which property, and the two things that can be waiting.    */}
      {/* ------------------------------------------------------------------ */}
      <Band kind="lead" className="py-3">
        <div className="flex items-center justify-between gap-3">
          {/*
            The property name is a control, not a label, even though there is one
            property today. Building the affordance now means the second property
            is a data change; adding it later means finding every screen that
            assumed one. It goes to Account, which is where the list lives.
          */}
          <ButtonLink
            to="/account"
            variant="plain"
            className="min-w-0"
            aria-label={t('home.header.switchProperty')}
          >
            <span className="min-w-0 truncate text-section text-ink">{property.address}</span>
            <span className="shrink-0 text-ink3">
              <Icon name="chevron-down" />
            </span>
          </ButtonLink>

          <div className="flex shrink-0 items-center gap-1">
            {/*
              One inbox, not two.

              The brief asked for a notifications icon beside the cart. A
              homeowner with one system does not need two inboxes, and the icon
              budget is fourteen with nothing spare, so notifications and messages
              from the Service Point are one destination and one glyph. Splitting
              them would add a fifteenth icon and a second place to check.
            */}
            <ButtonLink
              to="/messages"
              variant="plain"
              aria-label={plural(unread, {
                one: 'home.header.messagesUnreadOne',
                other: 'home.header.messagesUnreadOther',
              })}
            >
              <span className="relative text-ink2">
                <Icon name="message-square" />
                {unread > 0 && (
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-0.5 h-1 w-1 rounded-pill bg-accent"
                  />
                )}
              </span>
            </ButtonLink>
            <ButtonLink to="/parts" variant="plain" aria-label={t('home.header.cart')}>
              <span className="text-ink2">
                <Icon name="package" />
              </span>
            </ButtonLink>
          </div>
        </div>
      </Band>

      {/*
        Everything below the header is one band with one gap, rather than four
        bands each bringing its own vertical padding. Stacked bands were adding
        their pb to the next one's pt and opening 64px trenches between blocks
        that belong to each other, which on a 393px screen pushed the metric row
        below the fold.
      */}
      <Band kind="lead" className="flex flex-col gap-3 pt-0">
        {/* -------------------------------------------------------------- */}
        {/* The hero. State, in one of two appearances.                    */}
        {/* -------------------------------------------------------------- */}
        <Section id="next-visit">
          <div>
          {visit && technician ? (
            live || working ? (
              /*
                Live. The deep ground, a countdown at the top of the scale, a
                track, and two actions that only make sense while somebody is
                actually moving toward the house.
              */
              <Card tone="brand">
                <div className="p-3">
                  <Micro className="text-on-band-muted">{t('home.visit.liveEyebrow')}</Micro>
                  {/*
                    The figure leads.

                    It was the whole sentence at the top of the scale, which on a
                    375px screen wrapped and left "min" alone on the second line.
                    What the reader wants biggest is the number of minutes; who is
                    bringing them is the line underneath, next to his face. The
                    sentence is still complete, it is just not all one size.
                  */}
                  <p className="mt-2 text-hero text-on-band">
                    {working
                      ? t('home.visit.liveWorking')
                      : live && live.minutesAway > 0
                        ? t('home.visit.liveTitle', { minutes: live.minutesAway })
                        : t('home.visit.liveArriving')}
                  </p>

                  <div className="mt-3">
                    {live && !working && <Track progress={live.progress} onBand />}
                    <p className="mt-2 max-w-reading text-caption text-on-band opacity-80">
                      {working
                        ? t('home.visit.liveWorkingDetail', { name: firstName })
                        : t('home.visit.liveFrom', {
                            name: firstName,
                            servicePoint: servicePoint.name,
                          })}
                    </p>
                  </div>

                  <div className="border-on-band-soft mt-3 flex items-center gap-3 border-t pt-3">
                    <Avatar
                      name={technician.name}
                      initials={technician.initials}
                      photo={technician.photo}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium text-on-band">{technician.name}</p>
                      <p className="text-caption text-on-band opacity-80">
                        {timeWindow(visit.windowStart, visit.windowEnd)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button variant="primary" size="secondary" onBand icon="map-pin">
                      {t('home.visit.track')}
                    </Button>
                    <ButtonLink
                      to="/messages"
                      variant="quiet"
                      size="secondary"
                      onBand
                      icon="message-square"
                    >
                      {t('home.visit.message', { name: firstName })}
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            ) : (
              /*
                Scheduled. A light card, a date at the top of the scale, no
                countdown and no track, because there is nothing to count down to
                for another eleven days and a progress bar at zero is a lie.
              */
              <Card>
                <div className="p-3">
                  <Micro className="text-ink3">{t('home.visit.nextEyebrow')}</Micro>
                  <p className="mt-2 text-hero text-ink">
                    {isToday(visit.scheduledFor)
                      ? t('home.visit.today')
                      : (relativeDay(visit.scheduledFor) ?? shortDate(visit.scheduledFor))}
                  </p>
                  <p className="mt-1 text-body text-ink2">
                    {t('home.visit.window', {
                      window: timeWindow(visit.windowStart, visit.windowEnd),
                    })}
                  </p>

                  <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                    <Avatar
                      name={technician.name}
                      initials={technician.initials}
                      photo={technician.photo}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium text-ink">{technician.name}</p>
                      <p className="text-caption text-ink2">{servicePoint.name}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          ) : (
            <Card>
              <div className="p-3">
                <Micro className="text-ink3">{t('home.visit.nextEyebrow')}</Micro>
                <p className="mt-2 text-hero text-ink">{t('home.visit.noneTitle')}</p>
                <p className="mt-2 max-w-reading text-body text-ink2">
                  {t('home.visit.noneLead', { date: longDate(asset.nextServiceDue) })}
                </p>
              </div>
            </Card>
          )}

          {/*
            What the visit is, as one line and three chips.

            This was twenty-five words of prose carrying three facts. A chip can
            be scanned; a sentence has to be read, and a reader checking whether
            they need to be home does not want to parse a subordinate clause to
            find out.
          */}
          {visit && (
            <div className="mt-3">
              <p className="max-w-reading text-body text-ink2">{t('home.visit.doing')}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Fact>{t('home.visit.factWork')}</Fact>
                {visit.contractId && <Fact>{t('home.visit.factCovered')}</Fact>}
                <Fact>{t('home.visit.factAccess')}</Fact>
              </div>
            </div>
          )}
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* Three figures, read against each other.                        */}
        {/* -------------------------------------------------------------- */}
        <Section id="home-metrics">
          <div className="flex gap-2">
            {media && (
              <Metric
                label={t('home.metric.mediaLife')}
                value={String(shownMedia)}
                unit="%"
                tone={media.remaining === 0 ? 'info' : 'ink'}
                note={
                  media.bookedVisit
                    ? t('home.metric.mediaLifeDue')
                    : t('home.metric.mediaLifeNote', { date: shortDate(media.dueOn) })
                }
                to="/system"
              />
            )}
            {value && (
              <Metric
                label={t('home.metric.planValue')}
                value={money(shownValue, value.currency)}
                tone={value.ahead > 0 ? 'positive' : 'ink'}
                note={t('home.metric.planValueNote')}
                to="/contract"
              />
            )}
            <Metric
              label={t('home.metric.visits')}
              value={String(shownVisits)}
              note={t('home.metric.visitsNote')}
              to="/system"
            />
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* The system, summarised. The record itself is one tap away.     */}
        {/* -------------------------------------------------------------- */}
        <Card>
          <Link
            to="/system"
            className="flex items-center gap-3 p-3 transition-colors duration-state ease-ease hover:bg-surface-sunk"
          >
            <div className="min-w-0 flex-1">
              <Micro className="text-ink3">{t('home.system.eyebrow')}</Micro>
              <p className="mt-1 text-section text-ink">{asset.model}</p>
              {contract && (
                <p className="mt-1 text-caption text-ink2">
                  {t('home.system.plan', {
                    plan: contract.name,
                    date: longDate(contract.renewsOn),
                  })}
                </p>
              )}
            </div>
            <Status tone={condition.tone}>{t(condition.key)}</Status>
            <span className="shrink-0 text-ink3">
              <Icon name="chevron-right" />
            </span>
          </Link>
        </Card>

        {/* -------------------------------------------------------------- */}
        {/* The two things a person comes here to do.                      */}
        {/* -------------------------------------------------------------- */}
        <div className="flex flex-col gap-2">
          <ButtonLink to="/book" variant="primary" size="primary" icon="calendar" block>
            {t('home.cta.book')}
          </ButtonLink>
          <ButtonLink to="/parts" variant="quiet" size="primary" icon="package" block>
            {t('home.cta.shop')}
          </ButtonLink>
        </div>
      </Band>
    </>
  );
};
