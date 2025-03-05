const express = require('express');
const router = express.Router();
const { getTrialProgress } = require('../models/admin');

// Get Trial Progress
router.get('/trialProgress/:trialName', async (req, res) => {
  const trialName = req.params.trialName;

  try {
    const query = `
      SELECT target, progress 
      FROM trials 
      WHERE trial_name = $1
    `;
    const result = await pool.query(query, [trialName]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Trial not found' });
    }
  } catch (err) {
    console.error('Error fetching trial progress:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
