/**
 * commerce/adapter.ts
 *
 * The commerce seam.
 *
 * The platform is NOT DECIDED. Shopify, Salesforce Commerce and a JDE-fronted
 * custom build are all live options, and they differ in ways that reach the UI:
 * who owns the catalogue, whether the cart is a server resource or a client
 * value, whether pricing is entitlement-aware, and where tax lands.
 *
 * So the screens talk to this interface and nothing else. No component imports
 * a platform SDK, and no component assumes a platform's vocabulary. Swapping
 * the implementation below is the whole integration.
 *
 * What changes per option is recorded in the `parts-store` annotation in
 * `data/sections.ts`, which is the version reviewers read.
 */

import { assets, byId, contracts, products, type Currency } from '../data/seedData';

/* ------------------------------------------------------------------ */
/* The contract                                                        */
/* ------------------------------------------------------------------ */

export interface CatalogueItem {
  sku: string;
  name: string;
  category: string;
  /** Sourced from the ERP. The suffix keeps the system boundary visible. */
  price_jde: number;
  currency: Currency;
  /** True when the part fits the system this customer actually owns. */
  fitsMySystem: boolean;
  /** Null where no photograph of this category exists. See IMAGE_BY_CATEGORY. */
  image: string | null;
}

export interface CartLine {
  sku: string;
  quantity: number;
}

export interface CartTotals {
  /** Sum of line prices before any entitlement discount. */
  subtotal: number;
  /** Contract parts discount, expressed as a positive number to subtract. */
  contractDiscount: number;
  /** Deliberately null: tax jurisdiction is an open question. */
  tax: number | null;
  total: number;
  currency: Currency;
}

/**
 * Every operation is async and returns a fresh value. That shape holds whether
 * the cart lives on a server or in memory, so screens written against it do not
 * change when the platform is chosen.
 */
export interface CommerceAdapter {
  readonly platform: string;
  listCatalogue(accountId: string): Promise<CatalogueItem[]>;
  getCart(): Promise<CartLine[]>;
  addToCart(sku: string, quantity: number): Promise<CartLine[]>;
  setQuantity(sku: string, quantity: number): Promise<CartLine[]>;
  totals(lines: CartLine[], accountId: string): Promise<CartTotals>;
}

/* ------------------------------------------------------------------ */
/* Prototype implementation                                            */
/* ------------------------------------------------------------------ */

/**
 * Part imagery, keyed by category.
 *
 * There are three photographs in `public/img` and five categories, and the
 * previous map ignored what was actually in each file:
 *
 *   part-1.png  a green inspection lid
 *   part-2.png  a black filter disc
 *   part-3.png  a bolt and clamp assembly
 *
 * It mapped `lid` to the bolt and `filter-media` to the lid, so the inspection lid
 * seal showed a bolt and the filter media showed a lid. Both were wrong, and
 * because the thumbnail was 24px nobody could see which.
 *
 * `pump` and `control` are deliberately absent. There is no pump photograph and no
 * control panel photograph, and reusing one of these three for them would put a
 * confidently wrong picture next to a $615 part. A category with no image gets no
 * image, and the row renders a labelled placeholder instead. That is the same
 * choice this prototype makes everywhere else a value is unknown: state the gap
 * rather than fill it with something plausible.
 */
const IMAGE_BY_CATEGORY: Record<string, string> = {
  lid: '/img/part-1.png',
  'filter-media': '/img/part-2.png',
  accessory: '/img/part-3.png',
};

/** Parts discount carried by an active care contract. */
const CONTRACT_PARTS_DISCOUNT = 0.1;

let cart: CartLine[] = [];

const modelsOwnedBy = (accountId: string): string[] =>
  assets.filter((a) => a.accountId === accountId).map((a) => a.model);

const hasActiveContract = (accountId: string): boolean =>
  contracts.some((c) => c.accountId === accountId && c.status === 'active');

export const prototypeAdapter: CommerceAdapter = {
  platform: 'prototype, in memory',

  async listCatalogue(accountId) {
    const mine = modelsOwnedBy(accountId);
    return products.map((p) => ({
      sku: p.sku,
      name: p.name,
      category: p.category,
      price_jde: p.price_jde,
      currency: p.currency,
      fitsMySystem: p.fitsModels.some((m) => mine.includes(m)),
      image: IMAGE_BY_CATEGORY[p.category] ?? null,
    }));
  },

  async getCart() {
    return [...cart];
  },

  async addToCart(sku, quantity) {
    const existing = cart.find((l) => l.sku === sku);
    if (existing) existing.quantity += quantity;
    else cart.push({ sku, quantity });
    return [...cart];
  },

  async setQuantity(sku, quantity) {
    cart = quantity > 0 ? cart.map((l) => (l.sku === sku ? { ...l, quantity } : l)) : cart.filter((l) => l.sku !== sku);
    return [...cart];
  },

  async totals(lines, accountId) {
    const subtotal = lines.reduce((sum, line) => {
      const product = products.find((p) => p.sku === line.sku);
      return sum + (product ? product.price_jde * line.quantity : 0);
    }, 0);

    const contractDiscount = hasActiveContract(accountId)
      ? Math.round(subtotal * CONTRACT_PARTS_DISCOUNT)
      : 0;

    return {
      subtotal,
      contractDiscount,
      // Left null on purpose. Which system is authoritative for tax is an open
      // decision, and inventing a number here would hide that.
      tax: null,
      total: subtotal - contractDiscount,
      currency: 'CAD',
    };
  },
};

/** The single seam the screens import. */
export const commerce: CommerceAdapter = prototypeAdapter;

/** Convenience for screens that need a part's display name from a SKU. */
export const productName = (sku: string): string =>
  products.find((p) => p.sku === sku)?.name ?? sku;

/** Asset lookup used by the store to explain why a part fits. */
export const ownedModel = (accountId: string): string | null =>
  byId(assets, assets.find((a) => a.accountId === accountId)?.id ?? '')?.model ?? null;
