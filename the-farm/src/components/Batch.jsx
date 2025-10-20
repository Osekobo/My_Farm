import { useEffect, useState } from "react";
import GetUserRole from "./Auth"; 
import "./componentstyles/batch.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Batch() {
  const [batch, setBatch] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    batch_name: "",
    breed: "",
    acquisition_date: "",
    initial_number: "",
    current_number: "",
    status: "",
  });

  const [role, setRole] = useState(null);
  const BASE_URL = "http://127.0.0.1:5000";

  useEffect(() => {
    const r = GetUserRole();
    setRole(r);
    fetchBatch();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "admin") {
      alert("You are not authorized to perform this action!");
      return;
    }

    try {
      const method = editingBatch ? "PATCH" : "POST";
      const url = editingBatch
        ? `${BASE_URL}/batches/${editingBatch.id}`
        : `${BASE_URL}/batch`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setError("");
        setShowForm(false);
        setEditingBatch(null);
        setFormData({
          batch_name: "",
          breed: "",
          acquisition_date: "",
          initial_number: "",
          current_number: "",
          status: "",
        });
        fetchBatch();
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  const fetchBatch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/batch`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBatch(Array.isArray(data) ? data : []);
      } else {
        setError(data.message || "Failed to load batch data!");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (role !== "admin") {
      alert("You are not authorized to delete batches!");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete batch ID ${id}?`)) return;

    try {
      const response = await fetch(`${BASE_URL}/batches/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        fetchBatch();
      } else {
        setError(data.message || "Failed to delete batch!");
      }
    } catch (err) {
      setError("Error deleting batch: " + err.message);
    }
  };

  const handleEdit = (b) => {
    if (role !== "admin") {
      alert("You are not authorized to edit batches!");
      return;
    }
    setEditingBatch(b);
    setFormData({
      batch_name: b.batch_name,
      breed: b.breed,
      acquisition_date: b.acquisition_date,
      initial_number: b.initial_number,
      current_number: b.current_number,
      status: b.status,
    });
    setShowForm(true);
  };

  return (
    <div id="batch-page">
      <div id="batch-container" className="container mt-4">
        <h3 className="batch-title text-center mb-3">🐣 Batch Records</h3>
        {error && <p className="text-danger text-center">{error}</p>}

        {/* Only Admin Can See Add Button */}
        {role === "admin" && (
          <div className="batch-controls d-flex justify-content-end mb-3">
            <button
              id="toggle-batch-form-btn"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(!showForm);
                setEditingBatch(null);
              }}
            >
              {showForm ? "Cancel" : "Add New Batch"}
            </button>
          </div>
        )}

        {/* Show Form only if admin */}
        {showForm && role === "admin" && (
          <form id="batch-form" onSubmit={handleSubmit} className="mb-4">
            {/* your form fields here */}
          </form>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Batch Name</th>
                <th>Breed</th>
                <th>Acquisition Date</th>
                <th>Initial Number</th>
                <th>Current Number</th>
                <th>Status</th>
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {batch.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.batch_name}</td>
                  <td>{b.breed}</td>
                  <td>{b.acquisition_date}</td>
                  <td>{b.initial_number}</td>
                  <td>{b.current_number}</td>
                  <td>{b.status}</td>
                  {role === "admin" && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(b)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Batch;
