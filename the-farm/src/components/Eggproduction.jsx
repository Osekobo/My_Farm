import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Eggproduction() {
  const [eggsproduction, setEggsproduction] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/eggsproduction")
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setEggsproduction(data)
          }
          else{
            setEggsproduction([])
            setError(data.message || "Data error")
          }
        } else {
          setError(data.message || "Failed to load eggs collection data!")
        }
      } catch (err) {
        setError("Server: " + err.message)
      }
    }
    fetchCollection()
  }, [])

  return (
    <div>
      <h3>Collection Data</h3>
      <div>
        {error && <p className="text-danger text-center">{error}</p>}
        <table className="container table table-secondary table-borderless table-hover mt-4">
          <thead className="table-dark">
            <tr className="fw-bold">
              <td>Batch ID</td>
              <td>Date</td>
              <td>Eggs Collected</td>
              <td>Broken Eggs</td>
              <td>Remaining Eggs</td>
              <td>Number of Crates</td>
              <td>Remarks</td>
              <td>Extra Eggs</td>
            </tr>
          </thead>
          <tbody>
            {eggsproduction.map((e) => (
              <tr key={e.id}>
                <td>{e.batch_id}</td>
                <td>{e.date}</td>
                <td>{e.eggs_collected}</td>
                <td>{e.broken_eggs}</td>
                <td>{e.remaining_eggs}</td>
                <td>{e.quantity_in_crates}</td>
                <td>{e.remarks}</td>
                <td>{e.extra_eggs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Eggproduction;