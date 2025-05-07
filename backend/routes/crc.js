const express = require('express');
const router = express.Router();
const pool = require('../db');
const { registerParticipant } = require('../models/participants');
const { addHealthData } = require('../models/health');
const { createTrial, addTargetParticipants } = require('../models/target');
const nodemailer = require('nodemailer');

// Register Participant
router.post('/participants', async (req, res) => {
  try {
    const participantId = await registerParticipant(
      req.body.personalInfo,
      req.body.contactInfo,
      req.body.socioeconomicData,
      req.body.lifestyleData,
      req.body.culturalData
    );
    res.status(201).json({ message: 'Participant registered', participantId });
  } catch (err) {
    console.error('Error registering participant:', err.message);
    
    // Handle specific error cases
    if (err.message.includes("Email address already registered")) {
      return res.status(409).json({ error: 'Email address already registered. Please use a different email.' });
    } else if (err.message.includes("unique constraint")) {
      return res.status(409).json({ error: 'Duplicate information provided. Please check your data.' });
    }
    
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

// Helper to send invitation email
async function sendInvitation(email, trialName) {
  // Configure your transporter (use real credentials in production)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Invitation to participate in trial: ${trialName}`,
    text: `You have been invited to participate in the trial: ${trialName}.`,
  });
}

// Schedule Trial
router.post('/schedule', async (req, res) => {
  try {
    const { trialName, participantIds } = req.body;
    const trialId = await createTrial(trialName);
    await addTargetParticipants(trialId, participantIds);
    // Fetch emails for selected participants
    const emailQuery = `SELECT ci.email_address FROM contact_information ci WHERE ci.person_id = ANY($1)`;
    const emailResult = await pool.query(emailQuery, [participantIds]);
    for (const row of emailResult.rows) {
      await sendInvitation(row.email_address, trialName);
    }
    res.status(201).json({ message: 'Trial scheduled and invitations sent', trialId });
  } catch (err) {
    console.error('Error scheduling trial:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get filtered participants
router.get('/participants', async (req, res) => {
  try {
    const { ageMin, ageMax, gender, city, education } = req.query;
    let query = `
      SELECT 
        pi.id, 
        pi.full_name as name, 
        EXTRACT(YEAR FROM AGE(NOW(), pi.date_of_birth)) as age,
        pi.gender,
        ci.email_address as email,
        ci.city,
        sd.education_level
      FROM 
        personal_information pi
      JOIN 
        contact_information ci ON pi.id = ci.person_id
      LEFT JOIN 
        socioeconomic_data sd ON pi.id = sd.person_id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;
    if (ageMin && !isNaN(ageMin)) {
      query += ` AND EXTRACT(YEAR FROM AGE(NOW(), pi.date_of_birth)) >= $${paramIndex}`;
      queryParams.push(parseInt(ageMin));
      paramIndex++;
    }
    if (ageMax && !isNaN(ageMax)) {
      query += ` AND EXTRACT(YEAR FROM AGE(NOW(), pi.date_of_birth)) <= $${paramIndex}`;
      queryParams.push(parseInt(ageMax));
      paramIndex++;
    }
    if (gender) {
      query += ` AND pi.gender = $${paramIndex}`;
      queryParams.push(gender);
      paramIndex++;
    }
    if (city) {
      query += ` AND ci.city = $${paramIndex}`;
      queryParams.push(city);
      paramIndex++;
    }
    if (education) {
      query += ` AND sd.education_level = $${paramIndex}`;
      queryParams.push(education);
      paramIndex++;
    }
    query += ` ORDER BY pi.full_name`;
    const result = await pool.query(query, queryParams);
    res.status(200).json({ participants: result.rows });
  } catch (err) {
    console.error('Error fetching participants:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;