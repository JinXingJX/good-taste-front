import { Link } from 'react-router-dom';

export default function AdminPages() {
  return (
    <div className="admin-pages">
      <div className="header">
        <h1>Pages</h1>
        <Link to="new" className="button">Create New Page</Link>
      </div>
      
      <div className="pages-list">
        {/* TODO: Add actual pages data and mapping */}
        <p>No pages found. Create your first page to get started.</p>
      </div>
    </div>
  );
} 