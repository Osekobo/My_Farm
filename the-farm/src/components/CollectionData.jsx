import { useState, useEffect } from "react";

function CollectionData () {
    const [eggs_production, setEggs_production] = useState([])
    const [error] = useState("")

    useEffect (() => {
        const fetchcollection = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/eggs_production")
                const data = await response.json();

                if (response.ok) {
                    setEggs_production(data)
                } else {
                    setError(data.message || "Failed to load eggs collection data!")
                }
            } catch (err) {
                setError("Server: " + error.message)
            }
        }
        fetchcollection()
    }, [])
}