// app/root.tsx
// import { ... } from '@remix-run/react'; // Entire import block removed

import { StrictMode, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // Updated to use default import
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';

import './tailwind.css';

// Removed Remix links function
// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: styles },
// ];

// Removed Remix meta function
// export const meta: MetaFunction = () => {
//   return [
//     { title: "Good Taste International" }, // Default Title
//     { name: "description", content: "Welcome!" },
//     { charSet: "utf-8" },
//     { name: "viewport", content: "width=device-width, initial-scale=1" },
//   ];
// };

// Function to get the initial language (moved or handled within providers/i18n setup)
// const getInitialLanguage = (): string => { ... };

// AppLayout function (moved and adapted into RootProvidersLayout and PublicLayout in app/router.tsx)
// function AppLayout() { ... }

// Old router definition (now in app/router.tsx)
// const router = createBrowserRouter([ ... ]);

export default function Root() {
  // The main Root component now just renders the RouterProvider with the router from app/router.tsx
  return (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </I18nextProvider>
    </StrictMode>
  );
}