import { Link } from '@remix-run/react';

export default function AdminUsers() {
  return (
    <div className="admin-users">
      <div className="header">
        <h1>Users</h1>
        <Link to="new" className="button">Add New User</Link>
      </div>
      
      <div className="users-list">
        {/* TODO: Add actual users data and mapping */}
        <p>No users found. Add your first user to get started.</p>
      </div>
    </div>
  );
} 