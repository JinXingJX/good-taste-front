import { Form } from '@remix-run/react';

export default function AdminPageEdit() {
  return (
    <div className="admin-page-edit">
      <h1>Edit Page</h1>
      <Form method="post" className="page-form">
        <div className="form-group">
          <label htmlFor="title">Page Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="slug">URL Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
          />
        </div>
        <button type="submit" className="button">Save Page</button>
      </Form>
    </div>
  );
} 