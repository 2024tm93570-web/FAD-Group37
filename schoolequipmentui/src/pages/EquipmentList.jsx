import React, { useEffect, useState } from "react";
import { getEquipmentList } from "../api/apiConfig";

export default function EquipmentList({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = () => {
    setLoading(true);
    setError("");
    getEquipmentList()
      .then((data) => {
        console.log("Equipment list loaded:", data);
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading equipment:", err);
        setError("Error loading equipment: " + err.message);
        setItems([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Equipment List</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading equipment...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No Equipment Available</h4>
          <p>There are no equipment items in the database yet.</p>
          {user && user.role === "Admin" && (
            <p>Login as Admin to add equipment.</p>
          )}
        </div>
      ) : (
        <>
          {/* Card View */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
            {items.map((item) => (
              <div className="col" key={item.id || item.equipmentId}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">
                      <strong>Category:</strong> {item.category}<br />
                      <strong>Condition:</strong> {item.condition}<br />
                      <strong>Quantity:</strong> {item.quantity}<br />
                      <strong>Availability:</strong>{" "}
                      {item.availability ? (
                        <span className="badge bg-success">Available</span>
                      ) : (
                        <span className="badge bg-danger">Unavailable</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table View */}
          <div className="mt-5">
            <h3 className="mb-3">Table View</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Condition</th>
                    <th>Quantity</th>
                    <th>Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id || item.equipmentId}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.condition}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {item.availability ? (
                          <span className="badge bg-success">Available</span>
                        ) : (
                          <span className="badge bg-danger">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
