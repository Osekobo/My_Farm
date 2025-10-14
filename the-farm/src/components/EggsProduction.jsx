import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function EggsProduction() {
    const [eggsproduction, setEggsproduction] = useState([])
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        batch_id: "",
        date: "",
        eggs_collected: "",
        broken_eggs: "",
        remarks: "",
    })
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/eggsproduction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                setShowForm(false);
                setFormData({ batch_id: "", date: "", eggs_collected: "", broken_eggs: "", remarks: ""})
                setError("")
            } else {
                setError(data.message)
            }
        } catch (err) {
            console.error(err);
            setError(data.message);
        }
    }

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/eggsproduction")
                const data = await response.json();

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setEggsproduction(data)
                    } else {
                        setEggsproduction([])
                        setError(data.message || "Error with the data format")
                    }

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
            {error && <p className="text-danger text-center">{error}</p>}
            <h3>Collection Data</h3>
            {error && <p className="text-danger text-center">{error}</p>}
            <div>
                <button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add new Collection Data"}</button>
                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="batch_id" placeholder="Batch ID" value={formData.batch_id} onChange={handleChange} required />
                        <input type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} required />
                        <input type="text" name="eggs_collected" placeholder="Eggs Collected" value={formData.eggs_collected} onChange={handleChange} required />
                        <input type="text" name="broken_eggs" placeholder="Broken Eggs" value={formData.broken_eggs} onChange={handleChange} required />
                        <input type="text" name="remarks" placeholder="Remarks on Collection" value={formData.remarks} onChange={handleChange}/>
                        <button type="submit">Save</button>
                    </form>
                )}
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
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
                        {eggsproduction.map((e) => (
                            <tr key={e.id}>
                                <td>{e.batch_id}</td>
                                <td>{e.date}</td>
                                <td>{e.eggs_collected}</td>
                                <td>{e.broken_eggs}</td>
                                <td>{e.remaining_eggs}</td>
                                <td>{e.quantity_in_crates}</td>
                                <td>{e.remarks}</td>
                                <td>{e.extra_eggs}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default EggsProduction;