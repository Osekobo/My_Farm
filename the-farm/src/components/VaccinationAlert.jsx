import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FeedAlert() {
    const [feeds, setFeeds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:5000/feeds")
            .then(res => res.json())
            .then(data => setFeeds(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="dashboard-feed-alert">
            <h3>Feed Storage Alerts</h3>
            {feeds.map((f) => {
                let color = "yellow";

                if (f.quantity <= 1) {
                    color = "red";
                } else if (f.quantity < 5) {
                    color = "orange";
                }

                return (
                    <div
                        key={f.id}
                        className="feed-alert-card"
                        style={{ background: color, padding: "8px", marginBottom: "6px", cursor: "pointer" }}
                        onClick={() => navigate("/feedrecords")}
                    >
                        <strong>{f.feed_name}</strong>
                        <p>{f.quantity} sacks remaining</p>
                    </div>
                );
            })}
        </div>
    );
}

export default FeedAlert;
