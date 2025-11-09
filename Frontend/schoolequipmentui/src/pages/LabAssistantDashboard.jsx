import React, { useEffect, useState } from "react";
import { getItems, getRequests, updateRequestStatus } from "../api/mockAPI";
import "../styles.css";

export default function LabAssistantDashboard({ user }) {
  const [items, setItems] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [newItem, setNewItem] = React.useState({ name: "", category: "", condition: "", quantity: "" });

  React.useEffect(() => {
    setItems(getItems());
    setRequests(getRequests());
  }, []);
  
  useEffect(() => {
    const data = getRequests();
    setRequests(Array.isArray(data) ? data : []); // safety check
  }, []);

  if (!user || user.role !== "LabAssistant") {
    return <div>Access Denied</div>;
  }

  function handleAction(id, status) {
    updateRequestStatus(id, status);
    setRequests(getRequests());
  }

  return (
    <div className="container my-4">
  <h2 className="mb-4 text-center">Lab Assistant Dashboard</h2>

  {/* Pending Requests */}  
  <section className="card mb-4 p-4 shadow-sm">
    <h3 className="mb-3">Pending Requests</h3>
    {requests.filter((r) => r.status === "Pending").length === 0 ? (
      <p className="text-muted">No pending requests</p>
    ) : (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Requested By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests
            .filter((r) => r.status === "Pending")
            .map((r) => (
              <tr key={r.id}>
                <td>{r.itemName}</td>
                <td>{r.qty}</td>
                <td>{r.requestedByName}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleAction(r.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(r.id, "Rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </section>

  {/* All Requests */}
  <section className="card mb-4 p-4 shadow-sm">
    <h3 className="mb-3">All Requests</h3>
    {requests.length === 0 ? (
      <p className="text-muted">No requests yet</p>
    ) : (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.itemName}</td>
              <td>{r.qty}</td>
              <td>{r.requestedByName}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "Approved" && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAction(r.id, "Returned")}
                  >
                    Mark Returned
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>
</div>
);
}
