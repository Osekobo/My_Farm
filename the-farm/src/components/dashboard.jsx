import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./componentstyles/dashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EggProductionChart from "./EggsProductionChart";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <header className="topbar">
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "×" : "☰"}
        </button>
        <h1 className="topbar-title">Golden Yolk</h1>
        <div className="topbar-right">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav">
          <NavLink to="batch" className="nav-item">Batch</NavLink>
          <NavLink to="eggsproduction" className="nav-item">Egg Production</NavLink>
          <NavLink to="employees" className="nav-item">Employees</NavLink>
          <NavLink to="expenses" className="nav-item">Expenses</NavLink>
          <NavLink to="profits" className="nav-item">Profits</NavLink>
          <NavLink to="sales" className="nav-item">Sales</NavLink>
          <NavLink to="stock" className="nav-item">Stock</NavLink>
          <NavLink to="vaccinationinfo" className="nav-item">Vaccination Records</NavLink>
        </nav>
      </aside>

      <main className={`dashboard-content ${isSidebarOpen ? "" : "expanded"}`}>
        <Outlet />
      </main>
      <EggProductionChart />
    </div>
  );
}

export default Dashboard;
