import React, { useState } from "react";

const HealthData = () => {
  const [participantId, setParticipantId] = useState("");
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState("");

  const fetchHealthData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/participant/${participantId}`); // Adjusted endpoint
      const data = await response.json();
      if (response.ok) {
        setHealthData(data.health_data);
        setError("");
      } else {
        setError(data.message || "Failed to fetch health data");
      }
    } catch (err) {
      console.error("Error fetching health data:", err);
      setError("Something went wrong. Please try again.");
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!participantId) {
      setError("Participant ID is required");
      return;
    }
    fetchHealthData();
  };

  return (
    <div>
      <h3>Health Data of Participants</h3>
      <form onSubmit={handleSubmit} className="mb-3">
        <label htmlFor="participantId" className="form-label">Participant ID:</label>
        <input
          type="text"
          id="participantId"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
          className="form-control"
          placeholder="Enter Participant ID"
        />
        <button type="submit" className="btn btn-primary mt-2">Fetch Data</button>
      </form>
      {error && <p className="text-danger">{error}</p>}
      {healthData && (
        <div className="card p-3">
          <h5>Health Data:</h5>
          <ul>
            <li>Heart Rate: {healthData.heartRate}</li>
            <li>Blood Pressure: {healthData.bloodPressure}</li>
            <li>Respiratory Rate: {healthData.respiratoryRate}</li>
            <li>Body Temperature: {healthData.bodyTemperature}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HealthData;
