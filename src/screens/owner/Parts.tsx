/**
 * screens/owner/Parts.tsx
 *
 * Screen 12. Parts.
 *
 * Everything commercial goes through `commerce/adapter.ts`. The platform is not
 * decided, so this screen must not encode a platform's habits: no Shopify
 * variant vocabulary, no Salesforce Commerce basket semantics, no assumption
 * that the cart is a server resource or that tax is known.
 *
 * Tax is shown as not yet calculated rather than as a plausible number, because
 * which system is authoritative for it is an open question. Inventing a figure
 * here would hide a decision this prototype exists to surface.
 */

import { useEffect, useState } from 'react';
import { Section } from '../../blueprint/Section';
import { commerce, productName, type CartLine, type CatalogueItem, type CartTotals } from '../../commerce/adapter';
import { GOLDEN, assets, byId, contracts } from '../../data/seedData';
import { money } from '../../lib/format';
import {
  Button,
  Card,
  CardHeader,
  Empty,
  Flag,
  Icon,
  Identifier,
  Micro,
  PageHead,
  Row,
  RowList,
  Stack,
  Tabs,
} from '../../ui/primitives';
import { ScreenBody } from '../ScreenBody';

export const OwnerParts = () => {
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;

  const [catalogue, setCatalogue] = useState<CatalogueItem[] | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [onlyMine, setOnlyMine] = useState(true);

  useEffect(() => {
    let live = true;
    void commerce.listCatalogue(GOLDEN.accountId).then((items) => {
      if (live) setCatalogue(items);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    void commerce.totals(cart, GOLDEN.accountId).then((next) => {
      if (live) setTotals(next);
    });
    return () => {
      live = false;
    };
  }, [cart]);

  const add = (sku: string) => {
    void commerce.addToCart(sku, 1).then(setCart);
  };
  const setQuantity = (sku: string, quantity: number) => {
    void commerce.setQuantity(sku, quantity).then(setCart);
  };

  const shown = (catalogue ?? []).filter((item) => (onlyMine ? item.fitsMySystem : true));
  const inCart = (sku: string) => cart.find((line) => line.sku === sku)?.quantity ?? 0;

  return (
    <ScreenBody>
      <Stack gap="4">
        <PageHead
          eyebrow="Parts"
          title="Parts for your system"
          lead={`Filtered to the ${asset.model}, so nothing here will arrive and not fit.`}
        />

        <Section id="parts-store">
          <Stack gap="4">
            {/* The filter is on by default. Fit is the whole value here. */}
            <Tabs
              label="Filter the catalogue"
              value={onlyMine ? 'mine' : 'all'}
              onChange={(value) => setOnlyMine(value === 'mine')}
              options={[
                { value: 'mine', label: `Fits my ${asset.model}` },
                { value: 'all', label: 'Everything' },
              ]}
            />

            {catalogue === null ? (
              <Card>
                <div className="px-4 py-6" />
              </Card>
            ) : shown.length === 0 ? (
              <Card>
                <Empty line="No parts match this filter." />
              </Card>
            ) : (
              <Card>
                <RowList>
                  {shown.map((item) => {
                    const quantity = inCart(item.sku);
                    return (
                      <Row key={item.sku}>
                        <div className="flex items-start gap-3">
                          {/* Real part imagery, at text-adjacent size. */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-6 w-6 shrink-0 rounded-control border border-line bg-surface-sunk object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-body text-ink">{item.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Identifier>{item.sku}</Identifier>
                              {!item.fitsMySystem && (
                                <span className="text-caption text-warn">
                                  Not for the {asset.model}
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              <p className="text-body font-medium text-ink">
                                {money(item.price_jde, item.currency)}
                              </p>

                              {quantity === 0 ? (
                                <Button variant="quiet" onClick={() => add(item.sku)}>
                                  Add
                                </Button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="quiet"
                                    aria-label={`Remove one ${item.name}`}
                                    onClick={() => setQuantity(item.sku, quantity - 1)}
                                  >
                                    &minus;
                                  </Button>
                                  <span className="min-w-tap text-center text-body text-ink">
                                    {quantity}
                                  </span>
                                  <Button
                                    variant="quiet"
                                    aria-label={`Add one ${item.name}`}
                                    onClick={() => setQuantity(item.sku, quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Row>
                    );
                  })}
                </RowList>
              </Card>
            )}

            {/* Basket. Named "Your order" because customers do not have baskets. */}
            {cart.length > 0 && totals && (
              <Card>
                <CardHeader
                  eyebrow="Your order"
                  title={`${cart.reduce((n, l) => n + l.quantity, 0)} items`}
                />
                <RowList>
                  {cart.map((line) => (
                    <Row key={line.sku}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="min-w-0 text-caption text-ink">
                          {line.quantity} x {productName(line.sku)}
                        </p>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.sku, 0)}
                          className="shrink-0 text-caption text-accent-ink hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                    </Row>
                  ))}
                </RowList>

                <dl className="divide-y divide-line border-t border-line">
                  <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                    <dt className="text-caption text-ink2">Parts</dt>
                    <dd className="text-caption text-ink">{money(totals.subtotal)}</dd>
                  </div>
                  {totals.contractDiscount > 0 && (
                    <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                      <dt className="text-caption text-ink2">{contract.name} discount</dt>
                      <dd className="text-caption text-positive">
                        &minus;{money(totals.contractDiscount)}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                    <dt className="text-caption text-ink2">Tax</dt>
                    <dd className="text-caption text-ink2">Calculated at checkout</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 bg-surface-sunk px-4 py-3">
                    <dt className="text-body font-medium text-ink">Total</dt>
                    <dd className="text-body font-medium text-ink">{money(totals.total)}</dd>
                  </div>
                </dl>

                <div className="border-t border-line px-4 py-3">
                  <Button variant="primary" icon="package" block>
                    Go to checkout
                  </Button>
                  <p className="mt-2 text-caption text-ink3">
                    Delivered to {`${asset.model}`} owners in the Eastern Townships within a week.
                  </p>
                </div>
              </Card>
            )}

            {/* The seam, stated on screen rather than only in the annotation. */}
            <Card>
              <div className="px-4 py-3">
                <Micro>Behind this screen</Micro>
                <p className="mt-1 flex items-start gap-2 text-caption text-ink2">
                  <span className="mt-1 shrink-0">
                    <Icon name="info" />
                  </span>
                  <span>
                    Commerce runs through one adapter, so the platform choice stays open. Prices come
                    from the ERP. Tax is deliberately not calculated here.
                  </span>
                </p>
                <div className="mt-2">
                  <Flag tone="warn" icon="alert-triangle">
                    Platform undecided
                  </Flag>
                </div>
              </div>
            </Card>
          </Stack>
        </Section>
      </Stack>
    </ScreenBody>
  );
};
