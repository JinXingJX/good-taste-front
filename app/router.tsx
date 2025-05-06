import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from "react";
import routes from './routes';

// In React Router v7, it's recommended to use the data router (createBrowserRouter)
// with route objects configured outside of component render functions.
// We're using the centralized routes definition from routes.ts
const router = createBrowserRouter(routes);

export default router; 