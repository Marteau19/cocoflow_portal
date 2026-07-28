/**
 * screens/manager/Inventory.tsx
 *
 * Screen 26. Inventory.
 *
 * Two things make this more than a stock list.
 *
 * Depot stock and truck stock are kept separate, because a part on a truck two
 * hours away is not available for tomorrow's job at the depot.
 *
 * And the consumption forecast is derived from scheduled filter media
 * replacement work rather than from last quarter's average. That is the whole
 * argument for joining service scheduling to inventory: the schedule already
 * knows what is about to be consumed.
 */

import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  byId,
  inventory,
  products,
  territories,
  workOrders,
  type InventoryItem,
} from '../../data/seedData';
import { money } from '../../lib/format';
import {
  Card,
  CardHeader,
  Flag,
  Icon,
  Identifier,
  Kpi,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Status,
  type RowTone,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

/** Available is what is on hand less what a booked job has already claimed. */
const available = (row: InventoryItem): number => row.onHand - row.reserved;

/**
 * The state a manager acts on. Short means the forecast exceeds what is
 * available; low means it is under the reorder point but the forecast still fits.
 */
const standing = (
  row: InventoryItem,
): { label: string; rule: RowTone; tone: 'neutral' | 'warn' | 'alert' } => {
  if (row.forecastConsumption28d > available(row)) {
    return { label: 'SHORT', rule: 'alert', tone: 'alert' };
  }
  if (available(row) <= row.reorderPoint) {
    return { label: 'LOW', rule: 'warn', tone: 'warn' };
  }
  return { label: 'OK', rule: 'none', tone: 'neutral' };
};

const StockTable = ({ rows, caption }: { rows: InventoryItem[]; caption: string }) => (
  <Card>
    <CardHeader title={caption} eyebrow={`${rows.length} lines`} />

    {/* Column heads sit on the sunk surface, so the table reads as a table. */}
    <div className="hidden border-b border-line bg-surface-sunk px-4 py-2 md:grid md:grid-cols-[2fr_repeat(4,minmax(0,1fr))] md:gap-3">
      {['Part', 'On hand', 'Reserved', 'Available', 'Forecast 28d'].map((head) => (
        <div key={head} className={head === 'Part' ? '' : 'text-right'}>
          <Micro>{head}</Micro>
        </div>
      ))}
    </div>

    <RowList>
      {rows.map((row) => {
        const product = products.find((p) => p.sku === row.sku);
        const state = standing(row);
        return (
          <Row key={`${row.sku}-${row.location}`} tone={state.rule}>
            <div className="md:grid md:grid-cols-[2fr_repeat(4,minmax(0,1fr))] md:items-baseline md:gap-3">
              <div className="min-w-0">
                <p className="text-body text-ink">{product?.name ?? row.sku}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Identifier>{row.sku}</Identifier>
                  <Status tone={state.tone}>{state.label}</Status>
                </div>
              </div>

              {/* Stacked on a phone, columns at desktop. Numbers stay tabular. */}
              <div className="mt-2 grid grid-cols-4 gap-3 md:contents">
                {[
                  { label: 'On hand', value: row.onHand },
                  { label: 'Reserved', value: row.reserved },
                  { label: 'Available', value: available(row) },
                  { label: 'Forecast', value: row.forecastConsumption28d },
                ].map((cell, index) => (
                  <div key={cell.label} className="md:text-right">
                    <div className="md:hidden">
                      <Micro>{cell.label}</Micro>
                    </div>
                    <p
                      className={`text-body font-medium ${
                        index === 3 && row.forecastConsumption28d > available(row)
                          ? 'text-alert'
                          : 'text-ink'
                      }`}
                    >
                      {cell.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Row>
        );
      })}
    </RowList>
  </Card>
);

export const ManagerInventory = () => {
  const territory = byId(territories, GOLDEN.territoryId)!;
  const mine = inventory.filter((row) => row.territoryId === territory.id);
  const depot = mine.filter((row) => row.location === 'depot');
  const truck = mine.filter((row) => row.location === 'truck');

  const short = mine.filter((row) => row.forecastConsumption28d > available(row));
  const value = depot.reduce((sum, row) => {
    const product = products.find((p) => p.sku === row.sku);
    return sum + (product ? product.price_jde * row.onHand : 0);
  }, 0);

  // The jobs the forecast is built from. Naming them is what makes it credible.
  const drivingJobs = workOrders.filter((w) => w.type === 'FMR' && w.status !== 'complete');

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow={territory.name}
          title="Inventory"
          lead="What is on the shelf, what is on the truck, and what the schedule is about to consume."
        />

        <Section id="inventory">
          <Stack gap="4">
            <Card>
              <div className="grid gap-4 border-b border-line px-4 py-4 md:grid-cols-[1.4fr_1fr_1fr]">
                <Kpi
                  label="Lines short against forecast"
                  value={String(short.length)}
                  note={short.length > 0 ? 'Reorder before the schedule hits' : 'Nothing short'}
                  tone={short.length > 0 ? 'ink' : 'accent'}
                />
                <Kpi label="Depot stock value" value={money(value)} />
                <Kpi label="Lines tracked" value={String(mine.length)} />
              </div>

              {short.length > 0 && (
                <div className="px-4 py-3">
                  <Flag tone="alert" icon="alert-triangle">
                    {`${short.map((row) => row.sku).join(', ')} will not cover the next four weeks`}
                  </Flag>
                </div>
              )}
            </Card>

            {/* Separate on purpose. */}
            <StockTable rows={depot} caption="Service Point stock" />
            <StockTable rows={truck} caption="Truck stock" />

            {/* Where the forecast comes from. */}
            <Card>
              <CardHeader
                title="How the forecast is built"
                eyebrow="Derived, not averaged"
              />
              <div className="px-4 py-3">
                <p className="text-caption text-ink2">
                  Consumption over the next four weeks is read from scheduled filter media
                  replacement work, so it moves when the schedule moves. A quarterly average would
                  not.
                </p>
              </div>
              <RowList className="border-t border-line">
                {drivingJobs.map((job) => (
                  <Row key={job.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-body text-ink">Filter media replacement</p>
                        <p className="text-caption text-ink2">
                          Scheduled {job.scheduledFor}, {job.lineItems.length} parts claimed
                        </p>
                      </div>
                      <Identifier className="shrink-0 text-ink3">{job.id}</Identifier>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-4 py-3">
                <p className="flex items-start gap-2 text-caption text-ink2">
                  <span className="mt-1 shrink-0">
                    <Icon name="info" />
                  </span>
                  <span>
                    Stock levels themselves are mastered in the ERP. This screen reads them and adds
                    the forecast, which is the part the service schedule contributes.
                  </span>
                </p>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
