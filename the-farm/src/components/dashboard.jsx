import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./componentstyles/dashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EggProductionChart from "./EggsProductionChart";
import SalesGraph from "./SalesGraph";
import PopulationGraph from "./PopulationGraph";
import ExpenseGraph from "./ExpenseGraph";
import VaccinationAlert from "./VaccinationAlert";
import FeedAlert from "./FeedAlert";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // <-- Add this hook to detect current route

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  };

  // Check if we are on the dashboard home route
  const isDashboardHome = location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <div className="dashboard-layout">
      <header className="topbar">
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "×" : "☰"}
        </button>
        <h1 className="topbar-title text-warning">Golden Yolk</h1>
        <div className="topbar-right">
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav">
          <NavLink to="" className="nav-item">Dashboard</NavLink>
          <NavLink to="batch" className="nav-item">Batch</NavLink>
          <NavLink to="eggsproduction" className="nav-item">Egg Production</NavLink>
          <NavLink to="employees" className="nav-item">Employees</NavLink>
          <NavLink to="expenses" className="nav-item">Expenses</NavLink>
          <NavLink to="profits" className="nav-item">Profits</NavLink>
          <NavLink to="sales" className="nav-item">Sales</NavLink>
          <NavLink to="vaccinationinfo" className="nav-item">Vaccination Records</NavLink>
        </nav>
      </aside>

      <main className={`dashboard-content ${isSidebarOpen ? "" : "expanded"}`}>
        {/* Nested routes render here */}
        <Outlet />

        {/* Show graphs ONLY on dashboard home */}
        {isDashboardHome && (
          <div className="charts-grid">
            {/* <VaccinationAlert /> */}
            {/* <FeedAlert /> */}
            <EggProductionChart />
            <SalesGraph />
            <PopulationGraph />
            <ExpenseGraph />
          </div>
        )}
      </main>

    </div>
  );
}

export default Dashboard;
