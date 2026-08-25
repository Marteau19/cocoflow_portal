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
 *
 * The cart is reachable from three places now, and used to be reachable from one.
 * It was a panel at the foot of the list, so the only way to see what you had
 * added was to scroll past everything you had not. That is survivable at six
 * SKUs and broken at forty, and it is the reason the count now sits in the header
 * and the order bar sticks to the foot of the column.
 */

import { useEffect, useRef, useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  commerce,
  productName,
  type CartLine,
  type CatalogueItem,
  type CartTotals,
} from '../../commerce/adapter';
import { GOLDEN, assets, byId, contracts } from '../../data/seedData';
import { plural, t } from '../../i18n';
import { money } from '../../lib/format';
import {
  Band,
  BandHead,
  Button,
  Empty,
  Icon,
  Identifier,
  Masthead,
  Row,
  RowList,
  Tabs,
  Thumb,
  Toast,
} from '../../ui/primitives';

/** How long an undo stays offered after a removal. */
const UNDO_MS = 6000;

export const OwnerParts = () => {
  const asset = byId(assets, GOLDEN.assetId)!;
  const contract = byId(contracts, GOLDEN.contractId)!;

  const [catalogue, setCatalogue] = useState<CatalogueItem[] | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [onlyMine, setOnlyMine] = useState(true);

  /** The last removal, held only for as long as it can be reversed. */
  const [undo, setUndo] = useState<CartLine | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);

  const orderRef = useRef<HTMLDivElement>(null);

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

  // Clears the pending undo if the screen goes away while one is offered.
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  const add = (sku: string) => {
    void commerce.addToCart(sku, 1).then(setCart);
  };
  const setQuantity = (sku: string, quantity: number) => {
    void commerce.setQuantity(sku, quantity).then(setCart);
  };

  /**
   * Removing a line offers the way back for six seconds.
   *
   * The removed quantity is captured before the call, not read back from the
   * cart afterwards, because by then it is gone. Undo restores the quantity that
   * was there rather than adding one, which is the difference between undo and a
   * second Add.
   */
  const removeLine = (line: CartLine) => {
    window.clearTimeout(undoTimer.current);
    setUndo(line);
    undoTimer.current = window.setTimeout(() => setUndo(null), UNDO_MS);
    void commerce.setQuantity(line.sku, 0).then(setCart);
  };

  const undoRemove = () => {
    if (!undo) return;
    window.clearTimeout(undoTimer.current);
    void commerce.setQuantity(undo.sku, undo.quantity).then(setCart);
    setUndo(null);
  };

  const shown = (catalogue ?? []).filter((item) => (onlyMine ? item.fitsMySystem : true));
  const inCart = (sku: string) => cart.find((line) => line.sku === sku)?.quantity ?? 0;
  const count = cart.reduce((n, line) => n + line.quantity, 0);

  const showOrder = () =>
    orderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
          eyebrow={t('shop.masthead.eyebrow')}
          subject={t('shop.masthead.title')}
          lead={t('shop.masthead.lead', { model: asset.model })}
        >
          {/*
            The count, in the header, where a shopper looks for it.

            It is a button rather than a badge because a count you cannot tap is a
            count that makes you go and find the thing it is counting. It renders
            only when there is something to count: an empty cart affordance is a
            control that exists to tell you it does nothing.
          */}
          {count > 0 && (
            <div className="mt-4" data-commerce>
              <button
                type="button"
                onClick={showOrder}
                aria-label={plural(count, {
                  one: 'shop.cart.badgeOne',
                  other: 'shop.cart.badgeOther',
                })}
                className="inline-flex min-h-tap items-center gap-control rounded-control bg-accent px-control-secondary text-control text-on-accent transition-colors duration-state ease-ease"
              >
                <Icon name="package" />
                {t('shop.cart.open')}
                <span className="font-mono">{count}</span>
              </button>
            </div>
          )}
        </Masthead>

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
                  label={t('shop.filter.label')}
                  value={onlyMine ? 'mine' : 'all'}
                  onChange={(value) => setOnlyMine(value === 'mine')}
                  options={[
                    { value: 'mine', label: t('shop.filter.fitsMyModel', { model: asset.model }) },
                    { value: 'all', label: t('shop.filter.everything') },
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
                <Empty line={t('shop.empty')} />
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
                          <Thumb
                            src={item.image}
                            alt={item.name}
                            label={item.sku.split('-')[0]}
                            title={t('shop.item.noImage')}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-body text-ink">{item.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Identifier>{item.sku}</Identifier>
                              {!item.fitsMySystem && (
                                <span className="text-caption text-warn">
                                  {t('shop.item.doesNotFit', { model: asset.model })}
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
                                secondary by definition. `data-commerce` is what
                                exempts a row of them from the one-accent rule,
                                per section 4 rule 1.
                              */}
                              <div data-commerce>
                                {quantity === 0 ? (
                                  <Button
                                    variant="primary"
                                    size="compact"
                                    onClick={() => add(item.sku)}
                                  >
                                    {t('shop.item.add')}
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="quiet"
                                      size="compact"
                                      aria-label={t('shop.item.removeOne', { name: item.name })}
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
                                      aria-label={t('shop.item.addOne', { name: item.name })}
                                      onClick={() => setQuantity(item.sku, quantity + 1)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                )}
                              </div>
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
              <div ref={orderRef}>
                <Band kind="rail" flush>
                  <BandHead
                    eyebrow={t('shop.cart.eyebrow')}
                    title={plural(count, {
                      one: 'shop.cart.itemsOne',
                      other: 'shop.cart.itemsOther',
                    })}
                  />
                  <RowList>
                    {cart.map((line) => (
                      <Row key={line.sku}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="min-w-0 text-caption text-ink">
                            {line.quantity} x {productName(line.sku)}
                          </p>
                          {/*
                            Remove is destructive, so it gets a real target rather
                            than the 13px text link it was. The negative margin
                            pulls the 48px hit area back onto the row's own right
                            edge, so the target grows without the label moving.
                          */}
                          <button
                            type="button"
                            aria-label={t('shop.cart.removeNamed', {
                              name: productName(line.sku),
                            })}
                            onClick={() => removeLine(line)}
                            className="-my-3 -mr-control-compact inline-flex min-h-tap shrink-0 items-center px-control-compact text-control font-medium text-ink2 transition-colors duration-state ease-ease hover:text-alert"
                          >
                            {t('shop.cart.remove')}
                          </button>
                        </div>
                      </Row>
                    ))}
                  </RowList>

                  <dl className="[&>*+*]:border-t [&>*+*]:border-t-line border-t border-line">
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">{t('shop.cart.parts')}</dt>
                      <dd className="text-caption text-ink">{money(totals.subtotal)}</dd>
                    </div>
                    {totals.contractDiscount > 0 && (
                      <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                        <dt className="text-caption text-ink2">
                          {t('shop.cart.discount', { plan: contract.name })}
                        </dt>
                        <dd className="text-caption text-positive">
                          &minus;{money(totals.contractDiscount)}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">{t('shop.cart.tax')}</dt>
                      <dd className="text-caption text-ink2">{t('shop.cart.taxValue')}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 bg-surface-sunk px-gutter py-3">
                      <dt className="text-body font-medium text-ink">{t('shop.cart.total')}</dt>
                      <dd className="text-body font-medium text-ink">{money(totals.total)}</dd>
                    </div>
                  </dl>

                  {/*
                    The delivery promise used to render here and again in the
                    closing band, so a customer with anything in their order read
                    the same sentence twice, forty pixels apart. It belongs in the
                    closing band: it is true before you add anything, which is when
                    a shopper wants to know it.
                  */}
                  <div className="border-t border-line px-gutter py-3" data-commerce>
                    <Button variant="primary" size="primary" icon="package" block>
                      {t('shop.cart.checkout')}
                    </Button>
                  </div>
                </Band>
              </div>
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
                {t('shop.delivery', { model: asset.model })}
              </p>
            </Band>
          </div>
        </Section>
      </div>

      {/*
        The sticky foot of the column: the undo strip, then the order bar.

        One region rather than two independently positioned elements, because two
        things stuck to the same edge is two things in the same place. Stacking
        them in source order is the whole layout, and it means the undo can never
        cover the bar it was caused by.

        `sticky-foot` is the positioning: sticky to the foot of the scroll
        column, with the column's end padding pulled up under it so the bar lands
        on the navigation rather than floating above it. See index.css.
      */}
      {(undo || count > 0) && (
        <div className="sticky-foot z-bar" data-commerce>
          {undo && (
            <Toast
              message={t('shop.cart.removed', { name: productName(undo.sku) })}
              actionLabel={t('common.undo')}
              onAction={undoRemove}
            />
          )}
          {count > 0 && totals && (
            <button
              type="button"
              onClick={showOrder}
              className="flex min-h-tap w-full items-center justify-between gap-3 border-t border-accent-ink bg-accent px-gutter py-2 text-control text-on-accent transition-colors duration-state ease-ease"
            >
              <span className="inline-flex items-center gap-control">
                <Icon name="package" />
                {plural(
                  count,
                  { one: 'shop.cart.openOne', other: 'shop.cart.openOther' },
                  { total: money(totals.total) },
                )}
              </span>
              <Icon name="chevron-right" />
            </button>
          )}
        </div>
      )}
    </>
  );
};
