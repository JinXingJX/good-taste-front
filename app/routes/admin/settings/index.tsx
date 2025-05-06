import { Form } from '@remix-run/react';

export default function AdminSettings() {
  return (
    <div className="admin-settings">
      <h1>Site Settings</h1>
      <Form method="post" className="settings-form">
        <div className="form-group">
          <label htmlFor="siteName">Site Name</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="siteDescription">Site Description</label>
          <textarea
            id="siteDescription"
            name="siteDescription"
            rows={4}
          />
        </div>
        <button type="submit" className="button">Save Settings</button>
      </Form>
    </div>
  );
} 