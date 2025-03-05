const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const crcRoutes = require('./routes/crc');
const piRoutes = require('./routes/pi');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(express.json());

// Allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Register API routes
app.use('/auth', authRoutes);
app.use('/crc', crcRoutes);
app.use('/pi', piRoutes);
app.use('/admin', adminRoutes);

// Serve React frontend files from public/build
app.use(express.static(path.join(__dirname, 'public', 'build')));

// Catch-all route to serve React app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'build', 'index.html'));
});

// Handle undefined API routes
app.use((req, res) => {
  console.error(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
