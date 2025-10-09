import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import Expenses from "./components/Expenses"
// import Batch from "./components/Batch"
// import Employees from "./components/Employees";
import  EggsProduction from "./components/EggsProduction"
=======
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Expenses from "./components/Expenses"
import Batch from "./components/Batch"
import Employees from "./components/Employees";
import Egg_production from "./components/EggsProduction"
import Employees from "./components/Employees";
import Stock  from "./components/Stock";
>>>>>>> 6bbc59fa72349cda08197cacead4301667d2157e

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/batch" element={<Batch />} />
<<<<<<< HEAD
      <Route path="/expenses" element={<Expenses />} />*/}
      
      <Route path="/eggsproduction" element={<EggsProduction />} />

=======
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/eggsproduction" element={<Eggproduction />} /> 
      <Route path="stock" element={<Stock />}/>
>>>>>>> 6bbc59fa72349cda08197cacead4301667d2157e
    </Routes>
  );
}

export default App;
