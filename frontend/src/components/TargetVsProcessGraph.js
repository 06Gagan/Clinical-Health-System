import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { apiCall } from '../config/api';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TargetVsProcessGraph = () => {
  const [trialName, setTrialName] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGraphData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiCall(`/pi/trials/${trialName}`);
      setGraphData(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch trial data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trialName) {
      setError("Trial Name is required");
      return;
    }
    fetchGraphData();
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3">Target vs Progress Bar Graph</h3>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <label htmlFor="trialName" className="form-label">Trial Name:</label>
          <input
            type="text"
            id="trialName"
            value={trialName}
            onChange={(e) => setTrialName(e.target.value)}
            className="form-control"
            placeholder="Enter Trial Name"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Fetch Graph"}
        </button>
      </form>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {graphData && (
        <div className="mt-4">
          <Bar
            data={{
              labels: ["Target", "Progress"],
              datasets: [
                {
                  label: "Participants",
                  data: [graphData.target, graphData.progress],
                  backgroundColor: ["#007BFF", "#28A745"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                title: {
                  display: true,
                  text: `Trial: ${trialName}`,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Participants'
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TargetVsProcessGraph;