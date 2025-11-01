import { useState } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import "./componentstyles/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import EggProductionChart from "./EggsProductionChart";
import VaccinationAlert from "./VaccinationAlert";
import FeedAlert from "./FeedAlert";
import SalesGraph from "./SalesGraph";
import PopulationGraph from "./PopulationGraph";



function Userdashboard() {
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
        <h1 className="topbar-title">Golden - Yolk</h1>
        <div className="topbar-right">
          <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav">
          <NavLink to="" className="nav-item">Dashboard</NavLink>
          <NavLink to="batch" className="nav-item">
            Batch
          </NavLink>
          <NavLink to="eggsproduction" className="nav-item">
            Egg Production
          </NavLink>
          <NavLink to="sales" className="nav-item">
            Sales
          </NavLink>
          <NavLink to="vaccinationinfo" className="nav-item">
            Vaccination Records
          </NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
      <EggProductionChart />
      <SalesGraph />
      <PopulationGraph />
      <VaccinationAlert />
      <FeedAlert />
    </div>
  );
}

export default Userdashboard;
