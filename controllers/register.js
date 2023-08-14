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

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register }; 