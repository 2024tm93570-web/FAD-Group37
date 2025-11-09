import React, { useEffect, useState } from "react";
import { getItems, addRequest, getRequests, getEquipmentList } from "../api/mockAPI";
import "../styles.css"

export default function Student({ user }) {
    const [items, setItems] = React.useState([]);
    const [requests, setRequests] = React.useState([]);
    const [newItem, setNewItem] = React.useState({ name: "", category: "", condition: "", quantity: "" });
  
    
  const loadItems = () => {
    getEquipmentList().then((data) => setItems(data));
  };

  

  useEffect(() => {
    loadItems();
  }, []);

    React.useEffect(() => {
      setItems(getItems());
      setRequests(getRequests());
    }, []);
  
    if (!user || user.role !== "Student") {
      return <div>Access Denied</div>;
    }

    const handleRequest = (equipmentId) => {
        addRequest(equipmentId)
          .then((msg) => {
            alert(msg);
            loadItems(); // refresh list
          })
          .catch((err) => alert(err));
      };

  return (
    <div className="container my-4">
  <h2 className="mb-4 text-center">Student Dashboard</h2>

  {/* Available Equipment */}
  <section className="card p-4 shadow-sm">
    <h3 className="mb-3">Available Equipment</h3>

    {items.length === 0 ? (
      <p className="text-muted">No equipment available</p>
    ) : (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Condition</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.name}</td>
              <td>{it.category}</td>
              <td>{it.condition}</td>
              <td>{it.quantity}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleRequest(it)}
                  disabled={it.quantity === 0}
                >
                  {it.quantity === 0 ? "Unavailable" : "Request"}
                </button>
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
