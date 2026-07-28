/**
 * screens/technician/WorkOrder.tsx
 *
 * Screen 17. Hero.
 *
 * The operational credibility screen. If the field audience does not believe
 * this one, nothing else in the prototype matters to them.
 *
 * Two things earn that belief. The offline indicator, because somebody thought
 * about a basement with no signal and said so on screen. And the translation
 * layer at the bottom: the technician's checklist is not what the customer
 * reads, and the plain-language summary generated from it is a real design
 * decision that reviewers will ask about. It is annotated, not hidden.
 *
 * Forest appears here on the active job header. That is the second and last
 * place it appears in V1.
 */

import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Section } from '../../blueprint/Section';
import {
  accounts,
  assets,
  byId,
  contacts,
  contracts,
  inventory,
  resources,
  workOrders,
  type ChecklistItem,
} from '../../data/seedData';
import { duration, humanise, window as timeWindow } from '../../lib/format';
import {
  Button,
  Card,
  CardHeader,
  Flag,
  Icon,
  Identifier,
  Micro,
  Row,
  RowList,
  Stack,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/**
 * The translation layer, stated as code so reviewers can see it is mechanical
 * rather than a promise. Checklist output goes in, customer prose comes out.
 *
 * This is deliberately a small, legible function. The real implementation is an
 * open question, and the annotation records it: template, rules engine, or a
 * generated draft a human approves.
 */
const customerSummaryFrom = (items: ChecklistItem[], assetModel: string): string => {
  const done = items.filter((i) => i.type === 'check' && i.value === true).length;
  const replaced = items.some((i) => i.label.toLowerCase().includes('media') && i.value === true);
  const clarity = items.find((i) => i.type === 'measure')?.value;

  const parts: string[] = [];
  parts.push(
    replaced
      ? `We replaced the filter media in your ${assetModel} and checked the system over.`
      : `We checked your ${assetModel} over.`,
  );
  if (typeof clarity === 'string' && clarity.length > 0) {
    parts.push('The water leaving the system looks the way it should.');
  }
  if (done > 0) {
    parts.push('Everything is working as it should and the site was left clean.');
  }
  parts.push('There is nothing you need to do.');
  return parts.join(' ');
};

/**
 * The stages a visit actually runs in.
 *
 * Grouping lives here rather than in seedData because it is a presentation
 * decision about this screen. If this ships, a `stage` field on ChecklistItem is
 * the right home for it, so the field team can reorder a procedure without a
 * release. The fallback keeps an unmapped item visible rather than dropping it.
 */
const STAGES = [
  { key: 'arrival', label: 'On arrival' },
  { key: 'work', label: 'The work' },
  { key: 'closing', label: 'Before you leave' },
] as const;

type StageKey = (typeof STAGES)[number]['key'];

const STAGE_OF: Record<string, StageKey> = {
  'CL-1': 'arrival',
  'CL-5': 'arrival',
  'CL-2': 'arrival',
  'CL-3': 'work',
  'CL-4': 'work',
  'CL-6': 'closing',
  'CL-7': 'closing',
  'CL-8': 'closing',
};

const stageOf = (itemId: string): StageKey => STAGE_OF[itemId] ?? 'work';

export const TechnicianWorkOrder = () => {
  const { id } = useParams();
  const order = byId(workOrders, id ?? '') ?? byId(workOrders, 'WO-2026-0412')!;

  const account = byId(accounts, order.accountId)!;
  const asset = byId(assets, order.assetId)!;
  const contract = order.contractId ? byId(contracts, order.contractId) : undefined;
  const technician = byId(resources, order.resourceId)!;
  const customer = contacts.find((c) => c.accountId === account.id && c.isPrimary)!;

  // Local working copy: this is the technician filling the job in on site.
  const [items, setItems] = useState<ChecklistItem[]>(order.checklist);
  const [photos, setPhotos] = useState<Record<string, boolean>>({});
  const [signed, setSigned] = useState<string | null>(order.signedBy);
  const [online, setOnline] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const toggle = (itemId: string) =>
    setItems((current) =>
      current.map((i) => (i.id === itemId ? { ...i, value: i.value === true ? null : true } : i)),
    );

  const setMeasure = (itemId: string, value: string) =>
    setItems((current) => current.map((i) => (i.id === itemId ? { ...i, value } : i)));

  const capture = (itemId: string) => {
    setPhotos((current) => ({ ...current, [itemId]: true }));
    setItems((current) => current.map((i) => (i.id === itemId ? { ...i, value: true } : i)));
  };

  const required = items.filter((i) => i.required);
  const requiredCount = required.length;
  const doneCount = required.filter((i) => Boolean(i.value)).length;
  const requiredOutstanding = requiredCount - doneCount;
  const canClose = requiredOutstanding === 0 && signed !== null;

  const truckStock = inventory.filter((row) => row.location === 'truck');
  const summary = useMemo(() => customerSummaryFrom(items, asset.model), [items, asset.model]);

  /** One row per checklist item, by type. Called once per stage group. */
  const renderItem = (item: ChecklistItem) => {
    const complete = Boolean(item.value);

    if (item.type === 'photo') {
      return (
        <Row key={item.id} rule={complete ? 'strong' : 'neutral'}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-body text-ink">{item.label}</p>
              <p className="text-caption text-ink2">
                {/*
                  No thumbnail. There is no camera here, and showing a stock
                  photo of somebody else's tank would be the one dishonest thing
                  on the most credibility-sensitive screen in the build.
                */}
                {photos[item.id] ? 'Captured, held on this device' : 'Required'}
              </p>
            </div>
            <Button variant="quiet" icon="camera" onClick={() => capture(item.id)}>
              {complete ? 'Retake' : 'Take photo'}
            </Button>
          </div>
        </Row>
      );
    }

    if (item.type === 'measure') {
      return (
        <Row key={item.id} rule={complete ? 'strong' : 'neutral'}>
          <label className="block">
            <p className="text-body text-ink">{item.label}</p>
            <input
              type="text"
              value={typeof item.value === 'string' ? item.value : ''}
              onChange={(event) => setMeasure(item.id, event.target.value)}
              placeholder="Clear, slight haze, cloudy"
              className="mt-2 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink placeholder:text-ink3"
            />
          </label>
        </Row>
      );
    }

    if (item.type === 'note') {
      return (
        <Row key={item.id}>
          <label className="block">
            <p className="text-body text-ink">{item.label}</p>
            <p className="text-caption text-ink2">Optional</p>
            <textarea
              rows={3}
              value={typeof item.value === 'string' ? item.value : ''}
              onChange={(event) => setMeasure(item.id, event.target.value)}
              placeholder="Anything the next visit should know"
              className="mt-2 w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-body text-ink placeholder:text-ink3"
            />
          </label>
        </Row>
      );
    }

    // Plain check. The whole row is the control, at a 48px target.
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => toggle(item.id)}
        aria-pressed={complete}
        className={`flex min-h-tap w-full items-center justify-between gap-3 border-l-rule px-4 py-3 text-left transition-colors duration-state ease-ease ${
          complete ? 'border-l-ink' : 'border-l-line-strong'
        }`}
      >
        <div className="min-w-0">
          <p className={`text-body text-ink ${complete ? 'font-medium' : ''}`}>{item.label}</p>
          {item.required && !complete && <p className="text-caption text-ink2">Required</p>}
        </div>
        <span
          className={`grid h-4 w-4 shrink-0 place-items-center rounded-control border ${
            complete ? 'border-ink bg-ink text-canvas' : 'border-line-strong text-transparent'
          }`}
        >
          <Icon name="check" />
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Padding at the base clears the sticky action bar. */}
      <div className="pb-6">
        <ScreenBody flush>
          <Stack gap="3">
            {/* -------------------------------------------------------------- */}
            {/* Active job header. Forest, for the second and last time in V1.  */}
            {/* -------------------------------------------------------------- */}
            <div className="bg-forest px-gutter py-4 text-on-forest">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Micro className="text-on-forest opacity-70">
                    {humanise(order.status)}
                  </Micro>
                  <h1 className="mt-1 text-h1">{account.name}</h1>
                  <p className="mt-1 text-caption opacity-90">
                    {account.address}, {account.city}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-h2">{timeWindow(order.windowStart, order.windowEnd)}</p>
                  <p className="text-caption opacity-70">{duration(order.durationMin)}</p>
                </div>
              </div>

              <div className="border-on-forest-soft mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
                <span className="font-mono text-caption uppercase opacity-90">{order.id}</span>
                <span className="text-caption opacity-70">
                  {asset.model}, serial {asset.serial}
                </span>
                {contract && <span className="text-caption opacity-70">{contract.name}</span>}
              </div>
            </div>

            <div className="px-gutter">
              <Stack gap="3">
                {/* ---------------------------------------------------------- */}
                {/* Offline. Stated plainly, because the field audience checks. */}
                {/* ---------------------------------------------------------- */}
                {/*
                  The demo control sits on its own line beneath the message
                  rather than beside it. Sharing the line costs the message about
                  half its width, and at phone width the offline warning, which
                  is the whole point of the block, turns into five short lines.
                */}
                <div
                  className={`rounded-control border px-3 py-2 ${
                    online ? 'border-line bg-surface' : 'border-warn bg-warn-soft'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-1 shrink-0 ${online ? 'text-positive' : 'text-warn'}`}>
                      <Icon name={online ? 'check' : 'alert-triangle'} />
                    </span>
                    <p className={`min-w-0 flex-1 text-caption ${online ? 'text-ink2' : 'text-warn'}`}>
                      {online
                        ? 'Online. Changes are saved as you make them.'
                        : 'No signal in this basement. Everything you record is saved on the device and syncs when you are back in range.'}
                    </p>
                  </div>
                  {/*
                    A demo control, not a product feature, and labelled as one so
                    nobody in the room mistakes it for something a technician
                    would tap. Real offline state comes from the device.
                  */}
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setOnline((v) => !v)}
                      title="Demo control"
                      className="shrink-0 rounded-control border border-line bg-surface px-2 py-1 font-mono text-micro text-ink3 transition-colors duration-state ease-ease hover:text-ink2"
                    >
                      {online ? 'demo: go offline' : 'demo: go online'}
                    </button>
                  </div>
                </div>

                {/* ---------------------------------------------------------- */}
                <Section id="wo-checklist">
                  <Stack gap="3">
                    <Card>
                      <CardHeader
                        icon="check"
                        title="Checklist"
                        eyebrow={
                          requiredOutstanding === 0
                            ? 'All required items done'
                            : `${doneCount} of ${requiredCount} required done`
                        }
                      />

                      {/*
                        Grouped in the order the job actually happens, so the
                        technician reads down the screen as they work rather than
                        hunting for the next item. Eight flat rows is a form; three
                        short stages is a procedure.
                      */}
                      {STAGES.map((stage) => {
                        const stageItems = items.filter(
                          (item) => stageOf(item.id) === stage.key,
                        );
                        if (stageItems.length === 0) return null;
                        const stageDone = stageItems.every((item) => !item.required || item.value);

                        return (
                          <div key={stage.key}>
                            <div className="flex items-center justify-between gap-3 border-y border-line bg-surface-sunk px-4 py-2">
                              <Micro>{stage.label}</Micro>
                              {stageDone && (
                                <span className="text-ink2">
                                  <Icon name="check" />
                                </span>
                              )}
                            </div>
                            <RowList>
                              {stageItems.map((item) => renderItem(item))}
                            </RowList>
                          </div>
                        );
                      })}
                    </Card>


                    {/* Parts consumed, against what is on the truck. */}
                    <Card>
                      <CardHeader icon="package" title="Parts used" eyebrow="Comes off truck stock" />
                      <RowList>
                        {order.lineItems.map((line) => {
                          const stock = truckStock.find((row) => row.sku === line.sku);
                          return (
                            <Row key={line.id}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-body text-ink">{line.description}</p>
                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    {line.sku && <Identifier>{line.sku}</Identifier>}
                                    {stock && (
                                      <span className="text-caption text-ink3">
                                        {stock.onHand} on truck
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="shrink-0 text-h2 text-ink">{line.quantity}</p>
                              </div>
                            </Row>
                          );
                        })}
                      </RowList>
                      <div className="border-t border-line px-4 py-3">
                        <Button variant="quiet" icon="package">
                          Add a part
                        </Button>
                      </div>
                    </Card>

                    {/* Time and signature. */}
                    <Card>
                      <CardHeader icon="user" title="Time and signature" />
                      <RowList>
                        <Row>
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-caption text-ink2">On site</p>
                            <p className="font-mono text-caption text-ink">
                              {order.windowStart} to {order.windowEnd}
                            </p>
                          </div>
                        </Row>
                        <Row>
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-caption text-ink2">Booked duration</p>
                            <p className="text-caption text-ink">{duration(order.durationMin)}</p>
                          </div>
                        </Row>
                        <Row rule={signed ? 'strong' : 'neutral'}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-body text-ink">Customer signature</p>
                              <p className="text-caption text-ink2">
                                {signed
                                  ? `Signed by ${signed}`
                                  : `${customer.firstName} ${customer.lastName}, on the device`}
                              </p>
                            </div>
                            <Button
                              variant="quiet"
                              onClick={() =>
                                setSigned(
                                  signed
                                    ? null
                                    : `${customer.firstName.charAt(0)}. ${customer.lastName}`,
                                )
                              }
                            >
                              {signed ? 'Clear' : 'Capture'}
                            </Button>
                          </div>
                        </Row>
                      </RowList>
                    </Card>
                  </Stack>
                </Section>

                {/* ---------------------------------------------------------- */}
                {/* The translation layer. Annotated because it is a decision. */}
                {/* ---------------------------------------------------------- */}
                <Section id="wo-summary-translation">
                  <Card>
                    <CardHeader
                      icon="message-square"
                      iconTone="neutral"
                      title="What the customer will read"
                      eyebrow="Generated from the checklist"
                      action={
                        <button
                          type="button"
                          onClick={() => setShowSummary((v) => !v)}
                          className="inline-flex items-center gap-1 text-caption text-accent-ink"
                        >
                          {showSummary ? 'Hide' : 'Show'}
                          <Icon name={showSummary ? 'chevron-down' : 'chevron-right'} />
                        </button>
                      }
                    />

                    <div className="px-4 py-3">
                      <p className="text-caption text-ink2">
                        Your checklist is not what the customer sees. A plain-language summary is
                        generated from it, and you can edit it before the job closes.
                      </p>
                    </div>

                    {showSummary && (
                      <>
                        <div className="border-t border-line bg-surface-sunk px-4 py-3">
                          <Micro>Your record</Micro>
                          <ul className="mt-2 space-y-1">
                            {items
                              .filter((i) => i.value)
                              .map((i) => (
                                <li key={i.id} className="font-mono text-caption text-ink2">
                                  {i.label}
                                  {typeof i.value === 'string' ? `: ${i.value}` : ': yes'}
                                </li>
                              ))}
                          </ul>
                          {items.every((i) => !i.value) && (
                            <p className="mt-2 text-caption text-ink3">
                              Nothing recorded yet. Work through the checklist above.
                            </p>
                          )}
                        </div>
                        <div className="border-t border-line px-4 py-3">
                          <Micro>What Sarah reads</Micro>
                          <p className="mt-2 text-body text-ink">{summary}</p>
                        </div>
                      </>
                    )}

                    <div className="border-t border-line px-4 py-3">
                      <Flag tone="warn" icon="alert-triangle">
                        How this is generated is undecided
                      </Flag>
                    </div>
                  </Card>
                </Section>

                {/* Field quote and safety, reachable from the job. */}
                <Card>
                  <RowList>
                    <Row to={`/wo/${order.id}/safety`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-body text-ink">Pre-job safety check</p>
                          <p className="text-caption text-ink2">Before work starts</p>
                        </div>
                        <span className="text-ink3">
                          <Icon name="chevron-right" />
                        </span>
                      </div>
                    </Row>
                    <Row to={`/wo/${order.id}/quote`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-body text-ink">Quote extra work</p>
                          <p className="text-caption text-ink2">
                            Found something outside the contract
                          </p>
                        </div>
                        <span className="text-ink3">
                          <Icon name="chevron-right" />
                        </span>
                      </div>
                    </Row>
                  </RowList>
                </Card>

                <p className="text-caption text-ink3">
                  {technician.name}, {order.id}. Records stay on the device until they sync.
                </p>
              </Stack>
            </div>
          </Stack>
        </ScreenBody>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Sticky action bar, pinned to the base of the viewport.           */}
      {/* ---------------------------------------------------------------- */}
      <div className="sticky bottom-0 z-nav border-t border-line bg-surface px-gutter py-3">
        {!canClose && (
          <p className="mb-2 text-caption text-warn">
            {requiredOutstanding > 0
              ? `${requiredOutstanding} required ${requiredOutstanding === 1 ? 'item' : 'items'} left`
              : 'Signature needed to close'}
          </p>
        )}
        {/*
          Stacked below 480px. Side by side, two 48px targets and two labels do
          not fit a phone without wrapping, and a wrapped action label in a
          sticky bar is the first thing a field reviewer notices.
        */}
        <div className="flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-center">
          <Button variant="primary" icon="check" block disabled={!canClose}>
            Complete job
          </Button>
          <Button variant="quiet" block>
            Save and pause
          </Button>
        </div>
      </div>
    </>
  );
};
