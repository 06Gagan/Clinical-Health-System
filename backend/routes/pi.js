const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getTrialProgress } = require('../models/admin');

// Get Trial Progress
router.get('/trialProgress/:trialName', async (req, res) => {
  const trialName = req.params.trialName;

  try {
    const progress = await getTrialProgress();
    const trial = progress.rows.find(t => t.trial_name === trialName);
    
    if (trial) {
      res.status(200).json({ 
        trial_name: trial.trial_name,
        participants_count: trial.participants_count 
      });
    } else {
      res.status(404).json({ message: 'Trial not found' });
    }
  } catch (err) {
    console.error('Error fetching trial progress:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this endpoint to support the TargetVsProgressGraph component
router.get('/trials/:trialName', async (req, res) => {
  const trialName = req.params.trialName;

  try {
    // Query to get the target count and progress for the trial
    const query = `
      SELECT 
        COUNT(DISTINCT tp.person_id) as progress,
        (SELECT COUNT(*) FROM personal_information) as target
      FROM 
        trials t
      LEFT JOIN
        target_participate tp ON t.id = tp.trial_id
      WHERE 
        t.trial_name = $1
    `;
    
    const result = await pool.query(query, [trialName]);
    
    if (result.rows.length > 0) {
      res.status(200).json({
        target: parseInt(result.rows[0].target) || 0,
        progress: parseInt(result.rows[0].progress) || 0
      });
    } else {
      res.status(404).json({ message: 'Trial not found' });
    }
  } catch (err) {
    console.error('Error fetching trial data:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all health records for a participant (for PI graph)
router.get('/health/:personId', async (req, res) => {
  const personId = req.params.personId;
  try {
    const query = `SELECT record_date, heart_rate, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, body_temperature FROM health_data WHERE person_id = $1 ORDER BY record_date`;
    const result = await pool.query(query, [personId]);
    res.status(200).json({ records: result.rows });
  } catch (err) {
    console.error('Error fetching health records:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;