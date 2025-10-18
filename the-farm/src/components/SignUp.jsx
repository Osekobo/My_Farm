import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./componentstyles/signup.css";

function SignUp() {
  const [formData, setFormData] = useState({
    role: "user",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    admin_code: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong!");
    }
  };

  // ✅ Move the JSX return here (outside handleSubmit)
  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Side */}
        <div className="signup-left">
          <h2>Already have an account?</h2>
          <p>Log in to get started!</p>
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
        {/* Right Side */}
        <div className="signup-right">
          <h2>Sign Up</h2>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-3 w-75 mx-auto mt-4"
          >
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-control"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="form-control"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
            />
            {formData.role === "admin" && (
              <input
                type="text"
                name="admin_code"
                placeholder="Admin Code"
                value={formData.admin_code}
                onChange={handleChange}
                className="form-control"
              />
            )}
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
