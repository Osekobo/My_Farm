import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login () {
    const [username_or_email, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        try{
            const response = await fetch("http://127.0.0.1:5000/login", {
             method: "POST",
             headers:{
                "Content-Type": "application/json"
             },
             body: JSON.stringify({username_or_email, password}),
        })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard")
            } else {
                setError(data.message || "Login failed")
            }
        } catch (err) {
            setError("Please try again")
        }
        
    }
    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username or Email" value={username_or_email} onChange={(e) => setusername(e.target.value)}/>
                <input type="password" name="password" placeholder="password" value={password} onChange={(e) => setpassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default Login