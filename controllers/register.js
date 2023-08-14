const bcrypt = require('bcrypt'); // Import bcrypt
const db = require('../config/db.js');

/** POST: http://localhost:3000/api/register 
 * @param: {
 *   "username" : "example123",
 *   "password" : "Admin123"
 * }
 */
async function register(req, res) {
  try {
    const { username, password } = req.body;

    // Check if any input is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing Credentials' });
    }

    // Check if username is already registered
    const userCheckResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheckResult.rows.length > 0) {
      return res.status(400).json({ message: 'Username already registered' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register }; 
