/**
 * screens/owner/System.tsx
 *
 * Screen 8. My system.
 *
 * The asset record. Everything that is a fact about the thing in the ground,
 * and everything that has ever happened to it. What is happening now lives on
 * Home; this screen deliberately holds no live state, which is the other half of
 * the split that removed the sixty percent overlap between the two.
 *
 * It does not open with a title card. It used to open with a dark band setting
 * "Ecoflo compact biofilter" at 48px, which on an iPhone SE was an entire
 * viewport spent restating the tab the reader had just tapped. It opens with the
 * record instead: the property, the model, the condition.
 *
 * The unified timeline is the argument this screen exists to make. Service
 * visits and parts orders arrive from different systems and the customer does
 * not care which, so they are one chronological list with year markers. Until
 * this pass the list rendered orders only, and that was never a rendering fault:
 * the merge was correct and the account had no completed visits in it. For a
 * care plan business the visit record is the product being sold.
 *
 * Condition is stated in plain language, not scored. A health percentage would
 * be a number we cannot defend. Media life is a percentage, and it is allowed to
 * be one because it is arithmetic on two dates rather than a judgement, and the
 * screen says on its face that it is an estimate.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  SESSION,
  byId,
  contracts,
  customerTimeline,
  environmentalImpact,
  mediaLife,
  orders,
  propertiesForContact,
  resources,
  systemsForProperty,
  workOrders,
  type TimelineEntry,
} from '../../data/seedData';
import { plural, t } from '../../i18n';
import { approxCount, longDate, money, shortDate } from '../../lib/format';
import { SystemCutaway, MediaLifeRing, type CutawayLayer } from '../../ui/SystemCutaway';
import { useCountUp } from '../../ui/motion';
import {
  Avatar,
  Band,
  BandHead,
  ButtonLink,
  Field,
  Icon,
  Metric,
  Micro,
  Row,
  Share,
  RowList,
  Status,
} from '../../ui/primitives';

const CONDITION = {
  healthy: { line: 'system.healthy', detail: 'system.healthyDetail', tone: 'good' },
  attention: { line: 'system.attention', detail: 'system.attentionDetail', tone: 'warn' },
  'service-due': { line: 'system.due', detail: 'system.dueDetail', tone: 'alert' },
} as const;

/** What a visit was, in the words a customer would use for it. */
const visitLabel = (type: string): string => {
  switch (type) {
    case 'install':
      return t('system.history.install');
    case 'FMR':
      return t('system.history.mediaReplacement');
    case 'repair':
      return t('system.history.repair');
    default:
      return t('system.history.visit');
  }
};

/**
 * One entry on the timeline.
 *
 * Visits and orders share the rail and the date, and differ in everything a
 * reader uses to tell them apart: a visit has a face, a summary in plain
 * language and sometimes a photograph; an order has a glyph and a list of part
 * numbers. That is the distinction the brief asked for, drawn with content
 * rather than with a colour, so it survives being printed and being read by
 * somebody who cannot separate the two hues.
 */
const Entry = ({ entry, last }: { entry: TimelineEntry; last: boolean }) => {
  const isVisit = entry.kind === 'visit';
  const visit = isVisit ? byId(workOrders, entry.id) : undefined;
  const order = isVisit ? undefined : byId(orders, entry.id);
  const technician = entry.resourceId ? byId(resources, entry.resourceId) : undefined;

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {/*
        The rail, drawn behind the marker rather than as a border on the item, so
        it can stop at the last entry instead of running off the end of the list.

        `left-3` is 16px, the centre of the 32px marker beside it. Passed an
        explicit `last` rather than styled with `last:`, because the selector
        would have matched the last entry of each year group and the rail has to
        run through a year boundary: 2026 ends and 2025 continues the same line.
      */}
      {!last && (
        <span aria-hidden className="absolute bottom-0 left-3 top-4 w-px bg-line" />
      )}

      <span className="relative z-frame mt-1 shrink-0">
        {isVisit && technician ? (
          <Avatar
            name={technician.name}
            initials={technician.initials}
            photo={technician.photo}
            size="md"
          />
        ) : (
          <span className="grid h-5 w-5 place-items-center rounded-pill border border-line bg-surface text-ink3">
            <Icon name="package" />
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 text-section text-ink">
            {isVisit ? visitLabel(visit?.type ?? '') : t('system.history.order')}
          </p>
          <p className="shrink-0 text-caption text-ink3">{shortDate(entry.date)}</p>
        </div>

        {isVisit && technician && (
          <p className="mt-0.5 text-caption text-ink3">
            {t('system.history.by', { name: technician.name })}
          </p>
        )}

        {/* The plain-language summary, not the checklist. */}
        {entry.summary && (
          <p className="mt-1 max-w-reading text-body text-ink2">{entry.summary}</p>
        )}

        {order && (
          <p className="mt-1 text-body text-ink2">
            {order.lines.map((line) => `${line.quantity} x ${line.sku}`).join(', ')}.{' '}
            {money(order.total_jde, order.currency)}.
          </p>
        )}

        {/*
          The photograph, where there is one.

          Only one visit has one, because field photo capture does not exist yet
          and the history before it lands genuinely has no pictures. That is the
          honest state, and it is also the argument: a reader looking at this
          list can see immediately what the field app would add to every entry.
        */}
        {entry.photos.map((photo) => (
          <img
            key={photo}
            src={photo}
            alt={t('system.history.photo')}
            className="mt-2 h-media-sm w-full rounded-control border border-line object-cover"
          />
        ))}
      </div>
    </li>
  );
};

export const OwnerSystem = () => {
  const property = propertiesForContact(SESSION.contactId)[0];
  const asset = systemsForProperty(property.id)[0];
  const contract = contracts.find((c) => c.accountId === property.id && c.status === 'active');
  const condition = CONDITION[asset.status];
  const timeline = customerTimeline(property.id);
  const media = mediaLife(asset.id);

  const shownMedia = useCountUp(media?.remaining ?? 0);
  const [layer, setLayer] = useState<CutawayLayer | null>(null);

  const impact = environmentalImpact(asset.id);
  const shownLitres = useCountUp(impact ? Math.round(impact.litres / 1000) : 0);
  const shownKwh = useCountUp(impact?.kwhAvoided ?? 0);
  const replacing = media?.bookedVisit;
  const replacingBy = replacing ? byId(resources, replacing.resourceId) : undefined;

  /** Year markers. The list is already newest first, so this preserves that. */
  const years = [...new Set(timeline.map((entry) => entry.date.slice(0, 4)))];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* The record opens the screen. No title card.                        */}
      {/* ------------------------------------------------------------------ */}
      <Section id="system-info">
        {/* py-0: a Rail band's vertical padding above a full-bleed photograph is
            24px of empty ground between the top of the screen and the image. */}
        <Band kind="rail" flush className="py-0">
          <img
            src="/img/property.jpg"
            alt={`${property.address}, ${property.city}`}
            className="h-media-sm w-full border-b border-line object-cover"
          />

          <div className="px-gutter py-3">
            <Micro>{t('system.eyebrow')}</Micro>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <p className="min-w-0 text-hero text-ink">{asset.model}</p>
              <Status tone={condition.tone}>{t(condition.line)}</Status>
            </div>
            <p className="mt-2 max-w-reading text-body text-ink2">
              {t('system.at', { address: property.address, city: property.city })}{' '}
              {t(condition.detail)}
            </p>
          </div>

          {/*
            Media life.

            A percentage is allowed here where a health score is not, because it
            is arithmetic on two dates rather than a judgement, and the card says
            on its face that it is an estimate. There is no sensor in an Ecoflo.
            The Phase 5 cross section replaces this block with the same figure
            drawn as a ring; the derivation does not change.
          */}
          {media && (
            <div className="border-t border-line px-gutter py-4">
              {/*
                The figure and its ring, then the drawing.

                A percentage is allowed here where a health score is not, because
                it is arithmetic on two dates rather than a judgement, and the
                card says on its face that it is an estimate. There is no sensor
                in an Ecoflo, and a homeowner who believes a number is measured
                will trust it in a way they should not trust a calendar.
              */}
              <div className="flex items-center gap-3">
                <MediaLifeRing
                  percent={media.remaining}
                  label={t('system.cutaway.ring', { percent: media.remaining })}
                />
                <div className="min-w-0">
                  <Micro>{t('system.media.title')}</Micro>
                  <p className="mt-1 text-h1 text-ink">
                    {media.remaining === 0
                      ? t('system.media.due')
                      : t('system.media.remaining', { percent: shownMedia })}
                  </p>
                  <p className="mt-1 max-w-reading text-caption text-ink2">
                    {replacing && replacingBy
                      ? t('system.media.booked', {
                          name: replacingBy.name.split(' ')[0],
                          date: shortDate(replacing.scheduledFor),
                        })
                      : media.original
                        ? t('system.media.original', { date: longDate(media.lastReplacedOn) })
                        : t('system.media.since', { date: longDate(media.lastReplacedOn) })}
                  </p>
                </div>
              </div>

              {/*
                The drawing. Below the figure rather than behind it: a ring
                overlaid on a cross section at 353px puts two things a reader has
                to decode in the same 100 square pixels.
              */}
              <div className="mt-4">
                <SystemCutaway selected={layer} onSelect={setLayer} />
              </div>

              {/*
                The explanation replaces the hint in place, so the block does not
                change height when a part is tapped and push the facts below it
                down the screen.
              */}
              <div className="mt-3 min-h-cutaway-note">
                {layer ? (
                  <>
                    <p className="text-section text-ink">
                      {t(`system.cutaway.${layer}` as Parameters<typeof t>[0])}
                    </p>
                    <p className="mt-1 max-w-reading text-body text-ink2">
                      {t(`system.cutaway.${layer}Detail` as Parameters<typeof t>[0])}
                    </p>
                  </>
                ) : (
                  <p className="text-body text-ink3">{t('system.cutaway.hint')}</p>
                )}
              </div>

              <p className="mt-2 text-caption text-ink3">{t('system.media.estimate')}</p>
            </div>
          )}

          <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
            <Field label={t('system.facts.model')} value={asset.model} mono />
            <Field label={t('system.facts.serial')} value={asset.serial} mono />
            <Field label={t('system.facts.installed')} value={longDate(asset.installedOn)} />
            <Field label={t('system.facts.lastVisit')} value={longDate(asset.lastServiceOn)} />
            <Field label={t('system.facts.warranty')} value={longDate(asset.warrantyEndsOn)} />
          </dl>
        </Band>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* One timeline. Visits and orders together, newest first.            */}
      {/* ------------------------------------------------------------------ */}
      <Section id="system-history">
        <Band kind="data" flush>
          <BandHead
            eyebrow={plural(timeline.length, {
              one: 'system.history.countOne',
              other: 'system.history.countOther',
            })}
            title={t('system.history.title')}
          />

          {timeline.length === 0 ? (
            <p className="px-gutter pb-4 text-body text-ink2">{t('system.history.empty')}</p>
          ) : (
            <div className="px-gutter pb-4">
              {years.map((year) => (
                <section key={year}>
                  {/*
                    Year markers, so seven years of history can be scanned rather
                    than counted. They are `micro` on the ground rather than a
                    heading, because they are wayfinding inside one list and not
                    a new section of the screen.
                  */}
                  {/*
                    Not sticky. Pinned, the marker sat on top of the entry
                    scrolling under it and clipped its heading through the middle,
                    which reads as a rendering fault rather than as wayfinding.
                    Seven years is a list you scan, not one you get lost in.
                  */}
                  <div className="py-2">
                    <Micro>{year}</Micro>
                  </div>
                  <ul>
                    {timeline
                      .filter((entry) => entry.date.startsWith(year))
                      .map((entry) => (
                        <Entry
                          key={entry.id}
                          entry={entry}
                          last={entry.id === timeline[timeline.length - 1]?.id}
                        />
                      ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </Band>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* What a passive biofilter has quietly not done.                     */}
      {/* ------------------------------------------------------------------ */}
      {impact && (
        <Section id="system-impact">
          <Band kind="data" flush>
            <BandHead title={t('impact.title')} />
            <div className="flex gap-2 px-gutter pb-3">
              <Metric
                label={t('impact.litres')}
                value={approxCount(shownLitres * 1000)}
                note={t('impact.litresNote', { date: longDate(asset.installedOn) })}
              />
              <Metric
                label={t('impact.energy')}
                value={approxCount(shownKwh)}
                unit={t('impact.kwh')}
                tone="positive"
                note={t('impact.energyNote')}
              />
            </div>
            <div className="px-gutter pb-4">
              <p className="max-w-reading text-body text-ink2">{t('impact.body')}</p>
              {/*
                Labelled an estimate, in the same place a reader looks for the
                figure rather than in a footnote. Both inputs are assumptions in
                ASSUMPTIONS with a TODO on them, and the comparison against an
                aerated system is a claim PTWE has to be willing to make in a
                regulated market before this card ships.
              */}
              <p className="mt-2 text-caption text-ink3">{t('impact.estimate')}</p>
              <Share
                className="mt-3"
                title={t('impact.shareTitle')}
                text={t('impact.shareText', {
                  litres: approxCount(impact.litres),
                  year: asset.installedOn.slice(0, 4),
                })}
                label={t('impact.share')}
              />
            </div>
          </Band>
        </Section>
      )}

      {/* ------------------------------------------------------------------ */}
      <Section id="system-documents">
        <Band kind="rail" flush>
          <BandHead icon="file-text" title={t('system.documents.title')} />
          <RowList>
            {[
              {
                label: t('system.documents.certificate'),
                detail: longDate(asset.installedOn),
              },
              {
                label: t('system.documents.warranty'),
                detail: t('system.documents.validTo', { date: longDate(asset.warrantyEndsOn) }),
              },
              ...(contract
                ? [{ label: t('system.documents.plan'), detail: contract.name }]
                : []),
              {
                label: t('system.documents.guide'),
                detail: t('system.documents.forModel', { model: asset.model }),
              },
            ].map((document) => (
              <Row key={document.label}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 text-ink3">
                      <Icon name="file-text" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-body text-ink">{document.label}</p>
                      <p className="text-caption text-ink2">{document.detail}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-ink3">
                    <Icon name="chevron-right" />
                  </span>
                </div>
              </Row>
            ))}
          </RowList>
        </Band>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Booking left the tab bar, so it is an action here.                 */}
      {/* ------------------------------------------------------------------ */}
      <Band kind="data">
        <div className="py-3">
          <ButtonLink to="/book" variant="primary" size="primary" icon="calendar" block>
            {t('system.cta.book')}
          </ButtonLink>
        </div>
      </Band>

      <Band kind="closing">
        <Micro>{t('system.transfer.title')}</Micro>
        <p className="mt-1 max-w-reading text-caption text-ink2">{t('system.transfer.detail')}</p>
        <ButtonLink to="/system/transfer" variant="quiet" className="mt-3">
          {t('system.transfer.action')}
        </ButtonLink>
      </Band>
    </>
  );
};
