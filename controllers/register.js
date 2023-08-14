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

    // Password validation (min 8 characters, 1 small, 1 capital, and 1 number)
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordPattern.test(password)) {
        return res.status(400).json({ message: 'Password is not strong enough' });
    }

    // Password is Strong 
    res.send(200);

    // If password is strong 
    // Save user details in DB


  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register }; 
