import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import LabAssistantDashboard from "./pages/LabAssistantDashboard";
import Student from "./pages/StudentDashboard";
import EquipmentList from "./pages/EquipmentList";

export default function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial load
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
        <Route path="/lab" element={<LabAssistantDashboard user={user} />} />
        <Route path="/student" element={<Student user={user} />} />
        <Route path="/EquipmentList" element={<EquipmentList user={user} />} />
      </Routes>
    </Router>
  );
}
