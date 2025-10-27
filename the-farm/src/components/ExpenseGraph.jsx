import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function ExpenseGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/expenses/graph")
      .then((res) => res.json())
      .then((records) => {
        const grouped = {};

        records.forEach((r) => {
          if (!grouped[r.date]) grouped[r.date] = { date: r.date };
          grouped[r.date][r.category] = r.amount_spent;
        });

        setData(Object.values(grouped));
      });
  }, []);

  const colors = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F", "#d00000"];

  const categories = [...new Set(data.flatMap(Object.keys))].filter(
    (key) => key !== "date"
  );

  const wrapperStyle = {
    width: "100%",
    height: "350px",
    minWidth: 0,
    minHeight: 0,
    overflow: "visible",
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold"
  };

  return (
    <div style={wrapperStyle}>
      <h3 style={titleStyle}>Last 8 Expenses</h3>

      {/* ✅ Guaranteed non-negative dimensions */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              stackId={false}
              fill={colors[index % colors.length]}
              radius={[6, 6, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseGraph;
