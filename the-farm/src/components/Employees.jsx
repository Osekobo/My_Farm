import { useState, useEffect } from "react";

function Employees() {
    const [employeedata, setEmployeedata] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchEmployees = async() => {
            try {
                const response = await fetch("http://127.0.0.1:5000/emplayeedata")
                const data = await response.json()

                if (response.ok) {
                    setEmployeedata(data)
                } else {
                    setError(data.message || "Error, can't find employee data!")
                }
            } catch(err) {
                setError("Error: " + err.message)
            }
        }
        fetchEmployees();
    }, [])

    return (
        <div>
            
        </div>
    )
}