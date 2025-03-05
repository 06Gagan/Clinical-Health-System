const pool = require('../db');

const addHealthData = async (data) => {
  const {
    person_id,
    heart_rate,
    blood_pressure_systolic,
    blood_pressure_diastolic,
    respiratory_rate,
    body_temperature,
  } = data;

  const query = `
    INSERT INTO health_data 
    (person_id, heart_rate, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, body_temperature, record_date)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
  `;
  return await pool.query(query, [
    person_id,
    heart_rate,
    blood_pressure_systolic,
    blood_pressure_diastolic,
    respiratory_rate,
    body_temperature,
  ]);
};

module.exports = { addHealthData };
