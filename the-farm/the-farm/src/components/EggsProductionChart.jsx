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

function EggProductionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/eggproduction/chartdata")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="graph-wrapper">
      <h3 className="graph-title">Daily Egg Production</h3>

      <div className="graph-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="date" stroke="#444" />
            <YAxis stroke="#444" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="eggs" stroke="#5f8a3a" strokeWidth={3} />
            <Line type="monotone" dataKey="broken" stroke="#d32f2f" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EggProductionChart;
