import React, { useState } from "react";

const SchedulingPage = () => {
  const [filters, setFilters] = useState({ ageMin: "", ageMax: "", gender: "" });
  const [trialName, setTrialName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/crc/participants?ageMin=${filters.ageMin}&ageMax=${filters.ageMax}&gender=${filters.gender}`
      );
      const data = await response.json();
      if (response.ok) {
        setParticipants(data.participants);
      } else {
        alert("Failed to fetch participants");
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleParticipantSelection = (id) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter((pid) => pid !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const handleTrialNameChange = (e) => {
    setTrialName(e.target.value);
  };

  const sendEmails = async () => {
    if (!trialName) {
      alert("Please enter a trial name.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/crc/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trialName, participantIds: selectedParticipants }),
      });

      if (response.ok) {
        alert("Emails sent successfully!");
      } else {
        alert("Failed to send emails.");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Schedule a Trial</h1>
      <div className="mb-4">
        <h3>Filter Participants</h3>
        <div className="row">
          <div className="col-md-4">
            <label>Min Age</label>
            <input
              type="number"
              className="form-control"
              name="ageMin"
              value={filters.ageMin}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-4">
            <label>Max Age</label>
            <input
              type="number"
              className="form-control"
              name="ageMax"
              value={filters.ageMax}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-4">
            <label>Gender</label>
            <select
              className="form-select"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <button onClick={fetchParticipants} className="btn btn-primary mt-3">
          Apply Filters
        </button>
      </div>

      <div>
        <h3>Participants</h3>
        {participants.length === 0 ? (
          <p>No participants found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(participant.id)}
                      onChange={() => handleParticipantSelection(participant.id)}
                    />
                  </td>
                  <td>{participant.name}</td>
                  <td>{participant.age}</td>
                  <td>{participant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <label>Trial Name</label>
        <input
          type="text"
          className="form-control"
          value={trialName}
          onChange={handleTrialNameChange}
        />
        <button
          className="btn btn-success mt-3"
          onClick={sendEmails}
          disabled={selectedParticipants.length === 0}
        >
          Send Emails
        </button>
      </div>
    </div>
  );
};

export default SchedulingPage;
