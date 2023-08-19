const bcrypt = require('bcrypt');
const env = require("dotenv");
env.config();
const { generateToken } = require('../utils/jwtUtils');
const DBUtils = require('../utils/dbUtils.js');

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (username === undefined || username === "" || password === undefined || password === "") {
      return res.status(400).json({ message: 'Missing Credentials' });
    }

    const dbUtils = new DBUtils();
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    try {
      const result = await dbUtils.run(query, values);
      const user = result.rows[0];

      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: 'Wrong Password' });
      }

      const token = generateToken(user.id);
      return res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await dbUtils.disconnect();
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { login };
