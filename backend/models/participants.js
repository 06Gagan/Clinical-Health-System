const pool = require('../db');

const registerParticipant = async (
  personalInfo,
  contactInfo,
  socioeconomicData,
  lifestyleData,
  culturalData
) => {
  try {
    // Insert into personal_information
    const personalQuery = `
      INSERT INTO personal_information (full_name, date_of_birth, gender, marital_status) 
      VALUES ($1, $2, $3, $4) RETURNING id
    `;
    const personalResult = await pool.query(personalQuery, [
      personalInfo.full_name,
      personalInfo.date_of_birth,
      personalInfo.gender,
      personalInfo.marital_status,
    ]);
    const participantId = personalResult.rows[0].id;

    // Insert into contact_information
    const contactQuery = `
      INSERT INTO contact_information (person_id, street_address, city, state_province, zip_postal_code, country, phone_number, email_address) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await pool.query(contactQuery, [
      participantId,
      contactInfo.street_address,
      contactInfo.city,
      contactInfo.state_province,
      contactInfo.zip_postal_code,
      contactInfo.country,
      contactInfo.phone_number,
      contactInfo.email_address,
    ]);

    // Insert into socioeconomic_data
    const socioeconomicQuery = `
      INSERT INTO socioeconomic_data (person_id, employment_status, occupation, education_level) 
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(socioeconomicQuery, [
      participantId,
      socioeconomicData.employment_status,
      socioeconomicData.occupation,
      socioeconomicData.education_level,
    ]);

    // Insert into lifestyle_data
    const lifestyleQuery = `
      INSERT INTO lifestyle_data (person_id, health_status, smoking_alcohol_drug_use, physical_activity_level) 
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(lifestyleQuery, [
      participantId,
      lifestyleData.health_status,
      lifestyleData.smoking_alcohol_drug_use,
      lifestyleData.physical_activity_level,
    ]);

    // Insert into cultural_data
    const culturalQuery = `
      INSERT INTO cultural_data (person_id, race_ethnicity, nationality, primary_languages) 
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(culturalQuery, [
      participantId,
      culturalData.race_ethnicity,
      culturalData.nationality,
      culturalData.primary_languages,
    ]);

    return participantId;
  } catch (err) {
    console.error("Error registering participant:", err.message);
    throw err;
  }
};

module.exports = { registerParticipant };
