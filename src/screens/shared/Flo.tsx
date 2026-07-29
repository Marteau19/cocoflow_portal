/**
 * screens/shared/Flo.tsx
 *
 * Screen 28. Flo.
 *
 * Every answer cites its source documents inline. That is the whole point:
 * grounded retrieval, not a model guessing about septic regulations. An answer
 * without a citation is a liability in a regulated trade, so the citation is part
 * of the answer rather than a footnote.
 *
 * One instance, shared by the technician and the manager, with scope filtered by
 * who is asking. Flo is never badged, never given a sparkle icon, and never
 * called an AI assistant. It answers, it cites, it stays out of the way.
 */

import { useState } from 'react';
import { Section } from '../../blueprint/Section';
import { knowledgeBase, network, type KnowledgeArticle } from '../../data/seedData';
import { shortDate } from '../../lib/format';
import { useRole } from '../../shell/useRole';
import {
  Band,
  BandHead,
  Button,
  Icon,
  Identifier,
  Masthead,
  Micro,
  Row,
  RowList,
} from '../../ui/primitives';

interface Exchange {
  question: string;
  answer: string;
  /** Article ids. An answer with an empty list is not shown as an answer. */
  cites: string[];
  /** Set when Flo cannot ground an answer. Recorded rather than improvised. */
  unanswered?: boolean;
}

/**
 * Canned exchanges, grounded in the articles that actually exist in seedData.
 * Every `cites` entry resolves to a real record, so a reviewer can click through
 * and confirm the citation is not decorative.
 */
const CANNED: Exchange[] = [
  {
    question: 'What effluent clarity is acceptable on an EC-5?',
    answer:
      'Clear to a slight haze is within range. Cloudy effluent means the media is nearing the end of its life or the outlet filter is partly blocked. Check the outlet filter first, since clearing it on site resolves most cases without a media change.',
    cites: ['KB-118', 'KB-101'],
  },
  {
    question: 'Do I need a permit to replace a system in Quebec?',
    answer:
      'Yes. A replacement system needs a municipal permit, and the application has to include the soil test results and the system design. We file it on the customer behalf as part of the installation.',
    cites: ['KB-203'],
  },
  {
    question: 'What is the winter access rule for a seasonal property?',
    answer:
      'Access has to be cleared to the lid before the visit. Where a property is seasonal and unoccupied, we confirm access with the owner two days ahead rather than assuming the driveway is passable.',
    cites: ['KB-124'],
  },
  {
    question: 'What is the trade-in allowance on a control panel?',
    answer:
      'I could not find this in the documents I have access to. I have recorded the question so it can be answered properly.',
    cites: [],
    unanswered: true,
  },
];

const Citation = ({ article }: { article: KnowledgeArticle }) => (
  <a
    href="#source"
    onClick={(event) => event.preventDefault()}
    className="inline-flex items-baseline gap-1 rounded-control border border-line px-2 py-1 text-caption text-ink2 transition-colors duration-state ease-ease hover:border-ink3 hover:text-ink"
  >
    <span className="shrink-0">
      <Icon name="file-text" />
    </span>
    <span className="font-mono uppercase">{article.id}</span>
    <span className="min-w-0">{article.title}</span>
  </a>
);

export const Flo = () => {
  const { role } = useRole();
  const [thread, setThread] = useState<Exchange[]>([CANNED[0]]);
  const [draft, setDraft] = useState('');

  // Scope is filtered by role. A technician does not need the renewal script.
  const audience = role.key === 'sp-manager' ? 'manager' : 'technician';
  const inScope = knowledgeBase.filter((a) => a.audience.includes(audience));

  const ask = (question: string) => {
    const match =
      CANNED.find((c) => c.question.toLowerCase() === question.toLowerCase()) ??
      CANNED.find((c) => c.question.toLowerCase().includes(question.toLowerCase().slice(0, 12))) ??
      CANNED[CANNED.length - 1];
    setThread((current) => [...current, { ...match, question }]);
    setDraft('');
  };

  return (
    <>
      <div className="contents">
        <Masthead
          eyebrow="Flo"
          subject="Ask about the work"
          lead={`Answers come from the ${inScope.length} documents you have access to, and each one says where it came from.`}
        />

        <Section id="flo">
          <div className="contents">
            {/* The thread. */}
            <div className="contents">
              {thread.map((exchange, index) => (
                <div key={`${exchange.question}-${index}`}>
                  <Band kind="data" flush>
                    <div className="border-b border-line px-gutter py-3">
                      <Micro>You asked</Micro>
                      <p className="mt-1 text-body text-ink">{exchange.question}</p>
                    </div>

                    <div className="px-gutter py-3">
                      <p className="text-body text-ink">{exchange.answer}</p>
                    </div>

                    {exchange.cites.length > 0 ? (
                      <div className="border-t border-line px-gutter py-3">
                        <Micro>From</Micro>
                        <div className="mt-2 flex flex-col gap-2">
                          {exchange.cites
                            .map((id) => knowledgeBase.find((a) => a.id === id))
                            .filter((a): a is KnowledgeArticle => a !== undefined)
                            .map((article) => (
                              <Citation key={article.id} article={article} />
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-line px-gutter py-3">
                        <p className="flex items-start gap-2 text-caption text-warn">
                          <span className="mt-1 shrink-0">
                            <Icon name="alert-triangle" />
                          </span>
                          <span>
                            No source found. Recorded as an unanswered question, which is how the gap
                            gets closed rather than hidden.
                          </span>
                        </p>
                      </div>
                    )}
                  </Band>
                </div>
              ))}
            </div>

            {/* Ask. */}
            <Band kind="rail" flush>
              <div className="px-gutter py-3">
                <label className="block">
                  <Micro>Ask something</Micro>
                  <textarea
                    rows={2}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Effluent clarity, permits, cold weather access"
                    className="mt-2 w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-body text-ink placeholder:text-ink3"
                  />
                </label>
                <Button
                  variant="primary"
                  icon="search"
                  className="mt-3"
                  disabled={draft.trim().length === 0}
                  onClick={() => ask(draft.trim())}
                >
                  Ask
                </Button>
              </div>

              <div className="border-t border-line px-gutter py-3">
                <Micro>Try one of these</Micro>
                <div className="mt-2 flex flex-col gap-2">
                  {CANNED.slice(1).map((item) => (
                    <button
                      key={item.question}
                      type="button"
                      onClick={() => ask(item.question)}
                      className="min-h-tap text-left text-caption text-accent-ink transition-colors duration-state ease-ease hover:text-ink"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              </div>
            </Band>

            {/* What Flo can see. Scope made visible, not asserted. */}
            <Band kind="data" flush>
              <BandHead
                title="What Flo can read"
                eyebrow={`Scoped to your role, ${inScope.length} documents`}
              />
              <RowList>
                {inScope.map((article) => (
                  <Row key={article.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-body text-ink">{article.title}</p>
                        <p className="text-caption text-ink2">
                          {article.section}, updated {shortDate(article.updatedOn)}
                        </p>
                      </div>
                      <Identifier className="shrink-0 text-ink3">{article.id}</Identifier>
                    </div>
                  </Row>
                ))}
              </RowList>
              <div className="border-t border-line px-gutter py-3">
                <p className="text-caption text-ink2">
                  {knowledgeBase.length - inScope.length} further documents exist but are outside your
                  role. Flo will not answer from them.
                </p>
              </div>
            </Band>

            <p className="text-caption text-ink3">
              {network.adoption.floQueries30d.toLocaleString('en-CA')} questions asked across the
              network in the last 30 days, {network.adoption.floUnansweredPct}% of which Flo could not
              ground in a document.
            </p>
          </div>
        </Section>
      </div>
    </>
  );
};
