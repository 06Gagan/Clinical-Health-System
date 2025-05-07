const { Pool } = require('pg');
const logger = require('./utils/logger');
require('dotenv').config();

// Default database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'clinical_trial_db',
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432
};

// Log current database configuration (without sensitive data)
console.log('Current Database Configuration:', {
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  port: dbConfig.port
});

const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', {
    error: err.message,
    stack: err.stack,
    code: err.code
  });
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('Database query successful:', result.rows[0]);
    
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    
    if (err.code === '3D000') {
      console.error('Database "clinical_trial_db" does not exist. Please create it first.');
      console.error('To create the database, run:');
      console.error('psql -U postgres -c "CREATE DATABASE clinical_trial_db;"');
    } else if (err.code === '28P01') {
      console.error(`Invalid password for user "${dbConfig.user}"`);
      console.error('Please check your database password');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Could not connect to PostgreSQL. Is it running?');
      console.error('Please check if PostgreSQL service is running on your system');
    }
    
    return false;
  }
};

// Initialize database connection
console.log('Starting database connection test...');
testConnection().then(success => {
  if (!success) {
    console.error('Database connection failed. Please check the error messages above.');
    process.exit(1);
  }
});

module.exports = pool;
