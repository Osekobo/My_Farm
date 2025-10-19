import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./componentstyles/dashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Userdashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      {/* Topbar */}
      <header className="topbar">
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "x" : "☰"}
        </button>
        <h1 className="topbar-title">Golden - Yolk</h1>
        <div className="topbar-right">
          {/* Add future icons, username, or logout button here */}
          <button className="btn btn-outline-danger">Logout</button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/batch" className="nav-item">Batch</NavLink>
          <NavLink to="/dashboard/eggproduction" className="nav-item">Egg Production</NavLink>
          <NavLink to="/dashboard/sales" className="nav-item">Sales</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Userdashboard;
