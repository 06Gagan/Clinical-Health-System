import React, { useState } from "react";
import { apiCall } from '../config/api';

const DemographicForm = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      full_name: "",
      date_of_birth: "",
      gender: "",
      marital_status: "",
    },
    contactInfo: {
      street_address: "",
      city: "",
      state_province: "",
      zip_postal_code: "",
      country: "",
      phone_number: "",
      email_address: "",
    },
    socioeconomicData: {
      employment_status: "",
      occupation: "",
      education_level: "",
    },
    lifestyleData: {
      health_status: "",
      smoking_alcohol_drug_use: "",
      physical_activity_level: "",
    },
    culturalData: {
      race_ethnicity: "",
      nationality: "",
      primary_languages: "",
    },
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await apiCall('/crc/participants', 'POST', formData);
      setMessage(`Participant registered successfully! ID: ${data.participantId}`);
      setFormData({
        personalInfo: {
          full_name: "",
          date_of_birth: "",
          gender: "",
          marital_status: "",
        },
        contactInfo: {
          street_address: "",
          city: "",
          state_province: "",
          zip_postal_code: "",
          country: "",
          phone_number: "",
          email_address: "",
        },
        socioeconomicData: {
          employment_status: "",
          occupation: "",
          education_level: "",
        },
        lifestyleData: {
          health_status: "",
          smoking_alcohol_drug_use: "",
          physical_activity_level: "",
        },
        culturalData: {
          race_ethnicity: "",
          nationality: "",
          primary_languages: "",
        },
      });
    } catch (error) {
      setMessage(error?.response?.data?.error || error.message || "Failed to register participant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Demographic Data of Participants</h1>
      
      {message && (
        <div className={message.includes("successfully") ? "alert alert-success" : "alert alert-danger"}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">1. Personal Information</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="full_name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="full_name"
                  name="full_name"
                  value={formData.personalInfo.full_name}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  required
                  disabled={loading}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.personalInfo.date_of_birth}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  className="form-select"
                  id="gender"
                  name="gender"
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  required
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="marital_status" className="form-label">Marital Status</label>
                <select
                  className="form-select"
                  id="marital_status"
                  name="marital_status"
                  value={formData.personalInfo.marital_status}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  required
                  disabled={loading}
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">2. Contact Information</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="street_address" className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                id="street_address"
                name="street_address"
                value={formData.contactInfo.street_address}
                onChange={(e) => handleChange(e, "contactInfo")}
                required
                disabled={loading}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.contactInfo.city}
                  onChange={(e) => handleChange(e, "contactInfo")}
                  required
                  disabled={loading}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="state_province" className="form-label">State/Province</label>
                <input
                  type="text"
                  className="form-control"
                  id="state_province"
                  name="state_province"
                  value={formData.contactInfo.state_province}
                  onChange={(e) => handleChange(e, "contactInfo")}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="zip_postal_code" className="form-label">ZIP/Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="zip_postal_code"
                  name="zip_postal_code"
                  value={formData.contactInfo.zip_postal_code}
                  onChange={(e) => handleChange(e, "contactInfo")}
                  required
                  disabled={loading}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={formData.contactInfo.country}
                  onChange={(e) => handleChange(e, "contactInfo")}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone_number"
                  name="phone_number"
                  value={formData.contactInfo.phone_number}
                  onChange={(e) => handleChange(e, "contactInfo")}
                  required
                  disabled={loading}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email_address" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email_address"
                  name="email_address"
                  value={formData.contactInfo.email_address}
                  onChange={(e) => handleChange(e, "contactInfo")}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Socioeconomic Data */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">3. Socioeconomic Data</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="employment_status" className="form-label">Employment Status</label>
                <select
                  className="form-select"
                  id="employment_status"
                  name="employment_status"
                  value={formData.socioeconomicData.employment_status}
                  onChange={(e) => handleChange(e, "socioeconomicData")}
                  required
                  disabled={loading}
                >
                  <option value="">Select Status</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="occupation" className="form-label">Occupation</label>
                <input
                  type="text"
                  className="form-control"
                  id="occupation"
                  name="occupation"
                  value={formData.socioeconomicData.occupation}
                  onChange={(e) => handleChange(e, "socioeconomicData")}
                  required
                  disabled={loading}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="education_level" className="form-label">Education Level</label>
                <select
                  className="form-select"
                  id="education_level"
                  name="education_level"
                  value={formData.socioeconomicData.education_level}
                  onChange={(e) => handleChange(e, "socioeconomicData")}
                  required
                  disabled={loading}
                >
                  <option value="">Select Level</option>
                  <option value="High School">High School</option>
                  <option value="Associate's Degree">Associate's Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lifestyle Data */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">4. Lifestyle Data</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="health_status" className="form-label">Health Status</label>
              <select
                className="form-select"
                id="health_status"
                name="health_status"
                value={formData.lifestyleData.health_status}
                onChange={(e) => handleChange(e, "lifestyleData")}
                required
                disabled={loading}
              >
                <option value="">Select Status</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="smoking_alcohol_drug_use" className="form-label">Smoking/Alcohol/Drug Use</label>
              <textarea
                className="form-control"
                id="smoking_alcohol_drug_use"
                name="smoking_alcohol_drug_use"
                value={formData.lifestyleData.smoking_alcohol_drug_use}
                onChange={(e) => handleChange(e, "lifestyleData")}
                rows="3"
                required
                disabled={loading}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="physical_activity_level" className="form-label">Physical Activity Level</label>
              <select
                className="form-select"
                id="physical_activity_level"
                name="physical_activity_level"
                value={formData.lifestyleData.physical_activity_level}
                onChange={(e) => handleChange(e, "lifestyleData")}
                required
                disabled={loading}
              >
                <option value="">Select Level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Vigorous">Vigorous</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Cultural Data */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">5. Cultural Data</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="race_ethnicity" className="form-label">Race/Ethnicity</label>
              <input
                type="text"
                className="form-control"
                id="race_ethnicity"
                name="race_ethnicity"
                value={formData.culturalData.race_ethnicity}
                onChange={(e) => handleChange(e, "culturalData")}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nationality" className="form-label">Nationality</label>
              <input
                type="text"
                className="form-control"
                id="nationality"
                name="nationality"
                value={formData.culturalData.nationality}
                onChange={(e) => handleChange(e, "culturalData")}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="primary_languages" className="form-label">Primary Languages</label>
              <input
                type="text"
                className="form-control"
                id="primary_languages"
                name="primary_languages"
                value={formData.culturalData.primary_languages}
                onChange={(e) => handleChange(e, "culturalData")}
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>
        
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemographicForm;