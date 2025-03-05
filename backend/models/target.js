const pool = require('../db');

const createTrial = async (trial_name) => {
  const query = `
    INSERT INTO trials (trial_name) 
    VALUES ($1) RETURNING id
  `;
  const result = await pool.query(query, [trial_name]);
  return result.rows[0].id;
};

const addTargetParticipants  = async (trialId, participantIds) => {
  const query = `
    INSERT INTO target_participate (trial_id, person_id) 
    VALUES ($1, $2)
  `;
  for (const participantId of participantIds) {
    await pool.query(query, [trialId, participantId]);
  }
};

module.exports = { createTrial, addTargetParticipants  };
