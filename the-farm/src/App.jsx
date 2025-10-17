import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Expenses from "./components/Expenses";
import Batch from "./components/Batch";
import Employees from "./components/Employees";
import EggsProduction from "./components/EggsProduction";
import Stock from "./components/Stock";
import Profits from "./components/Profits";
import Sales from "./components/Sales";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/batch" element={<Batch />} /> 
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/profits" element={<Profits/>} /> 
      <Route path="/eggsproduction" element={<EggsProduction />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/sales" element={<Sales /> } />
    </Routes>
  );
}

export default App;