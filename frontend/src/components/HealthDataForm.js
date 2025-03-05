import React, { useState } from "react";

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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Health data submitted successfully!");
        setFormData({
          person_id: "",
          heart_rate: "",
          blood_pressure_systolic: "",
          blood_pressure_diastolic: "",
          respiratory_rate: "",
          body_temperature: "",
        });
      } else {
        setMessage("Failed to submit health data.");
      }
    } catch (error) {
      console.error("Error submitting health data:", error);
      setMessage("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="container">
      <h2>Enter Health Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Person ID</label>
          <input
            type="text"
            name="person_id"
            value={formData.person_id}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Heart Rate (bpm)</label>
          <input
            type="number"
            name="heart_rate"
            value={formData.heart_rate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Systolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="blood_pressure_systolic"
            value={formData.blood_pressure_systolic}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Diastolic Blood Pressure (mmHg)</label>
          <input
            type="number"
            name="blood_pressure_diastolic"
            value={formData.blood_pressure_diastolic}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Respiratory Rate (breaths/min)</label>
          <input
            type="number"
            name="respiratory_rate"
            value={formData.respiratory_rate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Body Temperature (°C)</label>
          <input
            type="number"
            name="body_temperature"
            value={formData.body_temperature}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default HealthDataForm;
