import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Employees() {
    const [employeedata, setEmployeedata] = useState([]);
    const [error, setError] = useState();
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/employeedata");
                const data = await response.json();

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setEmployeedata(data);
                    } else {
                        setEmployeedata([]);
                        setError(data.message || "Data error");
                    }
                } else {
                    setError(data.message || "Error, can't find employee data!");
                }
            } catch (err) {
                setError("Error: " + err.message);
            }
        };
        fetchEmployees();
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        email: "",
        role: "",
        salary: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/employeedata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                setMessage("Employee added successfully!");
                setShowForm(false);
                setFormData({ name: "", phone_number: "", email: "", role: "", salary: "" });
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong");
        }
    };

    return (
        <div className="container mt-4">
            {error && <p className="text-danger text-center">{error}</p>}
            {message && <p className="text-success text-center">{message}</p>}

            <div className="new-employee text-center">
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancel" : "Add New Employee"}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2 align-items-center">
                        <input type="text" name="name" placeholder="Employee name" value={formData.name} onChange={handleChange} />
                        <input type="text" name="phone_number" placeholder="Phone number" value={formData.phone_number} onChange={handleChange} />
                        <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
                        <input type="text" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} />
                        <button type="submit" className="btn btn-success mt-2">Save</button>
                    </form>
                )}
            </div>

            <table className="table table-secondary table-hover mt-4">
                <thead className="table-dark">
                    <tr className="fw-bold text-center">
                        <td>Name</td>
                        <td>Phone Number</td>
                        <td>Email</td>
                        <td>Role</td>
                        <td>Salary</td>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {employeedata.map((e) => (
                        <tr key={e.id}>
                            <td>{e.name}</td>
                            <td>{e.phone_number}</td>
                            <td>{e.email}</td>
                            <td>{e.role}</td>
                            <td>{e.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Employees;
