import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function VaccinationAlert() {
    const [vaccinations, setVaccinations] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetch("http://127.0.0.1:5000/vaccination/upcoming")
            .then(res => res.json())
            .then(data => setVaccinations(data))
            .catch(err => console.log(err));
    }, []);

    const daysLeft = (date) => {
        const now = new Date();
        const target = new Date(date);
        return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="dashboard-vaccination-alert">
            <h3>Upcoming Vaccinations</h3>
            {vaccinations.map((v) => {
                const left = daysLeft(v.vaccination_date);
                let color = "yellow";
                if (left <= 1) color = "red"
                return (
                    <div key={v.id} className="vaccination-alert-card" style={{ background: color }} onClick={() => navigate(`/vaccinations/${v.batch_id}`)}>
                        <strong>{v.batch_name}</strong>
                        <p>{v.vaccination_name}</p>
                        <p>{left} days left</p>
                    </div>
                )
            })}
        </div>
    )
}

export default VaccinationAlert;