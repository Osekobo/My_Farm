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
                    setExpenses(data)
                } else {
                    setError(data.message || "Failed to fetch Expense data!")
                }
            } catch(err) {
                setError("Error: " + err.message)
            }
        }
        fetchExpenses()
    }, [])
}