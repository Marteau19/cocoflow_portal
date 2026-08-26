/**
 * i18n/index.ts
 *
 * Translation, with no dependency.
 *
 * The target locales are English and French for Quebec. FR is not written yet,
 * but every string a customer reads has to be reachable by key before it is,
 * because retrofitting extraction across a finished build is how half a product
 * ends up half translated.
 *
 * Why not a library. The whole need here is a lookup, an interpolation and a
 * plural rule. i18next is 40kB to do that, and it would be the first dependency
 * in this build that the reader of `package.json` could not account for. If the
 * production build wants ICU message format, the call sites below do not change:
 * only this file does. That is the point of it being one file.
 *
 * Keys are flat and dotted rather than nested objects. Flat keys type-check with
 * `keyof`, diff one line per string, sort, and export to a translation manifest
 * without a tree walk. A nested object looks tidier in the source and is worse at
 * every job the dictionary actually has.
 *
 * Namespacing is `screen.block.thing`: `home.visit.liveTitle`,
 * `shop.filter.fitsMyModel`. Shared strings live under `common.`.
 */

import { useSyncExternalStore } from 'react';
import { en } from './en';
import { fr } from './fr';

export type Locale = 'en' | 'fr';
export type MessageKey = keyof typeof en;

/** Values interpolated into a message. Numbers are formatted by the caller. */
export type Vars = Record<string, string | number>;

const DICTIONARIES: Record<Locale, Partial<Record<MessageKey, string>>> = { en, fr };

/**
 * The active locale.
 *
 * Module state rather than React state, and read from the URL rather than
 * persisted. `CLAUDE.md` permits exactly two localStorage keys, the brand and the
 * Blueprint preference, and language is not one of them. A demo pins the locale
 * with `?lang=fr`; the language control in the account screen will set it for the
 * session.
 */
let locale: Locale = 'en';

export const getLocale = (): Locale => locale;

/**
 * Everything that has to re-render when the language changes.
 *
 * `t()` is a plain function, not a hook, so a component calling it has no
 * subscription to the locale and will happily keep rendering the old language
 * forever. Rather than make every call site a hook, the shell subscribes once
 * and keys its subtree on the result, so a language change re-renders the app
 * the same way a role change does.
 */
const listeners = new Set<() => void>();

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setLocale = (next: Locale): void => {
  if (next === locale) return;
  locale = next;
  listeners.forEach((listener) => listener());
};

/**
 * Subscribe to the active locale. One caller, in the shell.
 *
 * `useSyncExternalStore` rather than an effect and a state, because the locale
 * is genuinely external state and this is what it is for: no tearing between
 * components that read it during the same render, and no stale first paint.
 */
export const useLocale = (): Locale => useSyncExternalStore(subscribe, getLocale, getLocale);

/** Reads `?lang=` once at boot. Anything unrecognised leaves the default alone. */
export const initLocale = (): Locale => {
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (requested === 'fr' || requested === 'en') locale = requested;
  return locale;
};

/**
 * `{name}` placeholders, replaced in one pass.
 *
 * A placeholder with no matching variable is left standing rather than blanked.
 * An untranslated `{count}` visible on screen is a bug report; a silently empty
 * space is the same bug with the evidence removed.
 */
const interpolate = (message: string, vars?: Vars): string => {
  if (!vars) return message;
  return message.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  );
};

/**
 * Look up a message in the active locale.
 *
 * Falls back to English when the active locale has no value for the key, which
 * during the FR translation pass is every key. The fallback is deliberate and
 * loud in the manifest rather than silent: `npm run i18n:todo` lists exactly what
 * is still falling back.
 */
export const t = (key: MessageKey, vars?: Vars): string => {
  const active = DICTIONARIES[locale][key];
  const message = active && active.length > 0 ? active : en[key];
  return interpolate(message, vars);
};

/**
 * Count-sensitive messages.
 *
 * Pass the singular and plural keys explicitly rather than deriving them by
 * suffix. French for Quebec treats zero as singular where English does not, and a
 * derived-suffix scheme hides that difference behind a naming convention instead
 * of putting it in the type system.
 */
export const plural = (
  count: number,
  keys: { one: MessageKey; other: MessageKey },
  vars?: Vars,
): string => {
  const singular = locale === 'fr' ? count <= 1 : count === 1;
  return t(singular ? keys.one : keys.other, { count, ...vars });
};
