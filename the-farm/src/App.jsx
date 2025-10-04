import { useState } from "react";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

function App() {
  const [page, setPage] = useState("signup");

  return (
    <div>
      <h1>THE FARM</h1>

      {page === "signup" && <SignUp goToLogin={() => setPage("login")} />}
      {page === "login" && <Login goToSignup={() => setPage("signup")} />}
    </div>
  );
}

export default App;
