import { useEffect, useState } from "react";
import { data } from "react-router-dom";

function Batch () {
    const [batch, setBatch] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBatch = async() => {
            try {
                const response = await fetch("http://127.0.0.1:5000/batch")
                data = await response.json();
                if (response.ok) {
                    setBatch(data)
                } else {
                    setError(data.message || "Can't get data from batch!")
                }
            } catch(err) {
                setError("Error: " + err.message )
            }
        }
        fetchBatch()
    }, [])
}