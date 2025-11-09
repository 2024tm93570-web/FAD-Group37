import React, { useEffect, useState } from "react";
import { getRequests, approveRequest, rejectRequest, getEquipmentList } from "../api/mockAPI";

export default function LabAssistantDashboard() {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);

  // Load requests and equipment
  const loadData = () => {
    getRequests().then((data) => setRequests(data));
    getEquipmentList().then((data) => setItems(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = (requestId, action) => {
    if (action === "Approve") {
      approveRequest(requestId)
        .then((msg) => {
          alert(msg);
          loadData(); // Refresh requests and equipment
        })
        .catch((err) => alert(err));
    } else if (action === "Reject") {
      rejectRequest(requestId)
        .then((msg) => {
          alert(msg);
          loadData();
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lab Assistant Dashboard</h2>

      <section className="mb-4">
        <h3>Pending Requests</h3>
        {requests.filter((r) => r.status === "Pending").length === 0 && <p>No pending requests</p>}
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {requests
            .filter((r) => r.status === "Pending")
            .map((r) => (
              <div className="col" key={r.id}>
                <div className="card p-2">
                  <h5>{r.itemName}</h5>
                  <p>
                    Qty: {r.qty} <br />
                    Requested by: {r.requestedByName}
                  </p>
                  <button className="btn btn-success me-2" onClick={() => handleAction(r.id, "Approve")}>
                    Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => handleAction(r.id, "Reject")}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section>
        <h3>All Requests</h3>
        {requests.length === 0 && <p>No requests yet</p>}
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {requests.map((r) => (
            <div className="col" key={r.id}>
              <div className="card p-2">
                <h5>{r.itemName}</h5>
                <p>
                  Qty: {r.qty} <br />
                  Requested by: {r.requestedByName} <br />
                  Status: <strong>{r.status}</strong>
                </p>
                {r.status === "Approved" && (
                  <span className="badge bg-success">Approved - Count reduced</span>
                )}
                {r.status === "Rejected" && (
                  <span className="badge bg-danger">Rejected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <h3>Equipment Inventory</h3>
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {items.map((i) => (
            <div className="col" key={i.equipmentId}>
              <div className="card h-100 p-3">
                <h5 className="card-title">{i.name}</h5>
                <p className="card-text">
                  Category: {i.category} <br />
                  Condition: {i.condition} <br />
                  Qty: {i.quantity} <br />
                  Available: {i.availability ? "✅" : "❌"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
