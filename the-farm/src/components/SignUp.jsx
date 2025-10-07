import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import '/src/components.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function SignUp() {
  const [formData, setFormData] = useState({
    role: "user",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    admin_code: "",
  })
  const [message, setMessage] = useState("")
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup Successfull redirecting...")
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        setMessage($`{data.message}`);
      }
    } catch (error) {
      console.error(error)
      setMessage("Something went wrong!")
    }
  }
  return (
    <div className="signup-container">
      <div className="signup-left">
        <h2>Don't have an account?</h2>
        <p>Sign up to get started!</p>
        <button onClick={() => navigate("/login")}>Sign Up</button>
      </div>
      <div className="signup-right">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input type="text" name="username" placeholder="Name" value={formData.username} onChange={handleChange} required />
          <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          {formData.role === "admin" && (
            <input type="text" name="admin_code" placeholder="Admin Code" value={formData.admin_code} onChange={handleChange} />
          )}
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account?
          <a href="/Login">Login here</a></p>
        {message && (<p>{message}</p>)}
      </div>
    </div>
  )
}

export default SignUp;