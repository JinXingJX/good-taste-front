/**
 * Server entry point for React Router v7
 */
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';
import { PassThrough } from 'stream';

// Import routes
import routes from './routes';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
) {
  // Create a static handler for the routes
  const { query, dataRoutes } = createStaticHandler(routes);
  
  // Process the request with the handler
  const context = await query(request);
  
  // If the context is a Response, return it directly
  if (context instanceof Response) {
    return context;
  }
  
  // Create a static router with the context
  const router = createStaticRouter(dataRoutes, context);
  
  return new Promise((resolve) => {
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StaticRouterProvider router={router} context={context} />
      </StrictMode>,
      {
        onAllReady() {
          responseHeaders.set('Content-Type', 'text/html');
          
          const body = new PassThrough();
          
          // Create a Web Stream from the PassThrough stream
          const stream = new ReadableStream({
            start(controller) {
              pipe(body);
              
              body.on('data', (chunk) => {
                controller.enqueue(chunk);
              });
              
              body.on('end', () => {
                controller.close();
              });
              
              body.on('error', (err) => {
                controller.error(err);
              });
            },
          });
          
          resolve(
            new Response(stream, {
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