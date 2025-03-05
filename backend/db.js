const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database successfully');
    client.release();
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
  }
})();

module.exports = pool;
