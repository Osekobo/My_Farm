import { useState, useEffect } from "react";
import "./componentstyles/employee.css";
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
        <div id="employees-page">
            <div id="employees-container" className="mt-4">
                <h3 className="employees-title text-center mb-3">👥 Employees</h3>
                {error && <p id="error-message" className="text-danger text-center">{error}</p>}
                {message && <p id="success-message" className="text-success text-center">{message}</p>}
                <div className="employees-controls d-flex justify-content-end mb-3">
                    <button
                        id="toggle-form-btn"
                        className="btn btn-secondary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? "Cancel" : "Add New Employee"}
                    </button>
                </div>
                {showForm && (
                    <form id="employee-form" onSubmit={handleSubmit} className="mb-4">
                        <div className="row g-2 form-row">
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Employee name"
                                    className="form-control employee-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    name="phone_number"
                                    placeholder="Phone number"
                                    className="form-control employee-input"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control employee-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    name="role"
                                    placeholder="Role"
                                    className="form-control employee-input"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="salary"
                                placeholder="Salary"
                                className="form-control employee-input"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" id="save-btn" className="btn btn-secondary mt-3">
                            Save Employee
                        </button>
                    </form>
                )}
                <div className="table-responsive">
                    <table id="employees-table" className="table table-hover text-center align-middle">
                        <thead className="table-secondary">
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeedata.map((e) => (
                                <tr key={e.id} className="employee-row">
                                    <td data-label="Name">{e.name}</td>
                                    <td data-label="Phone Number">{e.phone_number}</td>
                                    <td data-label="Email">{e.email}</td>
                                    <td data-label="Role">{e.role}</td>
                                    <td data-label="Salary">{e.salary}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default Employees;
