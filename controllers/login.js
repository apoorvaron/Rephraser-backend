const bcrypt = require('bcryptjs'); // Import bcrypt
const env = require("dotenv");
env.config();
const { generateToken } = require('../utils/jwtUtils');
const DBUtils = require('../utils/dbUtils.js');


/** POST: http://localhost:3000/api/login 
 * @param: {
  "email" : "example@gmail.com",
  "password" : "admin123"
}
*/
async function login(req, res) {
  const { email, password } = req.body;

  // Check email/Password are present or not
  if (email === undefined || email === "" || password === undefined || password === "") {
    return res.status(400).json({ message: 'Missing Credentials' });
  }

  const dbUtils = new DBUtils();
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];


  // Retrieve the user based on the email
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
  
  // Trim the username from the email address
  const username = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

  // Create a JWT token
  const token = generateToken(user.id, email);
  return res.status(200).json({ message: 'Login successful', username: username, token: token });
}

module.exports = { login };
