import { Routes, Route } from "react-router-dom";
// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import Expenses from "./components/Expenses"
// import Batch from "./components/Batch"
import Employees from "./components/Employees";
// import Stock  from "./components/Stock";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/batch" element={<Batch />} /> */}
      <Route path="/employees" element={<Employees />} />
      {/* <Route path="stock" element={<Stock />}/> */}
    </Routes>
  );
}

export default App;
