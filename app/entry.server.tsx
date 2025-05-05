/**
 * Server entry point
 */
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from '@react-router/node';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import { PassThrough } from 'stream';
import type { EntryContext } from '@react-router/node';

// Import routes
import routes from './routes';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const { query, dataRoutes } = createStaticHandler(routes);
  const remixRequest = createFetchRequest(request);
  
  const context = await query(remixRequest);
  
  if (context instanceof Response) {
    return context;
  }
  
  const router = createStaticRouter(dataRoutes, context);
  
  return new Promise((resolve) => {
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <I18nextProvider i18n={i18n}>
          <StaticRouterProvider router={router} context={context} />
        </I18nextProvider>
      </StrictMode>,
      {
        onAllReady() {
          responseHeaders.set('Content-Type', 'text/html');
          
          const body = new PassThrough();
          pipe(body);
          
          resolve(
            new Response(body, {
              status: responseStatusCode,
              headers: responseHeaders,
            })
          );
        },
        onShellError(err: unknown) {
          console.error(err);
          resolve(
            new Response(`<h1>Server Error</h1>${err}`, {
              status: 500,
              headers: { 'Content-Type': 'text/html' },
            })
          );
        },
      }
    );
  });
}

// Helper function to convert Request to standard fetch Request
function createFetchRequest(req: Request): Request {
  const url = new URL(req.url);
  
  return new Request(url.href, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
}