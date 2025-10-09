import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function EggsProduction() {
    const [eggsproduction, setEggsproduction] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/eggsproduction")
                const data = await response.json();

                if (response.ok) {
                    setEggsproduction(data)
                } else {
                    setError(data.message || "Failed to load eggs collection data!")
                }
            } catch (err) {
                setError("Server: " + err.message)
            }
        }
        fetchCollection()
    }, [])

    return (
        <div>
            <h3>Collection Data</h3>
            <div>
                {error && <p className="text-danger text-center">{error}</p>}
                <table className="container table table-secondary table-borderless table-hover mt-4">
                    <thead className="table-dark">
                        <tr className="fw-bold">
                            <td>Batch ID</td>
                            <td>Date</td>
                            <td>Eggs Collected</td>
                            <td>Broken Eggs</td>
                            <td>Remaining Eggs</td>
                            <td>Number of Crates</td>
                            <td>Remarks</td>
                            <td>Extra Eggs</td>
                        </tr>
                    </thead>
                    <tbody>
                        {eggsproduction.map((eggsproduction) => (
                            <tr key={eggsproduction.id}>
                                <td>{eggsproduction.batch_id}</td>
                                <td>{eggsproduction.date}</td>
                                <td>{eggsproduction.eggs_collected}</td>
                                <td>{eggsproduction.broken_eggs}</td>
                                <td>{eggsproduction.remaining_eggs}</td>
                                <td>{eggsproduction.quantity_in_crates}</td>
                                <td>{eggsproduction.remarks}</td>
                                <td>{eggsproduction.extra_eggs}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default EggsProduction;