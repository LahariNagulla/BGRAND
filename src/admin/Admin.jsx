import { useState } from "react";
import "./Admin.css";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@bgrand.com" && password === "bgrand123") {
      window.location.href = "/admin/dashboard";
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-logo">BGRAND</div>

        <p className="admin-label">ADMINISTRATION</p>

        <h1>Welcome Back</h1>

        <p className="admin-subtitle">
          Sign in to manage your BGRAND property.
        </p>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="admin-error">{error}</p>}

          <button type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;