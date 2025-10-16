import { useState, useEffect } from "react";
import "/src/eggproduction.css";

function EggsProduction() {
    const [eggsproduction, setEggsproduction] = useState([]);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        batch_id: "",
        date: "",
        eggs_collected: "",
        broken_eggs: "",
        remarks: "",
    });
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
                setFormData({
                    batch_id: "",
                    date: "",
                    eggs_collected: "",
                    broken_eggs: "",
                    remarks: "",
                });
                setError("");
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/eggsproduction");
                const data = await response.json();

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setEggsproduction(data);
                    } else {
                        setEggsproduction([]);
                        setError(data.message || "Invalid data format.");
                    }
                } else {
                    setError(data.message || "Failed to load collection data!");
                }
            } catch (err) {
                setError("Server Error: " + err.message);
            }
        };
        fetchCollection();
    }, []);

    return (
        <div className="collection-page mt-4">
            {error && <p className="text-danger text-center emsg">{error}</p>}

            <h3 className="text-center mb-3">Collection Data</h3>

            {/* Floating button */}
            <div className="d-flex justify-content-end mb-3 position-relative">
                <button
                    className="btn btn-secondary bt1"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? (
                        <>
                            <span className="close-icon"></span> Close
                        </>
                    ) : (
                        <>
                            <span className="add-icon"></span> Add New Collection Data
                        </>
                    )}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-4 frm">
                    <div className="row g-2 form-row">
                        <div className="col-md-2">
                            <input
                                type="text"
                                name="batch_id"
                                placeholder="Batch ID"
                                value={formData.batch_id}
                                onChange={handleChange}
                                required
                                className="form-control expense-input"
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="form-control expense-input"
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                name="eggs_collected"
                                placeholder="Eggs Collected"
                                value={formData.eggs_collected}
                                onChange={handleChange}
                                required
                                className="form-control expense-input"
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                name="broken_eggs"
                                placeholder="Broken Eggs"
                                value={formData.broken_eggs}
                                onChange={handleChange}
                                required
                                className="form-control expense-input"
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="remarks"
                                placeholder="Remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                className="form-control expense-input"
                            />
                        </div>
                        <div className="col-md-1 d-flex align-items-center justify-content-center">
                            <button type="submit" className="btn btn-secondary sbtn">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Table */}
            <table className="table table-hover text-center align-middle batch-table">
                <thead className="table-secondary">
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
                        <tr key={e.id} className="batch-row">
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
    );
}

export default EggsProduction;
