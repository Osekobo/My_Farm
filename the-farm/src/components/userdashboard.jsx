import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./componentstyles/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Userdashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      {/* 🔝 Topbar */}
      <header className="topbar">
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "×" : "☰"}
        </button>
        <h1 className="topbar-title">Golden - Yolk</h1>
        <div className="topbar-right">
          <button className="btn btn-outline-danger">Logout</button>
        </div>
      </header>

      {/* 🧭 Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav">
          {/* Use relative paths for nested routes under /userdashboard */}
          <NavLink to="batch" className="nav-item">
            Batch
          </NavLink>
          <NavLink to="eggsproduction" className="nav-item">
            Egg Production
          </NavLink>
          <NavLink to="sales" className="nav-item">
            Sales
          </NavLink>
        </nav>
      </aside>

      {/* 📄 Main Content */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Userdashboard;
