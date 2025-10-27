import { useEffect, useState } from "react";
import "./componentstyles/feed.css";

function FeedRecords() {
  const [feeds, setFeeds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState("");
  const [activeId, setActiveId] = useState(null);

  const [formData, setFormData] = useState({
    feed_name: "",
    sacks_in_storage: "",
  });

  const loadFeeds = () => {
    fetch("http://127.0.0.1:5000/feeds")
      .then((res) => res.json())
      .then((data) => setFeeds(data));
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const notify = (msg) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast("");
    }, 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        notify("Feed added successfully");
        loadFeeds();
        setShowForm(false);
      });
  };

  const handleUseSack = (id) => {
    fetch(`http://127.0.0.1:5000/feeds/use/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) notify(data.error);
        else notify("Sack used successfully");
        loadFeeds();
      });
  };

  const handlePatch = (id, current) => {
    const updated = prompt("Enter new sacks in storage:", current);
    if (updated === null) return;

    fetch(`http://127.0.0.1:5000/feeds/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sacks_in_storage: updated }),
    })
      .then((res) => res.json())
      .then(() => {
        notify("Feed updated successfully");
        loadFeeds();
      });
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/feeds/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        notify("Feed deleted successfully");
        loadFeeds();
      });
  };

  return (
    <div className="feed-records">
      {showToast && <div className="floating-toast">{showToast}</div>}

      <h2>Feed Records</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add New Feed"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="feed-form">
          <input
            type="text"
            name="feed_name"
            placeholder="Feed Name"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="sacks_in_storage"
            placeholder="Sacks in Storage"
            min="0"
            onChange={handleChange}
            required
          />

          <button type="submit">Save</button>
        </form>
      )}

      <table className="feed-table">
        <thead>
          <tr>
            <th>Feed Name</th>
            <th>Sacks in Storage</th>
            <th>Sacks Used</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {feeds.map((f) => (
            <tr key={f.id}>
              <td>{f.feed_name}</td>
              <td>{f.sacks_in_storage}</td>
              <td>{f.sacks_used}</td>
              <td style={{ position: "relative" }}>
                <button
                  disabled={f.sacks_in_storage <= 0}
                  onClick={() => handleUseSack(f.id)}
                >
                  Use Sack
                </button>

                <button
                  onClick={() => setActiveId(activeId === f.id ? null : f.id)}
                  className="dots-menu"
                >
                  ⋮
                </button>

                {activeId === f.id && (
                  <div className="dropdown">
                    <p onClick={() => handlePatch(f.id, f.sacks_in_storage)}>
                      Update
                    </p>
                    <p onClick={() => handleDelete(f.id)}>Delete</p>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedRecords;
