/**
 * Client entry point
 */
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';

// Import routes
import routes from './routes';

startTransition(() => {
  const router = createBrowserRouter(routes);
  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </StrictMode>
  );
});