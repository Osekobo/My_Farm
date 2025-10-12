import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Batch() {
  const [batch, setBatch] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    batch_name: "",
    breed: "",
    acquisition_date: "",
    initial_number: "",
    current_number: "",
    status: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setShowForm(false);
        setFormData({ batch_name: "", breed: "", acquisition_date: "", initial_number: "", current_number: "", status: "" });
        setError("")
      } else {
        setError(data.message || "Something went wrong")
      }
    } catch (err) {
      console.error(error)
      setError("Error with the data!")
    };
  };

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/batch");
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setBatch(data);
          } else {
            setBatch([]);
            setError(data.message || "Data error!")
          }
        } else {
          setError(data.message || "Can't get data from batch!");
        }
      } catch (err) {
        setError("Error: " + err.message);
      }
    };
    fetchBatch();
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <button onClick={() => setShowForm(!showForm)}>{showForm? "Cancel" : "Add new Batch"}</button>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <input type="text" name="batch_name" placeholder="Batch name" value={formData.batch_name} onChange={handleChange}/>
            <input type="text" name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange}/>
            <input type="date" name="acquisition_date" placeholder="Acquisition Date" value={formData.acquisition_date} onChange={handleChange}/>
            <input type="text" name="initial_number" placeholder="Initial Number" value={formData.initial_number} onChange={handleChange}/>
            <input type="text" name="current_number" placeholder="Current Number" value={formData.current_number} onChange={handleChange}/>
            <input type="text" name="status" placeholder="Status" value={formData.status} onChange={handleChange}/>
            <button type="submit" className="btn btn-success mt-2">Save</button>
          </form>
        )}
      </div>

      <table className="container table table-secondary table-borderless table-hover mt-4">
        <thead className="table-dark">
          <tr className="fw-bold">
            <th>Batch Name</th>
            <th>Breed</th>
            <th>Acquisition Date</th>
            <th>Initial Number</th>
            <th>Current Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {batch.map((b) => (
            <tr key={b.id}>
              <td>{b.batch_name}</td>
              <td>{b.breed}</td>
              <td>{b.acquisition_date}</td>
              <td>{b.initial_number}</td>
              <td>{b.current_number}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Batch;
