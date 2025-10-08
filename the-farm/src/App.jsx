import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Expenses from "./components/Expenses"

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />  
      <Route path="/login" element={<Login />} />   
      <Route path="/expenses" element={<Expenses/>}/>
    </Routes>
  );
}

export default App;
