import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function EggsProduction() {
    const [productions, setProductions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduction, setEditingProduction] = useState(null);
    const [formData, setFormData] = useState({
        batch_id: "",
        date: "",
        eggs_collected: "",
        broken_eggs: "",
        remarks: "",
    });

    const BASE_URL = "http://127.0.0.1:5000";

    // Format date for <input type="date" />
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return !isNaN(date) ? date.toISOString().split("T")[0] : dateStr;
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Fetch all records
    const fetchProductions = async () => {
        try {
            const response = await fetch(`${BASE_URL}/eggsproduction`);
            const data = await response.json();
            if (response.ok) {
                setProductions(data);
                setError("");
            } else {
                setError(data.message || "Failed to load egg collection data!");
            }
        } catch (err) {
            setError("Server error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductions();
    }, []);

    // Create or update record
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingProduction ? "PATCH" : "POST";
            const url = editingProduction
                ? `${BASE_URL}/eggsproduct/${editingProduction.id}`
                : `${BASE_URL}/eggsproduction`;

            const payload = editingProduction
                ? { id: editingProduction.id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setShowForm(false);
                setEditingProduction(null);
                setFormData({
                    batch_id: "",
                    date: "",
                    eggs_collected: "",
                    broken_eggs: "",
                    remarks: "",
                });
                setError("");
                fetchProductions();
            } else {
                setError(data.message || "Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            setError("Error communicating with the server!");
        }
    };

    // Edit record
    const handleEdit = (production) => {
        setEditingProduction(production);
        setFormData({
            batch_id: production.batch_id,
            date: formatDate(production.date),
            eggs_collected: production.eggs_collected,
            broken_eggs: production.broken_eggs,
            remarks: production.remarks,
        });
        setShowForm(true);
    };

    // Delete record
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            const response = await fetch(`${BASE_URL}/eggsproduct/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (response.ok) {
                setError("");
                fetchProductions();
            } else {
                setError(data.message || "Failed to delete record!");
            }
        } catch (err) {
            setError("Error deleting record: " + err.message);
        }
    };

    if (loading) return <p>Loading egg collection data...</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-3">Eggs Production</h1>

            <button
                className="btn btn-secondary mb-3"
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingProduction(null);
                    setFormData({
                        batch_id: "",
                        date: "",
                        eggs_collected: "",
                        broken_eggs: "",
                        remarks: "",
                    });
                }}
            >
                {showForm ? "Cancel" : editingProduction ? "Edit Record" : "Add New Record"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        type="text"
                        name="batch_id"
                        placeholder="Batch ID"
                        value={formData.batch_id}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="eggs_collected"
                        placeholder="Eggs Collected"
                        value={formData.eggs_collected}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="broken_eggs"
                        placeholder="Broken Eggs"
                        value={formData.broken_eggs}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="remarks"
                        placeholder="Remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-primary mt-2">
                        {editingProduction ? "Update Record" : "Save Record"}
                    </button>
                </form>
            )}

            {error && <p className="text-danger">{error}</p>}

            <table className="table table-hover table-bordered text-center">
                <thead className="table-secondary">
                    <tr>
                        <th>Batch ID</th>
                        <th>Date</th>
                        <th>Eggs Collected</th>
                        <th>Broken Eggs</th>
                        <th>Remaining Eggs</th>
                        <th>Number of Crates</th>
                        <th>Extra Eggs</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {productions.map((p) => (
                        <tr key={p.id}>
                            <td>{p.batch_id}</td>
                            <td>{formatDate(p.date)}</td>
                            <td>{p.eggs_collected}</td>
                            <td>{p.broken_eggs}</td>
                            <td>{p.remaining_eggs}</td>
                            <td>{p.quantity_in_crates}</td>
                            <td>{p.extra_eggs}</td>
                            <td>{p.remarks}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-primary me-1"
                                    onClick={() => handleEdit(p)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(p.id)}
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

export default EggsProduction;
