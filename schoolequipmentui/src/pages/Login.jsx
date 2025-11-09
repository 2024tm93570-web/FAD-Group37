import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/apiConfig";
import { testBackendConnection } from "../api/connectionTest";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const navigate = useNavigate();

  // Test backend connection on component mount
  useEffect(() => {
    testBackendConnection().then((result) => {
      if (!result.success) {
        setConnectionStatus(`⚠️ ${result.message}`);
      } else {
        setConnectionStatus("✅ Connected");
      }
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      console.log("Attempting login with:", email);
      const user = await loginUser(email, password);
      console.log("Login successful:", user);
      setUser(user);
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "LabAssistant") navigate("/lab");
      else navigate("/student");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message || "Invalid credentials or server error";
      setError(errorMessage);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {connectionStatus && (
          <div className={`alert ${connectionStatus.includes("✅") ? "alert-success" : "alert-warning"} mt-3`}>
            {connectionStatus}
          </div>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <p className="text-center text-muted mt-3 mb-0">
          {/* Demo accounts:<br />
          admin@school.com / admin<br />
          lab@school.com / lab<br />
          student@school.com / student<br /> */}
          <small className="text-danger">Note: You must be a registered user to login</small>
        </p>
      </div>
    </div>
  );
}
