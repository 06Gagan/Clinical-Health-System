import React, { useState } from "react";
import { apiCall } from '../config/api';

const HealthData = () => {
  const [participantId, setParticipantId] = useState("");
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHealthData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiCall(`/admin/participant/${participantId}`);
      if (data.health_data && data.health_data.length > 0) {
        const latestRecord = data.health_data[0];
        setHealthData({
          heartRate: latestRecord.heart_rate,
          bloodPressure: `${latestRecord.blood_pressure_systolic}/${latestRecord.blood_pressure_diastolic}`,
          respiratoryRate: latestRecord.respiratory_rate,
          bodyTemperature: latestRecord.body_temperature,
          recordDate: new Date(latestRecord.record_date).toLocaleString()
        });
      } else {
        setError("No health data found for this participant");
        setHealthData(null);
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to fetch health data");
      setHealthData(null);
    } finally {
      setLoading(false);
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
    <div className="card p-4">
      <h3 className="mb-3">Health Data of Participants</h3>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <label htmlFor="participantId" className="form-label">Participant ID:</label>
          <input
            type="text"
            id="participantId"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            className="form-control"
            placeholder="Enter Participant ID"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Fetch Data"}
        </button>
      </form>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {healthData && (
        <div className="card p-3 bg-light">
          <h5 className="card-title">Health Data:</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Heart Rate: {healthData.heartRate} bpm</li>
            <li className="list-group-item">Blood Pressure: {healthData.bloodPressure} mmHg</li>
            <li className="list-group-item">Respiratory Rate: {healthData.respiratoryRate} breaths/min</li>
            <li className="list-group-item">Body Temperature: {healthData.bodyTemperature} °C</li>
            <li className="list-group-item">Record Date: {healthData.recordDate}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HealthData;