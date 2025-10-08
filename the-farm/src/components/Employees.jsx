import { useState, useEffect } from "react";

function Employees() {
    const [employeedata, setEmployeedata] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/employeedata")
                const data = await response.json()

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setEmployeedata(data)
                    } else {
                        setEmployeedata([])
                        setError(data.message || "Data error")
                    }
                } else {
                    setError(data.message || "Error, can't find employee data!")
                }
            } catch (err) {
                setError("Error: " + err.message)
            }
        }
        fetchEmployees();
    }, [])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Phone Number</td>
                        <td>Email</td>
                        <td>Role</td>
                        <td>Salary</td>
                    </tr>
                </thead>
                <tbody>
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
    )
}
export default Employees