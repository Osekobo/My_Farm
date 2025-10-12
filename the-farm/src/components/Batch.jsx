import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Batch() {
  const [batch, setBatch] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/batch");
        const data = await response.json();

        if (response.ok) {
            if(Array.isArray(data)) {
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
      <table className="container table-borderless table-hover mt-4">
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
