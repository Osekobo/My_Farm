import { jwtDecode } from "jwt-decode";

function GetUserRole() {
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    
    return decoded.sub?.role || decoded.role || null;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export default GetUserRole;
