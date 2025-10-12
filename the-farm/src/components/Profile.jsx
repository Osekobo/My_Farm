import { useState, useEffect } from "react";

function Profile() {
    const [user, setUser] = useState([])
    const [message, setMessage] = useState();
    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
    })
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/profits", {
                method: "POST",
                headers: { "Content-Type" : "application/json"},
                body: JSON.stringify(formData),
            })
            const data = await response.json();

            if (response.ok) {
                setMessage("Calculating...")
                setFormData({start_date: "", end_date: ""})
            } else {
                setError(data.message)
            }
        } catch(err) {
            console.error(err)
            setError("Something went terribly wrong!")
        }
    }
}