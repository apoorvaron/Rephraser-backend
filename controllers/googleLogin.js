const { OAuth2Client } = require('google-auth-library');
const { generateToken } = require('../utils/jwtUtils');
const DBUtils = require('../utils/dbUtils.js');
const { generateUsername } = require('../utils/usernameUtils.js');
const { generateHashPassword } = require('../utils/hashPasswordUtils.js');
const env = require('dotenv');
env.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to generate a random 10-character string
function generateRandomString(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}

async function googleLogin(req, res) {
  const {id_token}  = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      requiredAudience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const dbUtils = new DBUtils();

    // Check if the user exists
    const userResult = await dbUtils.run('SELECT id FROM users WHERE email = $1', [email]);

    let userId;
    let hashedPassword

    if (userResult.rows.length === 0) {
      // User doesn't exist, create a new user
      const randomPassword = generateRandomString(10); 
      hashedPassword = await generateHashPassword(randomPassword);
      
      const insertResult = await dbUtils.run('INSERT INTO users (email, password, created_at, updated_at) VALUES ($1,$2, NOW(), NOW()) RETURNING id',[email, hashedPassword]);

      userId = insertResult.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    const token = generateToken(userId, email);

    // Trim the username from the email address
    const username = generateUsername(email);
    
    return res.status(200).json({ message: 'Login successful', username: username, token: token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ message: 'Login failed' });
  }
}
module.exports = { googleLogin };