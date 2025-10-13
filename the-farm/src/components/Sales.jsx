import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Sales () {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect (() => {
        const fetchSales = async () => {
            try {
                const response = await fetch ("http://127.0.0.1:5000/sales")
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
            <h3 className="text-center mt-3">All Sales Records</h3>

            <div>
                <table className="container table table-secondary table-borderless table-hover mt-4">
                    <thead className="table-dark">
                        <tr className="fw-bold">
                            <th>Date</th>
                            <th>Buyer</th>
                            <th>Crates</th>
                            <th>Price/tray</th>
                            <th>Selling price</th>
                            <th>Transport cost</th>  
                            <th>Final Amount</th>                                                      
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id} className="text-center">
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