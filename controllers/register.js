const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtUtils');
const DBUtils = require('../utils/dbUtils.js');
const env = require("dotenv");
env.config();

/** POST: http://localhost:3000/api/register 
 * @param: {
 *   "username" : "example123",
 *   "password" : "Admin123"
 }
 */
async function register(req, res) {
  const { username, password } = req.body;

  // Check if any input is missing
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing Credentials' });
  }

  const dbUtils = new DBUtils(); // Create a new instance of DBUtils for each request

  const queryCheckUser = 'SELECT * FROM users WHERE username = $1';
  const valuesCheckUser = [username];

  // Check if username is already registered
  const userCheckResult = await dbUtils.run(queryCheckUser, valuesCheckUser);
  if (userCheckResult.rows.length > 0) {
    return res.status(400).json({ message: 'Username already registered' });
  }

  // Password validation (min 8 characters, 1 small, 1 capital, and 1 number)
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!passwordPattern.test(password)) {
    return res.status(400).json({ message: 'Password is not strong enough' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database
  const insertionResult = await dbUtils.run(
    'INSERT INTO users (username, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
    [username, hashedPassword]
  );

  if (insertionResult.rows.length > 0) {
    // Generate token using the utility function
    const userId = insertionResult.rows[0].id;
    const token = generateToken(userId);

    return res.status(200).json({ message: 'Registration Successful', token: token });
  } else {
    return res.status(500).json({ message: 'Failed to register user' });
  }

}

module.exports = { register };
