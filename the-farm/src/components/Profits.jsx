import { useState, useEffect } from "react";

function Profits() {
    const [profits, setProfits] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
    });

    useEffect(() => {
        const fetchprofits = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/profits");
                const data = await response.json();

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setProfits(data);
                    } else {
                        setProfits([]);
                        setError(data.message || "Data error!");
                    }
                } else {
                    setError(data.message || "Couldn't fetch data from the database!");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch profits data.");
            }
        };
        fetchprofits();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/profits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                setMessage("Calculating...");
                setFormData({ start_date: "", end_date: "" });
                setError("");
            } else {
                setError(data.message || "Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            setError("Something went terribly wrong!");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="date" name="start_date" placeholder="Starting date" value={formData.start_date} onChange={handleChange}/>
                <input type="date" name="end_date" placeholder="Ending date" value={formData.end_date} onChange={handleChange} />
                <button type="submit">Calculate</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <div>
                {profits.map((p) => (
                    <div key={p.id}>
                        <h4>Starting Date: {p.start_date}</h4>
                        <h4>Ending Date: {p.end_date}</h4>
                        <h4>Total from Sales: {p.total_sales}</h4>
                        <h4>Totals from Expenses and Transport: {p.total_expenses}</h4>
                        <h4>Total Salary Paid: {p.total_salaries}</h4>
                        <h4>
                            {p.profit > 0 ? (
                                <span style={{ color: "green" }}>
                                    Profit: KES {p.profit.toLocaleString()}
                                </span>
                            ) : p.profit < 0 ? (
                                <span style={{ color: "red" }}>
                                    Loss: KES {Math.abs(p.profit).toLocaleString()}
                                </span>
                            ) : (
                                <span style={{ color: "gray" }}>Break-even: KES 0</span>
                            )}
                        </h4>

                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profits;
