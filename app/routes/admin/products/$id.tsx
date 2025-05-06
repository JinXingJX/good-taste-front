import { Form } from '@remix-run/react';

export default function AdminProductEdit() {
  return (
    <div className="admin-product-edit">
      <h1>Edit Product</h1>
      <Form method="post" className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
          />
        </div>
        <button type="submit" className="button">Save Product</button>
      </Form>
    </div>
  );
} 