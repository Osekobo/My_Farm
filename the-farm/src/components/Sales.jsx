import { useEffect, useState } from "react";

function Sales() {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        date: "",
        buyer_name: "",
        quantity_in_crates: "",
        price_per_tray: "",
        transport_costs: "",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await fetch("http://127.0.0.1:5000/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await response.json();

            if (response.ok) {
                setShowForm(false);
                setFormData({ date: "", buyer_name: "", quantity_in_crates: "", price_per_tray: "", transport_costs: ""});
                setError("");
            } else {
                setError(data.message || "Something went wrong")
            }
        } catch (err) {
            console.error(err)
            setError("Something went wrong")
        }
    }

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/sales")
                const data = await response.json();

                if (response.ok) {
                    setSales(data)
                } else {
                    setError(data.message || "Failed to load sales data!")
                }
            } catch (err) {
                setError("Server error: " + err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchSales();
    }, []);

    if (loading) return <p>Loading sales...</p>;
    if (error) return <p>{error}</p>

    return (
        <div>
            <h3>All Sales Records</h3>
            <div>
                <button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add new Sale"}</button>
                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <input type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} required />
                        <input type="text" name="buyer_name" placeholder="Buyer" value={formData.buyer_name} onChange={handleChange} required/>
                        <input type="text" name="quantity_in_crates" placeholder="Crates" value={formData.quantity_in_crates} onChange={handleChange} required/>
                        <input type="text" name="price_per_tray" placeholder="Price/tray" value={formData.price_per_tray} onChange={handleChange} required/>
                        <input type="text" name="transport_cost" placeholder="Transport Cost" value={formData.transport_costs} onChange={handleChange} required/>
                        <button type="submit">Save</button>
                    </form>
                )}
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Buyer</th>
                            <th>Crates</th>
                            <th>Price/crate</th>
                            <th>Selling price</th>
                            <th>Transport cost</th>
                            <th>Final Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id}>
                                <td>{sale.date}</td>
                                <td>{sale.buyer_name}</td>
                                <td>{sale.quantity_in_crates}</td>
                                <td>{sale.price_per_tray}</td>
                                <td>{sale.selling_price}</td>
                                <td>{sale.transport_costs}</td>
                                <td>{sale.final_amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Sales;