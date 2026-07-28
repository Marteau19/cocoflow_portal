/**
 * screens/manager/Customers.tsx
 *
 * Screen 23. Customers.
 *
 * Every account this Service Point holds, searchable, table forward.
 *
 * Drilling into one account shows the same unified timeline the customer sees on
 * My system. That is deliberate: a manager on the phone should be looking at the
 * customer's view of their own history, not a different rendering of it. Most
 * support failures are two people reading two different screens.
 *
 * Which fields are read only from the master system is shown rather than
 * implied, because a manager who edits a field that silently does not save is a
 * manager who stops trusting the tool.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import {
  GOLDEN,
  accounts,
  assets,
  byId,
  cases,
  contacts,
  contracts,
  customerTimeline,
  territories,
  workOrders,
} from '../../data/seedData';
import { longDate, money, shortDate } from '../../lib/format';
import {
  Band,
  BandHead,
  Button,
  Empty,
  Icon,
  Identifier,
  Masthead,
  Micro,
  Row,
  RowList,
  Status,
} from '../../ui/primitives';

export const ManagerCustomers = () => {
  const territory = byId(territories, GOLDEN.territoryId)!;
  const mine = accounts.filter((a) => a.territoryId === territory.id);

  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const shown = mine.filter((account) => {
    if (query.trim() === '') return true;
    const needle = query.toLowerCase();
    const asset = assets.find((a) => a.accountId === account.id);
    return (
      account.name.toLowerCase().includes(needle) ||
      account.city.toLowerCase().includes(needle) ||
      account.id.toLowerCase().includes(needle) ||
      (asset?.serial.toLowerCase().includes(needle) ?? false)
    );
  });

  const open = openId ? byId(accounts, openId) : undefined;

  /* ------------------------------------------------------------------ */
  /* One account. The customer's own view of their history.             */
  /* ------------------------------------------------------------------ */
  if (open) {
    const asset = assets.find((a) => a.accountId === open.id);
    const contract = contracts.find((c) => c.accountId === open.id);
    const primary = contacts.find((c) => c.accountId === open.id && c.isPrimary);
    const timeline = customerTimeline(open.id);
    const openCases = cases.filter((c) => c.accountId === open.id && c.status !== 'resolved');

    return (
      <>
        <div className="contents">
          <div>
            <Button variant="plain" icon="chevron-right" onClick={() => setOpenId(null)}>
              Back to customers
            </Button>
            <div className="mt-2">
              <Masthead
                eyebrow={`${open.city}, ${open.province}`}
                subject={open.name}
                lead={`${open.address}. Customer since ${longDate(open.since ?? '')}.`}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div className="contents">
              <Band kind="data" flush>
                <BandHead eyebrow="Read only, from the master system" title="Account" />
                <dl className="[&>*+*]:border-t [&>*+*]:border-t-line">
                  {[
                    ['Account', open.id, true],
                    ['Property type', open.propertyType, false],
                    ['Contact', primary ? `${primary.firstName} ${primary.lastName}` : 'None', false],
                    ['Email', primary?.email ?? 'None', false],
                    ['Phone', primary?.phone ?? 'None', false],
                  ].map(([label, value, mono]) => (
                    <div
                      key={String(label)}
                      className="flex items-baseline justify-between gap-3 px-gutter py-3"
                    >
                      <dt className="text-caption text-ink2">{label}</dt>
                      <dd
                        className={`text-right text-caption text-ink ${mono ? 'font-mono uppercase' : ''}`}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-line px-gutter py-3">
                  <p className="flex items-start gap-2 text-caption text-ink2">
                    <span className="mt-1 shrink-0">
                      <Icon name="info" />
                    </span>
                    <span>
                      These fields are mastered elsewhere. Change them there and they change here,
                      not the other way round.
                    </span>
                  </p>
                </div>
              </Band>

              {asset && (
                <Band kind="rail" flush>
                  <BandHead eyebrow="Installed" title={asset.model} />
                  <dl className="[&>*+*]:border-t [&>*+*]:border-t-line">
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">Serial</dt>
                      <dd className="font-mono text-caption uppercase text-ink">{asset.serial}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">Installed</dt>
                      <dd className="text-caption text-ink">{longDate(asset.installedOn)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">Next due</dt>
                      <dd className="text-caption text-ink">{longDate(asset.nextServiceDue)}</dd>
                    </div>
                  </dl>
                </Band>
              )}

              {contract && (
                <Band kind="data" flush>
                  <BandHead eyebrow="Care plan" title={contract.name} />
                  <dl className="[&>*+*]:border-t [&>*+*]:border-t-line">
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">Renews</dt>
                      <dd className="text-caption text-ink">{longDate(contract.renewsOn)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 px-gutter py-3">
                      <dt className="text-caption text-ink2">Annual</dt>
                      <dd className="text-caption text-ink">
                        {money(contract.annualPrice_jde, contract.currency)}
                      </dd>
                    </div>
                  </dl>
                </Band>
              )}
            </div>

            <div className="contents">
              {openCases.length > 0 && (
                <Band kind="rail" flush>
                  <BandHead eyebrow="Open" title="Needs a reply" />
                  <RowList>
                    {openCases.map((item) => (
                      <Row gutter key={item.id} tone="warn">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-body text-ink">{item.subject}</p>
                            <p className="text-caption text-ink2">
                              Last message {shortDate(item.lastMessageOn)}
                            </p>
                          </div>
                          <Identifier className="shrink-0 text-ink3">{item.id}</Identifier>
                        </div>
                      </Row>
                    ))}
                  </RowList>
                </Band>
              )}

              {/* The same merge the customer sees. Not a different rendering. */}
              <Band kind="data" flush>
                <BandHead
                  eyebrow="Exactly what the customer sees"
                  title="Their history"
                  action={<Identifier className="text-ink3">{`${timeline.length} entries`}</Identifier>}
                />
                {timeline.length === 0 ? (
                  <Empty line="Nothing recorded against this account yet." />
                ) : (
                  <RowList>
                    {timeline.map((entry) => {
                      const visit = entry.kind === 'visit' ? byId(workOrders, entry.id) : undefined;
                      return (
                        <Row gutter key={entry.id} tone={entry.kind === 'visit' ? 'neutral' : 'none'}>
                          <div className="flex items-start gap-3">
                            <span className="mt-1 shrink-0 text-ink3">
                              <Icon name={entry.kind === 'visit' ? 'calendar' : 'package'} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-3">
                                <p className="text-body text-ink">
                                  {entry.kind === 'visit' ? 'Maintenance visit' : 'Parts order'}
                                </p>
                                <p className="shrink-0 text-caption text-ink2">
                                  {shortDate(entry.date)}
                                </p>
                              </div>
                              {visit?.customerSummary && (
                                <p className="mt-1 text-caption text-ink2">
                                  {visit.customerSummary}
                                </p>
                              )}
                              <div className="mt-1">
                                <Identifier>{entry.id}</Identifier>
                              </div>
                            </div>
                          </div>
                        </Row>
                      );
                    })}
                  </RowList>
                )}
              </Band>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ------------------------------------------------------------------ */
  /* The list.                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow={territory.name}
          subject="Customers"
          lead={`${mine.length} accounts. Search by name, town, account or serial number.`}
        />

        <Section id="customers">
          <div className="contents">
            <label className="flex min-h-tap items-center gap-2 rounded-control border border-line-strong bg-surface px-3">
              <span className="shrink-0 text-ink3">
                <Icon name="search" />
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Lavoie, Magog, EC5-19"
                className="min-w-0 flex-1 bg-transparent text-body text-ink placeholder:text-ink3 focus:outline-none"
              />
            </label>

            <Band kind="rail" flush>
              <BandHead
                title={`${shown.length} ${shown.length === 1 ? 'account' : 'accounts'}`}
                eyebrow={query ? 'Matching your search' : 'All'}
              />

              {/* Column heads at desktop. Table forward. */}
              <div className="hidden border-b border-line bg-surface-sunk px-gutter py-2 md:grid md:grid-cols-[1.6fr_1fr_1fr_auto] md:gap-3">
                {['Customer', 'System', 'Care plan', 'Open'].map((head) => (
                  <Micro key={head}>{head}</Micro>
                ))}
              </div>

              {shown.length === 0 ? (
                <Empty line="No accounts match that search." />
              ) : (
                <RowList>
                  {shown.map((account) => {
                    const asset = assets.find((a) => a.accountId === account.id);
                    const contract = contracts.find(
                      (c) => c.accountId === account.id && c.status === 'active',
                    );
                    const open = cases.filter(
                      (c) => c.accountId === account.id && c.status !== 'resolved',
                    ).length;
                    const isGolden = account.id === GOLDEN.accountId;

                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => setOpenId(account.id)}
                        className={`block w-full border-l-rule px-gutter py-3 text-left transition-colors duration-state ease-ease hover:bg-surface-sunk ${
                          open > 0 ? 'border-l-warn' : 'border-l-transparent'
                        }`}
                      >
                        <div className="md:grid md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-baseline md:gap-3">
                          <div className="min-w-0">
                            <p className={`text-body text-ink ${isGolden ? 'font-medium' : ''}`}>
                              {account.name}
                            </p>
                            <p className="text-caption text-ink2">
                              {account.address}, {account.city}
                            </p>
                            <div className="mt-1 md:hidden">
                              <Identifier>{account.id}</Identifier>
                            </div>
                          </div>

                          <div className="mt-2 md:mt-0">
                            <p className="text-caption text-ink">{asset?.model ?? 'None on file'}</p>
                            {asset && (
                              <p className="font-mono text-caption uppercase text-ink3">
                                {asset.serial}
                              </p>
                            )}
                          </div>

                          <div className="mt-1 md:mt-0">
                            {contract ? (
                              <>
                                <p className="text-caption text-ink">{contract.name}</p>
                                <p className="text-caption text-ink3">
                                  to {shortDate(contract.renewsOn)}
                                </p>
                              </>
                            ) : (
                              <Status tone="warn">NO PLAN</Status>
                            )}
                          </div>

                          <div className="mt-1 md:mt-0 md:text-right">
                            {open > 0 ? (
                              <Status tone="warn">{`${open} OPEN`}</Status>
                            ) : (
                              <span className="text-caption text-ink3">None</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </RowList>
              )}
            </Band>
          </div>
        </Section>

        {/* Closing. Where these records actually live. */}
        <Band kind="closing" alt>
          <Micro className="text-on-band-muted">Where this comes from</Micro>
          <p className="mt-1 max-w-reading text-caption text-on-band opacity-80">
            Accounts, systems and history are mastered in the CRM. This view is read only in V1.
          </p>
        </Band>
      </div>
    </>
  );
};
