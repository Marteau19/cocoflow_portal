/**
 * App.tsx
 *
 * Providers, shell, routes. In that order, because the shell reads the role and
 * the Blueprint state, and the routes render inside the shell.
 *
 * `useBrand` is called here rather than inside a provider: it writes CSS custom
 * properties to the document and returns values the top bar needs, and nothing
 * below it reads brand state to choose a value.
 */

import { useBrand } from './brands/useBrand';
import { BlueprintProvider } from './blueprint/BlueprintProvider';
import { AppRoutes } from './routes';
import { AppShell } from './shell/AppShell';
import { RoleProvider } from './shell/useRole';

export const App = () => {
  // Applies the active brand's tokens to :root, and installs Alt+Shift+N.
  useBrand();

  return (
    <RoleProvider>
      <BlueprintProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </BlueprintProvider>
    </RoleProvider>
  );
};
