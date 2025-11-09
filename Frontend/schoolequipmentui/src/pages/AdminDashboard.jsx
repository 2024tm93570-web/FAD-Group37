import React, { useState, useEffect } from "react";
import { getItems, addItem, deleteItem, getRequests } from "../api/mockAPI";
// import "./styles.css";

export default function AdminDashboard({ user }) {
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
  
    if (!user || user.role !== "Admin") {
      return <div>Access Denied</div>;
    }
  function handleAddItem(e) {
    e.preventDefault();
    addItem({ ...newItem, quantity: parseInt(newItem.quantity) });
    setItems(getItems());
    setNewItem({ name: "", category: "", condition: "", quantity: "" });
  }

  function handleDelete(id) {
    deleteItem(id);
    setItems(getItems());
  }

  return (
    <div className="container my-4">
  <h2 className="mb-4 text-center">Admin Dashboard</h2>

  {/* Add Equipment Section */}
  <section className="card mb-4 p-4 shadow-sm">
    <h3 className="mb-3">Add Equipment</h3>
    <form className="row g-3" onSubmit={handleAddItem}>
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
      </div>
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          required
        />
      </div>
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Condition"
          value={newItem.condition}
          onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
          required
        />
      </div>
      <div className="col-md-2">
        <input
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          required
        />
      </div>
      <div className="col-md-1">
        <button type="submit" className="btn btn-success w-100">Add</button>
      </div>
    </form>
  </section>

  {/* Equipment List Section */}
  <section className="card mb-4 p-4 shadow-sm">
    <h3 className="mb-3">Equipment List</h3>
    {items.length === 0 ? (
      <p className="text-muted">No equipment available</p>
    ) : (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
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
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(it.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>

  {/* Requests Section */}
  <section className="card mb-4 p-4 shadow-sm">
    <h3 className="mb-3">Requests</h3>
    {requests.length === 0 ? (
      <p className="text-muted">No requests yet</p>
    ) : (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.itemName}</td>
              <td>{r.qty}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>
</div>

  );
}
