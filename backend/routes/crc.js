const express = require('express');
const router = express.Router();
const { registerParticipant } = require('../models/participants');
const { addHealthData } = require('../models/health');
const { createTrial, addParticipantsToTrial } = require('../models/target');

// Register Participant
router.post('/participants', async (req, res) => {
  try {
    const participantId = await registerParticipant(req.body.personalInfo, req.body.contactInfo);
    res.status(201).json({ message: 'Participant registered', participantId });
  } catch (err) {
    console.error('Error registering participant:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Health Data
router.post('/health', async (req, res) => {
  try {
    await addHealthData(req.body);
    res.status(201).json({ message: 'Health data recorded successfully' });
  } catch (err) {
    console.error('Error adding health data:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Schedule Trial
router.post('/schedule', async (req, res) => {
  try {
    const { trial_name, participantIds } = req.body;
    const trialId = await createTrial(trial_name);
    await addParticipantsToTrial(trialId, participantIds);

    res.status(201).json({ message: 'Trial scheduled successfully', trialId });
  } catch (err) {
    console.error('Error scheduling trial:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
