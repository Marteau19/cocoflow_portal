/**
 * screens/prospect/Start.tsx
 *
 * Screen 1. Intake.
 *
 * Where the relationship starts. The homeowner tells us where the property is and
 * what brings them here. They design nothing.
 *
 * There is no configurator anywhere in this flow. PTWE does the soil test, the
 * design and the quote, so intake asks four questions and stops. Every extra
 * field here is homework we are handing to someone who came for help.
 *
 * This is the first collection point for personal data, so the consent and
 * purpose statement sits at the point of submission rather than behind a link.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import { territories } from '../../data/seedData';
import {
  Band,
  BandHead,
  Button,
  Icon,
  Masthead,
} from '../../ui/primitives';

/** Reason codes drive Service Point routing. Free text cannot be routed. */
const REASONS = [
  {
    code: 'replacing-failing',
    label: 'My system is failing',
    detail: 'Backing up, smell, or a wet patch in the yard',
  },
  { code: 'new-build', label: 'I am building', detail: 'New construction, no system yet' },
  {
    code: 'buying-selling',
    label: 'I am buying or selling',
    detail: 'A property inspection flagged the system',
  },
  { code: 'not-sure', label: 'I am not sure', detail: 'Something seems off and I want advice' },
] as const;

export const ProspectStart = () => {
  const [reason, setReason] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [consent, setConsent] = useState(false);

  const ready = reason !== null && address.trim().length > 3 && consent;

  return (
    <>
      <div className="contents">
        {/*
          "Getting started" above "Tell us about your property" is one idea twice.
          The lead listed what we do next, which the flow shows.
        */}
        <Masthead
          subject="Tell us about your property"
          lead="Four questions. We take it from there."
        />

        <Section id="intake-form">
          <div className="contents">
            <Band kind="data" flush>
              <BandHead eyebrow="Step one" title="What brings you here?" />
              <div className="[&>*+*]:border-t [&>*+*]:border-t-line">
                {REASONS.map((item) => {
                  const selected = reason === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setReason(item.code)}
                      className={`block w-full border-l-rule px-gutter py-3 text-left transition-colors duration-state ease-ease ${
                        selected
                          ? 'border-l-ink bg-surface-sunk'
                          : 'border-l-transparent hover:bg-surface-sunk'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`text-body text-ink ${selected ? 'font-medium' : ''}`}>
                            {item.label}
                          </p>
                          <p className="text-caption text-ink2">{item.detail}</p>
                        </div>
                        {selected && (
                          <span className="shrink-0 text-accent-ink">
                            <Icon name="check" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Band>

            <Band kind="rail" flush>
              <BandHead
                eyebrow="Step two"
                title="Where is the property?"
              />
              <div className="px-gutter py-3">
                <label className="block">
                  <span className="text-caption text-ink2">Address</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="148 chemin du Lac, Lac-Brome"
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink placeholder:text-ink3"
                  />
                </label>
                <p className="mt-2 flex items-start gap-2 text-caption text-ink2">
                  <span className="mt-1 shrink-0">
                    <Icon name="map-pin" />
                  </span>
                  <span>
                    The address decides which team looks after you. We cover{' '}
                    {territories.map((t) => t.name.replace('Service Point ', '')).join(', ')}.
                  </span>
                </p>
              </div>
            </Band>

            <Band kind="data" flush>
              <BandHead eyebrow="Step three" title="How do we reach you?" />
              <div className="space-y-3 px-gutter py-3">
                <label className="block">
                  <span className="text-caption text-ink2">Your name</span>
                  <input
                    type="text"
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-caption text-ink2">Email</span>
                  <input
                    type="email"
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-caption text-ink2">Phone</span>
                  <input
                    type="tel"
                    className="mt-1 min-h-tap w-full rounded-control border border-line-strong bg-surface px-3 text-body text-ink"
                  />
                </label>
              </div>
            </Band>

            {/* Consent at the point of collection, not behind a link. */}
            <Band kind="rail" flush>
              <div className="px-gutter py-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1 h-3 w-3 shrink-0 rounded-control border border-line-strong"
                  />
                  {/*
                    45 words became 18, at the moment of first commitment. The
                    retention and correction rights are not dropped, they move behind
                    the link, which is where a full statement belongs and where it
                    still satisfies the legal requirement.
                  */}
                  <span className="text-caption text-ink2">
                    We use your details to assess the property and quote the work. We never sell
                    them.{' '}
                    <span className="font-medium text-accent-ink underline">
                      How we handle your data
                    </span>
                  </span>
                </label>
              </div>
            </Band>

            <Button variant="primary" icon="check" block disabled={!ready}>
              Send my request
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
};
