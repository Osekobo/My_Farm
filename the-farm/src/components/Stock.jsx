import { useState, useEffect } from "react";

function Stock() {
    const [stock, setStock] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStocks = async() => {
            try {
                const response = await fetch("http://127.0.0.1:5000/employeedata")
                const data = await response.json()

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setStock(data)
                    } else {
                        setStock([])
                        setError(data.message || "Data error")
                    }
                } else {
                    setError(data.message || "Server error")
                }
            } catch(err) {
                setError(`${err.message}`)
            }
        }
        fetchStocks();
    }, [])
    return (
        <div>
            <h3>Crates in Stock: </h3>
            {stock.map((s) => (
                <h3 key={s.id}>{s.crates_in_store}</h3>
            ))}
        </div>
    )
}
export default Stock