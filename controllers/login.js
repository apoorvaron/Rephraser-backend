/**
 * Log in an existing user.
 *
 * This API endpoint allows users to log in by providing their username and password.
 * It verifies the provided credentials and returns a JWT token upon successful login.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} The HTTP response containing login status and token.
 */

const bcrypt = require('bcrypt');
const db = require('../config/db.js');
const { generateToken } = require('../utils/jwtUtils');
require('dotenv').config();
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Check for missing credentials
        if (username === undefined || username === "" || password === undefined || password === "") {
            return res.status(400).json({ message: 'Missing Credentials' });
        }

        // Query the database for the user
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        // Check if the user exists
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Wrong Password' });
        }

        // Generate a JWT token using the utility function
        const token = generateToken(user.id); // Generate token using the utility function
        return res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { login };