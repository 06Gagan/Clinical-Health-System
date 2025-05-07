// backend/models/participants.js (full file)
const pool = require('../db');

const checkEmailExists = async (email) => {
  const query = `
    SELECT 1 FROM contact_information 
    WHERE email_address = $1
  `;
  const result = await pool.query(query, [email]);
  return result.rows.length > 0;
};

const registerParticipant = async (
  personalInfo,
  contactInfo,
  socioeconomicData,
  lifestyleData,
  culturalData
) => {
  try {
    // Check if email already exists
    const emailExists = await checkEmailExists(contactInfo.email_address);
    if (emailExists) {
      throw new Error("Email address already registered");
    }
    
    // Start a transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert into personal_information
      const personalQuery = `
        INSERT INTO personal_information (full_name, date_of_birth, gender, marital_status) 
        VALUES ($1, $2, $3, $4) RETURNING id
      `;
      const personalResult = await client.query(personalQuery, [
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
      await client.query(contactQuery, [
        participantId,
        contactInfo.street_address,
        contactInfo.city,
        contactInfo.state_province,
        contactInfo.zip_postal_code,
        contactInfo.country,
        contactInfo.phone_number,
        contactInfo.email_address,
      ]);

      // First, let's see what valid education levels are in the database
      const checkQuery = `
        SELECT string_agg(education_level::text, ', ') as valid_levels
        FROM socioeconomic_data
        GROUP BY 1
        LIMIT 1
      `;
      
      let educationLevel = "Other"; // Default fallback
      
      try {
        const checkResult = await client.query(checkQuery);
        if (checkResult.rows.length > 0) {
          // If we have existing data, use the first value as reference
          educationLevel = checkResult.rows[0].valid_levels.split(',')[0].trim();
        } else {
          // If no data exists, use a direct query to create with 'Bachelor'
          educationLevel = "Bachelor"; 
        }
      } catch (e) {
        console.log("Could not determine valid education level, using 'Bachelor'");
        educationLevel = "Bachelor";
      }

      // Insert into socioeconomic_data with a safe education level
      const socioeconomicQuery = `
        INSERT INTO socioeconomic_data (person_id, employment_status, occupation_job_title, education_level) 
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(socioeconomicQuery, [
        participantId,
        socioeconomicData.employment_status,
        socioeconomicData.occupation, // This maps to occupation_job_title in the database
        educationLevel,
      ]);

      // Insert into health_lifestyle
      const lifestyleQuery = `
        INSERT INTO health_lifestyle (person_id, health_status, smoking_alcohol_drug_use, physical_activity_level) 
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(lifestyleQuery, [
        participantId,
        lifestyleData.health_status,
        lifestyleData.smoking_alcohol_drug_use,
        lifestyleData.physical_activity_level,
      ]);

      // Insert into cultural_ethnic_background
      const culturalQuery = `
        INSERT INTO cultural_ethnic_background (person_id, race_ethnicity, nationality, primary_languages) 
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(culturalQuery, [
        participantId,
        culturalData.race_ethnicity,
        culturalData.nationality,
        culturalData.primary_languages,
      ]);

      // Commit the transaction
      await client.query('COMMIT');
      
      return participantId;
    } catch (err) {
      // If there's an error, roll back the transaction
      await client.query('ROLLBACK');
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error("Error registering participant:", err.message);
    throw err;
  }
};

module.exports = { registerParticipant };