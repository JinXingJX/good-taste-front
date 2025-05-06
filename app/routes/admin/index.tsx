export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Pages</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>New Messages</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>0</p>
        </div>
      </div>
    </div>
  );
}
