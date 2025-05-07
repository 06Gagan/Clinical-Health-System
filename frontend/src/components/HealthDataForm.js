import React, { useState } from "react";
import { apiCall } from '../config/api';

function HealthDataForm() {
  const [formData, setFormData] = useState({
    person_id: "",
    heart_rate: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    respiratory_rate: "",
    body_temperature: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await apiCall('/crc/health', 'POST', formData);
      setMessage("Health data submitted successfully!");
      setFormData({
        person_id: "",
        heart_rate: "",
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        respiratory_rate: "",
        body_temperature: "",
      });
    } catch (error) {
      setMessage("Failed to submit health data: " + (error?.response?.data?.error || error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Enter Health Data</h2>
      {message && <div className={message.includes("successfully") ? "alert alert-success" : "alert alert-danger"}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Person ID</label>
          <input
            type="text"
            name="person_id"
            value={formData.person_id}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group mb-3">
          <label>Heart Rate (bpm)</label>
          <input
            type="number"
            name="heart_rate"
            value={formData.heart_rate}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group mb-3">
          <label>Systolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="blood_pressure_systolic"
            value={formData.blood_pressure_systolic}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group mb-3">
          <label>Diastolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="blood_pressure_diastolic"
            value={formData.blood_pressure_diastolic}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group mb-3">
          <label>Respiratory Rate (breaths/min)</label>
          <input
            type="number"
            name="respiratory_rate"
            value={formData.respiratory_rate}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group mb-3">
          <label>Body Temperature (°C)</label>
          <input
            type="number"
            name="body_temperature"
            value={formData.body_temperature}
            onChange={handleChange}
            className="form-control"
            required
            step="0.1"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default HealthDataForm;