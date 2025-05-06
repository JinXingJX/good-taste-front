import { type RouteObject } from 'react-router-dom';

// Define a layout route for the admin section
const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    file: './routes/admin.tsx',
    children: [
      { 
        index: true,
        file: './routes/admin/index.tsx',
        loader: async () => {
          return { message: 'Admin Dashboard' };
        }
      },
      { path: 'login', file: './routes/admin/login.tsx' },
      { path: 'pages', file: './routes/admin/pages/index.tsx' },
      { path: 'pages/:pageKey', file: './routes/admin/pages/$key.tsx' },
      { path: 'products', file: './routes/admin/products/index.tsx' },
      { path: 'products/:id', file: './routes/admin/products/$id.tsx' },
      { path: 'messages', file: './routes/admin/messages/index.tsx' },
      { path: 'users', file: './routes/admin/users/index.tsx' },
      { path: 'settings', file: './routes/admin/settings/index.tsx' }
    ]
  }
];

const routes: RouteObject[] = [
  // Public Routes
  {
    path: '/',
    file: './routes/_layout.tsx',
    children: [
      { 
        index: true,
        file: './routes/index.tsx',
        loader: async () => {
          return { featured: 'content' };
        }
      },
      { path: 'about', file: './routes/about.tsx' },
      { path: 'resources', file: './routes/resources.tsx' },
      { path: 'culture', file: './routes/culture.tsx' },
      {
        path: 'products',
        file: './routes/products/_layout.tsx',
        loader: async () => {
          return { categories: ['A', 'B', 'C'] };
        },
        children: [
          { 
            index: true,
            file: './routes/products/index.tsx',
            loader: async () => {
              return { products: [] };
            }
          },
          { 
            path: ':id',
            file: './routes/products/$id.tsx',
            loader: async ({ params }) => {
              return { id: params.id, name: 'Product' };
            }
          }
        ]
      },
      { path: 'message', file: './routes/message.tsx' },
      { path: 'contact', file: './routes/contact.tsx' }
    ]
  },
  // Admin Routes
  ...adminRoutes,
  // Catch-all route
  { 
    path: '*', 
    file: './routes/404.tsx',
    loader: () => {
      return new Response('Not Found', { status: 404 });
    }
  }
];

export default routes;
