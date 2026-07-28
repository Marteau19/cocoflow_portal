/**
 * blueprint/BlueprintPanel.tsx
 *
 * The right-hand panel.
 *
 * In Blueprint mode it lists every callout on the current screen and offers
 * Export spec. Outside Blueprint mode it opens as a sheet showing the single
 * annotation whose marker was clicked, so the technical layer is reachable
 * without leaving the product demo.
 *
 * Below 1024px it becomes a bottom sheet, since a fixed side panel next to a
 * device frame leaves neither enough room.
 */

import { sections } from '../data/sections';
import { Button, Icon, Micro } from '../ui/primitives';
import { Annotation } from './Annotation';
import { useBlueprint } from './BlueprintProvider';
import { downloadSpec } from './exportSpec';

export const BlueprintPanel = () => {
  const { on, registered, openId, close } = useBlueprint();

  const single = openId ? sections.find((s) => s.id === openId) : undefined;

  // Outside Blueprint mode the panel only exists when a marker was clicked.
  if (!on && !single) return null;

  const blocked = registered.filter((s) => s.openDecision !== null).length;

  return (
    <>
      {/* Scrim, only for the sheet register. Blueprint mode's panel is docked. */}
      {single && !on && (
        <button
          type="button"
          aria-label="Close annotation"
          onClick={close}
          className="fixed inset-0 z-panel bg-band-deep opacity-20"
        />
      )}

      <aside
        className={
          on
            ? 'fixed bottom-0 right-0 top-6 z-panel flex w-full max-w-device flex-col border-l border-line bg-surface lg:top-6'
            : 'fixed bottom-0 left-0 right-0 z-sheet mx-auto flex max-h-[80vh] w-full max-w-device flex-col rounded-card border border-line bg-surface shadow-sheet lg:inset-y-6 lg:left-auto lg:right-6 lg:max-h-none'
        }
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <Micro>{on ? 'Blueprint' : 'About this section'}</Micro>
            <h2 className="mt-1 text-body font-medium text-ink">
              {on ? 'Callouts on this screen' : (single?.title ?? '')}
            </h2>
            {on && (
              <p className="mt-1 text-caption text-ink2">
                {registered.length} annotated{' '}
                {registered.length === 1 ? 'section' : 'sections'}
                {blocked > 0 && `, ${blocked} with an open decision`}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid h-4 w-4 shrink-0 place-items-center rounded-control border border-line text-ink3 transition-colors duration-state ease-ease hover:border-ink3 hover:text-ink"
          >
            <span aria-hidden className="text-caption leading-none">
              &times;
            </span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {on ? (
            registered.length > 0 ? (
              registered.map((section) => (
                <Annotation
                  key={section.id}
                  section={section}
                  defaultExpanded={openId === section.id}
                />
              ))
            ) : (
              <div className="px-4 py-6">
                <p className="text-body text-ink2">
                  This screen has no annotations yet. Every screen in the inventory gets one.
                </p>
              </div>
            )
          ) : (
            single && <Annotation section={single} defaultExpanded />
          )}
        </div>

        {on && (
          <footer className="border-t border-line px-4 py-3">
            <Button variant="primary" icon="file-text" block onClick={downloadSpec}>
              Export spec
            </Button>
            <p className="mt-2 text-caption text-ink3">
              Every annotation on every screen, as markdown. Generated from the same records this
              panel reads.
            </p>
          </footer>
        )}
      </aside>
    </>
  );
};

/** Toggle for the top bar. Kept here so the mode's UI stays in one place. */
export const BlueprintToggle = () => {
  const { on, toggle } = useBlueprint();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title="Blueprint mode, Alt+Shift+B"
      className={`inline-flex min-h-tap items-center gap-2 rounded-control border px-3 text-caption transition-colors duration-state ease-ease ${
        on
          ? 'border-ink bg-ink text-canvas'
          : 'border-line-strong bg-surface text-ink2 hover:text-ink'
      }`}
    >
      <Icon name="info" />
      Blueprint
    </button>
  );
};
