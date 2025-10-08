import { useState, useEffect } from "react";

function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState("")
    

    useEffect(() => {
        const fetchExpenses = async() => {
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
            } catch(err) {
                setError("Error: " + err.message)
            }
        }
        fetchExpenses()
    }, [])
    return (
        <div>
            <h3>Expenses</h3>
            <div>    
            <table>
                <thead>
                    <tr>
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