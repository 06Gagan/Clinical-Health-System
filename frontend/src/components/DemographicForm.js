import React, { useState } from "react";

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

    try {
      const response = await fetch("http://localhost:8080/crc/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        setMessage(data.error || "Failed to register participant.");
      }
    } catch (error) {
      console.error("Error registering participant:", error);
      setMessage("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Demographic Data of Participants</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <h3>1. Personal Information</h3>
        <div className="mb-3">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="full_name"
            name="full_name"
            value={formData.personalInfo.full_name}
            onChange={(e) => handleChange(e, "personalInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.personalInfo.date_of_birth}
            onChange={(e) => handleChange(e, "personalInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="gender">Gender</label>
          <select
            className="form-select"
            id="gender"
            name="gender"
            value={formData.personalInfo.gender}
            onChange={(e) => handleChange(e, "personalInfo")}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="marital_status">Marital Status</label>
          <select
            className="form-select"
            id="marital_status"
            name="marital_status"
            value={formData.personalInfo.marital_status}
            onChange={(e) => handleChange(e, "personalInfo")}
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Contact Information */}
        <h3>2. Contact Information</h3>
        <div className="mb-3">
          <label htmlFor="street_address">Street Address</label>
          <input
            type="text"
            className="form-control"
            id="street_address"
            name="street_address"
            value={formData.contactInfo.street_address}
            onChange={(e) => handleChange(e, "contactInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="city">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={formData.contactInfo.city}
            onChange={(e) => handleChange(e, "contactInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="state_province">State/Province</label>
          <input
            type="text"
            className="form-control"
            id="state_province"
            name="state_province"
            value={formData.contactInfo.state_province}
            onChange={(e) => handleChange(e, "contactInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="zip_postal_code">ZIP/Postal Code</label>
          <input
            type="text"
            className="form-control"
            id="zip_postal_code"
            name="zip_postal_code"
            value={formData.contactInfo.zip_postal_code}
            onChange={(e) => handleChange(e, "contactInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            className="form-control"
            id="country"
            name="country"
            value={formData.contactInfo.country}
            onChange={(e) => handleChange(e, "contactInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="phone_number"
            name="phone_number"
            value={formData.contactInfo.phone_number}
            onChange={(e) => handleChange(e, "contactInfo")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email_address">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="email_address"
            name="email_address"
            value={formData.contactInfo.email_address}
            onChange={(e) => handleChange(e, "contactInfo")}
          />
        </div>

        {/* Repeat this pattern for other sections: Socioeconomic, Lifestyle, and Cultural */}
        
        <button type="submit" className="btn btn-primary mt-4">
          Submit
        </button>
        {message && <p className="mt-3">{message}</p>}
      </form>
    </div>
  );
};

export default DemographicForm;
