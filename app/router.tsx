import { createBrowserRouter } from 'react-router-dom';
import routes from './routes';
import "./app.css";

// Only create browser router when in browser environment
let router;

if (typeof window !== 'undefined') {
  router = createBrowserRouter(routes);
}

export default router; 