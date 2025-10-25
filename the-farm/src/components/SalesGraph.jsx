import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./componentstyles/graph.css";

function SalesGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/sales/graph")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="graph-wrapper">
      <h3 className="graph-title">Daily Sales in Crates</h3>

      <div className="graph-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="date" stroke="#444" />
            <YAxis stroke="#444" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="quantity in crates" stroke="#5f8a3a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesGraph;
