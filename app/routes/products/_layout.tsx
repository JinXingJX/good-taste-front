import { Outlet } from 'react-router-dom';

export default function ProductsLayout() {
  return (
    <div className="products-layout">
      {/* Add any common UI elements for products pages here */}
      <Outlet />
    </div>
  );
} 