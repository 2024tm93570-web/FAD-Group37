import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/mockAPI";
import Navbar from "../components/Navbar";
// import "./styles.css";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    const user = loginUser(email, password);
    if (user) {
      setUser(user);
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "LabAssistant") navigate("/lab");
      else navigate("/student");
    } else setError("Invalid credentials");
  }

  return (
    <div>  
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

    {error && <div className="alert alert-danger mt-3">{error}</div>}

    <p className="text-center text-muted mt-3 mb-0">
      Demo accounts:<br />
      admin@school.com / admin<br />
      lab@school.com / lab<br />
      student@school.com / student
    </p>
  </div>
</div>
</div>
  );
}
