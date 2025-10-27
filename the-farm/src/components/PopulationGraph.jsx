import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import toast from "react-hot-toast";

function PopulationGraph() {
  const [batchList, setBatchList] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/batches")
      .then(res => res.json())
      .then(data => {
        setBatchList(data);
      });
  }, []);

  useEffect(() => {
    if (batchList.length > 0) {
      const batchId = batchList[currentBatchIndex].id;
      fetch(`http://127.0.0.1:5000/batch/${batchId}/population_graph`)
        .then(res => res.json())
        .then(data => setGraphData(data));
    }
  }, [batchList, currentBatchIndex]);

  const nextBatch = () => {
    if (currentBatchIndex < batchList.length - 1) {
      setCurrentBatchIndex(prev => prev + 1);
    } else {
      toast("You are on the last batch");
    }
  };

  const previousBatch = () => {
    if (currentBatchIndex > 0) {
      setCurrentBatchIndex(prev => prev - 1);
    } else {
      toast("Already on the first batch");
    }
  };

  return (
    <div>
      {batchList.length > 0 && (
        <h2>
          Viewing: {batchList[currentBatchIndex].name}
        </h2>
      )}

      <div>
        <button onClick={previousBatch}>Previous Batch</button>
        <button onClick={nextBatch}>Next Batch</button>
      </div>

      <LineChart width={600} height={300} data={graphData}>
        <CartesianGrid />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="birds" stroke="blue" strokeWidth={2} />
      </LineChart>
    </div>
  );
}

export default PopulationGraph;
