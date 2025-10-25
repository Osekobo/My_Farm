import { useEffect, useState } from "react";
import "./componentstyles/vaccination.css";

function VaccinationSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    batch_id: "",
    vaccination_name: "",
    vaccination_date: "",
  });

  // Fetch schedules
  useEffect(() => {
    fetch("http://127.0.0.1:5000/vaccination/upcoming")
      .then((res) => res.json())
      .then((data) => setSchedules(data));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit vaccination schedule
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/vaccination/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Vaccination Schedule Added!");

        // Refresh data
        fetch("http://127.0.0.1:5000/vaccination/upcoming")
          .then((res) => res.json())
          .then((data) => setSchedules(data));

        // Reset form
        setFormData({
          batch_id: "",
          vaccination_name: "",
          vaccination_date: "",
        });
        setShowForm(false);
      });
  };

  return (
    <div className="vaccination-wrapper">
      <h2>Vaccination Records</h2>

      {/* ADD BUTTON */}
      <button className="add-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close" : "Add Vaccination Schedule"}
      </button>

      {/* FORM */}
      {showForm && (
        <form className="vaccination-form" onSubmit={handleSubmit}>
          <label>Batch ID:</label>
          <input
            type="number"
            name="batch_id"
            value={formData.batch_id}
            onChange={handleChange}
            required
          />

          <label>Vaccination Name:</label>
          <input
            type="text"
            name="vaccination_name"
            value={formData.vaccination_name}
            onChange={handleChange}
            required
          />

          <label>Date:</label>
          <input
            type="date"
            name="vaccination_date"
            value={formData.vaccination_date}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      )}

      {/* TABLE */}
      <table className="vaccination-table">
        <thead>
          <tr>
            <th>Batch</th>
            <th>Vaccination</th>
            <th>Date</th>
            <th>Days Left</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => {
            const left = Math.ceil(
              (new Date(s.vaccination_date) - new Date()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <tr key={s.id} style={{ color: left <= 1 ? "red" : "black" }}>
                <td>{s.batch_name}</td>
                <td>{s.vaccination_name}</td>
                <td>{s.vaccination_date}</td>
                <td>{left} days</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VaccinationSchedule;
