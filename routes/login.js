import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt'; // Import bcrypt
import pool from '../config/db.js';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {

    // Check Username/Password are present or not 
    if(username===undefined || username==="" || password===undefined || password===""){
        return res.status(400).json({ message: 'Missing Credentials' });
    }

    // Retrieve the user based on the username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
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

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
