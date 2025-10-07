import { useState } from "react";
import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import Sales from "./components/Sales";

function App() {
  const [page, setPage] = useState("signup");

  return (
    <div>
      <h1>THE FARM</h1>
      <SignUp />
      {/* <Login /> */}
      {/* <Sales /> */}
    </div>
  );
}

export default App;
