import { Routes, Route } from "react-router-dom";
// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import Expenses from "./components/Expenses"
// import Batch from "./components/Batch"
// import Employees from "./components/Employees";
import  EggsProduction from "./components/EggsProduction"

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/batch" element={<Batch />} />
      <Route path="/expenses" element={<Expenses />} />*/}
      
      <Route path="/eggsproduction" element={<EggsProduction />} />

    </Routes>
  );
}

export default App;
