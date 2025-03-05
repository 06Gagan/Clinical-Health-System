const pool = require('../db');

// Verify login credentials
const verifyCredentials = async (email, password, role) => {
  console.log("Verifying Credentials:", { email, password, role });

  const query = `
    SELECT id, role FROM users 
    WHERE email = $1 AND password = $2 AND role = $3
  `;
  const result = await pool.query(query, [email, password, role]);
  console.log("Query Result:", result.rows);

  return result.rows[0];
};


// Fetch trial progress
const getTrialProgress = async () => {
  const query = `
    SELECT trial_name, COUNT(person_id) AS participants_count 
    FROM target_participate 
    GROUP BY trial_name
  `;
  return await pool.query(query);
};

// Fetch participant health data
const getParticipantHealthData = async (participantId) => {
  const query = `
    SELECT * FROM health_data 
    WHERE person_id = $1 
    ORDER BY record_date DESC
  `;
  return await pool.query(query, [participantId]);
};

module.exports = { verifyCredentials, getTrialProgress, getParticipantHealthData };
