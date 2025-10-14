import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        date: "",
        category: "",
        amount_spent: "",
        description: "",
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
            const response = await fetch("http://127.0.0.1:5000/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                setShowForm(false);
                setFormData({ date: "", category: "", amount_spent: "", description: "" })
                setError("")
            } else {
                setError(data.message || "Something went wrong!")
            }
        } catch (err) {
            console.error(err)
            setError("Error with the db!")
        }
    }


    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/expenses")
                const data = await response.json()

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setExpenses(data)
                    } else {
                        setExpenses([]);
                        setError(data.message || "Data format error!")
                    }

                } else {
                    setError(data.message || "Failed to fetch Expense data!")
                }
            } catch (err) {
                setError("Error: " + err.message)
            }
        }
        fetchExpenses()
    }, [])
    return (
        <div>
            <h3 className="text-center mt-3">Expenses</h3>
            <div className="container d-flex justify-content-end">
                <button className="btn btn-secondary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add new Expense"}</button>
            </div>
            <div className="container d-flex justify-content-end mt-3">
                {showForm && (
                    <form onSubmit={handleSubmit} className="d-flex flex-column ">
                        <input type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} required className="form-control mb-3" />
                        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="form-control mb-3" />
                        <input type="number" name="amount_spent" placeholder="Amount Spent" value={formData.amount_spent} onChange={handleChange} required className="form-control mb-3" />
                        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="form-control mb-3" />
                        <button type="submit" className="btn btn-secondary">Save</button>
                    </form>
                )}
            </div>
            <div>
                {error && <p className="text-danger text-center">{error}</p>}
                <table className="container table-borderless table-hover mt-4 table">
                    <thead className="table-secondary">
                        <tr className="fw-bold text-center">
                            <td>Date</td>
                            <td>Category</td>
                            <td>Amount Spent</td>
                            <td>Description</td>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.date}</td>
                                <td>{expense.category}</td>
                                <td>{expense.amount_spent}</td>
                                <td>{expense.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Expenses;