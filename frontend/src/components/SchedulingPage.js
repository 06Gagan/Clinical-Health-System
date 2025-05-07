import React, { useState } from "react";
import { apiCall } from '../config/api';

const SchedulingPage = () => {
  const [filters, setFilters] = useState({ ageMin: "", ageMax: "", gender: "" });
  const [trialName, setTrialName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingParticipants, setFetchingParticipants] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const fetchParticipants = async () => {
    setFetchingParticipants(true);
    setMessage("");
    try {
      const data = await apiCall(`/crc/participants?ageMin=${filters.ageMin}&ageMax=${filters.ageMax}&gender=${filters.gender}`);
      setParticipants(data.participants);
      if (data.participants.length === 0) {
        setMessage("No participants match the selected criteria.");
      }
    } catch (error) {
      setMessage("Failed to fetch participants: " + (error?.response?.data?.error || error.message || "Unknown error"));
    } finally {
      setFetchingParticipants(false);
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

  const scheduleTrial = async () => {
    if (!trialName) {
      setMessage("Please enter a trial name.");
      return;
    }
    
    if (selectedParticipants.length === 0) {
      setMessage("Please select at least one participant.");
      return;
    }
    
    setLoading(true);
    setMessage("");
    try {
      const data = await apiCall('/crc/schedule', 'POST', { trialName, participantIds: selectedParticipants });
      setMessage("Trial scheduled successfully!");
      setSelectedParticipants([]);
      setTrialName("");
    } catch (error) {
      setMessage("Failed to schedule trial: " + (error?.response?.data?.error || error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Schedule a Trial</h1>
      {message && <div className={message.includes("successfully") ? "alert alert-success" : "alert alert-info"}>{message}</div>}
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
              disabled={fetchingParticipants}
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
              disabled={fetchingParticipants}
            />
          </div>
          <div className="col-md-4">
            <label>Gender</label>
            <select
              className="form-select"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              disabled={fetchingParticipants}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
          </div>
        </div>
        <button 
          onClick={fetchParticipants} 
          className="btn btn-primary mt-3"
          disabled={fetchingParticipants}
        >
          {fetchingParticipants ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      <div className="mb-4">
        <h3>Participants</h3>
        {participants.length === 0 ? (
          <p>No participants found. Apply filters to search.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
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
                        className="form-check-input"
                        disabled={loading}
                      />
                    </td>
                    <td>{participant.name}</td>
                    <td>{participant.age}</td>
                    <td>{participant.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3>Schedule Trial</h3>
        <div className="mb-3">
          <label>Trial Name</label>
          <input
            type="text"
            className="form-control"
            value={trialName}
            onChange={handleTrialNameChange}
            placeholder="Enter trial name"
            disabled={loading}
          />
        </div>
        <button
          className="btn btn-success"
          onClick={scheduleTrial}
          disabled={selectedParticipants.length === 0 || !trialName || loading}
        >
          {loading ? "Scheduling..." : "Schedule Trial"}
        </button>
      </div>
    </div>
  );
};

export default SchedulingPage;