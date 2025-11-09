import React, { useEffect } from "react";
import { getEquipmentList, addRequest } from "../api/apiConfig";
import "../styles.css"

export default function Student({ user }) {
    const [items, setItems] = React.useState([]);
  
  const loadItems = () => {
    getEquipmentList()
      .then((data) => {
        console.log("Equipment list loaded:", data);
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading equipment:", err);
        setItems([]);
        alert("Error loading equipment: " + err.message);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);
  
    if (!user || user.role !== "Student") {
      return <div>Access Denied</div>;
    }

    const handleRequest = (equipment) => {
        addRequest(equipment)
          .then((msg) => {
            alert(msg || "Request submitted successfully");
            loadItems(); // refresh list
          })
          .catch((err) => alert("Error: " + err.message));
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
            <tr key={it.id || it.equipmentId}>
              <td>{it.name}</td>
              <td>{it.category}</td>
              <td>{it.condition}</td>
              <td>{it.quantity}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleRequest(it)}
                  disabled={!it.availability || it.quantity === 0}
                >
                  {!it.availability || it.quantity === 0 ? "Unavailable" : "Request"}
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
