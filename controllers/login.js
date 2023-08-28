const bcrypt = require('bcrypt'); // Import bcrypt
const env = require("dotenv");
env.config();
const { generateToken } = require('../utils/jwtUtils');
const DBUtils = require('../utils/dbUtils.js');


/** POST: http://localhost:3000/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Check Username/Password are present or not
    if (username === undefined || username === "" || password === undefined || password === "") {
      return res.status(400).json({ message: 'Missing Credentials' });
    }

    const dbUtils = new DBUtils();
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];


    // Retrieve the user based on the username
    const result = await dbUtils.run(query, values);
    const user = result.rows[0];

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Wrong Password' });
    }

    // Create a JWT token
    const token = generateToken(user.id);
    return res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    throw(error);
  }
}

module.exports = { login };
