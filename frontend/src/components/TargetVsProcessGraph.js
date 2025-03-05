import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
// Remove or ignore this import if not used directly
// import Chart from "chart.js/auto";

const TargetVsProcessGraph = () => {
  const [trialName, setTrialName] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState("");

  const fetchGraphData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/pi/trials/${trialName}`);
      const data = await response.json();

      if (response.ok) {
        setGraphData(data);
        setError("");
      } else {
        setError(data.message || "Failed to fetch trial data");
      }
    } catch (err) {
      console.error("Error fetching trial data:", err);
      setError("Something went wrong. Please try again.");
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
    <div>
      <h3>Target vs Progress Bar Graph</h3>
      <form onSubmit={handleSubmit} className="mb-3">
        <label htmlFor="trialName" className="form-label">Trial Name:</label>
        <input
          type="text"
          id="trialName"
          value={trialName}
          onChange={(e) => setTrialName(e.target.value)}
          className="form-control"
          placeholder="Enter Trial Name"
        />
        <button type="submit" className="btn btn-primary mt-2">Fetch Graph</button>
      </form>
      {error && <p className="text-danger">{error}</p>}
      {graphData && (
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
            },
          }}
        />
      )}
    </div>
  );
};

export default TargetVsProcessGraph;
