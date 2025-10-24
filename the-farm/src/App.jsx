import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Expenses from "./components/Expenses";
import Batch from "./components/Batch";
import Employees from "./components/Employees";
import EggsProduction from "./components/EggsProduction";
import Stock from "./components/Stock";
import Profits from "./components/Profits";
import Sales from "./components/Sales";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import Logout from "./components/Logout";
import Dashboard from "./components/dashboard";
import Userdashboard from "./components/userdashboard";
import VaccinationInfo from "./components/VaccinationInfo";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="vaccinationinfo" element={<VaccinationInfo />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Routes>

              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="batch" element={<Batch />} />
                <Route path="employees" element={<Employees />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="profits" element={<Profits />} />
                <Route path="sales" element={<Sales />} />
                <Route path="eggsproduction" element={<EggsProduction />} />
                <Route path="stock" element={<Stock />} />
                <Route path="vaccinationinfo" element={<VaccinationInfo />} />
              </Route>

              <Route path="/userdashboard" element={<Userdashboard />}>
                <Route path="batch" element={<Batch />} />
                <Route path="eggsproduction" element={<EggsProduction />} />
                <Route path="sales" element={<Sales />} />
                <Route path="vaccinationinfo" element={<VaccinationInfo />} />
              </Route>

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
    
  );
}

export default App;
