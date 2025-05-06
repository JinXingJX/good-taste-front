import React from 'react';
import { Outlet } from 'react-router-dom'; // If you plan to have nested routes like /products/:id

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <p>Welcome to the products section.</p>
      {/* If you have child routes for individual products or categories, render them here */}
      {/* <Outlet /> */}
    </div>
  );
}
