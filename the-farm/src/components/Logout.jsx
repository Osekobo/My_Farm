function Logout() {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    }

    // Remove token locally
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
