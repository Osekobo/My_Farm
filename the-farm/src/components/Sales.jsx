import { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./componentstyles/Sales.css";

function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [formData, setFormData] = useState({
        date: "",
        buyer_name: "",
        quantity_in_crates: "",
        price_per_tray: "",
        transport_costs: "",
    });

    const BASE_URL = "http://127.0.0.1:5000";

    // Convert date to YYYY-MM-DD for date input
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

    // Create or update sale
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingSale ? "PATCH" : "POST";
            const url = editingSale
                ? `${BASE_URL}/sale/${editingSale.id}`
                : `${BASE_URL}/sales`;

            const payload = editingSale
                ? { id: editingSale.id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setShowForm(false);
                setEditingSale(null);
                setFormData({
                    date: "",
                    buyer_name: "",
                    quantity_in_crates: "",
                    price_per_tray: "",
                    transport_costs: "",
                });
                setError("");
                fetchSales();
            } else {
                setError(data.message || "Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            setError("Error communicating with the server!");
        }
    };

    // Fetch all sales
    const fetchSales = async () => {
        try {
            const response = await fetch(`${BASE_URL}/sales`);
            const data = await response.json();
            if (response.ok) {
                setSales(data);
            } else {
                setError(data.message || "Failed to load sales data!");
            }
        } catch (err) {
            setError("Server error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // Delete a sale
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this sale?")) return;
        try {
            const response = await fetch(`${BASE_URL}/sale/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();

            if (response.ok) {
                setError("");
                fetchSales();
            } else {
                setError(data.message || "Failed to delete sale!");
            }
        } catch (err) {
            setError("Error deleting sale: " + err.message);
        }
    };

    // Edit a sale
    const handleEdit = (sale) => {
        setEditingSale(sale);
        setFormData({
            date: formatDate(sale.date),
            buyer_name: sale.buyer_name,
            quantity_in_crates: sale.quantity_in_crates,
            price_per_tray: sale.price_per_tray,
            transport_costs: sale.transport_costs,
        });
        setShowForm(true);
    };

    if (loading) return <p>Loading sales...</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-3">Sales</h1>
            
            <button className="btn btn-secondary mb-3" onClick={() => {
                setShowForm(!showForm);
                setEditingSale(null);
                setFormData({
                    date: "",
                    buyer_name: "",
                    quantity_in_crates: "",
                    price_per_tray: "",
                    transport_costs: "",
                });
            }}>
                {showForm ? "Cancel" : editingSale ? "Edit Sale" : "Add New Sale"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    <input type="text" name="buyer_name" placeholder="Buyer" value={formData.buyer_name} onChange={handleChange} required />
                    <input type="number" name="quantity_in_crates" placeholder="Crates" value={formData.quantity_in_crates} onChange={handleChange} required />
                    <input type="number" name="price_per_tray" placeholder="Price/tray" value={formData.price_per_tray} onChange={handleChange} required />
                    <input type="number" name="transport_costs" placeholder="Transport Cost" value={formData.transport_costs} onChange={handleChange} required />
                    <button type="submit" className="btn btn-primary mt-2">
                        {editingSale ? "Update Sale" : "Save Sale"}
                    </button>
                </form>
            )}

            {error && <p className="text-danger">{error}</p>}

            <table className="table table-hover table-bordered text-center">
                <thead className="table-secondary">
                    <tr>
                        <th>Date</th>
                        <th>Buyer</th>
                        <th>Crates</th>
                        <th>Price/tray</th>
                        <th>Selling Price</th>
                        <th>Transport Cost</th>
                        <th>Final Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td>{formatDate(sale.date)}</td>
                            <td>{sale.buyer_name}</td>
                            <td>{sale.quantity_in_crates}</td>
                            <td>{sale.price_per_tray}</td>
                            <td>{sale.selling_price}</td>
                            <td>{sale.transport_costs}</td>
                            <td>{sale.final_amount}</td>
                            <td>
                                <button className="btn btn-sm btn-primary me-1" onClick={() => handleEdit(sale)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sale.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Sales;
