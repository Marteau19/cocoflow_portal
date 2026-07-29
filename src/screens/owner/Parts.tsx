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
  Band,
  BandHead,
  Button,
  Empty,
  Identifier,
  Masthead,
  Row,
  RowList,
  Tabs,
  Thumb,
} from '../../ui/primitives';

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
    <>
      <div className="contents">
        {/*
          "Parts for your system" set to two lines with "system" alone on the
          second, which DESIGN.md section 5 now forbids. "Parts and filters" rags
          clean at the framed column width and says the same thing: these are the
          consumables for an installed system.
        */}
        <Masthead
          eyebrow="Parts"
          subject="Parts and filters"
          lead={`Filtered to the ${asset.model}, so nothing here will arrive and not fit.`}
        />

        <Section id="parts-store">
          <div className="contents">
            {/*
              The filter is on by default. Fit is the whole value here.

              It sits inside a Rail band rather than as a bare sibling between
              bands. As a sibling it had no gutter at all, so the chips started at
              left 0 while the masthead text above them started at the gutter.
            */}
            <Band kind="rail" flush>
              <div className="px-gutter pt-1">
                <Tabs
                  label="Filter the catalogue"
                  value={onlyMine ? 'mine' : 'all'}
                  onChange={(value) => setOnlyMine(value === 'mine')}
                  options={[
                    { value: 'mine', label: `Fits my ${asset.model}` },
                    { value: 'all', label: 'Everything' },
                  ]}
                />
              </div>
            </Band>

            {catalogue === null ? (
              <Band kind="data" flush>
                <div className="px-gutter py-6" />
              </Band>
            ) : shown.length === 0 ? (
              <Band kind="data" flush>
                <Empty line="No parts match this filter." />
              </Band>
            ) : (
              <Band kind="data" flush>
                <RowList>
                  {shown.map((item) => {
                    const quantity = inCart(item.sku);
                    return (
                      <Row key={item.sku}>
                        {/*
                          Thumbnail on the gutter, every text line at
                          gutter + 48 + 16. `gap-3` is 16px, so the flex child
                          starts on the `pl-thumb` edge and the title, the SKU line
                          and the price all share it.
                        */}
                        <div className="flex items-start gap-3">
                          <Thumb src={item.image} alt={item.name} />
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

                              {/*
                                Add is the row's primary action, so it is a filled
                                compact control rather than a ghost outline.
                                DESIGN.md section 6: an outlined control is a
                                secondary by definition.
                              */}
                              {quantity === 0 ? (
                                <Button
                                  variant="primary"
                                  size="compact"
                                  onClick={() => add(item.sku)}
                                >
                                  Add
                                </Button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="quiet"
                                    size="compact"
                                    aria-label={`Remove one ${item.name}`}
                                    onClick={() => setQuantity(item.sku, quantity - 1)}
                                  >
                                    &minus;
                                  </Button>
                                  <span className="w-4 text-center text-body text-ink">
                                    {quantity}
                                  </span>
                                  <Button
                                    variant="quiet"
                                    size="compact"
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
              </Band>
            )}

            {/* Basket. Named "Your order" because customers do not have baskets. */}
            {cart.length > 0 && totals && (
              <Band kind="rail" flush>
                <BandHead
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
                        <Button variant="plain" onClick={() => setQuantity(line.sku, 0)}>
                          Remove
                        </Button>
                      </div>
                    </Row>
                  ))}
                </RowList>

                <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
                  <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                    <dt className="text-caption text-ink2">Parts</dt>
                    <dd className="text-caption text-ink">{money(totals.subtotal)}</dd>
                  </div>
                  {totals.contractDiscount > 0 && (
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">{contract.name} discount</dt>
                      <dd className="text-caption text-positive">
                        &minus;{money(totals.contractDiscount)}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                    <dt className="text-caption text-ink2">Tax</dt>
                    <dd className="text-caption text-ink2">Calculated at checkout</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 bg-surface-sunk px-gutter py-3">
                    <dt className="text-body font-medium text-ink">Total</dt>
                    <dd className="text-body font-medium text-ink">{money(totals.total)}</dd>
                  </div>
                </dl>

                <div className="border-t border-line px-gutter py-3">
                  <Button variant="primary" size="primary" icon="package" block>
                    Go to checkout
                  </Button>
                  <p className="mt-2 text-caption text-ink3">
                    Delivered to {`${asset.model}`} owners in the Eastern Townships within a week.
                  </p>
                </div>
              </Band>
            )}

            {/*
              The commerce seam was stated here, on the customer's screen: one
              adapter, ERP prices, tax deliberately uncalculated, and a "Platform
              undecided" flag. All of it is already in the `parts-store` annotation,
              in integration and openDecision. A homeowner buying a filter does not
              read about the platform selection.

              What survives on screen is the one thing a customer needs: tax is
              calculated at checkout, which the order summary already says.
            */}
            <Band kind="closing">
              <p className="max-w-reading text-caption text-ink2">
                Delivered to {asset.model} owners in the Eastern Townships within a week.
              </p>
            </Band>
          </div>
        </Section>
      </div>
    </>
  );
};
