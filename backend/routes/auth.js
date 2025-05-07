const express = require('express');
const router = express.Router();
const { verifyCredentials } = require('../models/admin');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  console.log("Login Endpoint Hit");
  console.log("Received Data:", { email, password, role });

  try {
    if (!email || !password || !role) {
      console.error("Missing Fields");
      return res.status(400).json({ error: 'Missing email, password, or role' });
    }

    const user = await verifyCredentials(email, password, role);
    console.log("User Found:", user);

    if (user) {
      const redirect = role === 'CRC' ? '/home/crc' : '/home/pi';
      return res.status(200).json({ message: 'Login successful', redirect });
    } else {
      console.error("Invalid Credentials");
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error("Error During Login:", err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;