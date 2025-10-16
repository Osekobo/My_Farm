import { useEffect, useState } from "react";
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

  const BASE_URL = "http://127.0.0.1:5000";

  // Format date correctly for input fields
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return !isNaN(date) ? date.toISOString().split("T")[0] : dateStr;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle PATCH (edit) and POST (create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingBatch ? "PATCH" : "POST";
      const url = editingBatch
        ? `${BASE_URL}/batches/${editingBatch.id}`
        : `${BASE_URL}/batch`;

      const payload = editingBatch
        ? { id: editingBatch.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        fetchBatch(); // refresh
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error: " + err.message);
    }
  };

  // ✅ Fetch all batches
  const fetchBatch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/batch`);
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

  useEffect(() => {
    fetchBatch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete batch ID ${id}?`)) return;
    try {
      const response = await fetch(`${BASE_URL}/batches/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), 
      });

      const data = await response.json();
      if (response.ok) {
        setError("");
        fetchBatch();
      } else {
        setError(data.message || "Failed to delete batch!");
      }
    } catch (err) {
      setError("Error deleting batch: " + err.message);
    }
  };

  // ✅ Edit Batch
  const handleEdit = (b) => {
    setEditingBatch(b);
    setFormData({
      batch_name: b.batch_name,
      breed: b.breed,
      acquisition_date: formatDate(b.acquisition_date),
      initial_number: b.initial_number,
      current_number: b.current_number,
      status: b.status,
    });
    setShowForm(true);
  };

  return (
    <div className="container mt-4">
      <h2>Batch Records</h2>
      {error && <p className="text-danger">{error}</p>}

      <button
        className="btn btn-secondary mb-3"
        onClick={() => {
          setShowForm(!showForm);
          setEditingBatch(null);
          setFormData({
            batch_name: "",
            breed: "",
            acquisition_date: "",
            initial_number: "",
            current_number: "",
            status: "",
          });
        }}
      >
        {showForm ? "Cancel" : editingBatch ? "Edit Batch" : "Add New Batch"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            name="batch_name"
            placeholder="Batch name"
            value={formData.batch_name}
            onChange={handleChange}
            required
            disabled={!!editingBatch}
          />
          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={formData.breed}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="acquisition_date"
            value={formData.acquisition_date}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="initial_number"
            placeholder="Initial Number"
            value={formData.initial_number}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="current_number"
            placeholder="Current Number"
            value={formData.current_number}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary mt-2">
            {editingBatch ? "Update Batch" : "Save Batch"}
          </button>
        </form>
      )}

      <table className="table table-hover table-bordered text-center">
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>Batch Name</th>
            <th>Breed</th>
            <th>Acquisition Date</th>
            <th>Initial Number</th>
            <th>Current Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batch.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.batch_name}</td>
              <td>{b.breed}</td>
              <td>{formatDate(b.acquisition_date)}</td>
              <td>{b.initial_number}</td>
              <td>{b.current_number}</td>
              <td>{b.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Batch;
