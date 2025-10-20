import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./componentstyles/dashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      {/* 🔝 Top Bar */}
      <header className="topbar">
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "×" : "☰"}
        </button>
        <h1 className="topbar-title">Golden Yolk</h1>
        <div className="topbar-right">
          <button className="btn btn-outline-danger btn-sm">Logout</button>
        </div>
      </header>

      {/* 🧭 Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav">
          <NavLink to="batch" className="nav-item">Batch</NavLink>
          <NavLink to="eggsproduction" className="nav-item">Egg Production</NavLink>
          <NavLink to="employees" className="nav-item">Employees</NavLink>
          <NavLink to="expenses" className="nav-item">Expenses</NavLink>
          <NavLink to="profits" className="nav-item">Profits</NavLink>
          <NavLink to="sales" className="nav-item">Sales</NavLink>
          <NavLink to="stock" className="nav-item">Stock</NavLink>
        </nav>
      </aside>

      {/* 🧾 Main Content */}
      <main className={`dashboard-content ${isSidebarOpen ? "" : "expanded"}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
