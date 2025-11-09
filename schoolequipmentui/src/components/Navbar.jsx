import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">Home</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/EquipmentList">Equipment List</Link>
          </li>
        </ul>
        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="me-3">Logged in as {user.name}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <Link className="btn btn-outline-primary btn-sm" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
