/**
 * Client entry point
 */
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import Root from './root';

startTransition(() => {
  hydrateRoot(
    document,
    <Root />
  );
});