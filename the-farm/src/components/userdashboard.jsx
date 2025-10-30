import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./componentstyles/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import EggProductionChart from "./EggsProductionChart";
import SalesGraph from "./SalesGraph";
import PopulationGraph from "./PopulationGraph";
import VaccinationAlert from "./VaccinationAlert";
import FeedAlert from "./FeedAlert";

function Userdashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // ✅ Adjust to your route name
  const isDashboardHome =
    location.pathname === "/dashboard" ||
    location.pathname === "/userdashboard" ||
    location.pathname === "/";

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
          <button className="btn btn-outline-warning" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav">
          <NavLink to="" end className="nav-item">Dashboard</NavLink>
          <NavLink to="batch" className="nav-item">Batch</NavLink>
          <NavLink to="eggsproduction" className="nav-item">Egg Production</NavLink>
          <NavLink to="sales" className="nav-item">Sales</NavLink>
          <NavLink to="vaccinationinfo" className="nav-item">Vaccination</NavLink>
        </nav>
      </aside>
      <main className={`dashboard-content ${isSidebarOpen ? "" : "expanded"}`}>
        <Outlet />

        {/* ✅ Show graphs only on dashboard home */}
        {isDashboardHome && (
          <div className="charts-grid">
            {/* <VaccinationAlert /> */}
            {/* <FeedAlert /> */}
            <EggProductionChart />
            <SalesGraph />
            <PopulationGraph />
          </div>
        )}
      </main>

    </div>
  );
}

export default Userdashboard;
