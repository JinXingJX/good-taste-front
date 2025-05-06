// app/routes.ts
import { lazy } from 'react';
import type { ReactNode } from 'react';
import { type RouteObject } from 'react-router-dom';

// Lazy loading components for better performance
const AdminLayout = lazy(() => import('./routes/admin'));
const AdminDashboard = lazy(() => import('./routes/admin/index'));
const AdminLogin = lazy(() => import('./routes/admin/login'));
const AdminPages = lazy(() => import('./routes/admin/pages/index'));
const AdminPageEdit = lazy(() => import('./routes/admin/pages/$key'));
const AdminProducts = lazy(() => import('./routes/admin/products/index'));
const AdminProductEdit = lazy(() => import('./routes/admin/products/$id'));
const AdminMessages = lazy(() => import('./routes/admin/messages/index'));
const AdminUsers = lazy(() => import('./routes/admin/users/index'));
const AdminSettings = lazy(() => import('./routes/admin/settings/index'));

const PublicLayout = lazy(() => import('./routes/_layout'));
const Home = lazy(() => import('./routes/index'));
const About = lazy(() => import('./routes/about'));
const Resources = lazy(() => import('./routes/resources'));
const Culture = lazy(() => import('./routes/culture'));
const ProductsLayout = lazy(() => import('./routes/products/_layout'));
const ProductList = lazy(() => import('./routes/products/index'));
const ProductDetail = lazy(() => import('./routes/products/$id'));
const Message = lazy(() => import('./routes/message'));
const Contact = lazy(() => import('./routes/contact'));
// Using a standard 404 component
const NotFound = lazy(() => import('./routes/404'));

// Define a layout route for the admin section
const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { 
        index: true, 
        Component: AdminDashboard,
        // Use route-specific loader function to preload data
        loader: async () => {
          // This would load admin dashboard data
          return { message: 'Admin Dashboard' };
        }
      },
      { path: 'login', Component: AdminLogin },
      { path: 'pages', Component: AdminPages },
      { path: 'pages/:pageKey', Component: AdminPageEdit },
      { path: 'products', Component: AdminProducts },
      { path: 'products/:id', Component: AdminProductEdit },
      { path: 'messages', Component: AdminMessages },
      { path: 'users', Component: AdminUsers },
      { path: 'settings', Component: AdminSettings }
    ]
  }
];

const routes: RouteObject[] = [
  // Public Routes
  {
    path: '/',
    Component: PublicLayout,
    children: [
      { 
        index: true, 
        Component: Home,
        // Add loader for server-side data fetching
        loader: async () => {
          // Fetch necessary data for the homepage
          return { featured: 'content' };
        }
      },
      { path: 'about', Component: About },
      { path: 'resources', Component: Resources },
      { path: 'culture', Component: Culture },
      {
        path: 'products',
        Component: ProductsLayout,
        // Add loader for product layout
        loader: async () => {
          // Could fetch categories or other shared product data
          return { categories: ['A', 'B', 'C'] };
        },
        children: [
          { 
            index: true, 
            Component: ProductList,
            // Products list loader
            loader: async () => {
              // Fetch product list
              return { products: [] };
            }
          },
          { 
            path: ':id',
            Component: ProductDetail,
            // Add loader to fetch product details
            loader: async ({ params }) => {
              // Fetch product by ID
              return { id: params.id, name: 'Product' };
            }
          }
        ]
      },
      { path: 'message', Component: Message },
      { path: 'contact', Component: Contact }
    ]
  },
  // Admin Routes
  ...adminRoutes,
  // Catch-all route
  { 
    path: '*', 
    Component: NotFound,
    // This loader can send a 404 status code
    loader: () => {
      return new Response('Not Found', { status: 404 });
    }
  }
];

export default routes;